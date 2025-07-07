"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { 
  FileText, 
  AlertTriangle, 
  Edit,
  Save,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  Building,
  Receipt,
  Calendar,
  List,
  DollarSign,
} from "lucide-react";
import { SalesInvoiceData, ReviewError, SalesLineItem } from "./components/types";
import LineItemsSection from "./components/LineItemsSection";

interface InvoiceInfoProps {
  currentInvoice: SalesInvoiceData;
  formData: Partial<SalesInvoiceData>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<SalesInvoiceData>>>;
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  lineItemsOpen: boolean;
  setLineItemsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isPublished: boolean;
  handlePublish: () => void;
  handleArchive: () => void;
}

// Error severity styling
const getErrorSeverityStyle = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'border-red-200 bg-red-50 text-red-800';
    case 'high':
      return 'border-orange-200 bg-orange-50 text-orange-800';
    case 'medium':
      return 'border-yellow-200 bg-yellow-50 text-yellow-800';
    case 'low':
      return 'border-blue-200 bg-blue-50 text-blue-800';
    default:
      return 'border-gray-200 bg-gray-50 text-gray-800';
  }
};

// Dropdown options
const companyOptions = [
  "Franchise Holdings Ltd",
  "Regional Operations Ltd", 
  "Central Management Ltd",
  "Local Store Co Ltd"
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

// Searchable Dropdown Component
const SearchableDropdown = ({ 
  options, 
  value, 
  onValueChange, 
  placeholder, 
  isRequired = false, 
  disabled = false,
  className = "" 
}: {
  options: string[] | { value: string; label: string }[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  isRequired?: boolean;
  disabled?: boolean;
  className?: string;
}) => {
  const [open, setOpen] = React.useState(false);
  
  const displayValue = React.useMemo(() => {
    if (Array.isArray(options) && options.length > 0 && typeof options[0] === 'object') {
      const option = (options as { value: string; label: string }[]).find(opt => opt.value === value);
      return option ? option.label : value;
    }
    return value;
  }, [options, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between text-left font-normal ${
            !value && isRequired ? 'border-red-300 bg-red-50' : ''
          } ${className}`}
          disabled={disabled}
        >
          {value ? displayValue : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => {
              const optionValue = typeof option === 'string' ? option : option.value;
              const optionLabel = typeof option === 'string' ? option : option.label;
              
              return (
                <CommandItem
                  key={optionValue}
                  value={optionValue}
                  onSelect={() => {
                    onValueChange(optionValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      value === optionValue ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {optionLabel}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const InvoiceInfo: React.FC<InvoiceInfoProps> = ({ 
  currentInvoice, 
  formData, 
  setFormData, 
  editMode, 
  setEditMode, 
  lineItemsOpen, 
  setLineItemsOpen, 
  isPublished, 
  handlePublish, 
  handleArchive 
}) => {
  // Calculate completion percentage
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
    <div className="w-1/2 bg-slate-50 overflow-y-auto">
      <div className="p-3 space-y-3">
        {/* Header with Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-slate-600" />
            <h2 className="font-semibold text-slate-900">Invoice Details</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-slate-500">
              {completed}/{total} complete
            </div>
            <div className="w-12 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  percentage === 100 ? 'bg-green-500' : 
                  percentage >= 60 ? 'bg-blue-500' : 
                  percentage >= 20 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Review Errors */}
        {currentInvoice.reviewErrors && currentInvoice.reviewErrors.length > 0 && (
          <Card className="border-red-200 bg-red-50">
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
                      <span className="font-medium">{error.title}</span>
                    </div>
                    <Button size="sm" variant="ghost" className="h-5 px-1">
                      <Check className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="mt-1 ml-4 text-xs opacity-90">{error.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-900">Organization</span>
              </div>
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
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Organization Section */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-medium text-slate-700 mb-1 block">Company *</Label>
                {editMode ? (
                  <SearchableDropdown
                    options={companyOptions}
                    value={formData.company || ''}
                    onValueChange={(value) => setFormData({...formData, company: value})}
                    placeholder="Select company"
                    isRequired={true}
                    className="text-sm"
                  />
                ) : (
                  <div className={`text-sm p-2 border rounded bg-white ${!formData.company ? 'text-red-600 border-red-300' : 'text-slate-700'}`}>
                    {formData.company || "⚠️ No company selected"}
                  </div>
                )}
              </div>
              <div>
                <Label className="text-xs font-medium text-slate-700 mb-1 block">Supplier *</Label>
                {editMode ? (
                  <SearchableDropdown
                    options={supplierOptions}
                    value={formData.supplierInfo?.name || ''}
                    onValueChange={(value) => setFormData({
                      ...formData, 
                      supplierInfo: {...formData.supplierInfo, name: value}
                    })}
                    placeholder="Select supplier"
                    isRequired={true}
                    className="text-sm"
                  />
                ) : (
                  <div className={`text-sm p-2 border rounded bg-white ${!formData.supplierInfo?.name ? 'text-red-600 border-red-300' : 'text-slate-700'}`}>
                    {formData.supplierInfo?.name || "⚠️ No supplier selected"}
                  </div>
                )}
              </div>
            </div>

            {/* Invoice Details Section */}
            <div className="border-t pt-3">
              <div className="flex items-center gap-2 mb-2">
                <Receipt className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-900">Invoice Details</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-medium text-slate-700 mb-1 block">Document Type *</Label>
                  {editMode ? (
                    <Select 
                      value={formData.documentType || ''} 
                      onValueChange={(value) => setFormData({...formData, documentType: value as "Bill" | "Sales Invoice" | "Credit Note"})}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sales Invoice">Sales Invoice</SelectItem>
                        <SelectItem value="Bill">Bills</SelectItem>
                        <SelectItem value="Credit Note">Credit Note</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className={`text-sm p-2 border rounded bg-white ${!formData.documentType ? 'text-red-600 border-red-300' : 'text-slate-700'}`}>
                      {formData.documentType || "⚠️ No type selected"}
                    </div>
                  )}
                </div>
                <div>
                  <Label className="text-xs font-medium text-slate-700 mb-1 block">Invoice Number *</Label>
                  <Input 
                    value={formData.invoiceNumber || ''} 
                    className="text-sm"
                    readOnly={!editMode || isPublished}
                    placeholder="Enter invoice number"
                    onChange={(e) => setFormData({...formData, invoiceNumber: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Date Information */}
            <div className="border-t pt-3">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-900">Date Information</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-medium text-slate-700 mb-1 block">Invoice Date *</Label>
                  <Input 
                    value={formData.date ? format(new Date(formData.date), 'yyyy-MM-dd') : ''} 
                    type="date"
                    className="text-sm"
                    readOnly={!editMode}
                    onChange={(e) => setFormData({...formData, date: new Date(e.target.value)})}
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-slate-700 mb-1 block">Due Date</Label>
                  <Input 
                    value={formData.dueDate ? format(new Date(formData.dueDate), 'yyyy-MM-dd') : ''} 
                    type="date"
                    className="text-sm"
                    readOnly={!editMode}
                    placeholder="Optional"
                    onChange={(e) => setFormData({...formData, dueDate: new Date(e.target.value)})}
                  />
                </div>
              </div>
            </div>

            {/* Line Items Section */}
            <div className="border-t pt-3">
              <Collapsible open={lineItemsOpen} onOpenChange={setLineItemsOpen}>
                <CollapsibleTrigger className="w-full flex items-center justify-between p-0 text-sm font-medium text-slate-900 hover:text-slate-700">
                  <div className="flex items-center gap-2">
                    <List className="h-4 w-4 text-slate-600" />
                    <span>Line Items ({formData.lineItems?.length || 0})</span>
                  </div>
                  {lineItemsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <div className="border rounded-lg bg-white p-2 max-h-96 overflow-y-auto">
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
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Totals Section */}
            <div className="border-t pt-3">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-slate-600" />
                <span className="text-sm font-medium text-slate-900">Financial Summary</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal:</span>
                  <span className="font-medium text-slate-900">
                    £{formData.subtotal?.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                
                {/* Tax Breakdown */}
                {(() => {
                  const taxBreakdown = (formData.lineItems || []).reduce((acc, item) => {
                    const vatRate = item.vatRate;
                    let taxType = '';
                    
                    if (vatRate === 20) taxType = '20% (Income)';
                    else if (vatRate === 20.1) taxType = '20% (Expenses)';
                    else if (vatRate === 5) taxType = '5% (Income)';
                    else if (vatRate === 5.1) taxType = '5% (Expenses)';
                    else if (vatRate === 0) taxType = 'No Tax';
                    else if (vatRate === -1) taxType = 'Zero Rated Expenses';
                    else if (vatRate === -2) taxType = 'Zero Rated Income';
                    else taxType = `${vatRate}%`;
                    
                    if (item.vat > 0) {
                      acc[taxType] = (acc[taxType] || 0) + item.vat;
                    }
                    
                    return acc;
                  }, {} as Record<string, number>);
                  
                  const totalTax = Object.values(taxBreakdown).reduce((sum, amount) => sum + amount, 0);
                  
                  return (
                    <>
                      {Object.entries(taxBreakdown).map(([taxType, amount]) => (
                        <div key={taxType} className="flex justify-between text-sm">
                          <span className="text-slate-600">{taxType}:</span>
                          <span className="font-medium text-slate-900">
                            £{amount.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm border-t pt-2">
                        <span className="text-slate-600">Total Tax Amount:</span>
                        <span className="font-medium text-slate-900">
                          £{totalTax.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </>
                  );
                })()}
                
                <div className="flex justify-between text-base font-semibold border-t pt-2">
                  <span className="text-slate-900">Total:</span>
                  <span className="text-slate-900">
                    £{formData.total?.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t pt-3">
              <div className="flex justify-center gap-3">
                {isPublished ? (
                  <div className="text-sm text-slate-500 italic text-center py-2">
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
                      {currentInvoice.archived ? 'Unarchive' : 'Archive'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvoiceInfo;
