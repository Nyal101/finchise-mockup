"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
  ChevronDown,
  Maximize2,
  ChevronLeft,
  Plus,
  ChevronUp
} from "lucide-react";
import { Command, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { journalEntries } from "../journalData";
import { ScheduleType } from "../types";
import { calculateJournal } from "../utils/journalCalculations";
import { useState, useEffect } from "react";

// Map of account codes to descriptive names
const accountDescriptions: Record<string, string> = {
  "1105": "Prepayment General / Business Rates",
  "1400": "Prepayments",
  "6500": "Insurance Expense",
  "7100": "Staff Costs",
  "2200": "Accruals",
  "8100": "Capital Expenditure",
  "7101": "Property - Business Rates",
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

export default function JournalDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [showSourceDocument, setShowSourceDocument] = useState(true);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [journalData, setJournalData] = React.useState(() => {
    const j = journalEntries.find(j => j.id === params.id);
    return j ? { ...j, scheduleType: j.scheduleType || 'monthly & weekly', monthlyBreakdown: j.monthlyBreakdown || [] } : undefined;
  });

  // Find the current journal
  const journal = journalData;

  // Set initial selected document
  useEffect(() => {
    if (!journal) return;
    if (!selectedDocumentId && journal.sourceDocuments.length > 0) {
      setSelectedDocumentId(journal.sourceDocuments[0].id);
    }
  }, [journal, selectedDocumentId]);

  // Get current selected document
  const selectedDocument = journal?.sourceDocuments.find(doc => doc.id === selectedDocumentId);

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
              <ChevronLeft className="h-4 w-4" />
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
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between bg-white border-b border-gray-200 px-6 h-16">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/accounting/Journals")}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => prevJournal && router.push(`/accounting/Journals/${prevJournal.id}`)}
                disabled={!prevJournal}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => nextJournal && router.push(`/accounting/Journals/${nextJournal.id}`)}
                disabled={!nextJournal}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setShowSourceDocument(!showSourceDocument)}
            >
              {showSourceDocument ? "Hide Documents" : "Show Documents"}
            </Button>
            <Button 
              onClick={() => console.log("Saving journal changes")}
              className="bg-gray-900 text-white hover:bg-gray-800"
              size="sm"
            >
              Save Changes
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Journal Details */}
          <div className={`${showSourceDocument ? 'w-1/2' : 'w-full'} overflow-y-auto transition-all duration-300`}>
            <div className="p-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-lg font-semibold">Journal Details</h2>
                  <Badge variant="outline" className="capitalize">
                    {journal.type}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <Input
                      value={journal.description}
                      className="mt-1"
                      placeholder="Enter journal description"
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-4">
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
                      <label className="text-sm font-medium text-muted-foreground">Expense Paid</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full mt-1 justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {journalData?.expensePaidMonth ? format(journalData.expensePaidMonth, 'MMM yyyy') : <span>Month</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={journalData?.expensePaidMonth}
                            defaultMonth={journalData?.expensePaidMonth}
                            onSelect={(date) => {
                              if (date) setJournalData(prev => prev ? { ...prev, expensePaidMonth: date } : prev);
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Recognition Start</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full mt-1 justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {journalData?.periodStartDate ? format(journalData.periodStartDate, 'dd MMM yyyy') : <span>Start</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={journalData?.periodStartDate}
                            defaultMonth={journalData?.periodStartDate}
                            onSelect={(date) => {
                              if (date) setJournalData(prev => prev ? { ...prev, periodStartDate: date } : prev);
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Recognition End</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full mt-1 justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {journalData?.periodEndDate ? format(journalData.periodEndDate, 'dd MMM yyyy') : <span>End</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={journalData?.periodEndDate}
                            defaultMonth={journalData?.periodEndDate}
                            onSelect={(date) => {
                              if (date) setJournalData(prev => prev ? { ...prev, periodEndDate: date } : prev);
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        {journal.type === 'prepayment' ? 'Prepayment Account' : 'Accrual Account'}
                      </label>
                      <AccountCodeCombobox
                        value={journal.accountCode}
                        onChange={(val) => setJournalData(prev => ({ ...prev!, accountCode: val }))}
                        options={Object.keys(accountDescriptions)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Monthly Transfer Account</label>
                      <AccountCodeCombobox
                        value={journal.monthlyAccountCode}
                        onChange={(val) => setJournalData(prev => ({ ...prev!, monthlyAccountCode: val }))}
                        options={Object.keys(accountDescriptions)}
                        className="mt-1"
                      />
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
                          <SelectItem value="monthly & weekly">Monthly</SelectItem>
                          <SelectItem value="monthly">Equal Split</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Breakdown */}
            <div className="px-4">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-white p-3 border-b flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <h3 className="font-semibold">Monthly Breakdown</h3>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span>Posted</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                        <span>Scheduled</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Scroll horizontally to view all months →
                  </div>
                </div>
                
                <div className="bg-gray-50/50">
                  {/* Monthly Cards */}
                  <div className="overflow-x-auto">
                    <div className="flex gap-3 p-3" style={{ minWidth: `${monthlyBreakdown.length * 260}px` }}>
                      {monthlyBreakdown
                        .sort((a, b) => new Date(a.month + '-01').getTime() - new Date(b.month + '-01').getTime())
                        .map((breakdown) => {
                          const monthDate = new Date(breakdown.month + "-01");
                          const isCurrentMonth = format(new Date(), "yyyy-MM") === breakdown.month;
                          const isSelected = selectedMonth === breakdown.month;

                          return (
                            <div key={breakdown.month} className="w-[260px]">
                              <div
                                className={`p-4 rounded-lg border transition-all duration-200 text-sm cursor-pointer ${
                                  isCurrentMonth
                                    ? 'border-purple-500 bg-purple-50 shadow-lg'
                                    : breakdown.status === 'posted'
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-200 bg-white'
                                } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                                onClick={() => setSelectedMonth(prev => prev === breakdown.month ? null : breakdown.month)}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-semibold text-base">{format(monthDate, "MMM yyyy")}</span>
                                  <div className="flex items-center gap-2">
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
                                    {isSelected ? (
                                      <ChevronUp className="h-4 w-4 text-blue-500" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4 text-gray-400" />
                                    )}
                                  </div>
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

                  {/* Line Items Section - Full Width */}
                  {selectedMonth && (() => {
                    const breakdown = monthlyBreakdown.find(b => b.month === selectedMonth);
                    if (!breakdown) return null;

                    return (
                      <div className="border-t">
                        <div className="bg-white p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-lg">
                              Line Items - {format(new Date(selectedMonth + "-01"), "MMMM yyyy")}
                            </h4>
                            {breakdown.status === 'scheduled' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setJournalData(prev => {
                                    if (!prev) return prev;
                                    return {
                                      ...prev,
                                      monthlyBreakdown: prev.monthlyBreakdown.map(b => {
                                        if (b.month !== breakdown.month) return b;
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
                                }}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Line
                              </Button>
                            )}
                          </div>

                          <div className="rounded-lg border overflow-hidden">
                            <table className="w-full text-sm">
                              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                <tr>
                                  <th className="px-4 py-2 text-left">Description</th>
                                  <th className="px-4 py-2 text-left">Account</th>
                                  <th className="px-4 py-2 text-left">Store</th>
                                  <th className="px-4 py-2 text-right w-[150px]">Debit</th>
                                  <th className="px-4 py-2 text-right w-[150px]">Credit</th>
                                </tr>
                              </thead>
                              <tbody>
                                {breakdown.lineItems.map((item) => (
                                  <tr key={item.id} className="border-t">
                                    <td className="px-4 py-2">
                                      {breakdown.status === 'scheduled' ? (
                                        <Input
                                          value={item.description}
                                          onChange={(e) => {
                                            setJournalData(prev => {
                                              if (!prev) return prev;
                                              return {
                                                ...prev,
                                                monthlyBreakdown: prev.monthlyBreakdown.map(b => {
                                                  if (b.month !== breakdown.month) return b;
                                                  return {
                                                    ...b,
                                                    lineItems: b.lineItems.map(li =>
                                                      li.id === item.id ? { ...li, description: e.target.value } : li
                                                    ),
                                                  };
                                                }),
                                              };
                                            });
                                          }}
                                          className="h-8"
                                        />
                                      ) : (
                                        item.description
                                      )}
                                    </td>
                                    <td className="px-4 py-2">
                                      {breakdown.status === 'scheduled' ? (
                                        <AccountCodeCombobox
                                          value={item.accountCode}
                                          onChange={(val) => {
                                            setJournalData(prev => {
                                              if (!prev) return prev;
                                              return {
                                                ...prev,
                                                monthlyBreakdown: prev.monthlyBreakdown.map(b => {
                                                  if (b.month !== breakdown.month) return b;
                                                  return {
                                                    ...b,
                                                    lineItems: b.lineItems.map(li =>
                                                      li.id === item.id ? { ...li, accountCode: val } : li
                                                    ),
                                                  };
                                                }),
                                              };
                                            });
                                          }}
                                          options={Object.keys(accountDescriptions)}
                                        />
                                      ) : (
                                        `${item.accountCode} - ${accountDescriptions[item.accountCode] ?? ""}`
                                      )}
                                    </td>
                                    <td className="px-4 py-2">
                                      {breakdown.status === 'scheduled' ? (
                                        <Select
                                          value={item.store}
                                          onValueChange={(val) => {
                                            setJournalData(prev => {
                                              if (!prev) return prev;
                                              return {
                                                ...prev,
                                                monthlyBreakdown: prev.monthlyBreakdown.map(b => {
                                                  if (b.month !== breakdown.month) return b;
                                                  return {
                                                    ...b,
                                                    lineItems: b.lineItems.map(li =>
                                                      li.id === item.id ? { ...li, store: val } : li
                                                    ),
                                                  };
                                                }),
                                              };
                                            });
                                          }}
                                        >
                                          <SelectTrigger className="h-8">
                                            <SelectValue placeholder="Store" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {["Kings Hill", "Manchester", "London", "Birmingham", "Leeds"].map(store => (
                                              <SelectItem key={store} value={store}>{store}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      ) : (
                                        item.store
                                      )}
                                    </td>
                                    <td className="px-4 py-2">
                                      {breakdown.status === 'scheduled' ? (
                                        <Input
                                          type="number"
                                          value={item.debitAmount}
                                          onChange={(e) => {
                                            const val = parseFloat(e.target.value || "0");
                                            setJournalData(prev => {
                                              if (!prev) return prev;
                                              return {
                                                ...prev,
                                                monthlyBreakdown: prev.monthlyBreakdown.map(b => {
                                                  if (b.month !== breakdown.month) return b;
                                                  return {
                                                    ...b,
                                                    lineItems: b.lineItems.map(li =>
                                                      li.id === item.id ? { ...li, debitAmount: val, creditAmount: 0 } : li
                                                    ),
                                                  };
                                                }),
                                              };
                                            });
                                          }}
                                          className="h-8 text-right"
                                        />
                                      ) : (
                                        formatCurrency(item.debitAmount)
                                      )}
                                    </td>
                                    <td className="px-4 py-2">
                                      {breakdown.status === 'scheduled' ? (
                                        <Input
                                          type="number"
                                          value={item.creditAmount}
                                          onChange={(e) => {
                                            const val = parseFloat(e.target.value || "0");
                                            setJournalData(prev => {
                                              if (!prev) return prev;
                                              return {
                                                ...prev,
                                                monthlyBreakdown: prev.monthlyBreakdown.map(b => {
                                                  if (b.month !== breakdown.month) return b;
                                                  return {
                                                    ...b,
                                                    lineItems: b.lineItems.map(li =>
                                                      li.id === item.id ? { ...li, creditAmount: val, debitAmount: 0 } : li
                                                    ),
                                                  };
                                                }),
                                              };
                                            });
                                          }}
                                          className="h-8 text-right"
                                        />
                                      ) : (
                                        formatCurrency(item.creditAmount)
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot className="bg-gray-50 font-medium">
                                <tr className="border-t">
                                  <td colSpan={3} className="px-4 py-3 text-right">Total</td>
                                  <td className="px-4 py-3 text-right">
                                    {formatCurrency(
                                      breakdown.lineItems.reduce((sum, item) => sum + (item.debitAmount || 0), 0)
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    {formatCurrency(
                                      breakdown.lineItems.reduce((sum, item) => sum + (item.creditAmount || 0), 0)
                                    )}
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Document Preview */}
          {showSourceDocument && (
            <div className="w-1/2 border-l border-gray-200 bg-gray-50 flex flex-col overflow-hidden">
              <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <div className="flex-1 flex items-center gap-3">
                  <h3 className="font-semibold">Source Documents</h3>
                  {journal.sourceDocuments.length > 1 && (
                    <Select value={selectedDocumentId || ''} onValueChange={setSelectedDocumentId}>
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Select document" />
                      </SelectTrigger>
                      <SelectContent>
                        {journal.sourceDocuments.map(doc => (
                          <SelectItem key={doc.id} value={doc.id}>
                            {doc.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                {selectedDocument && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(selectedDocument.url, '_blank')}
                  >
                    <Maximize2 className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </Button>
                )}
              </div>

              {selectedDocument ? (
                <div className="flex-1 overflow-hidden">
                  <iframe
                    src={selectedDocument.url}
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  No document selected
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 