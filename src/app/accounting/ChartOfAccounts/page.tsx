"use client"

import React, { useState } from "react"
import { 
  FileText,
  Download,
  Upload,
  PlusCircle, 
  Search,
  AlertTriangle,
  CheckCircle2,
  RefreshCw
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

// Custom alert components without importing from module
type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'destructive';
  children: React.ReactNode;
};

type AlertTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  children: React.ReactNode;
};

type AlertDescriptionProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

const Alert = ({ children, variant = "default", ...props }: AlertProps) => (
  <div 
    role="alert"
    className={`relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground ${
      variant === "destructive" 
        ? "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive" 
        : "bg-background text-foreground"
    }`}
    {...props}
  >
    {children}
  </div>
);

const AlertTitle = ({ children, ...props }: AlertTitleProps) => (
  <h5
    className="mb-1 font-medium leading-none tracking-tight"
    {...props}
  >
    {children}
  </h5>
);

const AlertDescription = ({ children, ...props }: AlertDescriptionProps) => (
  <div
    className="text-sm [&_p]:leading-relaxed"
    {...props}
  >
    {children}
  </div>
);

// Mock data interface
interface Account {
  id: string;
  code: string;
  name: string;
  type: string;
  taxRate: string;
  reportCode: string;
  selected: boolean;
  nonDeletable?: boolean;
  nonDeletableReason?: string;
}

interface Notification {
  id: number;
  message: string;
  type: string;
  timestamp: string;
}

interface Company {
  id: number;
  name: string;
}

