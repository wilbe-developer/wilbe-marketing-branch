
import React from 'react';
import { StepNode } from '@/types/task-builder';
import { Button } from '@/components/ui/button';

interface TaskCompletedProps {
  steps: StepNode[];
  answers: Record<string, any>;
  onEdit?: () => void;
  isEditMode?: boolean;
}

const TaskCompleted: React.FC<TaskCompletedProps> = ({ 
  steps, 
  answers, 
  onEdit,
  isEditMode = false
}) => {
  if (isEditMode) return null;
  
  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-green-800 font-medium">Task Completed</h3>
            <p className="text-green-700 text-sm mt-1">
              You have successfully completed this task.
            </p>
          </div>
          {onEdit && (
            <Button 
              onClick={onEdit}
              variant="outline" 
              className="bg-white hover:bg-gray-50"
            >
              Edit Answers
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCompleted;
