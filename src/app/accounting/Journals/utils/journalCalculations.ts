import { MonthlyBreakdown, WeeklyBreakdown, JournalType, ScheduleType, StoreAllocation } from "../types";
import { startOfMonth, endOfMonth, eachMonthOfInterval, eachWeekOfInterval, isSameMonth } from "date-fns";

interface JournalCalculationInput {
  description: string;
  totalAmount: number;
  expensePaidMonth: Date;
  periodStartDate: Date;
  periodEndDate: Date;
  scheduleType: ScheduleType;
  accountCode: string;
  monthlyAccountCode: string;
  store: string;
  status: 'published' | 'review' | 'archived';  // Updated status types
  storeAllocations?: StoreAllocation[];  // New optional field for multi-store support
}

interface MonthlyBreakdownWithBalances extends MonthlyBreakdown {
  prepayBalance: number;
  expenseBalance: number;
}

interface JournalCalculationResult {
  type: JournalType;
  monthlyBreakdown: MonthlyBreakdownWithBalances[];
  weeklyBreakdown?: WeeklyBreakdownWithBalances[];
  error?: string;
}

interface WeeklyBreakdownWithBalances extends WeeklyBreakdown {
  prepayBalance: number;
  expenseBalance: number;
}

function getDaysInPeriod(start: Date, end: Date): number {
  // Calculate the number of days between start and end (inclusive)
  const diffInMs = end.getTime() - start.getTime();
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  
  // Round to handle time zone differences, then add 1 to include both start and end dates
  return Math.round(diffInDays) + 1;
}

function getMonthlyPeriods(start: Date, end: Date): { month: string; startDate: Date; endDate: Date; days: number }[] {
  // Get all months in the period
  const months = eachMonthOfInterval({ start, end });
  
  return months.map((month, index) => {
    let monthStart = startOfMonth(month);
    let monthEnd = endOfMonth(month);

    // For first month, use actual start date if later than month start
    if (index === 0 && start > monthStart) {
      monthStart = start;
    }

    // For last month, use actual end date if earlier than month end
    if (index === months.length - 1 && end < monthEnd) {
      monthEnd = end;
    }

    const days = getDaysInPeriod(monthStart, monthEnd);
    return {
      month: `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`,
      startDate: monthStart,
      endDate: monthEnd,
      days
    };
  });
}

function calculateAmountForPeriod(
  totalAmount: number, 
  period: { month: string; startDate: Date; endDate: Date; days: number },
  scheduleType: ScheduleType,
  periodStartDate: Date,
  periodEndDate: Date,
  index: number,
  totalPeriods: number,
  runningTotal: number
): number {
  switch (scheduleType) {
    case 'monthly':
      // Split evenly across months based on days in each month
      const totalDays = getDaysInPeriod(periodStartDate, periodEndDate);
      const amountPerDay = totalAmount / totalDays;
      return index === totalPeriods - 1
        ? totalAmount - runningTotal
        : Math.round(amountPerDay * period.days * 100) / 100;

    case 'weekly':
      // Split evenly across weeks based on days in each week
      const totalWeekDays = getDaysInPeriod(periodStartDate, periodEndDate);
      const amountPerWeekDay = totalAmount / totalWeekDays;
      return index === totalPeriods - 1
        ? totalAmount - runningTotal
        : Math.round(amountPerWeekDay * period.days * 100) / 100;

    default:
      return 0;
  }
}

export function calculateJournal(input: JournalCalculationInput): JournalCalculationResult {
  const { scheduleType, storeAllocations } = input;

  // If storeAllocations are provided, process each allocation separately and combine results
  if (storeAllocations && storeAllocations.length > 0) {
    return calculateMultiStoreJournal(input);
  }

  // Route to appropriate calculation function based on schedule type
  switch (scheduleType) {
    case 'monthly':
      return calculateMonthlyJournal(input);
    case 'weekly':
      return calculateWeeklyJournal(input);
    default:
      return {
        type: 'prepayment',
        monthlyBreakdown: [],
        error: `Unknown schedule type: ${scheduleType}`
      };
  }
}

