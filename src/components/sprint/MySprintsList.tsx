
import React from "react";
import TaskCard from "@/components/sprint/TaskCard";
import { UserTaskProgress } from "@/types/sprint";

interface MySprintsListProps {
  tasks: UserTaskProgress[];
}

export const MySprintsList: React.FC<MySprintsListProps> = ({ tasks }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
      {tasks.map((task, index) => (
        <div 
          key={task.id}
          data-tutorial-id={index === 0 ? 'first-task-card' : undefined}
        >
          <TaskCard 
            task={task} 
            disabled={false}
          />
        </div>
      ))}
    </div>
  );
};
