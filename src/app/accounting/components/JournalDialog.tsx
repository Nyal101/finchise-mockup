import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Edit, FileDown, Plus, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

// Types
export interface JournalLine {
  description: string;
  account: string;
  store: string;
  debit?: number;
  credit?: number;
  taxRate?: string;
}

export interface Journal {
  id: string;
  status: "pending" | "approved";
  type: "accrual" | "prepayment" | "utility";
  narration: string;
  date: Date;
  lines: JournalLine[];
  sourceInvoiceId?: string;
}

export interface JournalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  journal: Journal | null;
  isEditing: boolean;
  onEditToggle: () => void;
  onSave?: (journal: Journal) => void;
}

export function JournalDialog({ open, onOpenChange, journal, isEditing, onEditToggle, onSave }: JournalDialogProps) {
  const [editedJournal, setEditedJournal] = React.useState<Journal | null>(null);

  React.useEffect(() => {
    if (journal) {
      setEditedJournal(JSON.parse(JSON.stringify(journal)));
    }
  }, [journal]);

  if (!journal || !editedJournal) return null;

  // Calculate totals
  const totalDebit = editedJournal.lines.reduce((sum: number, l: JournalLine) => sum + (l.debit || 0), 0);
  const totalCredit = editedJournal.lines.reduce((sum: number, l: JournalLine) => sum + (l.credit || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01; // Allow for small rounding errors
  
  // Update line values
  const updateLine = (index: number, field: keyof JournalLine, value: string | number) => {
    const newLines = [...editedJournal.lines];
    newLines[index] = { ...newLines[index], [field]: value };
    setEditedJournal({ ...editedJournal, lines: newLines });
  };

  // Add a new line
  const addLine = () => {
    const newLines = [...editedJournal.lines, {
      description: "",
      account: "",
      store: "",
      debit: 0,
      credit: 0,
      taxRate: "No VAT"
    }];
    setEditedJournal({ ...editedJournal, lines: newLines });
  };

  // Remove a line
  const removeLine = (index: number) => {
    const newLines = [...editedJournal.lines];
    newLines.splice(index, 1);
    setEditedJournal({ ...editedJournal, lines: newLines });
  };

  // Handle save
  const handleSave = () => {
    if (onSave && editedJournal) {
      onSave(editedJournal);
    }
    onEditToggle(); // Exit edit mode
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-auto">
        <DialogHeader className="sticky top-0 z-10 bg-background pb-2">
          <DialogTitle className="text-xl">
            {journal.type.charAt(0).toUpperCase() + journal.type.slice(1)} Journal #{journal.id.replace('invoice-', '')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-2">
          <div>
            <p className="text-sm text-muted-foreground">Narration</p>
            <p className="font-medium">{editedJournal.narration}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Date</p>
            <p className="font-medium">{format(editedJournal.date, "d MMM yyyy")}</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm font-medium mb-1">Accrual and cash basis</p>
            <p className="text-sm text-muted-foreground">Amounts do not include Tax</p>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button size="sm" variant="outline" onClick={onEditToggle}>Cancel</Button>
                <Button 
                  size="sm" 
                  onClick={handleSave} 
                  className="flex items-center gap-1"
                  disabled={!isBalanced}
                >
                  <Save className="h-4 w-4" /> Save
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="outline" className="flex items-center gap-1">
                  <FileDown className="h-4 w-4" /> Print PDF
                </Button>
                <Button size="sm" onClick={onEditToggle} className="flex items-center gap-1">
                  <Edit className="h-4 w-4" /> Edit
                </Button>
              </>
            )}
          </div>
        </div>
        
        <Card className="mb-4">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-muted">
                  <TableRow>
                    <TableHead className="w-1/5">Description</TableHead>
                    <TableHead className="w-1/5">Account</TableHead>
                    <TableHead className="w-1/10">Tax Rate</TableHead>
                    <TableHead className="w-1/10">Store</TableHead>
                    <TableHead className="text-right w-1/10">Debit GBP</TableHead>
                    <TableHead className="text-right w-1/10">Credit GBP</TableHead>
                    {isEditing && <TableHead className="w-10"></TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {editedJournal.lines.map((line: JournalLine, idx: number) => (
                    <TableRow key={idx}>
                      {isEditing ? (
                        <>
                          <TableCell>
                            <Input 
                              value={line.description}
                              onChange={(e) => updateLine(idx, 'description', e.target.value)}
                              className="h-8"
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              value={line.account}
                              onChange={(e) => updateLine(idx, 'account', e.target.value)}
                              className="h-8"
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              value={line.taxRate}
                              onChange={(e) => updateLine(idx, 'taxRate', e.target.value)}
                              className="h-8"
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              value={line.store}
                              onChange={(e) => updateLine(idx, 'store', e.target.value)}
                              className="h-8"
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              type="number"
                              value={line.debit || 0}
                              onChange={(e) => updateLine(idx, 'debit', parseFloat(e.target.value) || 0)}
                              className="h-8 text-right"
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                              type="number"
                              value={line.credit || 0}
                              onChange={(e) => updateLine(idx, 'credit', parseFloat(e.target.value) || 0)}
                              className="h-8 text-right"
                            />
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeLine(idx)}
                              className="h-8 w-8 p-0"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </Button>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>{line.description}</TableCell>
                          <TableCell>{line.account}</TableCell>
                          <TableCell>{line.taxRate}</TableCell>
                          <TableCell>{line.store}</TableCell>
                          <TableCell className="text-right font-medium">{line.debit ? `£${line.debit.toFixed(2)}` : ""}</TableCell>
                          <TableCell className="text-right font-medium">{line.credit ? `£${line.credit.toFixed(2)}` : ""}</TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                  
                  {isEditing && (
                    <TableRow>
                      <TableCell colSpan={7} className="py-1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={addLine}
                          className="flex items-center gap-1 h-8"
                        >
                          <Plus className="h-4 w-4" /> Add Line
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}

                  <TableRow>
                    <TableCell colSpan={4} className="text-right font-medium border-t">Subtotal</TableCell>
                    <TableCell className="text-right font-medium border-t">£{totalDebit.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium border-t">£{totalCredit.toFixed(2)}</TableCell>
                    {isEditing && <TableCell className="border-t"></TableCell>}
                  </TableRow>
                  
                  <TableRow>
                    <TableCell colSpan={4} className="text-right font-bold border-t-2">TOTAL</TableCell>
                    <TableCell className="text-right font-bold border-t-2">£{totalDebit.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-bold border-t-2">£{totalCredit.toFixed(2)}</TableCell>
                    {isEditing && <TableCell className="border-t-2"></TableCell>}
                  </TableRow>
                  
                  {/* Balance indicator */}
                  <TableRow>
                    <TableCell colSpan={isEditing ? 7 : 6} className={`py-1 text-right text-xs ${isBalanced ? 'text-green-600' : 'text-red-600'}`}>
                      {isBalanced 
                        ? 'Journal is balanced' 
                        : `Journal is not balanced (difference: £${Math.abs(totalDebit - totalCredit).toFixed(2)})`}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">History & Notes</h4>
          <div className="bg-muted p-2 rounded-md">
            <p className="text-sm font-medium">Approved by System Generated on {format(new Date(), "d MMM yyyy 'at' h:mma")}</p>
            <p className="text-sm text-muted-foreground">Automatically Approved.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 