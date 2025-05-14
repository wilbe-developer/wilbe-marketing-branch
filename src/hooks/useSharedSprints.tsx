
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { UserTaskProgress } from "@/types/sprint";

// Define clear interfaces for our data structure
export interface TaskProgress {
  id: string;
  completed: boolean;
  completed_at: string | null;
  file_id: string | null;
  task_answers: any;
}

export interface SharedTask {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  order_index: number;
  content: string | null;
  question: string | null;
  options: any | null;
  upload_required: boolean;
  status: string | null;
  progress?: TaskProgress;
}

export interface SharedSprint {
  ownerId: string;
  ownerName: string;
  tasks: SharedTask[];
}

// This adapter ensures type safety when using SharedTask with components expecting UserTaskProgress
export function adaptSharedTaskToUserTaskProgress(task: SharedTask): UserTaskProgress {
  // Create a compatible task progress object that satisfies UserSprintProgress interface
  const progressAdapter = task.progress ? {
    id: task.progress.id,
    user_id: "", // We'll fill this with a dummy value
    task_id: task.id,
    completed: task.progress.completed,
    completed_at: task.progress.completed_at,
    file_id: task.progress.file_id,
    task_answers: task.progress.task_answers,
    answers: null
  } : undefined;

  // Return a UserTaskProgress compatible object
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    category: task.category,
    order_index: task.order_index,
    content: task.content,
    question: task.question,
    options: task.options,
    upload_required: task.upload_required,
    status: task.status,
    progress: progressAdapter
  };
}

export function useSharedSprints(userId: string | undefined) {
  const [sharedSprints, setSharedSprints] = useState<SharedSprint[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSharedSprints = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      try {
        // Get all sprints where the user is a collaborator
        const { data: collaborations, error: collabError } = await supabase
          .from("sprint_collaborators")
          .select("sprint_owner_id")
          .eq("collaborator_id", userId);

        if (collabError) throw collabError;
        
        if (!collaborations || collaborations.length === 0) {
          setSharedSprints([]);
          setIsLoading(false);
          return;
        }

        const sharedSprintList: SharedSprint[] = [];
        
        // Process each shared sprint separately to avoid deep nesting
        for (const collab of collaborations) {
          try {
            // Fetch owner profile data separately
            const { data: ownerData } = await supabase
              .from("profiles")
              .select("first_name, last_name")
              .eq("id", collab.sprint_owner_id)
              .single();

            // Fetch tasks separately
            const { data: rawTasks, error: tasksError } = await supabase
              .from("sprint_tasks")
              .select("id, title, description, category, order_index, content, question, options, upload_required, status")
              .eq("user_id", collab.sprint_owner_id)
              .order("order_index");

            if (tasksError) throw tasksError;
            
            // If we have tasks, fetch their progress data
            if (rawTasks && rawTasks.length > 0) {
              const transformedTasks: SharedTask[] = [];
              
              // For each task, get its progress separately
              for (const task of rawTasks) {
                const { data: progressData } = await supabase
                  .from("user_sprint_progress")
                  .select("id, completed, completed_at, file_id, task_answers")
                  .eq("task_id", task.id)
                  .eq("user_id", collab.sprint_owner_id)
                  .maybeSingle();
                
                // Create a clean task object with progress if available
                const sharedTask: SharedTask = {
                  ...task,
                  progress: progressData || undefined
                };
                
                transformedTasks.push(sharedTask);
              }
              
              // Create the final shared sprint with all data
              const ownerFullName = [
                ownerData?.first_name,
                ownerData?.last_name
              ].filter(Boolean).join(" ") || "Sprint Owner";
              
              sharedSprintList.push({
                ownerId: collab.sprint_owner_id,
                ownerName: ownerFullName,
                tasks: transformedTasks
              });
            }
          } catch (error) {
            console.error("Error processing shared sprint:", error);
          }
        }
        
        setSharedSprints(sharedSprintList);
      } catch (error) {
        console.error("Error fetching shared sprints:", error);
        toast({
          title: "Error",
          description: "Could not load shared sprints. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharedSprints();
  }, [userId]);

  return { sharedSprints, isLoading };
}
