
import React, { useEffect, useState } from "react";
import TeamTaskLogic from "./TeamTaskLogic";
import GenericTaskLogic from "../task-system/GenericTaskLogic";
import { SprintProfileShowOrAsk } from "../SprintProfileShowOrAsk";
import { getTaskDefinition } from "@/data/task-definitions";
import { supabase } from "@/integrations/supabase/client";
import { TaskDefinition } from "@/types/task-definition";
import { Skeleton } from "@/components/ui/skeleton";

export const SprintTaskLogicRouter = ({
  task,
  isCompleted,
  onComplete
}: {
  task: any;
  isCompleted: boolean;
  onComplete: (fileId?: string) => void;
}) => {
  const [dbTaskDefinition, setDbTaskDefinition] = useState<TaskDefinition | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Try to load task definition from database
  useEffect(() => {
    const fetchTaskDefinition = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('task_definitions')
          .select('*')
          .eq('title', task.title)
          .single();
          
        if (error) {
          console.error('Error fetching task definition:', error);
        } else if (data) {
          // Parse the JSON fields and ensure we handle non-string values
          const parsedData = {
            ...data,
            steps: Array.isArray(data.steps) ? data.steps : JSON.parse(typeof data.steps === 'string' ? data.steps : JSON.stringify(data.steps)),
            conditionalFlow: data.conditional_flow ? 
              (typeof data.conditional_flow === 'object' ? data.conditional_flow : JSON.parse(typeof data.conditional_flow === 'string' ? data.conditional_flow : JSON.stringify(data.conditional_flow))) : 
              {},
            answerMapping: data.answer_mapping ? 
              (typeof data.answer_mapping === 'object' ? data.answer_mapping : JSON.parse(typeof data.answer_mapping === 'string' ? data.answer_mapping : JSON.stringify(data.answer_mapping))) : 
              {}
          };
          setDbTaskDefinition(parsedData);
        }
      } catch (err) {
        console.error('Failed to parse task definition:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (task.title) {
      fetchTaskDefinition();
    } else {
      setIsLoading(false);
    }
  }, [task.title]);
  
  // Check for loading state
  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-1/3" />
      </div>
    );
  }
  
  // First priority: Use database task definition if available
  if (dbTaskDefinition) {
    return (
      <GenericTaskLogic
        task={task}
        isCompleted={isCompleted}
        onComplete={onComplete}
        taskDefinition={dbTaskDefinition}
      />
    );
  }
  
  // Second priority: Use local JS task definition if available
  const localTaskDefinition = getTaskDefinition(task.title);
  if (localTaskDefinition) {
    return (
      <GenericTaskLogic
        task={task}
        isCompleted={isCompleted}
        onComplete={onComplete}
        taskDefinition={localTaskDefinition}
      />
    );
  }
  
  // For backward compatibility, use existing task components
  switch (task.title) {
    case "Develop Team Building Plan":
    case "Team Profile":
      return (
        <TeamTaskLogic
          task={task}
          isCompleted={isCompleted}
          onComplete={onComplete}
          hideMainQuestion={true}
        />
      );
      
    case "IP & Technology Transfer":
      return (
        <TeamTaskLogic
          task={task}
          isCompleted={isCompleted}
          onComplete={onComplete}
          hideMainQuestion={true}
        />
      );
      
    default:
      return (
        <div className="p-6 text-center">
          <p className="text-gray-500">This task type is not yet implemented. Please define it in the task registry.</p>
        </div>
      );
  }
};

export default SprintTaskLogicRouter;
