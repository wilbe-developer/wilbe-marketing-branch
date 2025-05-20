
import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Option } from "@/types/task-builder";

interface CheckboxInputRendererProps {
  id: string;
  label?: string;
  value: string[] | boolean;
  options?: Option[];
  isSingle?: boolean;
  onChange: (value: string[] | boolean) => void;
}

export const CheckboxInputRenderer: React.FC<CheckboxInputRendererProps> = ({
  id,
  label,
  value,
  options,
  isSingle = false,
  onChange,
}) => {
  if (isSingle) {
    return (
      <div className="flex items-center space-x-2 mb-4">
        <Checkbox
          id={id}
          checked={Boolean(value)}
          onCheckedChange={(checked) => onChange(Boolean(checked))}
        />
        {label && <Label htmlFor={id}>{label}</Label>}
      </div>
    );
  }

  if (!options || options.length === 0) {
    return null;
  }

  const selectedValues = Array.isArray(value) ? value : [];

  const handleCheckedChange = (checked: boolean, optionValue: string) => {
    if (checked) {
      onChange([...selectedValues, optionValue]);
    } else {
      onChange(selectedValues.filter((v) => v !== optionValue));
    }
  };

  return (
    <div className="space-y-2 mb-4">
      {label && <Label>{label}</Label>}
      <div className="space-y-2">
        {options.map((option, i) => (
          <div key={i} className="flex items-center space-x-2">
            <Checkbox
              id={`${id}-${option.value}`}
              checked={selectedValues.includes(option.value)}
              onCheckedChange={(checked) => 
                handleCheckedChange(Boolean(checked), option.value)
              }
            />
            <Label htmlFor={`${id}-${option.value}`}>{option.label}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};
