"use client"

import * as React from "react"
import Link from "next/link"
import { format } from "date-fns"
import { ExternalLink, FileUp, Filter, Mail, Search } from "lucide-react"
import { DateRangePicker } from "@/components/date-range-picker"
import type { InvoiceData, LineItem, StoreAllocation } from "./components/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import InvoicePdfPreviewer from "./components/InvoicePdfPreviewer";

// Removed unused Card, CardContent imports

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [storeFilter, setStoreFilter] = React.useState<string[]>([])
  const [supplierFilter, setSupplierFilter] = React.useState<string[]>([])
  const [statusFilter, setStatusFilter] = React.useState<string[]>([])
  const [invoiceTypeFilter, setInvoiceTypeFilter] = React.useState<string[]>([])
  const [activeTab, setActiveTab] = React.useState<string>("all")
  const [selectedInvoice, setSelectedInvoice] = React.useState<InvoiceData | null>(null)

  // Patch: Add a runtime type adapter for InvoiceData selection
  function toInvoiceData(invoice: Record<string, unknown>): InvoiceData {
    return {
      id: invoice.id as string,
      invoiceNumber: invoice.invoiceNumber as string,
      store: invoice.store as string,
      supplier: invoice.supplier as string,
      date: invoice.date as Date,
      subtotal: (invoice.subtotal as number) ?? (invoice.amount as number) ?? 0,
      vatRate: (invoice.vatRate as number) ?? 20,
      vat: (invoice.vat as number) ?? 0,
      total: (invoice.total as number) ?? ((invoice.amount as number) ?? 0) + ((invoice.vat as number) ?? 0),
      accountCode: invoice.accountCode as string,
      invoiceType: invoice.invoiceType as string,
      status: invoice.status as string,
      previewType: invoice.previewType as string,
      previewUrl: invoice.previewUrl as string,
      archived: (invoice.archived as boolean) ?? false,
      deleted: (invoice.deleted as boolean) ?? false,
      notes: (invoice.notes as string) ?? '',
      lineItems: Array.isArray(invoice.lineItems) ? (invoice.lineItems as LineItem[]) : [],
      storeAllocations: Array.isArray(invoice.storeAllocations) ? (invoice.storeAllocations as StoreAllocation[]) : [],
    };
  }

  // Always derive stores from invoices for filtering and selector
  const stores = React.useMemo(() => {
    // Defensive: filter out falsy/empty store names
    return Array.from(new Set((invoices ?? []).map(invoice => invoice.store).filter(Boolean)));
  }, [invoices]);

  // Simplified and robust filtering logic
  const filteredInvoices = React.useMemo(() => {
    const showAll = true;
    return invoices.filter(invoice => {
      // Filter by tab
      if (activeTab === "archived" && !invoice.archived) return false;
      if (activeTab === "deleted" && !invoice.deleted) return false;
      if (activeTab === "all" && (invoice.archived || invoice.deleted)) return false;
      // Search filter
      const matchesSearch = 
        invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.store.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.supplier.toLowerCase().includes(searchQuery.toLowerCase());
      // Other filters
      const matchesStore = storeFilter.length ? storeFilter.includes(invoice.store) : true;
      const matchesSupplier = supplierFilter.length ? supplierFilter.includes(invoice.supplier) : true;
      const matchesStatus = statusFilter.length ? statusFilter.includes(invoice.status) : true;
      const matchesInvoiceType = invoiceTypeFilter.length ? invoiceTypeFilter.includes(invoice.invoiceType) : true;
      return matchesSearch && matchesStore && matchesSupplier && matchesStatus && matchesInvoiceType;
    });
  }, [invoices, activeTab, searchQuery, storeFilter, supplierFilter, statusFilter, invoiceTypeFilter]);

  // Get unique values for filters
  const suppliers = Array.from(new Set(invoices.map(invoice => invoice.supplier)));
  const statuses = Array.from(new Set(invoices.map(invoice => invoice.status)));
  const invoiceTypes = Array.from(new Set(invoices.map(invoice => invoice.invoiceType)));

  // Get counts
  const allCount = invoices.filter(i => !i.archived && !i.deleted).length;
  const archivedCount = invoices.filter(i => i.archived).length;
  const deletedCount = invoices.filter(i => i.deleted).length;

  // Reset all filters
  const resetFilters = () => {
    setStoreFilter([]);
    setSupplierFilter([]);
    setStatusFilter([]);
    setInvoiceTypeFilter([]);
  };

  // Only show invoices if all companies are selected
  const showInvoices = true;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <DateRangePicker />
      </div>
      
      {/* Tabs and actions row */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        {/* Tabs (All Invoices, Archived, Deleted) */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 min-w-[320px]">
          <TabsList>
            <TabsTrigger value="all">All Invoices ({allCount})</TabsTrigger>
            <TabsTrigger value="archived">Archived ({archivedCount})</TabsTrigger>
            <TabsTrigger value="deleted">Deleted ({deletedCount})</TabsTrigger>
          </TabsList>
        </Tabs>
        {/* Actions: Email and Upload button */}
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm flex items-center gap-1">
            <Mail className="h-4 w-4" /> invoices@franchiseai.com
          </span>
          <Button variant="default" className="ml-2 flex items-center gap-2">
            <FileUp className="h-4 w-4" /> Upload Invoice
          </Button>
        </div>
      </div>
      
      <div className="flex gap-8 flex-1 min-h-0" style={{height: 'calc(100vh - 180px)'}}>
        {/* Invoice List Card */}
        <div className="flex-1 min-w-[400px] flex flex-col min-h-0">
          <div className="border rounded-lg bg-white flex flex-col shadow-sm flex-1 min-h-0">
            <div className="p-6 flex-1 flex flex-col overflow-x-auto min-h-0">
              {/* Filter buttons row */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium">Filters</h2>
                <Button variant="secondary" onClick={resetFilters}>Reset Filters</Button>
              </div>
              <div className="flex items-center gap-2 mb-4">
                {/* Store Filter Button */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center justify-center px-2 py-1 text-sm">
                      Stores
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuItem onClick={() => setStoreFilter([])}>
                      All Stores
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {stores.map(store => (
                      <DropdownMenuCheckboxItem key={store} checked={storeFilter.includes(store)} onClick={() => {
                        if (storeFilter.includes(store)) {
                          setStoreFilter(storeFilter.filter(s => s !== store));
                        } else {
                          setStoreFilter([...storeFilter, store]);
                        }
                      }}>
                        {store}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* Supplier Filter Button */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center justify-center px-2 py-1 text-sm">
                      Suppliers
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuItem onClick={() => setSupplierFilter([])}>
                      All Suppliers
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {suppliers.map(supplier => (
                      <DropdownMenuCheckboxItem key={supplier} checked={supplierFilter.includes(supplier)} onClick={() => {
                        if (supplierFilter.includes(supplier)) {
                          setSupplierFilter(supplierFilter.filter(s => s !== supplier));
                        } else {
                          setSupplierFilter([...supplierFilter, supplier]);
                        }
                      }}>
                        {supplier}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* Status Filter Button */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center justify-center px-2 py-1 text-sm">
                      Statuses
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuItem onClick={() => setStatusFilter([])}>
                      All Statuses
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {statuses.map(status => (
                      <DropdownMenuCheckboxItem key={status} checked={statusFilter.includes(status)} onClick={() => {
                        if (statusFilter.includes(status)) {
                          setStatusFilter(statusFilter.filter(s => s !== status));
                        } else {
                          setStatusFilter([...statusFilter, status]);
                        }
                      }}>
                        {status}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* Invoice Type Filter Button */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center justify-center px-2 py-1 text-sm">
                      Types
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuItem onClick={() => setInvoiceTypeFilter([])}>
                      All Types
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {invoiceTypes.map(type => (
                      <DropdownMenuCheckboxItem key={type} checked={invoiceTypeFilter.includes(type)} onClick={() => {
                        if (invoiceTypeFilter.includes(type)) {
                          setInvoiceTypeFilter(invoiceTypeFilter.filter(t => t !== type));
                        } else {
                          setInvoiceTypeFilter([...invoiceTypeFilter, type]);
                        }
                      }}>
                        {type}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center mb-6 gap-4 flex-wrap">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search invoices..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    
                  </div>
                  
                </div>
              </div>
              
              {showInvoices ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice #</TableHead>
                      <TableHead>Supplier Contact</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount (£)</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                          No invoices found matching your filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInvoices.map((invoice) => (
                        <TableRow
                          key={invoice.id}
                          className={invoice.archived ? "opacity-70 cursor-pointer" : "cursor-pointer"}
                          onClick={e => {
                            // Prevent row click if invoice number link is clicked
                            if ((e.target as HTMLElement).closest("a")) return;
                            setSelectedInvoice(toInvoiceData(invoice));
                          }}
                          style={{ userSelect: "none" }}
                        >
                          <TableCell>
                            <Link 
                              href={`/accounting/invoices/${invoice.id}`}
                              className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                              onClick={e => e.stopPropagation()}
                            >
                              {invoice.invoiceNumber}
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          </TableCell>
                          <TableCell>{invoice.supplier}</TableCell>
                          <TableCell>{format(invoice.date, "dd/MM/yyyy")}</TableCell>
                          <TableCell>£{invoice.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <span className={getStatusClass(invoice.status)}>
                              {invoice.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex-1 flex items-center justify-center text-lg text-muted-foreground">
                  Select stores
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Invoice PDF Previewer Card */}
        <div className="flex-[2_1_0%] h-full min-w-[320px]">
          <InvoicePdfPreviewer
            pdfUrl={selectedInvoice && selectedInvoice.previewType === "pdf" && selectedInvoice.previewUrl ? `/invoice-previews/${selectedInvoice.previewUrl}` : undefined}
            invoiceNumber={selectedInvoice?.invoiceNumber}
          />
        </div>
      </div>
    </div>
  )
}

function getStatusClass(status: string) {
  switch (status) {
    case "AI Processed":
      return "text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs font-medium"
    case "Pending AI":
      return "text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-xs font-medium"
    case "Needs Human Review":
      return "text-red-600 bg-red-50 px-2 py-1 rounded-full text-xs font-medium"
    case "Duplicate?":
      return "text-purple-600 bg-purple-50 px-2 py-1 rounded-full text-xs font-medium"
    default:
      return "text-gray-600 bg-gray-50 px-2 py-1 rounded-full text-xs font-medium"
  }
}

// After already-mapped invoices, sequentially assign these PDF filenames to the next unmapped invoices:
const pdfFilenames = [
  "1st_Waste_Management_2024-10-...Credit Memo).pdf",
  "CustAccountStatementExt.Report....pdf",
  "CustAccountStatementExt.Report....pdf",
  "KeyIndicatorsStoreDhillon - Novem....pdf",
  "Text_Management_2024-10-08_28....pdf",
  "Verlingue_2024-10-09_42693.99.pdf"
];

let pdfIndex = 0;
const invoices = [
  {
    id: "1",
    invoiceNumber: "INV-001",
    store: "Kings Hill",
    supplier: "Coca Cola",
    date: new Date("2023-05-01"),
    amount: 456.78,
    vat: 91.36,
    accountCode: "5000-COGS",
    invoiceType: "Purchase Invoice",
    status: "AI Processed",
    archived: false,
    deleted: false,
    previewType: "pdf",
    previewUrl: "INV-001.pdf"
  },
  {
    id: "2",
    invoiceNumber: "INV-002",
    store: "Tonbridge",
    supplier: "Eden Farms",
    date: new Date("2023-05-05"),
    amount: 231.50,
    vat: 46.30,
    accountCode: "5000-COGS",
    invoiceType: "Purchase Invoice",
    status: "AI Processed",
    archived: false,
    deleted: false,
    previewType: "pdf",
    previewUrl: "invoice-eden-farms.pdf"
  },
  {
    id: "3",
    invoiceNumber: "INV-003",
    store: "Tunbridge Wells",
    supplier: "Pepsi Co",
    date: new Date("2023-05-12"),
    amount: 789.25,
    vat: 157.85,
    accountCode: "5000-COGS",
    invoiceType: "Purchase Invoice",
    status: "Pending AI",
    archived: false,
    deleted: false,
    previewType: "pdf",
    previewUrl: pdfFilenames[pdfIndex++]
  },
  {
    id: "4",
    invoiceNumber: "INV-004",
    store: "Kings Hill",
    supplier: "Office Supplies Ltd",
    date: new Date("2023-05-15"),
    amount: 345.60,
    vat: 69.12,
    accountCode: "6500-OFFICE",
    invoiceType: "Purchase Invoice",
    status: "AI Processed",
    archived: false,
    deleted: false,
    previewType: "pdf",
    previewUrl: pdfFilenames[pdfIndex++]
  },
  {
    id: "5",
    invoiceNumber: "INV-005",
    store: "Tonbridge",
    supplier: "Utility Services",
    date: new Date("2023-05-20"),
    amount: 567.90,
    vat: 113.58,
    accountCode: "6400-UTIL",
    invoiceType: "Purchase Invoice",
    status: "Needs Human Review",
    archived: false,
    deleted: false,
    previewType: "pdf",
    previewUrl: pdfFilenames[pdfIndex++]
  },
  {
    id: "6",
    invoiceNumber: "CN-001",
    store: "Tunbridge Wells",
    supplier: "Eden Farms",
    date: new Date("2023-05-25"),
    amount: 123.45,
    vat: 24.69,
    accountCode: "5000-COGS",
    invoiceType: "Credit Note",
    status: "Pending AI",
    archived: false,
    deleted: false,
    previewType: "pdf",
    previewUrl: pdfFilenames[pdfIndex++]
  },
  {
    id: "7",
    invoiceNumber: "SI-001",
    store: "Southborough",
    supplier: "Marketing Agency",
    date: new Date("2023-06-01"),
    amount: 678.90,
    vat: 135.78,
    accountCode: "4000-SALES",
    invoiceType: "Sales Invoice",
    status: "AI Processed",
    archived: false,
    deleted: false,
    previewType: "pdf",
    previewUrl: pdfFilenames[pdfIndex++]
  },
  {
    id: "8",
    invoiceNumber: "SI-002",
    store: "Southborough",
    supplier: "Equipment Ltd",
    date: new Date("2023-06-05"),
    amount: 234.56,
    vat: 46.91,
    accountCode: "4000-SALES",
    invoiceType: "Sales Invoice",
    status: "Needs Human Review",
    archived: false,
    deleted: false,
    previewType: "pdf",
    previewUrl: pdfFilenames[pdfIndex++]
  },
  {
    id: "9",
    invoiceNumber: "INV-006",
    store: "Kings Hill",
    supplier: "ABC Cleaning",
    date: new Date("2023-06-10"),
    amount: 432.19,
    vat: 86.44,
    accountCode: "6300-CLEAN",
    invoiceType: "Purchase Invoice",
    status: "AI Processed",
    archived: false,
    deleted: false,
    previewType: "pdf",
    previewUrl: pdfFilenames[pdfIndex++]
  },
  {
    id: "10",
    invoiceNumber: "INV-007",
    store: "Tonbridge",
    supplier: "Kent Vegetables Ltd",
    date: new Date("2023-06-15"),
    amount: 298.45,
    vat: 59.69,
    accountCode: "5000-COGS",
    invoiceType: "Purchase Invoice",
    status: "Duplicate?",
    archived: false,
    deleted: false,
    previewType: "pdf",
    previewUrl: pdfFilenames[pdfIndex++]
  },
  {
    id: "11",
    invoiceNumber: "INV-008",
    store: "Tunbridge Wells",
    supplier: "Local Meats",
    date: new Date("2023-06-18"),
    amount: 634.90,
    vat: 126.98,
    accountCode: "5000-COGS",
    invoiceType: "Purchase Invoice",
    status: "AI Processed",
    archived: true,
    deleted: false,
    previewType: "pdf",
    previewUrl: pdfFilenames[pdfIndex++]
  },
  {
    id: "12",
    invoiceNumber: "INV-009",
    store: "Southborough",
    supplier: "Global Distribution",
    date: new Date("2023-06-20"),
    amount: 542.75,
    vat: 108.55,
    accountCode: "5000-COGS",
    invoiceType: "Purchase Invoice",
    status: "Pending AI",
    archived: false,
    deleted: false,
    previewType: "pdf",
    previewUrl: pdfFilenames[pdfIndex++]
  },
  {
    id: "13",
    invoiceNumber: "CN-002",
    store: "Kings Hill",
    supplier: "ABC Cleaning",
    date: new Date("2023-06-22"),
    amount: 98.50,
    vat: 19.70,
    accountCode: "6300-CLEAN",
    invoiceType: "Credit Note",
    status: "AI Processed",
    archived: false,
    deleted: false,
    previewType: "pdf",
    previewUrl: pdfFilenames[pdfIndex++]
  },
  {
    id: "14",
    invoiceNumber: "SI-003",
    store: "Tonbridge",
    supplier: "Franchise Partner #1",
    date: new Date("2023-06-25"),
    amount: 1245.30,
    vat: 249.06,
    accountCode: "4000-SALES",
    invoiceType: "Sales Invoice",
    status: "Duplicate?",
    archived: false,
    deleted: true,
    previewType: "pdf",
    previewUrl: pdfFilenames[pdfIndex++]
  },
  {
    id: "15",
    invoiceNumber: "INV-010",
    store: "Tunbridge Wells",
    supplier: "Kent Vegetables Ltd",
    date: new Date("2023-06-28"),
    amount: 301.20,
    vat: 60.24,
    accountCode: "5000-COGS",
    invoiceType: "Purchase Invoice",
    status: "Duplicate?",
    archived: false,
    deleted: false,
    previewType: "pdf",
    previewUrl: pdfFilenames[pdfIndex++]
  },
  {
    id: "16",
    invoiceNumber: "INV-011",
    store: "Southborough",
    supplier: "Tech Solutions",
    date: new Date("2023-07-01"),
    amount: 876.40,
    vat: 175.28,
    accountCode: "6700-TECH",
    invoiceType: "Purchase Invoice",
    status: "Needs Human Review",
    archived: true,
    deleted: false,
    previewType: "pdf",
    previewUrl: pdfFilenames[pdfIndex++]
  },
  {
    id: "17",
    invoiceNumber: "INV-012",
    store: "Kings Hill",
    supplier: "Building Maintenance",
    date: new Date("2023-07-05"),
    amount: 1340.85,
    vat: 268.17,
    accountCode: "6200-MAINT",
    invoiceType: "Purchase Invoice",
    status: "AI Processed",
    archived: true,
    deleted: false,
    previewType: "pdf",
    previewUrl: pdfFilenames[pdfIndex++]
  },
  {
    id: "18",
    invoiceNumber: "SI-004",
    store: "Tonbridge",
    supplier: "Corporate Event",
    date: new Date("2023-07-10"),
    amount: 2150.00,
    vat: 430.00,
    accountCode: "4000-SALES",
    invoiceType: "Sales Invoice",
    status: "AI Processed",
    archived: false,
    deleted: false,
    previewType: "pdf",
    previewUrl: pdfFilenames[pdfIndex++]
  }
] 