import { JournalEntry } from "./types";

export const journalEntries: JournalEntry[] = [
  {
    id: "j001",
    type: "prepayment",
    title: "Annual Insurance Premium",
    description: "Prepayment for annual insurance coverage for Kings Hill store",
    accountCode: "1400", // Prepayments
    monthlyAccountCode: "6500", // Insurance Expense
    category: "Insurance",
    totalAmount: 12000.00,
    expensePaidMonth: new Date("2025-06-15"), // Paid in June 2025
    periodStartDate: new Date("2025-07-01"), // Recognize July 2025-June 2026
    periodEndDate: new Date("2026-06-30"),
    store: "Kings Hill",
    status: "active",
    createdDate: new Date("2025-06-15"),
    sourceDocuments: [
      {
        id: "doc1",
        type: "bill",
        reference: "BILL-2025-06-001",
        url: "/invoice-previews/InvoiceExamples/Icon_Engineering_2024-11-26_111.00.pdf",
        description: "Original Insurance Bill"
      },
      {
        id: "doc2",
        type: "invoice",
        reference: "INV-2025-06-001",
        url: "/invoice-previews/InvoiceExamples/Combat_Fire_Limited_2025-03-24_137.52.pdf",
        description: "Insurance Certificate"
      }
    ],
    scheduleType: "monthly & weekly",
  },
  {
    id: "j002",
    type: "accrual",
    title: "Q3 Utility Expenses",
    description: "Accrual for Q3 utility expenses for Manchester store",
    accountCode: "2200", // Accruals
    monthlyAccountCode: "6300", // Utility Expense
    category: "Utilities",
    totalAmount: 9000.00,
    expensePaidMonth: new Date("2025-10-15"), // Paid in Oct 2025
    periodStartDate: new Date("2025-07-01"), // Recognize July-Sept 2025
    periodEndDate: new Date("2025-09-30"),
    store: "Manchester",
    status: "active",
    createdDate: new Date("2025-06-15"),
    sourceDocuments: [
      {
        id: "doc3",
        type: "manual",
        reference: "MJ-2025-06-001",
        url: "/invoice-previews/InvoiceExamples/Comfort_Cooling_Services_2025-05-07_282.00.pdf",
        description: "Utility Estimate"
      }
    ],
    scheduleType: "monthly & weekly",
  },
  {
    id: "j004",
    type: "prepayment",
    title: "3-Year Software License",
    description: "Enterprise POS software license prepayment for London store",
    accountCode: "1400", // Prepayments
    monthlyAccountCode: "6700", // Software Expense
    category: "Software",
    totalAmount: 36000.00,
    expensePaidMonth: new Date("2025-06-15"), // Paid in June 2025
    periodStartDate: new Date("2025-07-01"), // Recognize July 2025 - June 2028
    periodEndDate: new Date("2028-06-30"),
    store: "London",
    status: "active",
    createdDate: new Date("2025-06-20"),
    sourceDocuments: [
      {
        id: "doc4",
        type: "bill",
        reference: "BILL-2025-06-002",
        url: "/invoice-previews/InvoiceExamples/Combat_Fire_Limited_2025-03-24_137.52.pdf",
        description: "Software License Bill"
      },
      {
        id: "doc5",
        type: "invoice",
        reference: "INV-2025-06-002",
        url: "/invoice-previews/InvoiceExamples/Lancaster_City_Council_2025-04-15_172.50.pdf",
        description: "License Agreement"
      }
    ],
    scheduleType: "monthly & weekly",
  },
  {
    id: "j005",
    type: "accrual",
    title: "Staff Bonus Accrual",
    description: "Monthly accrual for annual staff performance bonuses for Birmingham store",
    accountCode: "2200", // Accruals
    monthlyAccountCode: "7100", // Staff Costs
    category: "Staff Costs",
    totalAmount: 120000.00,
    expensePaidMonth: new Date("2026-01-15"), // Paid in Jan 2026
    periodStartDate: new Date("2025-01-01"), // Recognize Jan-Dec 2025
    periodEndDate: new Date("2025-12-31"),
    store: "Birmingham",
    status: "review",
    createdDate: new Date("2024-12-31"),
    sourceDocuments: [
      {
        id: "doc6",
        type: "manual",
        reference: "MJ-2024-12-001",
        url: "/invoice-previews/InvoiceExamples/LUSU_General_Account_2025-04-01_300.00.pdf",
        description: "Bonus Calculation Sheet"
      }
    ],
    scheduleType: "monthly & weekly",
  },
  {
    id: "j007",
    type: "accrual",
    title: "Store Refurbishment Project",
    description: "Phased store modernization program for Leeds store",
    accountCode: "2200", // Accruals
    monthlyAccountCode: "8100", // Capital Expenditure
    category: "Capital Projects",
    totalAmount: 500000.00,
    expensePaidMonth: new Date("2025-09-15"), // Paid in Sept 2025
    periodStartDate: new Date("2025-07-01"), // Recognize July-Aug 2025
    periodEndDate: new Date("2025-08-31"),
    store: "Leeds",
    status: "review",
    createdDate: new Date("2025-06-15"),
    sourceDocuments: [
      {
        id: "doc7",
        type: "invoice",
        reference: "INV-2025-06-001",
        url: "/invoice-previews/InvoiceExamples/Comfort_Cooling_Services_2025-05-07_282.00.pdf",
        description: "Contractor Quote"
      },
      {
        id: "doc8",
        type: "invoice",
        reference: "INV-2025-06-002",
        url: "/invoice-previews/InvoiceExamples/Imperial_Green_2023-11-08_4290.00.pdf",
        description: "Project Plan"
      }
    ],
    scheduleType: "monthly & weekly",
  }
]; 