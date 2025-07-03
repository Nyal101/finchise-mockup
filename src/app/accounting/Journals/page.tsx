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
  Receipt,
  Clock,
  ChevronRight,
  FileText,
  ArrowUpCircle,
  ArrowDownCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { DateAndStoreFilter } from "@/components/date-range-picker";
import { DateRange } from "react-day-picker";
import { format, addMonths } from "date-fns";

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
  }
];

// Types
interface FilterParams {
  dateRange?: DateRange;
  stores?: string;
  search?: string;
}

function filterEntries(entries: PrepaymentAccrualEntry[], { dateRange, stores, search }: FilterParams): PrepaymentAccrualEntry[] {
  return entries.filter(entry => {
    // Filter by date range
    const inDateRange = !dateRange?.from || !dateRange?.to || (
      entry.startDate <= dateRange.to && entry.endDate >= dateRange.from
    );
    
    // Filter by stores
    const inStores = !stores || stores === "all" || stores.split(",").includes(entry.store.toUpperCase());
    
    // Filter by search
    const inSearch = !search || 
      entry.title.toLowerCase().includes(search.toLowerCase()) ||
      entry.supplier?.toLowerCase().includes(search.toLowerCase()) ||
      entry.category.toLowerCase().includes(search.toLowerCase());
    
    return inDateRange && inStores && inSearch;
  });
}

