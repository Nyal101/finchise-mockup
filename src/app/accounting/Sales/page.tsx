"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Plus, Search, Filter, ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { SalesInvoiceData } from "./components/types";
import SalesInvoiceView from "./components/SalesInvoiceView";
import sampleSalesData from "./data/salesData";

export default function SalesPage() {
  const [salesData, setSalesData] = React.useState<SalesInvoiceData[]>(sampleSalesData);
  const [selectedInvoice, setSelectedInvoice] = React.useState<SalesInvoiceData | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [sourceFilter, setSourceFilter] = React.useState("all");
  const [storeFilter, setStoreFilter] = React.useState("all");
  const [sortField, setSortField] = React.useState<keyof SalesInvoiceData>("date");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("desc");
  const [showArchived, setShowArchived] = React.useState(false);

  // Get unique sources, stores, and statuses for filters
  const sources = React.useMemo(() => {
    const uniqueSources = [...new Set(salesData.map((invoice) => invoice.source))];
    return ["all", ...uniqueSources];
  }, [salesData]);

  const stores = React.useMemo(() => {
    const uniqueStores = [...new Set(salesData.map((invoice) => invoice.store))];
    return ["all", ...uniqueStores];
  }, [salesData]);

  const statuses = React.useMemo(() => {
    const uniqueStatuses = [...new Set(salesData.map((invoice) => invoice.status))];
    return ["all", ...uniqueStatuses];
  }, [salesData]);

  // Filter and sort the invoice data
  const filteredInvoices = React.useMemo(() => {
    return salesData
      .filter((invoice) => !invoice.deleted)
      .filter((invoice) => (showArchived ? true : !invoice.archived))
      .filter((invoice) => {
        const matchesSearch = 
          invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.store.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          false;
          
        const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
        const matchesSource = sourceFilter === "all" || invoice.source === sourceFilter;
        const matchesStore = storeFilter === "all" || invoice.store === storeFilter;
        
        return matchesSearch && matchesStatus && matchesSource && matchesStore;
      })
      .sort((a, b) => {
        type ValueType = string | number | Date | boolean | unknown[] | undefined;
        let aValue: ValueType = a[sortField];
        let bValue: ValueType = b[sortField];
        
        // Handle date comparison
        if (sortField === "date") {
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
        }
        
        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return sortDirection === "asc" ? -1 : 1;
        if (bValue === undefined) return sortDirection === "asc" ? 1 : -1;
        
        if (aValue < bValue) {
          return sortDirection === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortDirection === "asc" ? 1 : -1;
        }
        return 0;
      });
  }, [
    salesData,
    searchTerm,
    statusFilter,
    sourceFilter,
    storeFilter,
    sortField,
    sortDirection,
    showArchived,
  ]);

  const handleSort = (field: keyof SalesInvoiceData) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleSaveInvoice = (updatedInvoice: SalesInvoiceData) => {
    setSalesData((prev) =>
      prev.map((invoice) =>
        invoice.id === updatedInvoice.id ? updatedInvoice : invoice
      )
    );
    setSelectedInvoice(updatedInvoice);
  };

  const handleDeleteInvoice = (id: string) => {
    setSalesData((prev) =>
      prev.map((invoice) =>
        invoice.id === id ? { ...invoice, deleted: true } : invoice
      )
    );
    setSelectedInvoice(null);
  };

  const handleArchiveInvoice = (id: string, archived: boolean) => {
    setSalesData((prev) =>
      prev.map((invoice) =>
        invoice.id === id ? { ...invoice, archived } : invoice
      )
    );
    setSelectedInvoice((prev) => (prev?.id === id ? { ...prev, archived } : prev));
  };

  const handleInvoiceClick = (invoice: SalesInvoiceData) => {
    setSelectedInvoice(invoice);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sales</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Sale
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/5 xl:w-1/3 space-y-4">
          <div className="bg-white rounded-lg shadow-sm border p-4 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search sales..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <p className="text-sm font-medium">Store</p>
                <Select
                  value={storeFilter}
                  onValueChange={setStoreFilter}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {stores.map((store) => (
                      <SelectItem key={store} value={store}>
                        {store === "all" ? "All Stores" : store}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Status</p>
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status === "all" ? "All Statuses" : status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Source</p>
                <Select
                  value={sourceFilter}
                  onValueChange={setSourceFilter}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sources.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source === "all" ? "All Sources" : source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1 flex items-end">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-archived"
                    checked={showArchived}
                    onCheckedChange={(checked) => 
                      setShowArchived(checked as boolean)
                    }
                  />
                  <label
                    htmlFor="show-archived"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Show Archived
                  </label>
                </div>
              </div>
            </div>

            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("invoiceNumber")}
                    >
                      <div className="flex items-center">
                        Number
                        {sortField === "invoiceNumber" && (
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort("date")}
                    >
                      <div className="flex items-center">
                        Date
                        {sortField === "date" && (
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="text-right cursor-pointer"
                      onClick={() => handleSort("total")}
                    >
                      <div className="flex items-center justify-end">
                        Total
                        {sortField === "total" && (
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        )}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="h-24 text-center"
                      >
                        No sales found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInvoices.map((invoice) => (
                      <TableRow
                        key={invoice.id}
                        className={`cursor-pointer ${
                          selectedInvoice?.id === invoice.id
                            ? "bg-muted/50"
                            : ""
                        } ${invoice.archived ? "opacity-60" : ""}`}
                        onClick={() => handleInvoiceClick(invoice)}
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {invoice.invoiceNumber}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Badge
                                variant="outline"
                                className="text-[10px] px-1 py-0"
                              >
                                {invoice.source}
                              </Badge>
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${
                                  invoice.status === "Processed"
                                    ? "bg-green-500"
                                    : invoice.status === "Pending"
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                                }`}
                              />
                              <span>{invoice.status}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(invoice.date, "dd/MM/yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          £{invoice.total.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <div className="flex-1">
          {selectedInvoice ? (
            <SalesInvoiceView
              invoice={selectedInvoice}
              onSave={handleSaveInvoice}
              onDelete={handleDeleteInvoice}
              onArchive={handleArchiveInvoice}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-sm border p-8 flex flex-col items-center justify-center text-center h-96">
              <h2 className="text-2xl font-semibold mb-2">No Sales Report Selected</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Select a sales report from the list on the left to view its details,
                or create a new one to get started.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Sales Report
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