function calculateMultiStoreJournal(input: JournalCalculationInput): JournalCalculationResult {
  const { storeAllocations, scheduleType } = input;

  if (!storeAllocations || storeAllocations.length === 0) {
    return {
      type: 'prepayment',
      monthlyBreakdown: [],
      error: 'No store allocations provided'
    };
  }

  // Determine journal type by checking all allocations
  let hasPrepayment = false;
  let hasAccrual = false;

  for (const allocation of storeAllocations) {
    // Validate dates before comparison
    if (!allocation.expensePaidMonth || !allocation.periodStartDate || !allocation.periodEndDate) {
      console.warn('Invalid dates in store allocation:', allocation);
      continue; // Skip this allocation if dates are invalid
    }

    // Ensure dates are Date objects
    const expensePaidMonth = allocation.expensePaidMonth instanceof Date 
      ? allocation.expensePaidMonth 
      : new Date(allocation.expensePaidMonth);
    const periodStartDate = allocation.periodStartDate instanceof Date 
      ? allocation.periodStartDate 
      : new Date(allocation.periodStartDate);
    const periodEndDate = allocation.periodEndDate instanceof Date 
      ? allocation.periodEndDate 
      : new Date(allocation.periodEndDate);

    // Validate that dates are valid
    if (isNaN(expensePaidMonth.getTime()) || isNaN(periodStartDate.getTime()) || isNaN(periodEndDate.getTime())) {
      console.warn('Invalid date values in store allocation:', allocation);
      continue; // Skip this allocation if dates are invalid
    }

    const isPrepayment = expensePaidMonth < periodStartDate;
    const isAccrual = expensePaidMonth > periodEndDate;
    
    if (isPrepayment || (!isPrepayment && !isAccrual)) {
      // Either clear prepayment or paid during period (treated as prepayment by midpoint rule)
      const periodMidpoint = new Date((periodStartDate.getTime() + periodEndDate.getTime()) / 2);
      if (isPrepayment || expensePaidMonth <= periodMidpoint) {
        hasPrepayment = true;
      } else {
        hasAccrual = true;
      }
    } else {
      hasAccrual = true;
    }
  }

  // Determine final journal type
  let type: JournalType;
  if (hasPrepayment && hasAccrual) {
    type = "mixed";
  } else if (hasPrepayment) {
    type = "prepayment";
  } else {
    type = "accrual";
  }

  // Process each store allocation separately
  const allResults: JournalCalculationResult[] = [];
  
  for (const allocation of storeAllocations) {
    // Validate allocation before processing
    if (!allocation.expensePaidMonth || !allocation.periodStartDate || !allocation.periodEndDate) {
      console.warn('Skipping invalid allocation:', allocation);
      continue; // Skip invalid allocations
    }

    // Ensure dates are Date objects
    const expensePaidMonth = allocation.expensePaidMonth instanceof Date 
      ? allocation.expensePaidMonth 
      : new Date(allocation.expensePaidMonth);
    const periodStartDate = allocation.periodStartDate instanceof Date 
      ? allocation.periodStartDate 
      : new Date(allocation.periodStartDate);
    const periodEndDate = allocation.periodEndDate instanceof Date 
      ? allocation.periodEndDate 
      : new Date(allocation.periodEndDate);

    // Validate that dates are valid
    if (isNaN(expensePaidMonth.getTime()) || isNaN(periodStartDate.getTime()) || isNaN(periodEndDate.getTime())) {
      console.warn('Skipping allocation with invalid dates:', allocation);
      continue; // Skip invalid allocations
    }

    const allocationInput: JournalCalculationInput = {
      ...input,
      totalAmount: allocation.totalAmount,
      expensePaidMonth,
      periodStartDate,
      periodEndDate,
      store: allocation.store,
      accountCode: allocation.accountCode,
      monthlyAccountCode: allocation.monthlyAccountCode,
      storeAllocations: undefined // Clear to avoid infinite recursion
    };

    const result = calculateJournal(allocationInput);
    if (result.error) {
      return {
        type,
        monthlyBreakdown: [],
        weeklyBreakdown: [],
        error: `Error in ${allocation.store} allocation: ${result.error}`
      };
    }
    allResults.push(result);
  }

  // If no valid results, return empty breakdown
  if (allResults.length === 0) {
    return {
      type,
      monthlyBreakdown: [],
      weeklyBreakdown: []
    };
  }

  // Combine results from all allocations
  return combineJournalResults(allResults, scheduleType);
}

