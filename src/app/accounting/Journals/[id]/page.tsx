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
  MoreVertical,
  X,
  Save,
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Command, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { journalEntries } from "../journalData";
import { JournalType, JournalLineItem } from "../types";

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
  const [journalData, setJournalData] = React.useState(journalEntries.find(j => j.id === params.id));
  
  // Find the current journal
  const journal = journalData;

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

  const getJournalTypeColor = (type: string) => {
    switch (type) {
      case "prepayment": return "bg-blue-100 text-blue-800 border-blue-200";
      case "accrual": return "bg-purple-100 text-purple-800 border-purple-200";
      case "stock-movement": return "bg-orange-100 text-orange-800 border-orange-200";
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
  }: {
    value: string;
    onChange: (val: string) => void;
    options: string[];
  }) {
    const [open, setOpen] = React.useState(false);
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-32 h-8 justify-between px-2 text-sm font-normal"
          >
            {value ? `${value} - ${accountDescriptions[value] ?? ""}` : "Code"}
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-0">
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
                    {format(j.startDate, 'dd MMM yyyy')}
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
        <div className="p-6 space-y-6">
          {/* Navigation Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push("/accounting/Journals")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Journals
              </Button>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getJournalTypeColor(journal.type)}>
                  {journal.type.charAt(0).toUpperCase() + journal.type.slice(1)}
                </Badge>
                <Badge variant="outline" className={getStatusColor(journal.status)}>
                  {journal.status}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {prevJournal && (
                <Button
                  variant="ghost"
                  onClick={() => router.push(`/accounting/Journals/${prevJournal.id}`)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              )}
              {nextJournal && (
                <Button
                  variant="ghost"
                  onClick={() => router.push(`/accounting/Journals/${nextJournal.id}`)}
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Export Journal</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    Delete Journal
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Journal Summary */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Journal Details</h1>
                <Button 
                  onClick={() => {
                    // Handle save
                    console.log("Saving journal changes");
                  }}
                  className="bg-gray-900 text-white hover:bg-gray-800"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex">
                  <div className="w-[calc(100%/6)]">
                    <label className="text-sm font-medium text-muted-foreground">Journal Type</label>
                    <Select defaultValue={journal.type} onValueChange={(value) => setJournalData(prev => ({...prev!, type: value as JournalType}))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="accrual">Accrual</SelectItem>
                        <SelectItem value="prepayment">Prepayment</SelectItem>
                        <SelectItem value="stock-movement">Stock Movement</SelectItem>
                      </SelectContent>
                    </Select>
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
                      defaultValue={journal.totalAmount}
                      className="mt-1"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Start Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full mt-1 justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {journal.startDate ? format(journal.startDate, 'dd MMM yyyy') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={journal.startDate}
                          onSelect={(date) => {
                            if (date) {
                              setJournalData(prev => ({ ...prev!, startDate: date }));
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">End Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full mt-1 justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {journal.endDate ? format(journal.endDate, 'dd MMM yyyy') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={journal.endDate}
                          onSelect={(date) => {
                             if (date) {
                              setJournalData(prev => ({ ...prev!, endDate: date }));
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Schedule Type</label>
                    <Select defaultValue="monthly">
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder="Select schedule type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {journal.type === 'prepayment' && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Prepayment Account</label>
                        <Input
                          defaultValue={journal.accountCode}
                          className="mt-1"
                          placeholder="e.g. 1400"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Monthly Transfer</label>
                        <Input
                          defaultValue={journal.monthlyAccountCode}
                          className="mt-1"
                          placeholder="e.g. 6500"
                        />
                      </div>
                    </>
                  )}
                  {journal.type === 'accrual' && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Accrual Account</label>
                        <Input
                          defaultValue={journal.accountCode}
                          className="mt-1"
                          placeholder="e.g. 2200"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Monthly Transfer</label>
                        <Input
                          defaultValue={journal.monthlyAccountCode}
                          className="mt-1"
                          placeholder="e.g. 6300"
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
              <div className="text-xs text-muted-foreground">
                {format(journal.startDate, "MMM yyyy")} - {format(journal.endDate, "MMM yyyy")}
              </div>
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
                <div className="flex gap-4 pb-4" style={{ minWidth: `${journal.monthlyBreakdown.length * 300}px` }}>
                  {journal.monthlyBreakdown.map((breakdown, index) => {
                    const monthDate = new Date(breakdown.month + "-01");
                    const isCurrentMonth = format(new Date(), "yyyy-MM") === breakdown.month;
                    const isExpanded = selectedMonth === breakdown.month;
                    
                    return (
                      <div key={breakdown.month} className="w-[300px] space-y-4">
                        {/* Month Card */}
                        <div 
                          className={`cursor-pointer p-4 rounded-lg border-2 transition-all duration-200 ${
                             isCurrentMonth 
                               ? 'border-purple-500 bg-purple-50 shadow-lg' 
                               : breakdown.status === 'posted'
                                 ? 'border-green-500 bg-green-50'
                                 : 'border-gray-200 bg-white'
                           }`}
                          onClick={() => toggleMonth(breakdown.month)}
                        >
                          {/* Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">
                                {format(monthDate, "MMM yyyy")}
                              </span>
                              {isCurrentMonth && (
                                <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">
                                  Current
                                </Badge>
                              )}
                            </div>
                            <Badge 
                              variant="outline" 
                              className={breakdown.status === 'posted' 
                                ? 'bg-green-100 text-green-800 border-green-200'
                                : 'bg-gray-100 text-gray-800 border-gray-200'
                              }
                            >
                              {breakdown.status}
                            </Badge>
                          </div>

                          {/* Amount */}
                          <div className="mb-3">
                            <div className="text-2xl font-bold">
                              {formatCurrency(breakdown.amount)}
                            </div>
                          </div>

                          {/* Running Balance */}
                          <div className="pt-2 border-t">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-muted-foreground">Balance:</span>
                              <span className="font-mono font-bold">
                                {formatCurrency(breakdown.amount * (index + 1))}
                              </span>
                            </div>
                          </div>

                          {/* Line Items Preview */}
                          <div className="mt-3 space-y-2">
                            <h4 className="text-xs font-medium mb-1">Line Items</h4>
                            {!isExpanded && breakdown.lineItems.length > 0 && (
                              <div className="space-y-1">
                                {breakdown.lineItems.slice(0, 2).map((item) => (
                                  <div key={item.id} className="flex justify-between items-center text-xs">
                                    <span className="text-muted-foreground truncate">
                                      {item.accountCode} - {item.description}
                                    </span>
                                    <span className="font-mono">
                                      {item.debitAmount > 0 ? `Dr ${formatCurrency(item.debitAmount)}` : `Cr ${formatCurrency(item.creditAmount)}`}
                                    </span>
                                  </div>
                                ))}
                                {breakdown.lineItems.length > 2 && (
                                  <div className="text-xs text-muted-foreground text-center">
                                    +{breakdown.lineItems.length - 2} more lines
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Single full-width line items table rendered below cards */}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Full-width line items table for selected month */}
            {selectedMonth && (() => {
              const breakdown = journal.monthlyBreakdown.find(b => b.month === selectedMonth);
              if (!breakdown) return null;

              const accountCodes = Array.from(new Set(journal.monthlyBreakdown.flatMap(b => b.lineItems.map(li => li.accountCode))));
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