export interface SalesInvoiceData {
  id: string;
  invoiceNumber: string;
  store: string;
  source: string; // POS system
  date: Date;
  status: string;
  subtotal: number;
  vatRate: number;
  vat: number;
  total: number;
  paymentMethod: string;
  archived: boolean;
  deleted: boolean;
  lineItems: SalesLineItem[];
  requiresJournaling: boolean;
  journalEntries?: JournalEntry[];
  notes?: string;
  previewUrl?: string;
  storeAllocations?: StoreAllocation[];
}

export interface SalesLineItem {
  id: string;
  description: string;
  category: string;
  quantity: number;
  price: number;
  subtotal: number;
  vatRate: number;
  vat: number;
  total: number;
}

export interface JournalEntry {
  id: string;
  account: string;
  description: string;
  debit: number;
  credit: number;
}

export interface StoreAllocation {
  id: string;
  store: string;
  percentage: number;
  amount: number;
} 