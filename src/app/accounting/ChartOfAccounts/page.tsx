"use client"

import React, { useState } from "react"
import { 
  Download,
  PlusCircle, 
  Search,
  AlertTriangle,
  RefreshCw,
  X,
  Eye
} from "lucide-react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

import SyncIssuesModal from "./SyncIssuesModal"
import AddAccountModal from "./AddAccountModal"
import { Badge } from "@/components/ui/badge"


// Add type definition for account types
type AccountType = 
  | "Bank account"
  | "Current Asset account"
  | "Current Liability account"
  | "Depreciation account"
  | "Direct Costs account"
  | "Equity account"
  | "Expense account"
  | "Fixed Asset account"
  | "Inventory Asset account"
  | "Liability account"
  | "Non-current Asset account"
  | "Other Income account"
  | "Overhead account"
  | "Prepayment account"
  | "Revenue account"
  | "Sale account"
  | "Non-current Liability account";

// Interface definitions
interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  taxRate: string;
  reportCode: string;
  selected: boolean;
  status: "active" | "inactive";
  lastSynced: string;
}

interface SyncIssue {
  id: string;
  type: "missing" | "mismatch" | "new";
  account: {
    code: string;
    name: string;
    type: AccountType;
  };
  companies: string[];
  description: string;
  severity: "high" | "medium" | "low";
  details: Record<string, { 
    exists: boolean; 
    name?: string; 
    type?: AccountType;
    taxRate?: string; 
  }>;
}

// Update mock accounts with correct types
const mockAccounts: Account[] = [
  {
    id: "0010",
    code: "0010",
    name: "Intangible Asset - Franchise Fee/Goodwill - Cost - b/fwd",
    type: "Fixed Asset account",
    taxRate: "No VAT",
    reportCode: "ASS Assets",
    selected: false,
    status: "active",
    lastSynced: "2024-03-20"
  },
  {
    id: "0011",
    code: "0011",
    name: "Intangible Asset - Franchise Fee/Goodwill - Cost - additions",
    type: "Fixed Asset account",
    taxRate: "20% (VAT on Expenses)",
    reportCode: "ASS Assets",
    selected: false,
    status: "active",
    lastSynced: "2024-03-19"
  },
  {
    id: "0012",
    code: "0012",
    name: "Intangible Asset - Franchise Fee/Goodwill - Cost - disposals",
    type: "Fixed Asset account",
    taxRate: "No VAT",
    reportCode: "ASS Assets",
    selected: false,
    status: "active",
    lastSynced: "2024-03-18"
  },
  {
    id: "0013",
    code: "0013",
    name: "Intangible Asset - Franchise Fee/Goodwill - Cost - revaluations",
    type: "Fixed Asset account",
    taxRate: "No VAT",
    reportCode: "ASS Assets",
    selected: false,
    status: "active",
    lastSynced: "2024-03-17"
  },
  {
    id: "0015",
    code: "0015",
    name: "Intangible Asset - Amortisation -b/fwd",
    type: "Fixed Asset account",
    taxRate: "No VAT",
    reportCode: "ASS Assets",
    selected: false,
    status: "active",
    lastSynced: "2024-03-16"
  },
  {
    id: "0016",
    code: "0016",
    name: "Intangible Asset - Amortisation - provided for the year",
    type: "Fixed Asset account",
    taxRate: "No VAT",
    reportCode: "ASS Assets",
    selected: false,
    status: "active",
    lastSynced: "2024-03-15"
  },
  {
    id: "0017",
    code: "0017",
    name: "Intangible Asset - Amortisation - disposals",
    type: "Fixed Asset account",
    taxRate: "No VAT",
    reportCode: "ASS Assets",
    selected: false,
    status: "active",
    lastSynced: "2024-03-14"
  },
  {
    id: "0018",
    code: "0018",
    name: "Intangible Asset - Amortisation - revaluations",
    type: "Fixed Asset account",
    taxRate: "No VAT",
    reportCode: "ASS Assets",
    selected: false,
    status: "active",
    lastSynced: "2024-03-13"
  },
  {
    id: "0020",
    code: "0020",
    name: "Leasehold property improvements - Cost - b/fwd",
    type: "Fixed Asset account",
    taxRate: "No VAT",
    reportCode: "ASS Assets",
    selected: false,
    status: "active",
    lastSynced: "2024-03-12"
  },
  {
    id: "0021",
    code: "0021",
    name: "Leasehold property improvements - Cost - additions",
    type: "Fixed Asset account",
    taxRate: "20% (VAT on Expenses)",
    reportCode: "ASS Assets",
    selected: false,
    status: "active",
    lastSynced: "2024-03-11"
  },
  {
    id: "0022",
    code: "0022",
    name: "Leasehold property improvements - Cost - disposals",
    type: "Fixed Asset account",
    taxRate: "No VAT",
    reportCode: "ASS Assets",
    selected: false,
    status: "active",
    lastSynced: "2024-03-10"
  },
  {
    id: "0030",
    code: "0030",
    name: "Plant & machinery - Cost - b/fwd",
    type: "Fixed Asset account",
    taxRate: "No VAT",
    reportCode: "ASS Assets",
    selected: false,
    status: "active",
    lastSynced: "2024-03-09"
  },
  {
    id: "0031",
    code: "0031",
    name: "Plant & machinery - Cost - additions",
    type: "Fixed Asset account",
    taxRate: "20% (VAT on Expenses)",
    reportCode: "ASS Assets",
    selected: false,
    status: "active",
    lastSynced: "2024-03-08"
  },
  {
    id: "1001",
    code: "1001",
    name: "Stock",
    type: "Inventory Asset account",
    taxRate: "No VAT",
    reportCode: "ASS Assets",
    selected: false,
    status: "active",
    lastSynced: "2024-03-07"
  },
  {
    id: "4001",
    code: "4001",
    name: "STORE - SALES",
    type: "Sale account",
    taxRate: "20% (VAT on Income)",
    reportCode: "REV Revenue",
    selected: false,
    status: "active",
    lastSynced: "2024-03-06"
  },
  {
    id: "5001",
    code: "5001",
    name: "Food - Food without VAT",
    type: "Direct Costs account",
    taxRate: "No VAT",
    reportCode: "EXP Expense",
    selected: false,
    status: "active",
    lastSynced: "2024-03-05"
  },
  {
    id: "6001",
    code: "6001",
    name: "Dominos - Advertising Levy",
    type: "Overhead account",
    taxRate: "20% (VAT on Expenses)",
    reportCode: "EXP Expense",
    selected: false,
    status: "active",
    lastSynced: "2024-03-04"
  }
];

