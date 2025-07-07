"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  ArrowLeft,
  ArrowRight,
  Plus,
  X,
  Save,
  ChevronDown
} from "lucide-react";
import { Command, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { journalEntries } from "../journalData";
import { JournalLineItem, ScheduleType } from "../types";
import { calculateJournal } from "../utils/journalCalculations";

// Map of account codes to descriptive names
const accountDescriptions: Record<string, string> = {
  "1105": "Prepayment General / Business Rates",
  "1400": "Prepayments",
  "6500": "Insurance Expense",
  "7100": "Staff Costs",
  "2200": "Accruals",
  "8100": "Capital Expenditure",
  "7101": "Property - Business Rates",
  // Add more as needed
};



export default function JournalDetailsPage() {
  const params = useParams();
  const router = useRouter();
  // Track which month is currently expanded (only one at a time)
  const [selectedMonth, setSelectedMonth] = React.useState<string | null>(null);
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [journalData, setJournalData] = React.useState(() => {
    const j = journalEntries.find(j => j.id === params.id);
    return j ? { ...j, scheduleType: j.scheduleType || 'monthly & weekly', monthlyBreakdown: j.monthlyBreakdown || [] } : undefined;
  });
  
  // Find the current journal
  const journal = journalData;

  // Calculate monthly breakdown using the new calculation function
  const monthlyBreakdown = React.useMemo(() => {
    if (!journal || !journal.periodStartDate || !journal.periodEndDate || !journal.expensePaidMonth) return [];
    
    const result = calculateJournal({
      description: journal.description,
      totalAmount: journal.totalAmount,
      expensePaidMonth: journal.expensePaidMonth,
      periodStartDate: journal.periodStartDate,
      periodEndDate: journal.periodEndDate,
      scheduleType: journal.scheduleType,
      accountCode: journal.accountCode,
      monthlyAccountCode: journal.monthlyAccountCode,
    });

    if (result.error) {
      // TODO: Show error to user
      console.error(result.error);
      return [];
    }

    return result.monthlyBreakdown;
  }, [journal]);

  // Filter journals for the list
  const filteredJournals = React.useMemo(() => {
    return journalEntries.filter(j => {
      return statusFilter === "all" || j.status === statusFilter;
    });
  }, [statusFilter]);

  // Get current journal index for navigation
  const currentIndex = journalEntries.findIndex(j => j.id === params.id);
  const prevJournal = currentIndex > 0 ? journalEntries[currentIndex - 1] : null;
  const nextJournal = currentIndex < journalEntries.length - 1 ? journalEntries[currentIndex + 1] : null;

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
      case "review": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Toggle selected month (collapse if same month clicked again)
  const toggleMonth = (month: string) => {
    setSelectedMonth((prev) => (prev === month ? null : month));
  };

  // Update a line item field within a specific month
  const updateLineItem = (
    month: string,
    itemId: string,
    field: keyof Omit<JournalLineItem, "id">,
    value: string | number
  ) => {
    setJournalData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        monthlyBreakdown: prev.monthlyBreakdown.map((b) => {
          if (b.month !== month) return b;
          return {
            ...b,
            lineItems: b.lineItems.map((li) =>
              li.id === itemId ? { ...li, [field]: value } : li
            ),
          };
        }),
      };
    });
  };

  // Add a blank line item to a month
  const addLineItem = (month: string) => {
    setJournalData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        monthlyBreakdown: prev.monthlyBreakdown.map((b) => {
          if (b.month !== month) return b;
          return {
            ...b,
            lineItems: [
              ...b.lineItems,
              {
                id: `li_${Date.now()}`,
                accountCode: "",
                description: "",
                debitAmount: 0,
                creditAmount: 0,
                store: "",
                taxRate: "no-tax",
              },
            ],
          };
        }),
      };
    });
  };

  // Combobox for searching account codes
  function AccountCodeCombobox({
    value,
    onChange,
    options,
    className,
  }: {
    value: string;
    onChange: (val: string) => void;
    options: string[];
    className?: string;
  }) {
    const [open, setOpen] = React.useState(false);
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`w-full h-8 justify-between px-2 text-sm font-normal ${className || ''}`}
          >
            {value ? `${value} - ${accountDescriptions[value] ?? ""}` : "Code"}
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full min-w-[12rem] max-w-[24rem] p-0">
          <Command>
            <CommandInput placeholder="Search code..." className="h-8" />
            <CommandGroup>
              {options.map((code) => (
                <CommandItem
                  key={code}
                  value={code}
                  onSelect={() => {
                    onChange(code);
                    setOpen(false);
                  }}
                >
                  {`${code} - ${accountDescriptions[code] ?? ""}`}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }

  if (!journal) {
    return <div>Journal not found</div>;
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Journals</h3>
            <Button variant="ghost" size="sm" onClick={() => router.push("/accounting/Journals")}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Status Filter Tabs */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-md">
            {["all", "draft", "review", "active", "complete"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2 py-1 text-xs rounded transition-colors capitalize ${
                  statusFilter === status
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Journal List */}
        <div className="flex-1 overflow-y-auto">
          {filteredJournals.map((j) => (
            <div
              key={j.id}
              onClick={() => router.push(`/accounting/Journals/${j.id}`)}
              className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                j.id === journal.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-gray-900 truncate">
                    {j.title}
                  </div>
                  <div className="text-xs text-gray-500 truncate mt-1">
                    {j.description}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {format(j.periodStartDate, 'dd MMM yyyy')}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {formatCurrency(j.totalAmount)}
                  </div>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <Badge variant="outline" className={getStatusColor(j.status)}>
                    {j.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between bg-white border-b border-gray-200 px-6 h-16" style={{ marginTop: 0 }}>
          {/* Left: Back to Journals */}
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/accounting/Journals")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>

          {/* Center: Navigation */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => prevJournal && router.push(`/accounting/Journals/${prevJournal.id}`)}
              disabled={!prevJournal}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => nextJournal && router.push(`/accounting/Journals/${nextJournal.id}`)}
              disabled={!nextJournal}
            >
              Forward
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>

          {/* Right: Save Changes */}
          <div>
            <Button 
              onClick={() => {
                // Handle save
                console.log("Saving journal changes");
              }}
              className="bg-gray-900 text-white hover:bg-gray-800"
              size="sm"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <div className="pt-0 px-6 pb-6 space-y-6">
          {/* Journal Summary */}
          <Card className="mt-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Journal Details</h1>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex">
                  <div className="w-[calc(100%/6)]">
                    <label className="text-sm font-medium text-muted-foreground">Journal Type</label>
                    <div className="mt-1">
                      <Badge variant="outline">
                        {journalData?.type === 'accrual' ? 'Accrual' : 'Prepayment'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex-1 pl-2">
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <Input
                      defaultValue={journal.description}
                      className="mt-1"
                      placeholder="Enter journal description"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-6 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Total Amount</label>
                    <Input
                      type="number"
                      value={journalData?.totalAmount ?? ''}
                      onChange={e => {
                        const val = parseFloat(e.target.value || '0');
                        setJournalData(prev => prev ? { ...prev, totalAmount: val } : prev);
                      }}
                      className="mt-1"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Expense Paid Month</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full mt-1 justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {journalData?.expensePaidMonth ? format(journalData.expensePaidMonth, 'MMM yyyy') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={journalData?.expensePaidMonth}
                          defaultMonth={journalData?.expensePaidMonth}
                          onSelect={(date) => {
                            if (date) {
                              const updatedJournal = {
                                ...journalData!,
                                expensePaidMonth: date,
                                monthlyBreakdown: [] // Clear existing breakdown
                              };
                              setJournalData(updatedJournal);
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Recognition Period Start</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full mt-1 justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {journalData?.periodStartDate ? format(journalData.periodStartDate, 'dd MMM yyyy') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={journalData?.periodStartDate}
                          defaultMonth={journalData?.periodStartDate}
                          onSelect={(date) => {
                            if (date) {
                              const updatedJournal = {
                                ...journalData!,
                                periodStartDate: date,
                                monthlyBreakdown: [] // Clear existing breakdown
                              };
                              setJournalData(updatedJournal);
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Recognition Period End</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full mt-1 justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {journalData?.periodEndDate ? format(journalData.periodEndDate, 'dd MMM yyyy') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={journalData?.periodEndDate}
                          defaultMonth={journalData?.periodEndDate}
                          onSelect={(date) => {
                            if (date) {
                              const updatedJournal = {
                                ...journalData!,
                                periodEndDate: date,
                                monthlyBreakdown: [] // Clear existing breakdown
                              };
                              setJournalData(updatedJournal);
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Schedule Type</label>
                    <Select
                      value={journalData?.scheduleType || 'monthly & weekly'}
                      onValueChange={value => setJournalData(prev => prev ? { ...prev, scheduleType: value as ScheduleType } : prev)}
                    >
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Select schedule type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly & weekly">Monthly & Weekly (by days)</SelectItem>
                        <SelectItem value="monthly">Monthly (equal split)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {journal.type === 'prepayment' && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Prepayment Account Code</label>
                        <AccountCodeCombobox
                          value={journal.accountCode}
                          onChange={(val) => setJournalData(prev => ({ ...prev!, accountCode: val }))}
                          options={Object.keys(accountDescriptions)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Monthly Transfer Account Code</label>
                        <AccountCodeCombobox
                          value={journal.monthlyAccountCode}
                          onChange={(val) => setJournalData(prev => ({ ...prev!, monthlyAccountCode: val }))}
                          options={Object.keys(accountDescriptions)}
                          className="mt-1"
                        />
                      </div>
                    </>
                  )}
                  {journal.type === 'accrual' && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Accrual Account Code</label>
                        <AccountCodeCombobox
                          value={journal.accountCode}
                          onChange={(val) => setJournalData(prev => ({ ...prev!, accountCode: val }))}
                          options={Object.keys(accountDescriptions)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Monthly Transfer Account Code</label>
                        <AccountCodeCombobox
                          value={journal.monthlyAccountCode}
                          onChange={(val) => setJournalData(prev => ({ ...prev!, monthlyAccountCode: val }))}
                          options={Object.keys(accountDescriptions)}
                          className="mt-1"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Monthly Breakdown
              </h3>
            </div>
            
            <div className="border rounded-lg p-3 bg-gradient-to-r from-muted/20 to-muted/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Posted</span>
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
                <div className="flex gap-4 pb-4" style={{ minWidth: `${monthlyBreakdown.length * 260}px` }}>
                  {monthlyBreakdown
                    .sort((a, b) => new Date(a.month + '-01').getTime() - new Date(b.month + '-01').getTime())
                    .map((breakdown) => {
                      const monthDate = new Date(breakdown.month + "-01");
                      const isCurrentMonth = format(new Date(), "yyyy-MM") === breakdown.month;

                      return (
                        <div key={breakdown.month} className="w-[260px] space-y-2">
                          <div
                            className={`cursor-pointer p-4 rounded-lg border transition-all duration-200 text-sm ${
                              isCurrentMonth
                                ? 'border-purple-500 bg-purple-50 shadow-lg'
                                : breakdown.status === 'posted'
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 bg-white'
                            }`}
                            onClick={() => toggleMonth(breakdown.month)}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-base">{format(monthDate, "MMM yyyy")}</span>
                              <Badge
                                variant="outline"
                                className={
                                  breakdown.status === 'posted'
                                    ? 'bg-green-100 text-green-800 border-green-200'
                                    : 'bg-gray-100 text-gray-800 border-gray-200'
                                }
                              >
                                {breakdown.status}
                              </Badge>
                            </div>
                            {journal.type === 'prepayment' && (
                              <>
                                <div className="flex justify-between text-muted-foreground">
                                  <span>Prepay Bal</span>
                                  <span className="font-mono">{formatCurrency(breakdown.prepayBalance)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                  <span>Expense Bal</span>
                                  <span className="font-mono">{formatCurrency(breakdown.expenseBalance)}</span>
                                </div>
                              </>
                            )}
                            {journal.type === 'accrual' && (
                              <>
                                <div className="flex justify-between text-muted-foreground">
                                  <span>Accrual Bal</span>
                                  <span className="font-mono">{formatCurrency(breakdown.prepayBalance)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                  <span>Expense Bal</span>
                                  <span className="font-mono">{formatCurrency(breakdown.expenseBalance)}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Full-width line items table for selected month */}
            {selectedMonth && (() => {
              const breakdown = monthlyBreakdown.find(b => b.month === selectedMonth);
              if (!breakdown) return null;

              const accountCodes = Array.from(new Set(monthlyBreakdown.flatMap(b => b.lineItems.map(li => li.accountCode))));
              const stores = [
                "Kings Hill",
                "Tonbridge",
                "London",
                "Manchester",
                "Birmingham",
                "Leeds",
                "Liverpool",
              ];

              const taxRateOptions = [
                "20% (VAT on Income)",
                "20% (VAT on Expenses)",
                "No Tax",
                "5% (VAT on Expenses)",
                "5% (VAT on Income)",
                "Zero Rated Expenses",
                "Zero Rated Income",
              ];

              // Calculate subtotals and totals
              const totals = breakdown.lineItems.reduce(
                (acc, li) => {
                  const isTax = li.taxRate && li.taxRate !== "No Tax";
                  acc.totalDebit += li.debitAmount;
                  acc.totalCredit += li.creditAmount;
                  if (isTax) {
                    acc.taxDebit += li.debitAmount;
                    acc.taxCredit += li.creditAmount;
                  } else {
                    acc.noTaxDebit += li.debitAmount;
                    acc.noTaxCredit += li.creditAmount;
                  }
                  return acc;
                },
                { noTaxDebit: 0, noTaxCredit: 0, taxDebit: 0, taxCredit: 0, totalDebit: 0, totalCredit: 0 }
              );

              const imbalanced = totals.totalDebit !== totals.totalCredit;

              const isEditable = breakdown.status === "scheduled";

              return (
                <Card className="mt-4">
                  <CardHeader className="py-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Line Items – {format(new Date(selectedMonth + "-01"), "MMM yyyy")} ({breakdown.status})</h3>
                      {isEditable && (
                        <Button variant="outline" size="sm" onClick={() => addLineItem(selectedMonth)}>
                          <Plus className="h-3 w-3 mr-1" />
                          Add Line
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead className="bg-gray-50 text-muted-foreground uppercase text-xs">
                        <tr>
                          <th className="px-3 py-2 text-left">Description</th>
                          <th className="px-3 py-2 text-left">Account</th>
                          <th className="px-3 py-2 text-left">Tax Rate</th>
                          <th className="px-3 py-2 text-left">Store</th>
                          <th className="px-3 py-2 text-right">Debit</th>
                          <th className="px-3 py-2 text-right">Credit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {breakdown.lineItems.map((item) => (
                          <tr key={item.id} className="border-t">
                            <td className="px-3 py-1">
                              {isEditable ? (
                                <Input
                                  value={item.description}
                                  onChange={(e) => updateLineItem(selectedMonth, item.id, "description", e.target.value)}
                                  className="h-8"
                                />
                              ) : (
                                <span>{item.description}</span>
                              )}
                            </td>
                            <td className="px-3 py-1">
                              {isEditable ? (
                                <AccountCodeCombobox
                                  value={item.accountCode}
                                  onChange={(val) => updateLineItem(selectedMonth, item.id, "accountCode", val)}
                                  options={accountCodes}
                                />
                              ) : (
                                <span>{`${item.accountCode} - ${accountDescriptions[item.accountCode] ?? ""}`}</span>
                              )}
                            </td>
                            <td className="px-3 py-1">
                              {isEditable ? (
                                <Select value={item.taxRate} onValueChange={(val) => updateLineItem(selectedMonth, item.id, "taxRate", val)}>
                                  <SelectTrigger className="w-40 h-8">
                                    <SelectValue placeholder="Tax" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {taxRateOptions.map((tr) => (
                                      <SelectItem key={tr} value={tr}>{tr}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <span>{item.taxRate}</span>
                              )}
                            </td>
                            <td className="px-3 py-1">
                              {isEditable ? (
                                <Select value={item.store} onValueChange={(val) => updateLineItem(selectedMonth, item.id, "store", val)}>
                                  <SelectTrigger className="w-36 h-8">
                                    <SelectValue placeholder="Store" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {stores.map((st) => (
                                      <SelectItem key={st} value={st}>{st}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <span>{item.store}</span>
                              )}
                            </td>
                            <td className="px-3 py-1 text-right">
                              {isEditable ? (
                                <Input
                                  type="number"
                                  className="h-8 text-right"
                                  value={item.debitAmount}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value || "0");
                                    updateLineItem(selectedMonth, item.id, "debitAmount", val);
                                    updateLineItem(selectedMonth, item.id, "creditAmount", 0);
                                  }}
                                />
                              ) : (
                                formatCurrency(item.debitAmount || 0)
                              )}
                            </td>
                            <td className="px-3 py-1 text-right">
                              {isEditable ? (
                                <Input
                                  type="number"
                                  className="h-8 text-right"
                                  value={item.creditAmount}
                                  onChange={(e) => {
                                    const val = parseFloat(e.target.value || "0");
                                    updateLineItem(selectedMonth, item.id, "creditAmount", val);
                                    updateLineItem(selectedMonth, item.id, "debitAmount", 0);
                                  }}
                                />
                              ) : (
                                formatCurrency(item.creditAmount || 0)
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t bg-gray-50">
                          <td colSpan={4} className="px-3 py-2 text-right font-medium">Subtotal (No Tax)</td>
                          <td className="px-3 py-2 text-right">{formatCurrency(totals.noTaxDebit)}</td>
                          <td className="px-3 py-2 text-right">{formatCurrency(totals.noTaxCredit)}</td>
                        </tr>
                        <tr className="border-t bg-gray-50">
                          <td colSpan={4} className="px-3 py-2 text-right font-medium">Subtotal (Tax)</td>
                          <td className="px-3 py-2 text-right">{formatCurrency(totals.taxDebit)}</td>
                          <td className="px-3 py-2 text-right">{formatCurrency(totals.taxCredit)}</td>
                        </tr>
                        <tr className={`border-t font-bold ${imbalanced ? "text-red-600" : ""}`}>
                          <td colSpan={4} className="px-3 py-2 text-right">Total</td>
                          <td className="px-3 py-2 text-right">{formatCurrency(totals.totalDebit)}</td>
                          <td className="px-3 py-2 text-right">{formatCurrency(totals.totalCredit)}</td>
                        </tr>
                        {imbalanced && (
                          <tr className="text-red-600 text-xs">
                            <td colSpan={6} className="px-3 py-1 text-right">Debit and Credit totals must be equal</td>
                          </tr>
                        )}
                      </tfoot>
                    </table>
                  </CardContent>
                </Card>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
} 