
import React from "react";
import { Users } from "lucide-react";
import TaskCard from "@/components/sprint/TaskCard";
import { adaptSharedTaskToUserTaskProgress } from "@/hooks/useSharedSprints";
import { SharedSprint } from "@/types/sprint";

interface SharedSprintsListProps {
  sharedSprints: SharedSprint[];
  isLoading: boolean;
}

export const SharedSprintsList: React.FC<SharedSprintsListProps> = ({ 
  sharedSprints, 
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {sharedSprints.map((sprint) => (
        <div key={sprint.owner_id} className="space-y-4">
          <div className="flex items-center">
            <Users className="mr-2 h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-medium text-blue-800">
              {sprint.owner_name}'s Sprint
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
            {sprint.tasks.map((task) => {
              // Safely adapt the shared task to a UserTaskProgress
              const compatibleTask = adaptSharedTaskToUserTaskProgress(task);
              
              return (
                <TaskCard 
                  key={task.id} 
                  task={compatibleTask}
                  disabled={false}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
