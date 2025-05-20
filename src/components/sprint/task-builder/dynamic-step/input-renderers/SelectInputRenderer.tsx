
import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Option } from "@/types/task-builder";

interface SelectInputRendererProps {
  id: string;
  label?: string;
  value: string;
  options?: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
}

export const SelectInputRenderer: React.FC<SelectInputRendererProps> = ({
  id,
  label,
  value,
  options,
  placeholder,
  onChange,
}) => {
  if (!options || options.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 mb-4">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Select value={value || ""} onValueChange={onChange}>
        <SelectTrigger id={id}>
          <SelectValue placeholder={placeholder || "Select an option"} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option, i) => (
            <SelectItem key={i} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
