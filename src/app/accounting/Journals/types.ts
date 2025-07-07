// Types for Journal entries
export type JournalType = "prepayment" | "accrual";

export type JournalStatus = "draft" | "review" | "active" | "complete";

export type JournalSource = "bill" | "invoice" | "manual";

export type ScheduleType = "monthly & weekly" | "monthly";

export interface JournalLineItem {
  id: string;
  accountCode: string;
  description: string;
  debitAmount: number;
  creditAmount: number;
  store: string;
  taxRate: string; // e.g. "20% (VAT on Income)", "No Tax", etc.
}

export interface MonthlyBreakdown {
  month: string; // Format: "YYYY-MM"
  amount: number;
  status: "scheduled" | "posted" | string;
  lineItems: JournalLineItem[];
}

export type SourceDocument = {
  id: string;
  type: "bill" | "invoice" | "manual";
  reference: string;
  url: string;
  description: string;
};

export interface JournalEntry {
  id: string;
  type: 'prepayment' | 'accrual';
  title: string;
  description: string;
  accountCode: string;
  monthlyAccountCode: string;
  category: string;
  totalAmount: number;
  expensePaidMonth: Date; // New: month expense was paid
  periodStartDate: Date; // New: recognition period start
  periodEndDate: Date;   // New: recognition period end
  store: string;
  status: JournalStatus;
  createdDate: Date;
  sourceDocuments: SourceDocument[];
  scheduleType: ScheduleType;
  monthlyBreakdown?: MonthlyBreakdown[];
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