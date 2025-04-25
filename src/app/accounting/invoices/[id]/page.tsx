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
import { LineItem, StoreAllocation, InvoiceData } from "@/app/accounting/invoices/components/types"

// Import utilities
import { getStatusClass } from "@/app/accounting/invoices/components/utils"

// Import extracted components
import StoreAllocationSection from "@/app/accounting/invoices/components/StoreAllocationSection"
import LineItemsSection from "@/app/accounting/invoices/components/LineItemsSection"
import InvoiceDetailsSection from "@/app/accounting/invoices/components/InvoiceDetailsSection"
import NotesSection from "@/app/accounting/invoices/components/NotesSection"
import InvoiceSummary from "@/app/accounting/invoices/components/InvoiceSummary"
import InvoicePreview from "@/app/accounting/invoices/components/InvoicePreview"
import InvoiceActions from "@/app/accounting/invoices/components/InvoiceActions"

// Create a client component that will use the params properly
export default function InvoiceDetailPage() {
  // Use the useParams hook to safely access route params
  const params = useParams();
  const id = params.id as string;

  // Find the invoice with the provided ID
  const invoiceData = invoiceDetails.find(invoice => invoice.id === id) || invoiceDetails[0];
  
  // Initialize with proper type casting
  const [invoice, setInvoice] = useState<InvoiceData>({
    ...invoiceData,
    notes: invoiceData.notes || '',
    lineItems: invoiceData.lineItems.map(item => ({
      id: v4(),
      description: item.description,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      total: item.quantity * item.unitPrice,
      accountCode: item.accountCode
    })),
    storeAllocations: invoiceData.storeAllocations || [
      { id: v4(), store: invoiceData.store, percentage: 100, amount: invoiceData.total }
    ]
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [lineItems, setLineItems] = useState<LineItem[]>(invoice.lineItems);
  const [date, setDate] = useState<Date | undefined>(invoice.date);
  
  // In the component function, add new state for store allocations
  const [storeAllocations, setStoreAllocations] = useState<StoreAllocation[]>(invoice.storeAllocations || [
    { id: v4(), store: invoice.store, percentage: 100, amount: invoice.total }
  ]);
  
  if (!invoice) {
    return <div>Invoice not found</div>
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

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      handleInvoiceFieldChange('date', date);
      setDate(date);
    }
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
    setDate(invoice.date);
    
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
const invoiceDetails = [
  {
    id: "1",
    invoiceNumber: "INV-001",
    store: "Kings Hill",
    supplier: "Coca Cola",
    date: new Date("2023-05-01"),
    subtotal: 380.65,
    vatRate: 20,
    vat: 91.36,
    total: 456.78,
    accountCode: "5000-COGS",
    invoiceType: "Purchase Invoice",
    status: "AI Processed",
    previewType: "pdf",
    previewUrl: "invoice-coca-cola.pdf",
    archived: false,
    deleted: false,
    notes: "This invoice was processed by AI and verified by the finance team.",
    lineItems: [
      {
        description: "Restaurant Supplies",
        quantity: 2,
        unitPrice: 45.50,
        accountCode: "SUP-001"
      },
      {
        description: "Food Ingredients",
        quantity: 5,
        unitPrice: 37.25,
        accountCode: "ING-002"
      },
      {
        description: "Cleaning Services",
        quantity: 1,
        unitPrice: 120.40,
        accountCode: "SER-003"
      }
    ],
    storeAllocations: [
      { id: "allocation-1", store: "Kings Hill", percentage: 100, amount: 456.78 }
    ]
  },
  {
    id: "2",
    invoiceNumber: "INV-002",
    store: "Tonbridge",
    supplier: "Eden Farms",
    date: new Date("2023-05-05"),
    subtotal: 192.92,
    vatRate: 20,
    vat: 46.30,
    total: 231.50,
    accountCode: "5000-COGS",
    invoiceType: "Purchase Invoice",
    status: "AI Processed",
    previewType: "pdf",
    previewUrl: "invoice-eden-farms.pdf",
    archived: false,
    deleted: false,
    lineItems: [
      {
        description: "Packaging Materials",
        quantity: 3,
        unitPrice: 32.50,
        accountCode: "PAC-001"
      },
      {
        description: "Beverages",
        quantity: 10,
        unitPrice: 9.50,
        accountCode: "BEV-002"
      },
      {
        description: "Marketing Materials",
        quantity: 1,
        unitPrice: 12.42,
        accountCode: "MKT-003"
      }
    ],
    storeAllocations: [
      { id: "allocation-2", store: "Tonbridge", percentage: 100, amount: 231.50 }
    ]
  },
  {
    id: "3",
    invoiceNumber: "INV-003",
    store: "Tunbridge Wells",
    supplier: "Pepsi Co",
    date: new Date("2023-05-12"),
    subtotal: 657.71,
    vatRate: 20,
    vat: 157.85,
    total: 789.25,
    accountCode: "5000-COGS",
    invoiceType: "Purchase Invoice",
    status: "Pending AI",
    previewType: "placeholder",
    previewUrl: "",
    archived: false,
    deleted: false,
    lineItems: [
      {
        description: "Kitchen Equipment",
        quantity: 1,
        unitPrice: 450.00,
        accountCode: "EQP-001"
      },
      {
        description: "Staff Uniforms",
        quantity: 5,
        unitPrice: 35.75,
        accountCode: "UNI-002"
      },
      {
        description: "Maintenance Service",
        quantity: 1,
        unitPrice: 23.96,
        accountCode: "SER-003"
      }
    ],
    storeAllocations: [
      { id: "allocation-3", store: "Tunbridge Wells", percentage: 100, amount: 789.25 }
    ]
  },
  {
    id: "4",
    invoiceNumber: "INV-004",
    store: "Kings Hill",
    supplier: "Office Supplies Ltd",
    date: new Date("2023-05-15"),
    subtotal: 288.00,
    vatRate: 20,
    vat: 69.12,
    total: 345.60,
    accountCode: "6500-OFFICE",
    invoiceType: "Purchase Invoice",
    status: "AI Processed",
    previewType: "placeholder",
    previewUrl: "",
    archived: false,
    deleted: false,
    lineItems: [
      {
        description: "Promotional Items",
        quantity: 4,
        unitPrice: 45.00,
        accountCode: "MKT-001"
      },
      {
        description: "Cleaning Supplies",
        quantity: 6,
        unitPrice: 18.00,
        accountCode: "SUP-002"
      }
    ],
    storeAllocations: [
      { id: "allocation-4", store: "Kings Hill", percentage: 100, amount: 345.60 }
    ]
  },
  {
    id: "5",
    invoiceNumber: "INV-005",
    store: "Tonbridge",
    supplier: "Utility Services",
    date: new Date("2023-05-20"),
    subtotal: 473.25,
    vatRate: 20,
    vat: 113.58,
    total: 567.90,
    accountCode: "6400-UTIL",
    invoiceType: "Purchase Invoice",
    status: "Needs Human Review",
    previewType: "placeholder",
    previewUrl: "",
    archived: false,
    deleted: false,
    lineItems: [
      {
        description: "Furniture Repair",
        quantity: 1,
        unitPrice: 350.00,
        accountCode: "REP-001"
      },
      {
        description: "Office Supplies",
        quantity: 8,
        unitPrice: 15.40,
        accountCode: "SUP-003"
      }
    ],
    storeAllocations: [
      { id: "allocation-5", store: "Tonbridge", percentage: 100, amount: 567.90 }
    ]
  },
  {
    id: "6",
    invoiceNumber: "CN-001",
    store: "Tunbridge Wells",
    supplier: "Eden Farms",
    date: new Date("2023-05-25"),
    subtotal: 102.88,
    vatRate: 20,
    vat: 24.69,
    total: 123.45,
    accountCode: "5000-COGS",
    invoiceType: "Credit Note",
    status: "Pending AI",
    previewType: "placeholder",
    previewUrl: "",
    archived: false,
    deleted: false,
    lineItems: [
      {
        description: "Food Items Return",
        quantity: 3,
        unitPrice: 30.50,
        accountCode: "RET-001"
      },
      {
        description: "Damaged Goods",
        quantity: 1,
        unitPrice: 11.38,
        accountCode: "RET-002"
      }
    ],
    storeAllocations: [
      { id: "allocation-6", store: "Tunbridge Wells", percentage: 100, amount: 123.45 }
    ]
  },
  {
    id: "7",
    invoiceNumber: "SI-001",
    store: "Southborough",
    supplier: "Marketing Agency",
    date: new Date("2023-06-01"),
    subtotal: 565.75,
    vatRate: 20,
    vat: 135.78,
    total: 678.90,
    accountCode: "4000-SALES",
    invoiceType: "Sales Invoice",
    status: "AI Processed",
    previewType: "placeholder",
    previewUrl: "",
    archived: false,
    deleted: false,
    lineItems: [
      {
        description: "Marketing Services",
        quantity: 1,
        unitPrice: 565.75,
        accountCode: "SER-001"
      }
    ],
    storeAllocations: [
      { id: "allocation-7", store: "Southborough", percentage: 100, amount: 678.90 }
    ]
  },
  {
    id: "8",
    invoiceNumber: "SI-002",
    store: "Southborough",
    supplier: "Equipment Ltd",
    date: new Date("2023-06-05"),
    subtotal: 195.47,
    vatRate: 20,
    vat: 46.91,
    total: 234.56,
    accountCode: "4000-SALES",
    invoiceType: "Sales Invoice",
    status: "Needs Human Review",
    previewType: "placeholder",
    previewUrl: "",
    archived: false,
    deleted: false,
    lineItems: [
      {
        description: "Equipment Sale",
        quantity: 1,
        unitPrice: 195.47,
        accountCode: "SAL-001"
      }
    ],
    storeAllocations: [
      { id: "allocation-8", store: "Southborough", percentage: 100, amount: 234.56 }
    ]
  }
]; 