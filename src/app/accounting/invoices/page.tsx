"use client"

import * as React from "react"
import { format } from "date-fns"
import { ExternalLink, FileUp, Mail, Search } from "lucide-react"
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
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import InvoicePdfPreviewer from "./components/InvoicePdfPreviewer";
import LineItemsSection from "./components/LineItemsSection";
import InvoiceSummary from "./components/InvoiceSummary";
import NotesSection from "./components/NotesSection";
import StoreAllocationSection from "./components/StoreAllocationSection";
import { invoices } from "./invoiceData";

// Removed unused Card, CardContent imports

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [storeFilter, setStoreFilter] = React.useState<string[]>([])
  const [supplierFilter, setSupplierFilter] = React.useState<string[]>([])
  const [statusFilter, setStatusFilter] = React.useState<string[]>([])
  const [invoiceTypeFilter, setInvoiceTypeFilter] = React.useState<string[]>([])
  const [activeTab, setActiveTab] = React.useState<string>("all")
  const [selectedInvoice, setSelectedInvoice] = React.useState<InvoiceData | null>(null)
  const [isEditing, setIsEditing] = React.useState(false)

  type InvoiceField = keyof InvoiceData;
  type InvoiceValue = InvoiceData[InvoiceField];

  const handleInvoiceChange = (field: InvoiceField, value: InvoiceValue) => {
    setSelectedInvoice(prev => prev ? { ...prev, [field]: value } : prev);
  };

  // Always derive stores from invoices for filtering and selector
  const stores = React.useMemo(() => {
    // Defensive: filter out falsy/empty store names
    return Array.from(new Set((invoices ?? []).map(invoice => invoice.store).filter(Boolean)));
  }, []);

  const statuses = React.useMemo(() => Array.from(new Set(invoices.map(i => i.status))), []);
  const invoiceTypes = React.useMemo(() => Array.from(new Set(invoices.map(i => i.invoiceType))), []);

  // Simplified and robust filtering logic
  const filteredInvoices = React.useMemo(() => {
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
  }, [activeTab, searchQuery, storeFilter, supplierFilter, statusFilter, invoiceTypeFilter]);

  // Get unique values for filters
  const suppliers = Array.from(new Set(invoices.map(invoice => invoice.supplier)));

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

  const handleSaveInvoiceChanges = () => {
    // TO DO: implement save logic
    setIsEditing(false);
  };

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

  // Wrapper for setLineItems to ensure correct type
  const setLineItemsWrapper: React.Dispatch<React.SetStateAction<LineItem[]>> = (newItems) => {
    if (typeof newItems === 'function') {
      // Updater function
      setSelectedInvoice(prev => {
        if (!prev) return prev;
        const updated = (newItems as (prevState: LineItem[]) => LineItem[])(prev.lineItems ?? []);
        return { ...prev, lineItems: updated };
      });
    } else {
      handleInvoiceChange('lineItems', newItems as LineItem[]);
    }
  };

  // Wrapper for setStoreAllocations to ensure correct type
  const setStoreAllocationsWrapper: React.Dispatch<React.SetStateAction<StoreAllocation[]>> = (newAllocations) => {
    if (typeof newAllocations === 'function') {
      setSelectedInvoice(prev => {
        if (!prev) return prev;
        const updated = (newAllocations as (prevState: StoreAllocation[]) => StoreAllocation[])(prev.storeAllocations ?? []);
        return { ...prev, storeAllocations: updated };
      });
    } else {
      handleInvoiceChange('storeAllocations', newAllocations as StoreAllocation[]);
    }
  };

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

      <div className="flex h-full w-full">
        {/* Invoice List */}
        <div className="flex flex-col w-[400px] min-w-[280px] max-w-[480px] border-r bg-white h-full transition-all duration-300">
          {/* Filter buttons row */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Filters</h2>
            <div className="flex items-center gap-2">
              <Button variant="secondary" onClick={resetFilters}>Reset Filters</Button>
            </div>
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
                        setSelectedInvoice(invoice);
                      }}
                      style={{ userSelect: "none" }}
                    >
                      <TableCell>
                        <span
                          className="inline-flex items-center gap-1 text-blue-600 hover:underline cursor-pointer"
                          onClick={() => setSelectedInvoice(invoice)}
                        >
                          {invoice.invoiceNumber}
                          <ExternalLink className="h-3 w-3" />
                        </span>
                      </TableCell>
                      <TableCell>{invoice.supplier}</TableCell>
                      <TableCell>{format(invoice.date, "dd/MM/yyyy")}</TableCell>
                      <TableCell>£{invoice.total.toFixed(2)}</TableCell>
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
        {/* Details Pane - right side */}
        <div className="flex-1 flex flex-col h-full bg-[#fafbfc] p-6 overflow-auto transition-all duration-300">
          {/* ...existing details pane rendering... */}
          {!selectedInvoice ? (
            <div>Select an invoice to preview</div>
          ) : (
            <div className="max-w-3xl w-full mx-auto bg-white rounded-xl shadow p-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">Invoice #{selectedInvoice.invoiceNumber}</h2>
                  <div className="text-muted-foreground text-sm">View the details of invoice #{selectedInvoice.invoiceNumber}</div>
                </div>
                <div className="flex gap-2">
                  <Button variant={isEditing ? "secondary" : "outline"} size="sm" onClick={() => setIsEditing(e => !e)}>{isEditing ? "Cancel" : "Edit"}</Button>
                  <Button variant="outline" size="sm">Actions</Button>
                  <Button variant="ghost" size="sm" onClick={() => { setSelectedInvoice(null); setIsEditing(false); }}>Back to list</Button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                  <div className="text-xs text-muted-foreground">Invoice Number</div>
                  <div className="font-medium">{selectedInvoice.invoiceNumber}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Date</div>
                  {isEditing ? (
                    <Input type="date" value={format(selectedInvoice.date, 'yyyy-MM-dd')} onChange={e => handleInvoiceChange('date', new Date(e.target.value))} />
                  ) : (
                    <div className="font-medium">{format(selectedInvoice.date, 'dd MMM yyyy')}</div>
                  )}
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Status</div>
                  <span className="inline-block rounded px-2 py-1 text-xs font-semibold bg-green-100 text-green-700">{selectedInvoice.status}</span>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Store</div>
                  {isEditing ? (
                    <Input value={selectedInvoice.store} onChange={e => handleInvoiceChange('store', e.target.value)} />
                  ) : (
                    <div className="font-medium">{selectedInvoice.store}</div>
                  )}
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Supplier</div>
                  {isEditing ? (
                    <Input value={selectedInvoice.supplier} onChange={e => handleInvoiceChange('supplier', e.target.value)} />
                  ) : (
                    <div className="font-medium">{selectedInvoice.supplier}</div>
                  )}
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Invoice Type</div>
                  {isEditing ? (
                    <Input value={selectedInvoice.invoiceType} onChange={e => handleInvoiceChange('invoiceType', e.target.value)} />
                  ) : (
                    <div className="font-medium">{selectedInvoice.invoiceType}</div>
                  )}
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Account Code</div>
                  {isEditing ? (
                    <Input value={selectedInvoice.accountCode} onChange={e => handleInvoiceChange('accountCode', e.target.value)} />
                  ) : (
                    <div className="font-medium">{selectedInvoice.accountCode}</div>
                  )}
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">VAT Rate (%)</div>
                  {isEditing ? (
                    <Input value={selectedInvoice.vatRate} onChange={e => handleInvoiceChange('vatRate', Number(e.target.value))} />
                  ) : (
                    <div className="font-medium">{selectedInvoice.vatRate}%</div>
                  )}
                </div>
              </div>
              {/* PDF Previewer */}
              <div className="mb-6">
                <InvoicePdfPreviewer
                  pdfUrl={selectedInvoice.previewType === "pdf" ? `/invoice-previews/${selectedInvoice.previewUrl}` : undefined}
                  invoiceNumber={selectedInvoice.invoiceNumber}
                />
              </div>
              {/* Editable Line Items Section */}
              <LineItemsSection
                lineItems={selectedInvoice.lineItems ?? []}
                setLineItems={isEditing ? setLineItemsWrapper : () => {}}
                isEditing={isEditing}
              />
              <InvoiceSummary
                subtotal={selectedInvoice.subtotal ?? 0}
                vatRate={selectedInvoice.vatRate ?? 0}
                vat={selectedInvoice.vat ?? 0}
                total={selectedInvoice.total ?? 0}
              />
              <NotesSection
                notes={selectedInvoice.notes || ""}
                isEditing={isEditing}
                onNotesChange={isEditing ? val => handleInvoiceChange('notes', val) : () => {}}
              />
              <StoreAllocationSection
                storeAllocations={selectedInvoice.storeAllocations || []}
                setStoreAllocations={isEditing ? setStoreAllocationsWrapper : () => {}}
                invoiceTotal={selectedInvoice.total ?? 0}
                isEditing={isEditing}
                stores={stores}
              />
              {isEditing && (
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="default" onClick={handleSaveInvoiceChanges}>Save</Button>
                  <Button variant="outline" onClick={() => { setIsEditing(false); }}>Cancel</Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}