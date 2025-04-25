"use client"

import * as React from "react"
import Link from "next/link"
import { format } from "date-fns"
import { ExternalLink, FileUp, Filter, Mail, Search } from "lucide-react"
import { DateRangePicker } from "@/components/date-range-picker"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [storeFilter, setStoreFilter] = React.useState<string | null>(null)
  const [supplierFilter, setSupplierFilter] = React.useState<string | null>(null)
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null)
  const [invoiceTypeFilter, setInvoiceTypeFilter] = React.useState<string | null>(null)
  const [activeTab, setActiveTab] = React.useState<string>("all")
  
  const filteredInvoices = invoices.filter(invoice => {
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
    const matchesStore = storeFilter ? invoice.store === storeFilter : true;
    const matchesSupplier = supplierFilter ? invoice.supplier === supplierFilter : true;
    const matchesStatus = statusFilter ? invoice.status === statusFilter : true;
    const matchesInvoiceType = invoiceTypeFilter ? invoice.invoiceType === invoiceTypeFilter : true;
    
    return matchesSearch && matchesStore && matchesSupplier && matchesStatus && matchesInvoiceType;
  });

  // Get unique values for filters
  const stores = Array.from(new Set(invoices.map(invoice => invoice.store)));
  const suppliers = Array.from(new Set(invoices.map(invoice => invoice.supplier)));
  const statuses = Array.from(new Set(invoices.map(invoice => invoice.status)));
  const invoiceTypes = Array.from(new Set(invoices.map(invoice => invoice.invoiceType)));

  // Get counts
  const allCount = invoices.filter(i => !i.archived && !i.deleted).length;
  const archivedCount = invoices.filter(i => i.archived).length;
  const deletedCount = invoices.filter(i => i.deleted).length;

  // Reset all filters
  const resetFilters = () => {
    setStoreFilter(null);
    setSupplierFilter(null);
    setStatusFilter(null);
    setInvoiceTypeFilter(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <DateRangePicker />
      </div>
      
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Invoices ({allCount})</TabsTrigger>
          <TabsTrigger value="archived">Archived ({archivedCount})</TabsTrigger>
          <TabsTrigger value="deleted">Deleted ({deletedCount})</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <Card>
        <CardContent className="p-6">
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
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                  {(storeFilter || supplierFilter || statusFilter || invoiceTypeFilter) && (
                    <span className="ml-1 rounded-full bg-primary w-2 h-2" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Filter Invoices</h4>
                  
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Store</h5>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {storeFilter || "All Stores"}
                          <Filter className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuItem onClick={() => setStoreFilter(null)}>
                          All Stores
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {stores.map(store => (
                          <DropdownMenuItem key={store} onClick={() => setStoreFilter(store)}>
                            {store}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Supplier</h5>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {supplierFilter || "All Suppliers"}
                          <Filter className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuItem onClick={() => setSupplierFilter(null)}>
                          All Suppliers
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {suppliers.map(supplier => (
                          <DropdownMenuItem key={supplier} onClick={() => setSupplierFilter(supplier)}>
                            {supplier}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Status</h5>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {statusFilter || "All Statuses"}
                          <Filter className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                          All Statuses
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {statuses.map(status => (
                          <DropdownMenuItem key={status} onClick={() => setStatusFilter(status)}>
                            {status}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Invoice Type</h5>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between">
                          {invoiceTypeFilter || "All Types"}
                          <Filter className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuItem onClick={() => setInvoiceTypeFilter(null)}>
                          All Types
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {invoiceTypes.map(type => (
                          <DropdownMenuItem key={type} onClick={() => setInvoiceTypeFilter(type)}>
                            {type}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <Button variant="outline" className="w-full" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4" />
                <span className="text-muted-foreground">invoices@franchiseai.com</span>
              </div>
              
              <Button className="gap-2">
                <FileUp className="h-4 w-4" />
                Upload Invoice
              </Button>
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Supplier Contact</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount (£)</TableHead>
                <TableHead>VAT (£)</TableHead>
                <TableHead>Account Code</TableHead>
                <TableHead>Invoice Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center border-l pl-2">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-6 text-muted-foreground">
                    No invoices found matching your filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className={invoice.archived ? "opacity-70" : ""}>
                    <TableCell>{invoice.invoiceNumber}</TableCell>
                    <TableCell>{invoice.store}</TableCell>
                    <TableCell>{invoice.supplier}</TableCell>
                    <TableCell>{format(invoice.date, "dd/MM/yyyy")}</TableCell>
                    <TableCell>£{invoice.amount.toFixed(2)}</TableCell>
                    <TableCell>£{invoice.vat.toFixed(2)}</TableCell>
                    <TableCell>{invoice.accountCode}</TableCell>
                    <TableCell>{invoice.invoiceType}</TableCell>
                    <TableCell>
                      <span className={getStatusClass(invoice.status)}>
                        {invoice.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-center border-l pl-2">
                      <Link 
                        href={`/accounting/invoices/${invoice.id}`}
                        className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        View
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
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

// Sample invoice data
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
    deleted: false
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
    deleted: false
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
    deleted: false
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
    deleted: false
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
    deleted: false
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
    deleted: false
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
    deleted: false
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
    deleted: false
  },
  // 10 additional invoice examples
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
    deleted: false
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
    deleted: false
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
    deleted: false
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
    deleted: false
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
    deleted: false
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
    deleted: true
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
    deleted: false
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
    deleted: false
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
    deleted: false
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
    deleted: false
  }
] 