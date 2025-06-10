
import React, { useRef, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface TextInputRendererProps {
  id: string;
  label?: string;
  value: string;
  type: "text" | "textarea";
  placeholder?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

export const TextInputRenderer: React.FC<TextInputRendererProps> = ({
  id,
  label,
  value,
  type,
  placeholder,
  onChange,
  onBlur,
  onFocus,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  }, [onChange]);

  const handleBlur = useCallback(() => {
    onBlur?.();
  }, [onBlur]);

  const handleFocus = useCallback(() => {
    onFocus?.();
  }, [onFocus]);

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
    </div>
  );
};
