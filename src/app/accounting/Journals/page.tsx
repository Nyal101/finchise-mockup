"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DateAndStoreFilter } from "@/components/date-range-picker";
import { DateRange } from "react-day-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types
interface JournalLine {
  description: string;
  account: string;
  store: string;
  debit?: number;
  credit?: number;
}

interface Journal {
  id: number;
  status: "pending" | "approved";
  type: "accrual" | "prepayment";
  narration: string;
  date: string;
  lines: JournalLine[];
}

interface FilterParams {
  dateRange?: DateRange;
  stores?: string;
  search?: string;
}

// Mock data for journals
const mockJournals: Journal[] = [
  {
    id: 1,
    status: "pending",
    type: "accrual",
    narration: "Insurance-2025- Mar to Jun",
    date: "2025-04-01",
    lines: [
      { description: "Insurance-2025- Mar to Jun", account: "8204 - Insurance", store: "MAIDSTONE", debit: 1380.35, credit: 0 },
      { description: "Insurance-2025- Mar to Jun", account: "1104 - Prepayment Rent", store: "MAIDSTONE", debit: 0, credit: 1380.35 },
    ],
  },
  {
    id: 2,
    status: "approved",
    type: "accrual",
    narration: "Insurance-2025- Mar to Jun",
    date: "2025-04-01",
    lines: [
      { description: "Insurance-2025- Mar to Jun", account: "8204 - Insurance", store: "BARMING", debit: 1465.21, credit: 0 },
      { description: "Insurance-2025- Mar to Jun", account: "1104 - Prepayment Rent", store: "BARMING", debit: 0, credit: 1465.21 },
    ],
  },
  {
    id: 3,
    status: "approved",
    type: "prepayment",
    narration: "Insurance-2025- Mar to Jun",
    date: "2025-04-01",
    lines: [
      { description: "Insurance-2025- Mar to Jun", account: "8204 - Insurance", store: "KINGS HILL", debit: 1429.38, credit: 0 },
      { description: "Insurance-2025- Mar to Jun", account: "1104 - Prepayment Rent", store: "KINGS HILL", debit: 0, credit: 1429.38 },
    ],
  },
  // Add more mock journals as needed
];

function filterJournals(journals: Journal[], { dateRange, stores, search }: FilterParams): Journal[] {
  return journals.filter(journal => {
    // Filter by date
    const journalDate = new Date(journal.date);
    const inDateRange = !dateRange?.from || !dateRange?.to || (
      journalDate >= dateRange.from && journalDate <= dateRange.to
    );
    // Filter by stores (multi-select)
    const inStores = !stores || stores === "all" || journal.lines.some(line => stores.split(",").includes(line.store.toUpperCase()));
    // Filter by search
    const inSearch = !search || journal.narration.toLowerCase().includes(search.toLowerCase());
    return inDateRange && inStores && inSearch;
  });
}

interface JournalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  journal: Journal | null;
}

function JournalDialog({ open, onOpenChange, journal }: JournalDialogProps) {
  if (!journal) return null;
  // Calculate totals
  const totalDebit = journal.lines.reduce((sum: number, l: JournalLine) => sum + (l.debit || 0), 0);
  const totalCredit = journal.lines.reduce((sum: number, l: JournalLine) => sum + (l.credit || 0), 0);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Posted Manual Journal #{journal.id}</DialogTitle>
          <DialogDescription>{journal.narration}</DialogDescription>
        </DialogHeader>
        <div className="mb-4 text-sm flex gap-8">
          <div><b>Date:</b> {journal.date}</div>
        </div>
        <Card className="mb-4">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Store</TableHead>
                  <TableHead>Debit GBP</TableHead>
                  <TableHead>Credit GBP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {journal.lines.map((line: JournalLine, idx: number) => (
                  <TableRow key={idx}>
                    <TableCell>{line.description}</TableCell>
                    <TableCell>{line.account}</TableCell>
                    <TableCell>{line.store}</TableCell>
                    <TableCell>{line.debit ? line.debit.toFixed(2) : ""}</TableCell>
                    <TableCell>{line.credit ? line.credit.toFixed(2) : ""}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-bold">TOTAL</TableCell>
                  <TableCell className="font-bold">{totalDebit.toFixed(2)}</TableCell>
                  <TableCell className="font-bold">{totalCredit.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button>Edit Journal</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function JournalsPage() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [storeValue, setStoreValue] = React.useState<string>("all");
  const [search, setSearch] = React.useState<string>("");
  const [selectedJournal, setSelectedJournal] = React.useState<Journal | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState("pending");

  // Filtered data for each section
  const pendingJournals = filterJournals(mockJournals.filter(j => j.status === "pending"), { dateRange, stores: storeValue, search });
  const accrualJournals = filterJournals(mockJournals.filter(j => j.type === "accrual" && j.status === "approved"), { dateRange, stores: storeValue, search });
  const prepaymentJournals = filterJournals(mockJournals.filter(j => j.type === "prepayment" && j.status === "approved"), { dateRange, stores: storeValue, search });

  // Table rendering helper
  function renderJournalTable(journals: Journal[]) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Narration</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Stores</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {journals.map((journal: Journal) => (
            <TableRow key={journal.id}>
              <TableCell>{journal.narration}</TableCell>
              <TableCell>{journal.date}</TableCell>
              <TableCell>{[...new Set(journal.lines.map((l: JournalLine) => l.store))].join(", ")}</TableCell>
              <TableCell>
                <Button size="sm" variant="outline" onClick={() => { setSelectedJournal(journal); setDialogOpen(true); }}>
                  <Edit className="w-4 h-4 mr-1" /> Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Journals</h1>
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by narration..."
              className="pl-8"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <DateAndStoreFilter
            storeValue={storeValue}
            onStoreChange={setStoreValue}
            dateValue={dateRange}
            onDateChange={setDateRange}
          />
        </div>
      </div>
      <Card>
        <CardContent className="p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="pending">Pending for Approval</TabsTrigger>
              <TabsTrigger value="accrual">Accrual Journals</TabsTrigger>
              <TabsTrigger value="prepayment">Prepayment Journals</TabsTrigger>
            </TabsList>
            <TabsContent value="pending">
              {renderJournalTable(pendingJournals)}
            </TabsContent>
            <TabsContent value="accrual">
              {renderJournalTable(accrualJournals)}
            </TabsContent>
            <TabsContent value="prepayment">
              {renderJournalTable(prepaymentJournals)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <JournalDialog open={dialogOpen} onOpenChange={setDialogOpen} journal={selectedJournal} />
    </div>
  );
}
