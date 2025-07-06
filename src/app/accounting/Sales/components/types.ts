export interface SalesInvoiceData {
  id: string;
  invoiceNumber: string;
  company?: string;
  store: string;
  source: string; // POS system
  date: Date;
  dueDate?: Date;
  accountCode?: string;
  status: InvoiceStatus;
  subtotal: number;
  vatRate: number;
  vat: number;
  total: number;
  paymentMethod: string;
  archived: boolean;
  deleted: boolean;
  documentType?: "Invoice" | "Credit Note" | "Receipt" | "Bill";
  lineItems: SalesLineItem[];
  requiresJournaling: boolean;
  journalEntries?: JournalEntry[];
  notes?: string;
  previewUrl?: string;
  storeAllocations?: StoreAllocation[];
  // New fields for AI processing
  uploadedFile?: UploadedFile;
  uploadedFiles?: MultipleUploadedFiles;
  aiExtractedData?: AIExtractedData;
  reviewErrors?: ReviewError[];
  supplierInfo?: SupplierInfo;
  confidence?: number; // AI confidence score (0-100)
  lastProcessed?: Date;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: 'pdf' | 'csv' | 'image';
  url: string;
  size: number;
  uploadDate: Date;
  uploadSource?: 'Email' | 'WhatsApp' | 'Manual Upload';
}

export interface MultipleUploadedFiles {
  primary: UploadedFile;
  secondary?: UploadedFile;
  type: 'single' | 'paired';
}

export interface AIExtractedData {
  invoiceNumber?: string;
  supplier?: string;
  supplierAddress?: string;
  invoiceDate?: Date;
  dueDate?: Date;
  totalAmount?: number;
  subtotalAmount?: number;
  vatAmount?: number;
  currency?: string;
  accountCode?: string;
  storeLocation?: string;
  lineItems?: ExtractedLineItem[];
  paymentTerms?: string;
  reference?: string;
}

export interface ExtractedLineItem {
  description: string;
  quantity?: number;
  unitPrice?: number;
  totalPrice: number;
  accountCode?: string;
  taxRate?: number;
}

export interface ReviewError {
  id: string;
  type: 'new_supplier' | 'unknown_supplier' | 'unknown_store' | 'unknown_account_code' | 'incomplete_address' | 'missing_data' | 'validation_error' | 'duplicate_invoice';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  suggestedAction?: string;
  fieldPath?: string; // Path to the problematic field
  confidence?: number;
}

export interface SupplierInfo {
  id?: string;
  name: string;
  address?: string;
  taxId?: string;
  accountCode?: string;
  paymentTerms?: string;
  isNew?: boolean;
  confidence?: number;
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
  trackingCategory?: string;
  accountCode?: string;
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

export type InvoiceStatus = "Processing" | "Processed" | "Published" | "Review"; 