function combineJournalResults(results: JournalCalculationResult[], scheduleType: ScheduleType): JournalCalculationResult {
  if (results.length === 0) {
    return {
      type: 'prepayment',
      monthlyBreakdown: [],
      weeklyBreakdown: []
    };
  }

  const type = results[0].type;
  const combinedMonthlyBreakdown: MonthlyBreakdownWithBalances[] = [];
  const combinedWeeklyBreakdown: WeeklyBreakdownWithBalances[] = [];

  if (scheduleType === 'monthly') {
    // Group monthly breakdowns by month
    const monthlyGroups = new Map<string, MonthlyBreakdownWithBalances[]>();
    
    for (const result of results) {
      for (const breakdown of result.monthlyBreakdown) {
        if (!monthlyGroups.has(breakdown.month)) {
          monthlyGroups.set(breakdown.month, []);
        }
        monthlyGroups.get(breakdown.month)!.push(breakdown);
      }
    }

    // Combine breakdowns for each month
    for (const [month, breakdowns] of monthlyGroups) {
      const combined = combineMonthlyBreakdowns(breakdowns, month);
      combinedMonthlyBreakdown.push(combined);
    }
  } else if (scheduleType === 'weekly') {
    // Group weekly breakdowns by week
    const weeklyGroups = new Map<string, WeeklyBreakdownWithBalances[]>();
    
    for (const result of results) {
      if (result.weeklyBreakdown) {
        for (const breakdown of result.weeklyBreakdown) {
          if (!weeklyGroups.has(breakdown.week)) {
            weeklyGroups.set(breakdown.week, []);
          }
          weeklyGroups.get(breakdown.week)!.push(breakdown);
        }
      }
    }

    // Combine breakdowns for each week
    for (const [week, breakdowns] of weeklyGroups) {
      const combined = combineWeeklyBreakdowns(breakdowns, week);
      combinedWeeklyBreakdown.push(combined);
    }
  }

  return {
    type,
    monthlyBreakdown: combinedMonthlyBreakdown,
    weeklyBreakdown: combinedWeeklyBreakdown
  };
}

function combineMonthlyBreakdowns(breakdowns: MonthlyBreakdownWithBalances[], month: string): MonthlyBreakdownWithBalances {
  const firstBreakdown = breakdowns[0];
  const combinedLineItems = breakdowns.flatMap(b => b.lineItems);
  
  // Calculate combined totals
  const totalAmount = breakdowns.reduce((sum, b) => sum + b.amount, 0);
  const totalPrepayBalance = breakdowns.reduce((sum, b) => sum + b.prepayBalance, 0);
  const totalExpenseBalance = breakdowns.reduce((sum, b) => sum + b.expenseBalance, 0);
  
  // Create combined description
  const storeNames = breakdowns.map(b => b.lineItems[0]?.store).filter(Boolean);
  const uniqueStores = [...new Set(storeNames)];
  const combinedDescription = uniqueStores.length > 1 
    ? `Multi-store: ${uniqueStores.join(', ')}`
    : firstBreakdown.description;

  return {
    id: `combined_${month}`,
    month,
    amount: totalAmount,
    status: firstBreakdown.status,
    isReversing: firstBreakdown.isReversing,
    prepayBalance: totalPrepayBalance,
    expenseBalance: totalExpenseBalance,
    description: combinedDescription,
    lineItems: combinedLineItems
  };
}

