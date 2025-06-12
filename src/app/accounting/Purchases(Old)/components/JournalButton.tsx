import React from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen } from 'lucide-react';

type JournalButtonProps = {
  onClick: () => void;
};

export const JournalButton: React.FC<JournalButtonProps> = ({
  onClick
}) => {
  return (
    <Button 
      size="sm" 
      variant="outline"
      onClick={onClick}
      className="flex items-center gap-1"
    >
      <BookOpen className="h-4 w-4" />
      Journal
    </Button>
  );
};

export default JournalButton; 