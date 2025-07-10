"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Save, ExternalLink, TrendingUp, TrendingDown, Calendar, Check, Clock, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSunday, isSameDay, parseISO } from "date-fns";

interface StockEntry {
  storeId: string;
  storeName: string;
  date: string; // ISO date string
  stockValue: number;
  isEdited: boolean;
  isSaved: boolean;
  entryType: 'sunday' | 'month-end' | 'sunday-month-end';
}

interface StoreStockSummary {
  storeId: string;
  storeName: string;
  entries: StockEntry[];
  monthlyVariance: number;
  journalType: "accrual" | "prepayment" | null;
  journalId?: string;
  hasUnsavedChanges: boolean;
  isExpanded: boolean;
  isSubmitted: boolean;
}

const stores = [
  { id: "STR-001", name: "Kings Hill" },
  { id: "STR-002", name: "Tonbridge Main" },
  { id: "STR-003", name: "Tunbridge Wells" },
  { id: "STR-004", name: "Southborough" },
  { id: "STR-005", name: "Maidstone" },
  { id: "STR-006", name: "Sevenoaks" },
];

export default function StockControlPage() {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date());
  const [storesSummary, setStoresSummary] = React.useState<StoreStockSummary[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [savingStoreId, setSavingStoreId] = React.useState<string | null>(null);
  const [showUnsubmitModal, setShowUnsubmitModal] = React.useState(false);
  const [unsubmitStoreId, setUnsubmitStoreId] = React.useState<string | null>(null);

  // Get all relevant dates for the current month (Sundays + last day)
  const getMonthlyStockDates = React.useCallback((date: Date) => {
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    
    const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const sundays = allDays.filter(day => isSunday(day));
    const lastDay = monthEnd;
    
    const isLastDaySunday = isSunday(lastDay);
    
    const stockDates = [...sundays];
    if (!isLastDaySunday) {
      stockDates.push(lastDay);
    }
    
    return stockDates.sort((a, b) => a.getTime() - b.getTime());
  }, []);

  // Generate mock data for current month
  React.useEffect(() => {
    const stockDates = getMonthlyStockDates(currentMonth);
    
    // Generate mock stock entries
    const newStockEntries: StockEntry[] = [];
    
    stores.forEach(store => {
      const baseStock = {
        "STR-001": 15000,
        "STR-002": 24800,
        "STR-003": 17600,
        "STR-004": 11800,
        "STR-005": 19800,
        "STR-006": 15800,
      }[store.id] || 15000;
      
      stockDates.forEach((date, index) => {
        const fluctuation = (Math.random() - 0.5) * 0.1;
        const stockValue = Math.round(baseStock * (1 + fluctuation + (index * 0.02)));
        
        const isLastDay = isSameDay(date, endOfMonth(currentMonth));
        const isSundayEntry = isSunday(date);
        
        let entryType: 'sunday' | 'month-end' | 'sunday-month-end';
        if (isLastDay && isSundayEntry) {
          entryType = 'sunday-month-end';
        } else if (isLastDay) {
          entryType = 'month-end';
        } else {
          entryType = 'sunday';
        }
        
        // Blank out values from today onwards
        const today = new Date();
        const isFutureDate = date >= today;
        
        newStockEntries.push({
          storeId: store.id,
          storeName: store.name,
          date: format(date, 'yyyy-MM-dd'),
          stockValue: isFutureDate ? 0 : stockValue,
          isEdited: false,
          isSaved: isFutureDate ? false : Math.random() > 0.3,
          entryType
        });
      });
    });
    
    // Generate store summaries
    const summaries: StoreStockSummary[] = stores.map(store => {
      const storeEntries = newStockEntries.filter(entry => entry.storeId === store.id);
      const sortedEntries = storeEntries.sort((a, b) => a.date.localeCompare(b.date));
      
      const firstEntry = sortedEntries[0];
      const lastEntry = sortedEntries[sortedEntries.length - 1];
      const monthlyVariance = lastEntry ? lastEntry.stockValue - firstEntry.stockValue : 0;
      
      return {
        storeId: store.id,
        storeName: store.name,
        entries: sortedEntries,
        monthlyVariance,
        journalType: monthlyVariance > 0 ? "accrual" : monthlyVariance < 0 ? "prepayment" : null,
        journalId: Math.random() > 0.3 ? `JNL-${Math.floor(Math.random() * 1000)}` : undefined,
        hasUnsavedChanges: storeEntries.some(entry => entry.isEdited || !entry.isSaved),
        isExpanded: false,
        isSubmitted: false
      };
    });
    
    setStoresSummary(summaries);
    setHasUnsavedChanges(summaries.some(s => s.hasUnsavedChanges));
  }, [currentMonth, getMonthlyStockDates]);

  const handleStockValueChange = (storeId: string, date: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    
    setStoresSummary(prev => prev.map(summary => {
      if (summary.storeId === storeId) {
        const updatedEntries = summary.entries.map(entry => 
          entry.date === date ? { ...entry, stockValue: numValue, isEdited: true, isSaved: false } : entry
        );
        
        const sortedEntries = updatedEntries.sort((a, b) => a.date.localeCompare(b.date));
        const firstEntry = sortedEntries[0];
        const lastEntry = sortedEntries[sortedEntries.length - 1];
        const monthlyVariance = lastEntry ? lastEntry.stockValue - firstEntry.stockValue : 0;
        
        return {
          ...summary,
          entries: updatedEntries,
          monthlyVariance,
          journalType: monthlyVariance > 0 ? "accrual" : monthlyVariance < 0 ? "prepayment" : null,
          hasUnsavedChanges: true
        };
      }
      return summary;
    }));
    
    setHasUnsavedChanges(true);
  };

  const handleSaveStoreEntries = async (storeId: string) => {
    setSavingStoreId(storeId);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setStoresSummary(prev => prev.map(summary => {
      if (summary.storeId === storeId) {
        const updatedEntries = summary.entries.map(entry => ({
          ...entry,
          isEdited: false,
          // Only mark as saved if the entry has a value (not 0 or empty)
          isSaved: entry.stockValue > 0 ? true : entry.isSaved
        }));
        
        // Check if all required fields are entered (not just saved)
        const weeklyEntries = updatedEntries.filter(entry => entry.entryType === 'sunday');
        const monthEndEntry = updatedEntries.find(entry => 
          entry.entryType === 'month-end' || entry.entryType === 'sunday-month-end'
        );
        
        const allWeeklyEntriesHaveValues = weeklyEntries.every(entry => entry.stockValue > 0);
        const monthEndHasValue = monthEndEntry && monthEndEntry.stockValue > 0;
        const allEntriesComplete = allWeeklyEntriesHaveValues && monthEndHasValue;
        
        return {
          ...summary,
          entries: updatedEntries,
          hasUnsavedChanges: !allEntriesComplete || updatedEntries.some(entry => entry.isEdited)
        };
      }
      return summary;
    }));
    
    setSavingStoreId(null);
    
    const hasAnyUnsaved = storesSummary.some(summary => 
      summary.storeId !== storeId && summary.hasUnsavedChanges
    );
    if (!hasAnyUnsaved) {
      setHasUnsavedChanges(false);
    }
  };

  const handleSaveAllChanges = async () => {
    const unsavedStores = storesSummary.filter(summary => summary.hasUnsavedChanges);
    
    for (const summary of unsavedStores) {
      await handleSaveStoreEntries(summary.storeId);
    }
    
    // Check if there are still any incomplete stores (not all fields entered)
    const hasAnyIncompleteStores = storesSummary.some(summary => {
      const weeklyEntries = summary.entries.filter(entry => entry.entryType === 'sunday');
      const monthEndEntry = summary.entries.find(entry => 
        entry.entryType === 'month-end' || entry.entryType === 'sunday-month-end'
      );
      
      const allWeeklyEntriesHaveValues = weeklyEntries.every(entry => entry.stockValue > 0);
      const monthEndHasValue = monthEndEntry && monthEndEntry.stockValue > 0;
      const allEntriesComplete = allWeeklyEntriesHaveValues && monthEndHasValue;
      
      return !allEntriesComplete;
    });
    
    setHasUnsavedChanges(hasAnyIncompleteStores);
  };



  const handleSubmitStore = (storeId: string) => {
    // Generate journal ID without redirecting
    const journalId = `STK-${storeId}-${format(currentMonth, 'yyyy-MM')}`;
    
    setStoresSummary(prev => prev.map(summary => 
      summary.storeId === storeId ? { ...summary, isSubmitted: true, journalId } : summary
    ));
  };

  const handleUnsubmit = (storeId: string) => {
    setUnsubmitStoreId(storeId);
    setShowUnsubmitModal(true);
  };

  const confirmUnsubmit = () => {
    if (unsubmitStoreId) {
      setStoresSummary(prev => prev.map(summary => 
        summary.storeId === unsubmitStoreId ? { ...summary, isSubmitted: false, journalId: undefined } : summary
      ));
    }
    setShowUnsubmitModal(false);
    setUnsubmitStoreId(null);
  };

  const cancelUnsubmit = () => {
    setShowUnsubmitModal(false);
    setUnsubmitStoreId(null);
  };

  const toggleStoreExpansion = (storeId: string) => {
    setStoresSummary(prev => prev.map(summary => 
      summary.storeId === storeId ? { ...summary, isExpanded: !summary.isExpanded } : summary
    ));
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return "text-green-600";
    if (variance < 0) return "text-red-600";
    return "text-gray-600";
  };



  const savedCount = storesSummary.filter(s => !s.hasUnsavedChanges).length;
  const editedCount = storesSummary.filter(s => s.hasUnsavedChanges).length;
  const totalCount = storesSummary.length;

  const stockDates = getMonthlyStockDates(currentMonth);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Stock Control</h1>
          <p className="text-muted-foreground">
            Weekly stock values (Sundays) + month-end for accurate journal generation
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Progress */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Progress:</span>
            <span className="text-green-600">{savedCount}/{totalCount} saved</span>
            <div className="w-20 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(savedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
          
          {/* Month Navigation */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-md">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">{format(currentMonth, "MMM yyyy")}</span>
            </div>
            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Save All */}
          {hasUnsavedChanges && (
            <Button onClick={handleSaveAllChanges} className="gap-2">
              <Save className="h-4 w-4" />
              Save All ({editedCount})
            </Button>
          )}
        </div>
      </div>

      {/* Single Comprehensive Table */}
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-8"></TableHead>
              <TableHead className="font-semibold">Store</TableHead>
              <TableHead className="text-center font-semibold">Status</TableHead>
              <TableHead className="text-right font-semibold">Start Value</TableHead>
              <TableHead className="text-center font-semibold">Month End Date</TableHead>
              <TableHead className="text-right font-semibold">Month End Value</TableHead>
              <TableHead className="text-right font-semibold">Variance</TableHead>
              <TableHead className="text-center font-semibold">Submit</TableHead>
              <TableHead className="text-center font-semibold">View Journal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {storesSummary.map((summary, index) => {
              const startValue = summary.entries[0]?.stockValue || 0;
              const endValue = summary.entries[summary.entries.length - 1]?.stockValue || 0;
              const monthEndEntry = summary.entries.find(entry => 
                entry.entryType === 'month-end' || entry.entryType === 'sunday-month-end'
              );
              
              return (
                <React.Fragment key={summary.storeId}>
                  {/* Store Summary Row */}
                  <TableRow 
                    className={`transition-all duration-200 cursor-pointer ${
                      index % 2 === 0 ? 'bg-background' : 'bg-muted/20'
                    } hover:bg-muted/40 ${
                      savingStoreId === summary.storeId ? 'ring-2 ring-blue-200 bg-blue-50/50' :
                      !summary.hasUnsavedChanges ? 'border-l-4 border-l-green-500' :
                      summary.hasUnsavedChanges ? 'border-l-4 border-l-amber-500' : ''
                    }`}
                    onClick={() => toggleStoreExpansion(summary.storeId)}
                  >
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        {summary.isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span>{summary.storeName}</span>
                        <Badge variant="outline" className="text-xs">
                          {summary.entries.length} entries
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center px-4 py-3">
                      {savingStoreId === summary.storeId ? (
                        <Clock className="h-4 w-4 text-blue-500 animate-spin mx-auto" />
                      ) : !summary.hasUnsavedChanges ? (
                        <Check className="h-4 w-4 text-green-500 mx-auto" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-amber-500 mx-auto" />
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono px-4 py-3">
                      {formatCurrency(startValue)}
                    </TableCell>
                    <TableCell className="text-center px-2 py-3">
                      {monthEndEntry ? (
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-sm font-medium">
                            {format(parseISO(monthEndEntry.date), 'EEE')}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {format(parseISO(monthEndEntry.date), 'MMM dd')}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right px-2 py-3">
                      <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                        {monthEndEntry ? (
                                                      <Input
                              type="number"
                              value={monthEndEntry.stockValue}
                              onChange={(e) => handleStockValueChange(summary.storeId, monthEndEntry.date, e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              disabled={summary.isSubmitted}
                              className={`w-32 text-right font-mono h-8 ${
                                summary.isSubmitted ? 'bg-gray-100 text-gray-500 cursor-not-allowed' :
                                monthEndEntry.isEdited ? 'border-amber-500 ring-1 ring-amber-500' : 
                                monthEndEntry.isSaved ? 'border-green-500 ring-1 ring-green-500' : ''
                              }`}
                              step="100"
                            />
                        ) : (
                          <span className="font-mono">{formatCurrency(endValue)}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className={`text-right font-semibold px-4 py-3 ${getVarianceColor(summary.monthlyVariance)}`}>
                      <div className="flex items-center justify-end gap-1">
                        {summary.monthlyVariance > 0 && <TrendingUp className="h-3 w-3" />}
                        {summary.monthlyVariance < 0 && <TrendingDown className="h-3 w-3" />}
                        {formatCurrency(Math.abs(summary.monthlyVariance))}
                      </div>
                    </TableCell>


                    <TableCell className="text-center px-4 py-3">
                      <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        {(() => {
                          // Check if ALL entries have values entered (not just saved)
                          const weeklyEntries = summary.entries.filter(entry => entry.entryType === 'sunday');
                          const monthEndEntry = summary.entries.find(entry => 
                            entry.entryType === 'month-end' || entry.entryType === 'sunday-month-end'
                          );
                          
                          const allWeeklyEntriesHaveValues = weeklyEntries.every(entry => entry.stockValue > 0);
                          const monthEndHasValue = monthEndEntry && monthEndEntry.stockValue > 0;
                          const allEntriesComplete = allWeeklyEntriesHaveValues && monthEndHasValue;
                          
                          return (
                            <Button
                              variant={summary.isSubmitted ? "outline" : "default"}
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (summary.isSubmitted) {
                                  handleUnsubmit(summary.storeId);
                                } else {
                                  handleSubmitStore(summary.storeId);
                                }
                              }}
                              disabled={!summary.isSubmitted && (!allEntriesComplete || savingStoreId === summary.storeId)}
                              className="gap-1 h-7 px-2 text-xs"
                              title={
                                summary.isSubmitted 
                                  ? "Unsubmit this store's data"
                                  : !allEntriesComplete 
                                  ? "All weekly values and month-end value must be entered"
                                  : "Submit and create journal for this store"
                              }
                            >
                              {summary.isSubmitted ? (
                                <>
                                  <AlertCircle className="h-3 w-3" />
                                  Unsubmit
                                </>
                              ) : (
                                <>
                                  <Check className="h-3 w-3" />
                                  Submit & Create Journal
                                </>
                              )}
                            </Button>
                          );
                        })()}
                      </div>
                    </TableCell>
                    <TableCell className="text-center px-4 py-3">
                      <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        {summary.isSubmitted && summary.journalId ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1 h-7 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              const searchParams = new URLSearchParams({
                                type: summary.journalType || '',
                                sourceId: summary.storeId,
                                store: summary.storeName
                              });
                              window.location.href = `/accounting/Journals?${searchParams.toString()}`;
                            }}
                          >
                            <ExternalLink className="h-3 w-3" />
                            View Journal
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Click submit to generate journal
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                  
                                     {/* Expanded Weekly Stock Entry Row - Professional Layout */}
                   {summary.isExpanded && (
                     <TableRow className="bg-gradient-to-r from-blue-50/50 to-slate-50/50 border-l-4 border-l-blue-300">
                       <TableCell className="px-4 py-4"></TableCell>
                       <TableCell className="px-4 py-4" colSpan={7}>
                         <div className="space-y-4">
                                                        <div className="flex items-center justify-between">
                               <div className="flex items-center gap-2">
                                 <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                                 <h4 className="text-sm font-semibold text-slate-700">
                                   Weekly Stock Values - {summary.storeName}
                                 </h4>
                                 <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                   Sundays Only
                                 </Badge>
                                 {summary.isSubmitted && (
                                   <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 border-gray-300">
                                     🔒 Locked
                                   </Badge>
                                 )}
                               </div>
                             <div className="flex items-center gap-3">
                               <div className="text-xs text-muted-foreground">
                                 Values from today onwards are blank for entry
                               </div>
                               <div className="flex items-center gap-2">
                                 <Button
                                   variant="outline"
                                   size="sm"
                                   onClick={(e) => {
                                     e.stopPropagation();
                                     handleSaveStoreEntries(summary.storeId);
                                   }}
                                   disabled={savingStoreId === summary.storeId || !summary.hasUnsavedChanges || summary.isSubmitted}
                                   className="gap-1 h-7 px-3 text-xs"
                                 >
                                   {savingStoreId === summary.storeId ? (
                                     <Clock className="h-3 w-3 animate-spin" />
                                   ) : (
                                     <Save className="h-3 w-3" />
                                   )}
                                   Save Weekly
                                 </Button>

                               </div>
                             </div>
                           </div>
                           
                           <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                               {summary.entries
                                 .filter(entry => entry.entryType === 'sunday' || entry.entryType === 'sunday-month-end')
                                 .map((entry, entryIndex) => {
                                   const entryDate = parseISO(entry.date);
                                   const today = new Date();
                                   const isPastDate = entryDate < today;
                                   const isToday = entryDate.toDateString() === today.toDateString();
                                   const isSundayMonthEnd = entry.entryType === 'sunday-month-end';
                                   
                                   return (
                                     <div 
                                       key={`${summary.storeId}-${entry.date}`} 
                                       className={`relative p-3 rounded-lg border transition-all duration-200 hover:shadow-md ${
                                         isSundayMonthEnd ? 'bg-red-50 border-red-200 ring-1 ring-red-200' :
                                         isPastDate ? 'bg-slate-50 border-slate-200' :
                                         isToday ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-200' :
                                         'bg-amber-50 border-amber-200'
                                       }`}
                                     >
                                       <div className="space-y-3">
                                         <div className="flex items-center justify-between">
                                           <div className="space-y-1">
                                             <div className="text-sm font-medium text-slate-700">
                                               {format(entryDate, 'MMM dd')}
                                             </div>
                                             <div className="text-xs text-muted-foreground">
                                               {format(entryDate, 'yyyy')}
                                             </div>
                                           </div>
                                           <div className="flex flex-col items-end gap-1">
                                             <Badge 
                                               variant={isSundayMonthEnd ? "destructive" : "secondary"}
                                               className={`text-xs ${
                                                 isSundayMonthEnd ? 'bg-red-100 text-red-700' :
                                                 isPastDate ? 'bg-slate-100 text-slate-600' :
                                                 isToday ? 'bg-blue-100 text-blue-700' :
                                                 'bg-amber-100 text-amber-700'
                                               }`}
                                             >
                                               {isSundayMonthEnd ? 'Sun/End' : 'Sunday'}
                                             </Badge>
                                             {isToday && (
                                               <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                                                 Today
                                               </Badge>
                                             )}
                                           </div>
                                         </div>
                                         
                                         <div className="space-y-2">
                                           <div className="text-xs text-muted-foreground mb-2">
                                             Please enter stock value as of {format(entryDate, 'EEEE, MMMM dd')} at store close
                                           </div>
                                           <Input
                                             type="number"
                                             value={entry.stockValue || ''}
                                             onChange={(e) => handleStockValueChange(entry.storeId, entry.date, e.target.value)}
                                             placeholder={isPastDate ? "Enter value" : "Future entry"}
                                             disabled={summary.isSubmitted}
                                             className={`w-full text-right font-mono h-9 transition-all duration-200 ${
                                               summary.isSubmitted ? 'bg-gray-100 text-gray-500 cursor-not-allowed' :
                                               entry.isEdited ? 'border-amber-500 ring-2 ring-amber-200 bg-amber-50' : 
                                               entry.isSaved ? 'border-green-500 ring-2 ring-green-200 bg-green-50' : 
                                               isPastDate ? 'border-slate-300 hover:border-slate-400' :
                                               'border-blue-300 hover:border-blue-400 bg-blue-50/50'
                                             }`}
                                             step="100"
                                           />
                                           
                                           <div className="flex items-center justify-between">
                                             <div className="flex items-center gap-1">
                                               {entry.isEdited ? (
                                                 <>
                                                   <AlertCircle className="h-3 w-3 text-amber-500" />
                                                   <span className="text-xs text-amber-600">Unsaved</span>
                                                 </>
                                               ) : entry.isSaved ? (
                                                 <>
                                                   <Check className="h-3 w-3 text-green-500" />
                                                   <span className="text-xs text-green-600">Saved</span>
                                                 </>
                                               ) : (
                                                 <>
                                                   <Clock className="h-3 w-3 text-slate-400" />
                                                   <span className="text-xs text-slate-500">Pending</span>
                                                 </>
                                               )}
                                             </div>
                                             
                                             {entryIndex > 0 && entry.stockValue > 0 && (
                                               <div className="text-xs text-muted-foreground">
                                                 {(() => {
                                                   const prevEntry = summary.entries.filter(e => e.entryType === 'sunday')[entryIndex - 1];
                                                   const change = entry.stockValue - prevEntry.stockValue;
                                                   return change !== 0 ? (
                                                     <span className={change > 0 ? 'text-green-600' : 'text-red-600'}>
                                                       {change > 0 ? '+' : ''}{formatCurrency(change)}
                                                     </span>
                                                   ) : null;
                                                 })()}
                                               </div>
                                             )}
                                           </div>
                                         </div>
                                       </div>
                                     </div>
                                   );
                                 })}
                             </div>
                           </div>
                         </div>
                       </TableCell>
                     </TableRow>
                   )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Footer with darker background */}
      <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Check className="h-3 w-3 text-green-500" />
            <span>Saved</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3 text-amber-500" />
            <span>Unsaved</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-blue-500" />
            <span>Saving</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-xs">Sun</Badge>
          <Badge variant="default" className="text-xs">End</Badge>
          <Badge variant="destructive" className="text-xs">Sun/End</Badge>
        </div>
        <span>Click ↕ to expand/collapse weekly entries • {stockDates.length} entry dates this month</span>
      </div>

      {/* Unsubmit Confirmation Modal */}
      {showUnsubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-6 w-6 text-amber-500" />
              <h3 className="text-lg font-semibold">Unsubmit Store Data</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to unsubmit this store&apos;s data? This will remove the generated journal entry and allow you to make changes again.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={cancelUnsubmit}
                className="gap-2"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmUnsubmit}
                className="gap-2"
              >
                <AlertCircle className="h-4 w-4" />
                Yes, Unsubmit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
