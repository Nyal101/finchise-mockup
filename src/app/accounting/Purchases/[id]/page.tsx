"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { format } from "date-fns"
import { v4 } from "uuid"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// Import types from the components/types.ts file
import { LineItem, StoreAllocation, InvoiceData } from "./../components/types"

// Import utilities
import { getStatusClass } from "@/app/accounting/Purchases/components/utils"

// Import extracted components
import StoreAllocationSection from "./../components/StoreAllocationSection"
import LineItemsSection from "./../components/LineItemsSection"
import InvoiceDetailsSection from "./../components/InvoiceDetailsSection"
import NotesSection from "./../components/NotesSection"
import InvoiceSummary from "./../components/InvoiceSummary"
import InvoicePreview from "./../components/InvoicePreview"
import InvoiceActions from "./../components/InvoiceActions"

// Create a client component that will use the params properly
export default function InvoiceDetailPage() {
  // Use the useParams hook to safely access route params
  const params = useParams();
  const id = params && 'id' in params ? (params.id as string) : undefined;

  // Find the invoice with the provided ID (do NOT return early yet)
  const invoiceData = id
    ? invoices.find((invoice: InvoiceData) => invoice.id === id)
    : undefined;

  // Always call hooks at the top level
  const [invoice, setInvoice] = useState<InvoiceData>(() => {
    if (invoiceData) {
      return {
        ...invoiceData,
        date: new Date(invoiceData.date),
        lineItems: [],
        storeAllocations: [],
      };
    }
    // fallback dummy invoice to avoid hook conditional
    return {
      id: '',
      invoiceNumber: '',
      store: '',
      supplier: '',
      date: new Date(),
      subtotal: 0,
      vatRate: 0,
      vat: 0,
      total: 0,
      accountCode: '',
      invoiceType: '',
      status: '',
      previewType: '',
      previewUrl: '',
      notes: '',
      archived: false,
      deleted: false,
      lineItems: [
        {
          id: v4(),
          description: '',
          quantity: 0,
          unitPrice: 0,
          total: 0,
          accountCode: '',
        }
      ],
      storeAllocations: [
        {
          id: v4(),
          store: '',
          percentage: 100,
          amount: 0,
        }
      ],
    };
  });
  const [isEditing, setIsEditing] = useState(false);
  const [lineItems, setLineItems] = useState<LineItem[]>(invoice.lineItems || []);
  const [storeAllocations, setStoreAllocations] = useState<StoreAllocation[]>(invoice.storeAllocations || [
    { id: v4(), store: invoice.store, percentage: 100, amount: invoice.total }
  ]);

  // After all hooks, now check for invoice existence
  if (!invoiceData) {
    return <div>Invoice not found.</div>;
  }

  const stores = [
    "Kings Hill",
    "Tonbridge",
    "Tunbridge Wells",
    "Southborough",
    "Maidstone"
  ]

  const invoiceTypes = [
    "Purchase Invoice",
    "Sales Invoice",
    "Credit Note"
  ]

  const statuses = [
    "AI Processed",
    "Pending AI",
    "Needs Human Review",
    "Duplicate?"
  ]
  
  const accountCodes = [
    "4000-SALES",
    "5000-COGS",
    "6200-MAINT",
    "6300-CLEAN",
    "6400-UTIL",
    "6500-OFFICE",
    "6700-TECH"
  ]

  // Handle individual field changes
  const handleInvoiceFieldChange = (field: keyof InvoiceData, value: unknown) => {
    setInvoice(prev => ({
      ...prev,
      [field]: value
    }));
  };

  
  const handleNotesChange = (notes: string) => {
    handleInvoiceFieldChange('notes', notes);
  };

  // Calculate totals and update invoice
  const calculateInvoiceTotals = () => {
    const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const vat = subtotal * (invoice.vatRate / 100);
    const total = subtotal + vat;
    
    setInvoice(prev => ({
      ...prev,
      subtotal,
      vat,
      total
    }));
    
    // Update store allocations to reflect new total
    if (storeAllocations.length > 0) {
      const newAllocations = storeAllocations.map(allocation => {
        if (storeAllocations.length === 1) {
          // If there's only one allocation, it gets 100% of the total
          return {
            ...allocation,
            percentage: 100,
            amount: total
          };
        } else {
          // Otherwise, keep the same percentage but update the amount
          return {
            ...allocation,
            amount: (allocation.percentage / 100) * total
          };
        }
      });
      
      setStoreAllocations(newAllocations);
    }
  };

  const handleSaveChanges = () => {
    // Update invoice with current lineItems and recalculate totals
    calculateInvoiceTotals();
    
    // Update line items and store allocations
    setInvoice(prev => ({
      ...prev,
      lineItems,
      storeAllocations
    }));
    
    // Exit edit mode
    setIsEditing(false);
    
    // Show success message
    console.log("Changes saved successfully");
  };

  const handleCancel = () => {
    // Reset form values to original invoice data
    setLineItems(invoice.lineItems);
    setStoreAllocations(invoice.storeAllocations || [
      { id: v4(), store: invoice.store, percentage: 100, amount: invoice.total }
    ]);
    
    // Exit edit mode
    setIsEditing(false);
  };

  // Update totals when line items change
  const handleLineItemsUpdate = (subtotal: number) => {
    const vat = subtotal * (invoice.vatRate / 100);
    const total = subtotal + vat;
    
    setInvoice(prev => ({
      ...prev,
      subtotal,
      vat,
      total
    }));
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/accounting/invoices">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Invoice {invoice.invoiceNumber}</h1>
        </div>
        <InvoiceActions 
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onSave={handleSaveChanges}
          onCancel={handleCancel}
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 h-full">
        {/* Left side: Invoice Preview */}
        <Card className="flex flex-col h-full">
          <CardHeader>
            <div>
              <CardTitle className="text-2xl">Invoice Preview</CardTitle>
              <CardDescription>Uploaded on {format(invoice.date, "dd MMMM yyyy")} at 09:45 AM by: ____????____</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <InvoicePreview
              previewType={invoice.previewType}
              previewUrl={invoice.previewUrl}
              invoiceNumber={invoice.invoiceNumber}
              supplier={invoice.supplier}
              store={invoice.store}
              date={invoice.date}
              total={invoice.total}
            />
          </CardContent>
        </Card>
        
        {/* Right side: Invoice Details */}
        <Card className="flex flex-col h-full">
          <CardHeader className="flex flex-row items-center justify-between py-3">
            <div>
              <CardTitle className="text-xl">Invoice #{invoice.invoiceNumber}</CardTitle>
              <CardDescription className="text-xs">View the details of invoice #{invoice.invoiceNumber}</CardDescription>
            </div>
            
            <InvoiceActions 
              isEditing={isEditing}
              onEdit={() => setIsEditing(true)}
              onSave={handleSaveChanges}
              onCancel={handleCancel}
              cardHeader={true}
            />
          </CardHeader>
          <CardContent className="space-y-3 flex-grow overflow-auto p-3">
            <InvoiceDetailsSection 
              invoice={invoice}
              isEditing={isEditing}
              stores={stores}
              statuses={statuses}
              invoiceTypes={invoiceTypes}
              accountCodes={accountCodes}
              onInvoiceChange={handleInvoiceFieldChange}
              getStatusClass={getStatusClass}
            />
            
            <Separator className="my-1" />
            
            <LineItemsSection 
              lineItems={lineItems}
              setLineItems={setLineItems}
              isEditing={isEditing}
              onTotalsUpdate={handleLineItemsUpdate}
            />
            
            <InvoiceSummary 
              subtotal={invoice.subtotal}
              vatRate={invoice.vatRate}
              vat={invoice.vat}
              total={invoice.total}
            />
            
            <Separator className="my-1" />
            
            <NotesSection 
              notes={invoice.notes}
              isEditing={isEditing}
              onNotesChange={handleNotesChange}
            />
            
            <Separator className="my-1" />
            
            <StoreAllocationSection 
              storeAllocations={storeAllocations}
              setStoreAllocations={setStoreAllocations}
              invoiceTotal={invoice.total}
              isEditing={isEditing}
              stores={stores}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Sample invoice details - typically this would come from an API call
import { invoices } from "../invoiceData";