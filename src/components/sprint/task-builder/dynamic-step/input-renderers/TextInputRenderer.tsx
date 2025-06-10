
import React, { useRef, useCallback, useMemo } from "react";
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
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastSavedValueRef = useRef(value);
  const isTypingRef = useRef(false);

  const { debouncedSave, isSaving, lastSaved } = useDebouncedAutoSave({
    delay: 1000,
    onSave: async (saveValue: string) => {
      if (onAutoSave && saveValue !== lastSavedValueRef.current) {
        try {
          await onAutoSave(saveValue);
          lastSavedValueRef.current = saveValue;
        } catch (error) {
          console.error("Auto-save failed:", error);
          throw error;
        }
      }
    }
  });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    isTypingRef.current = true;
    
    // Update parent immediately for UI responsiveness
    onChange(newValue);
    
    // Trigger auto-save if enabled
    if (onAutoSave) {
      debouncedSave(newValue);
    }
  }, [onChange, onAutoSave, debouncedSave]);

  const handleBlur = useCallback(() => {
    isTypingRef.current = false;
    // Force save on blur if there are unsaved changes
    if (onAutoSave && value !== lastSavedValueRef.current) {
      onAutoSave(value).then(() => {
        lastSavedValueRef.current = value;
      }).catch(error => {
        console.error("Blur save failed:", error);
      });
    }
  }, [onAutoSave, value]);

  const handleFocus = useCallback(() => {
    isTypingRef.current = true;
  }, []);

  // Memoize the input component to prevent unnecessary re-renders
  const inputComponent = useMemo(() => {
    const commonProps = {
      id,
      value: value || "",
      onChange: handleChange,
      onBlur: handleBlur,
      onFocus: handleFocus,
      placeholder: placeholder || "Enter your answer...",
    };

    return type === "textarea" ? (
      <Textarea {...commonProps} rows={4} ref={textareaRef} />
    ) : (
      <Input {...commonProps} ref={inputRef} />
    );
  }, [id, value, type, placeholder, handleChange, handleBlur, handleFocus]);

  return (
    <div className="space-y-2 mb-4">
      {label && <Label htmlFor={id}>{label}</Label>}
      {inputComponent}
      {onAutoSave && (
        <SaveStatus 
          isSaving={isSaving} 
          lastSaved={lastSaved} 
          className="mt-1"
        />
      )}
    </div>
  );
};
