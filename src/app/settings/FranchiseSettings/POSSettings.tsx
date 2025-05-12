"use client"

import * as React from "react"
import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function POSSettings() {
  const [searchTerm, setSearchTerm] = useState("")
  
  // Sample store mapping data
  const storeMappings = [
    { 
      id: 1, 
      storeName: "KDG Bexleyheath Limited - BEXLEYHEATH BROADWAY",
      salesStoreName: "Bexleyheath Broadway",
      deliverooStoreCode: "1098",
      uberEatsStoreCode: "1096",
      justEatStoreCode: "1097",
      gpukStoreCode: "1095",
      sskStoreCode: "1094",
      cashStoreCode: "1093",
      cardStoreCode: "1094"
    },
    { 
      id: 2, 
      storeName: "KDG Canterbury Limited - CANTERBURY",
      salesStoreName: "Canterbury",
      deliverooStoreCode: "1098",
      uberEatsStoreCode: "1096",
      justEatStoreCode: "1097",
      gpukStoreCode: "1095",
      sskStoreCode: "1094",
      cashStoreCode: "1093",
      cardStoreCode: "1094"
    },
    { 
      id: 3, 
      storeName: "KDG Gravesend Limited - GRAVESEND",
      salesStoreName: "Gravesend",
      deliverooStoreCode: "1098",
      uberEatsStoreCode: "1096",
      justEatStoreCode: "1097",
      gpukStoreCode: "1095",
      sskStoreCode: "1094",
      cashStoreCode: "1093",
      cardStoreCode: "1094"
    },
    { 
      id: 4, 
      storeName: "KDG Greenwich Limited - GREENWICH O2",
      salesStoreName: "O2 Arena",
      deliverooStoreCode: "1098",
      uberEatsStoreCode: "1096",
      justEatStoreCode: "1097",
      gpukStoreCode: "1095",
      sskStoreCode: "1094",
      cashStoreCode: "1093",
      cardStoreCode: "1094"
    },
    { 
      id: 5, 
      storeName: "KDG Hempstead Ltd - Hempstead",
      salesStoreName: "Hempstead",
      deliverooStoreCode: "1098",
      uberEatsStoreCode: "1096",
      justEatStoreCode: "1097",
      gpukStoreCode: "1095",
      sskStoreCode: "1094",
      cashStoreCode: "1093",
      cardStoreCode: "1094"
    },
    { 
      id: 6, 
      storeName: "KDG Maidstone Limited - BLUEWATER",
      salesStoreName: "Maidstone",
      deliverooStoreCode: "1098",
      uberEatsStoreCode: "1096",
      justEatStoreCode: "1097",
      gpukStoreCode: "1095",
      sskStoreCode: "1094",
      cashStoreCode: "1093",
      cardStoreCode: "1094"
    }
  ]

  // Sample invoice history data
  const invoiceHistory = [
    {
      id: "INV-3421",
      store: "Bexleyheath Broadway",
      date: "2023-10-15",
      amount: "£1,245.78",
      status: "Completed",
      items: 32
    },
    {
      id: "INV-3356",
      store: "Canterbury",
      date: "2023-10-14",
      amount: "£2,187.45",
      status: "Completed",
      items: 47
    },
    {
      id: "INV-3312",
      store: "Gravesend",
      date: "2023-10-13",
      amount: "£1,654.32",
      status: "Completed",
      items: 38
    },
    {
      id: "INV-3289",
      store: "O2 Arena",
      date: "2023-10-12",
      amount: "£3,421.90",
      status: "Completed",
      items: 76
    },
    {
      id: "INV-3267",
      store: "Hempstead",
      date: "2023-10-11",
      amount: "£987.65",
      status: "Completed",
      items: 24
    }
  ]

  const filteredStores = storeMappings.filter(store => 
    store.storeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    store.salesStoreName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Store Mapping</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search bar */}
          <div className="mb-4 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stores"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button>Add New Store</Button>
          </div>

          {/* Table header */}
          <div className="overflow-x-auto">
            <div className="flex items-center px-2 py-1 border-b bg-muted text-xs font-semibold min-w-max">
              <span className="w-64 sticky left-0 bg-muted">Store Name</span>
              <span className="w-40">Sales Store Name</span>
              <span className="w-40">Deliveroo Store Code</span>
              <span className="w-40">UberEats Store Code</span>
              <span className="w-40">Just Eat Store Code</span>
              <span className="w-40">GPUK Store Code</span>
              <span className="w-40">SSK Store Code</span>
              <span className="w-40">Cash Store Code</span>
              <span className="w-40">Card Store Code</span>
              <span className="w-24">Actions</span>
            </div>

            {/* Scrollable mappings list */}
            <ScrollArea className="h-[300px]">
              <div className="min-w-max">
                {filteredStores.map((store) => (
                  <div
                    key={store.id}
                    className="flex items-center px-2 py-3 border-b hover:bg-accent transition-colors min-w-max"
                  >
                    <span className="w-64 sticky left-0 bg-white text-sm font-medium">{store.storeName}</span>
                    <span className="w-40 text-sm">{store.salesStoreName}</span>
                    <span className="w-40 text-sm">{store.deliverooStoreCode}</span>
                    <span className="w-40 text-sm">{store.uberEatsStoreCode}</span>
                    <span className="w-40 text-sm">{store.justEatStoreCode}</span>
                    <span className="w-40 text-sm">{store.gpukStoreCode}</span>
                    <span className="w-40 text-sm">{store.sskStoreCode}</span>
                    <span className="w-40 text-sm">{store.cashStoreCode}</span>
                    <span className="w-40 text-sm">{store.cardStoreCode}</span>
                    <div className="w-24">
                      <Button variant="outline" size="sm">Save</Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sales Invoice History</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Table header */}
          <div className="flex items-center px-2 py-1 border-b bg-muted text-xs font-semibold">
            <span className="w-1/6">Invoice ID</span>
            <span className="w-1/6">Store</span>
            <span className="w-1/6">Date</span>
            <span className="w-1/6">Amount</span>
            <span className="w-1/6">Items</span>
            <span className="w-1/6">Status</span>
            <span className="w-1/6">Actions</span>
          </div>

          {/* Scrollable invoice list */}
          <ScrollArea className="h-[300px] w-full">
            <div>
              {invoiceHistory.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center px-2 py-3 border-b hover:bg-accent transition-colors"
                >
                  <span className="w-1/6 text-sm font-medium">{invoice.id}</span>
                  <span className="w-1/6 text-sm">{invoice.store}</span>
                  <span className="w-1/6 text-sm">{invoice.date}</span>
                  <span className="w-1/6 text-sm">{invoice.amount}</span>
                  <span className="w-1/6 text-sm">{invoice.items}</span>
                  <span className="w-1/6 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {invoice.status}
                    </span>
                  </span>
                  <div className="w-1/6">
                    <Button variant="outline" size="sm">View</Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
} 