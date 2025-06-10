
import React from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SaveStatusProps {
  isSaving: boolean;
  lastSaved?: Date | null;
  error?: string | null;
  className?: string;
}

export const SaveStatus: React.FC<SaveStatusProps> = ({
  isSaving,
  lastSaved,
  error,
  className
}) => {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  if (error) {
    return (
      <div className={cn("flex items-center text-xs text-red-600", className)}>
        <AlertCircle className="h-3 w-3 mr-1" />
        <span>Save failed</span>
      </div>
    );
  }

  if (isSaving) {
    return (
      <div className={cn("flex items-center text-xs text-gray-500", className)}>
        <Clock className="h-3 w-3 mr-1 animate-spin" />
        <span>Saving...</span>
      </div>
    );
  }

  if (lastSaved) {
    return (
      <div className={cn("flex items-center text-xs text-green-600", className)}>
        <Check className="h-3 w-3 mr-1" />
        <span>Saved at {formatTime(lastSaved)}</span>
      </div>
    );
  }

  return null;
};
