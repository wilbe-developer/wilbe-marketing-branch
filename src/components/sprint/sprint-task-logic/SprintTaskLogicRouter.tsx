
import React, { useEffect, useState } from "react";
import TeamTaskLogic from "./TeamTaskLogic";
import GenericTaskLogic from "../task-system/GenericTaskLogic";
import { SprintProfileShowOrAsk } from "../SprintProfileShowOrAsk";
import { getTaskDefinition } from "@/data/task-definitions";
import { supabase } from "@/integrations/supabase/client";
import { TaskDefinition } from "@/types/task-definition";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

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
          .maybeSingle(); // Changed from single() to handle case when no task definition is found
          
        if (error && error.code !== 'PGRST116') { // PGRST116 is the "not found" error code
          console.error('Error fetching task definition:', error);
          throw error;
        }
        
        if (data) {
          console.log('Found task definition in database:', data.title);
          // Parse the JSON fields and ensure we handle non-string values
          try {
            const parsedData: TaskDefinition = {
              ...data,
              steps: parseJsonField(data.steps),
              conditionalFlow: parseJsonField(data.conditional_flow) || {},
              answerMapping: parseJsonField(data.answer_mapping) || {}
            };
            
            // Convert snake_case profile_options to camelCase profileOptions
            if (data.profile_options) {
              parsedData.profileOptions = parseJsonField(data.profile_options);
              // Remove the original snake_case property to avoid duplication
              delete parsedData.profile_options;
            }
            
            // Convert other snake_case fields to camelCase
            if (data.profile_key) parsedData.profileKey = data.profile_key;
            if (data.profile_label) parsedData.profileLabel = data.profile_label;
            if (data.profile_type) parsedData.profileType = data.profile_type;
            
            setDbTaskDefinition(parsedData);
          } catch (parseError) {
            console.error('Failed to parse task definition fields:', parseError);
            toast.error("There was an error loading this task. Please try again.");
          }
        } else {
          console.log('No task definition found in database for:', task.title);
        }
      } catch (err) {
        console.error('Failed to fetch task definition:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Helper function to parse JSON fields safely
    const parseJsonField = (field: any): any => {
      if (!field) return null;
      
      // If it's already an object, return it
      if (typeof field === 'object' && !Array.isArray(field)) return field;
      
      // If it's an array, return it
      if (Array.isArray(field)) return field;
      
      // Otherwise, try to parse it as JSON
      try {
        return JSON.parse(field);
      } catch (e) {
        console.warn('Could not parse field as JSON:', field);
        return field;
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
    console.log('Rendering task with database definition:', dbTaskDefinition.title);
    console.log('Task has steps:', dbTaskDefinition.steps?.length || 0);
    console.log('Task has conditional flow:', Object.keys(dbTaskDefinition.conditionalFlow || {}).length);
    
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
    console.log('Rendering task with local definition:', localTaskDefinition.title);
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
  console.log('Falling back to specific task component for:', task.title);
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
