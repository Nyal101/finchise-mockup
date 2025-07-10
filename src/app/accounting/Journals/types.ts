// Types for Journal entries
export type JournalType = "prepayment" | "accrual" | "stock";

export type JournalStatus = "draft" | "review" | "active" | "complete";

export type JournalSource = "bill" | "invoice" | "manual";

export type ScheduleType = 'monthly (weekly split)' | 'monthly (equal split)';

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
}

export interface JournalEntry {
  id: string;
  type: JournalType;
  title: string;
  description: string;
  company: string;
  accountCode: string;
  monthlyAccountCode: string;
  category: string;
  totalAmount: number;
  expensePaidMonth?: Date; // Optional for stock journals
  periodStartDate?: Date; // Optional for stock journals
  periodEndDate?: Date;   // Optional for stock journals
  store: string;
  status: 'published' | 'review' | 'archived';
  createdDate: Date;
  sourceDocuments: JournalDocument[];
  scheduleType?: ScheduleType; // Optional for stock journals
  monthlyBreakdown?: MonthlyBreakdown[];
  
  // Stock-specific fields
  openingStockDate?: Date;
  openingStockValue?: number;
  closingStockDate?: Date;
  closingStockValue?: number;
  stockMovementAccountCode?: string;
  stockAccountCode?: string;
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