
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Option } from "@/types/task-builder";

interface RadioInputRendererProps {
  id: string;
  label?: string;
  value: string;
  options?: Option[];
  onChange: (value: string) => void;
}

export const RadioInputRenderer: React.FC<RadioInputRendererProps> = ({
  id,
  label,
  value,
  options,
  onChange,
}) => {
  if (!options || options.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 mb-4">
      {label && <Label>{label}</Label>}
      <RadioGroup value={value || ""} onValueChange={onChange}>
        <div className="space-y-2">
          {options.map((option, i) => (
            <div key={i} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option.value}
                id={`${id}-${option.value}`}
              />
              <Label htmlFor={`${id}-${option.value}`}>{option.label}</Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};
