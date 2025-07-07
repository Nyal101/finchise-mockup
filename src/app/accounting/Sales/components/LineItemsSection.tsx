import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Trash2, ChevronDown } from "lucide-react";

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
  { value: "4000", label: "4000 - Sales" },
  { value: "5000", label: "5000 - COGS" },
  { value: "6100", label: "6100 - Professional" },
  { value: "6200", label: "6200 - Property" },
  { value: "6300", label: "6300 - Equipment" },
  { value: "6400", label: "6400 - Utilities" },
  { value: "6500", label: "6500 - Marketing" },
  { value: "6600", label: "6600 - Comms" }
];

// Searchable Dropdown Component
const SearchableDropdown = ({ 
  options, 
  value, 
  onValueChange, 
  placeholder, 
  className = "" 
}: {
  options: string[] | { value: string | number; label: string }[];
  value: string | number;
  onValueChange: (value: string | number) => void;
  placeholder: string;
  className?: string;
}) => {
  const [open, setOpen] = React.useState(false);
  
  const displayValue = React.useMemo(() => {
    if (Array.isArray(options) && options.length > 0 && typeof options[0] === 'object') {
      const option = (options as { value: string | number; label: string }[]).find(opt => opt.value === value);
      return option ? option.label : value;
    }
    return value;
  }, [options, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between text-left font-normal ${className}`}
        >
          {value ? displayValue : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => {
              const optionValue = typeof option === 'string' ? option : option.value;
              const optionLabel = typeof option === 'string' ? option : option.label;
              
              return (
                <CommandItem
                  key={optionValue}
                  value={optionValue.toString()}
                  onSelect={() => {
                    onValueChange(optionValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      value === optionValue ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {optionLabel}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

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

  const getTaxRateDisplay = (vatRate: number) => {
    const option = taxRateOptions.find(opt => opt.value === vatRate);
    if (option) {
      if (vatRate === -1) return "Zero Rated Exp";
      if (vatRate === -2) return "Zero Rated Inc";
      if (vatRate === 0) return "No Tax";
      if (vatRate === 5) return "5% (Income)";
      if (vatRate === 5.1) return "5% (Expenses)";
      if (vatRate === 20) return "20% (Income)";
      if (vatRate === 20.1) return "20% (Expenses)";
    }
    return `${vatRate}%`;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-slate-700">Line Items</h4>
        {isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddLineItem}
            className="h-7 px-2 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" /> Add Item
          </Button>
        )}
      </div>
      
      <div className="overflow-auto max-h-80">
        <Table>
          <TableHeader className="sticky top-0 bg-white">
            <TableRow className="text-xs">
              <TableHead className="w-[25%] p-2">Description</TableHead>
              <TableHead className="w-[8%] p-2 text-right">Qty</TableHead>
              <TableHead className="w-[12%] p-2 text-right">Price</TableHead>
              <TableHead className="w-[15%] p-2 text-center">Tax Rate</TableHead>
              <TableHead className="w-[12%] p-2 text-center">Store</TableHead>
              <TableHead className="w-[15%] p-2 text-center">Account Code</TableHead>
              <TableHead className="w-[12%] p-2 text-right">Total</TableHead>
              {isEditing && <TableHead className="w-[6%] p-2"></TableHead>}
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
                <TableRow key={item.id} className="text-sm">
                  <TableCell className="p-2">
                    {isEditing ? (
                      <Input
                        value={item.description}
                        onChange={(e) => handleLineItemChange(item.id, "description", e.target.value)}
                        className="h-7 text-xs px-2"
                        placeholder="Description"
                      />
                    ) : (
                      <div className="text-xs">{item.description || "-"}</div>
                    )}
                  </TableCell>
                  <TableCell className="p-2 text-right">
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
                      <div className="text-xs">{item.quantity}</div>
                    )}
                  </TableCell>
                  <TableCell className="p-2 text-right">
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
                      <div className="text-xs">£{item.price.toFixed(2)}</div>
                    )}
                  </TableCell>
                  <TableCell className="p-2">
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
                  <TableCell className="p-2">
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
                      <div className="text-xs text-center">{item.trackingCategory || "-"}</div>
                    )}
                  </TableCell>
                  <TableCell className="p-2">
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
                      <div className="text-xs text-center">
                        {item.accountCode ? accountCodeOptions.find(opt => opt.value === item.accountCode)?.value || item.accountCode : "-"}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="p-2 text-right">
                    <div className="text-xs font-medium">£{item.total.toFixed(2)}</div>
                  </TableCell>
                  {isEditing && (
                    <TableCell className="p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveLineItem(item.id)}
                        className="h-6 w-6 p-0 hover:bg-red-100"
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 