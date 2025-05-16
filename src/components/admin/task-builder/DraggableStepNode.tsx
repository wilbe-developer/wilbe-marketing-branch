
import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { StepNode } from "@/types/task-builder";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronDown, Trash2, Edit, Plus } from "lucide-react";
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

interface DraggableStepNodeProps {
  step: StepNode;
  index: number;
  hasChildren: boolean;
  isExpanded: boolean;
  selectedStepId: string | null;
  level: number;
  onToggleExpand: (stepId: string) => void;
  onSelectStep: (step: StepNode) => void;
  onAddChild: (parentId: string) => void;
  onDeleteStep: (stepId: string) => void;
  onMoveStep: (dragIndex: number, hoverIndex: number) => void;
}

type DragItem = {
  index: number;
  id: string;
  type: string;
};

const ITEM_TYPE = "step";

const DraggableStepNode: React.FC<DraggableStepNodeProps> = ({
  step,
  index,
  hasChildren,
  isExpanded,
  selectedStepId,
  level,
  onToggleExpand,
  onSelectStep,
  onAddChild,
  onDeleteStep,
  onMoveStep,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop({
    accept: ITEM_TYPE,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      
      const dragIndex = item.index;
      const hoverIndex = index;
      
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      
      // Only proceed if we're at the same level of nesting
      if (item.type !== `${ITEM_TYPE}-${level}`) {
        return;
      }
      
      // Time to actually perform the action
      onMoveStep(dragIndex, hoverIndex);
      
      // Note: we're mutating the monitor item here
      // Generally it's better to avoid mutations,
      // but it's good here for performance reasons
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: `${ITEM_TYPE}-${level}`,
    item: () => {
      return { id: step.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Initialize drag and drop refs
  drag(drop(ref));
  
  const opacity = isDragging ? 0.4 : 1;

  return (
    <div 
      ref={ref} 
      style={{ opacity }}
      className={`border rounded-md ${isDragging ? "border-primary border-dashed" : ""}`}
      data-handler-id={handlerId}
    >
      <div
        className={`flex items-center p-3 ${
          selectedStepId === step.id
            ? "bg-primary/10"
            : "hover:bg-gray-50"
        }`}
      >
        {hasChildren ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 mr-1"
            onClick={() => onToggleExpand(step.id)}
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
          onClick={() => onSelectStep(step)}
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
            onClick={() => onSelectStep(step)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => onAddChild(step.id)}
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
                  onClick={() => onDeleteStep(step.id)}
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
  );
};

export default DraggableStepNode;
