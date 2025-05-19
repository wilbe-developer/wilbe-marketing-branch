
import React from 'react';
import { StepNode } from '@/types/task-builder';

interface TaskCompletedProps {
  steps: StepNode[];
  answers: Record<string, any>;
}

const TaskCompleted: React.FC<TaskCompletedProps> = ({ steps, answers }) => {
  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-green-800 font-medium">Task Completed</h3>
        <p className="text-green-700 text-sm mt-1">
          You have successfully completed this task.
        </p>
      </div>
      
      {Object.keys(answers).length > 0 && (
        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-2">Your Answers</h3>
          <div className="space-y-2">
            {steps.map(step => (
              answers[step.id] && (
                <div key={step.id} className="text-sm">
                  <div className="font-medium">{step.text}</div>
                  <div className="text-gray-600 mt-1">
                    {typeof answers[step.id] === 'object' 
                      ? JSON.stringify(answers[step.id]) 
                      : answers[step.id].toString()}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCompleted;
