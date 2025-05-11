"use client";

import * as React from "react";
import { DateAndStoreFilter } from "@/components/date-range-picker";
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
import { Link, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange } from "react-day-picker";

interface StockValue {
  weekStart: Date;
  storeId: string;
  storeName: string;
  openingStock: number;
  closingStock: number;
  journalId?: string;
}

export default function StockControlPage() {
  const [selectedStore, setSelectedStore] = React.useState<string>("all");
  const [dateRange, setDateRange] = React.useState<DateRange>({
    from: new Date(),
    to: new Date(),
  });
  const [stockValues, setStockValues] = React.useState<StockValue[]>([]);

  // Mock data - replace with API call
  React.useEffect(() => {
    // This would be replaced with an API call
    const mockData: StockValue[] = [
      // Kings Hill
      {
        weekStart: new Date(2024, 2, 1),
        storeId: "STR-001",
        storeName: "Kings Hill",
        openingStock: 15000,
        closingStock: 14500,
        journalId: "JNL-001",
      },
      {
        weekStart: new Date(2024, 2, 8),
        storeId: "STR-001",
        storeName: "Kings Hill",
        openingStock: 14500,
        closingStock: 14200,
        journalId: "JNL-002",
      },
      {
        weekStart: new Date(2024, 2, 15),
        storeId: "STR-001",
        storeName: "Kings Hill",
        openingStock: 14200,
        closingStock: 14000,
        journalId: "JNL-003",
      },
      {
        weekStart: new Date(2024, 2, 22),
        storeId: "STR-001",
        storeName: "Kings Hill",
        openingStock: 14000,
        closingStock: 13800,
        journalId: "JNL-004",
      },
      // Tonbridge Main
      {
        weekStart: new Date(2024, 2, 1),
        storeId: "STR-002",
        storeName: "Tonbridge Main",
        openingStock: 25000,
        closingStock: 24800,
        journalId: "JNL-005",
      },
      {
        weekStart: new Date(2024, 2, 8),
        storeId: "STR-002",
        storeName: "Tonbridge Main",
        openingStock: 24800,
        closingStock: 24500,
        journalId: "JNL-006",
      },
      {
        weekStart: new Date(2024, 2, 15),
        storeId: "STR-002",
        storeName: "Tonbridge Main",
        openingStock: 24500,
        closingStock: 24200,
        journalId: "JNL-007",
      },
      {
        weekStart: new Date(2024, 2, 22),
        storeId: "STR-002",
        storeName: "Tonbridge Main",
        openingStock: 24200,
        closingStock: 24000,
        journalId: "JNL-008",
      },
      // Tunbridge Wells
      {
        weekStart: new Date(2024, 2, 1),
        storeId: "STR-003",
        storeName: "Tunbridge Wells",
        openingStock: 18000,
        closingStock: 17600,
        journalId: "JNL-009",
      },
      {
        weekStart: new Date(2024, 2, 8),
        storeId: "STR-003",
        storeName: "Tunbridge Wells",
        openingStock: 17600,
        closingStock: 17400,
        journalId: "JNL-010",
      },
      {
        weekStart: new Date(2024, 2, 15),
        storeId: "STR-003",
        storeName: "Tunbridge Wells",
        openingStock: 17400,
        closingStock: 17200,
        journalId: "JNL-011",
      },
      {
        weekStart: new Date(2024, 2, 22),
        storeId: "STR-003",
        storeName: "Tunbridge Wells",
        openingStock: 17200,
        closingStock: 17000,
        journalId: "JNL-012",
      },
      // Southborough
      {
        weekStart: new Date(2024, 2, 1),
        storeId: "STR-004",
        storeName: "Southborough",
        openingStock: 12000,
        closingStock: 11800,
        journalId: "JNL-013",
      },
      {
        weekStart: new Date(2024, 2, 8),
        storeId: "STR-004",
        storeName: "Southborough",
        openingStock: 11800,
        closingStock: 11500,
        journalId: "JNL-014",
      },
      {
        weekStart: new Date(2024, 2, 15),
        storeId: "STR-004",
        storeName: "Southborough",
        openingStock: 11500,
        closingStock: 11300,
        journalId: "JNL-015",
      },
      {
        weekStart: new Date(2024, 2, 22),
        storeId: "STR-004",
        storeName: "Southborough",
        openingStock: 11300,
        closingStock: 11000,
        journalId: "JNL-016",
      },
      // Maidstone
      {
        weekStart: new Date(2024, 2, 1),
        storeId: "STR-005",
        storeName: "Maidstone",
        openingStock: 20000,
        closingStock: 19800,
        journalId: "JNL-017",
      },
      {
        weekStart: new Date(2024, 2, 8),
        storeId: "STR-005",
        storeName: "Maidstone",
        openingStock: 19800,
        closingStock: 19500,
        journalId: "JNL-018",
      },
      {
        weekStart: new Date(2024, 2, 15),
        storeId: "STR-005",
        storeName: "Maidstone",
        openingStock: 19500,
        closingStock: 19300,
        journalId: "JNL-019",
      },
      {
        weekStart: new Date(2024, 2, 22),
        storeId: "STR-005",
        storeName: "Maidstone",
        openingStock: 19300,
        closingStock: 19000,
        journalId: "JNL-020",
      },
      // Sevenoaks
      {
        weekStart: new Date(2024, 2, 1),
        storeId: "STR-006",
        storeName: "Sevenoaks",
        openingStock: 16000,
        closingStock: 15800,
        journalId: "JNL-021",
      },
      {
        weekStart: new Date(2024, 2, 8),
        storeId: "STR-006",
        storeName: "Sevenoaks",
        openingStock: 15800,
        closingStock: 15500,
        journalId: "JNL-022",
      },
      {
        weekStart: new Date(2024, 2, 15),
        storeId: "STR-006",
        storeName: "Sevenoaks",
        openingStock: 15500,
        closingStock: 15300,
        journalId: "JNL-023",
      },
      {
        weekStart: new Date(2024, 2, 22),
        storeId: "STR-006",
        storeName: "Sevenoaks",
        openingStock: 15300,
        closingStock: 15000,
        journalId: "JNL-024",
      },
    ];

    // Filter data based on selected store
    const filteredData = selectedStore === "all" 
      ? mockData 
      : mockData.filter(item => item.storeId === selectedStore);

    setStockValues(filteredData);
  }, [selectedStore]); // Add selectedStore as dependency

  const handleStockValueChange = (
    weekStart: Date,
    storeId: string,
    field: "openingStock" | "closingStock",
    value: string
  ) => {
    setStockValues((prev) =>
      prev.map((item) =>
        item.weekStart.getTime() === weekStart.getTime() &&
        item.storeId === storeId
          ? { ...item, [field]: parseFloat(value) || 0 }
          : item
      )
    );
  };

  const createJournal = (stockValue: StockValue) => {
    // This would be replaced with an API call to create a journal
    console.log("Creating journal for:", stockValue);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Stock Control</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track stock values across all stores
          </p>
        </div>
        <div className="flex items-center gap-4">
          <DateAndStoreFilter
            storeValue={selectedStore}
            onStoreChange={setSelectedStore}
            dateValue={dateRange}
            onDateChange={(range) => range && setDateRange(range)}
          />
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Values</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-2xl border overflow-hidden shadow-sm">
            <div className="max-h-[600px] overflow-y-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="bg-gray-100">
                    <TableHead className="w-[150px] font-semibold text-gray-700 px-4 py-3">Week Starting</TableHead>
                    <TableHead className="w-[200px] font-semibold text-gray-700 px-4 py-3">Store</TableHead>
                    <TableHead className="w-[200px] text-right font-semibold text-gray-700 px-4 py-3">Opening Stock</TableHead>
                    <TableHead className="w-[200px] text-right font-semibold text-gray-700 px-4 py-3">Closing Stock</TableHead>
                    <TableHead className="w-[150px] text-center font-semibold text-gray-700 px-4 py-3">Journal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockValues.map((stock, idx) => (
                    <TableRow key={`${stock.weekStart}-${stock.storeId}`}
                      className={idx % 2 === 0 ? 'bg-white hover:bg-gray-50 transition-colors' : 'bg-gray-50 hover:bg-gray-100 transition-colors'}
                    >
                      <TableCell className="font-medium rounded-l-lg px-4 py-2">
                        {stock.weekStart.toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="px-4 py-2">{stock.storeName}</TableCell>
                      <TableCell className="text-right font-medium px-4 py-2">
                        {stock.openingStock.toLocaleString('en-GB', {
                          style: 'currency',
                          currency: 'GBP',
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </TableCell>
                      <TableCell className="text-right px-4 py-2">
                        <div className="flex justify-end">
                          <Input
                            type="number"
                            value={stock.closingStock}
                            onChange={(e) =>
                              handleStockValueChange(
                                stock.weekStart,
                                stock.storeId,
                                "closingStock",
                                e.target.value
                              )
                            }
                            className="w-24 text-right focus:ring-2 focus:ring-primary focus:border-primary rounded-md border border-input"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-center rounded-r-lg px-4 py-2">
                        {stock.journalId ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2 mx-auto"
                            onClick={() => window.location.href = `/accounting/Journals`}
                          >
                            <Link className="h-4 w-4" />
                            View Journal
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => createJournal(stock)}
                            className="mx-auto"
                          >
                            Create Journal
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
