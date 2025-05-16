
import React, { useState } from "react";
import { StepNode, Option } from "@/types/task-builder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { v4 as uuidv4 } from "uuid";
import { Plus, Trash2, ChevronDown, ChevronRight, Edit } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface SimpleStepEditorProps {
  steps: StepNode[];
  onChange: (steps: StepNode[]) => void;
}

const SimpleStepEditor: React.FC<SimpleStepEditorProps> = ({ steps, onChange }) => {
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});
  const [selectedStep, setSelectedStep] = useState<StepNode | null>(null);
  const [editStep, setEditStep] = useState<StepNode | null>(null);

  console.log("SimpleStepEditor rendering with steps:", steps?.length);

  // Toggle step expansion
  const toggleExpand = (stepId: string) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  // Add a new step at the root level
  const handleAddStep = () => {
    try {
      console.log("Adding new step");
      const newStep: StepNode = {
        id: uuidv4(),
        type: "question",
        text: "New Question",
        inputType: "radio",
        options: [
          { label: "Option 1", value: "option1" },
          { label: "Option 2", value: "option2" },
        ],
      };

      onChange([...(steps || []), newStep]);
      toast.success("Step added successfully");
    } catch (error) {
      console.error("Error adding new step:", error);
      toast.error("Failed to add step");
    }
  };

  // Add a child step to a parent step
  const handleAddChildStep = (parentId: string) => {
    try {
      console.log("Adding child step to parent:", parentId);
      const newStep: StepNode = {
        id: uuidv4(),
        type: "question",
        text: "New Child Question",
        inputType: "radio",
        options: [
          { label: "Option 1", value: "option1" },
          { label: "Option 2", value: "option2" },
        ],
      };

      const updateWithChild = (stepsArray: StepNode[]): StepNode[] => {
        return stepsArray.map((step) => {
          if (step.id === parentId) {
            return {
              ...step,
              children: [...(step.children || []), newStep],
            };
          }
          
          if (step.children) {
            return {
              ...step,
              children: updateWithChild(step.children),
            };
          }
          
          return step;
        });
      };

      onChange(updateWithChild(steps || []));
      
      // Expand the parent
      setExpandedSteps((prev) => ({
        ...prev,
        [parentId]: true,
      }));
      
      toast.success("Child step added successfully");
    } catch (error) {
      console.error("Error adding child step:", error);
      toast.error("Failed to add child step");
    }
  };

  // Delete a step by ID (and all its children)
  const handleDeleteStep = (stepId: string) => {
    try {
      console.log("Deleting step:", stepId);
      const deleteStepById = (stepsArray: StepNode[]): StepNode[] => {
        return stepsArray.filter((step) => {
          if (step.id === stepId) {
            return false;
          }
          
          if (step.children) {
            step.children = deleteStepById(step.children);
          }
          
          return true;
        });
      };

      onChange(deleteStepById(steps || []));
      
      // If the deleted step was selected, clear the selection
      if (selectedStep && selectedStep.id === stepId) {
        setSelectedStep(null);
      }
      
      if (editStep && editStep.id === stepId) {
        setEditStep(null);
      }
      
      toast.success("Step deleted successfully");
    } catch (error) {
      console.error("Error deleting step:", error);
      toast.error("Failed to delete step");
    }
  };

  // Handle updating a step
  const handleUpdateStep = (updatedStep: StepNode) => {
    try {
      console.log("Updating step:", updatedStep.id);
      const updateStepById = (stepsArray: StepNode[]): StepNode[] => {
        return stepsArray.map((step) => {
          if (step.id === updatedStep.id) {
            return updatedStep;
          }
          
          if (step.children) {
            return {
              ...step,
              children: updateStepById(step.children),
            };
          }
          
          return step;
        });
      };

      onChange(updateStepById(steps || []));
      toast.success("Step updated successfully");
    } catch (error) {
      console.error("Error updating step:", error);
      toast.error("Failed to update step");
    }
  };

  // Open the edit panel for a step
  const handleEditStep = (step: StepNode) => {
    console.log("Editing step:", step.id);
    setEditStep(step);
  };

  // Handle changes to the step being edited
  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!editStep) return;
    
    const { name, value } = e.target;
    setEditStep({
      ...editStep,
      [name]: value,
    });
  };

  // Handle changes to the step type
  const handleTypeChange = (value: string) => {
    if (!editStep) return;
    
    const newStep = { ...editStep, type: value as any };
    
    // If changing to a type that doesn't use options, remove them
    if (value === "content" || value === "file") {
      delete newStep.options;
      delete newStep.inputType;
    }
    
    setEditStep(newStep);
  };

  // Handle changes to the input type
  const handleInputTypeChange = (value: string) => {
    if (!editStep) return;
    
    const newStep = { ...editStep, inputType: value as any };
    
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
    
    setEditStep(newStep);
  };

  // Add option to the current step being edited
  const handleAddOption = () => {
    if (!editStep || !editStep.options) return;
    
    setEditStep({
      ...editStep,
      options: [
        ...editStep.options,
        {
          label: `Option ${editStep.options.length + 1}`,
          value: `option${editStep.options.length + 1}`,
        },
      ],
    });
  };

  // Handle changes to an option
  const handleOptionChange = (index: number, field: keyof Option, value: string) => {
    if (!editStep || !editStep.options) return;
    
    const newOptions = [...editStep.options];
    newOptions[index] = {
      ...newOptions[index],
      [field]: value,
    };
    
    setEditStep({
      ...editStep,
      options: newOptions,
    });
  };

  // Delete an option
  const handleDeleteOption = (index: number) => {
    if (!editStep || !editStep.options) return;
    
    setEditStep({
      ...editStep,
      options: editStep.options.filter((_, i) => i !== index),
    });
  };

  // Save changes to the step being edited
  const handleSaveEditStep = () => {
    if (!editStep) return;
    
    handleUpdateStep(editStep);
    setEditStep(null);
  };

  // Cancel editing a step
  const handleCancelEdit = () => {
    setEditStep(null);
  };

  // Render the step tree
  const renderStepTree = (stepsArray: StepNode[] = [], level = 0) => {
    if (!stepsArray || stepsArray.length === 0) {
      return (
        <div className="text-gray-500 italic p-2">
          No steps at this level
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {stepsArray.map((step, index) => {
          if (!step || !step.id) {
            console.error("Invalid step object:", step);
            return null;
          }
          
          const hasChildren = step.children && step.children.length > 0;
          const isExpanded = expandedSteps[step.id];
          
          return (
            <div key={step.id}>
              <div className="border rounded-md">
                <div className="flex items-center p-3 hover:bg-gray-50">
                  {hasChildren ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 mr-1"
                      onClick={() => toggleExpand(step.id)}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  ) : (
                    <div className="w-6" />
                  )}

                  <div
                    className="flex-1 cursor-pointer flex items-center"
                    onClick={() => setSelectedStep(step)}
                  >
                    <div className="ml-2 font-medium">
                      {step.text || `Step ${index + 1}`}
                    </div>
                    <div className="ml-2 text-xs text-gray-500">
                      ({step.type})
                    </div>
                  </div>

                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleEditStep(step)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleAddChildStep(step.id)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Step</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this step? This will also delete any child steps.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteStep(step.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>

              {hasChildren && isExpanded && (
                <div className={`pl-6 pr-2 pb-2 ${level > 0 ? 'border-l ml-3' : ''}`}>
                  {renderStepTree(step.children, level + 1)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Steps</h3>
        <Button onClick={handleAddStep} size="sm">
          <Plus size={16} className="mr-2" />
          Add Step
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {renderStepTree(steps)}
          
          {(!steps || steps.length === 0) && (
            <div className="text-center py-12 border rounded-lg border-dashed">
              <h3 className="text-lg font-medium text-gray-600 mb-2">No steps defined</h3>
              <p className="text-gray-500 mb-4">Add your first step to get started</p>
              <Button onClick={handleAddStep}>
                <Plus size={16} className="mr-2" />
                Add Step
              </Button>
            </div>
          )}
        </div>
        
        <div>
          {editStep ? (
            <Card>
              <CardHeader>
                <CardTitle>Edit Step</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="text">Step Text/Question</Label>
                  <Textarea
                    id="text"
                    name="text"
                    value={editStep.text}
                    onChange={handleEditChange}
                    placeholder="Enter step text or question"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Step Type</Label>
                  <Select
                    value={editStep.type}
                    onValueChange={handleTypeChange}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="question">Question</SelectItem>
                      <SelectItem value="content">Content</SelectItem>
                      <SelectItem value="file">File Upload</SelectItem>
                      <SelectItem value="exercise">Exercise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {editStep.type === "question" && (
                  <div className="space-y-2">
                    <Label htmlFor="inputType">Input Type</Label>
                    <Select
                      value={editStep.inputType || "radio"}
                      onValueChange={handleInputTypeChange}
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
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {editStep.options && (
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
                    
                    {editStep.options.map((option, index) => (
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

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEditStep}>
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : selectedStep ? (
            <Card>
              <CardHeader>
                <CardTitle>Step Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-500">Text</Label>
                    <p className="font-medium">{selectedStep.text}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm text-gray-500">Type</Label>
                    <p className="font-medium capitalize">{selectedStep.type}</p>
                  </div>
                  
                  {selectedStep.inputType && (
                    <div>
                      <Label className="text-sm text-gray-500">Input Type</Label>
                      <p className="font-medium capitalize">{selectedStep.inputType}</p>
                    </div>
                  )}
                  
                  {selectedStep.options && selectedStep.options.length > 0 && (
                    <div>
                      <Label className="text-sm text-gray-500">Options</Label>
                      <ul className="list-disc pl-5 mt-1">
                        {selectedStep.options.map((option, index) => (
                          <li key={index}>
                            {option.label} ({option.value})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="pt-4">
                    <Button onClick={() => handleEditStep(selectedStep)}>
                      Edit Step
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12 border rounded-lg border-dashed h-full flex flex-col justify-center items-center">
              <h3 className="text-lg font-medium text-gray-600 mb-2">No step selected</h3>
              <p className="text-gray-500">Select a step to view its details or add a new step</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleStepEditor;
