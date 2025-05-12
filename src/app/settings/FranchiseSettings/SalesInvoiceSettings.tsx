"use client"

import * as React from "react"
import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function SalesInvoiceSettings() {
  const [frequency, setFrequency] = useState("weekly")
  
  // Sample invoice history data
  const invoiceHistory = [
    { id: 1, date: "2023-03-12", period: "Week 10", status: "Processed", amount: "£12,450.00" },
    { id: 2, date: "2023-03-05", period: "Week 9", status: "Processed", amount: "£10,875.50" },
    { id: 3, date: "2023-02-26", period: "Week 8", status: "Processed", amount: "£11,210.75" },
    { id: 4, date: "2023-02-19", period: "Week 7", status: "Processed", amount: "£9,950.00" },
    { id: 5, date: "2023-02-12", period: "Week 6", status: "Processed", amount: "£14,125.25" },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Invoice Generation Frequency</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={frequency} onValueChange={setFrequency} className="space-y-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="weekly" id="weekly" />
              <Label htmlFor="weekly" className="font-medium">Weekly</Label>
              <span className="text-sm text-muted-foreground ml-2">Invoices generated every Sunday</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="biweekly" id="biweekly" />
              <Label htmlFor="biweekly" className="font-medium">Bi-weekly</Label>
              <span className="text-sm text-muted-foreground ml-2">Invoices generated every other Sunday</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="monthly" id="monthly" />
              <Label htmlFor="monthly" className="font-medium">Monthly</Label>
              <span className="text-sm text-muted-foreground ml-2">Invoices generated on the last day of each month</span>
            </div>
          </RadioGroup>

          <div className="mt-6">
            <Button className="mr-2">Save Changes</Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Next Invoice Generation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm px-3 py-1 bg-blue-50 text-blue-700 rounded-md inline-block">
            <CalendarIcon className="h-4 w-4" />
            <span>Scheduled for March 19, 2023</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sales Invoice Processing History</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Table header */}
          <div className="flex items-center px-2 py-1 border-b bg-muted text-xs font-semibold">
            <span className="w-1/5">Date</span>
            <span className="w-1/5">Period</span>
            <span className="w-1/5">Status</span>
            <span className="w-1/5">Amount</span>
            <span className="w-1/5">Actions</span>
          </div>

          {/* Scrollable history list */}
          <ScrollArea className="h-[300px] w-full">
            <div>
              {invoiceHistory.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center px-2 py-3 border-b hover:bg-accent transition-colors"
                >
                  <span className="w-1/5 text-sm">{invoice.date}</span>
                  <span className="w-1/5 text-sm">{invoice.period}</span>
                  <span className="w-1/5 text-sm">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {invoice.status}
                    </span>
                  </span>
                  <span className="w-1/5 text-sm">{invoice.amount}</span>
                  <div className="w-1/5">
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