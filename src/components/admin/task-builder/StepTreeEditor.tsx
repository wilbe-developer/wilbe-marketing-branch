
import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { StepNode } from "@/types/task-builder";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import StepNodeEditor from "./StepNodeEditor";
import DraggableStepNode from "./DraggableStepNode";
import { v4 as uuidv4 } from "uuid";

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

  const moveStep = (dragIndex: number, hoverIndex: number, parentSteps?: StepNode[]) => {
    const stepsToModify = parentSteps || steps;
    const newSteps = [...stepsToModify];
    const [removed] = newSteps.splice(dragIndex, 1);
    newSteps.splice(hoverIndex, 0, removed);
    
    if (!parentSteps) {
      onChange(newSteps);
    } else {
      // Need to find and update the parent in the main steps array
      // This is a simplified version - a real implementation would need to track the path
      const updateWithMovedChildren = (stepsArray: StepNode[]): StepNode[] => {
        return stepsArray.map((step) => {
          if (step.children === parentSteps) {
            return {
              ...step,
              children: newSteps,
            };
          }
          
          if (step.children) {
            return {
              ...step,
              children: updateWithMovedChildren(step.children),
            };
          }
          
          return step;
        });
      };
      
      onChange(updateWithMovedChildren(steps));
    }
  };

  const renderStepTree = (stepsArray: StepNode[], level = 0, parentSteps?: StepNode[]) => {
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
            <div key={step.id}>
              <DraggableStepNode
                step={step}
                index={index}
                hasChildren={hasChildren}
                isExpanded={isExpanded}
                selectedStepId={selectedStep?.id || null}
                level={level}
                onToggleExpand={toggleExpand}
                onSelectStep={setSelectedStep}
                onAddChild={handleAddChildStep}
                onDeleteStep={handleDeleteStep}
                onMoveStep={(dragIndex, hoverIndex) => moveStep(dragIndex, hoverIndex, parentSteps)}
              />

              {hasChildren && isExpanded && (
                <div className={`pl-6 pr-2 pb-2 ${level > 0 ? 'border-l ml-3' : ''}`}>
                  {renderStepTree(step.children, level + 1, step.children)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
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
    </DndProvider>
  );
};

export default StepTreeEditor;
