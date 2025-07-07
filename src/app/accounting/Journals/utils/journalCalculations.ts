import { MonthlyBreakdown, JournalType, ScheduleType } from "../types";
import { startOfMonth, endOfMonth, eachMonthOfInterval, differenceInMonths } from "date-fns";

interface JournalCalculationInput {
  description: string;
  totalAmount: number;
  expensePaidMonth: Date;
  periodStartDate: Date;
  periodEndDate: Date;
  scheduleType: ScheduleType;
  accountCode: string;
  monthlyAccountCode: string;
}

interface MonthlyBreakdownWithBalances extends MonthlyBreakdown {
  prepayBalance: number;
  expenseBalance: number;
}

interface JournalCalculationResult {
  type: JournalType;
  monthlyBreakdown: MonthlyBreakdownWithBalances[];
  error?: string;
}

function isSameMonth(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() && 
         date1.getMonth() === date2.getMonth();
}

function getDaysInPeriod(start: Date, end: Date): number {
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
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
    case 'monthly & weekly':
      // Calculate based on days in period
      const totalDays = getDaysInPeriod(periodStartDate, periodEndDate);
      const amountPerDay = totalAmount / totalDays;
      return index === totalPeriods - 1
        ? totalAmount - runningTotal
        : Math.round(amountPerDay * period.days * 100) / 100;

    case 'monthly':
      // Split evenly across months
      const monthCount = differenceInMonths(periodEndDate, periodStartDate) + 1;
      const monthlyAmount = Math.round((totalAmount / monthCount) * 100) / 100;
      return index === totalPeriods - 1
        ? totalAmount - runningTotal
        : monthlyAmount;

    default:
      return 0;
  }
}

export function calculateJournal(input: JournalCalculationInput): JournalCalculationResult {
  const {
    description,
    totalAmount,
    expensePaidMonth,
    periodStartDate,
    periodEndDate,
    scheduleType,
    accountCode,
    monthlyAccountCode,
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

  // Get current month for status determination
  const currentDate = new Date();
  const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  
  // Get the paid month in YYYY-MM format
  const paidMonthStr = `${expensePaidMonth.getFullYear()}-${String(expensePaidMonth.getMonth() + 1).padStart(2, '0')}`;

  // Get monthly periods with day counts
  const periods = getMonthlyPeriods(periodStartDate, periodEndDate);

  // Create the monthly breakdown array
  const monthlyBreakdown: MonthlyBreakdownWithBalances[] = [];

  // 1. Add the reversing entry for paid month
  monthlyBreakdown.push({
    month: paidMonthStr,
    amount: totalAmount,
    status: paidMonthStr <= currentMonth ? 'posted' : 'scheduled',
    prepayBalance: totalAmount,
    expenseBalance: 0,
    lineItems: type === 'prepayment' ? [
      {
        id: `li_rev_pre_a_${paidMonthStr}`,
        accountCode: monthlyAccountCode,
        description: `Initial ${description}`,
        debitAmount: totalAmount,
        creditAmount: 0,
        store: 'all-stores',
        taxRate: 'no-tax'
      },
      {
        id: `li_rev_pre_b_${paidMonthStr}`,
        accountCode: accountCode,
        description: 'To Prepayment',
        debitAmount: 0,
        creditAmount: totalAmount,
        store: 'all-stores',
        taxRate: 'no-tax'
      }
    ] : [
      {
        id: `li_rev_accr_a_${paidMonthStr}`,
        accountCode: accountCode,
        description: `Initial ${description}`,
        debitAmount: totalAmount,
        creditAmount: 0,
        store: 'all-stores',
        taxRate: 'no-tax'
      },
      {
        id: `li_rev_accr_b_${paidMonthStr}`,
        accountCode: monthlyAccountCode,
        description: 'From Expense',
        debitAmount: 0,
        creditAmount: totalAmount,
        store: 'all-stores',
        taxRate: 'no-tax'
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

    const description_suffix = scheduleType === 'monthly & weekly' 
      ? ` (${period.days} days)`
      : '';

    monthlyBreakdown.push({
      month: period.month,
      amount,
      status: period.month <= currentMonth ? 'posted' : 'scheduled',
      prepayBalance: totalAmount - runningExpenseTotal,
      expenseBalance: runningExpenseTotal,
      lineItems: type === 'prepayment' ? [
        {
          id: `li_rec_pre_a_${period.month}`,
          accountCode: monthlyAccountCode,
          description: `Recognize ${description}${description_suffix}`,
          debitAmount: amount,
          creditAmount: 0,
          store: 'all-stores',
          taxRate: 'no-tax'
        },
        {
          id: `li_rec_pre_b_${period.month}`,
          accountCode: accountCode,
          description: 'Reduce Prepayment',
          debitAmount: 0,
          creditAmount: amount,
          store: 'all-stores',
          taxRate: 'no-tax'
        }
      ] : [
        {
          id: `li_rec_accr_a_${period.month}`,
          accountCode: monthlyAccountCode,
          description: `Recognize ${description}${description_suffix}`,
          debitAmount: amount,
          creditAmount: 0,
          store: 'all-stores',
          taxRate: 'no-tax'
        },
        {
          id: `li_rec_accr_b_${period.month}`,
          accountCode: accountCode,
          description: 'Reduce Accrual',
          debitAmount: 0,
          creditAmount: amount,
          store: 'all-stores',
          taxRate: 'no-tax'
        }
      ]
    });
  });

  return {
    type,
    monthlyBreakdown
  };
} 