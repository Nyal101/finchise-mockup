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
import { ChevronLeft, ChevronRight, Save, ExternalLink, TrendingUp, TrendingDown, Calendar, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
}



export default function StockControlPage() {
  const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date());
  const [stockEntries, setStockEntries] = React.useState<MonthlyStockEntry[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  
  const stores = [
    { id: "STR-001", name: "Kings Hill" },
    { id: "STR-002", name: "Tonbridge Main" },
    { id: "STR-003", name: "Tunbridge Wells" },
    { id: "STR-004", name: "Southborough" },
    { id: "STR-005", name: "Maidstone" },
    { id: "STR-006", name: "Sevenoaks" },
  ];

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
      };
    });

    setStockEntries(newStockEntries);
    setHasUnsavedChanges(false);
  }, [currentMonth, stores]);

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
        };
      }
      return entry;
    }));
    
    setHasUnsavedChanges(true);
  };

  const handleSaveChanges = () => {
    // In a real app, this would save to the backend
    console.log("Saving stock entries:", stockEntries);
    setHasUnsavedChanges(false);
    setStockEntries(prev => prev.map(entry => ({ ...entry, isEdited: false })));
  };

  const handleCreateJournal = (entry: MonthlyStockEntry) => {
    // In a real app, this would create a journal entry
    console.log("Creating journal for:", entry);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const totals = React.useMemo(() => {
    return stockEntries.reduce((acc, entry) => ({
      totalClosingStock: acc.totalClosingStock + entry.closingStock,
      totalVariance: acc.totalVariance + entry.stockVariance,
      totalStores: stockEntries.length,
      accrualCount: stockEntries.filter(e => e.journalType === "accrual").length,
      prepaymentCount: stockEntries.filter(e => e.journalType === "prepayment").length,
    }), {
      totalClosingStock: 0,
      totalVariance: 0,
      totalStores: 0,
      accrualCount: 0,
      prepaymentCount: 0,
    });
  }, [stockEntries]);

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

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Stock Control</h1>
        </div>
        
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <Button onClick={handleSaveChanges} className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Card className="px-4 py-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Total Stock Value</span>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-lg font-bold">{formatCurrency(totals.totalClosingStock)}</div>
        </Card>
        
        <Card className="px-4 py-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Total Variance</span>
            {totals.totalVariance >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </div>
          <div className={`text-lg font-bold ${getVarianceColor(totals.totalVariance)}`}>
            {formatCurrency(totals.totalVariance)}
          </div>
        </Card>

        <Card className="px-4 py-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Accruals Required</span>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-lg font-bold text-green-600">{totals.accrualCount}</div>
        </Card>

        <Card className="px-4 py-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Prepayments Required</span>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </div>
          <div className="text-lg font-bold text-red-600">{totals.prepaymentCount}</div>
        </Card>
      </div>

      {/* Stock Values Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Building2 className="h-7 w-7" />
              Monthly Stock Values
            </CardTitle>
            
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
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold px-6 py-4">Store</TableHead>
                  <TableHead className="text-right font-semibold px-6 py-4">Opening Stock</TableHead>
                  <TableHead className="text-right font-semibold px-6 py-4">Closing Stock</TableHead>
                  <TableHead className="text-right font-semibold pxç6 py-4">Variance</TableHead>
                  <TableHead className="text-center font-semibold px-6 py-4">Journal Type</TableHead>
                  <TableHead className="text-center font-semibold px-6 py-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stockEntries.map((entry, index) => (
                  <TableRow 
                    key={entry.storeId}
                    className={`${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'} hover:bg-muted/40 transition-colors ${entry.isEdited ? 'border-l-4 border-l-blue-500' : ''}`}
                  >
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
                      <div className="flex justify-end">
                        <Input
                          type="number"
                          value={entry.closingStock}
                          onChange={(e) => handleStockValueChange(entry.storeId, e.target.value)}
                          className={`w-32 text-right font-mono ${entry.isEdited ? 'border-blue-500 ring-1 ring-blue-500' : ''}`}
                          step="100"
                        />
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
                            onClick={() => window.location.href = `/accounting/Journals?invoiceId=${entry.storeId}`}
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
        </CardContent>
      </Card>

      {/* Footer */}
      {hasUnsavedChanges && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-800">
                <Save className="h-4 w-4" />
                <span className="font-medium">You have unsaved changes</span>
              </div>
              <Button onClick={handleSaveChanges} variant="outline" className="gap-2">
                <Save className="h-4 w-4" />
                Save All Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
