
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProgressDisplayProps {
  completedTasks: number;
  totalTasks: number;
}

export const ProgressDisplay: React.FC<ProgressDisplayProps> = ({ 
  completedTasks, 
  totalTasks 
}) => {
  const isMobile = useIsMobile();
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${isMobile ? 'p-4 mb-4' : 'p-6 mb-6'}`}>
      <div className="flex justify-between items-center mb-2">
        <h2 className={`${isMobile ? 'text-base' : 'text-lg'} font-medium`}>Overall Progress</h2>
        <span className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>
          {completedTasks} of {totalTasks} tasks completed
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
        <div 
          className="bg-brand-pink h-3 rounded-full transition-all duration-500" 
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>
      <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
        {completionPercentage}% complete
      </p>
    </div>
  );
};
