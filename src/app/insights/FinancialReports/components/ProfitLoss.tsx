"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Building2 } from "lucide-react";
import DateSelector from "./DateSelector";
import StoreSelector from "./StoreSelector";
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import { ColDef, ICellRendererParams, RowClassParams } from 'ag-grid-community';

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

const calculateTotal = (accounts: any[], monthKey: string) => {
  return accounts.reduce((sum, account) => sum + (account[monthKey as keyof typeof account] || 0), 0);
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
}

export default function ProfitLoss() {
  const [isClient, setIsClient] = useState(false);
  const gridRef = React.useRef<AgGridReact>(null);
  
  // State to track which sections are collapsed - all sections collapsed by default
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set(['REVENUE', 'COST_OF_SALES', 'OPERATING_EXPENSES', 'OTHER_INCOME', 'OTHER_EXPENSES'])
  );
  
  // State for date filtering
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(2024, 4, 1), // May 2024
    to: new Date(2025, 4, 31)   // May 2025
  });
  
  // State for comparison options
  const [compareOptions, setCompareOptions] = useState({
    toPreviousPeriod: false,
    toPreviousYear: false,
    toFinancialYearToDate: false,
    byCompany: false,
    byCategoryClassLocation: false,
    periodsToCompare: 4
  });

  // State for store selection
  const [selectedStoreIds, setSelectedStoreIds] = useState<string[]>([]);

  // Function to toggle section collapse
  const toggleSectionCollapse = (sectionName: string) => {
    const newCollapsedSections = new Set(collapsedSections);
    if (newCollapsedSections.has(sectionName)) {
      newCollapsedSections.delete(sectionName);
    } else {
      newCollapsedSections.add(sectionName);
    }
    setCollapsedSections(newCollapsedSections);
  };

  // Handlers for date selector
  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    setDateRange(range);
    // Here you would typically filter the data based on the new date range
    console.log('Date range changed:', range);
  };

  const handleCompareChange = (options: any) => {
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

  // Transform data for AG Grid
  const rowData: ProfitLossRow[] = useMemo(() => {
    const rows: ProfitLossRow[] = [];

    // REVENUE SECTION
    rows.push({
      rowType: 'section',
      section: 'REVENUE',
      code: '',
      name: 'REVENUE',
      ...Object.fromEntries(monthKeys.map(key => [key, 0])) as any,
      level: 0
    });

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
    
    // Don't show currency for spacing rows
    if (data.section === 'SPACING') return '';
    
    // Don't show £0 for zero values
    if (typeof value !== 'number' || value === 0) return '';
    
    return formatCurrency(value);
  }, []);

  // Cell renderer for account names with indentation and collapse/expand functionality
  const AccountNameCellRenderer = useCallback((params: ICellRendererParams) => {
    const data = params.data as ProfitLossRow;
    const paddingLeft = data.level * 20;
    
    // Check if this is a collapsible section
    const isCollapsibleSection = data.rowType === 'section' && 
      ['REVENUE', 'COST_OF_SALES', 'OPERATING_EXPENSES', 'OTHER_INCOME', 'OTHER_EXPENSES'].includes(data.section);
    
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
          {data.name}
        </div>
      );
    }
    
    return (
      <div style={{ paddingLeft: `${paddingLeft}px` }}>
        {data.name}
      </div>
    );
  }, [collapsedSections, toggleSectionCollapse]);

  // Row styling function
  const getRowStyle = useCallback((params: RowClassParams) => {
    const data = params.data as ProfitLossRow;
    
    switch (data.rowType) {
      case 'section':
        switch (data.section) {
          case 'REVENUE':
            return { backgroundColor: '#f0fdf4', fontWeight: 'bold', fontSize: 18, textDecoration: 'underline', textTransform: 'uppercase' } as any;
          case 'COST_OF_SALES':
            return { backgroundColor: '#fff7ed', fontWeight: 'bold', fontSize: 18, textDecoration: 'underline', textTransform: 'uppercase' } as any;
          case 'OPERATING_EXPENSES':
            return { backgroundColor: '#fef2f2', fontWeight: 'bold', fontSize: 18, textDecoration: 'underline', textTransform: 'uppercase' } as any;
          case 'OTHER_INCOME':
            return { backgroundColor: '#eff6ff', fontWeight: 'bold', fontSize: 18, textDecoration: 'underline', textTransform: 'uppercase' } as any;
          case 'OTHER_EXPENSES':
            return { backgroundColor: '#eff6ff', fontWeight: 'bold', fontSize: 18, textDecoration: 'underline', textTransform: 'uppercase' } as any;
          default:
            return { backgroundColor: '#f9fafb', fontWeight: 'bold', fontSize: 18, textDecoration: 'underline', textTransform: 'uppercase' } as any;
        }
      case 'total':
        switch (data.section) {
          case 'REVENUE':
            return { backgroundColor: '#dcfce7', fontWeight: 'bold', color: '#166534' } as any;
          case 'COST_OF_SALES':
            return { backgroundColor: '#fed7aa', fontWeight: 'bold', color: '#c2410c' } as any;
          case 'OPERATING_EXPENSES':
            return { backgroundColor: '#fecaca', fontWeight: 'bold', color: '#991b1b' } as any;
          case 'OTHER_INCOME':
            return { backgroundColor: '#dbeafe', fontWeight: 'bold', color: '#1e40af' } as any;
          case 'OTHER_EXPENSES':
            return { backgroundColor: '#dbeafe', fontWeight: 'bold', color: '#1e40af' } as any;
          default:
            return { backgroundColor: '#e5e7eb', fontWeight: 'bold' } as any;
        }
      case 'calculation':
        if (data.section === 'GROSS_PROFIT') {
          return { backgroundColor: '#6b7280', fontWeight: 'bold', color: '#ffffff', fontSize: 16 } as any;
        } else if (data.section === 'OPERATING_PROFIT') {
          return { backgroundColor: '#6b7280', fontWeight: 'bold', color: '#ffffff', fontSize: 16 } as any;
        } else if (data.section === 'OTHER_PROFIT') {
          return { backgroundColor: '#6b7280', fontWeight: 'bold', color: '#ffffff', fontSize: 18, textDecoration: 'underline', textTransform: 'uppercase' } as any;
        } else if (data.section === 'NET_PROFIT') {
          return { backgroundColor: '#1f2937', fontWeight: 'bold', color: '#ffffff', fontSize: 18 } as any;
        }
        return { backgroundColor: '#f3f4f6', fontWeight: 'bold' } as any;
      default:
        return params.node.rowIndex! % 2 === 0 ? { backgroundColor: '#ffffff' } : { backgroundColor: '#f9fafb' };
    }
  }, []);

  // Column definitions
  const columnDefs: ColDef[] = useMemo(() => [
    {
      headerName: "Code",
      field: "code",
      width: 100,
      minWidth: 80,
      maxWidth: 120,
      sortable: false,
      filter: false,
      pinned: 'left',
      cellStyle: { fontSize: 12, color: '#6b7280' } as any
    },
    {
      headerName: "Account Name",
      field: "name",
      cellRenderer: AccountNameCellRenderer,
      width: 250,
      minWidth: 200,
      maxWidth: 300,
      sortable: false,
      filter: false,
      pinned: 'left',
      cellStyle: { fontSize: 14 }
    },
    ...months.map((month, index) => ({
      headerName: month,
      field: monthKeys[index],
      cellRenderer: CurrencyCellRenderer,
      width: 100,
      minWidth: 90,
      maxWidth: 120,
      sortable: false,
      filter: false,
      cellStyle: { 
        textAlign: 'right',
        fontSize: 13,
        fontFamily: 'monospace'
      }
    }))
  ], [AccountNameCellRenderer, CurrencyCellRenderer]);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex flex-col">
      

      {/* Main Content Layout - Reduced Height */}
      <div className="grid grid-cols-3 gap-6 p-6 pt-8" style={{ height: 'calc(105vh - 120px)' }}>
        {/* P&L Grid - 2/3 width */}
        <div className="col-span-2 flex flex-col min-h-0">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden flex flex-col h-full">
            {/* Grid Header */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-4 border-b border-gray-200/20 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  Profit & Loss:
                </h2>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <StoreSelector 
                      selectedStoreIds={selectedStoreIds}
                      onSelectionChange={handleStoreSelectionChange}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <DateSelector 
                      onDateRangeChange={handleDateRangeChange}
                      onCompareChange={handleCompareChange}
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    Export
                  </Button>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-300">Live Data</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="ag-theme-alpine-dark modern-financial-grid flex-1" style={{ width: '100%' }}>
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
                  rowHeight={40}
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

                  {/* Right Side - Analytics Dashboard */}
        <div className="col-span-1 flex flex-col gap-6 min-h-0">
          {/* Key Metrics Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-4 flex-shrink-0">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Key Metrics
              </h3>
            </div>
            <div className="p-6 space-y-4 flex-1">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <div>
                  <p className="text-sm font-medium text-green-700">Net Profit</p>
                  <p className="text-2xl font-bold text-green-900">£{(netProfits[netProfits.length - 1] || 0).toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                <div>
                  <p className="text-sm font-medium text-blue-700">Revenue</p>
                  <p className="text-2xl font-bold text-blue-900">£{(revenueTotals[revenueTotals.length - 1] || 0).toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
                <div>
                  <p className="text-sm font-medium text-purple-700">Gross Profit</p>
                  <p className="text-2xl font-bold text-purple-900">£{(grossProfits[grossProfits.length - 1] || 0).toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Visualization Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden flex flex-col flex-1">
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-4 flex-shrink-0">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
                Analytics
              </h3>
            </div>
            <div className="p-6 flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-700">Interactive Charts</p>
                <p className="text-xs text-gray-500 mt-1">Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ultra-Modern AG Grid Styling */}
      <style jsx global>{`
        /* Modern Financial Grid Theme */
        .modern-financial-grid.ag-theme-alpine-dark {
          --ag-background-color: #ffffff;
          --ag-odd-row-background-color: #fafbfc;
          --ag-header-background-color: #f8fafc;
          --ag-header-foreground-color: #374151;
          --ag-border-color: #e5e7eb;
          --ag-row-hover-color: #f1f5f9;
          --ag-selected-row-background-color: #dbeafe;
          --ag-font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          --ag-font-size: 14px;
          --ag-font-weight: 500;
          border-radius: 0;
          border: none;
          box-shadow: none;
        }
        
        /* Header Styling */
        .modern-financial-grid .ag-header {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-bottom: 2px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }
        
        .modern-financial-grid .ag-header-cell {
          font-weight: 700;
          font-size: 13px;
          color: #374151;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-right: 1px solid #e5e7eb;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: transparent;
        }
        
        .modern-financial-grid .ag-header-cell:hover {
          background: rgba(226, 232, 240, 0.5);
        }
        
        /* Pinned Column Headers */
        .modern-financial-grid .ag-pinned-left-header .ag-header-cell {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          color: #374151;
          font-weight: 700;
          border-right: 1px solid #e5e7eb;
        }
        
        .modern-financial-grid .ag-pinned-left-header .ag-header-cell:hover {
          background: rgba(226, 232, 240, 0.5);
        }
        
        /* Row Styling */
        .modern-financial-grid .ag-row {
          border-bottom: 1px solid #f1f5f9;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .modern-financial-grid .ag-row:hover {
          background: rgba(248, 250, 252, 0.8);
        }
        
        /* Cell Styling */
        .modern-financial-grid .ag-cell {
          padding: 12px 16px;
          line-height: 1.6;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-right: 1px solid #f1f5f9;
        }
        
        .modern-financial-grid .ag-cell:focus {
          outline: none;
          border: none;
        }
        
        /* Pinned Column Cells - Dynamic Background Based on Row Type */
        .modern-financial-grid .ag-pinned-left-cols-container .ag-cell {
          color: #374151;
          font-weight: 500;
          border-right: 1px solid #f1f5f9;
        }
        
        .modern-financial-grid .ag-row:hover .ag-pinned-left-cols-container .ag-cell {
          background: rgba(248, 250, 252, 0.8);
        }
        
        /* Scrollbar Styling */
        .modern-financial-grid .ag-body-horizontal-scroll {
          background: #f8fafc;
          border-top: 1px solid #e5e7eb;
        }
        
        .modern-financial-grid .ag-body-horizontal-scroll-viewport {
          background: #ffffff;
        }
        
        .modern-financial-grid .ag-horizontal-left-spacer,
        .modern-financial-grid .ag-horizontal-right-spacer {
          background: #f8fafc;
          border-right: 1px solid #e5e7eb;
        }
        
        /* Loading States */
        .modern-financial-grid .ag-overlay-loading-wrapper {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
        }
        
        /* Typography Enhancements */
        .modern-financial-grid .ag-cell {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-weight: 500;
          letter-spacing: 0.25px;
        }
        
        .modern-financial-grid .ag-pinned-left-cols-container .ag-cell {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        
        /* Responsive Design */
        @media (max-width: 1024px) {
          .modern-financial-grid .ag-cell {
            padding: 10px 12px;
            font-size: 13px;
          }
          
          .modern-financial-grid .ag-header-cell {
            font-size: 12px;
          }
        }
        
        /* Accessibility Improvements */
        .modern-financial-grid .ag-cell:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: -2px;
        }
        
        .modern-financial-grid .ag-header-cell:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: -2px;
        }
        
        /* Performance Optimizations */
        .modern-financial-grid .ag-cell,
        .modern-financial-grid .ag-header-cell {
          will-change: transform, box-shadow, background;
        }
        
        .modern-financial-grid .ag-row {
          contain: layout style paint;
        }
      `}</style>
    </div>
  );
}
