"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Plus, Search, Filter, Upload, AlertTriangle, CheckCircle, Clock } from "lucide-react";
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

  // Handle archive/unarchive
  const handleArchiveInvoice = React.useCallback((invoiceId: string, archive: boolean) => {
    setSalesData(prevData => 
      prevData.map(invoice => 
        invoice.id === invoiceId 
          ? { ...invoice, archived: archive }
          : invoice
      )
    );
  }, []);

  // Custom cell renderers - now inside component scope
  const StatusCellRenderer = React.useCallback((params: { value: string; data: SalesInvoiceData }) => {
    const status = params.value;
    const reviewErrors = params.data.reviewErrors;
    
    // Create tooltip content for review issues
    const tooltipContent = reviewErrors && reviewErrors.length > 0 
      ? reviewErrors.map(error => `${error.title}: ${error.description}`).join('\n')
      : null;
    
    return (
      <div 
        className="flex items-center justify-center cursor-help" 
        title={tooltipContent || undefined}
      >
        <Badge className={`${getStatusColor(status)} font-medium`}>
          {status}
        </Badge>
      </div>
    );
  }, []);



  const DocumentTypeCellRenderer = React.useCallback((params: { value?: string; data: SalesInvoiceData }) => {
    const docType = params.value || "Invoice";
    const isPaired = params.data.uploadedFiles?.type === 'paired';
    
    // Orange for Bill, Receipt, and Credit Note; Blue for Invoice
    const isOrangeType = docType === "Bill" || docType === "Receipt" || docType === "Credit Note";
    
    return (
      <div className="flex items-center gap-1">
        <Badge 
          variant="outline" 
          className={`text-xs ${
            isOrangeType
              ? "border-orange-300 text-orange-700 bg-orange-50" 
              : "border-blue-300 text-blue-700 bg-blue-50"
          }`}
        >
          {docType}
        </Badge>
        {isPaired && (
          <Badge 
            variant="outline" 
            className="text-xs border-green-300 text-green-700 bg-green-50"
            title="Paired CSV + PDF files"
          >
            CSV+PDF
          </Badge>
        )}
      </div>
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



  // VAT Rate cell renderer - displays multiple VAT rates from line items
  const VATRateCellRenderer = React.useCallback((params: { data: SalesInvoiceData }) => {
    const invoice = params.data;
    if (!invoice.lineItems || invoice.lineItems.length === 0) {
      return <span className="text-gray-400">-</span>;
    }

    // Get unique VAT rates from line items
    const vatRates = [...new Set(invoice.lineItems.map(item => item.vatRate))];
    const vatLabels = vatRates.map(rate => {
      if (rate === -1) return "Zero Rated";
      if (rate === 0) return "No VAT";
      return `${rate}%`;
    });

    const displayText = vatLabels.length === 1 ? vatLabels[0] : vatLabels.join(', ');
    return <span className="text-sm">{displayText}</span>;
  }, []);

  // Source cell renderer - formats as rounded badge
  const SourceCellRenderer = React.useCallback((params: { data: SalesInvoiceData }) => {
    // Handle both single and paired file structures
    const source = params.data.uploadedFiles?.primary?.uploadSource || params.data.uploadedFile?.uploadSource;
    if (!source) {
      return <span className="text-gray-400">-</span>;
    }
    
    // WhatsApp gets official green (#25D366), others get grey
    const colorClass = source === 'WhatsApp' 
      ? 'text-white font-medium' 
      : 'bg-gray-100 text-gray-700';
    
    const style = source === 'WhatsApp' 
      ? { backgroundColor: '#25D366' }
      : {};
    
    return (
      <span 
        className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
        style={style}
      >
        {source}
      </span>
    );
  }, []);

  // Account Code cell renderer
  const AccountCodeCellRenderer = React.useCallback((params: { data: SalesInvoiceData }) => {
    const code = params.data.accountCode;
    if (!code) {
      return <span className="text-gray-400">-</span>;
    }
    return <span className="font-mono text-sm">{code}</span>;
  }, []);

  // Column definitions for AG Grid with optimized widths
  const columnDefs: ColDef[] = React.useMemo(() => [
    {
      headerName: "Status",
      field: "status",
      cellRenderer: StatusCellRenderer,
      width: 110,
      minWidth: 100,
      maxWidth: 130,
      sortable: true,
      filter: true,
      floatingFilter: false,
      cellStyle: { 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '0'
      },
    },
    {
      headerName: "Invoice #",
      field: "invoiceNumber",
      width: 140,
      minWidth: 120,
      maxWidth: 160,
      sortable: true,
      filter: true,
      floatingFilter: false,
      cellClass: "font-medium",
    },
    {
      headerName: "Supplier",
      field: "supplierInfo.name",
      valueGetter: (params) => params.data.supplierInfo?.name || params.data.source,
      minWidth: 250,
      sortable: true,
      filter: true,
      floatingFilter: false,
    },
    {
      headerName: "Account Code",
      field: "accountCode",
      cellRenderer: AccountCodeCellRenderer,
      width: 120,
      minWidth: 150,
      maxWidth: 180,
      sortable: true,
      filter: true,
      floatingFilter: false,
    },
    {
      headerName: "VAT Rate",
      field: "vatRate",
      cellRenderer: VATRateCellRenderer,
      width: 100,
      minWidth: 150,
      maxWidth: 180,
      sortable: false,
      filter: false,
    },
    {
      headerName: "Date",
      field: "date",
      valueFormatter: (params) => format(new Date(params.value), 'dd MMM yyyy'),
      width: 110,
      minWidth: 150,
      maxWidth: 180,
      sortable: true,
      filter: 'agDateColumnFilter',
    },
    {
      headerName: "Amount",
      field: "total",
      cellRenderer: AmountCellRenderer,
      width: 120,
      minWidth: 100,
      maxWidth: 140,
      sortable: true,
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: "Document Type",
      field: "documentType",
      cellRenderer: DocumentTypeCellRenderer,
      flex: 1,
      minWidth: 120,
      maxWidth: 180,
      sortable: true,
      filter: true,
      floatingFilter: false,
    },
    {
      headerName: "Source",
      field: "uploadedFile.uploadSource",
      valueGetter: (params) => params.data.uploadedFiles?.primary?.uploadSource || params.data.uploadedFile?.uploadSource,
      cellRenderer: SourceCellRenderer,
      flex: 1,
      minWidth: 90,
      maxWidth: 150,
      sortable: true,
      filter: true,
      floatingFilter: false,
    },
  ], [StatusCellRenderer, AmountCellRenderer, DocumentTypeCellRenderer, VATRateCellRenderer, SourceCellRenderer, AccountCodeCellRenderer]);

  // Filter data based on search and status (including archived)
  const filteredData = React.useMemo(() => {
    return salesData.filter(invoice => {
      const matchesSearch = 
        invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.store.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.supplierInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.company?.toLowerCase().includes(searchTerm.toLowerCase());
        
      let matchesStatus = false;
      if (statusFilter === "all") {
        matchesStatus = !invoice.archived; // Show only non-archived for "all"
      } else if (statusFilter === "Archived") {
        matchesStatus = invoice.archived; // Show only archived invoices
      } else {
        matchesStatus = invoice.status === statusFilter && !invoice.archived; // Show specific status, non-archived only
      }
      
      return matchesSearch && matchesStatus && !invoice.deleted;
    });
  }, [salesData, searchTerm, statusFilter]);

  const onCellClicked = (event: CellClickedEvent) => {
    if (event.colDef.field !== "actions") {
      setSelectedInvoiceId(event.data.id);
    }
  };

  // Status filter buttons including archived
  const statusCounts = React.useMemo(() => {
    const counts = { all: 0, Review: 0, Processing: 0, Processed: 0, Published: 0, Archived: 0 };
    salesData.forEach(invoice => {
      if (!invoice.deleted) {
        if (invoice.archived) {
          counts.Archived++;
        } else {
          counts.all++;
          counts[invoice.status as keyof typeof counts]++;
        }
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
        onArchive={handleArchiveInvoice}
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
              {status === 'all' ? 'All' : status} ({count})
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
