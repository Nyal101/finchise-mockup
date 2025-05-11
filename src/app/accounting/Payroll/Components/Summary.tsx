import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthSelectorProps {
  centerMonth: Date;
  setCenterMonth: (date: Date) => void;
  selectedMonth: Date | null;
  setSelectedMonth: (date: Date) => void;
}

export function MonthSelector({ centerMonth, setCenterMonth, selectedMonth, setSelectedMonth }: MonthSelectorProps) {
  function getVisibleMonths(center: Date) {
    return [-2, -1, 0, 1, 2].map(offset => {
      const d = new Date(center);
      d.setMonth(center.getMonth() + offset);
      return d;
    });
  }
  const visibleMonths = getVisibleMonths(centerMonth);

  function scrollLeft() {
    const d = new Date(centerMonth);
    d.setMonth(centerMonth.getMonth() - 1);
    setCenterMonth(d);
  }
  function scrollRight() {
    const d = new Date(centerMonth);
    d.setMonth(centerMonth.getMonth() + 1);
    setCenterMonth(d);
  }

  return (
    <div className="flex items-center gap-2 w-full pb-2">
      <Button variant="ghost" size="icon" onClick={scrollLeft} aria-label="Previous months">
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <div className="flex gap-4 w-full justify-center">
        {visibleMonths.map((month) => (
          <Card
            key={month.toISOString()}
            className={`flex-1 flex flex-col items-center justify-between ${selectedMonth && month.getMonth() === selectedMonth.getMonth() && month.getFullYear() === selectedMonth.getFullYear() ? 'border-primary border-2 shadow-lg' : ''}`}
          >
            <CardHeader className="items-center">
              <CardTitle className="text-lg font-semibold">
                {month.toLocaleString('default', { month: 'long' })} {month.getFullYear()}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center flex flex-col gap-2 items-center">
              <div className="text-2xl font-bold text-muted-foreground py-2">--</div>
              <div className="text-xs text-muted-foreground">Summary</div>
              <Button size="sm" onClick={() => setSelectedMonth(month)}>
                View Payroll
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button variant="ghost" size="icon" onClick={scrollRight} aria-label="Next months">
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  );
}
