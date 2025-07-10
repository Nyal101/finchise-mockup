"use client";

import React, { useState } from "react";
import { CalendarIcon, Search, Clock, BarChart3, Settings } from "lucide-react";
import { format, startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear, startOfQuarter, endOfQuarter, subQuarters, subYears } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface DateRange {
  from: Date;
  to: Date;
}

interface DateSelectorProps {
  onDateRangeChange?: (range: DateRange) => void;
  onCompareChange?: (compareOptions: CompareOptions) => void;
  className?: string;
}

interface CompareOptions {
  toPreviousPeriod: boolean;
  toPreviousYear: boolean;
  toFinancialYearToDate: boolean;
  byCompany: boolean;
  byCategoryClassLocation: boolean;
  periodsToCompare: number;
}

const commonFormats = [
  { label: "Current and previous 3 months", category: "Multi-period" },
  { label: "This month", category: "Current" },
  { label: "This month by company", category: "Current" },
  { label: "This calendar quarter", category: "Current" },
  { label: "This calendar quarter to date", category: "Current" },
  { label: "This calendar year", category: "Current" },
  { label: "This calendar year by month", category: "Current" },
  { label: "This calendar year by company", category: "Current" },
  { label: "This calendar year by quarter", category: "Current" },
  { label: "Calendar quarter to date by month", category: "Multi-period" },
  { label: "Calendar year to last month", category: "Multi-period" },
  { label: "Calendar year to last month by month", category: "Multi-period" }
];

