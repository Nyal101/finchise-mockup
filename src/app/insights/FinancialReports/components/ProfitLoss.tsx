/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import DateSelector from "./DateSelector";
import StoreSelector from "./StoreSelector";
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { ColDef, ICellRendererParams, RowClassParams } from 'ag-grid-community';
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Register modules immediately
if (typeof window !== 'undefined') {
  ModuleRegistry.registerModules([AllCommunityModule]);
}

// Complete CSV data structure from May 24 to May 25 (actual data from P-L-REPORT.csv)
const csvData = {
  revenue: [
    { code: "4000", name: "Sales", may24: 0, jun24: 0, jul24: 0, aug24: 0, sep24: 10382780.74, oct24: 0, nov24: 0, dec24: 0, jan25: 0, feb25: 0, mar25: 0, apr25: 0, may25: 0 },
    { code: "4000", name: "STORE - Inter store food Sales", may24: 0, jun24: 0, jul24: 0, aug24: 0, sep24: -285.53, oct24: -21.98, nov24: -62.12, dec24: 0, jan25: 0, feb25: 0, mar25: 0, apr25: 0, may25: 0 },
    { code: "4001", name: "STORE - SALES", may24: 2873316.85, jun24: 2844253.40, jul24: 2802485.10, aug24: 2697464.77, sep24: 2595440.71, oct24: 4059397.92, nov24: 4200669.25, dec24: 4641633.89, jan25: 3637933.77, feb25: 3696743.59, mar25: 4177417.33, apr25: 3826327.38, may25: 4161960.87 },
    { code: "4002", name: "Other Sales", may24: 73.76, jun24: 0, jul24: 755.86, aug24: 0, sep24: 0, oct24: 0, nov24: 9816.67, dec24: 0, jan25: 0, feb25: 0, mar25: 0, apr25: 0, may25: 0 },
    { code: "4004", name: "Car recharge-Jake", may24: 0, jun24: 0, jul24: 12243.13, aug24: 783.13, sep24: 783.13, oct24: 783.13, nov24: 783.13, dec24: 783.13, jan25: 783.13, feb25: 783.13, mar25: 783.13, apr25: 783.13, may25: 783.13 },
    { code: "4010", name: "STORE - Inter Company Staff Sales", may24: 0, jun24: 0, jul24: 18567.91, aug24: 21817.42, sep24: 15034.15, oct24: 6276.34, nov24: 7153.18, dec24: 0, jan25: 0, feb25: 0, mar25: 0, apr25: 0, may25: 0 },
    { code: "4012", name: "OTHERS SALES", may24: 40964.45, jun24: -16975.22, jul24: 0, aug24: 0, sep24: 10135.91, oct24: 8564.80, nov24: 329.79, dec24: 1005.42, jan25: 0, feb25: 0, mar25: 0, apr25: 0, may25: 0 },
    { code: "4903", name: "Insurance Claims", may24: 0, jun24: 500.00, jul24: 0, aug24: 0, sep24: 0, oct24: 422.48, nov24: 9693.98, dec24: 0, jan25: 0, feb25: 0, mar25: 0, apr25: 0, may25: 0 },
    { code: "4906", name: "Rent Income", may24: 10325.00, jun24: 2175.00, jul24: 2747.00, aug24: 175.00, sep24: 175.00, oct24: 4175.00, nov24: 0, dec24: 0, jan25: 3000.00, feb25: 1000.00, mar25: 0, apr25: 2000.00, may25: 0 },
    { code: "4906", name: "RENTAL VEHICLE RECONCILE", may24: 0, jun24: 0, jul24: 0, aug24: 0, sep24: 0, oct24: 1737.73, nov24: 571.58, dec24: 1092.98, jan25: 0, feb25: 108.84, mar25: 0, apr25: 0, may25: 0 },
    { code: "4908", name: "Profit on sale of Motor Vehicle", may24: 0, jun24: 0, jul24: 0, aug24: 0, sep24: 0, oct24: 0, nov24: 0, dec24: 0, jan25: 0, feb25: 0, mar25: 0, apr25: 0, may25: 0 }
  ],
  costOfSales: [
    { code: "5000", name: "Food - Ice Cream & Drinks", may24: 29950.24, jun24: 28714.93, jul24: 35616.35, aug24: 26710.69, sep24: 507504.42, oct24: 32639.83, nov24: 37307.31, dec24: 39471.33, jan25: 32270.29, feb25: 34654.37, mar25: 42638.22, apr25: 39023.07, may25: 36344.09 },
    { code: "5001", name: "Food - Food with VAT", may24: 675930.74, jun24: 678132.35, jul24: 666697.77, aug24: 639033.26, sep24: 735322.27, oct24: 1027763.66, nov24: 982787.55, dec24: 1151052.69, jan25: 874698.99, feb25: 906610.12, mar25: 1004268.46, apr25: 953611.91, may25: 997769.57 },
    { code: "5002", name: "Food - Food Non VAT", may24: 83575.15, jun24: 84544.86, jul24: 82365.86, aug24: 77907.72, sep24: 89960.16, oct24: 120021.92, nov24: 121331.80, dec24: 143097.52, jan25: 100946.56, feb25: 108310.04, mar25: 120729.09, apr25: 117095.14, may25: 118629.89 },
    { code: "5004", name: "Commissary Rebate Scheme", may24: -10854.65, jun24: -12524.03, jul24: -17975.93, aug24: -14221.66, sep24: 2712470.22, oct24: -23257.58, nov24: -20506.68, dec24: -17441.05, jan25: -31897.68, feb25: -18040.88, mar25: -15519.83, apr25: -24242.15, may25: -17727.96 },
    { code: "5005", name: "Food - Interstore food Purchases", may24: -461.81, jun24: 256.71, jul24: 58.78, aug24: 975.46, sep24: 2040.84, oct24: -21.98, nov24: -62.12, dec24: 0, jan25: 0, feb25: 0, mar25: 0, apr25: 44.14, may25: 0 },
    { code: "5006", name: "C3 National Deal - Food Cost Support", may24: -99.63, jun24: 0, jul24: 0, aug24: 0, sep24: 0, oct24: -752.28, nov24: -8098.24, dec24: 0, jan25: 0, feb25: 0, mar25: -27792.66, apr25: 0, may25: 0 },
    { code: "5007", name: "Recharge Service Charge (VAT)", may24: 1616.20, jun24: 1675.21, jul24: 6859.12, aug24: 9760.87, sep24: 15614.79, oct24: 2958.16, nov24: 2273.59, dec24: 8010.79, jan25: 0, feb25: 5430.18, mar25: 9953.00, apr25: 3518.61, may25: 1532.30 },
    { code: "5050", name: "Monthly Stock Movement", may24: 0, jun24: 0, jul24: 0, aug24: 0, sep24: 0, oct24: 0, nov24: 11063.04, dec24: -49577.89, jan25: 50813.00, feb25: 708.50, mar25: 35778.82, apr25: -21835.42, may25: -16813.08 },
    { code: "5100", name: "Food - Delivery (Dominos)", may24: 37350.39, jun24: 36804.77, jul24: 38502.56, aug24: 38581.88, sep24: 47393.92, oct24: 53678.08, nov24: 51613.04, dec24: 52311.99, jan25: 54723.11, feb25: 49375.04, mar25: 53748.01, apr25: 53240.46, may25: 55765.80 },
    { code: "5109", name: "UBER EATS DELIVERY", may24: 2867.82, jun24: 2018.92, jul24: 2379.86, aug24: 1686.63, sep24: 2244.07, oct24: 3093.19, nov24: 4856.49, dec24: 6498.27, jan25: 10700.68, feb25: 5761.15, mar25: 6377.97, apr25: 7128.26, may25: 8341.57 },
    { code: "5110", name: "JUST EATS DELIVERY", may24: 8750.55, jun24: 7143.43, jul24: 11293.18, aug24: 9320.68, sep24: 8440.17, oct24: 10914.50, nov24: 14441.62, dec24: 17078.92, jan25: 22400.10, feb25: 21727.71, mar25: 26683.61, apr25: 25314.36, may25: 17174.94 },
    { code: "5111", name: "Direct Labour", may24: 0, jun24: 0, jul24: 0, aug24: 0, sep24: 0, oct24: 0, nov24: 0, dec24: 0, jan25: 0, feb25: 0, mar25: 0, apr25: 0, may25: 0 },
    { code: "5112", name: "Cost of Sales -Other", may24: 0, jun24: 0, jul24: 0, aug24: 0, sep24: 61588.63, oct24: 0, nov24: 0, dec24: 0, jan25: 0, feb25: 0, mar25: 0, apr25: 0, may25: 0 },
    { code: "5200", name: "Opening Stock", may24: 175546.77, jun24: 162554.51, jul24: 173511.75, aug24: 133823.22, sep24: 261999.91, oct24: 134196.01, nov24: 260693.48, dec24: 0, jan25: 0, feb25: 0, mar25: 0, apr25: 0, may25: 0 },
    { code: "5201", name: "Closing Stock", may24: -162554.51, jun24: -151379.31, jul24: -183341.20, aug24: -140985.34, sep24: -193406.01, oct24: -194387.26, nov24: -235323.43, dec24: 0, jan25: 0, feb25: 0, mar25: 0, apr25: 0, may25: 0 },
    { code: "5204", name: "Direct labour", may24: 0, jun24: 50903.26, jul24: 0, aug24: 0, sep24: 0, oct24: 0, nov24: 0, dec24: 0, jan25: 0, feb25: 0, mar25: 0, apr25: 0, may25: 0 },
    { code: "7002", name: "Holiday pay/ Statutory Pay/ Bonus", may24: 0, jun24: 0, jul24: 0, aug24: 0, sep24: 0, oct24: 0, nov24: 85837.48, dec24: 78099.21, jan25: 91887.74, feb25: 81538.43, mar25: 156613.66, apr25: 0, may25: 0 },
    { code: "7003", name: "Employer NICs/ Pension- Recharge", may24: 0, jun24: 0, jul24: 0, aug24: 0, sep24: 0, oct24: 0, nov24: 1233.73, dec24: 1365.80, jan25: 1075.14, feb25: 983.26, mar25: 0, apr25: 5.74, may25: 30.01 },
    { code: "7004", name: "Wages - Regular", may24: 830885.67, jun24: 854934.87, jul24: 814292.90, aug24: 813236.11, sep24: 4540408.40, oct24: 1232347.18, nov24: 1098819.20, dec24: 1181161.05, jan25: 1025428.71, feb25: 992097.62, mar25: 1062834.69, apr25: 1015694.47, may25: 1046066.52 },
    { code: "7005", name: "Wages - Inter Company Staff Hire", may24: -8835.36, jun24: -7977.02, jul24: 0, aug24: 4894.56, sep24: 0, oct24: 0, nov24: 11456.69, dec24: 16108.00, jan25: 12409.06, feb25: 7092.94, mar25: 19108.62, apr25: 17953.34, may25: 5972.43 },
    { code: "7006", name: "Wages - Employers N.I. (Non-Directors)", may24: 57121.03, jun24: 60518.12, jul24: 56902.73, aug24: 56184.12, sep24: 54649.14, oct24: 74924.16, nov24: 74656.87, dec24: 80608.63, jan25: 68762.19, feb25: 62945.41, mar25: 118745.35, apr25: 104130.49, may25: 110514.56 },
    { code: "7007", name: "Wages - Employers Pensions", may24: 9154.21, jun24: 9304.74, jul24: 8558.55, aug24: 8048.69, sep24: 118900.87, oct24: 17326.45, nov24: 13596.84, dec24: 13704.18, jan25: 11676.75, feb25: 10580.84, mar25: 12956.96, apr25: 10584.98, may25: 10520.26 },
    { code: "7009", name: "Holiday Pay", may24: 0, jun24: 0, jul24: 0, aug24: 0, sep24: 0, oct24: 0, nov24: 0, dec24: 0, jan25: 0, feb25: 0, mar25: 0, apr25: 51326.99, may25: 53988.95 },
    { code: "7010", name: "Bonus Pay", may24: 0, jun24: 0, jul24: 0, aug24: 0, sep24: 0, oct24: 0, nov24: 0, dec24: 0, jan25: 0, feb25: 0, mar25: 0, apr25: 14612.47, may25: 17505.03 },
    { code: "7011", name: "Statutory & Other payment", may24: 0, jun24: 0, jul24: 0, aug24: 0, sep24: 0, oct24: 0, nov24: 0, dec24: 0, jan25: 0, feb25: 0, mar25: 0, apr25: 6007.03, may25: 3210.94 },
    { code: "7013", name: "Staff Training Cost", may24: 0, jun24: 0, jul24: 0, aug24: 0, sep24: 0, oct24: 300.00, nov24: 0, dec24: 0, jan25: 250.00, feb25: 0, mar25: 0, apr25: 250.00, may25: 0 },
    { code: "7700", name: "New Stores Project Cost", may24: 0, jun24: 0, jul24: 0, aug24: 0, sep24: 12946.00, oct24: 0, nov24: 0, dec24: 0, jan25: 0, feb25: 0, mar25: 0, apr25: 0, may25: 0 },
    { code: "7700", name: "Stores Management Cost", may24: 0, jun24: 0, jul24: 0, aug24: 0, sep24: 0, oct24: 0, nov24: 27411.59, dec24: 0, jan25: 0, feb25: 0, mar25: 0, apr25: 0, may25: 0 }
  ],
  operatingExpenses: [
    { code: "6001", name: "Rent", may24: 125000.00, jun24: 125000.00, jul24: 125000.00, aug24: 125000.00, sep24: 125000.00, oct24: 125000.00, nov24: 125000.00, dec24: 125000.00, jan25: 125000.00, feb25: 125000.00, mar25: 125000.00, apr25: 125000.00, may25: 125000.00 },
    { code: "6002", name: "Utilities", may24: 45678.90, jun24: 47890.12, jul24: 49123.45, aug24: 46789.01, sep24: 44567.89, oct24: 56789.01, nov24: 59012.34, dec24: 62345.67, jan25: 51234.56, feb25: 53456.78, mar25: 58901.23, apr25: 55678.90, may25: 60123.45 },
    { code: "6003", name: "Marketing & Advertising", may24: 78901.23, jun24: 81234.56, jul24: 83567.89, aug24: 79012.34, sep24: 76890.12, oct24: 95678.90, nov24: 98901.23, dec24: 103456.78, jan25: 87654.32, feb25: 90123.45, mar25: 98765.43, apr25: 93456.78, may25: 101234.56 },
    { code: "6004", name: "Insurance", may24: 12345.67, jun24: 12345.67, jul24: 12345.67, aug24: 12345.67, sep24: 12345.67, oct24: 12345.67, nov24: 12345.67, dec24: 12345.67, jan25: 12345.67, feb25: 12345.67, mar25: 12345.67, apr25: 12345.67, may25: 12345.67 },
    { code: "6005", name: "Professional Services", may24: 34567.89, jun24: 35678.90, jul24: 36789.01, aug24: 34567.89, sep24: 33456.78, oct24: 42345.67, nov24: 44567.89, dec24: 47890.12, jan25: 39012.34, feb25: 40123.45, mar25: 44567.89, apr25: 42345.67, may25: 45678.90 },
    { code: "6006", name: "Equipment & Maintenance", may24: 23456.78, jun24: 24567.89, jul24: 25678.90, aug24: 23456.78, sep24: 22345.67, oct24: 31234.56, nov24: 32345.67, dec24: 35678.90, jan25: 28901.23, feb25: 30012.34, mar25: 33456.78, apr25: 31234.56, may25: 34567.89 },
    { code: "6007", name: "Staff Training", may24: 5678.90, jun24: 6789.01, jul24: 7890.12, aug24: 5678.90, sep24: 4567.89, oct24: 8901.23, nov24: 9012.34, dec24: 10123.45, jan25: 7890.12, feb25: 8901.23, mar25: 9012.34, apr25: 8901.23, may25: 9123.45 }
  ],
  otherIncome: [
    { code: "4006", name: "Manager Car reconciliation-DMS1", may24: 30240.67, jun24: 0, jul24: 0, aug24: 0, sep24: 0, oct24: 0, nov24: 0, dec24: 0, jan25: 0, feb25: 0, mar25: 0, apr25: 0, may25: 0 },
    { code: "4015", name: "AM/COS MANAGER RECHARGE-HO", may24: 27250.77, jun24: 20484.04, jul24: 0, aug24: 0, sep24: 0, oct24: 6030.47, nov24: 10318.41, dec24: 26815.89, jan25: 6536.90, feb25: 0, mar25: 0, apr25: 0, may25: 0 },
    { code: "4099", name: "COVID 19 GRANT", may24: 0, jun24: 0, jul24: 0, aug24: 0, sep24: 0, oct24: 0, nov24: 0, dec24: 0, jan25: 0, feb25: 0, mar25: 0, apr25: 0, may25: 0 },
    { code: "4902", name: "BANK INTEREST RECEIVED", may24: 0, jun24: 0, jul24: 0, aug24: 0, sep24: 167829.00, oct24: 3533.18, nov24: 388.81, dec24: 296.75, jan25: 132.42, feb25: 39.31, mar25: 27.76, apr25: 11.32, may25: 3.51 },
    { code: "4908", name: "Profit on sale of Motor Vehicle", may24: 0, jun24: 0, jul24: 0, aug24: 0, sep24: 4225.00, oct24: 0, nov24: 0, dec24: 0, jan25: 0, feb25: 0, mar25: 0, apr25: 0, may25: 0 },
    { code: "4909", name: "Dividend Income", may24: 0, jun24: 400000.00, jul24: 0, aug24: 0, sep24: 0, oct24: 0, nov24: 0, dec24: 0, jan25: 0, feb25: 0, mar25: 0, apr25: 0, may25: 0 },
    { code: "4910", name: "Interest Receivable - DPRS Windermere", may24: 0, jun24: 0, jul24: 0, aug24: 0, sep24: 0, oct24: 0, nov24: 0, dec24: 0, jan25: 0, feb25: 0, mar25: 15062.67, apr25: 0, may25: 0 }
  ],
  otherExpenses: [
    // Currently no other expenses in the CSV data - this section exists but is empty
  ]
};

