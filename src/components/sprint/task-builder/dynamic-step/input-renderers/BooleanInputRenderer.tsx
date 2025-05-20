
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface BooleanInputRendererProps {
  id: string;
  label?: string;
  value: boolean | string;
  onChange: (value: boolean) => void;
}

export const BooleanInputRenderer: React.FC<BooleanInputRendererProps> = ({
  id,
  label,
  value,
  onChange,
}) => {
  // Convert to string for RadioGroup
  const stringValue = value?.toString() || "";

  const handleChange = (newValue: string) => {
    onChange(newValue === "true");
  };

  return (
    <div className="space-y-2 mb-4">
      {label && <Label>{label}</Label>}
      <RadioGroup value={stringValue} onValueChange={handleChange}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id={`${id}-true`} />
            <Label htmlFor={`${id}-true`}>Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id={`${id}-false`} />
            <Label htmlFor={`${id}-false`}>No</Label>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};
