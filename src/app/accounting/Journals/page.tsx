"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Eye, 
  Search, 
  Building2,
  Clock,
  ChevronRight,
  FileText,
  ArrowUpCircle,
  ArrowDownCircle,
  Plus,
  Save
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { DateAndStoreFilter } from "@/components/date-range-picker";
import { DateRange } from "react-day-picker";
import { format, addMonths } from "date-fns";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Enhanced types for prepayments and accruals
interface MonthlyBreakdown {
  month: string; // Format: "2025-01"
  amount: number;
  status: "scheduled" | "posted" | "reconciled";
}

interface PrepaymentAccrualEntry {
  id: string;
  type: "prepayment" | "accrual";
  title: string;
  supplier?: string;
  category: string;
  totalAmount: number;
  startDate: Date;
  endDate: Date;
  monthlyBreakdown: MonthlyBreakdown[];
  sourceInvoiceId?: string;
  store: string;
  status: "draft" | "active" | "complete";
  createdDate: Date;
}

// Mock data for prepayments and accruals
const mockPrepaymentAccrualEntries: PrepaymentAccrualEntry[] = [
  {
    id: "prep-001",
    type: "prepayment",
    title: "Business Insurance Premium",
    supplier: "AXA Insurance",
    category: "Insurance",
    totalAmount: 6000,
    startDate: new Date("2024-06-01"),
    endDate: new Date("2025-05-31"),
    store: "Kings Hill",
    status: "active",
    createdDate: new Date("2024-06-01"),
    monthlyBreakdown: Array.from({ length: 12 }, (_, i) => ({
      month: format(addMonths(new Date("2024-06-01"), i), "yyyy-MM"),
      amount: 500,
      status: (i < 6 ? "posted" : i < 8 ? "reconciled" : "scheduled") as "posted" | "reconciled" | "scheduled"
    }))
  },
  {
    id: "prep-002", 
    type: "prepayment",
    title: "Rent Advance Payment",
    supplier: "Property Management Ltd",
    category: "Rent & Utilities",
    totalAmount: 15000,
    startDate: new Date("2025-01-01"),
    endDate: new Date("2025-12-31"),
    store: "Tonbridge Main",
    status: "active",
    createdDate: new Date("2025-01-01"),
    monthlyBreakdown: Array.from({ length: 12 }, (_, i) => ({
      month: format(addMonths(new Date("2025-01-01"), i), "yyyy-MM"),
      amount: 1250,
      status: (i < 2 ? "posted" : i < 3 ? "reconciled" : "scheduled") as "posted" | "reconciled" | "scheduled"
    }))
  },
  {
    id: "prep-003",
    type: "prepayment",
    title: "Annual Software License",
    supplier: "TechCorp Solutions",
    category: "Software & IT",
    totalAmount: 2400,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31"),
    store: "Maidstone",
    status: "complete",
    createdDate: new Date("2024-01-01"),
    monthlyBreakdown: Array.from({ length: 12 }, (_, i) => ({
      month: format(addMonths(new Date("2024-01-01"), i), "yyyy-MM"),
      amount: 200,
      status: "reconciled"
    }))
  },
  {
    id: "acr-001",
    type: "accrual",
    title: "Electricity Usage - Q4 2024",
    supplier: "British Gas",
    category: "Utilities",
    totalAmount: 3200,
    startDate: new Date("2024-10-01"),
    endDate: new Date("2024-12-31"),
    store: "Maidstone",
    status: "active", 
    createdDate: new Date("2024-12-31"),
    monthlyBreakdown: [
      { month: "2024-10", amount: 1100, status: "posted" },
      { month: "2024-11", amount: 1050, status: "posted" },
      { month: "2024-12", amount: 1050, status: "reconciled" }
    ]
  },
  {
    id: "acr-002",
    type: "accrual",
    title: "Professional Services - Legal Fees",
    supplier: "Legal Partners LLP",
    category: "Professional Services",
    totalAmount: 4500,
    startDate: new Date("2024-11-01"),
    endDate: new Date("2025-01-31"),
    store: "Sevenoaks",
    status: "active",
    createdDate: new Date("2024-11-15"),
    monthlyBreakdown: [
      { month: "2024-11", amount: 1500, status: "posted" },
      { month: "2024-12", amount: 1500, status: "posted" },
      { month: "2025-01", amount: 1500, status: "scheduled" }
    ]
  },
  {
    id: "acr-003",
    type: "accrual",
    title: "Cleaning Services - Monthly",
    supplier: "CleanCorp Ltd",
    category: "Facilities",
    totalAmount: 1800,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-06-30"),
    store: "Tunbridge Wells",
    status: "complete",
    createdDate: new Date("2024-01-01"),
    monthlyBreakdown: Array.from({ length: 6 }, (_, i) => ({
      month: format(addMonths(new Date("2024-01-01"), i), "yyyy-MM"),
      amount: 300,
      status: "reconciled"
    }))
  }
];

