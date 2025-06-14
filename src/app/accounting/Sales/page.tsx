"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Plus, Search, Filter, Upload, FileText, AlertTriangle, CheckCircle, Clock, Eye } from "lucide-react";
import { SalesInvoiceData } from "./components/types";
import salesInvoices from "./invoiceData";
import { ColDef, CellClickedEvent } from 'ag-grid-community';
import InvoiceDetails from './invoiceDetails';
import AGGridWrapper from './components/AGGridWrapper';

// Status color mapping
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Processing':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Processed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Published':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Review':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Status icon mapping
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Processing':
      return <Clock className="h-3 w-3" />;
    case 'Processed':
      return <CheckCircle className="h-3 w-3" />;
    case 'Published':
      return <CheckCircle className="h-3 w-3" />;
    case 'Review':
      return <AlertTriangle className="h-3 w-3" />;
    default:
      return <FileText className="h-3 w-3" />;
  }
};

export default function SalesPage() {
  const [salesData, setSalesData] = React.useState<SalesInvoiceData[]>(salesInvoices);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [selectedInvoiceId, setSelectedInvoiceId] = React.useState<string | null>(null);

  // Handle invoice deletion
  const handleDeleteInvoice = React.useCallback((invoiceId: string) => {
    setSalesData(prevData => 
      prevData.map(invoice => 
        invoice.id === invoiceId 
          ? { ...invoice, deleted: true }
          : invoice
      )
    );
  }, []);

  // Custom cell renderers - now inside component scope
  const StatusCellRenderer = React.useCallback((params: { value: string }) => {
    const status = params.value;
    return (
      <div className="flex items-center gap-1">
        {getStatusIcon(status)}
        <Badge className={`${getStatusColor(status)} font-medium`}>
          {status}
        </Badge>
      </div>
    );
  }, []);

  const ReviewErrorsCellRenderer = React.useCallback((params: { data: SalesInvoiceData }) => {
    const errors = params.data.reviewErrors || [];
    if (errors.length === 0) return null;
    
    return (
      <div className="flex flex-col gap-1 py-1">
        {errors.slice(0, 2).map((error, index: number) => (
          <div key={index} className="text-xs">
            <span className={`inline-block w-2 h-2 rounded-full mr-1 ${
              error.severity === 'critical' ? 'bg-red-500' : 
              error.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
            }`}></span>
            <span className="text-gray-700">{error.title}</span>
          </div>
        ))}
        {errors.length > 2 && (
          <div className="text-xs text-gray-500">+{errors.length - 2} more</div>
        )}
      </div>
    );
  }, []);

  const DocumentTypeCellRenderer = React.useCallback((params: { value?: string }) => {
    const docType = params.value || "Invoice";
    return (
      <Badge 
        variant="outline" 
        className={`text-xs ${
          docType === "Bill" 
            ? "border-orange-300 text-orange-700 bg-orange-50" 
            : "border-blue-300 text-blue-700 bg-blue-50"
        }`}
      >
        {docType}
      </Badge>
    );
  }, []);

  const AmountCellRenderer = React.useCallback((params: { value?: number }) => {
    const amount = params.value;
    return (
      <span className="font-medium">
        £{amount?.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
      </span>
    );
  }, []);

  const ActionsCellRenderer = React.useCallback((params: { data: SalesInvoiceData }) => {
    const handleViewInvoice = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedInvoiceId(params.data.id);
    };
    
    return (
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleViewInvoice}
          className="h-6 px-2"
        >
          <Eye className="h-3 w-3" />
        </Button>
      </div>
    );
  }, [setSelectedInvoiceId]);

  // Column definitions for AG Grid
  const columnDefs: ColDef[] = React.useMemo(() => [
    {
      headerName: "Status",
      field: "status",
      cellRenderer: StatusCellRenderer,
      width: 120,
      sortable: true,
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Invoice #",
      field: "invoiceNumber",
      width: 150,
      sortable: true,
      filter: true,
      floatingFilter: true,
      cellClass: "font-medium",
    },
    {
      headerName: "Supplier",
      field: "supplierInfo.name",
      valueGetter: (params) => params.data.supplierInfo?.name || params.data.source,
      width: 200,
      sortable: true,
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Store",
      field: "store",
      width: 130,
      sortable: true,
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Date",
      field: "date",
      valueFormatter: (params) => format(new Date(params.value), 'dd MMM yyyy'),
      width: 120,
      sortable: true,
      filter: 'agDateColumnFilter',
    },
    {
      headerName: "Amount",
      field: "total",
      cellRenderer: AmountCellRenderer,
      width: 120,
      sortable: true,
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: "Review Issues",
      field: "reviewErrors",
      cellRenderer: ReviewErrorsCellRenderer,
      width: 250,
      sortable: false,
      filter: false,
    },
    {
      headerName: "Document Type",
      field: "documentType",
      cellRenderer: DocumentTypeCellRenderer,
      width: 120,
      sortable: true,
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: ActionsCellRenderer,
      width: 80,
      sortable: false,
      filter: false,
    },
  ], [StatusCellRenderer, ReviewErrorsCellRenderer, AmountCellRenderer, ActionsCellRenderer, DocumentTypeCellRenderer]);

  // Filter data based on search and status
  const filteredData = React.useMemo(() => {
    return salesData.filter(invoice => {
      const matchesSearch = 
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.store.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.supplierInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.source.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
      
      return matchesSearch && matchesStatus && !invoice.deleted;
    });
  }, [salesData, searchTerm, statusFilter]);

  const onCellClicked = (event: CellClickedEvent) => {
    if (event.colDef.field !== "actions") {
      setSelectedInvoiceId(event.data.id);
    }
  };

  // Quick status filter buttons
  const statusCounts = React.useMemo(() => {
    const counts = { all: 0, Review: 0, Processing: 0, Processed: 0, Published: 0 };
    salesData.forEach(invoice => {
      if (!invoice.deleted) {
        counts.all++;
        counts[invoice.status as keyof typeof counts]++;
      }
    });
    return counts;
  }, [salesData]);

  // If an invoice is selected, show the details page
  if (selectedInvoiceId) {
    return (
      <InvoiceDetails 
        invoiceId={selectedInvoiceId} 
        onClose={() => setSelectedInvoiceId(null)}
        onDelete={handleDeleteInvoice}
      />
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoice Review Dashboard</h1>
          <p className="text-gray-600 mt-1">AI-powered invoice processing and review system</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Upload Invoices
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Manual Entry
          </Button>
        </div>
      </div>

      {/* Status Filter Tabs with Search and Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {status === 'all' ? 'All Invoices' : status} ({count})
            </button>
          ))}
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search invoices..."
              className="pl-10 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
        </div>
      </div>

      {/* Compact Status Summary */}
      <div className="bg-white rounded-lg border shadow-sm p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{statusCounts.Review}</p>
              <p className="text-sm text-gray-600">Needs Review</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{statusCounts.Processing}</p>
              <p className="text-sm text-gray-600">Processing</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{statusCounts.Processed}</p>
              <p className="text-sm text-gray-600">Processed</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
              <CheckCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{statusCounts.Published}</p>
              <p className="text-sm text-gray-600">Published</p>
            </div>
          </div>
        </div>
      </div>

      {/* AG Grid */}
      <div className="bg-white rounded-lg border shadow-sm">
        <AGGridWrapper
          columnDefs={columnDefs}
          rowData={filteredData}
          onCellClicked={onCellClicked}
        />
      </div>
    </div>
  );
}
