import React, { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { 
  Button
} from '@/components/ui/button';
import {
  Input
} from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Minus as MinusIcon, Plus as PlusIcon } from 'lucide-react';

import { StoreAllocation } from './types';

type StoreAllocationSectionProps = {
  storeAllocations: StoreAllocation[];
  setStoreAllocations: React.Dispatch<React.SetStateAction<StoreAllocation[]>>;
  invoiceTotal: number;
  isEditing: boolean;
  stores: string[];
};

export const StoreAllocationSection: React.FC<StoreAllocationSectionProps> = ({
  storeAllocations,
  setStoreAllocations,
  invoiceTotal,
  isEditing,
  stores
}) => {
  const [totalPercentage, setTotalPercentage] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [percentageError, setPercentageError] = useState(false);
  const [amountError, setAmountError] = useState(false);

  // Calculate totals when store allocations change
  useEffect(() => {
    const newTotalPercentage = storeAllocations.reduce((sum, allocation) => sum + allocation.percentage, 0);
    const newTotalAmount = storeAllocations.reduce((sum, allocation) => sum + allocation.amount, 0);
    
    setTotalPercentage(newTotalPercentage);
    setTotalAmount(newTotalAmount);
    
    setPercentageError(Math.abs(newTotalPercentage - 100) > 0.01);
    setAmountError(Math.abs(newTotalAmount - invoiceTotal) > 0.01);
  }, [storeAllocations, invoiceTotal]);

  // Add a new allocation
  const addStoreAllocation = () => {
    if (storeAllocations.length >= 10) {
      return; // Limit to 10 allocations
    }
    
    // Calculate remaining percentage and amount
    const currentTotalPercentage = storeAllocations.reduce(
      (sum, allocation) => sum + allocation.percentage, 0
    );
    const currentTotalAmount = storeAllocations.reduce(
      (sum, allocation) => sum + allocation.amount, 0
    );
    
    const remainingPercentage = Math.max(0, 100 - currentTotalPercentage);
    const remainingAmount = Math.max(0, invoiceTotal - currentTotalAmount);
    
    // Find stores not already allocated
    const usedStores = storeAllocations.map(a => a.store);
    const availableStores = stores.filter(s => !usedStores.includes(s));
    const defaultStore = availableStores.length > 0 ? availableStores[0] : stores[0];
    
    setStoreAllocations([
      ...storeAllocations,
      {
        id: v4(),
        store: defaultStore,
        percentage: remainingPercentage,
        amount: remainingAmount
      }
    ]);
  };

  // Remove an allocation
  const removeStoreAllocation = (id: string) => {
    if (storeAllocations.length <= 1) {
      return; // Don't remove the last allocation
    }
    
    const allocationToRemove = storeAllocations.find(a => a.id === id);
    if (!allocationToRemove) return;
    
    const newAllocations = storeAllocations.filter(a => a.id !== id);
    
    // Redistribute the removed allocation's percentage and amount
    if (newAllocations.length > 0) {
      const redistributedPercentage = allocationToRemove.percentage / newAllocations.length;
      const redistributedAmount = allocationToRemove.amount / newAllocations.length;
      
      const updatedAllocations = newAllocations.map(allocation => ({
        ...allocation,
        percentage: allocation.percentage + redistributedPercentage,
        amount: allocation.amount + redistributedAmount
      }));
      
      setStoreAllocations(updatedAllocations);
    } else {
      setStoreAllocations(newAllocations);
    }
  };

  // Update an allocation
  const updateStoreAllocation = (id: string, field: 'store' | 'percentage' | 'amount', value: string | number) => {
    const updatedAllocations = storeAllocations.map(allocation => {
      if (allocation.id === id) {
        const updatedAllocation = { ...allocation, [field]: value };
        
        // If percentage is updated, recalculate amount
        if (field === 'percentage') {
          updatedAllocation.amount = (value as number / 100) * invoiceTotal;
        }
        
        // If amount is updated, recalculate percentage
        if (field === 'amount') {
          updatedAllocation.percentage = (value as number / invoiceTotal) * 100;
        }
        
        return updatedAllocation;
      }
      return allocation;
    });
    
    setStoreAllocations(updatedAllocations);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-sm font-medium">Store Allocations</h3>
        {isEditing && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addStoreAllocation}
            disabled={storeAllocations.length >= 10}
            className="h-6 text-xs py-0"
          >
            <PlusIcon className="h-3 w-3 mr-1" />
            Add Allocation
          </Button>
        )}
      </div>
      
      {storeAllocations.length === 0 ? (
        <div className="text-sm text-muted-foreground italic">
          No store allocations set up yet.
        </div>
      ) : (
        <div>
          <Table className="text-sm">
            <TableHeader>
              <TableRow className="h-8">
                <TableHead>Store</TableHead>
                <TableHead>Percentage (%)</TableHead>
                <TableHead>Amount (£)</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {storeAllocations.map((allocation) => (
                <TableRow key={allocation.id} className="h-8">
                  <TableCell className="py-1">
                    <Select 
                      value={allocation.store} 
                      onValueChange={(value) => updateStoreAllocation(allocation.id, 'store', value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="h-6 text-xs w-full">
                        <SelectValue placeholder="Select store" />
                      </SelectTrigger>
                      <SelectContent>
                        {stores.map(store => (
                          <SelectItem key={store} value={store} className="text-xs">{store}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="py-1">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={allocation.percentage}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateStoreAllocation(allocation.id, 'percentage', parseFloat(e.target.value) || 0)
                      }
                      disabled={!isEditing}
                      className="h-6 text-xs"
                    />
                  </TableCell>
                  <TableCell className="py-1">
                    <Input
                      type="number"
                      min="0"
                      max={invoiceTotal}
                      step="0.01"
                      value={allocation.amount}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        updateStoreAllocation(allocation.id, 'amount', parseFloat(e.target.value) || 0)
                      }
                      disabled={!isEditing}
                      className="h-6 text-xs"
                    />
                  </TableCell>
                  <TableCell className="py-1">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => removeStoreAllocation(allocation.id)}
                      disabled={!isEditing || storeAllocations.length <= 1}
                      className="h-6 w-6"
                    >
                      <MinusIcon className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell className="py-1 font-bold text-xs">Total</TableCell>
                <TableCell className={cn("py-1 font-bold text-xs", percentageError ? "text-red-500" : "")}>
                  {totalPercentage.toFixed(2)}%
                </TableCell>
                <TableCell className={cn("py-1 font-bold text-xs", amountError ? "text-red-500" : "")}>
                  £{totalAmount.toFixed(2)}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
          
          {(percentageError || amountError) && isEditing && (
            <div className="text-xs text-red-500 mt-1">
              {percentageError && <p>Total percentage must equal 100%</p>}
              {amountError && <p>Total amount must equal invoice total (£{invoiceTotal.toFixed(2)})</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StoreAllocationSection; 