import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash } from "lucide-react";
import { StoreAllocation } from "./types";

interface StoreAllocationsSectionProps {
  allocations: StoreAllocation[];
  setAllocations: React.Dispatch<React.SetStateAction<StoreAllocation[]>>;
  totalAmount: number;
  isEditing: boolean;
}

export default function StoreAllocationsSection({
  allocations,
  setAllocations,
  totalAmount,
  isEditing,
}: StoreAllocationsSectionProps) {
  const handleAddAllocation = () => {
    const newAllocation: StoreAllocation = {
      id: `allocation-${Date.now()}`,
      store: "",
      percentage: 0,
      amount: 0,
    };
    setAllocations([...allocations, newAllocation]);
  };

  const handleRemoveAllocation = (id: string) => {
    setAllocations(allocations.filter((allocation) => allocation.id !== id));
  };

  const handleAllocationChange = (
    id: string,
    field: keyof StoreAllocation,
    value: string | number
  ) => {
    const updatedAllocations = allocations.map((allocation) => {
      if (allocation.id === id) {
        const updatedAllocation = { ...allocation, [field]: value };
        
        // If percentage is changed, update amount
        if (field === "percentage") {
          const percentage = Number(value);
          updatedAllocation.amount = parseFloat(((percentage / 100) * totalAmount).toFixed(2));
        }
        
        // If amount is changed, update percentage
        if (field === "amount") {
          const amount = Number(value);
          updatedAllocation.percentage = parseFloat(((amount / totalAmount) * 100).toFixed(2));
        }
        
        return updatedAllocation;
      }
      return allocation;
    });
    
    setAllocations(updatedAllocations);
  };

  const totalPercentage = allocations.reduce((total, allocation) => total + allocation.percentage, 0);
  const totalPercentageClass = totalPercentage !== 100 && allocations.length > 0 ? "text-red-500" : "text-green-500";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Store Allocations</h3>
        {isEditing && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddAllocation}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Allocation
          </Button>
        )}
      </div>
      
      {allocations.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">
          {isEditing
            ? "Add store allocations to distribute sales amounts across multiple stores."
            : "No store allocations have been added for this sales report."}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
            <div className="col-span-5">Store</div>
            <div className="col-span-3">Percentage</div>
            <div className="col-span-3">Amount</div>
            <div className="col-span-1"></div>
          </div>
          
          {allocations.map((allocation) => (
            <div key={allocation.id} className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-5">
                {isEditing ? (
                  <Input
                    value={allocation.store}
                    onChange={(e) =>
                      handleAllocationChange(allocation.id, "store", e.target.value)
                    }
                    placeholder="Store name"
                  />
                ) : (
                  <span>{allocation.store}</span>
                )}
              </div>
              <div className="col-span-3">
                {isEditing ? (
                  <Input
                    type="number"
                    value={allocation.percentage}
                    onChange={(e) =>
                      handleAllocationChange(
                        allocation.id,
                        "percentage",
                        parseFloat(e.target.value)
                      )
                    }
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                ) : (
                  <span>{allocation.percentage}%</span>
                )}
              </div>
              <div className="col-span-3">
                {isEditing ? (
                  <Input
                    type="number"
                    value={allocation.amount}
                    onChange={(e) =>
                      handleAllocationChange(
                        allocation.id,
                        "amount",
                        parseFloat(e.target.value)
                      )
                    }
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                ) : (
                  <span>£{allocation.amount.toFixed(2)}</span>
                )}
              </div>
              <div className="col-span-1 flex justify-end">
                {isEditing && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveAllocation(allocation.id)}
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          <div className="flex justify-between pt-2 border-t">
            <span className="font-medium">Total:</span>
            <span className={`font-medium ${totalPercentageClass}`}>
              {totalPercentage.toFixed(2)}% (£
              {allocations
                .reduce((total, allocation) => total + allocation.amount, 0)
                .toFixed(2)}
              )
            </span>
          </div>
          
          {totalPercentage !== 100 && allocations.length > 0 && (
            <p className="text-sm text-red-500">
              {totalPercentage < 100
                ? `Missing allocation: ${(100 - totalPercentage).toFixed(2)}%`
                : `Over-allocation: ${(totalPercentage - 100).toFixed(2)}%`}
            </p>
          )}
        </>
      )}
    </div>
  );
} 