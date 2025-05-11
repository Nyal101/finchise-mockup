"use client";

import React, { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X, Info, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { DateRange } from "react-day-picker";

// Types for financial data
interface LocationValues {
  "borough-green": string;
  "kings-hill": string;
  "loose": string;
  "maidstone": string;
  "snodland": string;
  total: string;
}

interface FinancialItem {
  name: string;
  values: LocationValues;
}

interface FinancialData {
  turnover: FinancialItem[];
  costOfSales: FinancialItem[];
  administrative: FinancialItem[];
}

// Location data
const locations = [
  { id: "borough-green" as const, name: "BOROUGH GREEN" },
  { id: "kings-hill" as const, name: "KINGS HILL" },
  { id: "loose" as const, name: "LOOSE" },
  { id: "maidstone" as const, name: "MAIDSTONE" },
  { id: "snodland" as const, name: "SNODLAND" },
];

const comparisonOptions = [
  { id: "none", name: "None" },
  { id: "previous-period", name: "Previous Period" },
  { id: "previous-year", name: "Previous Year" },
  { id: "budget", name: "Budget" },
];

// Mock data for financial report
const mockFinancialData: FinancialData = {
  turnover: [
    {
      name: "STORE - SALES",
      values: {
        "borough-green": "-",
        "kings-hill": "392,507.01",
        "loose": "650,629.39",
        "maidstone": "397,592.18",
        "snodland": "429,476.22",
        "total": "1,870,204.80",
      },
    },
  ],
  costOfSales: [
    {
      name: "Bonus Pay",
      values: {
        "borough-green": "-",
        "kings-hill": "374.53",
        "loose": "151.77",
        "maidstone": "117.74",
        "snodland": "208.86",
        "total": "852.90",
      },
    },
    {
      name: "C3 National Deal - Food Cost Support",
      values: {
        "borough-green": "-",
        "kings-hill": "(879.69)",
        "loose": "(1,944.30)",
        "maidstone": "(1,087.69)",
        "snodland": "(1,235.55)",
        "total": "(5,147.23)",
      },
    },
    {
      name: "Commissary Rebate Scheme",
      values: {
        "borough-green": "-",
        "kings-hill": "(1,814.69)",
        "loose": "(3,161.99)",
        "maidstone": "(2,713.98)",
        "snodland": "(3,761.49)",
        "total": "(11,452.15)",
      },
    },
    {
      name: "Food - Delivery (Dominos)",
      values: {
        "borough-green": "-",
        "kings-hill": "5,168.03",
        "loose": "5,173.03",
        "maidstone": "5,348.03",
        "snodland": "5,168.03",
        "total": "20,857.12",
      },
    },
    {
      name: "Food - Food Non VAT",
      values: {
        "borough-green": "-",
        "kings-hill": "12,177.38",
        "loose": "19,734.93",
        "maidstone": "11,355.34",
        "snodland": "13,664.07",
        "total": "56,931.72",
      },
    },
    {
      name: "Food - Food with out VAT",
      values: {
        "borough-green": "-",
        "kings-hill": "97,402.74",
        "loose": "158,147.40",
        "maidstone": "98,031.46",
        "snodland": "108,870.61",
        "total": "462,452.21",
      },
    },
  ],
  administrative: [
    {
      name: "Payroll Cost",
      values: {
        "borough-green": "-",
        "kings-hill": "62.05",
        "loose": "62.05",
        "maidstone": "62.05",
        "snodland": "63.90",
        "total": "250.05",
      },
    },
    {
      name: "DMS1 -Pleo - EV Charging",
      values: {
        "borough-green": "-",
        "kings-hill": "14.30",
        "loose": "14.30",
        "maidstone": "14.30",
        "snodland": "14.55",
        "total": "57.45",
      },
    },
    {
      name: "DMS1 -Pleo - Advertising Levy",
      values: {
        "borough-green": "-",
        "kings-hill": "16,214.67",
        "loose": "26,611.48",
        "maidstone": "16,264.66",
        "snodland": "17,531.94",
        "total": "76,623.55",
      },
    },
  ],
};

// Calculate totals
const calculateTotals = (data: FinancialData) => {
  let turnoverTotal = 0;
  let costOfSalesTotal = 0;
  let grossProfit = 0;
  let administrativeTotal = 0;
  let operatingProfit = 0;
  
  // Convert string values to numbers for calculation
  Object.entries(data.turnover[0].values).forEach(([key, value]) => {
    if (value !== "-" && key !== "total") {
      turnoverTotal += parseFloat(value.replace(/,/g, ""));
    }
  });
  
  data.costOfSales.forEach((item) => {
    Object.entries(item.values).forEach(([key, value]) => {
      if (value !== "-" && key !== "total") {
        // Handle negative values in parentheses
        const numValue = value.includes("(") 
          ? -parseFloat(value.replace(/[(),]/g, ""))
          : parseFloat(value.replace(/,/g, ""));
        costOfSalesTotal += numValue;
      }
    });
  });
  
  data.administrative.forEach((item) => {
    Object.entries(item.values).forEach(([key, value]) => {
      if (value !== "-" && key !== "total") {
        administrativeTotal += parseFloat(value.replace(/,/g, ""));
      }
    });
  });
  
  grossProfit = turnoverTotal - costOfSalesTotal;
  operatingProfit = grossProfit - administrativeTotal;
  
  return {
    turnoverTotal: turnoverTotal.toLocaleString("en-GB", { maximumFractionDigits: 2 }),
    costOfSalesTotal: costOfSalesTotal.toLocaleString("en-GB", { maximumFractionDigits: 2 }),
    grossProfit: grossProfit.toLocaleString("en-GB", { maximumFractionDigits: 2 }),
    administrativeTotal: administrativeTotal.toLocaleString("en-GB", { maximumFractionDigits: 2 }),
    operatingProfit: operatingProfit.toLocaleString("en-GB", { maximumFractionDigits: 2 }),
  };
};

export default function FinancialReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 0, 1), // January 1, 2025
    to: new Date(2025, 11, 31),  // December 31, 2025
  });
  const [compareWith, setCompareWith] = useState<string>("none");
  const [trackingCategory, setTrackingCategory] = useState<string>("5 Store");
  const [showDateSelector, setShowDateSelector] = useState<boolean>(false);

  const totals = calculateTotals(mockFinancialData);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Financial Reports</h1>
      
      {/* Controls panel similar to Xero screenshot */}
      <Card className="p-6 mb-8">
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <div className="text-sm font-medium">Date range: <span className="font-normal">This financial year</span></div>
            <div className="flex items-center gap-4">
              <Popover open={showDateSelector} onOpenChange={setShowDateSelector}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                      <>
                        {format(dateRange.from, "d MMM yyyy")} - {format(dateRange.to || dateRange.from, "d MMM yyyy")}
                      </>
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={(range) => {
                      if (range) setDateRange(range);
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-8">
            <div className="flex flex-col gap-2">
              <div className="text-sm font-medium">Compare with</div>
              <Select value={compareWith} onValueChange={setCompareWith}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  {comparisonOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>{option.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="text-sm font-medium">Compare tracking categories</div>
              <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-white">
                <div className="flex-1">{trackingCategory}</div>
                <Badge className="flex items-center gap-1 bg-blue-100 text-blue-800 hover:bg-blue-200">
                  {trackingCategory}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setTrackingCategory("")} />
                </Badge>
              </div>
            </div>
            
            <div className="flex items-end gap-2">
              <Button variant="outline" className="flex items-center gap-1">
                <Info className="h-4 w-4" />
              </Button>
              <div className="flex-1"></div>
              <Button variant="outline">More</Button>
              <Button>Update</Button>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Financial Report Card */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold">Profit and Loss</h2>
          <div className="text-md">Popat Leisure Limited</div>
          <div className="text-sm text-muted-foreground">For the year ended 31 December 2025</div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow className="border-b-2 border-gray-300">
              <TableHead className="w-[250px]"></TableHead>
              {locations.map((loc) => (
                <TableHead key={loc.id} className="text-right">
                  {loc.name}
                </TableHead>
              ))}
              <TableHead className="text-right font-bold">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Turnover section */}
            <TableRow className="font-bold">
              <TableCell className="py-4">Turnover</TableCell>
              {locations.map((loc) => (
                <TableCell key={loc.id} className="text-right"></TableCell>
              ))}
              <TableCell className="text-right"></TableCell>
            </TableRow>
            
            {mockFinancialData.turnover.map((item, index) => (
              <TableRow key={`turnover-${index}`}>
                <TableCell className="pl-6">{item.name}</TableCell>
                {locations.map((loc) => (
                  <TableCell key={loc.id} className="text-right">
                    {item.values[loc.id]}
                  </TableCell>
                ))}
                <TableCell className="text-right font-bold">{item.values.total}</TableCell>
              </TableRow>
            ))}
            
            <TableRow className="font-bold border-t border-gray-300">
              <TableCell>Total Turnover</TableCell>
              {locations.map((loc) => (
                <TableCell key={loc.id} className="text-right">
                  {mockFinancialData.turnover[0].values[loc.id]}
                </TableCell>
              ))}
              <TableCell className="text-right">{mockFinancialData.turnover[0].values.total}</TableCell>
            </TableRow>

            {/* Cost of Sales section */}
            <TableRow className="font-bold">
              <TableCell className="py-4">Cost of Sales</TableCell>
              {locations.map((loc) => (
                <TableCell key={loc.id} className="text-right"></TableCell>
              ))}
              <TableCell className="text-right"></TableCell>
            </TableRow>
            
            {mockFinancialData.costOfSales.map((item, index) => (
              <TableRow key={`cos-${index}`}>
                <TableCell className="pl-6">{item.name}</TableCell>
                {locations.map((loc) => (
                  <TableCell key={loc.id} className="text-right">
                    {item.values[loc.id]}
                  </TableCell>
                ))}
                <TableCell className="text-right font-bold">{item.values.total}</TableCell>
              </TableRow>
            ))}
            
            <TableRow className="font-bold border-t border-gray-300">
              <TableCell>Total Cost of Sales</TableCell>
              {locations.map((loc) => (
                <TableCell key={loc.id} className="text-right">
                  {loc.id === "borough-green" ? "-" : "225,258.86"}
                </TableCell>
              ))}
              <TableCell className="text-right">1,069,426.62</TableCell>
            </TableRow>
            
            {/* Gross Profit */}
            <TableRow className="font-bold border-t-2 border-gray-300 bg-gray-50">
              <TableCell>Gross Profit</TableCell>
              {locations.map((loc) => (
                <TableCell key={loc.id} className="text-right">
                  {loc.id === "borough-green" ? "-" : "167,248.15"}
                </TableCell>
              ))}
              <TableCell className="text-right">800,778.18</TableCell>
            </TableRow>
            
            {/* Administrative Expenses */}
            <TableRow className="font-bold">
              <TableCell className="py-4">Administrative Expenses</TableCell>
              {locations.map((loc) => (
                <TableCell key={loc.id} className="text-right"></TableCell>
              ))}
              <TableCell className="text-right"></TableCell>
            </TableRow>
            
            {mockFinancialData.administrative.map((item, index) => (
              <TableRow key={`admin-${index}`}>
                <TableCell className="pl-6">{item.name}</TableCell>
                {locations.map((loc) => (
                  <TableCell key={loc.id} className="text-right">
                    {item.values[loc.id]}
                  </TableCell>
                ))}
                <TableCell className="text-right font-bold">{item.values.total}</TableCell>
              </TableRow>
            ))}
            
            <TableRow className="font-bold border-t border-gray-300">
              <TableCell>Total Administrative Costs</TableCell>
              {locations.map((loc) => (
                <TableCell key={loc.id} className="text-right">
                  {loc.id === "borough-green" ? "-" : "124,330.63"}
                </TableCell>
              ))}
              <TableCell className="text-right">607,361.34</TableCell>
            </TableRow>
            
            {/* Operating Profit */}
            <TableRow className="font-bold border-t-2 border-gray-300 bg-gray-50">
              <TableCell>Operating Profit</TableCell>
              {locations.map((loc) => (
                <TableCell key={loc.id} className="text-right">
                  {loc.id === "borough-green" ? "-" : "45,228.15"}
                </TableCell>
              ))}
              <TableCell className="text-right">{totals.operatingProfit}</TableCell>
            </TableRow>
            
            {/* Profit on Ordinary Activities */}
            <TableRow className="font-bold">
              <TableCell>Profit on Ordinary Activities</TableCell>
              {locations.map((loc) => (
                <TableCell key={loc.id} className="text-right text-green-700">
                  {loc.id === "borough-green" ? "(40.88)" : "42,917.52"}
                </TableCell>
              ))}
              <TableCell className="text-right text-green-700">193,416.84</TableCell>
            </TableRow>
            
            {/* Profit after Taxation */}
            <TableRow className="font-bold">
              <TableCell>Profit after Taxation</TableCell>
              {locations.map((loc) => (
                <TableCell key={loc.id} className="text-right text-green-700">
                  {loc.id === "borough-green" ? "(40.88)" : "42,917.52"}
                </TableCell>
              ))}
              <TableCell className="text-right text-green-700">193,416.84</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </main>
  );
}
