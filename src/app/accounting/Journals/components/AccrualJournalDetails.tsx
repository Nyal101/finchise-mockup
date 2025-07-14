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
import { JournalEntry, ScheduleType } from "../types";

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

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="grid grid-cols-[1fr_1fr_2fr] gap-4">
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
            placeholder="Enter journal description"
            disabled={isDisabled}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Total Amount</label>
          <Input
            type="number"
            value={journal.totalAmount ?? ''}
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
                {journal.expensePaidMonth ? format(journal.expensePaidMonth, 'MMM yyyy') : <span>Month</span>}
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
                {journal.periodStartDate ? format(journal.periodStartDate, 'dd MMM yyyy') : <span>Start</span>}
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
                {journal.periodEndDate ? format(journal.periodEndDate, 'dd MMM yyyy') : <span>End</span>}
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
    </div>
  );
} 