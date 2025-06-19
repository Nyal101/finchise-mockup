import * as React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Save, X, FileCog, Download, MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { SalesInvoiceData, SalesLineItem, JournalEntry, StoreAllocation } from "./types";
import LineItemsSection from "./LineItemsSection";
import SalesSummary from "./SalesSummary";
import NotesSection from "./NotesSection";
import SalesReceiptPreviewer from "./SalesReceiptPreviewer";
import JournalEntriesSection from "./JournalEntriesSection";
import StoreAllocationsSection from "./StoreAllocationsSection";
import SalesBot from "./SalesBot";
import ReceiptUploader from "./ReceiptUploader";

interface SalesInvoiceViewProps {
  invoice: SalesInvoiceData;
  onSave: (updatedInvoice: SalesInvoiceData) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string, archived: boolean) => void;
}

export default function SalesInvoiceView({
  invoice,
  onSave,
  onDelete,
  onArchive,
}: SalesInvoiceViewProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedInvoice, setEditedInvoice] = React.useState<SalesInvoiceData>(invoice);
  const [activeTab, setActiveTab] = React.useState("details");

  React.useEffect(() => {
    setEditedInvoice(invoice);
  }, [invoice]);

  const handleSave = () => {
    onSave(editedInvoice);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedInvoice(invoice);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this sales report?")) {
      onDelete(invoice.id);
    }
  };

  const handleArchive = () => {
    onArchive(invoice.id, !invoice.archived);
  };

  const handleNotesChange = (notes: string) => {
    setEditedInvoice((prev) => ({ ...prev, notes }));
  };

  const handleLineItemsChange = (lineItems: SalesLineItem[] | ((prevItems: SalesLineItem[]) => SalesLineItem[])) => {
    setEditedInvoice((prev) => {
      const newLineItems = typeof lineItems === "function" ? lineItems(prev.lineItems) : lineItems;
      
      // Calculate new totals
      const subtotal = newLineItems.reduce((sum, item) => sum + item.subtotal, 0);
      const vat = newLineItems.reduce((sum, item) => sum + item.vat, 0);
      const total = newLineItems.reduce((sum, item) => sum + item.total, 0);

      return {
        ...prev,
        lineItems: newLineItems,
        subtotal,
        vat,
        total,
      };
    });
  };

  const handleJournalEntriesChange = (journalEntries: JournalEntry[] | ((prev: JournalEntry[]) => JournalEntry[])) => {
    setEditedInvoice((prev) => ({
      ...prev,
      journalEntries: typeof journalEntries === "function" 
        ? journalEntries(prev.journalEntries || [])
        : journalEntries,
    }));
  };

  const handleStoreAllocationsChange = (allocations: StoreAllocation[] | ((prev: StoreAllocation[]) => StoreAllocation[])) => {
    setEditedInvoice((prev) => ({
      ...prev,
      storeAllocations: typeof allocations === "function"
        ? allocations(prev.storeAllocations || [])
        : allocations,
    }));
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      // In a real app, you would upload the file to a server
      // For demo purposes, we'll create a fake URL
      const fakeUrl = URL.createObjectURL(file);
      setEditedInvoice((prev) => ({
        ...prev,
        previewUrl: fakeUrl,
      }));
    } else {
      setEditedInvoice((prev) => ({
        ...prev,
        previewUrl: undefined,
      }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "processed":
        return "bg-green-500";
      case "pending":
        return "bg-amber-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h2 className="text-xl font-semibold">
            Sales Report: {editedInvoice.invoiceNumber}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            {editedInvoice.company && <Badge variant="outline">{editedInvoice.company}</Badge>}
            <Badge variant="outline">{editedInvoice.source}</Badge>
            <Badge variant="outline">{editedInvoice.store}</Badge>
            <div className="flex items-center gap-1">
              <div
                className={`w-2 h-2 rounded-full ${getStatusColor(
                  editedInvoice.status
                )}`}
              />
              <span className="text-sm">{editedInvoice.status}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => window.print()}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("journal")}>
                    <FileCog className="h-4 w-4 mr-2" />
                    View Journal Entries
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleArchive}>
                    {invoice.archived ? "Unarchive" : "Archive"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-red-500"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>

      <div className="p-4 border-b">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Company</p>
            <p>{editedInvoice.company || "-"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Date</p>
            <p>{format(editedInvoice.date, "PPP")}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Due Date</p>
            <p>{editedInvoice.dueDate ? format(editedInvoice.dueDate, "PPP") : "-"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Account Code</p>
            <p>{editedInvoice.accountCode || "-"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total</p>
            <p className="text-lg font-bold">
              £{editedInvoice.total.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="px-4 border-b">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="journal">Journal</TabsTrigger>
            <TabsTrigger value="allocations">Store Allocations</TabsTrigger>
            <TabsTrigger value="ai">AI Assistant</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="details" className="p-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <LineItemsSection
                lineItems={editedInvoice.lineItems}
                setLineItems={handleLineItemsChange}
                isEditing={isEditing}
              />

              <SalesSummary
                subtotal={editedInvoice.subtotal}
                vatRate={editedInvoice.vatRate}
                vat={editedInvoice.vat}
                total={editedInvoice.total}
                paymentMethod={editedInvoice.paymentMethod}
              />

              <NotesSection
                notes={editedInvoice.notes || ""}
                onNotesChange={handleNotesChange}
                isEditing={isEditing}
              />
            </div>

            <div className="space-y-6">
              {isEditing ? (
                <ReceiptUploader
                  onFileChange={handleFileChange}
                  currentFileName={editedInvoice.previewUrl?.split("/").pop()}
                />
              ) : null}

              <SalesReceiptPreviewer
                previewUrl={editedInvoice.previewUrl}
                receiptNumber={editedInvoice.invoiceNumber}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="journal" className="p-4">
          <JournalEntriesSection
            entries={editedInvoice.journalEntries || []}
            setEntries={handleJournalEntriesChange}
            isEditing={isEditing}
          />
        </TabsContent>

        <TabsContent value="allocations" className="p-4">
          <StoreAllocationsSection
            allocations={editedInvoice.storeAllocations || []}
            setAllocations={handleStoreAllocationsChange}
            totalAmount={editedInvoice.total}
            isEditing={isEditing}
          />
        </TabsContent>

        <TabsContent value="ai" className="p-4 h-[400px]">
          <SalesBot
            receiptNumber={editedInvoice.invoiceNumber}
            receiptStatus={editedInvoice.status}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}