import React from 'react';
import { 
  Button
} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { 
  Download, 
  Edit, 
  FileArchive, 
  MoreHorizontal, 
  Printer, 
  Redo, 
  Save, 
  Trash, 
  X 
} from 'lucide-react';

type InvoiceActionsProps = {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  cardHeader?: boolean;
};

export const InvoiceActions: React.FC<InvoiceActionsProps> = ({
  isEditing,
  onEdit,
  onSave,
  onCancel,
  cardHeader = false
}) => {
  return (
    <div className="flex space-x-1">
      {isEditing ? (
        <>
          <Button 
            variant="default" 
            onClick={onSave} 
            size={cardHeader ? "sm" : "default"}
          >
            <Save className={`mr-1 ${cardHeader ? "h-3.5 w-3.5" : "h-4 w-4"}`} />
            {cardHeader ? "Save" : "Save Changes"}
          </Button>
          <Button 
            variant="outline" 
            onClick={onCancel} 
            size={cardHeader ? "sm" : "default"}
          >
            <X className={`mr-1 ${cardHeader ? "h-3.5 w-3.5" : "h-4 w-4"}`} />
            Cancel
          </Button>
        </>
      ) : (
        <>
          <Button 
            variant="outline" 
            onClick={onEdit} 
            size={cardHeader ? "sm" : "default"}
          >
            <Edit className={`mr-1 ${cardHeader ? "h-3.5 w-3.5" : "h-4 w-4"}`} />
            Edit
          </Button>
          
          {cardHeader ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Printer className="mr-2 h-4 w-4" />
                  Print
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <FileArchive className="mr-2 h-4 w-4" />
                  Archive
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button variant="outline">
                <Redo className="mr-2 h-4 w-4" />
                Reprocess
              </Button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default InvoiceActions; 