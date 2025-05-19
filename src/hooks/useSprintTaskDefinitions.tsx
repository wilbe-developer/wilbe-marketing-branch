
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SprintTaskDefinition } from "@/types/task-builder";
import { UserTaskProgress } from "@/types/sprint";
import { useAuth } from "./useAuth";
import { useSprintContext } from "./useSprintContext";
import { toast } from "sonner";
import { generateTaskSummary, requiresUpload, getMainContent, getMainQuestion } from "@/utils/taskDefinitionAdapter";

export const useSprintTaskDefinitions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { currentSprintOwnerId, isSharedSprint } = useSprintContext();
  
  // Fetch task definitions
  const { data: taskDefinitions, isLoading: isTasksLoading, error } = useQuery({
    queryKey: ["sprintTaskDefinitions", "dashboard"],
    queryFn: async (): Promise<SprintTaskDefinition[]> => {
      const { data, error } = await supabase
        .from("sprint_task_definitions")
        .select("*")
        .order("name");
      
      if (error) throw error;
      
      // Parse JSON definition if it's a string
      return (data || []).map(item => {
        let parsedDefinition;
        
        if (typeof item.definition === 'string') {
          try {
            parsedDefinition = JSON.parse(item.definition);
          } catch (e) {
            console.error("Failed to parse definition JSON:", e);
            parsedDefinition = { taskName: item.name, steps: [] };
          }
        } else if (item.definition && typeof item.definition === 'object') {
          // Safety check - ensure the object has the required structure
          const defObj = item.definition as Record<string, any>;
          parsedDefinition = {
            taskName: defObj.taskName || item.name,
            steps: Array.isArray(defObj.steps) ? defObj.steps : [],
            profileQuestions: Array.isArray(defObj.profileQuestions) ? defObj.profileQuestions : [],
            description: defObj.description,
            category: defObj.category,
            order_index: defObj.order_index
          };
        } else {
          // Default fallback
          parsedDefinition = { taskName: item.name, steps: [] };
        }
        
        return {
          ...item,
          definition: parsedDefinition
        } as SprintTaskDefinition;
      });
    },
    enabled: !!user,
  });

  // Fetch user progress for tasks
  const { data: userProgress, isLoading: isProgressLoading } = useQuery({
    queryKey: ["userSprintProgress", currentSprintOwnerId],
    queryFn: async () => {
      if (!currentSprintOwnerId) return [];
      
      const { data, error } = await supabase
        .from("user_sprint_progress")
        .select("*")
        .eq("user_id", currentSprintOwnerId);
      
      if (error) throw error;
      
      // Parse JSON fields if they're strings
      return (data || []).map(item => ({
        ...item,
        answers: typeof item.answers === 'string' 
          ? JSON.parse(item.answers) 
          : (item.answers || null),
        task_answers: typeof item.task_answers === 'string'
          ? JSON.parse(item.task_answers)
          : (item.task_answers || null)
      }));
    },
    enabled: !!currentSprintOwnerId,
  });

  // Convert task definitions to format compatible with the dashboard
  const tasksWithProgress: UserTaskProgress[] = taskDefinitions?.map(taskDef => {
    // Extract task id and find progress record
    const taskId = taskDef.id;
    const progress = userProgress?.find(p => p.task_id === taskId);

    // Generate task summary for display
    const summary = generateTaskSummary(taskDef);

    // Get order_index from definition or default to 0
    const orderIndex = taskDef.definition.order_index || 0;

    // Convert task definition to UserTaskProgress format
    const taskProgress: UserTaskProgress = {
      id: taskDef.id,
      title: summary.title,
      description: summary.description || "",
      order_index: orderIndex, // Use order_index from definition
      upload_required: summary.requiresUpload,
      content: summary.content,
      question: summary.mainQuestion,
      options: null,
      category: summary.category,
      status: "active",
      progress: progress ? {
        ...progress,
        answers: progress.answers || null,
        task_answers: progress.task_answers || null
      } : undefined
    };

    return taskProgress;
  }) || [];

  // Update user progress
  const updateProgress = useMutation({
    mutationFn: async (params: { 
      taskId: string; 
      completed?: boolean; 
      answers?: Record<string, any>; 
      taskAnswers?: Record<string, any>;
      fileId?: string | null;
    }) => {
      if (!user || !currentSprintOwnerId) {
        throw new Error("User not authenticated");
      }
      
      const { taskId, completed, answers, taskAnswers, fileId } = params;
      
      // Check if progress entry exists
      const { data: existingProgress } = await supabase
        .from("user_sprint_progress")
        .select("id")
        .eq("user_id", currentSprintOwnerId)
        .eq("task_id", taskId)
        .maybeSingle();
      
      const now = new Date().toISOString();
      
      if (existingProgress) {
        // Update existing progress
        const updateData: Record<string, any> = {};
        
        if (completed !== undefined) {
          updateData.completed = completed;
          if (completed) updateData.completed_at = now;
        }
        
        if (answers !== undefined) updateData.answers = answers;
        if (taskAnswers !== undefined) updateData.task_answers = taskAnswers;
        if (fileId !== undefined) updateData.file_id = fileId;
        
        const { error } = await supabase
          .from("user_sprint_progress")
          .update(updateData)
          .eq("id", existingProgress.id);
        
        if (error) throw error;
      } else {
        // Create new progress entry
        const { error } = await supabase
          .from("user_sprint_progress")
          .insert({
            user_id: currentSprintOwnerId,
            task_id: taskId,
            completed: completed || false,
            answers: answers || null,
            task_answers: taskAnswers || null,
            file_id: fileId || null,
            completed_at: completed ? now : null
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userSprintProgress", currentSprintOwnerId] });
    },
    onError: (error) => {
      toast("Failed to update progress. Please try again.");
      console.error("Update progress error:", error);
    }
  });

  return {
    tasks: taskDefinitions,
    userProgress,
    tasksWithProgress,
    isLoading: isTasksLoading || isProgressLoading,
    error,
    updateProgress
  };
};
