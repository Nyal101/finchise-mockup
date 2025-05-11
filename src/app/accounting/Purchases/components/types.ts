// Define common types for invoice components

// Type for line items
export type LineItem = {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
  accountCode: string
}

// Type for store allocations
export type StoreAllocation = {
  id: string
  store: string
  percentage: number
  amount: number
}

// Interface for invoice data
export interface InvoiceData {
  id: string
  invoiceNumber: string
  store: string
  supplier: string
  date: Date
  subtotal: number
  vatRate: number
  vat: number
  total: number
  accountCode: string
  invoiceType: string
  status: string
  previewType?: string
  previewUrl?: string
  notes?: string
  archived?: boolean
  deleted?: boolean
  lineItems: LineItem[]
  storeAllocations?: StoreAllocation[]
} 