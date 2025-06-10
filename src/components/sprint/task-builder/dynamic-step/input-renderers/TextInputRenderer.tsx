
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SaveStatus } from "@/components/ui/save-status";
import { useDebouncedAutoSave } from "@/hooks/useDebouncedAutoSave";

interface TextInputRendererProps {
  id: string;
  label?: string;
  value: string;
  type: "text" | "textarea";
  placeholder?: string;
  onChange: (value: string) => void;
  onAutoSave?: (value: string) => Promise<void>;
}

export const TextInputRenderer: React.FC<TextInputRendererProps> = ({
  id,
  label,
  value,
  type,
  placeholder,
  onChange,
  onAutoSave,
}) => {
  const [localValue, setLocalValue] = useState(value || "");
  const [saveError, setSaveError] = useState<string | null>(null);

  // Update local value when prop value changes (from external sources)
  useEffect(() => {
    setLocalValue(value || "");
  }, [value]);

  const { debouncedSave, saveImmediately, isSaving, lastSaved } = useDebouncedAutoSave({
    delay: 500,
    onSave: async (saveValue: string) => {
      if (onAutoSave) {
        try {
          await onAutoSave(saveValue);
          setSaveError(null);
        } catch (error) {
          setSaveError("Failed to save");
          throw error;
        }
      }
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange(newValue); // Update parent immediately for UI responsiveness
    
    if (onAutoSave) {
      debouncedSave(newValue);
    }
  };

  const handleBlur = () => {
    // Save immediately on blur to ensure no data loss
    if (onAutoSave && localValue !== value) {
      saveImmediately(localValue);
    }
  };

  return (
    <div className="space-y-2 mb-4">
      {label && <Label htmlFor={id}>{label}</Label>}
      {type === "textarea" ? (
        <Textarea
          id={id}
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder || "Enter your answer..."}
          rows={4}
        />
      ) : (
        <Input
          id={id}
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder || "Enter your answer..."}
        />
      )}
      {onAutoSave && (
        <SaveStatus 
          isSaving={isSaving} 
          lastSaved={lastSaved} 
          error={saveError}
          className="mt-1"
        />
      )}
    </div>
  );
};