function combineWeeklyBreakdowns(breakdowns: WeeklyBreakdownWithBalances[], week: string): WeeklyBreakdownWithBalances {
  const firstBreakdown = breakdowns[0];
  const combinedLineItems = breakdowns.flatMap(b => b.lineItems);
  
  // Calculate combined totals
  const totalAmount = breakdowns.reduce((sum, b) => sum + b.amount, 0);
  const totalPrepayBalance = breakdowns.reduce((sum, b) => sum + b.prepayBalance, 0);
  const totalExpenseBalance = breakdowns.reduce((sum, b) => sum + b.expenseBalance, 0);
  
  // Create combined description
  const storeNames = breakdowns.map(b => b.lineItems[0]?.store).filter(Boolean);
  const uniqueStores = [...new Set(storeNames)];
  const combinedDescription = uniqueStores.length > 1 
    ? `Multi-store: ${uniqueStores.join(', ')}`
    : firstBreakdown.description;

  return {
    id: `combined_${week}`,
    week,
    weekLabel: firstBreakdown.weekLabel,
    weekEndDate: firstBreakdown.weekEndDate,
    amount: totalAmount,
    status: firstBreakdown.status,
    isReversing: firstBreakdown.isReversing,
    prepayBalance: totalPrepayBalance,
    expenseBalance: totalExpenseBalance,
    description: combinedDescription,
    lineItems: combinedLineItems
  };
}

