import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash } from "lucide-react";
import { JournalEntry } from "./types";

interface JournalEntriesSectionProps {
  entries: JournalEntry[];
  setEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
  isEditing: boolean;
}

export default function JournalEntriesSection({
  entries,
  setEntries,
  isEditing,
}: JournalEntriesSectionProps) {
  const handleAddEntry = () => {
    const newEntry: JournalEntry = {
      id: `entry-${Date.now()}`,
      account: "",
      description: "",
      debit: 0,
      credit: 0,
    };
    setEntries([...entries, newEntry]);
  };

  const handleRemoveEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  const handleEntryChange = (
    id: string,
    field: keyof JournalEntry,
    value: string | number
  ) => {
    setEntries(
      entries.map((entry) => {
        if (entry.id === id) {
          return { ...entry, [field]: value };
        }
        return entry;
      })
    );
  };

  const totalDebits = entries.reduce((total, entry) => total + entry.debit, 0);
  const totalCredits = entries.reduce((total, entry) => total + entry.credit, 0);
  const isBalanced = totalDebits === totalCredits;
  const balanceClass = isBalanced && entries.length > 0 ? "text-green-500" : "text-red-500";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Journal Entries</h3>
        {isEditing && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddEntry}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Entry
          </Button>
        )}
      </div>
      
      {entries.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">
          {isEditing
            ? "Add journal entries to record accounting transactions for this sales report."
            : "No journal entries have been added for this sales report."}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
            <div className="col-span-3">Account</div>
            <div className="col-span-4">Description</div>
            <div className="col-span-2">Debit</div>
            <div className="col-span-2">Credit</div>
            <div className="col-span-1"></div>
          </div>
          
          {entries.map((entry) => (
            <div key={entry.id} className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-3">
                {isEditing ? (
                  <Input
                    value={entry.account}
                    onChange={(e) =>
                      handleEntryChange(entry.id, "account", e.target.value)
                    }
                    placeholder="Account name"
                  />
                ) : (
                  <span>{entry.account}</span>
                )}
              </div>
              <div className="col-span-4">
                {isEditing ? (
                  <Input
                    value={entry.description}
                    onChange={(e) =>
                      handleEntryChange(entry.id, "description", e.target.value)
                    }
                    placeholder="Description"
                  />
                ) : (
                  <span>{entry.description}</span>
                )}
              </div>
              <div className="col-span-2">
                {isEditing ? (
                  <Input
                    type="number"
                    value={entry.debit}
                    onChange={(e) =>
                      handleEntryChange(
                        entry.id,
                        "debit",
                        parseFloat(e.target.value)
                      )
                    }
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                ) : (
                  <span>{entry.debit > 0 ? `£${entry.debit.toFixed(2)}` : ""}</span>
                )}
              </div>
              <div className="col-span-2">
                {isEditing ? (
                  <Input
                    type="number"
                    value={entry.credit}
                    onChange={(e) =>
                      handleEntryChange(
                        entry.id,
                        "credit",
                        parseFloat(e.target.value)
                      )
                    }
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                ) : (
                  <span>{entry.credit > 0 ? `£${entry.credit.toFixed(2)}` : ""}</span>
                )}
              </div>
              <div className="col-span-1 flex justify-end">
                {isEditing && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveEntry(entry.id)}
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          <div className="flex justify-between pt-2 border-t">
            <span className="font-medium">Total:</span>
            <div className="flex space-x-8">
              <span className="font-medium">£{totalDebits.toFixed(2)}</span>
              <span className="font-medium">£{totalCredits.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex justify-between">
            <span className="font-medium">Balance:</span>
            <span className={`font-medium ${balanceClass}`}>
              {isBalanced
                ? "Balanced"
                : `Unbalanced: £${Math.abs(totalDebits - totalCredits).toFixed(2)}`}
            </span>
          </div>
        </>
      )}
    </div>
  );
} 