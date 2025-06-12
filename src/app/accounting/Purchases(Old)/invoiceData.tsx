import { v4 } from "uuid"
import type { InvoiceData, JournalEntry } from "./components/types"

// After already-mapped invoices, sequentially assign these PDF filenames to the next unmapped invoices:
export const pdfFilenames: string[] = [
  "1st_Waste_Management_2024-10-...Credit Memo).pdf",
  "CustAccountStatementExt.Report....pdf",
  "CustAccountStatementExt.Report....pdf",
  "KeyIndicatorsStoreDhillon - Novem....pdf",
  "Text_Management_2024-10-08_28....pdf",
  "Verlingue_2024-10-09_42693.99.pdf"
]

let pdfIndex = 0

// Sample journal entries for utility bills
const utilityJournalEntries: JournalEntry[] = [
  {
    id: v4(),
    account: "6400-UTIL",
    description: "Utility Expense",
    debit: 454.32,
    credit: 0
  },
  {
    id: v4(),
    account: "2200-VAT",
    description: "VAT Input",
    debit: 113.58,
    credit: 0
  },
  {
    id: v4(),
    account: "2100-AP",
    description: "Accounts Payable",
    debit: 0,
    credit: 567.9
  }
]

// Sample journal entries for water services
const waterJournalEntries: JournalEntry[] = [
  {
    id: v4(),
    account: "6410-WATER",
    description: "Water Expense",
    debit: 389.55,
    credit: 0
  },
  {
    id: v4(),
    account: "2200-VAT",
    description: "VAT Input",
    debit: 97.39,
    credit: 0
  },
  {
    id: v4(),
    account: "2100-AP",
    description: "Accounts Payable",
    debit: 0,
    credit: 486.94
  }
]

// Sample journal entries for electricity
const electricityJournalEntries: JournalEntry[] = [
  {
    id: v4(),
    account: "6420-ELECT",
    description: "Electricity Expense",
    debit: 628.98,
    credit: 0
  },
  {
    id: v4(),
    account: "2200-VAT",
    description: "VAT Input",
    debit: 157.24,
    credit: 0
  },
  {
    id: v4(),
    account: "2100-AP",
    description: "Accounts Payable",
    debit: 0,
    credit: 786.22
  }
]

