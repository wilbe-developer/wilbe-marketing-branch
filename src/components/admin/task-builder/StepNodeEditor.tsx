
import React from "react";
import { StepNode, StepType, InputType, Option } from "@/types/task-builder";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import ConditionsEditor from "./ConditionsEditor";

interface StepNodeEditorProps {
  step: StepNode;
  onChange: (step: StepNode) => void;
}

const StepNodeEditor: React.FC<StepNodeEditorProps> = ({ step, onChange }) => {
  const handleStepChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onChange({
      ...step,
      [name]: value,
    });
  };

  const handleTypeChange = (value: StepType) => {
    const newStep = { ...step, type: value };
    
    // If changing to a type that doesn't use options, remove them
    if (value === "content" || value === "upload" || value === "file") {
      delete newStep.options;
      delete newStep.inputType;
    }
    
    onChange(newStep);
  };

  const handleInputTypeChange = (value: InputType) => {
    const newStep = { ...step, inputType: value };
    
    // Initialize options array if it doesn't exist and the input type needs options
    if (
      (value === "radio" || value === "select" || value === "multiselect") &&
      (!newStep.options || newStep.options.length === 0)
    ) {
      newStep.options = [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
      ];
    }
    
    // Boolean type only needs true/false options
    if (value === "boolean" && (!newStep.options || newStep.options.length !== 2)) {
      newStep.options = [
        { label: "Yes", value: "true" },
        { label: "No", value: "false" },
      ];
    }
    
    // Text/textarea types don't need options
    if (value === "text" || value === "textarea") {
      delete newStep.options;
    }
    
    onChange(newStep);
  };

  const handleAddOption = () => {
    const newOptions = [
      ...(step.options || []),
      {
        label: `Option ${(step.options?.length || 0) + 1}`,
        value: `option${(step.options?.length || 0) + 1}`,
      },
    ];
    
    onChange({
      ...step,
      options: newOptions,
    });
  };

  const handleOptionChange = (index: number, field: keyof Option, value: string) => {
    if (!step.options) return;
    
    const newOptions = [...step.options];
    newOptions[index] = {
      ...newOptions[index],
      [field]: value,
    };
    
    onChange({
      ...step,
      options: newOptions,
    });
  };

  const handleDeleteOption = (index: number) => {
    if (!step.options) return;
    
    const newOptions = step.options.filter((_, i) => i !== index);
    onChange({
      ...step,
      options: newOptions,
    });
  };

  const handleConditionsChange = (conditions: any[]) => {
    onChange({
      ...step,
      conditions,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="text">Step Text/Question</Label>
        <Textarea
          id="text"
          name="text"
          value={step.text}
          onChange={handleStepChange}
          placeholder="Enter step text or question"
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Step Type</Label>
        <Select
          value={step.type}
          onValueChange={(value) => handleTypeChange(value as StepType)}
        >
          <SelectTrigger id="type">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="question">Question</SelectItem>
            <SelectItem value="content">Content</SelectItem>
            <SelectItem value="upload">File Upload</SelectItem>
            <SelectItem value="file">File (Alternative)</SelectItem>
            <SelectItem value="exercise">Exercise</SelectItem>
            <SelectItem value="feedback">Feedback</SelectItem>
            <SelectItem value="action">Action</SelectItem>
            <SelectItem value="container">Container</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {step.type === "question" && (
        <div className="space-y-2">
          <Label htmlFor="inputType">Input Type</Label>
          <Select
            value={step.inputType || "radio"}
            onValueChange={(value) => handleInputTypeChange(value as InputType)}
          >
            <SelectTrigger id="inputType">
              <SelectValue placeholder="Select input type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="radio">Radio Buttons</SelectItem>
              <SelectItem value="boolean">Yes/No</SelectItem>
              <SelectItem value="select">Dropdown</SelectItem>
              <SelectItem value="multiselect">Multi-Select</SelectItem>
              <SelectItem value="textarea">Text Area</SelectItem>
              <SelectItem value="text">Text Input</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="url">URL</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {step.options && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label>Options</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddOption}
            >
              <Plus size={16} className="mr-1" />
              Add Option
            </Button>
          </div>
          
          {step.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="flex-1 space-y-2">
                <Input
                  value={option.label}
                  onChange={(e) => handleOptionChange(index, "label", e.target.value)}
                  placeholder="Option label"
                />
                <Input
                  value={option.value}
                  onChange={(e) => handleOptionChange(index, "value", e.target.value)}
                  placeholder="Option value"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteOption(index)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="pt-4 border-t">
        <ConditionsEditor
          conditions={step.conditions || []}
          onChange={handleConditionsChange}
        />
      </div>
    </div>
  );
};

export default StepNodeEditor;
