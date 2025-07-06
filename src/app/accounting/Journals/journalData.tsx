import { JournalEntry } from "./types";

export const journalEntries: JournalEntry[] = [
  {
    id: "j001",
    type: "prepayment",
    title: "Annual Insurance Premium",
    description: "Prepayment for annual insurance coverage across all stores",
    accountCode: "1400", // Prepayments
    monthlyAccountCode: "6500", // Insurance Expense
    category: "Insurance",
    totalAmount: 12000.00,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31"),
    store: "all-stores",
    status: "active",
    createdDate: new Date("2023-12-15"),
    source: "bill",
    sourceReference: "BILL-2023-12-001",
    monthlyBreakdown: [
      {
        month: "2024-01",
        amount: 1000.00,
        status: "posted",
        lineItems: [
          {
            id: "li001",
            accountCode: "1400",
            description: "Insurance Premium Prepayment",
            debitAmount: 1000.00,
            creditAmount: 0,
            store: "all-stores",
            taxRate: "no-tax"
          },
          {
            id: "li002",
            accountCode: "6500",
            description: "Monthly Insurance Expense",
            debitAmount: 0,
            creditAmount: 1000.00,
            store: "all-stores",
            taxRate: "no-tax"
          }
        ]
      },
      {
        month: "2024-02",
        amount: 1000.00,
        status: "posted",
        lineItems: [
          {
            id: "li003",
            accountCode: "1400",
            description: "Insurance Premium Prepayment",
            debitAmount: 1000.00,
            creditAmount: 0,
            store: "all-stores",
            taxRate: "no-tax"
          },
          {
            id: "li004",
            accountCode: "6500",
            description: "Monthly Insurance Expense",
            debitAmount: 0,
            creditAmount: 1000.00,
            store: "all-stores",
            taxRate: "no-tax"
          }
        ]
      }
      // ... Additional months would follow the same pattern
    ]
  },
  {
    id: "j002",
    type: "accrual",
    title: "Q4 Utility Expenses",
    description: "Accrual for Q4 utility expenses across all locations",
    accountCode: "2200", // Accruals
    monthlyAccountCode: "6300", // Utility Expense
    category: "Utilities",
    totalAmount: 9000.00,
    startDate: new Date("2024-10-01"),
    endDate: new Date("2024-12-31"),
    store: "all-stores",
    status: "active",
    createdDate: new Date("2024-09-15"),
    source: "manual",
    sourceReference: "MJ-2024-09-001",
    monthlyBreakdown: [
      {
        month: "2024-10",
        amount: 3000.00,
        status: "posted",
        lineItems: [
          {
            id: "li005",
            accountCode: "6300",
            description: "Monthly Utility Expense",
            debitAmount: 3000.00,
            creditAmount: 0,
            store: "all-stores",
            taxRate: "standard"
          },
          {
            id: "li006",
            accountCode: "2200",
            description: "Utility Expense Accrual",
            debitAmount: 0,
            creditAmount: 3000.00,
            store: "all-stores",
            taxRate: "standard"
          }
        ]
      }
      // ... Additional months would follow the same pattern
    ]
  },
  {
    id: "j003",
    type: "stock-movement",
    title: "Inter-store Stock Transfer",
    description: "Stock movement from Manchester to Liverpool store",
    accountCode: "1100", // Inventory
    monthlyAccountCode: "1100", // Inventory (same as it's just movement)
    category: "Inventory",
    totalAmount: 5000.00,
    startDate: new Date("2024-03-01"),
    endDate: new Date("2024-03-31"),
    store: "manchester",
    toStore: "liverpool",
    status: "active",
    createdDate: new Date("2024-02-28"),
    source: "stock",
    sourceReference: "STK-2024-02-001",
    monthlyBreakdown: [
      {
        month: "2024-03",
        amount: 5000.00,
        status: "posted",
        lineItems: [
          {
            id: "li007",
            accountCode: "1100",
            description: "Stock Transfer Out - Manchester",
            debitAmount: 0,
            creditAmount: 5000.00,
            store: "manchester",
            taxRate: "no-tax"
          },
          {
            id: "li008",
            accountCode: "1100",
            description: "Stock Transfer In - Liverpool",
            debitAmount: 5000.00,
            creditAmount: 0,
            store: "liverpool",
            taxRate: "no-tax"
          }
        ]
      }
    ]
  },
  {
    id: "j004",
    type: "prepayment",
    title: "3-Year Software License",
    description: "Enterprise POS software license prepayment for all locations",
    accountCode: "1400", // Prepayments
    monthlyAccountCode: "6700", // Software Expense
    category: "Software",
    totalAmount: 36000.00,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2026-12-31"),
    store: "all-stores",
    status: "active",
    createdDate: new Date("2023-12-20"),
    source: "bill",
    sourceReference: "BILL-2023-12-002",
    monthlyBreakdown: Array.from({ length: 36 }, (_, i) => ({
      month: `${2024 + Math.floor(i / 12)}-${String(i % 12 + 1).padStart(2, '0')}`,
      amount: 1000.00,
      status: i < 3 ? "posted" : "scheduled",
      lineItems: [
        {
          id: `li_sw_${i}_1`,
          accountCode: "1400",
          description: "Software License Prepayment Amortization",
          debitAmount: 1000.00,
          creditAmount: 0,
          store: "all-stores",
          taxRate: "standard"
        },
        {
          id: `li_sw_${i}_2`,
          accountCode: "6700",
          description: "Monthly Software License Expense",
          debitAmount: 0,
          creditAmount: 1000.00,
          store: "all-stores",
          taxRate: "standard"
        }
      ]
    }))
  },
  {
    id: "j005",
    type: "accrual",
    title: "Staff Bonus Accrual",
    description: "Monthly accrual for annual staff performance bonuses",
    accountCode: "2200", // Accruals
    monthlyAccountCode: "7100", // Staff Costs
    category: "Staff Costs",
    totalAmount: 120000.00,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31"),
    store: "all-stores",
    status: "review",
    createdDate: new Date("2023-12-31"),
    source: "manual",
    sourceReference: "MJ-2023-12-001",
    monthlyBreakdown: Array.from({ length: 12 }, (_, i) => ({
      month: `2024-${String(i + 1).padStart(2, '0')}`,
      amount: 10000.00,
      status: i < 2 ? "posted" : "scheduled",
      lineItems: [
        {
          id: `li_bonus_${i}_1`,
          accountCode: "7100",
          description: "Staff Bonus Expense",
          debitAmount: 10000.00,
          creditAmount: 0,
          store: "all-stores",
          taxRate: "no-tax"
        },
        {
          id: `li_bonus_${i}_2`,
          accountCode: "2200",
          description: "Staff Bonus Accrual",
          debitAmount: 0,
          creditAmount: 10000.00,
          store: "all-stores",
          taxRate: "no-tax"
        }
      ]
    }))
  },
  {
    id: "j006",
    type: "stock-movement",
    title: "Seasonal Stock Reallocation",
    description: "Summer menu items redistribution across all stores",
    accountCode: "1100", // Inventory
    monthlyAccountCode: "1100", // Inventory
    category: "Inventory",
    totalAmount: 25000.00,
    startDate: new Date("2024-04-01"),
    endDate: new Date("2024-06-30"),
    store: "central-warehouse",
    status: "draft",
    createdDate: new Date("2024-03-15"),
    source: "stock",
    sourceReference: "STK-2024-03-001",
    monthlyBreakdown: [
      {
        month: "2024-04",
        amount: 15000.00,
        status: "scheduled",
        lineItems: [
          {
            id: "li_stock_1",
            accountCode: "1100",
            description: "Stock Out - Central Warehouse",
            debitAmount: 0,
            creditAmount: 15000.00,
            store: "central-warehouse",
            taxRate: "no-tax"
          },
          {
            id: "li_stock_2",
            accountCode: "1100",
            description: "Stock In - Manchester",
            debitAmount: 5000.00,
            creditAmount: 0,
            store: "manchester",
            taxRate: "no-tax"
          },
          {
            id: "li_stock_3",
            accountCode: "1100",
            description: "Stock In - Liverpool",
            debitAmount: 5000.00,
            creditAmount: 0,
            store: "liverpool",
            taxRate: "no-tax"
          },
          {
            id: "li_stock_4",
            accountCode: "1100",
            description: "Stock In - Leeds",
            debitAmount: 5000.00,
            creditAmount: 0,
            store: "leeds",
            taxRate: "no-tax"
          }
        ]
      },
      {
        month: "2024-05",
        amount: 5000.00,
        status: "scheduled",
        lineItems: [
          {
            id: "li_stock_5",
            accountCode: "1100",
            description: "Stock Out - Central Warehouse",
            debitAmount: 0,
            creditAmount: 5000.00,
            store: "central-warehouse",
            taxRate: "no-tax"
          },
          {
            id: "li_stock_6",
            accountCode: "1100",
            description: "Stock In - Birmingham",
            debitAmount: 2500.00,
            creditAmount: 0,
            store: "birmingham",
            taxRate: "no-tax"
          },
          {
            id: "li_stock_7",
            accountCode: "1100",
            description: "Stock In - Newcastle",
            debitAmount: 2500.00,
            creditAmount: 0,
            store: "newcastle",
            taxRate: "no-tax"
          }
        ]
      },
      {
        month: "2024-06",
        amount: 5000.00,
        status: "scheduled",
        lineItems: [
          {
            id: "li_stock_8",
            accountCode: "1100",
            description: "Stock Out - Central Warehouse",
            debitAmount: 0,
            creditAmount: 5000.00,
            store: "central-warehouse",
            taxRate: "no-tax"
          },
          {
            id: "li_stock_9",
            accountCode: "1100",
            description: "Stock In - Glasgow",
            debitAmount: 2500.00,
            creditAmount: 0,
            store: "glasgow",
            taxRate: "no-tax"
          },
          {
            id: "li_stock_10",
            accountCode: "1100",
            description: "Stock In - Edinburgh",
            debitAmount: 2500.00,
            creditAmount: 0,
            store: "edinburgh",
            taxRate: "no-tax"
          }
        ]
      }
    ]
  },
  {
    id: "j007",
    type: "accrual",
    title: "Store Refurbishment Project",
    description: "Phased store modernization program across multiple locations",
    accountCode: "2200", // Accruals
    monthlyAccountCode: "8100", // Capital Expenditure
    category: "Capital Projects",
    totalAmount: 500000.00,
    startDate: new Date("2024-03-01"),
    endDate: new Date("2025-02-28"),
    store: "all-stores",
    status: "review",
    createdDate: new Date("2024-02-15"),
    source: "invoice",
    sourceReference: "INV-2024-02-001",
    monthlyBreakdown: Array.from({ length: 12 }, (_, i) => ({
      month: `${2024 + Math.floor((i + 2) / 12)}-${String((i + 2) % 12 + 1).padStart(2, '0')}`,
      amount: 41666.67,
      status: "scheduled",
      lineItems: [
        {
          id: `li_refurb_${i}_1`,
          accountCode: "8100",
          description: "Store Refurbishment Expense",
          debitAmount: 41666.67,
          creditAmount: 0,
          store: "all-stores",
          taxRate: "standard"
        },
        {
          id: `li_refurb_${i}_2`,
          accountCode: "2200",
          description: "Refurbishment Accrual",
          debitAmount: 0,
          creditAmount: 41666.67,
          store: "all-stores",
          taxRate: "standard"
        },
        {
          id: `li_refurb_${i}_3`,
          accountCode: "2300",
          description: "VAT Input",
          debitAmount: 8333.33,
          creditAmount: 0,
          store: "all-stores",
          taxRate: "standard"
        }
      ]
    }))
  }
]; 