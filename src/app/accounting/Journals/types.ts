// Types for Journal entries
export type JournalType = "prepayment" | "accrual" | "stock";

export type JournalStatus = "draft" | "review" | "active" | "complete";

export type JournalSource = "bill" | "invoice" | "manual";

export type ScheduleType = 'monthly' | 'weekly';

export interface JournalDocument {
  id: string;
  type: JournalSource;
  reference: string;
  url: string;
  description: string;
}

export interface JournalLineItem {
  id: string;
  description: string;
  accountCode: string;
  debitAmount: number;
  creditAmount: number;
  store: string;
  taxRate: string;
  date: string;
}

export interface MonthlyBreakdown {
  id: string;
  month: string;  // Format: "YYYY-MM"
  status: 'published' | 'review' | 'archived';
  description?: string;
  lineItems: JournalLineItem[];
  prepayBalance: number;
  expenseBalance: number;
  amount: number;
  /**
   * Indicates this entry is the reversing journal entry created in the paid month.
   */
  isReversing?: boolean;
}

export interface WeeklyBreakdown {
  id: string;
  week: string;  // Format: "YYYY-MM-DD" (week start date)
  weekLabel: string;  // Format: "Week 1", "Week 2", etc.
  weekEndDate: string;  // Format: "YYYY-MM-DD"
  status: 'published' | 'review' | 'archived';
  description?: string;
  lineItems: JournalLineItem[];
  prepayBalance: number;
  expenseBalance: number;
  amount: number;
  /**
   * Indicates this entry is the reversing journal entry created in the paid month.
   */
  isReversing?: boolean;
}

export interface JournalEntry {
  id: string;
  type: "prepayment" | "accrual" | "stock";
  title: string;
  description: string;
  company: string;
  accountCode: string;
  monthlyAccountCode: string;
  stockAccountCode?: string;
  stockMovementAccountCode?: string;
  category: string;
  totalAmount: number;
  expensePaidMonth?: Date;
  periodStartDate?: Date;
  periodEndDate?: Date;
  openingStockDate?: Date;
  openingStockValue?: number;
  closingStockDate?: Date;
  closingStockValue?: number;
  store: string;
  status: "published" | "review" | "archived";
  createdDate: Date;
  sourceDocuments: {
    id: string;
    type: string;
    reference: string;
    url: string;
    description: string;
  }[];
  scheduleType?: ScheduleType;
  /**
   * Optional cached monthly breakdown (used by UI when editing in memory)
   */
  monthlyBreakdown?: MonthlyBreakdown[];
  /**
   * Optional cached weekly breakdown (used by UI when editing in memory)
   */
  weeklyBreakdown?: WeeklyBreakdown[];
  source: "bill" | "invoice" | "stock-entry";
}

export interface PrepaymentAccrualEntry {
  id: string;
  type: "prepayment" | "accrual";
  title: string;
  description: string;
  accountCode: string;
  monthlyAccountCode: string;  // Account code for monthly transfers
  supplier?: string;  // Supplier name
  category: string;
  totalAmount: number;
  startDate: Date;
  endDate: Date;
  monthlyBreakdown: MonthlyBreakdown[];
  sourceInvoiceId?: string;
  sourceInvoiceType?: "invoice" | "bill";
  store: string;
  status: "draft" | "review" | "active" | "complete";
  createdDate: Date;
} 