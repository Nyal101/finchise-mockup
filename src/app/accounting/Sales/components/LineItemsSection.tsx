import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { SalesLineItem } from "./types";

interface LineItemsSectionProps {
  lineItems: SalesLineItem[];
  setLineItems: React.Dispatch<React.SetStateAction<SalesLineItem[]>>;
  isEditing: boolean;
}

// Tax rate options as requested
const taxRateOptions = [
  { value: 20, label: "20%" },
  { value: 5, label: "5%" },
  { value: 0, label: "No VAT" },
  { value: -1, label: "Zero Rated Expenses" }
];

// Store options for tracking category
const storeOptions = [
  "Lancaster",
  "Birmingham", 
  "Manchester",
  "Liverpool",
  "London East"
];

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
      trackingCategory: "",
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
        
        // Recalculate if quantity, price, or vatRate changes
        if (field === 'quantity' || field === 'price' || field === 'vatRate') {
          const quantity = field === 'quantity' ? Number(value) : item.quantity;
          const price = field === 'price' ? Number(value) : item.price;
          const vatRate = field === 'vatRate' ? Number(value) : item.vatRate;
          const subtotal = quantity * price;
          
          // Handle special VAT cases
          let vat = 0;
          if (vatRate >= 0) {
            vat = subtotal * (vatRate / 100);
          } // Zero rated expenses and no VAT both result in 0 VAT
          
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
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Unit Price</TableHead>
              <TableHead className="w-[15%]">Tax Rate</TableHead>
              <TableHead className="w-[15%]">Store</TableHead>
              <TableHead className="text-right">Total</TableHead>
              {isEditing && <TableHead className="w-[50px]"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {lineItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isEditing ? 7 : 6} className="text-center text-muted-foreground">
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
                  <TableCell>
                    {isEditing ? (
                      <Select
                        value={item.vatRate.toString()}
                        onValueChange={(value) => handleLineItemChange(item.id, "vatRate", parseFloat(value))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {taxRateOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value.toString()}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="text-center">
                        {item.vatRate === -1 ? "Zero Rated" : 
                         item.vatRate === 0 ? "No VAT" : `${item.vatRate}%`}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Select
                        value={item.trackingCategory || ""}
                        onValueChange={(value) => handleLineItemChange(item.id, "trackingCategory", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select store" />
                        </SelectTrigger>
                        <SelectContent>
                          {storeOptions.map((store) => (
                            <SelectItem key={store} value={store}>
                              {store}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      item.trackingCategory || "-"
                    )}
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