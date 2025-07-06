"use client";

import * as React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { 
  Plus, 
  Search, 
  Filter, 
  Upload, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  FileText,
  ArrowUpCircle,
  ArrowLeftRight
} from "lucide-react";
import { JournalEntry } from "./types";
import { ColDef, CellClickedEvent } from 'ag-grid-community';
import AGGridWrapper from './components/AGGridWrapper';
import { journalEntries } from "./journalData";

function JournalsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlType = searchParams.get('type');
  const sourceId = searchParams.get('sourceId');
  const store = searchParams.get('store');
  const amount = searchParams.get('amount');
  
  const [journalData] = React.useState<JournalEntry[]>(journalEntries);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  // Custom cell renderers
  const StatusCellRenderer = React.useCallback((params: { value: string }) => {
    const status = params.value;
    return (
      <div className="flex items-center justify-center">
        <Badge className={`${getStatusColor(status)} font-medium`}>
          {status}
        </Badge>
      </div>
    );
  }, []);

  const TypeCellRenderer = React.useCallback((params: { value: string }) => {
    const type = params.value;
    const getTypeIcon = (type: string) => {
      switch (type) {
        case "prepayment":
          return <ArrowUpCircle className="h-4 w-4 text-blue-600" />;
        case "accrual":
          return <div className="h-4 w-4 rounded-full bg-green-200" />;
        case "stock-movement":
          return <ArrowLeftRight className="h-4 w-4 text-orange-600" />;
        default:
          return <FileText className="h-4 w-4 text-gray-600" />;
      }
    };

    return (
      <div className="flex items-center gap-2">
        {getTypeIcon(type)}
        <span className="capitalize">{type.replace("-", " ")}</span>
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

  const SourceCellRenderer = React.useCallback((params: { value: string }) => {
    const source = params.value;
    
    const getSourceColor = (source: string) => {
      switch (source) {
        case "bill": return "bg-purple-100 text-purple-800 border-purple-200";
        case "invoice": return "bg-blue-100 text-blue-800 border-blue-200";
        case "stock": return "bg-orange-100 text-orange-800 border-orange-200";
        case "manual": return "bg-gray-100 text-gray-800 border-gray-200";
        default: return "bg-gray-100 text-gray-800 border-gray-200";
      }
    };

    return (
      <div className="flex items-center justify-center">
        <Badge className={`${getSourceColor(source)} font-medium capitalize`}>
          {source}
        </Badge>
      </div>
    );
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 border-green-200";
      case "complete": return "bg-blue-100 text-blue-800 border-blue-200";
      case "draft": return "bg-gray-100 text-gray-800 border-gray-200";
      case "review": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Column definitions for AG Grid
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
      floatingFilter: true,
    },
    {
      headerName: "Type",
      field: "type",
      cellRenderer: TypeCellRenderer,
      width: 180,
      minWidth: 160,
      maxWidth: 200,
      sortable: true,
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Description",
      field: "description",
      minWidth: 250,
      sortable: true,
      filter: true,
      floatingFilter: true,
    },
    {
      headerName: "Amount",
      field: "totalAmount",
      cellRenderer: AmountCellRenderer,
      width: 120,
      minWidth: 100,
      maxWidth: 140,
      sortable: true,
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: "Period",
      field: "startDate",
      valueFormatter: (params) => {
        const start = format(new Date(params.data.startDate), 'MMM yyyy');
        const end = format(new Date(params.data.endDate), 'MMM yyyy');
        return `${start} - ${end}`;
      },
      width: 180,
      minWidth: 150,
      maxWidth: 200,
      sortable: true,
    },
    {
      headerName: "Source",
      field: "source",
      cellRenderer: SourceCellRenderer,
      width: 160,
      minWidth: 140,
      maxWidth: 180,
      sortable: true,
      filter: true,
      floatingFilter: true,
    }
  ], [StatusCellRenderer, SourceCellRenderer, TypeCellRenderer, AmountCellRenderer]);

  // Filter data based on search and status
  const filteredData = React.useMemo(() => {
    return journalData.filter(journal => {
      const matchesSearch = 
        journal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        journal.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        journal.accountCode.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesStatus = statusFilter === "all" || journal.status === statusFilter;
      const matchesType = !urlType || urlType === "all" || journal.type === urlType;
      const matchesStore = !store || store === "all" || journal.store === store;
      
      return matchesSearch && matchesStatus && matchesType && matchesStore;
    });
  }, [journalData, searchTerm, statusFilter, urlType, store]);

  const onCellClicked = (event: CellClickedEvent) => {
    router.push(`/accounting/Journals/${event.data.id}`);
  };

  // Quick status filter buttons
  const statusCounts = React.useMemo(() => {
    const counts = { all: 0, draft: 0, review: 0, active: 0, complete: 0 };
    journalData.forEach(journal => {
      counts.all++;
      counts[journal.status as keyof typeof counts]++;
    });
    return counts;
  }, [journalData]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Navigation Banner (if coming from Stock Control) */}
      {urlType && sourceId && store && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">
                    Viewing {urlType} entries for {store}
                  </p>
                  <p className="text-sm text-blue-700">
                  Navigate from Stock Control - {amount && `Variance: £${parseFloat(amount).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`}
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.history.replaceState({}, '', '/accounting/Journals')}
                className="text-blue-700 border-blue-300 hover:bg-blue-100"
              >
                Clear Filter
              </Button>
            </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manual Journals</h1>
          <p className="text-gray-600 mt-1">Manage prepayments, accruals and stock movements</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import Journals
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Journal Entry
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
              {status === 'all' ? 'All Journals' : status.charAt(0).toUpperCase() + status.slice(1)} ({count})
            </button>
          ))}
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search journals..."
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
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
              <FileText className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-600">{statusCounts.draft}</p>
              <p className="text-sm text-gray-600">Draft</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{statusCounts.review}</p>
              <p className="text-sm text-gray-600">Needs Review</p>
            </div>
              </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
              <Clock className="h-5 w-5 text-green-600" />
              </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{statusCounts.active}</p>
              <p className="text-sm text-gray-600">Active</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
              <CheckCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{statusCounts.complete}</p>
              <p className="text-sm text-gray-600">Complete</p>
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

export default function JournalsPage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <JournalsContent />
    </React.Suspense>
  );
}
