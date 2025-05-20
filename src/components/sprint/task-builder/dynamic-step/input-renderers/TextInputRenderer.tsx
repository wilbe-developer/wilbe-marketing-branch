
import React from "react";
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
}

export const TextInputRenderer: React.FC<TextInputRendererProps> = ({
  id,
  label,
  value,
  type,
  placeholder,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2 mb-4">
      {label && <Label htmlFor={id}>{label}</Label>}
      {type === "textarea" ? (
        <Textarea
          id={id}
          value={value || ""}
          onChange={handleChange}
          placeholder={placeholder || "Enter your answer..."}
          rows={4}
        />
      ) : (
        <Input
          id={id}
          value={value || ""}
          onChange={handleChange}
          placeholder={placeholder || "Enter your answer..."}
        />
      )}
    </div>
  );
};
