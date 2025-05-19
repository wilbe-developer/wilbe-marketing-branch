
import React from 'react';

interface TaskProgressProps {
  currentStep: number;
  totalSteps: number;
}

const TaskProgress: React.FC<TaskProgressProps> = ({ currentStep, totalSteps }) => {
  const progressPercentage = Math.round(((currentStep + 1) / totalSteps) * 100);

  return (
    <div className="flex justify-between text-sm text-gray-500">
      <div>Step {currentStep + 1} of {totalSteps}</div>
      <div>{progressPercentage}% complete</div>
    </div>
  );
};

export default TaskProgress;