export default function DateSelector({ onDateRangeChange, onCompareChange, className }: DateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'presets' | 'custom' | 'compare'>('presets');
  
  // Time period state
  const [periodStart, setPeriodStart] = useState<Date>(startOfMonth(new Date()));
  const [periodEnd, setPeriodEnd] = useState<Date>(endOfMonth(new Date()));
  const [periodDuration, setPeriodDuration] = useState("1 month");
  
  // Compare options state
  const [compareOptions, setCompareOptions] = useState<CompareOptions>({
    toPreviousPeriod: false,
    toPreviousYear: false,
    toFinancialYearToDate: false,
    byCompany: false,
    byCategoryClassLocation: false,
    periodsToCompare: 4
  });

  const filteredFormats = commonFormats.filter(format =>
    format.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFormatSelect = (format: string) => {
    setSelectedFormat(format);
    
    const now = new Date();
    let from: Date, to: Date;
    
    switch (format) {
      case "Current and previous 3 months":
        from = startOfMonth(subMonths(now, 3));
        to = endOfMonth(now);
        break;
      case "This month":
        from = startOfMonth(now);
        to = endOfMonth(now);
        break;
      case "This calendar quarter":
        from = startOfQuarter(now);
        to = endOfQuarter(now);
        break;
      case "This calendar quarter to date":
        from = startOfQuarter(now);
        to = now;
        break;
      case "This calendar year":
        from = startOfYear(now);
        to = endOfYear(now);
        break;
      case "This calendar year by month":
        from = startOfYear(now);
        to = endOfYear(now);
        break;
      case "Calendar year to last month":
        from = startOfYear(now);
        to = endOfMonth(subMonths(now, 1));
        break;
      default:
        from = startOfMonth(now);
        to = endOfMonth(now);
    }
    
    setPeriodStart(from);
    setPeriodEnd(to);
  };

  const handleCompareOptionChange = (option: keyof CompareOptions, value: boolean | number) => {
    const newOptions = { ...compareOptions, [option]: value };
    setCompareOptions(newOptions);
    onCompareChange?.(newOptions);
  };

  const handleApplyChanges = () => {
    onDateRangeChange?.({ from: periodStart, to: periodEnd });
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const formatDateRange = () => {
    if (selectedFormat) {
      return selectedFormat;
    }
    return `${format(periodStart, "MMM dd, yyyy")} - ${format(periodEnd, "MMM dd, yyyy")}`;
  };

  // Group formats by category
  const groupedFormats = filteredFormats.reduce((acc, format) => {
    if (!acc[format.category]) {
      acc[format.category] = [];
    }
    acc[format.category].push(format);
    return acc;
  }, {} as Record<string, typeof filteredFormats>);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors min-w-[200px] justify-start",
            className
          )}
        >
          <CalendarIcon className="h-4 w-4 mr-2" />
          <span className="truncate">{formatDateRange()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[800px] p-0" align="start">
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Date Range & Comparison Settings</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-slate-300">Live Data</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 bg-gray-50">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('presets')}
                className={cn(
                  "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                  activeTab === 'presets'
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Quick Presets
                </div>
              </button>
              <button
                onClick={() => setActiveTab('custom')}
                className={cn(
                  "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                  activeTab === 'custom'
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Custom Range
                </div>
              </button>
              <button
                onClick={() => setActiveTab('compare')}
                className={cn(
                  "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                  activeTab === 'compare'
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Compare & Analyze
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Quick Presets Tab */}
            {activeTab === 'presets' && (
              <div className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search for a date range preset..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  {Object.entries(groupedFormats).map(([category, formats]) => (
                    <div key={category} className="space-y-3">
                      <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide border-b border-gray-200 pb-2">
                        {category}
                      </h4>
                      <div className="space-y-2">
                        {formats.map((format) => (
                          <button
                            key={format.label}
                            onClick={() => handleFormatSelect(format.label)}
                            className={cn(
                              "w-full text-left px-4 py-3 text-sm rounded-lg border transition-all duration-200 hover:shadow-sm",
                              selectedFormat === format.label
                                ? "bg-blue-50 border-blue-200 text-blue-700 shadow-sm"
                                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                            )}
                          >
                            {format.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Range Tab */}
            {activeTab === 'custom' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CalendarIcon className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-900">Custom Date Range</h4>
                  </div>
                  <p className="text-sm text-blue-700">
                    Select specific start and end dates for your financial report analysis.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-900">
                      Period Start Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal h-12 border-gray-300 hover:border-gray-400"
                        >
                          <CalendarIcon className="mr-3 h-4 w-4 text-gray-500" />
                          <span className="text-gray-900">{format(periodStart, "MMMM dd, yyyy")}</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={periodStart}
                          onSelect={(date) => date && setPeriodStart(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-900">
                      Period End Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal h-12 border-gray-300 hover:border-gray-400"
                        >
                          <CalendarIcon className="mr-3 h-4 w-4 text-gray-500" />
                          <span className="text-gray-900">{format(periodEnd, "MMMM dd, yyyy")}</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={periodEnd}
                          onSelect={(date) => date && setPeriodEnd(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">Period Duration</span>
                    </div>
                    <Select value={periodDuration} onValueChange={setPeriodDuration}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1 month">1 Month</SelectItem>
                        <SelectItem value="3 months">3 Months</SelectItem>
                        <SelectItem value="6 months">6 Months</SelectItem>
                        <SelectItem value="1 year">1 Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Compare & Analyze Tab */}
            {activeTab === 'compare' && (
              <div className="space-y-6">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    <h4 className="font-semibold text-purple-900">Comparison & Analysis Options</h4>
                  </div>
                  <p className="text-sm text-purple-700">
                    Configure how you want to compare your financial data across different periods and dimensions.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h5 className="font-semibold text-gray-900 text-sm uppercase tracking-wide border-b border-gray-200 pb-2">
                      Time Comparisons
                    </h5>
                    
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="toPreviousPeriod"
                          checked={compareOptions.toPreviousPeriod}
                          onCheckedChange={(checked) => 
                            handleCompareOptionChange("toPreviousPeriod", checked as boolean)
                          }
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label htmlFor="toPreviousPeriod" className="text-sm font-medium text-gray-900 cursor-pointer">
                            Compare to Previous Period
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            Show variance against the previous equivalent period
                          </p>
                          {compareOptions.toPreviousPeriod && (
                            <div className="mt-3 flex items-center gap-2">
                              <span className="text-xs text-gray-600">Number of periods:</span>
                              <Select 
                                value={compareOptions.periodsToCompare.toString()} 
                                onValueChange={(value) => handleCompareOptionChange("periodsToCompare", parseInt(value))}
                              >
                                <SelectTrigger className="w-20 h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1</SelectItem>
                                  <SelectItem value="2">2</SelectItem>
                                  <SelectItem value="3">3</SelectItem>
                                  <SelectItem value="4">4</SelectItem>
                                  <SelectItem value="5">5</SelectItem>
                                  <SelectItem value="6">6</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="toPreviousYear"
                          checked={compareOptions.toPreviousYear}
                          onCheckedChange={(checked) => 
                            handleCompareOptionChange("toPreviousYear", checked as boolean)
                          }
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label htmlFor="toPreviousYear" className="text-sm font-medium text-gray-900 cursor-pointer">
                            Compare to Previous Year
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            Show year-over-year performance comparison
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="toFinancialYearToDate"
                          checked={compareOptions.toFinancialYearToDate}
                          onCheckedChange={(checked) => 
                            handleCompareOptionChange("toFinancialYearToDate", checked as boolean)
                          }
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label htmlFor="toFinancialYearToDate" className="text-sm font-medium text-gray-900 cursor-pointer">
                            Compare to Financial Year to Date
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            Compare against cumulative financial year performance
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h5 className="font-semibold text-gray-900 text-sm uppercase tracking-wide border-b border-gray-200 pb-2">
                      Dimensional Analysis
                    </h5>
                    
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="byCompany"
                          checked={compareOptions.byCompany}
                          onCheckedChange={(checked) => 
                            handleCompareOptionChange("byCompany", checked as boolean)
                          }
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label htmlFor="byCompany" className="text-sm font-medium text-gray-900 cursor-pointer">
                            Break Down by Company
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            Show separate columns for each company entity
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="byCategoryClassLocation"
                          checked={compareOptions.byCategoryClassLocation}
                          onCheckedChange={(checked) => 
                            handleCompareOptionChange("byCategoryClassLocation", checked as boolean)
                          }
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <label htmlFor="byCategoryClassLocation" className="text-sm font-medium text-gray-900 cursor-pointer">
                            Break Down by Category/Class/Location
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            Segment data by business categories and locations
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span>Changes will be applied to the current report view</span>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleApplyChanges} 
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                Apply Changes
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