// Mock data for chart of accounts
const mockAccounts: Account[] = [
  {
    id: "0010",
    code: "0010",
    name: "Intangible Asset - Franchise Fee/Goodwill - Cost - b/fwd",
    type: "Fixed Asset",
    taxRate: "No VAT",
    reportCode: "ASS Assets",
    selected: false
  },
  {
    id: "0011",
    code: "0011",
    name: "Intangible Asset - Franchise Fee/Goodwill - Cost - additions",
    type: "Fixed Asset",
    taxRate: "20% (VAT on Expenses)",
    reportCode: "ASS Assets",
    selected: false
  },
  {
    id: "0012",
    code: "0012",
    name: "Intangible Asset - Franchise Fee/Goodwill - Cost - disposals",
    type: "Fixed Asset",
    taxRate: "No VAT",
    reportCode: "ASS Assets",
    selected: false
  },
  {
    id: "0013",
    code: "0013",
    name: "Intangible Asset - Franchise Fee/Goodwill - Cost - revaluations",
    type: "Fixed Asset",
    taxRate: "No VAT",
    reportCode: "ASS Assets",
    selected: false
  },
  {
    id: "0015",
    code: "0015",
    name: "Intangible Asset - Amortisation -b/fwd",
    type: "Fixed Asset",
    taxRate: "No VAT",
    reportCode: "ASS Assets",
    selected: false
  },
  {
    id: "0016",
    code: "0016",
    name: "Intangible Asset - Amortisation - provided for the year",
    type: "Fixed Asset",
    taxRate: "No VAT",
    reportCode: "ASS Assets",
    selected: false
  },
  {
    id: "0017",
    code: "0017",
    name: "Intangible Asset - Amortisation - disposals",
    type: "Fixed Asset",
    taxRate: "No VAT",
    reportCode: "ASS Assets",
    selected: false
  },
  {
    id: "0018",
    code: "0018",
    name: "Intangible Asset - Amortisation - revaluations",
    type: "Fixed Asset",
    taxRate: "No VAT",
    reportCode: "ASS Assets",
    selected: false
  },
  {
    id: "0020",
    code: "0020",
    name: "Leasehold property improvements - Cost - b/fwd",
    type: "Fixed Asset",
    taxRate: "No VAT",
    reportCode: "ASS Assets",
    selected: false
  },
  {
    id: "0021",
    code: "0021",
    name: "Leasehold property improvements - Cost - additions",
    type: "Fixed Asset",
    taxRate: "20% (VAT on Expenses)",
    reportCode: "ASS Assets",
    selected: false
  },
  {
    id: "0022",
    code: "0022",
    name: "Leasehold property improvements - Cost - disposals",
    type: "Fixed Asset",
    taxRate: "No VAT",
    reportCode: "ASS Assets",
    selected: false
  },
  {
    id: "0030",
    code: "0030",
    name: "Plant & machinery - Cost - b/fwd",
    type: "Fixed Asset",
    taxRate: "No VAT",
    reportCode: "ASS Assets",
    selected: false
  },
  {
    id: "0031",
    code: "0031",
    name: "Plant & machinery - Cost - additions",
    type: "Fixed Asset",
    taxRate: "20% (VAT on Expenses)",
    reportCode: "ASS Assets",
    selected: false
  },
  {
    id: "0048",
    code: "0048",
    name: "Management Depreciation (Monthly)",
    type: "Fixed Asset",
    taxRate: "No VAT",
    reportCode: "ASS Assets",
    selected: false,
    nonDeletable: true,
    nonDeletableReason: "You cannot delete/archive accounts used by a repeating transaction."
  },
  {
    id: "1001",
    code: "1001",
    name: "Stock",
    type: "Current Asset",
    taxRate: "No VAT",
    reportCode: "ASS Assets",
    selected: false
  },
  {
    id: "1050",
    code: "1050",
    name: "Trade Debtors - EDEBIT SALES - BARMING",
    type: "Current Asset",
    taxRate: "No VAT",
    reportCode: "ASS Assets",
    selected: false,
    nonDeletable: true,
    nonDeletableReason: "You cannot delete/archive accounts used by a bank rule."
  },
  {
    id: "1051",
    code: "1051",
    name: "Trade Debtors - EDEBIT SALES - KINGS HILL",
    type: "Current Asset",
    taxRate: "No VAT",
    reportCode: "ASS Assets",
    selected: false,
    nonDeletable: true,
    nonDeletableReason: "You cannot delete/archive accounts used by a bank rule."
  },
  {
    id: "1100",
    code: "1100",
    name: "Accounts Receivable",
    type: "Current Asset",
    taxRate: "No VAT",
    reportCode: "ASS.CUR.REC.TRA Trade debtors",
    selected: false,
    nonDeletable: true,
    nonDeletableReason: "You cannot delete/archive system accounts."
  },
  {
    id: "1104",
    code: "1104",
    name: "Prepayment Rent",
    type: "Current Asset",
    taxRate: "No VAT",
    reportCode: "ASS Assets",
    selected: false,
    nonDeletable: true,
    nonDeletableReason: "You cannot delete/archive accounts used by a repeating transaction."
  },
  {
    id: "1200",
    code: "1200",
    name: "POPAT LEISURE LIMITED",
    type: "Bank",
    taxRate: "No VAT",
    reportCode: "ASS Assets",
    selected: false
  },
  {
    id: "2100",
    code: "2100",
    name: "Accounts Payable",
    type: "Current Liability",
    taxRate: "No VAT",
    reportCode: "LIA.CUR.TRA Trade creditors",
    selected: false,
    nonDeletable: true,
    nonDeletableReason: "You cannot delete/archive system accounts."
  },
  {
    id: "2203",
    code: "2203",
    name: "VAT",
    type: "Current Liability",
    taxRate: "No VAT",
    reportCode: "LIA.CUR.TAX.VAT VAT",
    selected: false,
    nonDeletable: true,
    nonDeletableReason: "You cannot delete/archive system accounts."
  },
  {
    id: "2513",
    code: "2513",
    name: "INTER COM -Fans (UK) Ltd",
    type: "Current Liability",
    taxRate: "No VAT",
    reportCode: "LIA Liabilities",
    selected: false
  },
  {
    id: "3000",
    code: "3000",
    name: "Ordinary Shares",
    type: "Equity",
    taxRate: "No VAT",
    reportCode: "EQU Capital and reserves",
    selected: false
  },
  {
    id: "3200",
    code: "3200",
    name: "Retained Earnings",
    type: "Equity",
    taxRate: "No VAT",
    reportCode: "EQU.RET Profit and loss account",
    selected: false,
    nonDeletable: true,
    nonDeletableReason: "You cannot delete/archive system accounts."
  },
  {
    id: "4001",
    code: "4001",
    name: "STORE - SALES",
    type: "Revenue",
    taxRate: "20% (VAT on Income)",
    reportCode: "REV Revenue",
    selected: false
  },
  {
    id: "5000",
    code: "5000",
    name: "Food - Ice Cream & Drinks",
    type: "Direct Costs",
    taxRate: "20% (VAT on Expenses)",
    reportCode: "EXP Expense",
    selected: false
  },
  {
    id: "6001",
    code: "6001",
    name: "Dominos - Advertising Levy",
    type: "Overhead",
    taxRate: "20% (VAT on Expenses)",
    reportCode: "EXP Expense",
    selected: false
  },
];

// Mock notifications for syncing
const mockNotifications: Notification[] = [
  {
    id: 1,
    message: "Account 'Intangible Asset - Amortisation - b/fwd' was updated in Company A but not yet synced to other companies",
    type: "warning",
    timestamp: "2023-10-15T14:23:00Z"
  },
  {
    id: 2,
    message: "All accounts are now in sync across all companies",
    type: "success",
    timestamp: "2023-10-15T14:30:00Z"
  }
];

