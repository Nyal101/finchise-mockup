"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, Plus, Trash2 } from "lucide-react";
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
import { ChevronDown } from "lucide-react";
import { Command, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { JournalEntry, ScheduleType, StoreAllocation } from "../types";

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

// Default account codes for different allocation types
const defaultAccountCodes = {
  prepayment: {
    accountCode: "1400", // Prepayments
    monthlyAccountCode: "6500" // Insurance Expense (common transfer account)
  },
  accrual: {
    accountCode: "2200", // Accruals
    monthlyAccountCode: "7100" // Staff Costs (common transfer account)
  }
};

// Available companies
const companies = ["Domino's Pizza", "Costa Coffee", "GDK Ltd"];

// Available stores
const stores = ["Kings Hill", "Manchester", "London", "Birmingham", "Leeds"];

// Combobox for searching account codes
function AccountCodeCombobox({
  value,
  onChange,
  options,
  className,
  disabled,
}: {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  className?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full h-8 justify-between px-2 text-sm font-normal ${className || ''} ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
          disabled={disabled}
        >
          {value ? `${value} - ${accountDescriptions[value] ?? ""}` : "Code"}
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      {!disabled && (
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
      )}
    </Popover>
  );
}

interface AccrualJournalDetailsProps {
  journal: JournalEntry;
  onUpdate: (updates: Partial<JournalEntry>) => void;
}

export function AccrualJournalDetails({ journal, onUpdate }: AccrualJournalDetailsProps) {
  const isDisabled = journal.status === 'published';
  const [isMultiStoreMode, setIsMultiStoreMode] = React.useState(false);
  const [localStoreAllocations, setLocalStoreAllocations] = React.useState<StoreAllocation[]>([]);

  // Initialize store allocations on mount and when journal ID changes
  React.useEffect(() => {
    // Create safe default dates if journal doesn't have them
    const paidDate = new Date(2024, 0, 1); // January 1, 2024
    const startDate = new Date(2024, 2, 1); // March 1, 2024 
    const endDate = new Date(2024, 2, 31); // March 31, 2024
    
    const initialAllocations = journal.storeAllocations || [{
      id: '1',
      store: journal.store || '',
      totalAmount: journal.totalAmount || 100,
      expensePaidMonth: journal.expensePaidMonth || paidDate,
      periodStartDate: journal.periodStartDate || startDate,
      periodEndDate: journal.periodEndDate || endDate,
      accountCode: journal.accountCode || '1400',
      monthlyAccountCode: journal.monthlyAccountCode || '6500',
    }];
    setLocalStoreAllocations(initialAllocations);
    setIsMultiStoreMode(initialAllocations.length > 1);
  }, [
    journal.id,
    journal.storeAllocations,
    journal.store,
    journal.totalAmount,
    journal.expensePaidMonth,
    journal.periodStartDate,
    journal.periodEndDate,
    journal.accountCode,
    journal.monthlyAccountCode
  ]);

  // Sync local allocations when journal.storeAllocations changes from external source
  const prevStoreAllocationsRef = React.useRef<string>('');
  React.useEffect(() => {
    if (journal.storeAllocations && journal.storeAllocations.length > 0) {
      const newStr = JSON.stringify(journal.storeAllocations);
      if (prevStoreAllocationsRef.current !== newStr) {
        prevStoreAllocationsRef.current = newStr;
        setLocalStoreAllocations(journal.storeAllocations);
        setIsMultiStoreMode(journal.storeAllocations.length > 1);
      }
    }
  }, [journal.storeAllocations]);

  // Use local allocations instead of computed ones
  const storeAllocations = localStoreAllocations;

  // Auto-update journal type when dates change (for single store mode)
  React.useEffect(() => {
    if (!isMultiStoreMode && journal.expensePaidMonth && journal.periodStartDate && journal.periodEndDate) {
      const tempAllocation = {
        id: 'temp',
        store: journal.store || '',
        totalAmount: journal.totalAmount || 0,
        expensePaidMonth: journal.expensePaidMonth,
        periodStartDate: journal.periodStartDate,
        periodEndDate: journal.periodEndDate,
        accountCode: journal.accountCode || '',
        monthlyAccountCode: journal.monthlyAccountCode || '',
      };
      
      const allocationType = getAllocationType(tempAllocation);
      let detectedType: "prepayment" | "accrual" | "mixed";
      
      if (allocationType === 'prepayment') {
        detectedType = "prepayment";
      } else if (allocationType === 'accrual') {
        detectedType = "accrual";
      } else {
        detectedType = "accrual"; // Default fallback for accrual component
      }
      
      if (journal.type !== detectedType) {
        onUpdate({ type: detectedType });
      }
    }
  }, [journal.expensePaidMonth, journal.periodStartDate, journal.periodEndDate, journal.type, journal.store, journal.totalAmount, journal.accountCode, journal.monthlyAccountCode, isMultiStoreMode, onUpdate]);

  // Auto-update journal type when store allocations change (for multi-store mode)
  React.useEffect(() => {
    if (isMultiStoreMode && storeAllocations.length > 0) {
      let hasPrepayment = false;
      let hasAccrual = false;

      for (const allocation of storeAllocations) {
        const allocationType = getAllocationType(allocation);
        if (allocationType === 'prepayment') {
          hasPrepayment = true;
        } else if (allocationType === 'accrual') {
          hasAccrual = true;
        }
      }

      let detectedType: "prepayment" | "accrual" | "mixed";
      if (hasPrepayment && hasAccrual) {
        detectedType = "mixed";
      } else if (hasPrepayment) {
        detectedType = "prepayment";
      } else {
        detectedType = "accrual";
      }

      if (journal.type !== detectedType) {
        onUpdate({ type: detectedType });
      }
    }
  }, [storeAllocations, journal.type, isMultiStoreMode, onUpdate]);

  const updateStoreAllocations = React.useCallback((allocations: StoreAllocation[]) => {
    try {
      // Validate allocations before updating
      const validAllocations = allocations.filter(allocation => {
        // Check if required fields exist
        return allocation.id && 
               allocation.expensePaidMonth && 
               allocation.periodStartDate && 
               allocation.periodEndDate;
      });

      setLocalStoreAllocations(prevAllocations => {
        // Check if allocations have actually changed to prevent unnecessary updates
        const currentAllocationsStr = JSON.stringify(prevAllocations);
        const newAllocationsStr = JSON.stringify(validAllocations);
        
        if (currentAllocationsStr === newAllocationsStr) {
          return prevAllocations; // No change, don't update
        }

        // Auto-detect journal type based on allocations
        let hasPrepayment = false;
        let hasAccrual = false;

        for (const allocation of validAllocations) {
          const allocationType = getAllocationType(allocation);
          if (allocationType === 'prepayment') {
            hasPrepayment = true;
          } else if (allocationType === 'accrual') {
            hasAccrual = true;
          }
        }

        let detectedType: "prepayment" | "accrual" | "mixed";
        if (hasPrepayment && hasAccrual) {
          detectedType = "mixed";
        } else if (hasPrepayment) {
          detectedType = "prepayment";
        } else {
          detectedType = "accrual";
        }

        onUpdate({ 
          storeAllocations: validAllocations,
          type: detectedType,
          // Also update the legacy fields for backwards compatibility
          totalAmount: validAllocations.reduce((sum, allocation) => sum + allocation.totalAmount, 0),
          store: validAllocations.length > 0 ? validAllocations[0].store : '',
          expensePaidMonth: validAllocations.length > 0 ? validAllocations[0].expensePaidMonth : new Date(2024, 0, 1),
          periodStartDate: validAllocations.length > 0 ? validAllocations[0].periodStartDate : new Date(2024, 2, 1),
          periodEndDate: validAllocations.length > 0 ? validAllocations[0].periodEndDate : new Date(2024, 2, 31),
        });

        return validAllocations;
      });
    } catch (error) {
      console.error('Error updating store allocations:', error);
      // Don't crash the app, just log the error
    }
  }, [onUpdate]);

  const addStoreAllocation = () => {
    // Create dates that are definitely different and safe
    const paidDate = new Date(2024, 0, 1); // January 1, 2024
    const startDate = new Date(2024, 2, 1); // March 1, 2024 
    const endDate = new Date(2024, 2, 31); // March 31, 2024
    
    const newAllocation: StoreAllocation = {
      id: Date.now().toString(),
      store: '',
      totalAmount: 100, // Non-zero amount to avoid any division issues
      expensePaidMonth: paidDate, // Paid in Jan
      periodStartDate: startDate, // Recognition starts in Mar
      periodEndDate: endDate, // Recognition ends in Mar
      accountCode: journal.accountCode || '1400',
      monthlyAccountCode: journal.monthlyAccountCode || '6500',
    };
    
    const newAllocations = [...localStoreAllocations, newAllocation];
    updateStoreAllocations(newAllocations);
  };

  const removeStoreAllocation = (id: string) => {
    if (localStoreAllocations.length > 1) {
      const filteredAllocations = localStoreAllocations.filter(allocation => allocation.id !== id);
      updateStoreAllocations(filteredAllocations);
    }
  };

  const updateStoreAllocation = (id: string, updates: Partial<StoreAllocation>) => {
    const updatedAllocations = localStoreAllocations.map(allocation => {
      if (allocation.id === id) {
        const updatedAllocation = { ...allocation, ...updates };
        
        // Check if allocation type has changed and auto-update account codes
        const oldType = getAllocationType(allocation);
        const newType = getAllocationType(updatedAllocation);
        
        if (oldType !== newType && (newType === 'prepayment' || newType === 'accrual')) {
          // Auto-update account codes based on new type
          const defaultCodes = defaultAccountCodes[newType];
          updatedAllocation.accountCode = defaultCodes.accountCode;
          updatedAllocation.monthlyAccountCode = defaultCodes.monthlyAccountCode;
        }
        
        return updatedAllocation;
      }
      return allocation;
    });
    
    updateStoreAllocations(updatedAllocations);
  };

  const enableMultiStoreMode = () => {
    setIsMultiStoreMode(true);
    
    // Create safe default dates if journal doesn't have them
    const paidDate = new Date(2024, 0, 1); // January 1, 2024
    const startDate = new Date(2024, 2, 1); // March 1, 2024 
    const endDate = new Date(2024, 2, 31); // March 31, 2024
    
    // Create initial store allocations from current journal data
    const initialAllocations = [
      {
        id: '1',
        store: journal.store || '',
        totalAmount: journal.totalAmount || 100,
        expensePaidMonth: journal.expensePaidMonth || paidDate,
        periodStartDate: journal.periodStartDate || startDate,
        periodEndDate: journal.periodEndDate || endDate,
        accountCode: journal.accountCode || '1400',
        monthlyAccountCode: journal.monthlyAccountCode || '6500',
      }
    ];
    updateStoreAllocations(initialAllocations);
  };

  // Helper function to determine allocation type based on dates
  const getAllocationType = (allocation: StoreAllocation) => {
    const paidMonth = allocation.expensePaidMonth;
    const startDate = allocation.periodStartDate;
    const endDate = allocation.periodEndDate;

    if (!paidMonth || !startDate || !endDate) {
      return null;
    }

    // Simple comparison: paid before start = prepayment, paid after end = accrual
    const isPrepayment = paidMonth < startDate;
    const isAccrual = paidMonth > endDate;
    
    if (isPrepayment && isAccrual) {
      // This shouldn't happen in normal scenarios, but handle edge cases
      return 'both';
    } else if (isPrepayment) {
      return 'prepayment';
    } else if (isAccrual) {
      return 'accrual';
    } else {
      // Paid during the recognition period - determine based on position
      const periodMidpoint = new Date((startDate.getTime() + endDate.getTime()) / 2);
      return paidMonth <= periodMidpoint ? 'prepayment' : 'accrual';
    }
  };

  const getTypeIndicator = (type: string | null) => {
    switch (type) {
      case 'prepayment':
        return { text: 'Prepayment', color: 'text-blue-600 bg-blue-50 border-blue-200' };
      case 'accrual':
        return { text: 'Accrual', color: 'text-green-600 bg-green-50 border-green-200' };
      case 'both':
        return { text: 'Prepayment & Accrual', color: 'text-purple-600 bg-purple-50 border-purple-200' };
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="grid grid-cols-[1fr_2fr] gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Company</label>
          <Select
            value={journal.company}
            onValueChange={value => onUpdate({ company: value })}
            disabled={isDisabled}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent>
              {companies.map(company => (
                <SelectItem key={company} value={company}>
                  {company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Description</label>
          <Input
            value={journal.description}
            onChange={e => onUpdate({ description: e.target.value })}
            className="mt-1"
            placeholder="Enter journal description"
            disabled={isDisabled}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Accrual Account</label>
          <AccountCodeCombobox
            value={journal.accountCode}
            onChange={(val) => onUpdate({ accountCode: val })}
            options={Object.keys(accountDescriptions)}
            className="mt-1"
            disabled={isDisabled}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Monthly Transfer Account</label>
          <AccountCodeCombobox
            value={journal.monthlyAccountCode}
            onChange={(val) => onUpdate({ monthlyAccountCode: val })}
            options={Object.keys(accountDescriptions)}
            className="mt-1"
            disabled={isDisabled}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Schedule Type</label>
          <Select
            value={journal.scheduleType || 'monthly'}
            onValueChange={value => onUpdate({ scheduleType: value as ScheduleType })}
            disabled={isDisabled}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select schedule type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Store Details Section */}
      {!isMultiStoreMode ? (
        // Single store mode
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Store</label>
            <Select
              value={journal.store}
              onValueChange={value => onUpdate({ store: value })}
              disabled={isDisabled}
            >
              <SelectTrigger className="w-full mt-1">
                <SelectValue placeholder="Select store" />
              </SelectTrigger>
              <SelectContent>
                {stores.map(store => (
                  <SelectItem key={store} value={store}>
                    {store}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Total Amount</label>
            <Input
              type="number"
              value={journal.totalAmount}
              onChange={e => onUpdate({ totalAmount: parseFloat(e.target.value || '0') })}
              className="mt-1"
              step="0.01"
              disabled={isDisabled}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Expense Paid Month</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full mt-1 justify-start text-left font-normal"
                  disabled={isDisabled}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {journal.expensePaidMonth ? format(journal.expensePaidMonth, 'MMM yyyy') : <span>Pick a month</span>}
                </Button>
              </PopoverTrigger>
              {!isDisabled && (
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={journal.expensePaidMonth}
                    defaultMonth={journal.expensePaidMonth}
                    onSelect={(date) => {
                      if (date) onUpdate({ expensePaidMonth: date });
                    }}
                    initialFocus
                  />
                </PopoverContent>
              )}
            </Popover>
          </div>
          <div className="flex items-end">
            {!isDisabled && (
              <Button
                variant="outline"
                size="sm"
                onClick={enableMultiStoreMode}
                className="h-10 text-xs"
              >
                <Plus className="h-4 w-4 mr-1" />
                Allocate to Multiple Stores
              </Button>
            )}
          </div>
        </div>
      ) : (
        // Multi-store mode
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">Store Allocations</h3>
            {!isDisabled && (
              <Button
                variant="outline"
                size="sm"
                onClick={addStoreAllocation}
                className="h-8"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Store
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {storeAllocations.map((allocation) => (
              <div key={allocation.id} className="grid grid-cols-8 gap-2 p-2 border rounded bg-gray-50">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Store</label>
                  <Select
                    value={allocation.store}
                    onValueChange={value => updateStoreAllocation(allocation.id, { store: value })}
                    disabled={isDisabled}
                  >
                    <SelectTrigger className="w-full mt-1 h-8 text-xs">
                      <SelectValue placeholder="Select store" />
                    </SelectTrigger>
                    <SelectContent>
                      {stores.map(store => (
                        <SelectItem key={store} value={store}>
                          {store}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Amount</label>
                  <Input
                    type="number"
                    value={allocation.totalAmount}
                    onChange={e => updateStoreAllocation(allocation.id, { totalAmount: parseFloat(e.target.value || '0') })}
                    className="mt-1 h-8 text-xs"
                    step="0.01"
                    disabled={isDisabled}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Paid Month</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full mt-1 h-8 justify-start text-left font-normal text-xs"
                        disabled={isDisabled}
                      >
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        {allocation.expensePaidMonth ? format(allocation.expensePaidMonth, 'MMM yy') : <span>Month</span>}
                      </Button>
                    </PopoverTrigger>
                    {!isDisabled && (
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={allocation.expensePaidMonth}
                          defaultMonth={allocation.expensePaidMonth}
                          onSelect={(date) => {
                            if (date) updateStoreAllocation(allocation.id, { expensePaidMonth: date });
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    )}
                  </Popover>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Start Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full mt-1 h-8 justify-start text-left font-normal text-xs"
                        disabled={isDisabled}
                      >
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        {allocation.periodStartDate ? format(allocation.periodStartDate, 'dd MMM yyyy') : <span>Start</span>}
                      </Button>
                    </PopoverTrigger>
                    {!isDisabled && (
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={allocation.periodStartDate}
                          defaultMonth={allocation.periodStartDate}
                          onSelect={(date) => {
                            if (date) updateStoreAllocation(allocation.id, { periodStartDate: date });
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    )}
                  </Popover>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">End Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full mt-1 h-8 justify-start text-left font-normal text-xs"
                        disabled={isDisabled}
                      >
                        <CalendarIcon className="mr-1 h-3 w-3" />
                        {allocation.periodEndDate ? format(allocation.periodEndDate, 'dd MMM yyyy') : <span>End</span>}
                      </Button>
                    </PopoverTrigger>
                    {!isDisabled && (
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={allocation.periodEndDate}
                          defaultMonth={allocation.periodEndDate}
                          onSelect={(date) => {
                            if (date) updateStoreAllocation(allocation.id, { periodEndDate: date });
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    )}
                  </Popover>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Accrual Account</label>
                  <AccountCodeCombobox
                    value={allocation.accountCode}
                    onChange={(val) => updateStoreAllocation(allocation.id, { accountCode: val })}
                    options={Object.keys(accountDescriptions)}
                    className="mt-1"
                    disabled={isDisabled}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Transfer Account</label>
                  <AccountCodeCombobox
                    value={allocation.monthlyAccountCode}
                    onChange={(val) => updateStoreAllocation(allocation.id, { monthlyAccountCode: val })}
                    options={Object.keys(accountDescriptions)}
                    className="mt-1"
                    disabled={isDisabled}
                  />
                </div>

                <div className="flex items-end">
                  {!isDisabled && storeAllocations.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStoreAllocation(allocation.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Type indicators for each allocation */}
          <div className="mt-3 space-y-2">
            {storeAllocations.map((allocation) => {
              const allocationType = getAllocationType(allocation);
              const indicator = getTypeIndicator(allocationType);
              
              if (!indicator) return null;
              
              return (
                <div key={`${allocation.id}-indicator`} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {allocation.store || 'Unassigned Store'}:
                  </span>
                  <span className={`px-2 py-1 rounded-full border text-xs font-medium ${indicator.color}`}>
                    {indicator.text}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 pt-3 border-t">
            <div className="text-sm font-medium text-muted-foreground">
              Total Amount: £{storeAllocations.reduce((sum, allocation) => sum + allocation.totalAmount, 0).toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* Recognition Period Section - Only show in single store mode */}
      {!isMultiStoreMode && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Recognition Start Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full mt-1 justify-start text-left font-normal"
                  disabled={isDisabled}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {journal.periodStartDate ? format(journal.periodStartDate, 'dd MMM yyyy') : <span>Pick start date</span>}
                </Button>
              </PopoverTrigger>
              {!isDisabled && (
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={journal.periodStartDate}
                    defaultMonth={journal.periodStartDate}
                    onSelect={(date) => {
                      if (date) onUpdate({ periodStartDate: date });
                    }}
                    initialFocus
                  />
                </PopoverContent>
              )}
            </Popover>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Recognition End Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full mt-1 justify-start text-left font-normal"
                  disabled={isDisabled}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {journal.periodEndDate ? format(journal.periodEndDate, 'dd MMM yyyy') : <span>Pick end date</span>}
                </Button>
              </PopoverTrigger>
              {!isDisabled && (
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={journal.periodEndDate}
                    defaultMonth={journal.periodEndDate}
                    onSelect={(date) => {
                      if (date) onUpdate({ periodEndDate: date });
                    }}
                    initialFocus
                  />
                </PopoverContent>
              )}
            </Popover>
          </div>
        </div>
      )}
    </div>
  );
}