// Update mock sync issues with correct types
const mockSyncIssues: SyncIssue[] = [
  {
    id: "1",
    type: "missing",
    account: {
      code: "2001",
      name: "Accounts Payable",
      type: "Current Liability account"
    },
    companies: ["Bajs Limited"],
    description: "Account code 2001 exists in Bajs Limited but is missing in other companies",
    severity: "high",
    details: {
      "Bajs Limited": { exists: true, name: "Accounts Payable", type: "Current Liability account", taxRate: "No VAT" },
      "Topbake Limited": { exists: false },
      "R&D Yorkshire Limited": { exists: false },
      "Bellam & Co Limited": { exists: false }
    }
  },
  {
    id: "2",
    type: "mismatch",
    account: {
      code: "4001",
      name: "STORE - SALES",
      type: "Sale account"
    },
    companies: ["R&D Yorkshire Limited", "Topbake Limited"],
    description: "Tax rate differs across companies for account code 4001",
    severity: "low",
    details: {
      "Bajs Limited": { exists: true, name: "STORE - SALES", type: "Sale account", taxRate: "20% (VAT on Income)" },
      "Topbake Limited": { exists: true, name: "STORE - SALES", type: "Sale account", taxRate: "No VAT" },
      "R&D Yorkshire Limited": { exists: true, name: "STORE - SALES", type: "Sale account", taxRate: "No VAT" },
      "Bellam & Co Limited": { exists: true, name: "STORE - SALES", type: "Sale account", taxRate: "20% (VAT on Income)" }
    }
  },
  {
    id: "3",
    type: "mismatch",
    account: {
      code: "5001",
      name: "Food Costs",
      type: "Direct Costs account"
    },
    companies: ["Topbake Limited", "R&D Yorkshire Limited"],
    description: "Account name differs across companies for account code 5001",
    severity: "medium",
    details: {
      "Bajs Limited": { exists: true, name: "Food - Direct Costs", type: "Direct Costs account", taxRate: "No VAT" },
      "Topbake Limited": { exists: true, name: "Food Costs", type: "Direct Costs account", taxRate: "No VAT" },
      "R&D Yorkshire Limited": { exists: true, name: "Food - Cost of Sales", type: "Direct Costs account", taxRate: "No VAT" },
      "Bellam & Co Limited": { exists: true, name: "Food - Direct Costs", type: "Direct Costs account", taxRate: "No VAT" }
    }
  },
  {
    id: "4",
    type: "mismatch",
    account: {
      code: "6001",
      name: "Marketing Expenses",
      type: "Overhead account"
    },
    companies: ["R&D Yorkshire Limited"],
    description: "Account type differs across companies for account code 6001",
    severity: "high",
    details: {
      "Bajs Limited": { exists: true, name: "Marketing Expenses", type: "Overhead account", taxRate: "20% (VAT on Expenses)" },
      "Topbake Limited": { exists: true, name: "Marketing Expenses", type: "Overhead account", taxRate: "20% (VAT on Expenses)" },
      "R&D Yorkshire Limited": { exists: true, name: "Marketing Expenses", type: "Direct Costs account", taxRate: "20% (VAT on Expenses)" },
      "Bellam & Co Limited": { exists: true, name: "Marketing Expenses", type: "Overhead account", taxRate: "20% (VAT on Expenses)" }
    }
  }
];

