import { JournalEntry } from "./types";

export const journalEntries: JournalEntry[] = [
  {
    id: "j001",
    type: "prepayment",
    title: "Annual Insurance Premium",
    description: "Prepayment for annual insurance coverage for Kings Hill store",
    company: "Domino's Pizza",
    accountCode: "1400", // Prepayments
    monthlyAccountCode: "6500", // Insurance Expense
    category: "Insurance",
    totalAmount: 12000.00,
    expensePaidMonth: new Date("2025-06-15"), // Paid in June 2025
    periodStartDate: new Date("2025-07-01"), // Recognize July 2025-June 2026
    periodEndDate: new Date("2026-06-30"),
    store: "Kings Hill",
    status: "published",
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
    scheduleType: "monthly (weekly split)",
  },
  {
    id: "j002",
    type: "accrual",
    title: "Q3 Utility Expenses",
    description: "Accrual for Q3 utility expenses for Manchester store",
    company: "Costa Coffee",
    accountCode: "2200", // Accruals
    monthlyAccountCode: "6300", // Utility Expense
    category: "Utilities",
    totalAmount: 9000.00,
    expensePaidMonth: new Date("2025-10-15"), // Paid in Oct 2025
    periodStartDate: new Date("2025-07-01"), // Recognize July-Sept 2025
    periodEndDate: new Date("2025-09-30"),
    store: "Manchester",
    status: "published",
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
    scheduleType: "monthly (weekly split)",
  },
  {
    id: "j004",
    type: "prepayment",
    title: "3-Year Software License",
    description: "Enterprise POS software license prepayment for London store",
    company: "GDK Ltd",
    accountCode: "1400", // Prepayments
    monthlyAccountCode: "6700", // Software Expense
    category: "Software",
    totalAmount: 36000.00,
    expensePaidMonth: new Date("2025-06-15"), // Paid in June 2025
    periodStartDate: new Date("2025-07-01"), // Recognize July 2025 - June 2028
    periodEndDate: new Date("2028-06-30"),
    store: "London",
    status: "published",
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
    scheduleType: "monthly (equal split)",
  },
  {
    id: "j005",
    type: "accrual",
    title: "Staff Bonus Accrual",
    description: "Monthly accrual for annual staff performance bonuses for Birmingham store",
    company: "Domino's Pizza",
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
    scheduleType: "monthly (weekly split)",
  },
  {
    id: "j007",
    type: "accrual",
    title: "Store Refurbishment Project",
    description: "Phased store modernization program for Leeds store",
    company: "Costa Coffee",
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
    scheduleType: "monthly (equal split)",
  },
  {
    id: "j008",
    type: "stock",
    title: "Monthly Stock Adjustment",
    description: "Stock count adjustment for London store - December 2025",
    company: "Domino's Pizza",
    accountCode: "1300", // Stock on Hand
    monthlyAccountCode: "5000", // Cost of Goods Sold
    stockAccountCode: "1300", // Stock on Hand
    stockMovementAccountCode: "5000", // Cost of Goods Sold
    category: "Stock",
    totalAmount: 2500.00, // Stock increase of £2,500
    openingStockDate: new Date("2025-12-01"),
    openingStockValue: 45000.00,
    closingStockDate: new Date("2025-12-31"),
    closingStockValue: 47500.00,
    store: "London",
    status: "review",
    createdDate: new Date("2025-12-31"),
    sourceDocuments: [
      {
        id: "doc9",
        type: "manual",
        reference: "STOCK-2025-12-001",
        url: "/invoice-previews/InvoiceExamples/MJ_Catterall_Ltd_2024-11-26_244.67.pdf",
        description: "Stock Count Sheet"
      }
    ],
  },
  {
    id: "j014",
    type: "stock",
    title: "Week 1 Stock Movement - June 2025",
    description: "Weekly stock count adjustment for London store - 1st to 7th June 2025",
    company: "Domino's Pizza",
    accountCode: "1001", // Updated
    monthlyAccountCode: "5050", // Updated
    stockAccountCode: "1001", // Updated
    stockMovementAccountCode: "5050", // Updated
    category: "Stock",
    totalAmount: 1200.00, // Stock increase
    openingStockDate: new Date("2025-06-01"),
    openingStockValue: 45000.00,
    closingStockDate: new Date("2025-06-07"),
    closingStockValue: 46200.00,
    store: "London",
    status: "published",
    createdDate: new Date("2025-06-07"),
    sourceDocuments: [
      {
        id: "doc9",
        type: "manual",
        reference: "STOCK-2025-06-W1",
        url: "/invoice-previews/InvoiceExamples/MJ_Catterall_Ltd_2024-11-26_244.67.pdf",
        description: "Week 1 Stock Count Sheet"
      }
    ],
  },
  {
    id: "j009",
    type: "stock",
    title: "Week 2 Stock Movement - June 2025",
    description: "Weekly stock count adjustment for London store - 8th to 14th June 2025",
    company: "Domino's Pizza",
    accountCode: "1001", // Updated
    monthlyAccountCode: "5050", // Updated
    stockAccountCode: "1001", // Updated
    stockMovementAccountCode: "5050", // Updated
    category: "Stock",
    totalAmount: -800.00, // Stock decrease
    openingStockDate: new Date("2025-06-08"),
    openingStockValue: 46200.00,
    closingStockDate: new Date("2025-06-14"),
    closingStockValue: 45400.00,
    store: "London",
    status: "published",
    createdDate: new Date("2025-06-14"),
    sourceDocuments: [
      {
        id: "doc10",
        type: "manual",
        reference: "STOCK-2025-06-W2",
        url: "/invoice-previews/InvoiceExamples/MJ_Catterall_Ltd_2024-11-26_244.67.pdf",
        description: "Week 2 Stock Count Sheet"
      }
    ],
  },
  {
    id: "j010",
    type: "stock",
    title: "Week 3 Stock Movement - June 2025",
    description: "Weekly stock count adjustment for London store - 15th to 21st June 2025",
    company: "Domino's Pizza",
    accountCode: "1001", // Updated
    monthlyAccountCode: "5050", // Updated
    stockAccountCode: "1001", // Updated
    stockMovementAccountCode: "5050", // Updated
    category: "Stock",
    totalAmount: 1500.00, // Stock increase
    openingStockDate: new Date("2025-06-15"),
    openingStockValue: 45400.00,
    closingStockDate: new Date("2025-06-21"),
    closingStockValue: 46900.00,
    store: "London",
    status: "published",
    createdDate: new Date("2025-06-21"),
    sourceDocuments: [
      {
        id: "doc11",
        type: "manual",
        reference: "STOCK-2025-06-W3",
        url: "/invoice-previews/InvoiceExamples/MJ_Catterall_Ltd_2024-11-26_244.67.pdf",
        description: "Week 3 Stock Count Sheet"
      }
    ],
  },
  {
    id: "j011",
    type: "stock",
    title: "Week 4 Stock Movement - June 2025",
    description: "Weekly stock count adjustment for London store - 22nd to 28th June 2025",
    company: "Domino's Pizza",
    accountCode: "1001", // Updated
    monthlyAccountCode: "5050", // Updated
    stockAccountCode: "1001", // Updated
    stockMovementAccountCode: "5050", // Updated
    category: "Stock",
    totalAmount: -700.00, // Stock decrease
    openingStockDate: new Date("2025-06-22"),
    openingStockValue: 46900.00,
    closingStockDate: new Date("2025-06-28"),
    closingStockValue: 46200.00,
    store: "London",
    status: "published",
    createdDate: new Date("2025-06-28"),
    sourceDocuments: [
      {
        id: "doc12",
        type: "manual",
        reference: "STOCK-2025-06-W4",
        url: "/invoice-previews/InvoiceExamples/MJ_Catterall_Ltd_2024-11-26_244.67.pdf",
        description: "Week 4 Stock Count Sheet"
      }
    ],
  },
  {
    id: "j012",
    type: "stock",
    title: "Week 5 Stock Movement - June 2025",
    description: "Weekly stock count adjustment for London store - 29th to 30th June 2025",
    company: "Domino's Pizza",
    accountCode: "1001", // Updated
    monthlyAccountCode: "5050", // Updated
    stockAccountCode: "1001", // Updated
    stockMovementAccountCode: "5050", // Updated
    category: "Stock",
    totalAmount: 300.00, // Stock increase
    openingStockDate: new Date("2025-06-29"),
    openingStockValue: 46200.00,
    closingStockDate: new Date("2025-06-30"),
    closingStockValue: 46500.00,
    store: "London",
    status: "published",
    createdDate: new Date("2025-06-30"),
    sourceDocuments: [
      {
        id: "doc13",
        type: "manual",
        reference: "STOCK-2025-06-W5",
        url: "/invoice-previews/InvoiceExamples/MJ_Catterall_Ltd_2024-11-26_244.67.pdf",
        description: "Week 5 Stock Count Sheet"
      }
    ],
  },
  {
    id: "j013",
    type: "stock",
    title: "Month End Stock Movement - June 2025",
    description: "Monthly closing stock adjustment for London store - June 2025",
    company: "Domino's Pizza",
    accountCode: "1300",
    monthlyAccountCode: "5000",
    stockAccountCode: "1300",
    stockMovementAccountCode: "5000",
    category: "Stock",
    totalAmount: 1500.00, // Net stock increase for the month
    openingStockDate: new Date("2025-06-01"),
    openingStockValue: 45000.00,
    closingStockDate: new Date("2025-06-30"),
    closingStockValue: 46500.00,
    store: "London",
    status: "review",
    createdDate: new Date("2025-06-30"),
    sourceDocuments: [
      {
        id: "doc14",
        type: "manual",
        reference: "STOCK-2025-06-MONTH",
        url: "/invoice-previews/InvoiceExamples/MJ_Catterall_Ltd_2024-11-26_244.67.pdf",
        description: "June 2025 Month End Stock Count Sheet"
      }
    ],
  }
]; 