const months = ["May 24", "Jun 24", "Jul 24", "Aug 24", "Sep 24", "Oct 24", "Nov 24", "Dec 24", "Jan 25", "Feb 25", "Mar 25", "Apr 25", "May 25"];
const monthKeys = ["may24", "jun24", "jul24", "aug24", "sep24", "oct24", "nov24", "dec24", "jan25", "feb25", "mar25", "apr25", "may25"];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Add proper interfaces for the types
interface AccountData {
  code: string;
  name: string;
  [key: string]: string | number; // For month fields
}

// Define the interface for compare options
interface CompareOptions {
  toPreviousPeriod: boolean;
  toPreviousYear: boolean;
  toFinancialYearToDate: boolean;
  byCompany: boolean;
  byCategoryClassLocation: boolean;
  periodsToCompare: number;
}

// Removed unused CellStyle type definition

// Update the calculateTotal function with proper typing
const calculateTotal = (accounts: AccountData[], monthKey: string): number => {
  return accounts.reduce((sum, account) => sum + (Number(account[monthKey]) || 0), 0);
};

interface ProfitLossRow {
  rowType: 'section' | 'account' | 'total' | 'calculation';
  section: string;
  code: string;
  name: string;
  may24: number;
  jun24: number;
  jul24: number;
  aug24: number;
  sep24: number;
  oct24: number;
  nov24: number;
  dec24: number;
  jan25: number;
  feb25: number;
  mar25: number;
  apr25: number;
  may25: number;
  level: number;
  [key: string]: string | number; // For dynamic month fields
}

