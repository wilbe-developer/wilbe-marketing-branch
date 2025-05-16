
import React, { useState } from "react";
import { StepNode } from "@/types/task-builder";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, ChevronRight, ChevronDown, Trash2, Edit, ChevronsUpDown } from "lucide-react";
import StepNodeEditor from "./StepNodeEditor";
import { v4 as uuidv4 } from "uuid";
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

interface StepTreeEditorProps {
  steps: StepNode[];
  onChange: (steps: StepNode[]) => void;
}

const StepTreeEditor: React.FC<StepTreeEditorProps> = ({ steps, onChange }) => {
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});
  const [selectedStep, setSelectedStep] = useState<StepNode | null>(null);

  const toggleExpand = (stepId: string) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const handleAddStep = () => {
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

    onChange([...steps, newStep]);
  };

  const handleAddChildStep = (parentId: string) => {
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

    onChange(updateWithChild(steps));
    
    // Expand the parent
    setExpandedSteps((prev) => ({
      ...prev,
      [parentId]: true,
    }));
  };

  const handleDeleteStep = (stepId: string) => {
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

    onChange(deleteStepById(steps));
    
    // If the deleted step was selected, clear the selection
    if (selectedStep && selectedStep.id === stepId) {
      setSelectedStep(null);
    }
  };

  const handleUpdateStep = (updatedStep: StepNode) => {
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

    onChange(updateStepById(steps));
  };

  const moveStep = (stepId: string, direction: "up" | "down") => {
    // For simplicity, this only handles moving steps at the root level for now
    const index = steps.findIndex((s) => s.id === stepId);
    if (index === -1) return;

    const newIndex = direction === "up" ? Math.max(0, index - 1) : Math.min(steps.length - 1, index + 1);
    if (newIndex === index) return;

    const newSteps = [...steps];
    const [removed] = newSteps.splice(index, 1);
    newSteps.splice(newIndex, 0, removed);

    onChange(newSteps);
  };

  const renderStepTree = (stepsArray: StepNode[], level = 0) => {
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
          const hasChildren = step.children && step.children.length > 0;
          const isExpanded = expandedSteps[step.id];
          
          return (
            <div key={step.id} className="border rounded-md">
              <div
                className={`flex items-center p-3 ${
                  selectedStep?.id === step.id
                    ? "bg-primary/10"
                    : "hover:bg-gray-50"
                }`}
              >
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
                    onClick={() => setSelectedStep(step)}
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
                  
                  <div className="flex flex-col">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-3.5 w-7"
                      onClick={() => moveStep(step.id, "up")}
                      disabled={index === 0}
                    >
                      <ChevronRight className="h-3 w-3 rotate-[270deg]" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-3.5 w-7"
                      onClick={() => moveStep(step.id, "down")}
                      disabled={index === stepsArray.length - 1}
                    >
                      <ChevronRight className="h-3 w-3 rotate-90" />
                    </Button>
                  </div>
                  
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Steps</h3>
          <Button onClick={handleAddStep} size="sm">
            <Plus size={16} className="mr-2" />
            Add Step
          </Button>
        </div>
        
        {renderStepTree(steps)}
        
        {steps.length === 0 && (
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
        {selectedStep ? (
          <Card>
            <CardContent className="pt-6">
              <StepNodeEditor
                step={selectedStep}
                onChange={handleUpdateStep}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-12 border rounded-lg border-dashed h-full flex flex-col justify-center items-center">
            <h3 className="text-lg font-medium text-gray-600 mb-2">No step selected</h3>
            <p className="text-gray-500">Select a step to edit its properties</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepTreeEditor;
