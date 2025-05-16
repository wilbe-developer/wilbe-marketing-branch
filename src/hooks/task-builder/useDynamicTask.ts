
import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TaskDefinition, StepNode, Condition } from "@/types/task-builder";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface UseDynamicTaskProps {
  taskId: string;
  sprintProfile: any;
}

export const useDynamicTask = ({ taskId, sprintProfile }: UseDynamicTaskProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [visibleSteps, setVisibleSteps] = useState<StepNode[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // Fetch task definition
  const { data: taskDefinition, isLoading: isLoadingTask } = useQuery({
    queryKey: ["taskDefinition", taskId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sprint_task_definitions")
        .select("*")
        .eq("id", taskId)
        .single();

      if (error) {
        throw new Error(`Error fetching task definition: ${error.message}`);
      }

      return data.definition as TaskDefinition;
    },
    enabled: !!taskId,
  });

  // Fetch user progress for this task
  const { data: userProgress, isLoading: isLoadingProgress } = useQuery({
    queryKey: ["userTaskProgress", taskId, user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("user_task_progress")
        .select("*")
        .eq("task_id", taskId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        throw new Error(`Error fetching user progress: ${error.message}`);
      }

      return data;
    },
    enabled: !!taskId && !!user?.id,
  });

  // Evaluate a single condition against the current state
  const evaluateCondition = useCallback((condition: Condition): boolean => {
    let sourceValue: any;

    // Get the value we're checking against
    if (condition.source.profileKey) {
      sourceValue = sprintProfile?.[condition.source.profileKey];
    } else if (condition.source.stepId) {
      sourceValue = answers[condition.source.stepId];
    } else {
      return false;
    }

    // Evaluate the condition based on the operator
    switch (condition.operator) {
      case "equals":
        return sourceValue === condition.value;
      case "not_equals":
        return sourceValue !== condition.value;
      case "in":
        return Array.isArray(condition.value) && condition.value.includes(sourceValue);
      case "not_in":
        return Array.isArray(condition.value) && !condition.value.includes(sourceValue);
      default:
        return false;
    }
  }, [sprintProfile, answers]);

  // Check if a step should be visible based on its conditions
  const isStepVisible = useCallback((step: StepNode): boolean => {
    if (!step.conditions || step.conditions.length === 0) {
      return true;
    }

    // If any condition evaluates to false, the step is not visible
    return step.conditions.every(condition => evaluateCondition(condition));
  }, [evaluateCondition]);

  // Walk the tree and collect visible steps
  const buildVisibleStepsList = useCallback(() => {
    if (!taskDefinition?.steps) return [];

    const walkTree = (nodes: StepNode[]): StepNode[] => {
      const result: StepNode[] = [];
      
      for (const node of nodes) {
        if (isStepVisible(node)) {
          result.push(node);
          
          // Check if we need to look at children based on answers
          const answer = answers[node.id];
          
          if (node.onAnswer && answer && node.onAnswer[answer]) {
            // Add conditional children based on specific answer
            result.push(...walkTree(node.onAnswer[answer]));
          }
          
          if (node.children) {
            // Add regular children
            result.push(...walkTree(node.children));
          }
        }
      }
      
      return result;
    };
    
    return walkTree(taskDefinition.steps);
  }, [taskDefinition, isStepVisible, answers]);

  // Save user's answer for a step
  const answerNode = useMutation({
    mutationFn: async ({ stepId, value }: { stepId: string; value: any }) => {
      if (!user?.id) throw new Error("User not authenticated");

      const newAnswers = { ...answers, [stepId]: value };
      setAnswers(newAnswers);

      // Update or create user progress
      const { error } = await supabase
        .from("user_task_progress")
        .upsert({
          user_id: user.id,
          task_id: taskId,
          answers: newAnswers
        })
        .select();

      if (error) {
        throw error;
      }

      return { stepId, value };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userTaskProgress", taskId, user?.id] });
      setCurrentStepIndex(prev => Math.min(prev + 1, visibleSteps.length - 1));
    },
    onError: (error) => {
      toast.error(`Failed to save answer: ${error.message}`);
    }
  });

  // Upload a file for a step
  const uploadFile = useMutation({
    mutationFn: async ({ stepId, file }: { stepId: string; file: File }) => {
      // Implement file upload logic here
      // For now, we'll just simulate it
      const fileId = `file-${Date.now()}`;
      
      // Update answers with the file reference
      return answerNode.mutateAsync({ 
        stepId, 
        value: { fileId, fileName: file.name } 
      });
    }
  });

  // Update user's profile in response to profile questions
  const updateProfile = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      if (!user?.id) throw new Error("User not authenticated");

      // Update the profile in sprint_profiles table
      // This part would depend on your specific profile structure
      const { error } = await supabase
        .from("sprint_profiles")
        .update({ [key]: value })
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }

      // Also store that we updated the profile as part of this task
      const { error: progressError } = await supabase
        .from("user_task_progress")
        .upsert({
          user_id: user.id,
          task_id: taskId,
          profile_updates: { ...userProgress?.profile_updates, [key]: value }
        });

      if (progressError) {
        throw progressError;
      }

      return { key, value };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userTaskProgress", taskId, user?.id] });
      queryClient.invalidateQueries({ queryKey: ["sprintProfile", user?.id] });
    },
    onError: (error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    }
  });

  // Mark task as completed
  const completeTask = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("user_task_progress")
        .update({
          completed: true,
          completed_at: new Date().toISOString()
        })
        .eq("user_id", user.id)
        .eq("task_id", taskId);

      if (error) {
        throw error;
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userTaskProgress", taskId, user?.id] });
      toast.success("Task completed successfully");
    },
    onError: (error) => {
      toast.error(`Failed to complete task: ${error.message}`);
    }
  });

  // Navigate to a specific step
  const goToStep = (index: number) => {
    if (index >= 0 && index < visibleSteps.length) {
      setCurrentStepIndex(index);
    }
  };

  // Update visible steps when task definition, answers, or profile changes
  useEffect(() => {
    if (taskDefinition) {
      const steps = buildVisibleStepsList();
      setVisibleSteps(steps);
    }
  }, [taskDefinition, answers, sprintProfile, buildVisibleStepsList]);

  // Load saved answers from user progress
  useEffect(() => {
    if (userProgress?.answers) {
      setAnswers(userProgress.answers);
    }
  }, [userProgress]);

  return {
    taskDefinition,
    isLoading: isLoadingTask || isLoadingProgress,
    visibleSteps,
    currentStep: visibleSteps[currentStepIndex],
    currentStepIndex,
    answers,
    userProgress,
    answerNode: (stepId: string, value: any) => answerNode.mutateAsync({ stepId, value }),
    uploadFile: (stepId: string, file: File) => uploadFile.mutateAsync({ stepId, file }),
    updateProfile: (key: string, value: any) => updateProfile.mutateAsync({ key, value }),
    completeTask: () => completeTask.mutateAsync(),
    goToStep,
    isCompleted: userProgress?.completed || false
  };
};
