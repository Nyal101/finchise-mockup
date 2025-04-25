import React from 'react';
import { Textarea } from '@/components/ui/textarea';

type NotesSectionProps = {
  notes: string | undefined;
  isEditing: boolean;
  onNotesChange: (notes: string) => void;
};

export const NotesSection: React.FC<NotesSectionProps> = ({
  notes,
  isEditing,
  onNotesChange
}) => {
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onNotesChange(e.target.value);
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-1">Notes</h3>
      {isEditing ? (
        <Textarea
          placeholder="Add notes or comments about this invoice..."
          className="min-h-[60px] text-sm"
          value={notes || ''}
          onChange={handleNotesChange}
        />
      ) : (
        <div className="p-2 bg-muted rounded-md min-h-[40px] text-sm">
          {notes ? notes : (
            <span className="text-muted-foreground text-xs italic">No notes added</span>
          )}
        </div>
      )}
    </div>
  );
};

export default NotesSection; 