import { MonthlyBreakdown, WeeklyBreakdown, JournalType, ScheduleType } from "../types";
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

function isSameMonth(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() && 
         date1.getMonth() === date2.getMonth();
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
      // This case will be handled in the new weekly calculation function
      return 0;

    default:
      return 0;
  }
}

export function calculateJournal(input: JournalCalculationInput): JournalCalculationResult {
  const { scheduleType } = input;

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

  // Validate dates
  if (isSameMonth(expensePaidMonth, periodStartDate)) {
    return {
      type: expensePaidMonth <= periodStartDate ? "prepayment" : "accrual",
      monthlyBreakdown: [],
      error: "Expense paid month cannot be in the same month as the recognition start date"
    };
  }

  // Determine journal type based on dates
  const type: JournalType = expensePaidMonth <= periodStartDate ? "prepayment" : "accrual";

  // Get the paid month in YYYY-MM format
  const paidMonthStr = `${expensePaidMonth.getFullYear()}-${String(expensePaidMonth.getMonth() + 1).padStart(2, '0')}`;

  // Get monthly periods with day counts
  const periods = getMonthlyPeriods(periodStartDate, periodEndDate);

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
      periodStartDate,
      periodEndDate,
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

  // Validate dates
  if (isSameMonth(expensePaidMonth, periodStartDate)) {
    return {
      type: expensePaidMonth <= periodStartDate ? "prepayment" : "accrual",
      monthlyBreakdown: [],
      weeklyBreakdown: [],
      error: "Expense paid month cannot be in the same month as the recognition start date"
    };
  }

  // Determine journal type based on dates
  const type: JournalType = expensePaidMonth <= periodStartDate ? "prepayment" : "accrual";

  // Get the paid month in YYYY-MM format
  const paidMonthStr = `${expensePaidMonth.getFullYear()}-${String(expensePaidMonth.getMonth() + 1).padStart(2, '0')}`;

  // Get weekly periods
  const weeklyPeriods = getWeeklyPeriods(periodStartDate, periodEndDate);
  
  // Calculate total days in the recognition period
  const totalDays = getDaysInPeriod(periodStartDate, periodEndDate);
  
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