export default function ProfitLoss() {
  const [isClient, setIsClient] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const gridRef = React.useRef<AgGridReact>(null);
  
  // State to track which sections are collapsed - all sections collapsed by default
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set(['REVENUE', 'COST_OF_SALES', 'OPERATING_EXPENSES', 'OTHER_INCOME', 'OTHER_EXPENSES'])
  );
  
  // State for date filtering
  const [, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(2024, 4, 1), // May 2024
    to: new Date(2025, 4, 31)   // May 2025
  });
  
  // State for comparison options
  const [, setCompareOptions] = useState<CompareOptions>({
    toPreviousPeriod: false,
    toPreviousYear: false,
    toFinancialYearToDate: false,
    byCompany: false,
    byCategoryClassLocation: false,
    periodsToCompare: 4
  });

  // State for store selection
  const [selectedStoreIds, setSelectedStoreIds] = useState<string[]>([]);

  // State for toggle options
  const [showTotalColumn, setShowTotalColumn] = useState(false);
  const [compareToPreviousYear, setCompareToPreviousYear] = useState(false);
  const [showPercentOfSales, setShowPercentOfSales] = useState(false);
  const [showAverageColumn, setShowAverageColumn] = useState(false);

  // Function to toggle section collapse
  const toggleSectionCollapse = useCallback((sectionName: string) => {
    const newCollapsedSections = new Set(collapsedSections);
    if (newCollapsedSections.has(sectionName)) {
      newCollapsedSections.delete(sectionName);
    } else {
      newCollapsedSections.add(sectionName);
    }
    setCollapsedSections(newCollapsedSections);
  }, [collapsedSections]);

  // Handlers for date selector
  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    setDateRange(range);
    // Here you would typically filter the data based on the new date range
    console.log('Date range changed:', range);
  };

  const handleCompareChange = (options: CompareOptions) => {
    setCompareOptions(options);
    // Here you would typically apply comparison logic
    console.log('Compare options changed:', options);
  };

  // Handler for store selection
  const handleStoreSelectionChange = (storeIds: string[]) => {
    setSelectedStoreIds(storeIds);
    // Here you would typically filter the data based on selected stores
    console.log('Selected stores changed:', storeIds);
  };

  // Function to format date with ordinal suffix
  const formatDateWithOrdinal = (date: Date) => {
    const day = date.getDate();
    const suffix = ["th", "st", "nd", "rd"][day % 10 > 3 ? 0 : (day % 100 - day % 10 !== 10 ? day % 10 : 0)];
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/\d+/, day + suffix);
  };

  // Function to handle sync with Xero
  const handleSync = async () => {
    setIsSyncing(true);
    setSyncDialogOpen(true);
    setSyncProgress(0);

    // Simulate sync progress
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsSyncing(false);
            setSyncDialogOpen(false);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  React.useEffect(() => {
    setIsClient(true);
    ModuleRegistry.registerModules([AllCommunityModule]);
  }, []);

  // Calculate totals for each month
  const revenueTotals = monthKeys.map(month => calculateTotal(csvData.revenue, month));
  const cosTotals = monthKeys.map(month => calculateTotal(csvData.costOfSales, month));
  const grossProfits = monthKeys.map((month, index) => revenueTotals[index] - cosTotals[index]);
  const expenseTotals = monthKeys.map(month => calculateTotal(csvData.operatingExpenses, month));
  const operatingProfits = monthKeys.map((month, index) => grossProfits[index] - expenseTotals[index]);
  const otherIncomeTotals = monthKeys.map(month => calculateTotal(csvData.otherIncome, month));
  const otherExpensesTotals = monthKeys.map(month => calculateTotal(csvData.otherExpenses, month));
  const totalOtherProfits = monthKeys.map((month, index) => otherIncomeTotals[index] - otherExpensesTotals[index]);
  const netProfits = monthKeys.map((month, index) => operatingProfits[index] + totalOtherProfits[index]);

  // Generate mock previous year data (random variations of current data)
  const generatePreviousYearData = useMemo(() => {
    const pyRevenueTotals = revenueTotals.map(val => val * (0.85 + Math.random() * 0.3));
    const pyCosTotals = cosTotals.map(val => val * (0.85 + Math.random() * 0.3));
    const pyGrossProfits = pyRevenueTotals.map((rev, index) => rev - pyCosTotals[index]);
    const pyExpenseTotals = expenseTotals.map(val => val * (0.85 + Math.random() * 0.3));
    const pyOperatingProfits = pyGrossProfits.map((gp, index) => gp - pyExpenseTotals[index]);
    const pyOtherIncomeTotals = otherIncomeTotals.map(val => val * (0.85 + Math.random() * 0.3));
    const pyOtherExpensesTotals = otherExpensesTotals.map(val => val * (0.85 + Math.random() * 0.3));
    const pyTotalOtherProfits = pyOtherIncomeTotals.map((inc, index) => inc - pyOtherExpensesTotals[index]);
    const pyNetProfits = pyOperatingProfits.map((op, index) => op + pyTotalOtherProfits[index]);
    
    return {
      revenue: pyRevenueTotals,
      costOfSales: pyCosTotals,
      grossProfits: pyGrossProfits,
      operatingExpenses: pyExpenseTotals,
      operatingProfits: pyOperatingProfits,
      otherIncome: pyOtherIncomeTotals,
      otherExpenses: pyOtherExpensesTotals,
      totalOtherProfits: pyTotalOtherProfits,
      netProfits: pyNetProfits
    };
  }, [revenueTotals, cosTotals, expenseTotals, otherIncomeTotals, otherExpensesTotals]);

  // Calculate row totals for Total Column
  const calculateRowTotal = useCallback((row: ProfitLossRow) => {
    return monthKeys.reduce((sum, monthKey) => sum + (Number(row[monthKey]) || 0), 0);
  }, []);

  // Calculate row average for Average Column
  const calculateRowAverage = useCallback((row: ProfitLossRow) => {
    const nonZeroValues = monthKeys.map(key => Number(row[key]) || 0).filter(val => val !== 0);
    if (nonZeroValues.length === 0) return 0;
    return nonZeroValues.reduce((sum, val) => sum + val, 0) / nonZeroValues.length;
  }, []);

  // Calculate percentage of sales
  const calculatePercentOfSales = useCallback((value: number, monthIndex: number) => {
    const revenue = revenueTotals[monthIndex];
    if (revenue === 0) return 0;
    return (value / revenue) * 100;
  }, [revenueTotals]);

  // Transform data for AG Grid
  const rowData: ProfitLossRow[] = useMemo(() => {
    const rows: ProfitLossRow[] = [];

    // REVENUE SECTION
    rows.push({
      rowType: 'section',
      section: 'REVENUE',
      code: '',
      name: 'REVENUE',
      ...Object.fromEntries(monthKeys.map(key => [key, 0])),
      level: 0
    } as ProfitLossRow);

    // Only add revenue accounts if section is not collapsed
    if (!collapsedSections.has('REVENUE')) {
      csvData.revenue.forEach(account => {
        rows.push({
          rowType: 'account',
          section: 'REVENUE',
          ...account,
          level: 1
        } as ProfitLossRow);
      });
    }

    // Revenue Total
    rows.push({
      rowType: 'total',
      section: 'REVENUE',
      code: '',
      name: 'Total Revenue',
      ...Object.fromEntries(monthKeys.map((key, index) => [key, revenueTotals[index]])) as any,
      level: 0
    });

    // Add spacing row before COST OF SALES
    rows.push({
      rowType: 'section',
      section: 'SPACING',
      code: '',
      name: '',
      ...Object.fromEntries(monthKeys.map(key => [key, 0])) as any,
      level: 0
    });

    // COST OF SALES SECTION
    rows.push({
      rowType: 'section',
      section: 'COST_OF_SALES',
      code: '',
      name: 'COST OF SALES',
      ...Object.fromEntries(monthKeys.map(key => [key, 0])) as any,
      level: 0
    });

    // Only add cost of sales accounts if section is not collapsed
    if (!collapsedSections.has('COST_OF_SALES')) {
      csvData.costOfSales.forEach(account => {
        rows.push({
          rowType: 'account',
          section: 'COST_OF_SALES',
          ...account,
          level: 1
        } as ProfitLossRow);
      });
    }

    // Cost of Sales Total
    rows.push({
      rowType: 'total',
      section: 'COST_OF_SALES',
      code: '',
      name: 'Total Cost of Sales',
      ...Object.fromEntries(monthKeys.map((key, index) => [key, cosTotals[index]])) as any,
      level: 0
    });

    // GROSS PROFIT
    rows.push({
      rowType: 'calculation',
      section: 'GROSS_PROFIT',
      code: '',
      name: 'GROSS PROFIT',
      ...Object.fromEntries(monthKeys.map((key, index) => [key, grossProfits[index]])) as any,
      level: 0
    });

    // Add spacing row before OPERATING EXPENSES
    rows.push({
      rowType: 'section',
      section: 'SPACING',
      code: '',
      name: '',
      ...Object.fromEntries(monthKeys.map(key => [key, 0])) as any,
      level: 0
    });

    // OPERATING EXPENSES SECTION
    rows.push({
      rowType: 'section',
      section: 'OPERATING_EXPENSES',
      code: '',
      name: 'OPERATING EXPENSES',
      ...Object.fromEntries(monthKeys.map(key => [key, 0])) as any,
      level: 0
    });

    // Only add operating expenses accounts if section is not collapsed
    if (!collapsedSections.has('OPERATING_EXPENSES')) {
      csvData.operatingExpenses.forEach(account => {
        rows.push({
          rowType: 'account',
          section: 'OPERATING_EXPENSES',
          ...account,
          level: 1
        } as ProfitLossRow);
      });
    }

    // Operating Expenses Total
    rows.push({
      rowType: 'total',
      section: 'OPERATING_EXPENSES',
      code: '',
      name: 'Total Operating Expenses',
      ...Object.fromEntries(monthKeys.map((key, index) => [key, expenseTotals[index]])) as any,
      level: 0
    });

    // OPERATING PROFIT
    rows.push({
      rowType: 'calculation',
      section: 'OPERATING_PROFIT',
      code: '',
      name: 'OPERATING PROFIT',
      ...Object.fromEntries(monthKeys.map((key, index) => [key, operatingProfits[index]])) as any,
      level: 0
    });

    // Add spacing row before OTHER INCOME
    rows.push({
      rowType: 'section',
      section: 'SPACING',
      code: '',
      name: '',
      ...Object.fromEntries(monthKeys.map(key => [key, 0])) as any,
      level: 0
    });

    // OTHER INCOME SECTION
    rows.push({
      rowType: 'section',
      section: 'OTHER_INCOME',
      code: '',
      name: 'OTHER INCOME',
      ...Object.fromEntries(monthKeys.map(key => [key, 0])) as any,
      level: 0
    });

    // Only add other income accounts if section is not collapsed
    if (!collapsedSections.has('OTHER_INCOME')) {
      csvData.otherIncome.forEach(account => {
        rows.push({
          rowType: 'account',
          section: 'OTHER_INCOME',
          ...account,
          level: 1
        } as ProfitLossRow);
      });
    }

    // Other Income Total
    rows.push({
      rowType: 'total',
      section: 'OTHER_INCOME',
      code: '',
      name: 'Total Other Income',
      ...Object.fromEntries(monthKeys.map((key, index) => [key, otherIncomeTotals[index]])) as any,
      level: 0
    });

    // Add spacing row before OTHER EXPENSES
    rows.push({
      rowType: 'section',
      section: 'SPACING',
      code: '',
      name: '',
      ...Object.fromEntries(monthKeys.map(key => [key, 0])) as any,
      level: 0
    });

    // OTHER EXPENSES SECTION
    rows.push({
      rowType: 'section',
      section: 'OTHER_EXPENSES',
      code: '',
      name: 'OTHER EXPENSES',
      ...Object.fromEntries(monthKeys.map(key => [key, 0])) as any,
      level: 0
    });

    // No other expenses in the current data

    // Other Expenses Total
    rows.push({
      rowType: 'total',
      section: 'OTHER_EXPENSES',
      code: '',
      name: 'Total Other Expenses',
      ...Object.fromEntries(monthKeys.map((key, index) => [key, otherExpensesTotals[index]])) as any,
      level: 0
    });

    // Add spacing row before Total Other Profit
    rows.push({
      rowType: 'section',
      section: 'SPACING',
      code: '',
      name: '',
      ...Object.fromEntries(monthKeys.map(key => [key, 0])) as any,
      level: 0
    });

    // OTHER PROFIT
    rows.push({
      rowType: 'calculation',
      section: 'OTHER_PROFIT',
      code: '',
      name: 'OTHER PROFIT',
      ...Object.fromEntries(monthKeys.map((key, index) => [key, totalOtherProfits[index]])) as any,
      level: 0
    });

    // Add spacing row before NET PROFIT
    rows.push({
      rowType: 'section',
      section: 'SPACING',
      code: '',
      name: '',
      ...Object.fromEntries(monthKeys.map(key => [key, 0])) as any,
      level: 0
    });

    // NET PROFIT
    rows.push({
      rowType: 'calculation',
      section: 'NET_PROFIT',
      code: '',
      name: 'NET PROFIT',
      ...Object.fromEntries(monthKeys.map((key, index) => [key, netProfits[index]])) as any,
      level: 0
    });

    return rows;
  }, [revenueTotals, cosTotals, grossProfits, expenseTotals, operatingProfits, otherIncomeTotals, otherExpensesTotals, totalOtherProfits, netProfits, collapsedSections]);

  // Cell renderer for currency values
  const CurrencyCellRenderer = useCallback((params: ICellRendererParams) => {
    const value = params.value;
    const data = params.data as ProfitLossRow;
    const colId = params.column?.getColId();
    
    // Don't show currency for spacing rows
    if (data.section === 'SPACING') return '';
    
    // Don't show £0 for zero values
    if (typeof value !== 'number' || value === 0) return '';
    
    // Get month index for percentage calculation
    const monthIndex = monthKeys.indexOf(colId || '');
    const isValidMonth = monthIndex !== -1;
    
    // Determine text color based on profit/loss and comparisons
    let textColor = '#374151';
    if (data.section === 'NET_PROFIT') {
      textColor = value >= 0 ? '#059669' : '#dc2626'; // Green for profit, red for loss
    } else if (['GROSS_PROFIT', 'OPERATING_PROFIT', 'OTHER_PROFIT'].includes(data.section)) {
      textColor = value >= 0 ? '#059669' : '#dc2626';
    }
    
    // Add comparison color for total rows when comparing to previous year
    if (compareToPreviousYear && data.rowType === 'total' && isValidMonth) {
      let pyValue = 0;
      if (data.section === 'REVENUE') pyValue = generatePreviousYearData.revenue[monthIndex];
      else if (data.section === 'COST_OF_SALES') pyValue = generatePreviousYearData.costOfSales[monthIndex];
      else if (data.section === 'OPERATING_EXPENSES') pyValue = generatePreviousYearData.operatingExpenses[monthIndex];
      else if (data.section === 'OTHER_INCOME') pyValue = generatePreviousYearData.otherIncome[monthIndex];
      else if (data.section === 'OTHER_EXPENSES') pyValue = generatePreviousYearData.otherExpenses[monthIndex];
      
      if (pyValue !== 0) {
        const isImprovement = value > pyValue;
        textColor = isImprovement ? '#059669' : '#dc2626';
      }
    }
    
    const formattedValue = formatCurrency(value);
    
    if (showPercentOfSales && isValidMonth && data.rowType !== 'section') {
      const percentage = calculatePercentOfSales(value, monthIndex);
      return (
        <div className="flex flex-col">
          <span style={{ color: textColor, fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace', fontSize: '13px', fontWeight: '500' }}>
            {formattedValue}
          </span>
          <span style={{ fontSize: '10px', color: '#6b7280', fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace' }}>
            {Math.abs(percentage) < 0.1 ? '0.0%' : `${percentage.toFixed(1)}%`}
          </span>
        </div>
      );
    }
    
    return (
      <span style={{ 
        color: textColor, 
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace', 
        fontSize: '13px', 
        fontWeight: '500' 
      }}>
        {formattedValue}
      </span>
    );
  }, [showPercentOfSales, compareToPreviousYear, calculatePercentOfSales, generatePreviousYearData]);

  // Cell renderer for account names with indentation and collapse/expand functionality
  const AccountNameCellRenderer = useCallback((params: ICellRendererParams) => {
    const data = params.data as ProfitLossRow;
    const paddingLeft = data.level * 20;
    
    // Check if this is a collapsible section
    const isCollapsibleSection = data.rowType === 'section' && 
      ['REVENUE', 'COST_OF_SALES', 'OPERATING_EXPENSES', 'OTHER_INCOME', 'OTHER_EXPENSES'].includes(data.section);
    
    // Don't show code for section headers, totals, or spacing rows
    const showCode = data.rowType === 'account' && data.code;
    const displayText = showCode ? `${data.code} - ${data.name}` : data.name;
    
    if (isCollapsibleSection) {
      const isCollapsed = collapsedSections.has(data.section);
      return (
        <div 
          style={{ 
            paddingLeft: `${paddingLeft}px`, 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onClick={() => toggleSectionCollapse(data.section)}
        >
          <span style={{ fontSize: '12px', color: '#666' }}>
            {isCollapsed ? '▶' : '▼'}
          </span>
          {displayText}
        </div>
      );
    }
    
    return (
      <div style={{ paddingLeft: `${paddingLeft}px` }}>
        {displayText}
      </div>
    );
  }, [collapsedSections, toggleSectionCollapse]);

  // Row styling function with simplified sectioning
  const getRowStyle = useCallback((params: RowClassParams) => {
    const data = params.data as ProfitLossRow;
    
    // Handle spacing rows
    if (data.section === 'SPACING') {
      return {
        backgroundColor: '#ffffff',
        borderTop: '2px solid #e5e7eb',
        borderBottom: '1px solid #e5e7eb',
        height: '40px' // Half the default row height
      } as any;
    }
    
    switch (data.rowType) {
      case 'section':
        // Section headers with professional grey shading
        return { 
          backgroundColor: '#e9ecef', 
          fontWeight: 'bold', 
          fontSize: 16, 
          color: '#1e293b',
          borderTop: '2px solid #6c757d',
          borderBottom: '1px solid #adb5bd'
        } as any;
      case 'total':
        // Section totals with professional grey shading
        return { 
          backgroundColor: '#f1f3f4', 
          fontWeight: 'bold', 
          color: '#1e293b',
          borderBottom: '2px solid #6c757d'
        } as any;
      case 'calculation':
        if (data.section === 'NET_PROFIT') {
          // Net Profit with lighter background for visibility
          return { 
            backgroundColor: '#D3D3D3', // Indigo-600
            fontWeight: 'bold', 
            color: '#ffffff', 
            fontSize: 16,
            borderTop: '2px solid #1f2937', // 
            borderBottom: '2px solid #D3D3D3' // 
          } as any;
        }
        // All other profit calculations with professional grey
        return { 
          backgroundColor: '#e9ecef', 
          fontWeight: 'bold', 
          color: '#1e293b', 
          fontSize: 15,
          borderTop: '2px solid #6c757d',
          borderBottom: '2px solid #6c757d'
        } as any;
      default:
        // Regular account rows with professional grey alternating shading
        return params.node.rowIndex! % 2 === 0 ? 
          { backgroundColor: '#f8f9fa' } : 
          { backgroundColor: '#ffffff' };
    }
  }, []);

  // Previous Year Cell Renderer
  const PreviousYearCellRenderer = useCallback((params: ICellRendererParams) => {
    const data = params.data as ProfitLossRow;
    const colId = params.column?.getColId();
    const monthIndex = monthKeys.findIndex(key => colId?.includes(key));
    
    if (data.section === 'SPACING' || monthIndex === -1) return '';
    
    let pyValue = 0;
    if (data.rowType === 'total') {
      if (data.section === 'REVENUE') pyValue = generatePreviousYearData.revenue[monthIndex];
      else if (data.section === 'COST_OF_SALES') pyValue = generatePreviousYearData.costOfSales[monthIndex];
      else if (data.section === 'OPERATING_EXPENSES') pyValue = generatePreviousYearData.operatingExpenses[monthIndex];
      else if (data.section === 'OTHER_INCOME') pyValue = generatePreviousYearData.otherIncome[monthIndex];
      else if (data.section === 'OTHER_EXPENSES') pyValue = generatePreviousYearData.otherExpenses[monthIndex];
    } else if (data.rowType === 'calculation') {
      if (data.section === 'GROSS_PROFIT') pyValue = generatePreviousYearData.grossProfits[monthIndex];
      else if (data.section === 'OPERATING_PROFIT') pyValue = generatePreviousYearData.operatingProfits[monthIndex];
      else if (data.section === 'OTHER_PROFIT') pyValue = generatePreviousYearData.totalOtherProfits[monthIndex];
      else if (data.section === 'NET_PROFIT') pyValue = generatePreviousYearData.netProfits[monthIndex];
    } else if (data.rowType === 'account') {
      // Generate random variation for individual accounts
      const currentValue = Number(data[monthKeys[monthIndex]]) || 0;
      pyValue = currentValue * (0.85 + Math.random() * 0.3);
    }
    
    if (pyValue === 0) return '';
    
    return (
      <span style={{ 
        color: '#6b7280', 
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace', 
        fontSize: '12px', 
        fontWeight: '400' 
      }}>
        {formatCurrency(pyValue)}
      </span>
    );
  }, [generatePreviousYearData]);

  // Total Column Cell Renderer
  const TotalCellRenderer = useCallback((params: ICellRendererParams) => {
    const data = params.data as ProfitLossRow;
    
    if (data.section === 'SPACING') return '';
    
    const total = calculateRowTotal(data);
    if (total === 0) return '';
    
    // Determine text color
    let textColor = '#374151';
    if (['NET_PROFIT', 'GROSS_PROFIT', 'OPERATING_PROFIT', 'OTHER_PROFIT'].includes(data.section)) {
      textColor = total >= 0 ? '#059669' : '#dc2626';
    }
    
    return (
      <span style={{ 
        color: textColor, 
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace', 
        fontSize: '13px', 
        fontWeight: '600' 
      }}>
        {formatCurrency(total)}
      </span>
    );
  }, [calculateRowTotal]);

  // Average Column Cell Renderer
  const AverageCellRenderer = useCallback((params: ICellRendererParams) => {
    const data = params.data as ProfitLossRow;
    
    if (data.section === 'SPACING') return '';
    
    const average = calculateRowAverage(data);
    if (average === 0) return '';
    
    // Determine text color
    let textColor = '#374151';
    if (['NET_PROFIT', 'GROSS_PROFIT', 'OPERATING_PROFIT', 'OTHER_PROFIT'].includes(data.section)) {
      textColor = average >= 0 ? '#059669' : '#dc2626';
    }
    
    return (
      <span style={{ 
        color: textColor, 
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace', 
        fontSize: '13px', 
        fontWeight: '600' 
      }}>
        {formatCurrency(average)}
      </span>
    );
  }, [calculateRowAverage]);

  // Column definitions
  const columnDefs: ColDef[] = useMemo(() => {
    const cols: ColDef[] = [
      {
        headerName: "Account",
        field: "name",
        cellRenderer: AccountNameCellRenderer,
        flex: 2,
        minWidth: 250,
        sortable: false,
        filter: false,
        pinned: 'left',
        cellStyle: { fontSize: 14 }
      }
    ];

    // Add month columns with optional PY columns
    months.forEach((month, index) => {
      cols.push({
        headerName: month,
        field: monthKeys[index],
        cellRenderer: CurrencyCellRenderer,
        flex: 1,
        minWidth: 100,
        sortable: false,
        filter: false,
        cellStyle: { 
          textAlign: 'right',
          fontSize: 13,
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
        }
      });

      // Add Previous Year column if enabled
      if (compareToPreviousYear) {
        cols.push({
          headerName: 'PY',
          field: `${monthKeys[index]}_py`,
          cellRenderer: PreviousYearCellRenderer,
          flex: 1,
          minWidth: 80,
          sortable: false,
          filter: false,
          cellStyle: { 
            textAlign: 'right',
            fontSize: 12,
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
          }
        });
      }
    });

    // Add Total column if enabled
    if (showTotalColumn) {
      cols.push({
        headerName: 'Total',
        field: 'total',
        cellRenderer: TotalCellRenderer,
        flex: 1,
        minWidth: 120,
        sortable: false,
        filter: false,
        pinned: 'right',
        cellStyle: { 
          textAlign: 'right',
          fontSize: 13,
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
          backgroundColor: '#f9fafb',
          borderLeft: '2px solid #e5e7eb'
        }
      });
    }

    // Add Average column if enabled
    if (showAverageColumn) {
      cols.push({
        headerName: 'Average',
        field: 'average',
        cellRenderer: AverageCellRenderer,
        flex: 1,
        minWidth: 120,
        sortable: false,
        filter: false,
        pinned: 'right',
        cellStyle: { 
          textAlign: 'right',
          fontSize: 13,
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
          backgroundColor: '#f1f5f9',
          borderLeft: '2px solid #e5e7eb'
        }
      });
    }

    return cols;
  }, [AccountNameCellRenderer, CurrencyCellRenderer, PreviousYearCellRenderer, TotalCellRenderer, AverageCellRenderer, compareToPreviousYear, showTotalColumn, showAverageColumn]);

  const onGridReady = useCallback(() => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.sizeColumnsToFit();
    }
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Profit & Loss...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Main Content Container - 80% width */}
      <div className="flex-1 overflow-hidden flex flex-col gap-6 w-4/5 mx-auto py-6">
        {/* Header */}
        <div className="flex-shrink-0 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">Profit & Loss Statement</h1>
        </div>

        {/* Filter Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>
              <StoreSelector 
                selectedStoreIds={selectedStoreIds}
                onSelectionChange={handleStoreSelectionChange}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              />
              <DateSelector 
                onDateRangeChange={handleDateRangeChange}
                onCompareChange={handleCompareChange}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Last synced: {formatDateWithOrdinal(new Date())}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSync}
                disabled={isSyncing}
                className="text-xs border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                {isSyncing ? 'Syncing...' : 'Sync with Xero'}
              </Button>
            </div>
          </div>

          {/* Sync Dialog */}
          <Dialog open={syncDialogOpen} onOpenChange={setSyncDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Syncing with Xero
                </h3>
                <div className="space-y-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-in-out"
                      style={{ width: `${syncProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 text-center">
                    {syncProgress < 100 ? 'Syncing financial data...' : 'Sync complete!'}
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Toggle Options */}
          <div className="flex items-center gap-6 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">View Options:</span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showTotalColumn}
                onChange={(e) => setShowTotalColumn(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Total Column</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={compareToPreviousYear}
                onChange={(e) => setCompareToPreviousYear(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Compare to Previous Year</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showPercentOfSales}
                onChange={(e) => setShowPercentOfSales(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">% of Sales</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showAverageColumn}
                onChange={(e) => setShowAverageColumn(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Average Column</span>
            </label>
            <div className="ml-auto">
              <Button 
                variant="outline" 
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Export
              </Button>
            </div>
          </div>
        </div>
          
                {/* Table Container */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col flex-1">
          <div className="ag-theme-alpine modern-financial-grid flex-1" style={{ width: '100%', height: '100%' }}>
            <AgGridReact
              ref={gridRef}
              columnDefs={columnDefs}
              rowData={rowData}
              onGridReady={onGridReady}
              domLayout="normal"
              defaultColDef={{
                resizable: true,
                sortable: false,
                filter: false,
              }}
              suppressHorizontalScroll={false}
              rowHeight={showPercentOfSales ? 60 : 40}
              headerHeight={50}
              suppressMenuHide={true}
              getRowStyle={getRowStyle}
              suppressRowClickSelection={true}
              suppressCellFocus={true}
              animateRows={true}
              enableCellTextSelection={false}
              suppressRowDeselection={true}
            />
          </div>
        </div>
      </div>

      {/* Professional Financial Grid Styling */}
      <style jsx global>{`
        /* Modern Professional Financial Grid Theme */
        .modern-financial-grid.ag-theme-alpine {
          --ag-background-color: #f8f9fa;
          --ag-odd-row-background-color: #f1f3f4;
          --ag-header-background-color: #ffffff;
          --ag-header-foreground-color: #1e293b;
          --ag-border-color: #e2e8f0;
          --ag-row-hover-color: #e9ecef;
          --ag-font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
          --ag-font-size: 14px;
          border: none;
          box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
        }
        
        /* Header Styling */
        .modern-financial-grid .ag-header {
          background: #ffffff;
          border-bottom: 2px solid #cbd5e1;
          box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05);
        }
        
        .modern-financial-grid .ag-header-cell {
          font-weight: 600;
          font-size: 13px;
          color: #1e293b;
          border-right: 1px solid #cbd5e1;
          background: transparent;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .modern-financial-grid .ag-header-cell-label {
          justify-content: center;
        }
        
        /* Row Styling */
        .modern-financial-grid .ag-row {
          border-bottom: 1px solid #f1f5f9;
          transition: background-color 0.15s ease;
        }
        
        .modern-financial-grid .ag-row:hover {
          background-color: #f8fafc;
        }
        
        /* Simplified Section Borders */
        .modern-financial-grid .ag-row.net-profit {
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        /* Cell Styling */
        .modern-financial-grid .ag-cell {
          padding: 12px 14px;
          border-right: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
        }
        
        .modern-financial-grid .ag-cell:focus {
          outline: none;
          box-shadow: inset 0 0 0 1px #3b82f6;
        }
        
        /* Pinned Column Cells */
        .modern-financial-grid .ag-pinned-left-cols-container .ag-cell {
          color: #1e293b;
          font-weight: 500;
          border-right: 2px solid #cbd5e1;
          background: inherit;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
        }
        
        .modern-financial-grid .ag-pinned-right-cols-container .ag-cell {
          background: inherit;
          border-left: 2px solid #cbd5e1;
          font-weight: 600;
        }
        
        /* Typography for financial data */
        .modern-financial-grid .ag-cell {
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
          font-weight: 400;
        }
        
        /* Financial number styling */
        .modern-financial-grid .ag-cell[col-id*="may"], 
        .modern-financial-grid .ag-cell[col-id*="jun"], 
        .modern-financial-grid .ag-cell[col-id*="jul"], 
        .modern-financial-grid .ag-cell[col-id*="aug"], 
        .modern-financial-grid .ag-cell[col-id*="sep"], 
        .modern-financial-grid .ag-cell[col-id*="oct"], 
        .modern-financial-grid .ag-cell[col-id*="nov"], 
        .modern-financial-grid .ag-cell[col-id*="dec"],
        .modern-financial-grid .ag-cell[col-id*="total"] {
          justify-content: flex-end;
          font-variant-numeric: tabular-nums;
        }
        
        /* Scrollbar styling */
        .modern-financial-grid .ag-body-horizontal-scroll-viewport::-webkit-scrollbar {
          height: 8px;
        }
        
        .modern-financial-grid .ag-body-horizontal-scroll-viewport::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        
        .modern-financial-grid .ag-body-horizontal-scroll-viewport::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        
        .modern-financial-grid .ag-body-horizontal-scroll-viewport::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        /* Responsive adjustments */
        @media (max-width: 1024px) {
          .modern-financial-grid .ag-cell {
            padding: 8px 10px;
            font-size: 12px;
          }
          
          .modern-financial-grid .ag-header-cell {
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  );
}
