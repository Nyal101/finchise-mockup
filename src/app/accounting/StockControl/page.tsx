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
import { ChevronLeft, ChevronRight, Save, ExternalLink, TrendingUp, TrendingDown, Calendar, Building2, Check, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, addMonths, subMonths } from "date-fns";

interface MonthlyStockEntry {
  storeId: string;
  storeName: string;
  monthYear: string; // Format: "2024-03"
  openingStock: number;
  closingStock: number;
  stockVariance: number;
  journalType: "accrual" | "prepayment" | null;
  journalId?: string;
  isEdited: boolean;
  isSaved: boolean;
}

// Move stores outside component to prevent recreation on every render
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
  const [stockEntries, setStockEntries] = React.useState<MonthlyStockEntry[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [savingStoreId, setSavingStoreId] = React.useState<string | null>(null);
  
  // Generate mock data for current month
  React.useEffect(() => {
    const monthKey = format(currentMonth, "yyyy-MM");
    
    // Mock previous month's closing stock (which becomes current month's opening)
    const previousMonthData: Record<string, number> = {
      "STR-001": 15000,
      "STR-002": 24800,
      "STR-003": 17600,
      "STR-004": 11800,
      "STR-005": 19800,
      "STR-006": 15800,
    };

    const newStockEntries: MonthlyStockEntry[] = stores.map((store) => {
      const openingStock = previousMonthData[store.id] || 0;
      // Default closing stock with some variance
      const closingStock = Math.round(openingStock * (0.95 + Math.random() * 0.1));
      const variance = closingStock - openingStock;
      
      return {
        storeId: store.id,
        storeName: store.name,
        monthYear: monthKey,
        openingStock,
        closingStock,
        stockVariance: variance,
        journalType: variance > 0 ? "accrual" : variance < 0 ? "prepayment" : null,
        journalId: Math.random() > 0.3 ? `JNL-${Math.floor(Math.random() * 1000)}` : undefined,
        isEdited: false,
        isSaved: Math.random() > 0.5, // Simulate some entries being saved
      };
    });

    setStockEntries(newStockEntries);
    setHasUnsavedChanges(false);
  }, [currentMonth]); // Remove 'stores' from dependency array since it's now stable

  const handleStockValueChange = (storeId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    
    setStockEntries(prev => prev.map(entry => {
      if (entry.storeId === storeId) {
        const variance = numValue - entry.openingStock;
        return {
          ...entry,
          closingStock: numValue,
          stockVariance: variance,
          journalType: variance > 0 ? "accrual" : variance < 0 ? "prepayment" : null,
          isEdited: true,
          isSaved: false,
        };
      }
      return entry;
    }));
    
    setHasUnsavedChanges(true);
  };

  const handleSaveIndividualEntry = async (storeId: string) => {
    setSavingStoreId(storeId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setStockEntries(prev => prev.map(entry => {
      if (entry.storeId === storeId) {
        return { ...entry, isEdited: false, isSaved: true };
      }
      return entry;
    }));
    
    setSavingStoreId(null);
    
    // Check if all entries are saved
    const hasAnyUnsaved = stockEntries.some(entry => 
      entry.storeId !== storeId && (entry.isEdited || !entry.isSaved)
    );
    if (!hasAnyUnsaved) {
      setHasUnsavedChanges(false);
    }
  };

  const handleSaveAllChanges = async () => {
    const unsavedEntries = stockEntries.filter(entry => entry.isEdited || !entry.isSaved);
    
    for (const entry of unsavedEntries) {
      await handleSaveIndividualEntry(entry.storeId);
    }
    
    setHasUnsavedChanges(false);
  };

  const handleCreateJournal = (entry: MonthlyStockEntry) => {
    // In a real app, this would create a journal entry
    console.log("Creating journal for:", entry);
    
    // Simulate creating a prepayment or accrual entry based on the variance
    const journalType = entry.journalType;
    const journalId = `STK-${entry.storeId}-${entry.monthYear}`;
    
    // Update the entry with the new journal ID
    setStockEntries(prev => prev.map(e => 
      e.storeId === entry.storeId ? { ...e, journalId } : e
    ));
    
    // Navigate to journals page with the specific type
    const searchParams = new URLSearchParams({
      type: journalType || '',
      sourceId: entry.storeId,
      amount: Math.abs(entry.stockVariance).toString(),
      store: entry.storeName
    });
    
    window.location.href = `/accounting/Journals?${searchParams.toString()}`;
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

  const getJournalTypeVariant = (type: "accrual" | "prepayment" | null) => {
    switch (type) {
      case "accrual": return "default";
      case "prepayment": return "secondary";
      default: return "outline";
    }
  };

  const getRowStatusIndicator = (entry: MonthlyStockEntry) => {
    if (savingStoreId === entry.storeId) {
      return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
    }
    if (entry.isSaved && !entry.isEdited) {
      return <Check className="h-4 w-4 text-green-500" />;
    }
    if (entry.isEdited) {
      return <AlertCircle className="h-4 w-4 text-amber-500" />;
    }
    return <div className="h-4 w-4" />; // Placeholder for alignment
  };

  const getRowClassName = (entry: MonthlyStockEntry, index: number) => {
    let baseClass = `transition-all duration-200 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'} hover:bg-muted/40`;
    
    if (savingStoreId === entry.storeId) {
      baseClass += ' ring-2 ring-blue-200 bg-blue-50/50';
    } else if (entry.isSaved && !entry.isEdited) {
      baseClass += ' border-l-4 border-l-green-500 bg-green-50/30';
    } else if (entry.isEdited) {
      baseClass += ' border-l-4 border-l-amber-500 bg-amber-50/30';
    }
    
    return baseClass;
  };

  const savedCount = stockEntries.filter(e => e.isSaved && !e.isEdited).length;
  const editedCount = stockEntries.filter(e => e.isEdited).length;
  const totalCount = stockEntries.length;

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Stock Control</h1>
          <p className="text-muted-foreground">
            Manage monthly stock values and generate journal entries for variances
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Progress Indicator - moved to header */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Saved: {savedCount}/{totalCount}</span>
            </div>
            {editedCount > 0 && (
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium">Pending: {editedCount}</span>
              </div>
            )}
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(savedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
          
          {hasUnsavedChanges && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                {editedCount} unsaved changes
              </Badge>
              <Button onClick={handleSaveAllChanges} className="gap-2">
                <Save className="h-4 w-4" />
                Save All Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Table Header with Month Navigation */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Building2 className="h-6 w-6" />
          <h2 className="text-xl font-semibold">Monthly Stock Values</h2>
        </div>
        
        {/* Month Navigation */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousMonth}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold">
              {format(currentMonth, "MMMM yyyy")}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextMonth}
            className="gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stock Values Table - no card wrapper */}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold px-6 py-4 w-12">Status</TableHead>
                  <TableHead className="font-semibold px-6 py-4">Store</TableHead>
                  <TableHead className="text-right font-semibold px-6 py-4">Opening Stock</TableHead>
                  <TableHead className="text-right font-semibold px-6 py-4">Closing Stock</TableHead>
                  <TableHead className="text-right font-semibold px-6 py-4">Variance</TableHead>
                  <TableHead className="text-center font-semibold px-6 py-4">Journal Type</TableHead>
                  <TableHead className="text-center font-semibold px-6 py-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockEntries.map((entry, index) => (
                  <TableRow 
                    key={entry.storeId}
                    className={getRowClassName(entry, index)}
                  >
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        {getRowStatusIndicator(entry)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        {entry.storeName}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono px-6 py-4">
                      {formatCurrency(entry.openingStock)}
                    </TableCell>
                    <TableCell className="text-right px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Input
                          type="number"
                          value={entry.closingStock}
                          onChange={(e) => handleStockValueChange(entry.storeId, e.target.value)}
                          className={`w-32 text-right font-mono ${
                            entry.isEdited ? 'border-amber-500 ring-1 ring-amber-500' : 
                            entry.isSaved ? 'border-green-500 ring-1 ring-green-500' : ''
                          }`}
                          step="100"
                        />
                        {entry.isEdited && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSaveIndividualEntry(entry.storeId)}
                            disabled={savingStoreId === entry.storeId}
                            className="gap-1 text-xs"
                          >
                            {savingStoreId === entry.storeId ? (
                              <Clock className="h-3 w-3 animate-spin" />
                            ) : (
                              <Save className="h-3 w-3" />
                            )}
                            Save
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className={`text-right font-semibold px-6 py-4 ${getVarianceColor(entry.stockVariance)}`}>
                      <div className="flex items-center justify-end gap-1">
                        {entry.stockVariance > 0 && <TrendingUp className="h-3 w-3" />}
                        {entry.stockVariance < 0 && <TrendingDown className="h-3 w-3" />}
                        {formatCurrency(Math.abs(entry.stockVariance))}
                      </div>
                    </TableCell>
                    <TableCell className="text-center px-6 py-4">
                      {entry.journalType && (
                        <Badge variant={getJournalTypeVariant(entry.journalType)} className="capitalize">
                          {entry.journalType}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {entry.journalId ? (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => {
                              const searchParams = new URLSearchParams({
                                type: entry.journalType || '',
                                sourceId: entry.storeId,
                                store: entry.storeName
                              });
                              window.location.href = `/accounting/Journals?${searchParams.toString()}`;
                            }}
                          >
                            <ExternalLink className="h-3 w-3" />
                            View Journal
                          </Button>
                        ) : entry.stockVariance !== 0 ? (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleCreateJournal(entry)}
                            className="gap-2"
                            disabled={!entry.isSaved}
                          >
                            Create Journal
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">No change</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

      {/* Status Legend - smaller and below table */}
      <div className="mt-4 p-3 bg-muted/20 rounded-lg border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Check className="h-3 w-3 text-green-500" />
              <span className="text-xs font-medium">Saved</span>
            </div>
            <div className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3 text-amber-500" />
              <span className="text-xs font-medium">Pending Save</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-blue-500" />
              <span className="text-xs font-medium">Saving...</span>
            </div>
          </div>
                     <div className="text-xs text-muted-foreground">
             Save individual entries or use &quot;Save All Changes&quot; to save multiple entries at once
           </div>
        </div>
      </div>
    </div>
  );
}
