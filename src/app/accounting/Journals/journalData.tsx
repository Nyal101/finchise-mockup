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
    source: "bill",
    sourceReference: "BILL-2025-06-001",
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
    source: "manual",
    sourceReference: "MJ-2025-06-001",
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
    source: "bill",
    sourceReference: "BILL-2025-06-002",
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
    source: "manual",
    sourceReference: "MJ-2024-12-001",
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
    source: "invoice",
    sourceReference: "INV-2025-06-001",
    scheduleType: "monthly & weekly",
  }
]; 