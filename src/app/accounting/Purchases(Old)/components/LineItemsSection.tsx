import React from 'react';
import { v4 } from 'uuid';
import {
  Button
} from '@/components/ui/button';
import {
  Input
} from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Plus, Trash } from 'lucide-react';

import { LineItem } from './types';

type LineItemsSectionProps = {
  lineItems: LineItem[];
  setLineItems: React.Dispatch<React.SetStateAction<LineItem[]>>;
  isEditing: boolean;
  onTotalsUpdate?: (subtotal: number) => void;
};

export const LineItemsSection: React.FC<LineItemsSectionProps> = ({
  lineItems,
  setLineItems,
  isEditing,
  onTotalsUpdate
}) => {
  // Calculate line item total
  const calculateLineItemTotal = (item: LineItem): number => {
    return item.quantity * item.unitPrice;
  };

  // Add a new line item
  const handleAddLineItem = () => {
    const newItem: LineItem = {
      id: v4(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
      accountCode: ''
    };
    
    setLineItems([...lineItems, newItem]);
  };

  // Remove a line item
  const handleRemoveLineItem = (index: number) => {
    const newLineItems = [...lineItems];
    newLineItems.splice(index, 1);
    setLineItems(newLineItems);
    
    // Update totals if callback provided
    if (onTotalsUpdate) {
      const subtotal = newLineItems.reduce((sum, item) => sum + calculateLineItemTotal(item), 0);
      onTotalsUpdate(subtotal);
    }
  };

  // Update a line item
  const handleLineItemChange = (index: number, field: keyof LineItem, value: unknown) => {
    const newLineItems = [...lineItems];
    
    // Handle the change for the specific field
    newLineItems[index] = {
      ...newLineItems[index],
      [field]: value
    };
    
    // Recalculate the total for this line item
    newLineItems[index].total = calculateLineItemTotal(newLineItems[index]);
    
    setLineItems(newLineItems);
    
    // Update totals if callback provided
    if (onTotalsUpdate) {
      const subtotal = newLineItems.reduce((sum, item) => sum + calculateLineItemTotal(item), 0);
      onTotalsUpdate(subtotal);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-sm font-medium">Line Items</h3>
        {isEditing && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddLineItem} 
            className="h-6 text-xs py-0"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Item
          </Button>
        )}
      </div>
      
      <Table className="text-sm">
        <TableHeader>
          <TableRow className="h-8">
            <TableHead>Description</TableHead>
            <TableHead className="text-right w-16">Qty</TableHead>
            <TableHead className="text-right w-24">Unit Price</TableHead>
            <TableHead className="text-right w-24">Total</TableHead>
            {isEditing && <TableHead className="w-10">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {lineItems.map((item, index) => (
            <TableRow key={item.id} className="h-8">
              {isEditing ? (
                <>
                  <TableCell className="py-1 font-medium">
                    <Input 
                      value={item.description}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleLineItemChange(index, 'description', e.target.value)
                      }
                      className="h-6 text-xs w-full"
                    />
                  </TableCell>
                  <TableCell className="py-1 text-right">
                    <Input 
                      type="number"
                      value={item.quantity}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleLineItemChange(index, 'quantity', parseFloat(e.target.value) || 0)
                      }
                      className="h-6 text-xs w-16 ml-auto"
                    />
                  </TableCell>
                  <TableCell className="py-1 text-right">
                    <div className="flex items-center justify-end">
                      <span className="mr-1">£</span>
                      <Input 
                        type="number"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          handleLineItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)
                        }
                        className="h-6 text-xs w-20"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="py-1 text-right">
                    £{calculateLineItemTotal(item).toFixed(2)}
                  </TableCell>
                  <TableCell className="py-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveLineItem(index)}
                      className="h-6 w-6"
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell className="py-1 font-medium">{item.description}</TableCell>
                  <TableCell className="py-1 text-right">{item.quantity}</TableCell>
                  <TableCell className="py-1 text-right">£{item.unitPrice.toFixed(2)}</TableCell>
                  <TableCell className="py-1 text-right">£{calculateLineItemTotal(item).toFixed(2)}</TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LineItemsSection; 