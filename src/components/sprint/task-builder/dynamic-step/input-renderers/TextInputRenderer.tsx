
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SaveStatusIndicator } from "@/components/ui/save-status-indicator";
import type { SaveStatus } from "@/hooks/useAutoSaveManager";

interface TextInputRendererProps {
  id: string;
  label?: string;
  value: string;
  type: "text" | "textarea";
  placeholder?: string;
  onChange: (value: string) => void;
  onAutoSave?: (value: string) => Promise<void>;
  autoSaveManager?: {
    handleFieldChange: (fieldId: string, value: any, isTyping: boolean, saveCallback: (value: any) => Promise<void>) => void;
    startTyping: (fieldId: string) => void;
    stopTyping: (fieldId: string) => void;
    getSaveStatus: (fieldId: string) => SaveStatus;
    subscribeToStatus: (fieldId: string, callback: (status: SaveStatus) => void) => () => void;
  };
}

export const TextInputRenderer: React.FC<TextInputRendererProps> = ({
  id,
  label,
  value,
  type,
  placeholder,
  onChange,
  onAutoSave,
  autoSaveManager,
}) => {
  const [localValue, setLocalValue] = useState(value || "");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  // Subscribe to save status updates
  useEffect(() => {
    if (!autoSaveManager) return;
    
    const unsubscribe = autoSaveManager.subscribeToStatus(id, setSaveStatus);
    return unsubscribe;
  }, [autoSaveManager, id]);

  // Update local value when prop changes (but only if not currently typing)
  useEffect(() => {
    if (autoSaveManager && autoSaveManager.getSaveStatus(id) !== 'typing') {
      setLocalValue(value || "");
    } else if (!autoSaveManager) {
      setLocalValue(value || "");
    }
  }, [value, autoSaveManager, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    // Always update parent immediately for UI responsiveness
    onChange(newValue);
    
    // Handle auto-save if manager is provided
    if (autoSaveManager && onAutoSave) {
      autoSaveManager.handleFieldChange(id, newValue, true, onAutoSave);
    }
  };

  const handleFocus = () => {
    if (autoSaveManager) {
      autoSaveManager.startTyping(id);
    }
  };

  const handleBlur = () => {
    if (autoSaveManager) {
      autoSaveManager.stopTyping(id);
    }
  };

  return (
    <div className="space-y-2 mb-4">
      <div className="flex justify-between items-center">
        {label && <Label htmlFor={id}>{label}</Label>}
        {autoSaveManager && <SaveStatusIndicator status={saveStatus} />}
      </div>
      {type === "textarea" ? (
        <Textarea
          id={id}
          value={localValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder || "Enter your answer..."}
          rows={4}
        />
      ) : (
        <Input
          id={id}
          value={localValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder || "Enter your answer..."}
        />
      )}
    </div>
  );
};
