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

import { JournalEntry } from './types';

type JournalSectionProps = {
  journalEntries: JournalEntry[];
  setJournalEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
  isEditing: boolean;
};

export const JournalSection: React.FC<JournalSectionProps> = ({
  journalEntries,
  setJournalEntries,
  isEditing,
}) => {
  // Add a new journal entry
  const handleAddJournalEntry = () => {
    const newEntry: JournalEntry = {
      id: v4(),
      account: '',
      description: '',
      debit: 0,
      credit: 0
    };
    
    setJournalEntries([...journalEntries, newEntry]);
  };

  // Remove a journal entry
  const handleRemoveJournalEntry = (index: number) => {
    const newEntries = [...journalEntries];
    newEntries.splice(index, 1);
    setJournalEntries(newEntries);
  };

  // Update a journal entry
  const handleJournalEntryChange = (index: number, field: keyof JournalEntry, value: string | number) => {
    const newEntries = [...journalEntries];
    newEntries[index] = {
      ...newEntries[index],
      [field]: value
    };
    setJournalEntries(newEntries);
  };

  // Calculate totals
  const totalDebits = journalEntries.reduce((sum, entry) => sum + entry.debit, 0);
  const totalCredits = journalEntries.reduce((sum, entry) => sum + entry.credit, 0);
  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01; // Allow for small rounding errors

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-sm font-medium">Journal Entries</h3>
        {isEditing && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleAddJournalEntry} 
            className="h-6 text-xs py-0"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Entry
          </Button>
        )}
      </div>
      
      <Table className="text-sm">
        <TableHeader>
          <TableRow className="h-8">
            <TableHead>Account</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right w-24">Debit</TableHead>
            <TableHead className="text-right w-24">Credit</TableHead>
            {isEditing && <TableHead className="w-10">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {journalEntries.map((entry, index) => (
            <TableRow key={entry.id} className="h-8">
              {isEditing ? (
                <>
                  <TableCell className="py-1">
                    <Input 
                      value={entry.account}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleJournalEntryChange(index, 'account', e.target.value)
                      }
                      className="h-6 text-xs w-full"
                    />
                  </TableCell>
                  <TableCell className="py-1">
                    <Input 
                      value={entry.description}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleJournalEntryChange(index, 'description', e.target.value)
                      }
                      className="h-6 text-xs w-full"
                    />
                  </TableCell>
                  <TableCell className="py-1 text-right">
                    <div className="flex items-center justify-end">
                      <span className="mr-1">£</span>
                      <Input 
                        type="number"
                        step="0.01"
                        value={entry.debit}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          handleJournalEntryChange(index, 'debit', parseFloat(e.target.value) || 0)
                        }
                        className="h-6 text-xs w-20"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="py-1 text-right">
                    <div className="flex items-center justify-end">
                      <span className="mr-1">£</span>
                      <Input 
                        type="number"
                        step="0.01"
                        value={entry.credit}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          handleJournalEntryChange(index, 'credit', parseFloat(e.target.value) || 0)
                        }
                        className="h-6 text-xs w-20"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="py-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleRemoveJournalEntry(index)}
                      className="h-6 w-6"
                    >
                      <Trash className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell className="py-1">{entry.account}</TableCell>
                  <TableCell className="py-1">{entry.description}</TableCell>
                  <TableCell className="py-1 text-right">{entry.debit > 0 ? `£${entry.debit.toFixed(2)}` : ''}</TableCell>
                  <TableCell className="py-1 text-right">{entry.credit > 0 ? `£${entry.credit.toFixed(2)}` : ''}</TableCell>
                </>
              )}
            </TableRow>
          ))}
          
          {/* Totals row */}
          <TableRow className="font-medium">
            <TableCell colSpan={2} className="py-1 text-right">Totals:</TableCell>
            <TableCell className="py-1 text-right">£{totalDebits.toFixed(2)}</TableCell>
            <TableCell className="py-1 text-right">£{totalCredits.toFixed(2)}</TableCell>
            {isEditing && <TableCell />}
          </TableRow>
          
          {/* Balance indicator */}
          {journalEntries.length > 0 && (
            <TableRow>
              <TableCell colSpan={isEditing ? 5 : 4} className={`py-1 text-right text-xs ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                {isBalanced 
                  ? 'Journal is balanced' 
                  : `Journal is not balanced (difference: £${Math.abs(totalDebits - totalCredits).toFixed(2)})`}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default JournalSection; 