// Types
interface FilterParams {
  dateRange?: DateRange;
  stores?: string;
  search?: string;
  type?: string;
  status?: string;
}

function filterEntries(entries: PrepaymentAccrualEntry[], { dateRange, stores, search, type, status }: FilterParams): PrepaymentAccrualEntry[] {
  return entries.filter(entry => {
    // Filter by date range
    const inDateRange = !dateRange?.from || !dateRange?.to || (
      entry.startDate <= dateRange.to && entry.endDate >= dateRange.from
    );
    
    // Filter by stores
    const inStores = !stores || stores === "all" || stores.split(",").includes(entry.store.toUpperCase());
    
    // Filter by type
    const inType = !type || type === "all" || entry.type === type;
    
    // Filter by status
    const inStatus = !status || status === "all" || entry.status === status;
    
    // Filter by search
    const inSearch = !search || 
      entry.title.toLowerCase().includes(search.toLowerCase()) ||
      entry.supplier?.toLowerCase().includes(search.toLowerCase()) ||
      entry.category.toLowerCase().includes(search.toLowerCase());
    
    return inDateRange && inStores && inSearch && inType && inStatus;
  });
}

function DetailedBreakdownDialog({ 
  entry, 
  open, 
  onOpenChange 
}: { 
  entry: PrepaymentAccrualEntry | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [schedulingEnabled, setSchedulingEnabled] = React.useState(true);
  const [editedEntry, setEditedEntry] = React.useState<PrepaymentAccrualEntry | null>(null);
  const [scheduleType, setScheduleType] = React.useState("monthly");
  const [recurrenceFrequency, setRecurrenceFrequency] = React.useState(1);
  const [detailsCollapsed, setDetailsCollapsed] = React.useState(false);

  React.useEffect(() => {
    if (entry) {
      setEditedEntry({ ...entry });
    }
  }, [entry]);

  if (!entry || !editedEntry) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 2,
    }).format(value);
  };



  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 border-green-200";
      case "complete": return "bg-blue-100 text-blue-800 border-blue-200";
      case "draft": return "bg-gray-100 text-gray-800 border-gray-200";
      case "paused": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "archived": return "bg-gray-100 text-gray-600 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log("Saving journal entry:", editedEntry);
    setIsEditing(false);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setEditedEntry({ ...entry });
    setIsEditing(false);
  };

  const handleStatusChange = (newStatus: string) => {
    setEditedEntry(prev => prev ? { ...prev, status: newStatus as PrepaymentAccrualEntry['status'] } : null);
  };

  const handleFieldChange = (field: string, value: string | number | Date | MonthlyBreakdown[]) => {
    setEditedEntry(prev => prev ? { ...prev, [field]: value } : null);
  };

  const getNextRunDate = () => {
    if (!schedulingEnabled) return null;
    const nextRun = new Date();
    nextRun.setMonth(nextRun.getMonth() + recurrenceFrequency);
    return format(nextRun, "dd MMM yyyy");
  };

  const monthlyAmount = editedEntry.totalAmount / editedEntry.monthlyBreakdown.length;
  const postedCount = editedEntry.monthlyBreakdown.filter(m => m.status === "posted" || m.status === "reconciled").length;
  const totalCount = editedEntry.monthlyBreakdown.length;

  return (
    <div className={`fixed inset-0 z-50 ${open ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl max-h-[95vh] overflow-hidden">
        <Card className="h-full">
          <CardHeader className="border-b bg-gray-50 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {editedEntry.type === "prepayment" ? (
                    <ArrowUpCircle className="h-4 w-4 text-blue-600" />
                  ) : (
                    <ArrowDownCircle className="h-4 w-4 text-green-600" />
                  )}
                  <div>
                    <CardTitle className="text-lg">Edit Journal Entry</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">
                      {editedEntry.title} • {editedEntry.store}
                    </CardDescription>
                  </div>
                </div>
                
                {/* Summary in Header */}
                <div className="flex items-center gap-6 ml-8">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-lg font-bold">{formatCurrency(editedEntry.totalAmount)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Monthly</p>
                    <p className="text-sm font-semibold">{formatCurrency(monthlyAmount)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Progress</p>
                    <p className="text-sm font-semibold">{postedCount}/{totalCount}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge className={getStatusColor(editedEntry.status)} variant="outline">
                      {editedEntry.status}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {schedulingEnabled && getNextRunDate() && (
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Next Run</p>
                    <p className="text-sm font-semibold text-green-600">{getNextRunDate()}</p>
                  </div>
                )}
                <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 overflow-y-auto max-h-[calc(95vh-100px)]">
            <div className="space-y-6">
              {/* Monthly Breakdown - Keep unchanged */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Monthly Breakdown
                  </h3>
                  <div className="text-xs text-muted-foreground">
                    {format(editedEntry.startDate, "MMM yyyy")} - {format(editedEntry.endDate, "MMM yyyy")}
                  </div>
                </div>
                
                <div className="border rounded-lg p-3 bg-gradient-to-r from-muted/20 to-muted/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span>Posted</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span>Reconciled</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                        <span>Scheduled</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Scroll horizontally to view all months →
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <div className="flex gap-3 pb-4" style={{ minWidth: `${editedEntry.monthlyBreakdown.length * 200}px` }}>
                      {editedEntry.monthlyBreakdown.map((breakdown, index) => {
                        const isCurrentMonth = format(new Date(), "yyyy-MM") === breakdown.month;
                        const monthDate = new Date(breakdown.month + "-01");
                        
                        // Enhanced status styling
                        const getStatusStyling = (status: string) => {
                          switch (status) {
                            case "posted":
                              return {
                                cardClass: "border-green-500 bg-green-50 shadow-md",
                                statusClass: "bg-green-100 text-green-800 border-green-300",
                                dotClass: "bg-green-500"
                              };
                            case "reconciled":
                              return {
                                cardClass: "border-blue-500 bg-blue-50 shadow-md",
                                statusClass: "bg-blue-100 text-blue-800 border-blue-300",
                                dotClass: "bg-blue-500"
                              };
                            default:
                              return {
                                cardClass: "border-gray-300 bg-gray-50",
                                statusClass: "bg-gray-100 text-gray-600 border-gray-300",
                                dotClass: "bg-gray-300"
                              };
                          }
                        };

                        const statusStyling = getStatusStyling(breakdown.status);
                        
                        return (
                          <div
                            key={breakdown.month}
                            className={`flex-shrink-0 w-48 p-3 rounded-lg border-2 transition-all duration-200 ${
                              isCurrentMonth 
                                ? 'border-purple-500 bg-purple-50 shadow-lg ring-2 ring-purple-200' 
                                : statusStyling.cardClass + ' hover:shadow-lg'
                            }`}
                          >
                            {/* Month Header */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span className="font-semibold text-xs">
                                  {format(monthDate, "MMM yyyy")}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                {breakdown.status !== "scheduled" ? (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-5 w-5 p-0 hover:bg-white hover:shadow-sm"
                                    onClick={() => {
                                      console.log("View journal for", breakdown.month);
                                    }}
                                  >
                                    <FileText className="h-2.5 w-2.5" />
                                  </Button>
                                ) : (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-5 w-5 p-0 opacity-30 cursor-default"
                                    disabled
                                  >
                                    <Clock className="h-2.5 w-2.5" />
                                  </Button>
                                )}
                                {isCurrentMonth && (
                                  <Badge variant="outline" className="text-[10px] px-1 py-0 bg-purple-100 text-purple-700 border-purple-300">
                                    Current
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Amount */}
                            <div className="mb-3">
                              <div className="text-lg font-bold text-gray-900">
                                {formatCurrency(breakdown.amount)}
                              </div>
                            </div>

                            {/* Status Indicator */}
                            <div className="mb-3">
                              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${statusStyling.statusClass}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${statusStyling.dotClass}`}></div>
                                <span className="text-[10px] font-semibold capitalize">
                                  {breakdown.status}
                                </span>
                              </div>
                            </div>

                            {/* Debit/Credit Display */}
                            <div className="space-y-1 mb-3">
                              <div className="flex justify-between items-center text-[10px]">
                                <span className="text-muted-foreground font-medium">Debit:</span>
                                <span className="font-mono font-semibold">
                                  {editedEntry.type === "prepayment" ? formatCurrency(breakdown.amount) : "—"}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-[10px]">
                                <span className="text-muted-foreground font-medium">Credit:</span>
                                <span className="font-mono font-semibold">
                                  {editedEntry.type === "accrual" ? formatCurrency(breakdown.amount) : "—"}
                                </span>
                              </div>
                            </div>

                            {/* Running Balance */}
                            <div className="pt-2 border-t border-gray-200">
                              <div className="flex justify-between items-center text-[10px]">
                                <span className="text-muted-foreground font-medium">Balance:</span>
                                <span className="font-mono font-bold text-gray-900">
                                  {formatCurrency(breakdown.amount * (index + 1))}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Journal Details - Simplified */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDetailsCollapsed(!detailsCollapsed)}
                      className="p-0 h-auto"
                    >
                      <ChevronRight className={`h-4 w-4 transition-transform ${detailsCollapsed ? '' : 'rotate-90'}`} />
                    </Button>
                    <h3 className="text-base font-semibold">Journal Details</h3>
                  </div>
                  <Button
                    variant={isEditing ? "outline" : "default"}
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? "Cancel Edit" : "Edit Journal"}
                  </Button>
                </div>

                {!detailsCollapsed && (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Journal Name</label>
                        {isEditing ? (
                          <Input
                            value={editedEntry.title}
                            onChange={(e) => handleFieldChange('title', e.target.value)}
                            placeholder="Enter journal title"
                            className="h-9"
                          />
                        ) : (
                          <p className="p-2 bg-white rounded border text-sm">{editedEntry.title}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Journal Type</label>
                        {isEditing ? (
                          <Select value={editedEntry.type} onValueChange={(value) => handleFieldChange('type', value)}>
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="prepayment">Prepayment</SelectItem>
                              <SelectItem value="accrual">Accrual</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="p-2 bg-white rounded border text-sm capitalize">{editedEntry.type}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Supplier</label>
                        {isEditing ? (
                          <Input
                            value={editedEntry.supplier || ''}
                            onChange={(e) => handleFieldChange('supplier', e.target.value)}
                            placeholder="Enter supplier name"
                            className="h-9"
                          />
                        ) : (
                          <p className="p-2 bg-white rounded border text-sm">{editedEntry.supplier || 'N/A'}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        {isEditing ? (
                          <Select value={editedEntry.category} onValueChange={(value) => handleFieldChange('category', value)}>
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Insurance">Insurance</SelectItem>
                              <SelectItem value="Rent & Utilities">Rent & Utilities</SelectItem>
                              <SelectItem value="Software & IT">Software & IT</SelectItem>
                              <SelectItem value="Utilities">Utilities</SelectItem>
                              <SelectItem value="Professional Services">Professional Services</SelectItem>
                              <SelectItem value="Facilities">Facilities</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="p-2 bg-white rounded border text-sm">{editedEntry.category}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Store</label>
                        {isEditing ? (
                          <Select value={editedEntry.store} onValueChange={(value) => handleFieldChange('store', value)}>
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Kings Hill">Kings Hill</SelectItem>
                              <SelectItem value="Tonbridge Main">Tonbridge Main</SelectItem>
                              <SelectItem value="Tunbridge Wells">Tunbridge Wells</SelectItem>
                              <SelectItem value="Southborough">Southborough</SelectItem>
                              <SelectItem value="Maidstone">Maidstone</SelectItem>
                              <SelectItem value="Sevenoaks">Sevenoaks</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="p-2 bg-white rounded border text-sm">{editedEntry.store}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Total Amount</label>
                        {isEditing ? (
                          <Input
                            type="number"
                            value={editedEntry.totalAmount}
                            onChange={(e) => handleFieldChange('totalAmount', parseFloat(e.target.value) || 0)}
                            placeholder="Enter total amount"
                            className="h-9"
                          />
                        ) : (
                          <p className="p-2 bg-white rounded border text-sm font-mono">{formatCurrency(editedEntry.totalAmount)}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Start Date</label>
                        {isEditing ? (
                          <Input
                            type="date"
                            value={format(editedEntry.startDate, 'yyyy-MM-dd')}
                            onChange={(e) => handleFieldChange('startDate', new Date(e.target.value))}
                            className="h-9"
                          />
                        ) : (
                          <p className="p-2 bg-white rounded border text-sm">{format(editedEntry.startDate, 'dd MMM yyyy')}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">End Date</label>
                        {isEditing ? (
                          <Input
                            type="date"
                            value={format(editedEntry.endDate, 'yyyy-MM-dd')}
                            onChange={(e) => handleFieldChange('endDate', new Date(e.target.value))}
                            className="h-9"
                          />
                        ) : (
                          <p className="p-2 bg-white rounded border text-sm">{format(editedEntry.endDate, 'dd MMM yyyy')}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Scheduling Panel - Simplified */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold">Scheduling</h3>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Enable Scheduling</label>
                    <input
                      type="checkbox"
                      checked={schedulingEnabled}
                      onChange={(e) => setSchedulingEnabled(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                  </div>
                </div>

                {schedulingEnabled && (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Schedule Type</label>
                          <Select value={scheduleType} onValueChange={setScheduleType}>
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="monthly">Monthly</SelectItem>
                              <SelectItem value="quarterly">Quarterly</SelectItem>
                              <SelectItem value="annually">Annually</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Frequency</label>
                          <Input
                            type="number"
                            value={recurrenceFrequency}
                            onChange={(e) => setRecurrenceFrequency(parseInt(e.target.value) || 1)}
                            min="1"
                            placeholder="1"
                            className="h-9"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">No. of Months</label>
                          <Input
                            type="number"
                            value={editedEntry.monthlyBreakdown.length}
                            onChange={(e) => {
                              const months = parseInt(e.target.value) || 1;
                              const newBreakdown = Array.from({ length: months }, (_, i) => ({
                                month: format(addMonths(editedEntry.startDate, i), "yyyy-MM"),
                                amount: editedEntry.totalAmount / months,
                                status: (i < postedCount ? "posted" : "scheduled") as "posted" | "scheduled"
                              }));
                              handleFieldChange('monthlyBreakdown', newBreakdown);
                            }}
                            min="1"
                            placeholder="12"
                            className="h-9"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Prepaid Amount</label>
                          <Input
                            type="number"
                            value={editedEntry.totalAmount}
                            onChange={(e) => handleFieldChange('totalAmount', parseFloat(e.target.value) || 0)}
                            placeholder="Enter prepaid amount"
                            className="h-9"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Next Run Date</label>
                          <div className="p-2 bg-white border rounded text-sm h-9 flex items-center">
                            {getNextRunDate() || 'Not scheduled'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Status:</span>
                  <Select value={editedEntry.status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-32 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="complete">Complete</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    Delete Journal
                  </Button>
                  <Button onClick={handleSave} size="sm" className="gap-2">
                    <Save className="h-3 w-3" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function JournalsContent() {
  const searchParams = useSearchParams();
  const urlType = searchParams.get('type');
  const sourceId = searchParams.get('sourceId');
  const store = searchParams.get('store');
  const amount = searchParams.get('amount');
  
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [storeValue, setStoreValue] = React.useState<string>(store || "all");
  const [typeFilter, setTypeFilter] = React.useState<string>(urlType || "all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [search, setSearch] = React.useState<string>("");
  const [selectedEntry, setSelectedEntry] = React.useState<PrepaymentAccrualEntry | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = React.useState<boolean>(false);

  // Separate filters for completed journals
  const [completedDateRange, setCompletedDateRange] = React.useState<DateRange | undefined>();
  const [completedStoreValue, setCompletedStoreValue] = React.useState<string>("all");
  const [completedTypeFilter, setCompletedTypeFilter] = React.useState<string>("all");
  const [completedSearch, setCompletedSearch] = React.useState<string>("");

  // Handle viewing entry details
  const handleViewEntry = (entry: PrepaymentAccrualEntry) => {
    setSelectedEntry(entry);
    setDetailDialogOpen(true);
  };

  // Show notification if coming from stock control
  React.useEffect(() => {
    if (urlType && sourceId && store) {
      console.log(`Viewing ${urlType} entries for ${store} (Source: ${sourceId})`);
    }
  }, [urlType, sourceId, store]);

  // Filter active entries (draft and active status)
  const activeEntries = mockPrepaymentAccrualEntries.filter(entry => entry.status !== "complete");
  const filteredActiveEntries = filterEntries(activeEntries, {
    dateRange,
    stores: storeValue,
    search,
    type: typeFilter,
    status: statusFilter
  });

  // Filter completed entries
  const completedEntries = mockPrepaymentAccrualEntries.filter(entry => entry.status === "complete");
  const filteredCompletedEntries = filterEntries(completedEntries, {
    dateRange: completedDateRange,
    stores: completedStoreValue,
    search: completedSearch,
    type: completedTypeFilter,
    status: "complete"
  });

  // Sort entries by created date (newest first)
  const sortedActiveEntries = [...filteredActiveEntries].sort((a, b) => 
    new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
  );

  const sortedCompletedEntries = [...filteredCompletedEntries].sort((a, b) => 
    new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency", 
      currency: "GBP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 border-green-200";
      case "complete": return "bg-blue-100 text-blue-800 border-blue-200";
      case "draft": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    return type === "prepayment" ? (
      <ArrowUpCircle className="h-4 w-4 text-blue-600" />
    ) : (
      <ArrowDownCircle className="h-4 w-4 text-green-600" />
    );
  };

  const getProgress = (entry: PrepaymentAccrualEntry) => {
    const posted = entry.monthlyBreakdown.filter(m => m.status === "posted" || m.status === "reconciled").length;
    const total = entry.monthlyBreakdown.length;
    return { posted, total, percentage: (posted / total) * 100 };
  };

  const JournalTable = ({ 
    entries, 
    title, 
    searchValue, 
    onSearchChange, 
    dateRange, 
    onDateRangeChange, 
    storeValue, 
    onStoreChange, 
    typeFilter, 
    onTypeFilterChange, 
    statusFilter, 
    onStatusFilterChange, 
    showStatusFilter = true 
  }: {
    entries: PrepaymentAccrualEntry[];
    title: string;
    searchValue: string;
    onSearchChange: (value: string) => void;
    dateRange: DateRange | undefined;
    onDateRangeChange: (range: DateRange | undefined) => void;
    storeValue: string;
    onStoreChange: (value: string) => void;
    typeFilter: string;
    onTypeFilterChange: (value: string) => void;
    statusFilter: string;
    onStatusFilterChange: (value: string) => void;
    showStatusFilter?: boolean;
  }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="text-sm text-muted-foreground">
          {entries.length} entries
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg border">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search journals..."
              className="pl-8 w-64"
              value={searchValue}
              onChange={e => onSearchChange(e.target.value)}
            />
          </div>
          
          <Select value={typeFilter} onValueChange={onTypeFilterChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="prepayment">Prepayments</SelectItem>
              <SelectItem value="accrual">Accruals</SelectItem>
            </SelectContent>
          </Select>
          
          {showStatusFilter && (
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
              </SelectContent>
            </Select>
          )}
          
          <DateAndStoreFilter
            storeValue={storeValue}
            onStoreChange={onStoreChange}
            dateValue={dateRange}
            onDateChange={onDateRangeChange}
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold px-6 py-4">Type</TableHead>
              <TableHead className="font-semibold px-6 py-4">Journal Entry</TableHead>
              <TableHead className="font-semibold px-6 py-4">Store</TableHead>
              <TableHead className="text-right font-semibold px-6 py-4">Amount</TableHead>
              <TableHead className="font-semibold px-6 py-4">Period</TableHead>
              <TableHead className="text-center font-semibold px-6 py-4">Status</TableHead>
              <TableHead className="text-center font-semibold px-6 py-4">Progress</TableHead>
              <TableHead className="text-center font-semibold px-6 py-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry, index) => {
              const progress = getProgress(entry);
              return (
                <TableRow 
                  key={entry.id}
                  className={`transition-all duration-200 ${
                    index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                  } hover:bg-muted/40`}
                >
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(entry.type)}
                      <span className="capitalize font-medium">{entry.type}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="font-medium">{entry.title}</p>
                      <p className="text-sm text-muted-foreground">#{entry.id}</p>
                      {entry.supplier && (
                        <p className="text-xs text-muted-foreground">{entry.supplier} • {entry.category}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-sm">{entry.store}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono px-6 py-4">
                    <span className="font-semibold">{formatCurrency(entry.totalAmount)}</span>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="text-sm">
                      <div>{format(entry.startDate, "MMM yyyy")}</div>
                      <div className="text-muted-foreground">to {format(entry.endDate, "MMM yyyy")}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center px-6 py-4">
                    <Badge className={getStatusColor(entry.status)} variant="outline">
                      {entry.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center px-6 py-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">
                        {progress.posted}/{progress.total} months
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            entry.type === "prepayment" ? "bg-blue-600" : "bg-green-600"
                          }`}
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center px-6 py-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewEntry(entry)}
                      className="gap-2"
                    >
                      <Eye className="h-3 w-3" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Navigation Banner */}
      {urlType && sourceId && store && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">
                    Viewing {urlType} entries for {store}
                  </p>
                  <p className="text-sm text-blue-700">
                    Navigate from Stock Control - {amount && `Variance: ${formatCurrency(parseFloat(amount))}`}
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
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Manual Journals</h1>
          <p className="text-muted-foreground">
            Manage prepayments and accruals to ensure accurate period reporting
          </p>
        </div>
        
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Journal Entry
        </Button>
      </div>

      {/* Active Journals Table */}
      <JournalTable
        entries={sortedActiveEntries}
        title="Active Journals"
        searchValue={search}
        onSearchChange={setSearch}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        storeValue={storeValue}
        onStoreChange={setStoreValue}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        showStatusFilter={true}
      />

      {/* Completed Journals Table */}
      <JournalTable
        entries={sortedCompletedEntries}
        title="Completed Journals"
        searchValue={completedSearch}
        onSearchChange={setCompletedSearch}
        dateRange={completedDateRange}
        onDateRangeChange={setCompletedDateRange}
        storeValue={completedStoreValue}
        onStoreChange={setCompletedStoreValue}
        typeFilter={completedTypeFilter}
        onTypeFilterChange={setCompletedTypeFilter}
        statusFilter="complete"
        onStatusFilterChange={() => {}}
        showStatusFilter={false}
      />

      {/* Legend */}
      <div className="mt-4 p-3 bg-muted/20 rounded-lg border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <ArrowUpCircle className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Prepayment</span>
              <span className="text-xs text-muted-foreground">- Paid in advance</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowDownCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Accrual</span>
              <span className="text-xs text-muted-foreground">- Incurred not paid</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <span className="text-xs font-medium">Draft</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-600"></div>
                <span className="text-xs font-medium">Active</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                <span className="text-xs font-medium">Complete</span>
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Use filters to find specific journal entries or click &quot;View Details&quot; to see monthly breakdown
          </div>
        </div>
      </div>

      {/* Detailed Breakdown Dialog */}
      <DetailedBreakdownDialog 
        entry={selectedEntry}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
      />
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
