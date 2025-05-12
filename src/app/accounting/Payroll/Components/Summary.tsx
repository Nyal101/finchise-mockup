import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, XCircle, CheckCircle } from "lucide-react";

interface MonthSelectorProps {
  centerMonth: Date;
  setCenterMonth: (date: Date) => void;
  selectedMonth: Date | null;
  setSelectedMonth: (date: Date) => void;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function MonthSelector({ centerMonth, setCenterMonth, selectedMonth, setSelectedMonth }: MonthSelectorProps) {
  const [year, setYear] = React.useState(centerMonth.getFullYear());

  React.useEffect(() => {
    setYear(centerMonth.getFullYear());
  }, [centerMonth]);

  function goToPrevYear() {
    setYear(y => y - 1);
    setCenterMonth(new Date(year - 1, 0, 1));
  }
  function goToNextYear() {
    setYear(y => y + 1);
    setCenterMonth(new Date(year + 1, 0, 1));
  }
  function selectYear(y: number) {
    setYear(y);
    setCenterMonth(new Date(y, 0, 1));
  }

  // Mocked status for demo: Feb/Mar complete, rest incomplete
  function getStatusIcon(monthIdx: number) {
    if (monthIdx === 1 || monthIdx === 2) {
      return <CheckCircle className="text-green-500 w-6 h-6 absolute top-4 right-4" />;
    }
    return <XCircle className="text-red-500 w-6 h-6 absolute top-4 right-4" />;
  }

  return (
    <div className="w-full">
      {/* Year navigation */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <Button variant="ghost" size="icon" onClick={goToPrevYear} aria-label="Previous year">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        {[year - 5, year - 4, year - 3, year - 2, year - 1, year, year + 1, year + 2, year + 3, year + 4].map((y) => (
          <Button
            key={y}
            variant={y === year ? "default" : "ghost"}
            size="sm"
            className="mx-1 px-3"
            onClick={() => selectYear(y)}
          >
            {y}
          </Button>
        ))}
        <Button variant="ghost" size="icon" onClick={goToNextYear} aria-label="Next year">
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
      {/* 3x4 grid of months */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {MONTHS.map((month, idx) => {
          const isSelected = selectedMonth &&
            selectedMonth.getMonth() === idx &&
            selectedMonth.getFullYear() === year;
          return (
            <Card
              key={month}
              className={`relative flex flex-col items-start justify-between min-h-[180px] ${isSelected ? 'border-primary border-2 shadow-lg' : ''}`}
            >
              {getStatusIcon(idx)}
              <CardHeader className="items-start pb-2">
                <CardTitle className="text-2xl font-bold">{month}</CardTitle>
                <div className="text-md text-muted-foreground">{year}</div>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 w-full items-start">
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => setSelectedMonth(new Date(year, idx, 1))}
                >
                  View Payroll
                </Button>
                <Button size="sm" variant="secondary" className="w-full" disabled>
                  <span className="mr-2"><svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M12 3v14m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="4" y="17" width="16" height="4" rx="2" fill="currentColor" opacity=".1"/></svg></span>
                  Upload Data
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
