import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Trash2, ChevronDown } from "lucide-react";
import { SalesLineItem } from "./types";

interface LineItemsSectionProps {
  lineItems: SalesLineItem[];
  setLineItems: React.Dispatch<React.SetStateAction<SalesLineItem[]>>;
  isEditing: boolean;
}

// Updated tax rate options as requested
const taxRateOptions = [
  { value: "20_income", label: "20% (VAT on Income)" },
  { value: "20_expenses", label: "20% (VAT on Expenses)" },
  { value: "no_tax", label: "No Tax" },
  { value: "5_expenses", label: "5% (VAT on Expenses)" },
  { value: "5_income", label: "5% (VAT on Income)" },
  { value: "zero_rated_expenses", label: "Zero Rated Expenses" },
  { value: "zero_rated_income", label: "Zero Rated Income" }
];

// Store options for tracking category
const storeOptions = [
  "Lancaster",
  "Birmingham", 
  "Manchester",
  "Liverpool",
  "London East"
];

// Account code options
const accountCodeOptions = [
  { value: "4000", label: "4000 - Sales Revenue" },
  { value: "5000", label: "5000 - Cost of Sales" },
  { value: "6100", label: "6100 - Professional Services" },
  { value: "6200", label: "6200 - Property Maintenance" },
  { value: "6300", label: "6300 - Equipment Maintenance" },
  { value: "6400", label: "6400 - Utilities & Rates" },
  { value: "6500", label: "6500 - Marketing" },
  { value: "6600", label: "6600 - Communications" }
];

export default function LineItemsSection({ lineItems, setLineItems, isEditing }: LineItemsSectionProps) {
  const [storePopoverStates, setStorePopoverStates] = React.useState<Record<string, boolean>>({});
  const [accountPopoverStates, setAccountPopoverStates] = React.useState<Record<string, boolean>>({});

  const setStorePopover = (itemId: string, open: boolean) => {
    setStorePopoverStates(prev => ({ ...prev, [itemId]: open }));
  };

  const setAccountPopover = (itemId: string, open: boolean) => {
    setAccountPopoverStates(prev => ({ ...prev, [itemId]: open }));
  };

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
      accountCode: "",
    };
    setLineItems([...lineItems, newItem]);
  };

  const handleRemoveLineItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const getVatRateFromOption = (optionValue: string): number => {
    switch (optionValue) {
      case "20_income":
      case "20_expenses":
        return 20;
      case "5_income":
      case "5_expenses":
        return 5;
      case "no_tax":
      case "zero_rated_expenses":
      case "zero_rated_income":
        return 0;
      default:
        return 20;
    }
  };

  const getOptionFromVatRate = (vatRate: number): string => {
    // Default mapping - in real app this would come from stored data
    switch (vatRate) {
      case 20:
        return "20_expenses";
      case 5:
        return "5_expenses";
      case 0:
        return "no_tax";
      default:
        return "20_expenses";
    }
  };

  const handleLineItemChange = (id: string, field: keyof SalesLineItem, value: string | number) => {
    setLineItems(lineItems.map((item) => {
      if (item.id === id) {
        let updatedItem = { ...item, [field]: value };
        
        // Recalculate if quantity, price, or vatRate changes
        if (field === 'quantity' || field === 'price' || field === 'vatRate') {
          const quantity = field === 'quantity' ? Math.max(0, Number(value)) : item.quantity; // Prevent negative
          const price = field === 'price' ? Math.max(0, Number(value)) : item.price; // Prevent negative
          const vatRate = field === 'vatRate' ? getVatRateFromOption(value as string) : item.vatRate;
          const subtotal = quantity * price;
          const vat = subtotal * (vatRate / 100);
          
          updatedItem = {
            ...updatedItem,
            quantity,
            price,
            vatRate,
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
              <TableHead className="w-[15%]">Account Code</TableHead>
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
                  <TableCell className="text-right">
                    {isEditing ? (
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        value={item.quantity}
                        onChange={(e) => handleLineItemChange(item.id, "quantity", Math.max(0, parseFloat(e.target.value) || 0))}
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
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => handleLineItemChange(item.id, "price", Math.max(0, parseFloat(e.target.value) || 0))}
                        className="w-full text-right"
                      />
                    ) : (
                      `£${item.price.toFixed(2)}`
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Select
                        value={getOptionFromVatRate(item.vatRate)}
                        onValueChange={(value) => handleLineItemChange(item.id, "vatRate", value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {taxRateOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="text-center">
                        {item.vatRate === 0 ? "0%" : `${item.vatRate}%`}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Popover 
                        open={storePopoverStates[item.id] || false} 
                        onOpenChange={(open) => setStorePopover(item.id, open)}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={storePopoverStates[item.id] || false}
                            className="w-full justify-between text-sm h-8"
                          >
                            {item.trackingCategory || "Select store"}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search stores..." />
                            <CommandList>
                              <CommandEmpty>No store found.</CommandEmpty>
                              <CommandGroup>
                                {storeOptions.map((store) => (
                                  <CommandItem
                                    key={store}
                                    value={store}
                                    onSelect={(currentValue) => {
                                      handleLineItemChange(item.id, "trackingCategory", currentValue);
                                      setStorePopover(item.id, false);
                                    }}
                                  >
                                    {store}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      item.trackingCategory || "-"
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <Popover 
                        open={accountPopoverStates[item.id] || false} 
                        onOpenChange={(open) => setAccountPopover(item.id, open)}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={accountPopoverStates[item.id] || false}
                            className="w-full justify-between text-sm h-8"
                          >
                            {item.accountCode ? 
                              accountCodeOptions.find(opt => opt.value === item.accountCode)?.label || item.accountCode 
                              : "Select code"
                            }
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search account codes..." />
                            <CommandList>
                              <CommandEmpty>No account code found.</CommandEmpty>
                              <CommandGroup>
                                {accountCodeOptions.map((option) => (
                                  <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={(currentValue) => {
                                      handleLineItemChange(item.id, "accountCode", currentValue);
                                      setAccountPopover(item.id, false);
                                    }}
                                  >
                                    {option.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <div className="text-center">
                        {item.accountCode ? accountCodeOptions.find(opt => opt.value === item.accountCode)?.label || item.accountCode : "-"}
                      </div>
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