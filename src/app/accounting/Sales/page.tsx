"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Plus, Search, Filter, Upload, FileText, AlertTriangle, CheckCircle, Clock, Eye } from "lucide-react";
import { SalesInvoiceData } from "./components/types";
import salesInvoices from "./invoiceData";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { ColDef, CellClickedEvent } from 'ag-grid-community';
import InvoiceDetails from './invoiceDetails';

// Status color mapping
const getStatusColor = (status: string) => {
  switch (status) {
    case 'Processing':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Published':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Posted':
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
    case 'Published':
      return <CheckCircle className="h-3 w-3" />;
    case 'Posted':
      return <CheckCircle className="h-3 w-3" />;
    case 'Review':
      return <AlertTriangle className="h-3 w-3" />;
    default:
      return <FileText className="h-3 w-3" />;
  }
};

export default function SalesPage() {
  const [salesData] = React.useState<SalesInvoiceData[]>(salesInvoices);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [selectedInvoiceId, setSelectedInvoiceId] = React.useState<string | null>(null);

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

  const ConfidenceCellRenderer = React.useCallback((params: { value?: number }) => {
    const confidence = params.value;
    if (!confidence) return null;
    
    const getConfidenceColor = (conf: number) => {
      if (conf >= 90) return 'bg-green-500';
      if (conf >= 70) return 'bg-yellow-500';
      return 'bg-red-500';
    };
    
    return (
      <div className="flex items-center gap-2">
        <div className="w-16 bg-gray-200 rounded-full h-2">
          <div 
            className={`${getConfidenceColor(confidence)} h-2 rounded-full`}
            style={{ width: `${confidence}%` }}
          ></div>
        </div>
        <span className="text-xs text-gray-600">{confidence}%</span>
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
      headerName: "AI Confidence",
      field: "confidence",
      cellRenderer: ConfidenceCellRenderer,
      width: 130,
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
      headerName: "Actions",
      field: "actions",
      cellRenderer: ActionsCellRenderer,
      width: 80,
      sortable: false,
      filter: false,
    },
  ], [StatusCellRenderer, ReviewErrorsCellRenderer, ConfidenceCellRenderer, AmountCellRenderer, ActionsCellRenderer]);

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
    const counts = { all: 0, Review: 0, Processing: 0, Published: 0, Posted: 0 };
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

      {/* Status Filter Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
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

      {/* Search and Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search invoices..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Advanced Filters
        </Button>
      </div>

      {/* AG Grid */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="ag-theme-material" style={{ height: '600px', width: '100%' }}>
          <AgGridReact
            columnDefs={columnDefs}
            rowData={filteredData}
            onCellClicked={onCellClicked}
            rowSelection="single"
            suppressRowClickSelection={false}
            domLayout="normal"
            defaultColDef={{
              resizable: true,
              sortable: false,
              filter: false,
            }}
            rowHeight={60}
            headerHeight={50}
            floatingFiltersHeight={35}
            suppressMenuHide={true}
            rowClass="cursor-pointer hover:bg-gray-50"
            getRowStyle={(params) => {
              if (params.data.status === 'Review') {
                return { backgroundColor: '#fef2f2' };
              }
              return undefined;
            }}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="font-semibold text-red-900">Needs Review</h3>
          </div>
          <p className="text-2xl font-bold text-red-600 mt-1">{statusCounts.Review}</p>
          <p className="text-sm text-red-600 mt-1">Invoices requiring attention</p>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            <h3 className="font-semibold text-yellow-900">Processing</h3>
          </div>
          <p className="text-2xl font-bold text-yellow-600 mt-1">{statusCounts.Processing}</p>
          <p className="text-sm text-yellow-600 mt-1">Being processed by AI</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-green-900">Published</h3>
          </div>
          <p className="text-2xl font-bold text-green-600 mt-1">{statusCounts.Published}</p>
          <p className="text-sm text-green-600 mt-1">Ready for review</p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Posted</h3>
          </div>
          <p className="text-2xl font-bold text-blue-600 mt-1">{statusCounts.Posted}</p>
          <p className="text-sm text-blue-600 mt-1">Completed invoices</p>
        </div>
      </div>
    </div>
  );
}
