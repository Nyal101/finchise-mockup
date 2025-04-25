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

interface DateRangePickerProps {
  className?: string
}

export function DateRangePicker({ className }: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2023, 0, 1),
    to: new Date(),
  })
  
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  
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
    <div className={cn("grid gap-2", className)}>
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
  )
} 