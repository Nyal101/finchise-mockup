"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
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
import { ChevronDown } from "lucide-react";
import { Command, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { JournalEntry } from "../types";

// Map of account codes to descriptive names
const accountDescriptions: Record<string, string> = {
  "1001": "Stock Asset",
  "5050": "Stock Movement/COGS",
  "1300": "Stock on Hand",
  "5000": "Cost of Goods Sold",
  "1105": "Prepayment General / Business Rates",
  "1400": "Prepayments",
  "6500": "Insurance Expense",
  "7100": "Staff Costs",
  "2200": "Accruals",
  "8100": "Capital Expenditure",
  "7101": "Property - Business Rates",
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

interface StockJournalDetailsProps {
  journal: JournalEntry;
  onUpdate: (updates: Partial<JournalEntry>) => void;
}

export function StockJournalDetails({ journal, onUpdate }: StockJournalDetailsProps) {
  const isDisabled = journal.status === 'published';

  // Calculate stock movement
  const stockMovement = (journal.closingStockValue || 0) - (journal.openingStockValue || 0);
  const isIncrease = stockMovement > 0;

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="grid grid-cols-3 gap-4">
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
          <label className="text-sm font-medium text-muted-foreground">Description</label>
          <Input
            value={journal.description}
            onChange={e => onUpdate({ description: e.target.value })}
            className="mt-1"
            placeholder="Enter stock adjustment description"
            disabled={isDisabled}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Opening Stock */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Opening Stock</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full mt-1 justify-start text-left font-normal"
                    disabled={isDisabled}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {journal.openingStockDate ? format(journal.openingStockDate, 'dd MMM yyyy') : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                {!isDisabled && (
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={journal.openingStockDate}
                      defaultMonth={journal.openingStockDate}
                      onSelect={(date) => {
                        if (date) onUpdate({ openingStockDate: date });
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                )}
              </Popover>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Value</label>
              <Input
                type="number"
                value={journal.openingStockValue ?? ''}
                onChange={e => onUpdate({ openingStockValue: parseFloat(e.target.value || '0') })}
                className="mt-1"
                step="0.01"
                disabled={isDisabled}
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        {/* Closing Stock */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Closing Stock</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full mt-1 justify-start text-left font-normal"
                    disabled={isDisabled}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {journal.closingStockDate ? format(journal.closingStockDate, 'dd MMM yyyy') : <span>Select date</span>}
                  </Button>
                </PopoverTrigger>
                {!isDisabled && (
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={journal.closingStockDate}
                      defaultMonth={journal.closingStockDate}
                      onSelect={(date) => {
                        if (date) onUpdate({ closingStockDate: date });
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                )}
              </Popover>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Value</label>
              <Input
                type="number"
                value={journal.closingStockValue ?? ''}
                onChange={e => onUpdate({ closingStockValue: parseFloat(e.target.value || '0') })}
                className="mt-1"
                step="0.01"
                disabled={isDisabled}
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stock Movement Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Stock Movement</span>
          <span className={`text-lg font-semibold ${isIncrease ? 'text-green-600' : 'text-red-600'}`}>
            {isIncrease ? '+' : '-'}£{Math.abs(stockMovement).toFixed(2)}
          </span>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {isIncrease ? 'Stock has increased' : 'Stock has decreased'}
        </div>
      </div>

      {/* Account Codes */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Stock Account</label>
          <AccountCodeCombobox
            value={journal.stockAccountCode || ''}
            onChange={(val) => onUpdate({ stockAccountCode: val })}
            options={Object.keys(accountDescriptions)}
            className="mt-1"
            disabled={isDisabled}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Stock Movement Account</label>
          <AccountCodeCombobox
            value={journal.stockMovementAccountCode || ''}
            onChange={(val) => onUpdate({ stockMovementAccountCode: val })}
            options={Object.keys(accountDescriptions)}
            className="mt-1"
            disabled={isDisabled}
          />
        </div>
      </div>
    </div>
  );
} 