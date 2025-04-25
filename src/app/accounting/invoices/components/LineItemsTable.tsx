"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { LineItem } from "./types"
import { calculateLineItemTotal } from "./utils"
import { Textarea } from "./UIComponents"

interface LineItemsTableProps {
  lineItems: LineItem[]
  setLineItems: (items: LineItem[]) => void
  isEditing: boolean
  vatRate: number
  onSubtotalChange: (subtotal: number) => void
}

export function LineItemsTable({ 
  lineItems, 
  setLineItems, 
  isEditing, 
  vatRate,
  onSubtotalChange
}: LineItemsTableProps) {
  
  // Add a new line item
  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
      accountCode: ""
    }
    setLineItems([...lineItems, newItem])
  }

  // Remove a line item
  const removeLineItem = (id: string) => {
    const updatedItems = lineItems.filter(item => item.id !== id)
    setLineItems(updatedItems)
  }

  // Update a line item property
  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    const updatedItems = lineItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        
        // Recalculate total if quantity or unitPrice changed
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = calculateLineItemTotal(updatedItem)
        }
        
        return updatedItem
      }
      return item
    })
    setLineItems(updatedItems)
  }

  // Calculate subtotal
  const subtotal = lineItems.reduce((sum, item) => sum + (item.total || 0), 0)
  
  // Calculate VAT and total
  const vat = subtotal * (vatRate / 100)
  const total = subtotal + vat

  // Update parent component with new subtotal when it changes
  useState(() => {
    onSubtotalChange(subtotal)
  })

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Line Items</h3>
        {isEditing && (
          <Button onClick={addLineItem} size="sm" variant="outline">
            Add Line Item
          </Button>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead className="w-24">Quantity</TableHead>
            <TableHead className="w-32">Unit Price</TableHead>
            <TableHead className="w-32">Total</TableHead>
            <TableHead className="w-28">Account Code</TableHead>
            {isEditing && <TableHead className="w-20"></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {lineItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                {isEditing ? (
                  <Textarea
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                    placeholder="Enter description"
                    className="w-full"
                  />
                ) : (
                  item.description
                )}
              </TableCell>
              <TableCell>
                {isEditing ? (
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                    min="0"
                    step="1"
                    className="w-full"
                  />
                ) : (
                  item.quantity
                )}
              </TableCell>
              <TableCell>
                {isEditing ? (
                  <Input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => updateLineItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    className="w-full"
                  />
                ) : (
                  `£${item.unitPrice.toFixed(2)}`
                )}
              </TableCell>
              <TableCell>
                {isEditing ? (
                  `£${item.total.toFixed(2)}`
                ) : (
                  `£${item.total.toFixed(2)}`
                )}
              </TableCell>
              <TableCell>
                {isEditing ? (
                  <Input
                    value={item.accountCode}
                    onChange={(e) => updateLineItem(item.id, "accountCode", e.target.value)}
                    placeholder="Code"
                    className="w-full"
                  />
                ) : (
                  item.accountCode
                )}
              </TableCell>
              {isEditing && (
                <TableCell>
                  <Button
                    onClick={() => removeLineItem(item.id)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    &times;
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex flex-col items-end mt-4 space-y-2">
        <div className="flex justify-between w-48">
          <span>Subtotal:</span>
          <span>£{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between w-48">
          <span>VAT ({vatRate}%):</span>
          <span>£{vat.toFixed(2)}</span>
        </div>
        <div className="flex justify-between w-48 font-bold">
          <span>Total:</span>
          <span>£{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
} 