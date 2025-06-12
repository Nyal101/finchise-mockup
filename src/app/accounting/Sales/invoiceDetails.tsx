"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { format } from "date-fns";
import { 
  ArrowLeft, 
  ArrowRight, 
  X, 
  FileText, 
  AlertTriangle, 
  Eye,
  Download,
  Edit,
  Save,
  ExternalLink,
  Check,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { SalesInvoiceData, ReviewError } from "./components/types";
import sampleSalesData from "./data/salesData";
import { HotTable } from '@handsontable/react';
import 'handsontable/dist/handsontable.full.min.css';

interface InvoiceDetailsProps {
  invoiceId?: string;
  onClose?: () => void;
}

// Status styling helper
const getStatusStyle = (status: string) => {
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

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ invoiceId, onClose }) => {
  const [invoices] = React.useState<SalesInvoiceData[]>(sampleSalesData);
  const [currentInvoiceId, setCurrentInvoiceId] = React.useState(invoiceId || invoices[0]?.id);
  const [statusFilter, setStatusFilter] = React.useState<string>('Review');
  const [editMode, setEditMode] = React.useState(false);
  const [formData, setFormData] = React.useState<Partial<SalesInvoiceData>>({});
  const [lineItemsOpen, setLineItemsOpen] = React.useState(false);

  // Get current invoice
  const currentInvoice = React.useMemo(() => {
    return invoices.find(inv => inv.id === currentInvoiceId);
  }, [invoices, currentInvoiceId]);

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

  // Initialize form data when invoice changes
  React.useEffect(() => {
    if (currentInvoice) {
      setFormData(currentInvoice);
      setLineItemsOpen(false); // Reset to collapsed when switching invoices
    }
  }, [currentInvoice]);

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
            {['Review', 'Processing', 'Published', 'Posted'].map((status) => (
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
                    £{invoice.total.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <Badge className={`${getStatusStyle(invoice.status)} text-xs`}>
                  {invoice.status}
                </Badge>
              </div>
              
              {/* Review Errors Preview */}
              {invoice.reviewErrors && invoice.reviewErrors.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {invoice.reviewErrors.slice(0, 2).map((error, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        error.severity === 'critical' ? 'bg-red-500' : 
                        error.severity === 'high' ? 'bg-orange-500' : 'bg-yellow-500'
                      }`}></div>
                      <span className="text-xs text-gray-600 truncate max-w-20">
                        {error.title}
                      </span>
                    </div>
                  ))}
                  {invoice.reviewErrors.length > 2 && (
                    <span className="text-xs text-gray-500">+{invoice.reviewErrors.length - 2}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {currentInvoice.invoiceNumber}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-600">
                    {currentInvoice.supplierInfo?.name || currentInvoice.source}
                  </span>
                  <Badge className={`${getStatusStyle(currentInvoice.status)} text-xs`}>
                    {currentInvoice.status}
                  </Badge>
                  {currentInvoice.confidence && (
                    <span className="text-xs text-gray-500">
                      AI Confidence: {currentInvoice.confidence}%
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={navigatePrev}
                disabled={!canNavigatePrev}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={navigateNext}
                disabled={!canNavigateNext}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex">
          {/* File Viewer */}
          <div className="w-1/2 bg-white border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Original Document</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              {currentInvoice.uploadedFile?.type === 'csv' ? (
                <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                  <div className="bg-gray-50 p-3 border-b flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {currentInvoice.uploadedFile.name}
                    </span>
                    <Badge variant="outline" className="text-xs">
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
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">PDF Document</p>
                  <p className="text-xs text-gray-500">
                    {currentInvoice.uploadedFile?.name || 'Document preview not available'}
                  </p>
                  <Button variant="outline" size="sm" className="mt-4">
                    <Eye className="h-4 w-4 mr-2" />
                    View PDF
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
                  <CardTitle className="text-sm font-medium">Transaction Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-gray-600">Invoice Number</Label>
                      <Input 
                        value={formData.invoiceNumber || ''} 
                        className="mt-1 text-sm"
                        readOnly={!editMode}
                        onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-600">Date</Label>
                      <Input 
                        value={formData.date ? format(new Date(formData.date), 'yyyy-MM-dd') : ''} 
                        type="date"
                        className="mt-1 text-sm"
                        readOnly={!editMode}
                        onChange={(e) => setFormData({...formData, date: new Date(e.target.value)})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs text-gray-600">Supplier</Label>
                    <Input 
                      value={formData.supplierInfo?.name || ''} 
                      className="mt-1 text-sm"
                      readOnly={!editMode}
                      onChange={(e) => setFormData({
                        ...formData, 
                        supplierInfo: {...formData.supplierInfo, name: e.target.value}
                      })}
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-gray-600">Store/Location</Label>
                    <Select 
                      value={formData.store || ''} 
                      disabled={!editMode}
                      onValueChange={(value) => setFormData({...formData, store: value})}
                    >
                      <SelectTrigger className="mt-1 text-sm">
                        <SelectValue placeholder="Select store" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dominos">Dominos</SelectItem>
                        <SelectItem value="Costa Coffee">Costa Coffee</SelectItem>
                        <SelectItem value="Savills">Savills</SelectItem>
                        <SelectItem value="All Locations">All Locations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Line Items - Collapsible */}
                  {currentInvoice.lineItems && currentInvoice.lineItems.length > 0 && (
                    <Collapsible open={lineItemsOpen} onOpenChange={setLineItemsOpen}>
                      <CollapsibleTrigger className="w-full justify-between p-0 h-auto text-xs text-gray-600 font-normal bg-transparent border-none hover:bg-gray-50">
                        <span>Line Items ({currentInvoice.lineItems.length})</span>
                        {lineItemsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2">
                        <div className="border rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-gray-50">
                                <TableHead className="text-xs">Description</TableHead>
                                <TableHead className="text-xs text-right">Qty</TableHead>
                                <TableHead className="text-xs text-right">Unit Price</TableHead>
                                <TableHead className="text-xs text-right">Total</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {currentInvoice.lineItems.map((item) => (
                                <TableRow key={item.id} className="text-xs">
                                  <TableCell className="font-medium py-2">{item.description}</TableCell>
                                  <TableCell className="text-right py-2">{item.quantity}</TableCell>
                                  <TableCell className="text-right py-2">
                                    £{item.price.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                                  </TableCell>
                                  <TableCell className="text-right py-2">
                                    £{item.total.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )}

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

                  {/* Action buttons within the card */}
                  <div className="flex gap-2 pt-4 border-t">
                    {editMode ? (
                      <>
                        <Button size="sm" onClick={() => setEditMode(false)}>
                          <Save className="h-3 w-3 mr-2" />
                          Save Changes
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditMode(false)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="outline" onClick={() => setEditMode(true)}>
                          <Edit className="h-3 w-3 mr-2" />
                          Edit
                        </Button>
                        <Button size="sm">
                          Submit Changes
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