export const invoices: InvoiceData[] = [
  { id: "1",  invoiceNumber: "INV-001", store: "Kings Hill",     supplier: "Coca Cola",           date: new Date("2023-05-01"), subtotal: 365.42, vatRate: 20, vat: 91.36, total: 456.78, accountCode: "5000-COGS", invoiceType: "Purchase Invoice", status: "AI Processed",   archived: false, deleted: false,   previewType: "pdf", previewUrl: "INV-001.pdf", lineItems: [], requiresJournaling: false },
  { id: "2",  invoiceNumber: "INV-002", store: "Tonbridge",       supplier: "Eden Farms",          date: new Date("2023-05-05"), subtotal: 185.2,  vatRate: 20, vat: 46.3,  total: 231.5, accountCode: "5000-COGS", invoiceType: "Purchase Invoice", status: "AI Processed",   archived: false, deleted: false,   previewType: "pdf", previewUrl: "invoice-eden-farms.pdf", lineItems: [], requiresJournaling: false },
  { id: "3",  invoiceNumber: "INV-003", store: "Tunbridge Wells", supplier: "Pepsi Co",           date: new Date("2023-05-12"), subtotal: 631.4, vatRate: 20, vat: 157.85, total: 789.25, accountCode: "5000-COGS", invoiceType: "Purchase Invoice", status: "Pending AI",     archived: false, deleted: false,   previewType: "pdf", previewUrl: pdfFilenames[pdfIndex++], lineItems: [], requiresJournaling: false },
  { id: "4",  invoiceNumber: "INV-004", store: "Kings Hill",     supplier: "Office Supplies Ltd",  date: new Date("2023-05-15"), subtotal: 276.48,  vatRate: 20, vat: 69.12, total: 345.6, accountCode: "6500-OFFICE",     invoiceType: "Purchase Invoice", status: "AI Processed",   archived: false, deleted: false,   previewType: "pdf", previewUrl: pdfFilenames[pdfIndex++], lineItems: [], requiresJournaling: false },
  { id: "5",  invoiceNumber: "INV-005", store: "Tonbridge",       supplier: "Utility Services",     date: new Date("2023-05-20"), subtotal: 454.32,  vatRate: 20, vat: 113.58, total: 567.9, accountCode: "6400-UTIL",      invoiceType: "Purchase Invoice", status: "Needs Human Review",archived: false, deleted: false,   previewType: "pdf", previewUrl: pdfFilenames[pdfIndex++], lineItems: [], requiresJournaling: true, journalEntries: utilityJournalEntries },
  { id: "6",  invoiceNumber: "CN-001",  store: "Tunbridge Wells", supplier: "Eden Farms",          date: new Date("2023-05-25"), subtotal: 98.76, vatRate: 20, vat: 24.69, total: 123.45, accountCode: "5000-COGS",     invoiceType: "Credit Note",      status: "Pending AI",     archived: false, deleted: false,   previewType: "pdf", previewUrl: pdfFilenames[pdfIndex++], lineItems: [], requiresJournaling: false },
  { id: "7",  invoiceNumber: "SI-001",  store: "Southborough",    supplier: "Marketing Agency",   date: new Date("2023-06-01"), subtotal: 543.12, vatRate: 20, vat: 135.78, total: 678.9, accountCode: "4000-SALES",    invoiceType: "Sales Invoice",     status: "AI Processed",   archived: false, deleted: false,   previewType: "pdf", previewUrl: pdfFilenames[pdfIndex++], lineItems: [], requiresJournaling: false },
  { id: "8",  invoiceNumber: "SI-002",  store: "Southborough",    supplier: "Equipment Ltd",      date: new Date("2023-06-05"), subtotal: 187.65, vatRate: 20, vat: 46.91, total: 234.56, accountCode: "4000-SALES",    invoiceType: "Sales Invoice",     status: "Needs Human Review",archived: false, deleted: false,   previewType: "pdf", previewUrl: pdfFilenames[pdfIndex++], lineItems: [], requiresJournaling: false },
  { id: "9",  invoiceNumber: "INV-006", store: "Kings Hill",     supplier: "ABC Cleaning",       date: new Date("2023-06-10"), subtotal: 345.75, vatRate: 20, vat: 86.44, total: 432.19, accountCode: "6300-CLEAN",     invoiceType: "Purchase Invoice", status: "AI Processed",   archived: false, deleted: false,   previewType: "pdf", previewUrl: pdfFilenames[pdfIndex++], lineItems: [], requiresJournaling: false },
  { id: "10", invoiceNumber: "INV-007", store: "Tonbridge",       supplier: "Kent Vegetables Ltd", date: new Date("2023-06-15"), subtotal: 238.76, vatRate: 20, vat: 59.69, total: 298.45, accountCode: "5000-COGS",     invoiceType: "Purchase Invoice", status: "Duplicate?",      archived: false, deleted: false,   previewType: "pdf", previewUrl: pdfFilenames[pdfIndex++], lineItems: [], requiresJournaling: false },
  { id: "11", invoiceNumber: "INV-008", store: "Tunbridge Wells", supplier: "Local Meats",       date: new Date("2023-06-18"), subtotal: 507.92,   vatRate: 20, vat: 126.98, total: 634.9, accountCode: "5000-COGS",     invoiceType: "Purchase Invoice", status: "AI Processed",   archived: true,  deleted: false,   previewType: "pdf", previewUrl: pdfFilenames[pdfIndex++], lineItems: [], requiresJournaling: false },
  { id: "12", invoiceNumber: "INV-009", store: "Southborough",    supplier: "Global Distribution", date: new Date("2023-06-20"), subtotal: 434.2, vatRate: 20, vat: 108.55, total: 542.75, accountCode: "5000-COGS",     invoiceType: "Purchase Invoice", status: "Pending AI",     archived: false, deleted: false,   previewType: "pdf", previewUrl: pdfFilenames[pdfIndex++], lineItems: [], requiresJournaling: false },
  { id: "13", invoiceNumber: "CN-002",  store: "Kings Hill",     supplier: "ABC Cleaning",       date: new Date("2023-06-22"), subtotal: 78.8,   vatRate: 20, vat: 19.7,  total: 98.5, accountCode: "6300-CLEAN",     invoiceType: "Credit Note",      status: "AI Processed",   archived: false, deleted: false,   previewType: "pdf", previewUrl: pdfFilenames[pdfIndex++], lineItems: [], requiresJournaling: false },
  { id: "14", invoiceNumber: "SI-003",  store: "Tonbridge",       supplier: "Franchise Partner #1",date: new Date("2023-06-25"), subtotal: 996.24, vatRate: 20, vat: 249.06, total: 1245.3, accountCode: "4000-SALES",    invoiceType: "Sales Invoice",     status: "Duplicate?",      archived: false, deleted: true,    previewType: "pdf", previewUrl: pdfFilenames[pdfIndex++], lineItems: [], requiresJournaling: false },
  { id: "15", invoiceNumber: "INV-010", store: "Tunbridge Wells", supplier: "Kent Vegetables Ltd", date: new Date("2023-06-28"), subtotal: 240.96,  vatRate: 20, vat: 60.24, total: 301.2, accountCode: "5000-COGS",     invoiceType: "Purchase Invoice", status: "Duplicate?",      archived: false, deleted: false,   previewType: "pdf", previewUrl: pdfFilenames[pdfIndex++], lineItems: [], requiresJournaling: false },
  { id: "16", invoiceNumber: "INV-011", store: "Southborough",    supplier: "Tech Solutions",    date: new Date("2023-07-01"), subtotal: 701.12,  vatRate: 20, vat: 175.28, total: 876.4, accountCode: "6700-TECH",      invoiceType: "Purchase Invoice", status: "Needs Human Review",archived: true,  deleted: false,   previewType: "pdf", previewUrl: pdfFilenames[pdfIndex++], lineItems: [], requiresJournaling: false },
  { id: "17", invoiceNumber: "INV-012", store: "Kings Hill",     supplier: "Building Maintenance",date: new Date("2023-07-05"), subtotal: 1072.68,vatRate: 20, vat: 268.17, total: 1340.85, accountCode: "6200-MAINT",     invoiceType: "Purchase Invoice", status: "AI Processed",   archived: true,  deleted: false,   previewType: "pdf", previewUrl: pdfFilenames[pdfIndex++], lineItems: [], requiresJournaling: false },
  { id: "18", invoiceNumber: "SI-004",  store: "Tonbridge",       supplier: "Corporate Event",    date: new Date("2023-07-10"), subtotal: 1720.0, vatRate: 20, vat: 430.0, total: 2150.0, accountCode: "4000-SALES",    invoiceType: "Sales Invoice",     status: "AI Processed",   archived: false, deleted: false,   previewType: "pdf", previewUrl: pdfFilenames[pdfIndex++], lineItems: [], requiresJournaling: false },
  { id: "19", invoiceNumber: "INV-013", store: "Kings Hill",      supplier: "Water Services Ltd",  date: new Date("2023-07-15"), subtotal: 389.55, vatRate: 20, vat: 97.39, total: 486.94, accountCode: "6410-WATER",    invoiceType: "Purchase Invoice", status: "AI Processed",   archived: false, deleted: false,   previewType: "pdf", previewUrl: pdfFilenames[0], lineItems: [], requiresJournaling: true, journalEntries: waterJournalEntries },
  { id: "20", invoiceNumber: "INV-014", store: "Tunbridge Wells", supplier: "Electric Utilities", date: new Date("2023-07-20"), subtotal: 628.98, vatRate: 20, vat: 157.24, total: 786.22, accountCode: "6420-ELECT",    invoiceType: "Purchase Invoice", status: "Needs Human Review",archived: false, deleted: false,   previewType: "pdf", previewUrl: pdfFilenames[1], lineItems: [], requiresJournaling: true, journalEntries: electricityJournalEntries },
];