function calculateMonthlyJournal(input: JournalCalculationInput): JournalCalculationResult {
  const {
    description,
    totalAmount,
    expensePaidMonth,
    periodStartDate,
    periodEndDate,
    scheduleType,
    accountCode,
    monthlyAccountCode,
    store,
    status,
  } = input;

  // Validate that dates exist and are valid
  if (!expensePaidMonth || !periodStartDate || !periodEndDate) {
    return {
      type: 'prepayment',
      monthlyBreakdown: [],
      error: "Missing required dates for journal calculation"
    };
  }

  // Ensure dates are Date objects
  const validExpensePaidMonth = expensePaidMonth instanceof Date ? expensePaidMonth : new Date(expensePaidMonth);
  const validPeriodStartDate = periodStartDate instanceof Date ? periodStartDate : new Date(periodStartDate);
  const validPeriodEndDate = periodEndDate instanceof Date ? periodEndDate : new Date(periodEndDate);

  // Validate that dates are valid
  if (isNaN(validExpensePaidMonth.getTime()) || isNaN(validPeriodStartDate.getTime()) || isNaN(validPeriodEndDate.getTime())) {
    return {
      type: 'prepayment',
      monthlyBreakdown: [],
      error: "Invalid date values provided for journal calculation"
    };
  }

  // More lenient validation - only error if dates are exactly the same day
  if (validExpensePaidMonth.getTime() === validPeriodStartDate.getTime()) {
    return {
      type: validExpensePaidMonth <= validPeriodStartDate ? "prepayment" : "accrual",
      monthlyBreakdown: [],
      error: "Expense paid date cannot be the same as the recognition start date"
    };
  }

  // Determine journal type based on dates
  const type: JournalType = validExpensePaidMonth <= validPeriodStartDate ? "prepayment" : "accrual";

  // Get the paid month in YYYY-MM format
  const paidMonthStr = `${validExpensePaidMonth.getFullYear()}-${String(validExpensePaidMonth.getMonth() + 1).padStart(2, '0')}`;

  // Get monthly periods with day counts
  const periods = getMonthlyPeriods(validPeriodStartDate, validPeriodEndDate);

  // Create the monthly breakdown array
  const monthlyBreakdown: MonthlyBreakdownWithBalances[] = [];

  // 1. Add the reversing entry for paid month
  monthlyBreakdown.push({
    id: `mb_${paidMonthStr}`,
    month: paidMonthStr,
    amount: totalAmount,
    status: status, // Use journal's status
    isReversing: true,
    prepayBalance: totalAmount,
    expenseBalance: 0,
    lineItems: type === 'prepayment' ? [
      {
        id: `li_rev_pre_a_${paidMonthStr}`,
        accountCode: accountCode, // Prepayment account
        description: `Initial ${description}`,
        debitAmount: totalAmount,
        creditAmount: 0,
        store: store,
        taxRate: 'no-tax',
        date: paidMonthStr
      },
      {
        id: `li_rev_pre_b_${paidMonthStr}`,
        accountCode: monthlyAccountCode, // Transfer account
        description: 'To Prepayment',
        debitAmount: 0,
        creditAmount: totalAmount,
        store: store,
        taxRate: 'no-tax',
        date: paidMonthStr
      }
    ] : [
      {
        id: `li_rev_accr_a_${paidMonthStr}`,
        accountCode: accountCode,
        description: `Initial ${description}`,
        debitAmount: totalAmount,
        creditAmount: 0,
        store: store,
        taxRate: 'no-tax',
        date: paidMonthStr
      },
      {
        id: `li_rev_accr_b_${paidMonthStr}`,
        accountCode: monthlyAccountCode,
        description: 'From Expense',
        debitAmount: 0,
        creditAmount: totalAmount,
        store: store,
        taxRate: 'no-tax',
        date: paidMonthStr
      }
    ]
  });

  // 2. Add recognition entries for each period
  let runningExpenseTotal = 0;
  periods.forEach((period, i) => {
    // Calculate amount based on schedule type
    const amount = calculateAmountForPeriod(
      totalAmount,
      period,
      scheduleType,
      validPeriodStartDate,
      validPeriodEndDate,
      i,
      periods.length,
      runningExpenseTotal
    );

    // Update running totals
    runningExpenseTotal += amount;

    const description_suffix = scheduleType === 'monthly' 
      ? ` (${period.days} days)`
      : '';

    monthlyBreakdown.push({
      id: `mb_${period.month}`,
      month: period.month,
      amount,
      status: status, // Use journal's status for all entries
      isReversing: false,
      prepayBalance: totalAmount - runningExpenseTotal,
      expenseBalance: runningExpenseTotal,
      lineItems: type === 'prepayment' ? [
        {
          id: `li_rec_pre_a_${period.month}`,
          accountCode: monthlyAccountCode,
          description: `Recognize ${description}${description_suffix}`,
          debitAmount: amount,
          creditAmount: 0,
          store: store,
          taxRate: 'no-tax',
          date: period.month
        },
        {
          id: `li_rec_pre_b_${period.month}`,
          accountCode: accountCode,
          description: 'Reduce Prepayment',
          debitAmount: 0,
          creditAmount: amount,
          store: store,
          taxRate: 'no-tax',
          date: period.month
        }
      ] : [
        {
          id: `li_rec_accr_a_${period.month}`,
          accountCode: monthlyAccountCode,
          description: `Recognize ${description}${description_suffix}`,
          debitAmount: amount,
          creditAmount: 0,
          store: store,
          taxRate: 'no-tax',
          date: period.month
        },
        {
          id: `li_rec_accr_b_${period.month}`,
          accountCode: accountCode,
          description: 'Reduce Accrual',
          debitAmount: 0,
          creditAmount: amount,
          store: store,
          taxRate: 'no-tax',
          date: period.month
        }
      ]
    });
  });

  return {
    type,
    monthlyBreakdown
  };
}

function getWeeklyPeriods(start: Date, end: Date): { startDate: Date; endDate: Date; days: number }[] {
  // Get all Monday-Sunday weeks in the period
  const weeks = eachWeekOfInterval(
    { start, end },
    { weekStartsOn: 1 } // Monday = 1
  );
  
  return weeks.map((weekStart) => {
    // Calculate week end as 6 days after week start (for a 7-day week)
    const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
    
    // Clamp to actual start/end dates
    const actualStart = weekStart < start ? start : weekStart;
    const actualEnd = weekEnd > end ? end : weekEnd;
    
    const days = getDaysInPeriod(actualStart, actualEnd);
    
    return {
      startDate: actualStart,
      endDate: actualEnd,
      days
    };
  });
}

