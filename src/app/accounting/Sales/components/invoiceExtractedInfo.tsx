"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AlertTriangle, Check, ChevronDown, ChevronRight, Edit, FileText, Save } from "lucide-react";
import { format } from "date-fns";
import { ReviewError, SalesInvoiceData, SalesLineItem } from "./types";
import LineItemsSection from "./LineItemsSection";

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

interface InvoiceExtractedInfoProps {
  currentInvoice: SalesInvoiceData;
  formData: Partial<SalesInvoiceData>;
  setFormData: (data: Partial<SalesInvoiceData>) => void;
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  isPublished: boolean;
  handlePublish: () => void;
  handleUnpublish: () => void;
  handleReprocess: () => void;
  handleArchive: () => void;
}

const InvoiceExtractedInfo: React.FC<InvoiceExtractedInfoProps> = ({
  currentInvoice,
  formData,
  setFormData,
  editMode,
  setEditMode,
  isPublished,
  handlePublish,
  handleUnpublish,
  handleReprocess,
  handleArchive
}) => {
  const [lineItemsOpen, setLineItemsOpen] = React.useState(false);
  const [companyOpen, setCompanyOpen] = React.useState(false);
  const [supplierOpen, setSupplierOpen] = React.useState(false);

  // Auto-open line items when entering edit mode
  React.useEffect(() => {
    if (editMode) {
      setLineItemsOpen(true);
    }
  }, [editMode]);

  return (
    <div className="p-3 space-y-3">
      {/* Review Errors Section */}
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

      {/* Invoice Document */}
      <Card className="border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Invoice</h2>
            </div>
            
            {/* Completion Status and Edit Controls */}
            <div className="flex items-center gap-3">
              {(() => {
                const requiredFields = [
                  formData.company,
                  formData.supplierInfo?.name,
                  formData.documentType,
                  formData.invoiceNumber,
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
                    <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
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
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Invoice Header - Company & Document Info */}
          <div className="grid grid-cols-2 gap-6">
            {/* Left: Company Information */}
            <div className="space-y-3">
              <div className="text-sm font-semibold text-gray-900 border-b pb-1">From</div>
              
                             <div>
                 <Label className="text-xs font-medium text-gray-700">Company *</Label>
                 {editMode ? (
                   <Popover open={companyOpen} onOpenChange={setCompanyOpen}>
                     <PopoverTrigger asChild>
                       <Button
                         variant="outline"
                         role="combobox"
                         aria-expanded={companyOpen}
                         className={`mt-1 w-full justify-between text-sm h-8 ${!formData.company ? 'border-amber-300 bg-amber-50' : ''}`}
                       >
                         {formData.company || "Select company"}
                         <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                       </Button>
                     </PopoverTrigger>
                     <PopoverContent className="w-full p-0">
                       <Command>
                         <CommandInput placeholder="Search companies..." />
                         <CommandList>
                           <CommandEmpty>No company found.</CommandEmpty>
                           <CommandGroup>
                             {companyOptions.map((company) => (
                               <CommandItem
                                 key={company}
                                 value={company}
                                 onSelect={(currentValue) => {
                                   setFormData({...formData, company: currentValue});
                                   setCompanyOpen(false);
                                 }}
                               >
                                 {company}
                               </CommandItem>
                             ))}
                           </CommandGroup>
                         </CommandList>
                       </Command>
                     </PopoverContent>
                   </Popover>
                 ) : (
                   <div className={`mt-1 text-sm p-2 border rounded h-8 flex items-center ${formData.company ? 'bg-gray-50' : 'bg-amber-50 border-amber-300'}`}>
                     {formData.company || "⚠️ No company selected"}
                   </div>
                 )}
               </div>
            </div>

            {/* Right: Document Information */}
            <div className="space-y-3">
              <div className="text-sm font-semibold text-gray-900 border-b pb-1">Document Details</div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-medium text-gray-700">Type *</Label>
                  {editMode ? (
                    <Select 
                      value={formData.documentType || ''} 
                                              onValueChange={(value) => setFormData({...formData, documentType: value as "Sales Invoice" | "Credit Note" | "Bill"})}
                    >
                      <SelectTrigger className={`mt-1 text-sm h-8 ${!formData.documentType ? 'border-amber-300 bg-amber-50' : ''}`}>
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sales Invoice">Sales Invoice</SelectItem>
                        <SelectItem value="Credit Note">Credit Note</SelectItem>
                        <SelectItem value="Bill">Bill</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className={`mt-1 text-sm p-2 border rounded h-8 flex items-center ${formData.documentType ? 'bg-gray-50' : 'bg-amber-50 border-amber-300'}`}>
                      {formData.documentType || "⚠️ No type"}
                    </div>
                  )}
                </div>
                
                <div>
                  <Label className="text-xs font-medium text-gray-700">Number *</Label>
                  <Input 
                    value={formData.invoiceNumber || ''} 
                    className="mt-1 text-sm h-8"
                    readOnly={!editMode || isPublished}
                    placeholder="Invoice #"
                    onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Supplier & Dates */}
          <div className="grid grid-cols-2 gap-6">
            {/* Left: Supplier Information */}
            <div className="space-y-3">
              <div className="text-sm font-semibold text-gray-900 border-b pb-1">Bill To</div>
              
                             <div>
                 <Label className="text-xs font-medium text-gray-700">Supplier *</Label>
                 {editMode ? (
                   <Popover open={supplierOpen} onOpenChange={setSupplierOpen}>
                     <PopoverTrigger asChild>
                       <Button
                         variant="outline"
                         role="combobox"
                         aria-expanded={supplierOpen}
                         className={`mt-1 w-full justify-between text-sm h-8 ${!formData.supplierInfo?.name ? 'border-amber-300 bg-amber-50' : ''}`}
                       >
                         {formData.supplierInfo?.name || "Select supplier"}
                         <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                       </Button>
                     </PopoverTrigger>
                     <PopoverContent className="w-full p-0">
                       <Command>
                         <CommandInput placeholder="Search suppliers..." />
                         <CommandList>
                           <CommandEmpty>No supplier found.</CommandEmpty>
                           <CommandGroup>
                             {supplierOptions.map((supplier) => (
                               <CommandItem
                                 key={supplier}
                                 value={supplier}
                                 onSelect={(currentValue) => {
                                   setFormData({
                                     ...formData, 
                                     supplierInfo: {...formData.supplierInfo, name: currentValue}
                                   });
                                   setSupplierOpen(false);
                                 }}
                               >
                                 {supplier}
                               </CommandItem>
                             ))}
                           </CommandGroup>
                         </CommandList>
                       </Command>
                     </PopoverContent>
                   </Popover>
                 ) : (
                   <div className={`mt-1 text-sm p-2 border rounded h-8 flex items-center ${formData.supplierInfo?.name ? 'bg-gray-50' : 'bg-amber-50 border-amber-300'}`}>
                     {formData.supplierInfo?.name || "⚠️ No supplier selected"}
                   </div>
                 )}
               </div>
            </div>

            {/* Right: Date & Account Information */}
            <div className="space-y-3">
              <div className="text-sm font-semibold text-gray-900 border-b pb-1">Payment Terms</div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-medium text-gray-700">Invoice Date *</Label>
                  <Input 
                    value={formData.date ? format(new Date(formData.date), 'yyyy-MM-dd') : ''} 
                    type="date"
                    className="mt-1 text-sm h-8"
                    readOnly={!editMode}
                    onChange={(e) => setFormData({...formData, date: new Date(e.target.value)})}
                  />
                </div>
                
                <div>
                  <Label className="text-xs font-medium text-gray-700">Due Date</Label>
                  <Input 
                    value={formData.dueDate ? format(new Date(formData.dueDate), 'yyyy-MM-dd') : ''} 
                    type="date"
                    className="mt-1 text-sm h-8"
                    readOnly={!editMode}
                    placeholder="Optional"
                    onChange={(e) => setFormData({...formData, dueDate: new Date(e.target.value)})}
                  />
                </div>
              </div>
              
            </div>
          </div>

          {/* Line Items Section */}
          <div className="border-t pt-4">
            <Collapsible open={lineItemsOpen} onOpenChange={setLineItemsOpen}>
              <CollapsibleTrigger className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded text-sm font-medium text-gray-900 border border-gray-200">
                <span>Items & Services ({formData.lineItems?.length || 0})</span>
                {lineItemsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                <LineItemsSection
                  lineItems={formData.lineItems || []}
                  setLineItems={(lineItems: SalesLineItem[] | ((prev: SalesLineItem[]) => SalesLineItem[])) => {
                    if (typeof lineItems === 'function') {
                      const updatedLineItems = lineItems(formData.lineItems || []);
                      setFormData({
                        ...formData,
                        lineItems: updatedLineItems
                      });
                    } else {
                      setFormData({
                        ...formData,
                        lineItems: lineItems
                      });
                    }
                  }}
                  isEditing={editMode && !isPublished}
                />
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Invoice Totals */}
          <div className="border-t pt-3">
            <div className="flex justify-end">
              <div className="w-80 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">
                    £{(formData.subtotal || 0).toFixed(2)}
                  </span>
                </div>
                
                {/* Tax Rate Breakdown */}
                {formData.lineItems && formData.lineItems.length > 0 && (
                  <div className="border-t border-gray-200 pt-2 space-y-1.5">
                    {Object.entries(
                      formData.lineItems.reduce((acc: { [key: string]: number }, item) => {
                        const rate = item.vatRate || 0;
                        const taxAmount = (item.quantity * item.price * (rate / 100));
                        acc[rate] = (acc[rate] || 0) + taxAmount;
                        return acc;
                      }, {})
                    ).sort(([rateA], [rateB]) => Number(rateB) - Number(rateA)).map(([rate, amount]) => (
                      <div key={rate} className="flex justify-between text-sm items-center">
                        <span className="text-gray-600 flex items-center gap-1.5">
                          VAT {rate}%
                          {rate === '0' && (
                            <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                              Zero-rated
                            </span>
                          )}
                        </span>
                        <span className="font-medium">
                          £{amount.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between text-lg font-semibold border-t border-gray-900 pt-2 mt-2">
                  <span>Total:</span>
                  <span>
                    £{(formData.total || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3 pt-4 border-t">
            {currentInvoice.status === 'Review' ? (
              <>
                <Button 
                  size="sm" 
                  onClick={handlePublish}
                  className="px-6"
                >
                  Publish
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleArchive}
                  className="px-6"
                >
                  {currentInvoice.archived ? 'Unarchive' : 'Archive'}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleReprocess}
                  className="px-6"
                >
                  Reprocess
                </Button>
              </>
            ) : isPublished ? (
              <>
                <Button 
                  size="sm" 
                  variant={currentInvoice.paymentStatus === 'paid' ? 'outline' : 'destructive'}
                  onClick={handleUnpublish}
                  disabled={currentInvoice.paymentStatus === 'paid'}
                  className={`px-6 ${
                    currentInvoice.paymentStatus === 'paid' 
                      ? 'text-red-300 border-red-200 bg-red-50 cursor-not-allowed' 
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  Unpublish
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleArchive}
                  className="px-6"
                >
                  {currentInvoice.archived ? 'Unarchive' : 'Archive'}
                </Button>
                {currentInvoice.paymentStatus === 'paid' && (
                  <div className="text-xs text-gray-500 italic flex items-center">
                    Invoice has been paid and cannot be unpublished
                  </div>
                )}
              </>
            ) : (
              <>
                <Button 
                  size="sm" 
                  onClick={handlePublish}
                  disabled={isPublished}
                  className="px-6"
                >
                  Publish
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={handleArchive}
                  className="px-6"
                >
                  {currentInvoice.archived ? 'Unarchive' : 'Archive'}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceExtractedInfo;
