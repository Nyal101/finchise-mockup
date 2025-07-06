// Types for Journal entries
export type JournalType = "prepayment" | "accrual" | "stock-movement";

export type JournalStatus = "draft" | "review" | "active" | "complete";

export type JournalSource = "bill" | "invoice" | "stock" | "manual";

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
  status: "scheduled" | "posted";
  lineItems: JournalLineItem[];
}

export interface JournalEntry {
  id: string;
  type: JournalType;
  title: string;
  description: string;
  accountCode: string;
  monthlyAccountCode: string;
  category: string;
  totalAmount: number;
  startDate: Date;
  endDate: Date;
  store: string;
  toStore?: string; // Only for stock movements
  status: JournalStatus;
  createdDate: Date;
  source: JournalSource;
  sourceReference?: string;
  monthlyBreakdown: MonthlyBreakdown[];
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