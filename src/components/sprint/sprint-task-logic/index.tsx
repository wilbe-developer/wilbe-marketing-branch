import React from 'react';
import { TaskDefinition } from '@/types/task-builder';
import DynamicTaskLogic from '@/components/sprint/DynamicTaskLogic';
import GenericTaskLogic from '@/components/sprint/task-system/GenericTaskLogic';

interface SprintTaskLogicRouterProps {
  task: any;
  isCompleted: boolean;
  onComplete: (fileId?: string) => Promise<void>;
  taskDefinition?: TaskDefinition;
}

export const SprintTaskLogicRouter: React.FC<SprintTaskLogicRouterProps> = ({
  task,
  isCompleted,
  onComplete,
  taskDefinition
}) => {
  // If we have a task definition with the new format, use the dynamic task logic
  if (taskDefinition && taskDefinition.steps) {
    return (
      <DynamicTaskLogic
        taskDefinition={{
          id: task.id,
          name: task.title,
          description: task.description,
          definition: taskDefinition
        }}
        isCompleted={isCompleted}
        onComplete={onComplete}
        initialAnswers={task.progress?.answers || {}}
      />
    );
  }
  
  // Otherwise, check if we have a task-specific logic component
  const taskSpecificComponents: Record<string, React.FC<any>> = {
    // Map specific task IDs to their custom components if needed
  };
  
  // If there's a specific component for this task, use it
  const SpecificComponent = task.id && taskSpecificComponents[task.id];
  if (SpecificComponent) {
    return <SpecificComponent task={task} isCompleted={isCompleted} onComplete={onComplete} />;
  }
  
  // If we have a task definition in the older format, use the generic task logic
  if (taskDefinition) {
    return (
      <GenericTaskLogic
        task={task}
        isCompleted={isCompleted}
        onComplete={onComplete}
        taskDefinition={taskDefinition as any}
      />
    );
  }
  
  // If no task logic can be loaded, return null
  return null;
};