function PrepaymentAccrualCard({ entry, onView }: { entry: PrepaymentAccrualEntry; onView: (entry: PrepaymentAccrualEntry) => void }) {
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

  const postedMonths = entry.monthlyBreakdown.filter(m => m.status === "posted" || m.status === "reconciled").length;
  const totalMonths = entry.monthlyBreakdown.length;
  const progressPercentage = (postedMonths / totalMonths) * 100;

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onView(entry)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              {entry.type === "prepayment" ? (
                <ArrowUpCircle className="h-4 w-4 text-blue-600" />
              ) : (
                <ArrowDownCircle className="h-4 w-4 text-green-600" />
              )}
              <CardTitle className="text-lg">{entry.title}</CardTitle>
            </div>
            {entry.supplier && (
              <CardDescription className="text-sm text-muted-foreground">
                {entry.supplier} • {entry.category}
              </CardDescription>
            )}
          </div>
          <Badge className={getStatusColor(entry.status)} variant="outline">
            {entry.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-xl font-bold">{formatCurrency(entry.totalAmount)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Store</p>
            <div className="flex items-center gap-1">
              <Building2 className="h-3 w-3 text-muted-foreground" />
              <p className="text-sm font-medium">{entry.store}</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{postedMonths}/{totalMonths} months</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${entry.type === "prepayment" ? "bg-blue-600" : "bg-green-600"}`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-sm text-muted-foreground">
            {format(entry.startDate, "MMM yyyy")} - {format(entry.endDate, "MMM yyyy")}
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Eye className="h-3 w-3" />
            View Details
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
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
  if (!entry) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "posted": return <Badge variant="default">Posted</Badge>;
      case "reconciled": return <Badge variant="secondary">Reconciled</Badge>;
      case "scheduled": return <Badge variant="outline">Scheduled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className={`fixed inset-0 z-50 ${open ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <Card className="h-full">
          <CardHeader className="border-b">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {entry.type === "prepayment" ? (
                    <ArrowUpCircle className="h-5 w-5 text-blue-600" />
                  ) : (
                    <ArrowDownCircle className="h-5 w-5 text-green-600" />
                  )}
                  <CardTitle className="text-2xl">{entry.title}</CardTitle>
                </div>
                <CardDescription>
                  {entry.supplier} • {entry.category} • {entry.store}
                </CardDescription>
              </div>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="space-y-6">
              {/* Summary Section */}
              <div className="grid grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold">{formatCurrency(entry.totalAmount)}</p>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Period</p>
                    <p className="font-semibold">
                      {format(entry.startDate, "MMM yyyy")} - {format(entry.endDate, "MMM yyyy")}
                    </p>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Monthly Amount</p>
                    <p className="text-lg font-bold">
                      {formatCurrency(entry.totalAmount / entry.monthlyBreakdown.length)}
                    </p>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className={entry.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {entry.status}
                    </Badge>
                  </div>
                </Card>
              </div>

              {/* Monthly Breakdown Table */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Monthly Breakdown</h3>
                <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Month</TableHead>
                        <TableHead className="text-right font-semibold">Amount</TableHead>
                        <TableHead className="text-center font-semibold">Status</TableHead>
                        <TableHead className="text-center font-semibold">Journal Entry</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
                      {entry.monthlyBreakdown.map((breakdown, index) => (
                        <TableRow key={breakdown.month} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {format(new Date(breakdown.month + "-01"), "MMMM yyyy")}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {formatCurrency(breakdown.amount)}
                          </TableCell>
                          <TableCell className="text-center">
                            {getStatusBadge(breakdown.status)}
                          </TableCell>
                          <TableCell className="text-center">
                            {breakdown.status !== "scheduled" ? (
                              <Button variant="outline" size="sm" className="gap-2">
                                <FileText className="h-3 w-3" />
                                View Journal
                </Button>
                            ) : (
                              <span className="text-muted-foreground text-sm">Not posted</span>
                            )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
  const type = searchParams.get('type'); // 'prepayment' or 'accrual'
  const sourceId = searchParams.get('sourceId');
  const store = searchParams.get('store');
  const amount = searchParams.get('amount');
  
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [storeValue, setStoreValue] = React.useState<string>(store || "all");
  const [search, setSearch] = React.useState<string>("");
  const [selectedEntry, setSelectedEntry] = React.useState<PrepaymentAccrualEntry | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = React.useState<boolean>(false);
  const [highlightedType, setHighlightedType] = React.useState<string | null>(type);

  // Handle viewing entry details
  const handleViewEntry = (entry: PrepaymentAccrualEntry) => {
    setSelectedEntry(entry);
    setDetailDialogOpen(true);
  };

  // Clear highlight after a few seconds
  React.useEffect(() => {
    if (highlightedType) {
      const timer = setTimeout(() => setHighlightedType(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedType]);

  // Show notification if coming from stock control
  React.useEffect(() => {
    if (type && sourceId && store) {
      // Could show a toast notification here
      console.log(`Viewing ${type} entries for ${store} (Source: ${sourceId})`);
    }
  }, [type, sourceId, store]);

  // Filter data
  const filteredPrepayments = filterEntries(
    mockPrepaymentAccrualEntries.filter(e => e.type === "prepayment"), 
    { dateRange, stores: storeValue, search }
  );
  
  const filteredAccruals = filterEntries(
    mockPrepaymentAccrualEntries.filter(e => e.type === "accrual"), 
    { dateRange, stores: storeValue, search }
  );

  // Calculate summary stats
  const prepaymentStats = {
    total: filteredPrepayments.reduce((sum, p) => sum + p.totalAmount, 0),
    active: filteredPrepayments.filter(p => p.status === "active").length,
    count: filteredPrepayments.length
  };

  const accrualStats = {
    total: filteredAccruals.reduce((sum, a) => sum + a.totalAmount, 0),
    active: filteredAccruals.filter(a => a.status === "active").length,
    count: filteredAccruals.length
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency", 
      currency: "GBP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-8">
      {/* Navigation Banner */}
      {type && sourceId && store && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">
                    Viewing {type} entries for {store}
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
        
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search entries..."
              className="pl-8"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <DateAndStoreFilter
            storeValue={storeValue}
            onStoreChange={setStoreValue}
            dateValue={dateRange}
            onDateChange={setDateRange}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-800">Prepayments</p>
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(prepaymentStats.total)}</p>
              </div>
              <ArrowUpCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-green-800">Accruals</p>
                <p className="text-2xl font-bold text-green-900">{formatCurrency(accrualStats.total)}</p>
              </div>
              <ArrowDownCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Active Prepayments</p>
                <p className="text-2xl font-bold">{prepaymentStats.active}</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

      <Card>
        <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Active Accruals</p>
                <p className="text-2xl font-bold">{accrualStats.active}</p>
              </div>
              <Receipt className="h-8 w-8 text-muted-foreground" />
            </div>
        </CardContent>
      </Card>
      </div>

             {/* Main Content - Two Column Layout */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Prepayments Section */}
         <div className={`space-y-4 ${highlightedType === 'prepayment' ? 'ring-2 ring-blue-200 ring-offset-4 rounded-lg p-4 bg-blue-50/30' : ''}`}>
           <div className="flex items-center gap-3">
             <ArrowUpCircle className="h-6 w-6 text-blue-600" />
             <h2 className="text-2xl font-bold">Prepayments</h2>
             <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
               {prepaymentStats.count} entries
             </Badge>
             {highlightedType === 'prepayment' && (
               <Badge variant="default" className="bg-blue-600 text-white animate-pulse">
                 From Stock Control
               </Badge>
             )}
           </div>
          <p className="text-sm text-muted-foreground mb-4">
            Expenses paid in advance that will be recognized over future periods
          </p>
          
          <div className="space-y-4">
            {filteredPrepayments.length > 0 ? (
              filteredPrepayments.map(prepayment => (
                <PrepaymentAccrualCard 
                  key={prepayment.id} 
                  entry={prepayment} 
                  onView={handleViewEntry}
                />
              ))
            ) : (
              <Card className="p-8 text-center border-dashed">
                <ArrowUpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No prepayments found</h3>
                <p className="text-sm text-muted-foreground">
                  No prepayments match your current filters
                </p>
              </Card>
            )}
          </div>
        </div>

                 {/* Accruals Section */}
         <div className={`space-y-4 ${highlightedType === 'accrual' ? 'ring-2 ring-green-200 ring-offset-4 rounded-lg p-4 bg-green-50/30' : ''}`}>
           <div className="flex items-center gap-3">
             <ArrowDownCircle className="h-6 w-6 text-green-600" />
             <h2 className="text-2xl font-bold">Accruals</h2>
             <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
               {accrualStats.count} entries
             </Badge>
             {highlightedType === 'accrual' && (
               <Badge variant="default" className="bg-green-600 text-white animate-pulse">
                 From Stock Control
               </Badge>
             )}
           </div>
          <p className="text-sm text-muted-foreground mb-4">
            Expenses incurred but not yet paid that need to be recognized
          </p>
          
          <div className="space-y-4">
            {filteredAccruals.length > 0 ? (
              filteredAccruals.map(accrual => (
                <PrepaymentAccrualCard 
                  key={accrual.id} 
                  entry={accrual} 
                  onView={handleViewEntry}
                />
              ))
            ) : (
              <Card className="p-8 text-center border-dashed">
                <ArrowDownCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No accruals found</h3>
                <p className="text-sm text-muted-foreground">
                  No accruals match your current filters
                </p>
              </Card>
            )}
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