export default function ChartOfAccountsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [accounts, setAccounts] = useState(mockAccounts)
  const [selectAll, setSelectAll] = useState(false)
  const [syncStatus, setSyncStatus] = useState({ syncing: false, lastSynced: "10 minutes ago" })
  const [syncIssues, setSyncIssues] = useState<SyncIssue[]>(mockSyncIssues)
  const [showSyncModal, setShowSyncModal] = useState(false)
  const [showSyncBanner, setShowSyncBanner] = useState(true)
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set())
  
  // Filter accounts based on search and active tab
  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = !searchQuery || 
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.code.toLowerCase().includes(searchQuery.toLowerCase())
    
    let matchesType = true
    switch (activeTab) {
      case "assets":
        matchesType = account.type === "Fixed Asset account" || account.type === "Inventory Asset account"
        break
      case "liabilities":
        matchesType = account.type === "Current Liability account" || account.type === "Non-current Liability account"
        break
      case "equity":
        matchesType = account.type === "Equity account"
        break
      case "expenses":
        matchesType = account.type === "Direct Costs account" || account.type === "Overhead account"
        break
      case "revenue":
        matchesType = account.type === "Revenue account" || account.type === "Other Income account"
        break
      default:
        matchesType = true
    }
    
    return matchesSearch && matchesType
  })

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    setAccounts(accounts.map(account => ({
      ...account,
      selected: checked
    })))
  }

  const handleSelectAccount = (id: string, checked: boolean) => {
    setAccounts(accounts.map(account => 
      account.id === id ? { ...account, selected: checked } : account
    ))
    
    // Update selectAll state
    const updatedAccounts = accounts.map(account => 
      account.id === id ? { ...account, selected: checked } : account
    )
    const allSelected = updatedAccounts.every(account => account.selected)
    setSelectAll(allSelected)
  }

  const handleSync = async () => {
    setSyncStatus({ ...syncStatus, syncing: true })
    // Simulate API call to sync with Xero
    await new Promise(resolve => setTimeout(resolve, 2000))
    setSyncStatus({ syncing: false, lastSynced: "Just now" })
    
    // Simulate finding new sync issues
    const newIssues: SyncIssue[] = [
      {
        id: "4",
        type: "missing",
        account: {
          code: "3001",
          name: "Retained Earnings",
          type: "Equity account"
        },
        companies: ["Dhillon Brothers Limited"],
        description: "Account missing after latest sync",
        severity: "medium",
        details: {
          "Bajs Limited": { exists: true, name: "Retained Earnings", taxRate: "No VAT" },
          "Topbake Limited": { exists: true, name: "Retained Earnings", taxRate: "No VAT" },
          "R&D Yorkshire Limited": { exists: true, name: "Retained Earnings", taxRate: "No VAT" },
          "Dhillon Brothers Limited": { exists: false }
        }
      }
    ]
    setSyncIssues([...syncIssues, ...newIssues])
  }

  const handleExport = () => {
    // Implement export functionality
    console.log("Exporting chart of accounts...")
  }

  const selectedCount = accounts.filter(account => account.selected).length

  // Account type counts for filter tabs
  const accountCounts = React.useMemo(() => {
    const counts = { 
      all: filteredAccounts.length,
      assets: filteredAccounts.filter(a => a.type === "Fixed Asset account" || a.type === "Inventory Asset account").length,
      liabilities: filteredAccounts.filter(a => a.type === "Current Liability account" || a.type === "Non-current Liability account").length,
      equity: filteredAccounts.filter(a => a.type === "Equity account").length,
      expenses: filteredAccounts.filter(a => a.type === "Direct Costs account" || a.type === "Overhead account").length,
      revenue: filteredAccounts.filter(a => a.type === "Revenue account" || a.type === "Other Income account").length
    }
    return counts
  }, [filteredAccounts])



  // Add function to handle expanding/collapsing issues
  const toggleIssueExpanded = (issueId: string) => {
    setExpandedIssues(prev => {
      const newSet = new Set(prev)
      if (newSet.has(issueId)) {
        newSet.delete(issueId)
      } else {
        newSet.add(issueId)
      }
      return newSet
    })
  }

  const handleAddAccount = (accountData: Partial<Account>) => {
    const newAccount: Account = {
      id: Math.random().toString(36).substr(2, 9),
      code: accountData.code || "",
      name: accountData.name || "",
      type: accountData.type || "Fixed Asset account",
      taxRate: accountData.taxRate || "No VAT",
      reportCode: "GEN General",
      selected: false,
      status: accountData.status || "active",
      lastSynced: accountData.lastSynced || new Date().toISOString().split('T')[0]
    }
    setAccounts(prev => [...prev, newAccount])
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chart of Accounts</h1>
          <p className="text-gray-600 mt-1">Manage your account codes across all companies</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSync} disabled={syncStatus.syncing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${syncStatus.syncing ? 'animate-spin' : ''}`} />
            {syncStatus.syncing ? 'Syncing...' : 'Sync'}
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Account
          </Button>
        </div>
      </div>

      {/* Sync Issues Banner */}
      {syncIssues.length > 0 && showSyncBanner && (
        <div className="flex items-center gap-3 bg-amber-50 border-l-4 border-l-amber-500 py-2.5 px-4 rounded-lg w-full">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-amber-800">
              {syncIssues.length} Sync Issue{syncIssues.length !== 1 ? 's' : ''} Found
            </h3>
            <p className="text-sm text-amber-700">
              Some accounts are out of sync across companies.
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowSyncModal(true)}
            className="text-amber-800 border-amber-300 hover:bg-amber-100 whitespace-nowrap ml-4"
          >
            Review Issues
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowSyncBanner(false)}
            className="text-amber-600 hover:bg-amber-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Summary Stats */}
      <div className="bg-white rounded-lg border shadow-sm p-4">
        <div className="grid grid-cols-3 gap-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{accounts.length}</p>
              <p className="text-sm text-gray-600">Total Accounts</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-100">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{syncIssues.length}</p>
              <p className="text-sm text-gray-600">Sync Issues</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100">
              <RefreshCw className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{syncStatus.lastSynced}</p>
              <p className="text-sm text-gray-600">Last Synced</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          {Object.entries(accountCounts).map(([type, count]) => (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === type
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {type === 'all' ? 'All Accounts' : 
               type.charAt(0).toUpperCase() + type.slice(1)} ({count})
            </button>
          ))}
        </div>

        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Accounts Table */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search accounts..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {selectedCount > 0 && (
              <div className="text-sm text-gray-600 ml-4">
                {selectedCount} account{selectedCount === 1 ? '' : 's'} selected
              </div>
            )}
          </div>
        </div>
        
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox 
                    checked={filteredAccounts.length > 0 && selectAll}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </TableHead>
                <TableHead className="w-[100px]">Code</TableHead>
                <TableHead>Account Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Tax Rate</TableHead>
                <TableHead>Last Synced</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map((account) => (
                  <TableRow 
                    key={account.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <TableCell>
                      <Checkbox 
                        checked={account.selected}
                        onCheckedChange={(checked: boolean) => handleSelectAccount(account.id, checked)}
                        aria-label={`Select ${account.name}`}
                      />
                    </TableCell>
                    <TableCell className="font-mono font-medium text-sm">
                      {account.code}
                    </TableCell>
                    <TableCell className="font-medium">
                      {account.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {account.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {account.taxRate}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(account.lastSynced).toLocaleDateString('en-GB')}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No accounts found matching the current filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Sync Issues Modal */}
      <SyncIssuesModal
        isOpen={showSyncModal}
        onClose={() => setShowSyncModal(false)}
        syncIssues={syncIssues}
        expandedIssues={expandedIssues}
        onToggleExpanded={toggleIssueExpanded}
      />

      {/* Add Account Modal */}
      <AddAccountModal
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAddAccount={handleAddAccount}
        existingAccounts={accounts}
      />
    </div>
  )
} 