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
  FileIcon,
  Table,
  File
} from "lucide-react";
import { SalesInvoiceData, ReviewError, SalesLineItem } from "./components/types";
import salesInvoices from "./invoiceData";
import LineItemsSection from "./components/LineItemsSection";
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';

interface InvoiceDetailsProps {
  invoiceId?: string;
  onClose?: () => void;
  onDelete?: (invoiceId: string) => void;
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

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ invoiceId, onClose, onDelete }) => {
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
  
  // Handle archive action
  const handleArchive = () => {
    if (currentInvoice) {
      // In a real app, this would make an API call to archive the invoice
      alert(`Archiving invoice ${currentInvoice.invoiceNumber}`);
    }
  };

  // Filter invoices by status for sidebar
  const filteredInvoices = React.useMemo(() => {
    return invoices.filter(invoice => {
      if (statusFilter === 'all') return !invoice.deleted;
      return invoice.status === statusFilter && !invoice.deleted;
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
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Invoices</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Status Filter Tabs */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-md">
            {['Review', 'Processing', 'Processed', 'Published'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  statusFilter === status
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
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
                Archive
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
            <div className="p-4 space-y-4">
              {/* Review Errors Section - More Compact */}
              {currentInvoice.reviewErrors && currentInvoice.reviewErrors.length > 0 && (
                <Card className="border-red-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-red-900 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Review Required ({currentInvoice.reviewErrors.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {currentInvoice.reviewErrors.map((error: ReviewError) => (
                      <div key={error.id} className={`p-2 rounded border text-xs ${getErrorSeverityStyle(error.severity)}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              error.severity === 'critical' ? 'bg-red-500' : 
                              error.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
                            }`}></span>
                            <span className="font-medium text-gray-900">{error.title}</span>
                          </div>
                          <Button size="sm" variant="ghost" className="h-6 px-2">
                            <Check className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-gray-700 mt-1 ml-4">{error.description}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Transaction Details */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Transaction Details
                    </div>
                    {/* Completion Status with Edit Button */}
                    <div className="flex items-center gap-3">
                      {(() => {
                        const requiredFields = [
                          formData.company,
                          formData.supplierInfo?.name,
                          formData.documentType,
                          formData.invoiceNumber,
                          formData.accountCode,
                          formData.date
                        ];
                        const completed = requiredFields.filter(Boolean).length;
                        const total = requiredFields.length;
                        const percentage = Math.round((completed / total) * 100);
                        
                        return (
                          <>
                            <div className="text-xs text-gray-500">
                              {completed}/{total} fields
                            </div>
                            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-300 ${
                                  percentage === 100 ? 'bg-green-500' : 
                                  percentage >= 60 ? 'bg-blue-500' : 
                                  percentage >= 20 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </>
                        );
                      })()}
                      {/* Edit Button moved here */}
                      {!isPublished && !editMode && (
                        <Button size="sm" variant="outline" onClick={() => setEditMode(true)}>
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      )}
                      {editMode && (
                        <div className="flex gap-1">
                          <Button size="sm" onClick={() => setEditMode(false)}>
                            <Save className="h-3 w-3 mr-1" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditMode(false)}>
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Organization Section */}
                  <div className="space-y-4">
                    <div className="text-xs font-medium text-gray-700 uppercase tracking-wide pb-1 border-b border-gray-200">
                      Organization
                    </div>
                    
                    <div>
                      <Label className="text-xs font-medium text-gray-600">Company *</Label>
                      {editMode ? (
                        <Select 
                          value={formData.company || ''} 
                          onValueChange={(value) => setFormData({...formData, company: value})}
                        >
                          <SelectTrigger className={`mt-1 text-sm ${!formData.company ? 'border-amber-300 bg-amber-50' : ''}`}>
                            <SelectValue placeholder="Select company" />
                          </SelectTrigger>
                          <SelectContent>
                            {companyOptions.map((company) => (
                              <SelectItem key={company} value={company}>
                                {company}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className={`mt-1 text-sm p-2 border rounded ${formData.company ? 'bg-gray-50' : 'bg-amber-50 border-amber-300'}`}>
                          {formData.company || "⚠️ No company selected"}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="text-xs font-medium text-gray-600">Supplier *</Label>
                      {editMode ? (
                        <Select 
                          value={formData.supplierInfo?.name || ''} 
                          onValueChange={(value) => setFormData({
                            ...formData, 
                            supplierInfo: {...formData.supplierInfo, name: value}
                          })}
                        >
                          <SelectTrigger className={`mt-1 text-sm ${!formData.supplierInfo?.name ? 'border-amber-300 bg-amber-50' : ''}`}>
                            <SelectValue placeholder="Select supplier" />
                          </SelectTrigger>
                          <SelectContent>
                            {supplierOptions.map((supplier) => (
                              <SelectItem key={supplier} value={supplier}>
                                {supplier}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className={`mt-1 text-sm p-2 border rounded ${formData.supplierInfo?.name ? 'bg-gray-50' : 'bg-amber-50 border-amber-300'}`}>
                          {formData.supplierInfo?.name || "⚠️ No supplier selected"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Invoice Details Section */}
                  <div className="space-y-4">
                    <div className="text-xs font-medium text-gray-700 uppercase tracking-wide pb-1 border-b border-gray-200">
                      Invoice Details
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="text-xs font-medium text-gray-600">Document Type *</Label>
                        {editMode ? (
                          <Select 
                            value={formData.documentType || ''} 
                            onValueChange={(value) => setFormData({...formData, documentType: value as "Invoice" | "Credit Note" | "Receipt" | "Bill"})}
                          >
                            <SelectTrigger className={`mt-1 text-sm ${!formData.documentType ? 'border-amber-300 bg-amber-50' : ''}`}>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Invoice">Invoice</SelectItem>
                              <SelectItem value="Credit Note">Credit Note</SelectItem>
                              <SelectItem value="Receipt">Receipt</SelectItem>
                              <SelectItem value="Bill">Bill</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className={`mt-1 text-sm p-2 border rounded ${formData.documentType ? 'bg-gray-50' : 'bg-amber-50 border-amber-300'}`}>
                            {formData.documentType || "⚠️ No type selected"}
                          </div>
                        )}
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-gray-600">Invoice Number *</Label>
                        <Input 
                          value={formData.invoiceNumber || ''} 
                          className="mt-1 text-sm"
                          readOnly={!editMode || isPublished}
                          placeholder="Enter invoice number"
                          onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-gray-600">Account Code *</Label>
                        {editMode ? (
                          <Select 
                            value={formData.accountCode || ''} 
                            onValueChange={(value) => setFormData({...formData, accountCode: value})}
                          >
                            <SelectTrigger className={`mt-1 text-sm ${!formData.accountCode ? 'border-amber-300 bg-amber-50' : ''}`}>
                              <SelectValue placeholder="Select account code" />
                            </SelectTrigger>
                            <SelectContent>
                              {accountCodeOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className={`mt-1 text-sm p-2 border rounded ${formData.accountCode ? 'bg-gray-50' : 'bg-amber-50 border-amber-300'}`}>
                            {formData.accountCode ? 
                              accountCodeOptions.find(opt => opt.value === formData.accountCode)?.label || formData.accountCode 
                              : "⚠️ No account code selected"
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Date Information Section */}
                  <div className="space-y-4">
                    <div className="text-xs font-medium text-gray-700 uppercase tracking-wide pb-1 border-b border-gray-200">
                      Date Information
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs font-medium text-gray-600">Invoice Date *</Label>
                        <Input 
                          value={formData.date ? format(new Date(formData.date), 'yyyy-MM-dd') : ''} 
                          type="date"
                          className="mt-1 text-sm"
                          readOnly={!editMode}
                          onChange={(e) => setFormData({...formData, date: new Date(e.target.value)})}
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-medium text-gray-600">Due Date</Label>
                        <Input 
                          value={formData.dueDate ? format(new Date(formData.dueDate), 'yyyy-MM-dd') : ''} 
                          type="date"
                          className="mt-1 text-sm"
                          readOnly={!editMode}
                          placeholder="Optional"
                          onChange={(e) => setFormData({...formData, dueDate: new Date(e.target.value)})}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Line Items Section */}
                  <div>
                    <Collapsible open={lineItemsOpen} onOpenChange={setLineItemsOpen}>
                      <CollapsibleTrigger className="w-full justify-between p-0 h-auto text-xs text-gray-600 font-normal bg-transparent border-none hover:bg-gray-50">
                        <span>Line Items ({formData.lineItems?.length || 0})</span>
                        {lineItemsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2">
                        <LineItemsSection
                          lineItems={formData.lineItems || []}
                          setLineItems={(lineItems: SalesLineItem[] | ((prev: SalesLineItem[]) => SalesLineItem[])) => {
                            if (typeof lineItems === 'function') {
                              setFormData(prev => ({
                                ...prev,
                                lineItems: lineItems(prev.lineItems || [])
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                lineItems: lineItems
                              }));
                            }
                          }}
                          isEditing={editMode && !isPublished}
                        />
                      </CollapsibleContent>
                    </Collapsible>
                  </div>

                  {/* Totals Section */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">
                        £{formData.subtotal?.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">VAT (20%):</span>
                      <span className="font-medium">
                        £{formData.vat?.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between text-base font-semibold border-t pt-2">
                      <span>Total:</span>
                      <span>
                        £{formData.total?.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons within the card - Centered Publish/Archive */}
                  <div className="flex justify-center gap-3 pt-4 border-t">
                    {isPublished ? (
                      <div className="text-sm text-gray-500 italic text-center">
                        Invoice is published and cannot be modified
                      </div>
                    ) : (
                      <>
                        <Button 
                          size="sm" 
                          onClick={handlePublish}
                          disabled={isPublished}
                          className="px-6"
                        >
                          {isPublished ? 'Published' : 'Publish'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={handleArchive}
                          className="px-6"
                        >
                          Archive
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
