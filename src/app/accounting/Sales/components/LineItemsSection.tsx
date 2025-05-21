import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { SalesLineItem } from "./types";

interface LineItemsSectionProps {
  lineItems: SalesLineItem[];
  setLineItems: React.Dispatch<React.SetStateAction<SalesLineItem[]>>;
  isEditing: boolean;
}

export default function LineItemsSection({ lineItems, setLineItems, isEditing }: LineItemsSectionProps) {
  const handleAddLineItem = () => {
    const newItem: SalesLineItem = {
      id: `item-${Date.now()}`,
      description: "",
      category: "",
      quantity: 1,
      price: 0,
      subtotal: 0,
      vatRate: 20,
      vat: 0,
      total: 0,
    };
    setLineItems([...lineItems, newItem]);
  };

  const handleRemoveLineItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const handleLineItemChange = (id: string, field: keyof SalesLineItem, value: string | number) => {
    setLineItems(lineItems.map((item) => {
      if (item.id === id) {
        let updatedItem = { ...item, [field]: value };
        
        // Recalculate if quantity or price changes
        if (field === 'quantity' || field === 'price') {
          const quantity = field === 'quantity' ? Number(value) : item.quantity;
          const price = field === 'price' ? Number(value) : item.price;
          const subtotal = quantity * price;
          const vat = subtotal * (item.vatRate / 100);
          updatedItem = {
            ...updatedItem,
            subtotal,
            vat,
            total: subtotal + vat
          };
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  return (
    <div>
      <h3 className="font-semibold mb-2">Line Items</h3>
      <div className="overflow-auto max-h-[400px]">
        <Table>
          <TableHeader className="sticky top-0 bg-white">
            <TableRow>
              <TableHead className="w-[30%]">Description</TableHead>
              <TableHead className="w-[15%]">Category</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
              <TableHead className="text-right">VAT</TableHead>
              <TableHead className="text-right">Total</TableHead>
              {isEditing && <TableHead className="w-[50px]"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {lineItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isEditing ? 8 : 7} className="text-center text-muted-foreground">
                  No line items found
                </TableCell>
              </TableRow>
            ) : (
              lineItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {isEditing ? (
                      <Input
                        value={item.description}
                        onChange={(e) => handleLineItemChange(item.id, "description", e.target.value)}
                        className="w-full"
                      />
                    ) : (
                      item.description
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Input
                        value={item.category}
                        onChange={(e) => handleLineItemChange(item.id, "category", e.target.value)}
                        className="w-full"
                      />
                    ) : (
                      item.category
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {isEditing ? (
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleLineItemChange(item.id, "quantity", parseFloat(e.target.value))}
                        className="w-full text-right"
                      />
                    ) : (
                      item.quantity
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {isEditing ? (
                      <Input
                        type="number"
                        value={item.price}
                        onChange={(e) => handleLineItemChange(item.id, "price", parseFloat(e.target.value))}
                        className="w-full text-right"
                      />
                    ) : (
                      `£${item.price.toFixed(2)}`
                    )}
                  </TableCell>
                  <TableCell className="text-right">{`£${item.subtotal.toFixed(2)}`}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end">
                      <span>{`${item.vatRate}%`}</span>
                      <span>{`£${item.vat.toFixed(2)}`}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">{`£${item.total.toFixed(2)}`}</TableCell>
                  {isEditing && (
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveLineItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {isEditing && (
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={handleAddLineItem}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Line Item
        </Button>
      )}
    </div>
  );
} 