"use client"

import * as React from "react"
import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function PurchaseInvoiceSettings() {
  const [searchTerm, setSearchTerm] = useState("")
  
  // Sample account code mapping data
  const accountCodeMappings = [
    { id: 1, nominalCode: "1001", description: "Food without VAT", xeroCode: "5001" },
    { id: 2, nominalCode: "1100", description: "Non Food with VAT", xeroCode: "5002" },
    { id: 3, nominalCode: "1101", description: "Non Food without VAT", xeroCode: "5003" },
    { id: 4, nominalCode: "1200", description: "Store Equipment with VAT", xeroCode: "7804" },
    { id: 5, nominalCode: "1300", description: "Cleaning Equipment with VAT", xeroCode: "7799" },
    { id: 6, nominalCode: "1400", description: "Clothing with VAT", xeroCode: "8203" },
    { id: 7, nominalCode: "1500", description: "IT equipment with VAT", xeroCode: "0041" },
    { id: 8, nominalCode: "1600", description: "Delivery", xeroCode: "5100" },
    { id: 9, nominalCode: "1900", description: "SS Rebate", xeroCode: "5004" },
    { id: 10, nominalCode: "2000", description: "Royalties", xeroCode: "6002" },
  ]

  // Sample invoice history data
  const invoiceHistory = [
    { id: 1, date: "2023-03-15", invoiceNumber: "INV-001", supplier: "Supplier A", status: "Processed", amount: "£2,450.00" },
    { id: 2, date: "2023-03-10", invoiceNumber: "INV-002", supplier: "Supplier B", status: "Processed", amount: "£1,875.50" },
    { id: 3, date: "2023-03-05", invoiceNumber: "INV-003", supplier: "Supplier C", status: "Processed", amount: "£3,210.75" },
    { id: 4, date: "2023-02-28", invoiceNumber: "INV-004", supplier: "Supplier A", status: "Processed", amount: "£1,950.00" },
    { id: 5, date: "2023-02-20", invoiceNumber: "INV-005", supplier: "Supplier D", status: "Processed", amount: "£4,125.25" },
  ]

  const filteredMappings = accountCodeMappings.filter(mapping => 
    mapping.nominalCode.includes(searchTerm) || 
    mapping.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mapping.xeroCode.includes(searchTerm)
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Code Mapping</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search bar */}
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search codes or descriptions"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button>Add New Mapping</Button>
          </div>

          {/* Table header */}
          <div className="flex items-center px-2 py-1 border-b bg-muted text-xs font-semibold">
            <span className="w-1/4">DOM Nominal Code</span>
            <span className="w-2/4">Description</span>
            <span className="w-1/4">Xero Nominal Code</span>
            <span className="w-1/4">Actions</span>
          </div>

          {/* Scrollable mappings list */}
          <ScrollArea className="h-[300px] w-full">
            <div>
              {filteredMappings.map((mapping) => (
                <div
                  key={mapping.id}
                  className="flex items-center px-2 py-3 border-b hover:bg-accent transition-colors"
                >
                  <span className="w-1/4 text-sm">{mapping.nominalCode}</span>
                  <span className="w-2/4 text-sm">{mapping.description}</span>
                  <span className="w-1/4 text-sm">{mapping.xeroCode}</span>
                  <div className="w-1/4 flex">
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Purchase Invoice Processing History</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Table header */}
          <div className="flex items-center px-2 py-1 border-b bg-muted text-xs font-semibold">
            <span className="w-1/5">Date</span>
            <span className="w-1/5">Invoice Number</span>
            <span className="w-1/5">Supplier</span>
            <span className="w-1/5">Status</span>
            <span className="w-1/5">Amount</span>
          </div>

          {/* Scrollable invoice list */}
          <ScrollArea className="h-[300px] w-full">
            <div>
              {invoiceHistory.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center px-2 py-3 border-b hover:bg-accent transition-colors"
                >
                  <span className="w-1/5 text-sm">{invoice.date}</span>
                  <span className="w-1/5 text-sm">{invoice.invoiceNumber}</span>
                  <span className="w-1/5 text-sm">{invoice.supplier}</span>
                  <span className="w-1/5 text-sm">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {invoice.status}
                    </span>
                  </span>
                  <span className="w-1/5 text-sm">{invoice.amount}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
} 