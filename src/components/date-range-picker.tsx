"use client"

import * as React from "react"
import { CalendarIcon, ChevronDown } from "lucide-react"
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DateAndStoreFilterProps {
  className?: string;
  storeValue?: string;
  onStoreChange?: (storeId: string) => void;
  dateValue?: DateRange | undefined;
  onDateChange?: (range: DateRange | undefined) => void;
}

// Store options, including an 'All Stores' option at the top
const stores = [
  { id: "all", name: "All Stores" },
  { id: "STR-001", name: "Kings Hill" },
  { id: "STR-002", name: "Tonbridge Main" },
  { id: "STR-003", name: "Tunbridge Wells" },
  { id: "STR-004", name: "Southborough" },
  { id: "STR-005", name: "Maidstone" },
  { id: "STR-006", name: "Sevenoaks" },
];

export function DateAndStoreFilter({ className, storeValue, onStoreChange, dateValue, onDateChange }: DateAndStoreFilterProps) {
  // Multi-select state: array of selected store IDs (default to 'all')
  const [selectedStores, setSelectedStores] = React.useState<string[]>(storeValue ? storeValue.split(",") : ["all"]);
  const [date, setDate] = React.useState<DateRange | undefined>(dateValue ?? {
    from: new Date(2023, 0, 1),
    to: new Date(),
  });
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  React.useEffect(() => {
    if (onStoreChange) onStoreChange(selectedStores.includes("all") ? "all" : selectedStores.join(","));
  }, [selectedStores]);
  React.useEffect(() => {
    if (onDateChange) onDateChange(date);
  }, [date]);

  // Helper for toggling store selection
  const handleStoreToggle = (id: string) => {
    if (id === "all") {
      setSelectedStores(["all"]);
    } else {
      let next;
      if (selectedStores.includes(id)) {
        next = selectedStores.filter(s => s !== id && s !== "all");
        if (next.length === 0) next = ["all"];
      } else {
        next = selectedStores.filter(s => s !== "all").concat(id);
      }
      setSelectedStores(next);
    }
    // Do NOT close the dropdown on selection
  };

  // Label for button
  const displayLabel = selectedStores.includes("all")
    ? "All Stores"
    : stores.filter(s => selectedStores.includes(s.id) && s.id !== "all").map(s => s.name).join(", ");

  // List of months
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ]
  
  // List of recent years
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)
  
  // Function to select an entire month
  const selectEntireMonth = (year: number, monthIndex: number) => {
    const monthStart = startOfMonth(new Date(year, monthIndex))
    const monthEnd = endOfMonth(new Date(year, monthIndex))
    
    setDate({
      from: monthStart,
      to: monthEnd,
    })
    
    setCurrentMonth(monthStart)
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Multi-select dropdown using DropdownMenu */}
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <button className="w-[220px] border border-input bg-white rounded-md px-3 py-2 text-sm flex items-center justify-between shadow-xs focus:outline-none">
            <span className="truncate">{displayLabel || "Select store(s)"}</span>
            <ChevronDown className="size-4 opacity-50 ml-2" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[220px]">
          {stores.map(store => (
            <DropdownMenuItem asChild key={store.id} className={store.id === "all" ? "font-semibold" : ""}>
              <label className="flex items-center gap-2 cursor-pointer w-full" onClick={e => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedStores.includes(store.id)}
                  onChange={() => handleStoreToggle(store.id)}
                  className="accent-primary"
                />
                <span>{store.name}</span>
              </label>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 text-center" align="start">
          <div className="p-2 border-b flex items-center justify-center">
            <div className="flex gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1 h-7 px-2 text-center">
                    {format(currentMonth, "MMMM")}
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="text-center">
                  {months.map((month, index) => (
                    <DropdownMenuItem 
                      key={month} 
                      onClick={() => {
                        const newDate = new Date(currentMonth)
                        newDate.setMonth(index)
                        setCurrentMonth(newDate)
                        selectEntireMonth(newDate.getFullYear(), index)
                      }}
                      className="justify-center"
                    >
                      {month}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1 h-7 px-2 text-center">
                    {format(currentMonth, "yyyy")}
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="text-center">
                  {years.map((year) => (
                    <DropdownMenuItem 
                      key={year} 
                      onClick={() => {
                        const newDate = new Date(currentMonth)
                        newDate.setFullYear(year)
                        setCurrentMonth(newDate)
                        selectEntireMonth(year, newDate.getMonth())
                      }}
                      className="justify-center"
                    >
                      {year}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={1}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className="p-2 mx-auto"
            classNames={{
              caption: "flex justify-center pt-1 relative items-center w-full text-center",
              caption_label: "text-sm font-medium text-center mx-auto",
              cell: "text-center",
              day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 mx-auto",
              head_cell: "text-center text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
            }}
          />
          <div className="p-2 border-t flex justify-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                const thisMonth = new Date()
                selectEntireMonth(thisMonth.getFullYear(), thisMonth.getMonth())
              }}
              className="h-7 px-2 text-xs"
            >
              Current Month
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                const prevMonth = subMonths(new Date(), 1)
                selectEntireMonth(prevMonth.getFullYear(), prevMonth.getMonth())
              }}
              className="h-7 px-2 text-xs"
            >
              Previous Month
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// Backwards compatibility export
export { DateAndStoreFilter as DateRangePicker };