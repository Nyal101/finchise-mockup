"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PurchaseInvoiceSettings from "./PurchaseInvoiceSettings"
import SalesInvoiceSettings from "./SalesInvoiceSettings"
import POSSettings from "./POSSettings"

export default function FranchiseSettingsPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Franchise Specific Settings</h1>
      </div>

      <Tabs defaultValue="purchase">
        <TabsList>
          <TabsTrigger value="purchase">Purchase Invoice Settings</TabsTrigger>
          <TabsTrigger value="sales">Sales Invoice Settings</TabsTrigger>
          <TabsTrigger value="pos">POS Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="purchase" className="space-y-4">
          <PurchaseInvoiceSettings />
        </TabsContent>
        
        <TabsContent value="sales" className="space-y-4">
          <SalesInvoiceSettings />
        </TabsContent>
        
        <TabsContent value="pos" className="space-y-4">
          <POSSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
} 