// Mock companies
const mockCompanies: Company[] = [
  { id: 1, name: "Popat Leisure Limited" },
  { id: 2, name: "Company B" },
  { id: 3, name: "Company C" },
];

export default function ChartOfAccountsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(1)
  const [accounts, setAccounts] = useState(mockAccounts)
  const [notifications] = useState(mockNotifications)
  const [selectAll, setSelectAll] = useState(false)
  const [showChangeTaxRateDialog, setShowChangeTaxRateDialog] = useState(false)
  const [syncStatus, setSyncStatus] = useState({ syncing: false, lastSynced: "10 minutes ago" })
  
  // Filter accounts based on search and active tab
  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = !searchQuery || 
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.code.toLowerCase().includes(searchQuery.toLowerCase())
    
    let matchesType = true
    switch (activeTab) {
      case "assets":
        matchesType = account.type === "Fixed Asset" || account.type === "Current Asset" || account.reportCode.includes("Assets")
        break
      case "liabilities":
        matchesType = account.type === "Current Liability" || account.type === "Non-current Liability" || account.reportCode.includes("Liabilities")
        break
      case "equity":
        matchesType = account.type === "Equity" || account.reportCode.includes("Equity")
        break
      case "expenses":
        matchesType = account.type === "Direct Costs" || account.type === "Overhead" || account.reportCode.includes("Expense")
        break
      case "revenue":
        matchesType = account.type === "Revenue" || account.type === "Other Income" || account.reportCode.includes("Revenue")
        break
      case "archive":
        matchesType = false // No archived items in our mock data
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
    const allSelected = accounts.every(account => account.id === id ? checked : account.selected)
    setSelectAll(allSelected)
  }

  const handleDelete = () => {
    // In a real app, you would handle deletion with confirmation
    alert("Delete selected accounts functionality would go here")
  }

  const handleArchive = () => {
    alert("Archive selected accounts functionality would go here")
  }

  const handleChangeTaxRate = () => {
    setShowChangeTaxRateDialog(true)
  }

  const handleSync = () => {
    setSyncStatus({ ...syncStatus, syncing: true })
    // Simulate API call to sync with Xero
    setTimeout(() => {
      setSyncStatus({ syncing: false, lastSynced: "Just now" })
    }, 2000)
  }

  const handleExport = () => {
    alert("Export functionality would go here")
  }

  const handleImport = () => {
    alert("Import functionality would go here")
  }

  const handlePrintPDF = () => {
    alert("Print PDF functionality would go here")
  }

  const selectedCount = accounts.filter(account => account.selected).length

  return (
    <div className="px-6 py-8 space-y-6">
      {/* Notifications */}
      <div className="space-y-3">
        {notifications.map(notification => (
          <Alert key={notification.id} variant={notification.type === "warning" ? "destructive" : "default"}>
            {notification.type === "warning" ? 
              <AlertTriangle className="h-4 w-4" /> : 
              <CheckCircle2 className="h-4 w-4" />
            }
            <AlertTitle>
              {notification.type === "warning" ? "Sync Required" : "Sync Status"}
            </AlertTitle>
            <AlertDescription>
              {notification.message}
            </AlertDescription>
          </Alert>
        ))}
      </div>
      
      {/* Company selector and page title */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Chart of Accounts</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground mr-2">
            Last synced with Xero: {syncStatus.lastSynced}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSync}
            disabled={syncStatus.syncing}
            className="mr-4"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${syncStatus.syncing ? "animate-spin" : ""}`} />
            {syncStatus.syncing ? "Syncing..." : "Sync with Xero"}
          </Button>
          <Label htmlFor="company-select">Company:</Label>
          <Select value={selectedCompany.toString()} onValueChange={(value) => setSelectedCompany(parseInt(value))}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent>
              {mockCompanies.map(company => (
                <SelectItem key={company.id} value={company.id.toString()}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Top action buttons */}
      <div className="flex flex-wrap gap-2">
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Account</DialogTitle>
              <DialogDescription>
                Create a new account in the chart of accounts. This will be synced across all companies.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">Code</Label>
                <Input id="code" placeholder="e.g. 0010" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" placeholder="Account name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">Type</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed-asset">Fixed Asset</SelectItem>
                    <SelectItem value="bank">Bank</SelectItem>
                    <SelectItem value="current-asset">Current Asset</SelectItem>
                    <SelectItem value="current-liability">Current Liability</SelectItem>
                    <SelectItem value="equity">Equity</SelectItem>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="direct-costs">Direct Costs</SelectItem>
                    <SelectItem value="overhead">Overhead</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="taxRate" className="text-right">Tax Rate</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select tax rate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-vat">No VAT</SelectItem>
                    <SelectItem value="standard">20% (VAT on Expenses)</SelectItem>
                    <SelectItem value="income">20% (VAT on Income)</SelectItem>
                    <SelectItem value="reduced">5% (Reduced Rate)</SelectItem>
                    <SelectItem value="zero">0% (Zero Rate)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reportCode" className="text-right">Report Code</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select report code" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ass-assets">ASS Assets</SelectItem>
                    <SelectItem value="liab-liabilities">LIA Liabilities</SelectItem>
                    <SelectItem value="equ-equity">EQU Capital and reserves</SelectItem>
                    <SelectItem value="rev-revenue">REV Revenue</SelectItem>
                    <SelectItem value="exp-expenses">EXP Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
              <Button type="submit" onClick={() => setShowAddDialog(false)}>Add Account</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button variant="outline" onClick={handlePrintPDF}>
          <FileText className="mr-2 h-4 w-4" />
          Print PDF
        </Button>

        <Button variant="outline" onClick={handleImport}>
          <Upload className="mr-2 h-4 w-4" />
          Import
        </Button>

        <Button variant="outline" onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Tab navigation and table */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-12">
              <TabsTrigger 
                value="all" 
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
              >
                All Accounts
              </TabsTrigger>
              <TabsTrigger 
                value="assets" 
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
              >
                Assets
              </TabsTrigger>
              <TabsTrigger 
                value="liabilities" 
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
              >
                Liabilities
              </TabsTrigger>
              <TabsTrigger 
                value="equity" 
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
              >
                Equity
              </TabsTrigger>
              <TabsTrigger 
                value="expenses" 
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
              >
                Expenses
              </TabsTrigger>
              <TabsTrigger 
                value="revenue" 
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
              >
                Revenue
              </TabsTrigger>
              <TabsTrigger 
                value="archive" 
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
              >
                Archive
              </TabsTrigger>
            </TabsList>

            <div className="p-4">
              <div className="flex mb-2 items-center">
                <p className="text-sm text-amber-600 flex items-center">
                  What&apos;s this?
                  <span className="ml-2 inline-block w-5 h-5 bg-amber-100 rounded-full text-center text-amber-600 font-bold border border-amber-200">?</span>
                </p>
              </div>

              <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={handleDelete} disabled={selectedCount === 0}>
                    Delete
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleArchive} disabled={selectedCount === 0}>
                    Archive
                  </Button>
                  <Dialog open={showChangeTaxRateDialog} onOpenChange={setShowChangeTaxRateDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={handleChangeTaxRate} disabled={selectedCount === 0}>
                        Change Tax Rate
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change Tax Rate</DialogTitle>
                        <DialogDescription>
                          Select a new tax rate for the {selectedCount} selected account(s). This change will be applied across all companies.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select new tax rate" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no-vat">No VAT</SelectItem>
                            <SelectItem value="standard">20% (VAT on Expenses)</SelectItem>
                            <SelectItem value="reduced">5% (Reduced Rate)</SelectItem>
                            <SelectItem value="zero">0% (Zero Rate)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowChangeTaxRateDialog(false)}>Cancel</Button>
                        <Button type="submit" onClick={() => setShowChangeTaxRateDialog(false)}>Apply Change</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                
                <div className="min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search accounts..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground mb-4">
                {selectedCount === 0 ? 
                  "No accounts selected" : 
                  `${selectedCount} account${selectedCount === 1 ? '' : 's'} selected`}
              </div>

              <div className="rounded-md border">
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
                      <TableHead className="w-[100px]">
                        <div className="flex items-center gap-1">
                          Code
                          <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M7.5 3L4 7H11L7.5 3Z" fill="currentColor"/>
                            </svg>
                          </Button>
                        </div>
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Tax Rate</TableHead>
                      <TableHead>Report Code</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccounts.length > 0 ? (
                      filteredAccounts.map((account) => (
                        <TableRow key={account.id} className={account.nonDeletable ? "bg-gray-50" : ""}>
                          <TableCell>
                            <Checkbox 
                              checked={account.selected}
                              onCheckedChange={(checked: boolean) => handleSelectAccount(account.id, checked)}
                              aria-label={`Select ${account.name}`}
                              disabled={account.nonDeletable}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{account.code}</TableCell>
                          <TableCell className="text-blue-600 hover:underline cursor-pointer">
                            {account.name}
                            {account.nonDeletable && (
                              <div className="text-xs text-gray-500 normal-case mt-1">
                                {account.nonDeletableReason}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{account.type}</TableCell>
                          <TableCell>{account.taxRate}</TableCell>
                          <TableCell>{account.reportCode}</TableCell>
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
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 