function splitWeekAcrossMonths(weekStart: Date, weekEnd: Date, dailyRate: number, weekIndex: number): {
  startDate: Date;
  endDate: Date;
  amount: number;
  days: number;
  weekLabel: string;
  isPartA: boolean;
}[] {
  const result: {
    startDate: Date;
    endDate: Date;
    amount: number;
    days: number;
    weekLabel: string;
    isPartA: boolean;
  }[] = [];
  
  // Check if week spans multiple months
  if (isSameMonth(weekStart, weekEnd)) {
    // Week is entirely within one month
    const days = getDaysInPeriod(weekStart, weekEnd);
    const amount = Math.round(dailyRate * days * 100) / 100;
    
    result.push({
      startDate: weekStart,
      endDate: weekEnd,
      amount,
      days,
      weekLabel: `Week ${weekIndex + 1}`,
      isPartA: false
    });
  } else {
    // Week spans multiple months - split it
    const firstMonthEnd = endOfMonth(weekStart);
    const secondMonthStart = startOfMonth(weekEnd);
    
    // First month portion
    const firstMonthDays = getDaysInPeriod(weekStart, firstMonthEnd);
    const firstMonthAmount = Math.round(dailyRate * firstMonthDays * 100) / 100;
    
    // Second month portion
    const secondMonthDays = getDaysInPeriod(secondMonthStart, weekEnd);
    const secondMonthAmount = Math.round(dailyRate * secondMonthDays * 100) / 100;
    
    result.push({
      startDate: weekStart,
      endDate: firstMonthEnd,
      amount: firstMonthAmount,
      days: firstMonthDays,
      weekLabel: `Week ${weekIndex + 1}A`,
      isPartA: true
    });
    
    result.push({
      startDate: secondMonthStart,
      endDate: weekEnd,
      amount: secondMonthAmount,
      days: secondMonthDays,
      weekLabel: `Week ${weekIndex + 1}B`,
      isPartA: false
    });
  }
  
  return result;
}


