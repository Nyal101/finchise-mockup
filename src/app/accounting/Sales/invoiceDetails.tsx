"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { 
  ArrowLeft, 
  ArrowRight, 
  X, 
  FileText, 
  AlertTriangle, 
  Eye,
  Edit,
  Save,
  Check,
  ChevronDown,
  ChevronRight,
  Trash2,
  Table,
  File
} from "lucide-react";
import { SalesInvoiceData, ReviewError, SalesLineItem } from "./components/types";
import salesInvoices from "./invoiceData";
import LineItemsSection from "./components/LineItemsSection";
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';
import InvoiceExtractedInfo from "./components/invoiceExtractedInfo";

interface InvoiceDetailsProps {
  invoiceId?: string;
  onClose?: () => void;
  onDelete?: (invoiceId: string) => void;
  onArchive?: (invoiceId: string, archive: boolean) => void;
}

// Status styling helper
const getStatusStyle = (status: string) => {
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

// Error severity styling
const getErrorSeverityStyle = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'border-red-200 bg-red-50';
    case 'high':
      return 'border-orange-200 bg-orange-50';
    case 'medium':
      return 'border-yellow-200 bg-yellow-50';
    case 'low':
      return 'border-blue-200 bg-blue-50';
    default:
      return 'border-gray-200 bg-gray-50';
  }
};

// Dropdown options
const companyOptions = [
  "Franchise Holdings Ltd",
  "Regional Operations Ltd", 
  "Central Management Ltd",
  "Local Store Co Ltd"
];

const accountCodeOptions = [
  { value: "4000", label: "4000 - Sales Revenue" },
  { value: "5000", label: "5000 - Cost of Sales" },
  { value: "6100", label: "6100 - Professional Services" },
  { value: "6200", label: "6200 - Property Maintenance" },
  { value: "6300", label: "6300 - Equipment Maintenance" },
  { value: "6400", label: "6400 - Utilities & Rates" },
  { value: "6500", label: "6500 - Marketing" },
  { value: "6600", label: "6600 - Communications" }
];

