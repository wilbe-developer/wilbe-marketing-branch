
import React from 'react';
import { Check, AlertCircle, Loader2 } from 'lucide-react';
import type { SaveStatus } from '@/hooks/useAutoSaveManager';

interface SaveStatusIndicatorProps {
  status: SaveStatus;
  className?: string;
}

export const SaveStatusIndicator: React.FC<SaveStatusIndicatorProps> = ({ 
  status, 
  className = "" 
}) => {
  switch (status) {
    case 'typing':
      return (
        <span className={`text-xs text-muted-foreground flex items-center gap-1 ${className}`}>
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          Typing...
        </span>
      );
    case 'saving':
      return (
        <span className={`text-xs text-muted-foreground flex items-center gap-1 ${className}`}>
          <Loader2 className="w-3 h-3 animate-spin" />
          Saving...
        </span>
      );
    case 'saved':
      return (
        <span className={`text-xs text-green-600 flex items-center gap-1 ${className}`}>
          <Check className="w-3 h-3" />
          Saved
        </span>
      );
    case 'error':
      return (
        <span className={`text-xs text-red-600 flex items-center gap-1 ${className}`}>
          <AlertCircle className="w-3 h-3" />
          Error - Retrying...
        </span>
      );
    default:
      return null;
  }
};