function calculateWeeklyJournal(input: JournalCalculationInput): JournalCalculationResult {
  const {
    description,
    totalAmount,
    expensePaidMonth,
    periodStartDate,
    periodEndDate,
    accountCode,
    monthlyAccountCode,
    store,
    status,
  } = input;

  // Validate that dates exist and are valid
  if (!expensePaidMonth || !periodStartDate || !periodEndDate) {
    return {
      type: 'prepayment',
      monthlyBreakdown: [],
      weeklyBreakdown: [],
      error: "Missing required dates for journal calculation"
    };
  }

  // Ensure dates are Date objects
  const validExpensePaidMonth = expensePaidMonth instanceof Date ? expensePaidMonth : new Date(expensePaidMonth);
  const validPeriodStartDate = periodStartDate instanceof Date ? periodStartDate : new Date(periodStartDate);
  const validPeriodEndDate = periodEndDate instanceof Date ? periodEndDate : new Date(periodEndDate);

  // Validate that dates are valid
  if (isNaN(validExpensePaidMonth.getTime()) || isNaN(validPeriodStartDate.getTime()) || isNaN(validPeriodEndDate.getTime())) {
    return {
      type: 'prepayment',
      monthlyBreakdown: [],
      weeklyBreakdown: [],
      error: "Invalid date values provided for journal calculation"
    };
  }

  // More lenient validation - only error if dates are exactly the same day
  if (validExpensePaidMonth.getTime() === validPeriodStartDate.getTime()) {
    return {
      type: validExpensePaidMonth <= validPeriodStartDate ? "prepayment" : "accrual",
      monthlyBreakdown: [],
      weeklyBreakdown: [],
      error: "Expense paid date cannot be the same as the recognition start date"
    };
  }

  // Determine journal type based on dates
  const type: JournalType = validExpensePaidMonth <= validPeriodStartDate ? "prepayment" : "accrual";

  // Get the paid month in YYYY-MM format
  const paidMonthStr = `${validExpensePaidMonth.getFullYear()}-${String(validExpensePaidMonth.getMonth() + 1).padStart(2, '0')}`;

  // Get weekly periods
  const weeklyPeriods = getWeeklyPeriods(validPeriodStartDate, validPeriodEndDate);
  
  // Calculate total days in the recognition period
  const totalDays = getDaysInPeriod(validPeriodStartDate, validPeriodEndDate);
  
  // Calculate daily rate
  const dailyRate = totalAmount / totalDays;
  
  // Create the monthly breakdown array (empty for weekly schedules)
  const monthlyBreakdown: MonthlyBreakdownWithBalances[] = [];
  
  // Create the weekly breakdown array
  const weeklyBreakdown: WeeklyBreakdownWithBalances[] = [];

  // 1. Add the reversing entry for paid month to weekly breakdown
  weeklyBreakdown.push({
    id: `wb_${paidMonthStr}`,
    week: paidMonthStr,
    weekLabel: 'Initial Entry',
    weekEndDate: paidMonthStr,
    amount: totalAmount,
    status: status,
    isReversing: true,
    prepayBalance: totalAmount,
    expenseBalance: 0,
    description: `Initial ${description}`,
    lineItems: type === 'prepayment' ? [
      {
        id: `li_rev_pre_a_${paidMonthStr}`,
        accountCode: accountCode,
        description: `Initial ${description}`,
        debitAmount: totalAmount,
        creditAmount: 0,
        store: store,
        taxRate: 'no-tax',
        date: paidMonthStr
      },
      {
        id: `li_rev_pre_b_${paidMonthStr}`,
        accountCode: monthlyAccountCode,
        description: 'To Prepayment',
        debitAmount: 0,
        creditAmount: totalAmount,
        store: store,
        taxRate: 'no-tax',
        date: paidMonthStr
      }
    ] : [
      {
        id: `li_rev_accr_a_${paidMonthStr}`,
        accountCode: accountCode,
        description: `Initial ${description}`,
        debitAmount: totalAmount,
        creditAmount: 0,
        store: store,
        taxRate: 'no-tax',
        date: paidMonthStr
      },
      {
        id: `li_rev_accr_b_${paidMonthStr}`,
        accountCode: monthlyAccountCode,
        description: 'From Expense',
        debitAmount: 0,
        creditAmount: totalAmount,
        store: store,
        taxRate: 'no-tax',
        date: paidMonthStr
      }
    ]
  });

  // 2. Process each week and create separate weekly breakdown entries
  let runningExpenseTotal = 0;
  let totalCalculatedAmount = 0;
  
  weeklyPeriods.forEach((week, weekIndex) => {
    // Split the week across months if necessary
    const weekParts = splitWeekAcrossMonths(week.startDate, week.endDate, dailyRate, weekIndex);
    
    weekParts.forEach((part, partIndex) => {
      let actualAmount = part.amount;
      
      // For the very last part of the very last week, adjust to ensure exact total
      if (weekIndex === weeklyPeriods.length - 1 && partIndex === weekParts.length - 1) {
        actualAmount = totalAmount - totalCalculatedAmount;
      }
      
      runningExpenseTotal += actualAmount;
      totalCalculatedAmount += actualAmount;
      
      // Format dates for the week part
      const weekStartStr = `${part.startDate.getFullYear()}-${String(part.startDate.getMonth() + 1).padStart(2, '0')}-${String(part.startDate.getDate()).padStart(2, '0')}`;
      const weekEndStr = `${part.endDate.getFullYear()}-${String(part.endDate.getMonth() + 1).padStart(2, '0')}-${String(part.endDate.getDate()).padStart(2, '0')}`;
      
      const dateRange = `${part.startDate.getDate()}/${part.startDate.getMonth() + 1}-${part.endDate.getDate()}/${part.endDate.getMonth() + 1}`;
      
      // Create weekly breakdown entry
      const weeklyEntry: WeeklyBreakdownWithBalances = {
        id: `wb_${weekStartStr}_${partIndex}`,
        week: weekStartStr,
        weekLabel: part.weekLabel,
        weekEndDate: weekEndStr,
        amount: actualAmount,
        status: status,
        isReversing: false,
        prepayBalance: totalAmount - runningExpenseTotal,
        expenseBalance: runningExpenseTotal,
        description: `${description} - ${part.weekLabel} (${dateRange}) - ${part.days} days`,
        lineItems: type === 'prepayment' ? [
          {
            id: `li_rec_pre_a_${weekStartStr}_${partIndex}`,
            accountCode: monthlyAccountCode,
            description: `Recognize ${description} - ${part.weekLabel} (${dateRange}) - ${part.days} days`,
            debitAmount: actualAmount,
            creditAmount: 0,
            store: store,
            taxRate: 'no-tax',
            date: weekStartStr
          },
          {
            id: `li_rec_pre_b_${weekStartStr}_${partIndex}`,
            accountCode: accountCode,
            description: 'Reduce Prepayment',
            debitAmount: 0,
            creditAmount: actualAmount,
            store: store,
            taxRate: 'no-tax',
            date: weekStartStr
          }
        ] : [
          {
            id: `li_rec_accr_a_${weekStartStr}_${partIndex}`,
            accountCode: monthlyAccountCode,
            description: `Recognize ${description} - ${part.weekLabel} (${dateRange}) - ${part.days} days`,
            debitAmount: actualAmount,
            creditAmount: 0,
            store: store,
            taxRate: 'no-tax',
            date: weekStartStr
          },
          {
            id: `li_rec_accr_b_${weekStartStr}_${partIndex}`,
            accountCode: accountCode,
            description: 'Reduce Accrual',
            debitAmount: 0,
            creditAmount: actualAmount,
            store: store,
            taxRate: 'no-tax',
            date: weekStartStr
          }
        ]
      };
      
      weeklyBreakdown.push(weeklyEntry);
    });
  });

  return {
    type,
    monthlyBreakdown,
    weeklyBreakdown
  };
}

