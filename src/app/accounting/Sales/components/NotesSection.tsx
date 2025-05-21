import * as React from "react";
import { Textarea } from "@/components/ui/textarea";

interface NotesSectionProps {
  notes: string;
  onNotesChange: (notes: string) => void;
  isEditing: boolean;
}

export default function NotesSection({ notes, onNotesChange, isEditing }: NotesSectionProps) {
  return (
    <div>
      <h3 className="font-semibold mb-3">Notes</h3>
      {isEditing ? (
        <Textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Add notes about this sales report..."
          className="min-h-[100px]"
        />
      ) : (
        <div className="p-3 border rounded-md bg-gray-50 min-h-[50px]">
          {notes ? (
            <p className="text-sm whitespace-pre-wrap">{notes}</p>
          ) : (
            <p className="text-sm text-muted-foreground">No notes</p>
          )}
        </div>
      )}
    </div>
  );
} 