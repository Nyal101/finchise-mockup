"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DateAndStoreFilter } from "@/components/date-range-picker";
import { DateRange } from "react-day-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { invoices } from "../Purchases(Old)/invoiceData";
import { JournalDialog, Journal, JournalLine } from "../components/JournalDialog";

// Types
interface FilterParams {
  dateRange?: DateRange;
  stores?: string;
  search?: string;
}

// Convert invoice journal entries to the Journal format
function convertInvoiceJournals(): Journal[] {
  return invoices
    .filter(invoice => invoice.requiresJournaling && invoice.journalEntries)
    .map(invoice => {
      // Convert journal entries to journal lines
      const lines: JournalLine[] = invoice.journalEntries!.map(entry => ({
        description: entry.description,
        account: entry.account,
        store: invoice.store,
        debit: entry.debit,
        credit: entry.credit,
        taxRate: entry.debit > 0 && invoice.vatRate > 0 ? `VAT ${invoice.vatRate}%` : "No VAT"
      }));

      return {
        id: `invoice-${invoice.id}`,
        status: "pending" as const,
        type: "utility" as const,
        narration: `${invoice.supplier} ${invoice.invoiceNumber}`,
        date: invoice.date,
        lines,
        sourceInvoiceId: invoice.id
      };
    });
}

// Mock data for journals
const baseMockJournals: Journal[] = [
  {
    id: "1",
    status: "pending",
    type: "accrual",
    narration: "Insurance-2025- Mar to Jun",
    date: new Date("2025-04-01"),
    lines: [
      { description: "Insurance-2025- Mar to Jun", account: "8204 - Insurance", store: "MAIDSTONE", debit: 1380.35, credit: 0, taxRate: "No VAT" },
      { description: "Insurance-2025- Mar to Jun", account: "1104 - Prepayment Rent", store: "MAIDSTONE", debit: 0, credit: 1380.35, taxRate: "No VAT" },
    ],
  },
  {
    id: "2",
    status: "approved",
    type: "accrual",
    narration: "Insurance-2025- Mar to Jun",
    date: new Date("2025-04-01"),
    lines: [
      { description: "Insurance-2025- Mar to Jun", account: "8204 - Insurance", store: "BARMING", debit: 1465.21, credit: 0, taxRate: "No VAT" },
      { description: "Insurance-2025- Mar to Jun", account: "1104 - Prepayment Rent", store: "BARMING", debit: 0, credit: 1465.21, taxRate: "No VAT" },
    ],
  },
  {
    id: "3",
    status: "approved",
    type: "prepayment",
    narration: "Insurance-2025- Mar to Jun",
    date: new Date("2025-04-01"),
    lines: [
      { description: "Insurance-2025- Mar to Jun", account: "8204 - Insurance", store: "KINGS HILL", debit: 1429.38, credit: 0, taxRate: "No VAT" },
      { description: "Insurance-2025- Mar to Jun", account: "1104 - Prepayment Rent", store: "KINGS HILL", debit: 0, credit: 1429.38, taxRate: "No VAT" },
    ],
  },
];

// Combine mock journals with invoice journals
const mockJournals = [...baseMockJournals, ...convertInvoiceJournals()];

function filterJournals(journals: Journal[], { dateRange, stores, search }: FilterParams): Journal[] {
  return journals.filter(journal => {
    // Filter by date
    const journalDate = journal.date;
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

function JournalsContent() {
  const searchParams = useSearchParams();
  const invoiceId = searchParams.get('invoiceId');
  
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [storeValue, setStoreValue] = React.useState<string>("all");
  const [search, setSearch] = React.useState<string>("");
  const [selectedJournal, setSelectedJournal] = React.useState<Journal | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState("pending");

  // Handle opening journal from URL parameter
  React.useEffect(() => {
    if (invoiceId) {
      const journal = mockJournals.find(j => j.sourceInvoiceId === invoiceId);
      if (journal) {
        setSelectedJournal(journal);
        setDialogOpen(true);
        setActiveTab(journal.status === "pending" ? "pending" : journal.type);
      }
    }
  }, [invoiceId]);

  // Handle editing toggle
  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  // Handle journal save
  const handleJournalSave = (journal: Journal) => {
    // In a real app, this would update a server
    console.log("Saving journal:", journal);
    
    // Update the journal in the UI (this is just for demo purposes)
    // In a real app, you'd update the state or refetch data
  };

  // Filtered data for each section
  const pendingJournals = filterJournals(mockJournals.filter(j => j.status === "pending"), { dateRange, stores: storeValue, search });
  const accrualJournals = filterJournals(mockJournals.filter(j => j.type === "accrual" && j.status === "approved"), { dateRange, stores: storeValue, search });
  const prepaymentJournals = filterJournals(mockJournals.filter(j => j.type === "prepayment" && j.status === "approved"), { dateRange, stores: storeValue, search });
  const utilityJournals = filterJournals(mockJournals.filter(j => j.type === "utility" && j.status === "approved"), { dateRange, stores: storeValue, search });

  // Table rendering helper
  function renderJournalTable(journals: Journal[]) {
    return journals.length > 0 ? (
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
              <TableCell>{format(journal.date, "dd/MM/yyyy")}</TableCell>
              <TableCell>{[...new Set(journal.lines.map((l: JournalLine) => l.store))].join(", ")}</TableCell>
              <TableCell>
                <Button size="sm" variant="outline" onClick={() => { setSelectedJournal(journal); setDialogOpen(true); setIsEditing(false); }}>
                  <Edit className="w-4 h-4 mr-1" /> View/Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    ) : (
      <div className="p-8 text-center text-muted-foreground">
        No journals found matching your filters
      </div>
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
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="pending">Pending for Approval</TabsTrigger>
              <TabsTrigger value="accrual">Accrual Journals</TabsTrigger>
              <TabsTrigger value="prepayment">Prepayment Journals</TabsTrigger>
              <TabsTrigger value="utility">Utility Journals</TabsTrigger>
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
            <TabsContent value="utility">
              {renderJournalTable(utilityJournals)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <JournalDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        journal={selectedJournal} 
        isEditing={isEditing}
        onEditToggle={toggleEditing}
        onSave={handleJournalSave}
      />
    </div>
  );
}

export default function JournalsPage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <JournalsContent />
    </React.Suspense>
  );
}