const supplierOptions = [
  "Coca-Cola Europacific Partners",
  "Combat Fire Limited", 
  "Comfort Cooling Services",
  "Imperial Green",
  "J C McCollom",
  "Just Eat Holdings Ltd",
  "LUSU General Account",
  "Lancaster City Council",
  "Paragon Customer Communications",
  "Prudent Plumbing",
  "Wynsdale Waste Management",
  "Xpress Refrigeration",
  "Customer Account Services"
];

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ invoiceId, onClose, onDelete, onArchive }) => {
  const [invoices] = React.useState<SalesInvoiceData[]>(salesInvoices);
  const [currentInvoiceId, setCurrentInvoiceId] = React.useState(invoiceId || invoices[0]?.id);
  const [statusFilter, setStatusFilter] = React.useState<string>('Review');
  const [editMode, setEditMode] = React.useState(false);
  const [formData, setFormData] = React.useState<Partial<SalesInvoiceData>>({});
  const [lineItemsOpen, setLineItemsOpen] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [activeView, setActiveView] = React.useState<'pdf' | 'csv'>('pdf');

  // Get current invoice
  const currentInvoice = React.useMemo(() => {
    return invoices.find(inv => inv.id === currentInvoiceId);
  }, [invoices, currentInvoiceId]);
  
  // Check if invoice is published (read-only)
  const isPublished = currentInvoice?.status === 'Published';
  
  // Handle publish action
  const handlePublish = () => {
    if (currentInvoice && !isPublished) {
      // In a real app, this would make an API call to publish the invoice
      alert(`Publishing invoice ${currentInvoice.invoiceNumber}`);
      setEditMode(false); // Exit edit mode when publishing
    }
  };

  // Handle unpublish action
  const handleUnpublish = () => {
    if (currentInvoice && isPublished && currentInvoice.paymentStatus !== 'paid') {
      // In a real app, this would make an API call to unpublish the invoice
      alert(`Unpublishing invoice ${currentInvoice.invoiceNumber}`);
      setEditMode(false);
    }
  };

  // Handle reprocess action
  const handleReprocess = () => {
    if (currentInvoice) {
      // In a real app, this would trigger AI reprocessing
      alert(`Reprocessing invoice ${currentInvoice.invoiceNumber}`);
    }
  };
  
  // Handle archive/unarchive action
  const handleArchive = () => {
    if (currentInvoice && onArchive) {
      const newArchiveState = !currentInvoice.archived;
      onArchive(currentInvoice.id, newArchiveState);
      
      // Navigate to next invoice or close if none available
      if (canNavigateNext) {
        navigateNext();
      } else if (canNavigatePrev) {
        navigatePrev();
      } else {
        onClose?.();
      }
    }
  };

  // Filter invoices by status for sidebar (including archived as a status)
  const filteredInvoices = React.useMemo(() => {
    return invoices.filter(invoice => {
      let matchesStatus = false;
      if (statusFilter === 'Archived') {
        matchesStatus = invoice.archived; // Show only archived invoices
      } else {
        matchesStatus = invoice.status === statusFilter && !invoice.archived; // Show specific status, non-archived only
      }
      return matchesStatus && !invoice.deleted;
    });
  }, [invoices, statusFilter]);

  // Navigation helpers
  const currentIndex = filteredInvoices.findIndex(inv => inv.id === currentInvoiceId);
  const canNavigatePrev = currentIndex > 0;
  const canNavigateNext = currentIndex < filteredInvoices.length - 1;

  const navigatePrev = () => {
    if (canNavigatePrev) {
      setCurrentInvoiceId(filteredInvoices[currentIndex - 1].id);
    }
  };

  const navigateNext = () => {
    if (canNavigateNext) {
      setCurrentInvoiceId(filteredInvoices[currentIndex + 1].id);
    }
  };

  // Delete functionality
  const handleDelete = () => {
    if (currentInvoice && onDelete) {
      onDelete(currentInvoice.id);
      setShowDeleteConfirm(false);
      
      // Navigate to next invoice or close if none available
      if (canNavigateNext) {
        navigateNext();
      } else if (canNavigatePrev) {
        navigatePrev();
      } else {
        onClose?.();
      }
    }
  };

  // Initialize form data when invoice changes
  React.useEffect(() => {
    if (currentInvoice) {
      setFormData(currentInvoice);
      setLineItemsOpen(false); // Reset to collapsed when switching invoices
      setShowDeleteConfirm(false); // Reset delete confirmation
    }
  }, [currentInvoice]);

  // Auto-open line items when entering edit mode
  React.useEffect(() => {
    if (editMode) {
      setLineItemsOpen(true);
    }
  }, [editMode]);

  // Recalculate totals when line items change
  React.useEffect(() => {
    if (formData.lineItems && formData.lineItems.length > 0) {
      const subtotal = formData.lineItems.reduce((sum, item) => sum + item.subtotal, 0);
      const vat = formData.lineItems.reduce((sum, item) => sum + item.vat, 0);
      const total = subtotal + vat;
      
      setFormData(prev => ({
        ...prev,
        subtotal,
        vat,
        total
      }));
    }
  }, [formData.lineItems]);

  if (!currentInvoice) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Invoice not found</h2>
          <Button onClick={onClose} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Invoice List
          </Button>
        </div>
      </div>
    );
  }

  // Dynamic CSV data based on current invoice
  const getCsvData = () => {
    // Handle paired files with CSV data
    if (currentInvoice.uploadedFiles?.type === 'paired' && currentInvoice.uploadedFiles.secondary?.type === 'csv') {
      // For Domino's customer account statements, use the actual CSV structure
      if (currentInvoice.invoiceNumber.startsWith('S-')) {
        const headers = ['Transaction type', 'Transaction date', 'Invoice number', 'Store', 'Total net', 'Total VAT', 'Total gross', 'Nominal code', 'Nominal code name'];
        const rows = currentInvoice.lineItems?.map(item => [
          'INV',
          format(currentInvoice.date, 'yyyy/MM/dd'),
          currentInvoice.invoiceNumber,
          currentInvoice.store,
          `£${item.subtotal.toFixed(2)}`,
          `£${item.vat.toFixed(2)}`,
          `£${item.total.toFixed(2)}`,
          item.accountCode || '',
          item.description
        ]) || [];
        return [headers, ...rows];
      }
    }
    
    // Handle single CSV files
    if (currentInvoice.uploadedFile?.type === 'csv' && currentInvoice.lineItems) {
      const headers = ['Description', 'Category', 'Quantity', 'Unit Price', 'Subtotal', 'VAT', 'Total'];
      const rows = currentInvoice.lineItems.map(item => [
        item.description,
        item.category,
        item.quantity.toString(),
        `£${item.price.toFixed(2)}`,
        `£${item.subtotal.toFixed(2)}`,
        `£${item.vat.toFixed(2)}`,
        `£${item.total.toFixed(2)}`
      ]);
      return [headers, ...rows];
    }
    
    // Fallback data for demo
    return [
      ['Date', 'Description', 'Amount', 'VAT', 'Total'],
      ['01/03/2025', 'Monthly Service Fee', '£1,500.00', '£300.00', '£1,800.00'],
      ['15/03/2025', 'Additional Services', '£750.00', '£150.00', '£900.00'],
      ['31/03/2025', 'Late Payment Fee', '£50.00', '£10.00', '£60.00'],
    ];
  };

  // Handsontable configuration for professional styling
  const handsontableConfig = {
    data: getCsvData(),
    rowHeaders: true,
    colHeaders: true,
    height: "400",
    licenseKey: "non-commercial-and-evaluation",
    readOnly: true,
    className: "htCenter htMiddle",
    cells: function (row: number) {
      const cellProperties: Record<string, unknown> = {};
      
      // Header row styling
      if (row === 0) {
        cellProperties.className = 'header-cell';
        cellProperties.renderer = function (instance: unknown, td: HTMLElement, row: number, col: number, prop: unknown, value: string) {
          td.innerHTML = value;
          td.style.backgroundColor = '#f8f9fa';
          td.style.fontWeight = 'bold';
          td.style.borderBottom = '2px solid #dee2e6';
          td.style.padding = '12px 8px';
          td.style.textAlign = 'center';
          return td;
        };
      } else {
        // Data cells styling
        cellProperties.renderer = function (instance: unknown, td: HTMLElement, row: number, col: number, prop: unknown, value: string) {
          td.innerHTML = value;
          td.style.padding = '10px 8px';
          td.style.borderBottom = '1px solid #e9ecef';
          
          // Right align numeric columns (last 3 columns typically)
          if (col >= getCsvData()[0].length - 3) {
            td.style.textAlign = 'right';
            td.style.fontFamily = 'monospace';
          } else {
            td.style.textAlign = 'left';
          }
          
          // Alternate row colors
          if (row % 2 === 0) {
            td.style.backgroundColor = '#ffffff';
          } else {
            td.style.backgroundColor = '#f8f9fa';
          }
          
          return td;
        };
      }
      
      return cellProperties;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Invoice List */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-3 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Invoices</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Status Filter Tabs */}
          <div className="flex gap-0.5 p-0.5 bg-gray-100 rounded-md overflow-x-auto">
            {['Review', 'Processing', 'Processed', 'Published', 'Archived'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2 py-1.5 text-xs rounded transition-colors whitespace-nowrap flex-shrink-0 ${
                  statusFilter === status
                    ? 'bg-white text-gray-900 shadow-sm font-medium'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Invoice List */}
        <div className="flex-1 overflow-y-auto">
          {filteredInvoices.map((invoice) => (
            <div
              key={invoice.id}
              onClick={() => setCurrentInvoiceId(invoice.id)}
              className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                invoice.id === currentInvoiceId ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-900 truncate">
                    {invoice.invoiceNumber}
                  </div>
                  <div className="text-xs text-gray-500 truncate mt-1">
                    {invoice.supplierInfo?.name || invoice.source}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {format(invoice.date, 'dd MMM yyyy')}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    £{invoice.total.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <Badge className={`${getStatusStyle(invoice.status)} text-xs`}>
                  {invoice.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            {/* Left: Back to List */}
            <div className="flex items-center">
              <Button variant="outline" size="sm" onClick={onClose}>
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </div>

            {/* Center: Navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={navigatePrev}
                disabled={!canNavigatePrev}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={navigateNext}
                disabled={!canNavigateNext}
              >
                Forward
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <Button 
                variant="default" 
                size="sm" 
                onClick={handlePublish}
                disabled={isPublished}
              >
                {isPublished ? 'Published' : 'Publish'}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleArchive}
              >
                {currentInvoice.archived ? 'Unarchive' : 'Archive'}
              </Button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Invoice</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-6">
                Are you sure you want to delete invoice <strong>{currentInvoice.invoiceNumber}</strong>? 
                This will permanently remove the invoice and all associated data.
              </p>
              <div className="flex gap-3 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDelete}
                >
                  Delete Invoice
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex">
                  {/* File Viewer */}
        <div className="w-1/2 bg-white border-r border-gray-200">
          <div className="p-4 h-full">
            {/* Handle paired files or single file */}
            {currentInvoice.uploadedFiles?.type === 'paired' ? (
              <div className="h-full">
                {/* Document Header */}
                <div className="mb-4 flex items-center justify-between">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-auto py-1.5 px-2 font-normal">
                        <div className="flex items-center gap-2">
                          {activeView === 'pdf' ? (
                            <>
                              <File className="h-4 w-4 text-blue-500" />
                              <span className="text-sm font-medium">
                                {currentInvoice.uploadedFiles.primary.name}
                              </span>
                            </>
                          ) : (
                            <>
                              <Table className="h-4 w-4 text-green-500" />
                              <span className="text-sm font-medium">
                                {currentInvoice.uploadedFiles.secondary?.name}
                              </span>
                            </>
                          )}
                          <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
                        </div>
                        {((activeView === 'pdf' && currentInvoice.uploadedFiles.primary.uploadSource) ||
                          (activeView === 'csv' && currentInvoice.uploadedFiles.secondary?.uploadSource)) && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {activeView === 'pdf'
                              ? currentInvoice.uploadedFiles.primary.uploadSource
                              : currentInvoice.uploadedFiles.secondary?.uploadSource}
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-72">
                      <DropdownMenuItem 
                        onClick={() => setActiveView('pdf')}
                        className="gap-2"
                      >
                        <File className="h-4 w-4 shrink-0 text-blue-500" />
                        <div className="flex flex-col">
                          <span className="font-medium">{currentInvoice.uploadedFiles.primary.name}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-muted-foreground">PDF Document</span>
                            {currentInvoice.uploadedFiles.primary.uploadSource && (
                              <Badge variant="secondary" className="text-xs">
                                {currentInvoice.uploadedFiles.primary.uploadSource}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setActiveView('csv')}
                        className="gap-2"
                      >
                        <Table className="h-4 w-4 shrink-0 text-green-500" />
                        <div className="flex flex-col">
                          <span className="font-medium">{currentInvoice.uploadedFiles.secondary?.name}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-muted-foreground">Data File (CSV)</span>
                            {currentInvoice.uploadedFiles.secondary?.uploadSource && (
                              <Badge variant="secondary" className="text-xs">
                                {currentInvoice.uploadedFiles.secondary.uploadSource}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Content Area */}
                <div className="h-[calc(100%-3rem)] border rounded-lg overflow-hidden bg-white shadow-sm">
                  {activeView === 'pdf' ? (
                    <iframe
                      src={currentInvoice.uploadedFiles.primary.url}
                      className="w-full h-full border-0"
                      title="Invoice PDF"
                    />
                  ) : (
                    <div className="h-full">
                      <div className="bg-gray-50 p-3 border-b">
                        <h3 className="text-sm font-medium text-gray-700">
                          Structured Data View
                        </h3>
                      </div>
                      <div className="p-4 h-[calc(100%-3rem)] overflow-auto">
                        <style jsx global>{`
                          .handsontable {
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                            font-size: 13px !important;
                          }
                          .handsontable td {
                            border-right: 1px solid #e9ecef !important;
                          }
                          .handsontable th {
                            background-color: #f8f9fa !important;
                            font-weight: 600 !important;
                            border-bottom: 2px solid #dee2e6 !important;
                            color: #495057 !important;
                          }
                          .handsontable .htDimmed {
                            color: #6c757d !important;
                          }
                          .handsontable .current {
                            background-color: #e3f2fd !important;
                          }
                          .handsontable .area {
                            background-color: #f3e5f5 !important;
                          }
                        `}</style>
                        <HotTable
                          {...handsontableConfig}
                          height="100%"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : currentInvoice.uploadedFile?.type === 'csv' ? (
                <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                  <div className="bg-gray-50 p-3 border-b flex items-center justify-between">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <span className="text-sm font-medium text-gray-700 truncate">
                        {currentInvoice.uploadedFile.name}
                      </span>
                      {currentInvoice.uploadedFile.uploadSource && (
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-gray-500">Source:</span>
                          <Badge variant="secondary" className="text-xs">
                            {currentInvoice.uploadedFile.uploadSource}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">
                      CSV Data
                    </Badge>
                  </div>
                  <div className="p-4">
                    <style jsx global>{`
                      .handsontable {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                        font-size: 13px !important;
                      }
                      .handsontable td {
                        border-right: 1px solid #e9ecef !important;
                      }
                      .handsontable th {
                        background-color: #f8f9fa !important;
                        font-weight: 600 !important;
                        border-bottom: 2px solid #dee2e6 !important;
                        color: #495057 !important;
                      }
                      .handsontable .htDimmed {
                        color: #6c757d !important;
                      }
                      .handsontable .current {
                        background-color: #e3f2fd !important;
                      }
                      .handsontable .area {
                        background-color: #f3e5f5 !important;
                      }
                    `}</style>
                    <HotTable
                      {...handsontableConfig}
                    />
                  </div>
                </div>
              ) : currentInvoice.uploadedFile?.type === 'pdf' ? (
                <div className="h-full border rounded-lg overflow-hidden bg-white shadow-sm">
                  <div className="bg-gray-50 p-3 border-b flex items-center justify-between">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <span className="text-sm font-medium text-gray-700 truncate">
                        {currentInvoice.uploadedFile.name}
                      </span>
                      {currentInvoice.uploadedFile.uploadSource && (
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-gray-500">Source:</span>
                          <Badge variant="secondary" className="text-xs">
                            {currentInvoice.uploadedFile.uploadSource}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">
                      PDF Document
                    </Badge>
                  </div>
                  <div className="h-full">
                    <iframe
                      src={currentInvoice.uploadedFile.url}
                      className="w-full h-full border-0"
                      title="Invoice PDF"
                    />
                  </div>
                </div>
              ) : currentInvoice.uploadedFile?.type === 'image' ? (
                <div className="h-full border rounded-lg overflow-hidden bg-white shadow-sm">
                  <div className="bg-gray-50 p-3 border-b flex items-center justify-between">
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <span className="text-sm font-medium text-gray-700 truncate">
                        {currentInvoice.uploadedFile.name}
                      </span>
                      {currentInvoice.uploadedFile.uploadSource && (
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-gray-500">Source:</span>
                          <Badge variant="secondary" className="text-xs">
                            {currentInvoice.uploadedFile.uploadSource}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">
                      Image
                    </Badge>
                  </div>
                  <div className="p-4 h-full flex items-center justify-center">
                    <Image
                      src={currentInvoice.uploadedFile.url}
                      alt="Invoice"
                      width={300}
                      height={300}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">Document</p>
                  <p className="text-xs text-gray-500">
                    {currentInvoice.uploadedFile?.name || 'Document preview not available'}
                  </p>
                  <Button variant="outline" size="sm" className="mt-4">
                    <Eye className="h-4 w-4 mr-2" />
                    View Document
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Extracted Data Panel */}
          <div className="w-1/2 bg-gray-50 overflow-y-auto">
            <InvoiceExtractedInfo
              currentInvoice={currentInvoice}
              formData={formData}
              setFormData={setFormData}
              editMode={editMode}
              setEditMode={setEditMode}
              isPublished={isPublished}
              handlePublish={handlePublish}
              handleUnpublish={handleUnpublish}
              handleReprocess={handleReprocess}
              handleArchive={handleArchive}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
