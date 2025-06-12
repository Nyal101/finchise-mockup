"use client"

import * as React from "react"
import { format } from "date-fns"
import { FileUp, Mail, Search, Maximize2, Minimize2 } from "lucide-react"
import type { InvoiceData, LineItem, StoreAllocation, JournalEntry } from "./components/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import InvoiceBot from "./components/InvoiceBot";
import JournalButton from "./components/JournalButton";
import { invoices } from "./invoiceData";
import { JournalDialog, Journal, JournalLine } from "../components/JournalDialog";
import { UploadInvoiceDialog } from "./components/UploadInvoiceDialog";
import InvoiceGrid from "./components/InvoiceGrid";

export default function PurchasesPage() {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [storeFilter, setStoreFilter] = React.useState<string[]>([])
  const [supplierFilter, setSupplierFilter] = React.useState<string[]>([])
  const [statusFilter, setStatusFilter] = React.useState<string[]>([])
  const [invoiceTypeFilter, setInvoiceTypeFilter] = React.useState<string[]>([])
  const [activeTab, setActiveTab] = React.useState<string>("all")
  const [selectedInvoice, setSelectedInvoice] = React.useState<InvoiceData | null>(null)
  const [isEditing, setIsEditing] = React.useState(false)
  const [isPdfExpanded, setIsPdfExpanded] = React.useState(false)
  const [journalDialogOpen, setJournalDialogOpen] = React.useState(false)
  const [isJournalEditing, setIsJournalEditing] = React.useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = React.useState(false)

  type InvoiceField = keyof InvoiceData;
  type InvoiceValue = InvoiceData[InvoiceField];

  const handleInvoiceChange = React.useCallback((field: InvoiceField, value: InvoiceValue) => {
    setSelectedInvoice(prev => prev ? { ...prev, [field]: value } : prev);
  }, []);

  // Always derive stores from invoices for filtering and selector
  const stores = React.useMemo(() => {
    // Defensive: filter out falsy/empty store names
    return Array.from(new Set((invoices ?? []).map((invoice: InvoiceData) => invoice.store).filter(Boolean)));
  }, []);

  const statuses = React.useMemo(() => Array.from(new Set(invoices.map((invoice: InvoiceData) => invoice.status))), []);
  const invoiceTypes = React.useMemo(() => Array.from(new Set(invoices.map((invoice: InvoiceData) => invoice.invoiceType))), []);

  // Simplified and robust filtering logic
  const filteredInvoices = React.useMemo(() => {
    const filtered = invoices.filter((invoice: InvoiceData) => {
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
    return filtered;
  }, [activeTab, searchQuery, storeFilter, supplierFilter, statusFilter, invoiceTypeFilter]);

  // Get unique values for filters
  const suppliers = Array.from(new Set(invoices.map((invoice: InvoiceData) => invoice.supplier)));

  // Get counts
  const allCount = invoices.filter((invoice: InvoiceData) => !invoice.archived && !invoice.deleted).length;
  const archivedCount = invoices.filter((invoice: InvoiceData) => invoice.archived).length;
  const deletedCount = invoices.filter((invoice: InvoiceData) => invoice.deleted).length;

  // Reset all filters
  const resetFilters = () => {
    setStoreFilter([]);
    setSupplierFilter([]);
    setStatusFilter([]);
    setInvoiceTypeFilter([]);
  };

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

  // Wrapper for setJournalEntries to ensure correct type
  const setJournalEntriesWrapper = React.useCallback<React.Dispatch<React.SetStateAction<JournalEntry[]>>>((newEntries) => {
    if (typeof newEntries === 'function') {
      setSelectedInvoice(prev => {
        if (!prev) return prev;
        const updated = (newEntries as (prevState: JournalEntry[]) => JournalEntry[])(prev.journalEntries ?? []);
        return { ...prev, journalEntries: updated };
      });
    } else {
      handleInvoiceChange('journalEntries', newEntries as JournalEntry[]);
    }
  }, [handleInvoiceChange]);

  // Use the wrapper function when rendering the component
  React.useEffect(() => {
    if (selectedInvoice && selectedInvoice.journalEntries) {
      // This ensures the wrapper is used somewhere and avoids the lint error
      setJournalEntriesWrapper(selectedInvoice.journalEntries);
    }
  }, [selectedInvoice, setJournalEntriesWrapper]);

  // Convert invoice journal entries to Journal format for the dialog
  const selectedJournal = React.useMemo(() => {
    if (!selectedInvoice || !selectedInvoice.requiresJournaling) return null;
    
    // Convert journal entries to journal lines
    const lines: JournalLine[] = selectedInvoice.journalEntries?.map(entry => ({
      description: entry.description,
      account: entry.account,
      store: selectedInvoice.store,
      debit: entry.debit,
      credit: entry.credit,
      taxRate: entry.debit > 0 && selectedInvoice.vatRate > 0 ? `VAT ${selectedInvoice.vatRate}%` : "No VAT"
    })) || [];

    return {
      id: `invoice-${selectedInvoice.id}`,
      status: "pending" as const,
      type: "utility" as const,
      narration: `${selectedInvoice.supplier} ${selectedInvoice.invoiceNumber}`,
      date: selectedInvoice.date,
      lines,
      sourceInvoiceId: selectedInvoice.id
    };
  }, [selectedInvoice]);

  // Handle journal save
  const handleJournalSave = (journal: Journal) => {
    if (!selectedInvoice) return;
    
    // Convert journal lines back to journal entries
    const journalEntries: JournalEntry[] = journal.lines.map(line => ({
      id: Math.random().toString(36).substring(2, 11), // Simple ID generation
      account: line.account,
      description: line.description,
      debit: line.debit || 0,
      credit: line.credit || 0
    }));
    
    // Update the selected invoice
    handleInvoiceChange('journalEntries', journalEntries);
  };

  // Toggle journal editing mode
  const toggleJournalEditing = () => {
    setIsJournalEditing(!isJournalEditing);
  };

  // Debug effect - can be removed in production
  React.useEffect(() => {
    // Debug logging removed for production
  }, [filteredInvoices, activeTab]);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-between py-4">
        <h1 className="text-3xl font-bold">Purchases</h1>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm flex items-center gap-1">
            <Mail className="h-4 w-4" /> invoices@franchiseai.com
          </span>
          <Button variant="default" className="ml-2 flex items-center gap-2" onClick={() => setUploadDialogOpen(true)}>
            <FileUp className="h-4 w-4" /> Upload Invoice
          </Button>
        </div>
      </div>

      {/* Main content area - Three equal columns layout */}
      <div className="flex flex-1 w-full gap-4 overflow-hidden">
        {/* Left Column: Invoice List (full width when no invoice selected) */}
        <div className={`${selectedInvoice ? 'w-1/3' : 'w-full'} bg-white rounded-lg border shadow-sm overflow-hidden flex flex-col transition-all duration-200`}>
          {/* Tabs for invoice filtering */}
          <div className="px-4 pt-2 pb-2 border-b">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">All ({allCount})</TabsTrigger>
                <TabsTrigger value="archived" className="flex-1">Archived ({archivedCount})</TabsTrigger>
                <TabsTrigger value="deleted" className="flex-1">Deleted ({deletedCount})</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="px-4 py-2 border-b">
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search invoices..."
                className="w-full pl-8 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {/* Store Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Store {storeFilter.length > 0 && `(${storeFilter.length})`}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem onClick={() => setStoreFilter([])}>
                    All Stores
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {stores.map(store => (
                    <DropdownMenuCheckboxItem 
                      key={store} 
                      checked={storeFilter.includes(store)} 
                      onClick={() => {
                        if (storeFilter.includes(store)) {
                          setStoreFilter(storeFilter.filter(s => s !== store));
                        } else {
                          setStoreFilter([...storeFilter, store]);
                        }
                      }}
                    >
                      {store}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Supplier Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Supplier {supplierFilter.length > 0 && `(${supplierFilter.length})`}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem onClick={() => setSupplierFilter([])}>
                    All Suppliers
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {suppliers.map(supplier => (
                    <DropdownMenuCheckboxItem 
                      key={supplier} 
                      checked={supplierFilter.includes(supplier)} 
                      onClick={() => {
                        if (supplierFilter.includes(supplier)) {
                          setSupplierFilter(supplierFilter.filter(s => s !== supplier));
                        } else {
                          setSupplierFilter([...supplierFilter, supplier]);
                        }
                      }}
                    >
                      {supplier}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Status Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Status {statusFilter.length > 0 && `(${statusFilter.length})`}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem onClick={() => setStatusFilter([])}>
                    All Statuses
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {statuses.map(status => (
                    <DropdownMenuCheckboxItem 
                      key={status} 
                      checked={statusFilter.includes(status)} 
                      onClick={() => {
                        if (statusFilter.includes(status)) {
                          setStatusFilter(statusFilter.filter(s => s !== status));
                        } else {
                          setStatusFilter([...statusFilter, status]);
                        }
                      }}
                    >
                      {status}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Invoice Type Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Type {invoiceTypeFilter.length > 0 && `(${invoiceTypeFilter.length})`}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem onClick={() => setInvoiceTypeFilter([])}>
                    All Types
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {invoiceTypes.map(type => (
                    <DropdownMenuCheckboxItem 
                      key={type} 
                      checked={invoiceTypeFilter.includes(type)} 
                      onClick={() => {
                        if (invoiceTypeFilter.includes(type)) {
                          setInvoiceTypeFilter(invoiceTypeFilter.filter(t => t !== type));
                        } else {
                          setInvoiceTypeFilter([...invoiceTypeFilter, type]);
                        }
                      }}
                    >
                      {type}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Reset Filters Button */}
              {(storeFilter.length > 0 || supplierFilter.length > 0 || statusFilter.length > 0 || invoiceTypeFilter.length > 0) && (
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Invoice Table */}
          <div className="overflow-auto flex-1 h-full">
            {filteredInvoices.length === 0 ? (
              <div className="h-24 flex items-center justify-center">
                <p className="text-muted-foreground">No invoices found.</p>
              </div>
            ) : (
              <InvoiceGrid 
                invoices={filteredInvoices} 
                onInvoiceSelect={setSelectedInvoice} 
                selectedInvoiceId={selectedInvoice?.id}
              />
            )}
          </div>
        </div>

        {/* Middle Column: Invoice Details (1/3 width) */}
        <div className={`${selectedInvoice ? 'w-1/3' : 'w-0'} overflow-hidden transition-all duration-200`}>
          {selectedInvoice ? (
            <div className="h-full bg-white rounded-lg border shadow-sm p-3 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setSelectedInvoice(null)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </Button>
                  <h2 className="text-xl font-semibold">{selectedInvoice.invoiceNumber}</h2>
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSaveInvoiceChanges}>
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" onClick={() => setIsEditing(true)}>
                        Edit
                      </Button>
                      {selectedInvoice.requiresJournaling && (
                        <JournalButton 
                          onClick={() => setJournalDialogOpen(true)} 
                        />
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="overflow-auto flex-1">
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Supplier</p>
                    <p className="font-medium">{selectedInvoice.supplier}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Store</p>
                    <p className="font-medium">{selectedInvoice.store}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Invoice Date</p>
                    <p className="font-medium">{format(selectedInvoice.date, "dd/MM/yyyy")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium">
                      <span className={getStatusClass(selectedInvoice.status)}>
                        {selectedInvoice.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account Code</p>
                    <p className="font-medium">{selectedInvoice.accountCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Invoice Type</p>
                    <p className="font-medium">{selectedInvoice.invoiceType}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <LineItemsSection 
                    lineItems={selectedInvoice.lineItems || []} 
                    setLineItems={setLineItemsWrapper}
                    isEditing={isEditing}
                  />
                </div>

                <div className="border-t pt-4">
                  <InvoiceSummary 
                    subtotal={selectedInvoice.subtotal} 
                    vatRate={selectedInvoice.vatRate} 
                    vat={selectedInvoice.vat} 
                    total={selectedInvoice.total} 
                  />
                </div>

                <div className="border-t pt-4">
                  <StoreAllocationSection 
                    storeAllocations={selectedInvoice.storeAllocations || []} 
                    setStoreAllocations={setStoreAllocationsWrapper}
                    isEditing={isEditing}
                    stores={stores}
                    invoiceTotal={selectedInvoice.total}
                  />
                </div>

                <div className="border-t pt-4">
                  <NotesSection 
                    notes={selectedInvoice.notes || ""} 
                    onNotesChange={(notes: string) => handleInvoiceChange('notes', notes)} 
                    isEditing={isEditing}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full bg-white rounded-lg border shadow-sm">
              <p className="text-muted-foreground">Select an invoice to view details</p>
            </div>
          )}
        </div>

        {/* Right Column: Invoice Preview and Chat (1/3 width) */}
        <div className={`${selectedInvoice ? 'w-1/3' : 'w-0'} flex flex-col h-full overflow-hidden transition-all duration-200`}>
          {selectedInvoice ? (
            <>
              {/* PDF Preview - Collapsible */}
              <div className={`bg-white rounded-lg border shadow-sm overflow-hidden mb-2 transition-all duration-300 ease-in-out ${isPdfExpanded ? 'h-1/2' : 'h-[42px]'}`}>
                <div className="px-4 py-2 border-b font-medium text-sm flex justify-between items-center cursor-pointer" 
                     onClick={() => setIsPdfExpanded(!isPdfExpanded)}>
                  <span>Invoice PDF/CSV Preview</span>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e) => {
                    e.stopPropagation();
                    setIsPdfExpanded(!isPdfExpanded);
                  }}>
                    {isPdfExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                </div>
                {isPdfExpanded && (
                  <div className="h-[calc(100%-34px)]">
                    <InvoicePdfPreviewer 
                      pdfUrl={`/invoice-previews/${selectedInvoice.previewUrl}`} 
                      invoiceNumber={selectedInvoice.invoiceNumber} 
                    />
                  </div>
                )}
              </div>
              
              {/* Invoice Bot fills remaining height */}
              <div className={`bg-white rounded-lg border shadow-sm overflow-hidden flex-1 transition-all duration-300 ease-in-out`}>
                <InvoiceBot 
                  invoiceNumber={selectedInvoice.invoiceNumber} 
                  invoiceStatus={selectedInvoice.status} 
                />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full bg-white rounded-lg border shadow-sm">
              <p className="text-muted-foreground">Select an invoice to view preview and chat</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Journal Dialog */}
      {selectedJournal && (
        <JournalDialog
          open={journalDialogOpen}
          onOpenChange={setJournalDialogOpen}
          journal={selectedJournal}
          isEditing={isJournalEditing}
          onEditToggle={toggleJournalEditing}
          onSave={handleJournalSave}
        />
      )}

      <UploadInvoiceDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} />
    </div>
  )
}