interface StockJournalInput {
  description: string;
  openingStockDate: Date;
  openingStockValue: number;
  closingStockDate: Date;
  closingStockValue: number;
  stockMovementAccountCode: string;
  stockAccountCode: string;
  store: string;
  status: 'published' | 'review' | 'archived';
}

export function calculateStockJournal(input: StockJournalInput): JournalCalculationResult {
  const {
    description,
    openingStockValue,
    closingStockDate,
    closingStockValue,
    stockMovementAccountCode, // This will be 5050
    stockAccountCode,        // This will be 1001
    store,
    status,
  } = input;

  const stockMovement = closingStockValue - openingStockValue;
  const movementAmount = Math.abs(stockMovement);

  // Format the closing date for the journal entry
  const closingMonth = `${closingStockDate.getFullYear()}-${String(closingStockDate.getMonth() + 1).padStart(2, '0')}`;

  const monthlyBreakdown: MonthlyBreakdownWithBalances[] = [{
    id: `mb_stock_${closingMonth}`,
    month: closingMonth,
    amount: movementAmount,
    status: status,
    prepayBalance: 0,
    expenseBalance: 0,
    lineItems: stockMovement < 0 ? [
      // Stock Decrease (negative difference)
      {
        id: `li_stock_dec_a_${closingMonth}`,
        accountCode: stockMovementAccountCode, // 5050
        description: `Stock Movement - ${description}`,
        debitAmount: movementAmount,
        creditAmount: 0,
        store: store,
        taxRate: 'no-tax',
        date: closingMonth
      },
      {
        id: `li_stock_dec_b_${closingMonth}`,
        accountCode: stockAccountCode, // 1001
        description: `Stock Decrease - ${description}`,
        debitAmount: 0,
        creditAmount: movementAmount,
        store: store,
        taxRate: 'no-tax',
        date: closingMonth
      }
    ] : [
      // Stock Increase (positive difference)
      {
        id: `li_stock_inc_a_${closingMonth}`,
        accountCode: stockAccountCode, // 1001
        description: `Stock Increase - ${description}`,
        debitAmount: movementAmount,
        creditAmount: 0,
        store: store,
        taxRate: 'no-tax',
        date: closingMonth
      },
      {
        id: `li_stock_inc_b_${closingMonth}`,
        accountCode: stockMovementAccountCode, // 5050
        description: `Stock Movement - ${description}`,
        debitAmount: 0,
        creditAmount: movementAmount,
        store: store,
        taxRate: 'no-tax',
        date: closingMonth
      }
    ]
  }];

  return {
    type: 'stock',
    monthlyBreakdown
  };
}