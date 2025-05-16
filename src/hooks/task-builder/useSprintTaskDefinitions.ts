
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SprintTaskDefinition, TaskDefinition } from "@/types/task-builder";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export const useSprintTaskDefinitions = () => {
  const queryClient = useQueryClient();

  // Fetch all task definitions
  const { data: taskDefinitions, isLoading, error } = useQuery({
    queryKey: ["sprintTaskDefinitions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sprint_task_definitions")
        .select("*")
        .order("name");

      if (error) {
        throw new Error(`Error fetching task definitions: ${error.message}`);
      }

      return data.map(item => ({
        ...item,
        definition: item.definition as TaskDefinition
      })) as SprintTaskDefinition[];
    }
  });

  // Fetch a single task definition by ID
  const fetchTaskDefinition = async (id: string) => {
    const { data, error } = await supabase
      .from("sprint_task_definitions")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Error fetching task definition: ${error.message}`);
    }

    return {
      ...data,
      definition: data.definition as TaskDefinition
    } as SprintTaskDefinition;
  };

  // Create a new task definition
  const createTaskDefinition = useMutation({
    mutationFn: async (taskDefinition: Omit<SprintTaskDefinition, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("sprint_task_definitions")
        .insert({
          name: taskDefinition.name,
          description: taskDefinition.description,
          definition: taskDefinition.definition as any // Type cast to any for JSON compatibility
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Error creating task definition: ${error.message}`);
      }

      return {
        ...data,
        definition: data.definition as TaskDefinition
      } as SprintTaskDefinition;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sprintTaskDefinitions"] });
      toast.success("Task definition created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  // Update an existing task definition
  const updateTaskDefinition = useMutation({
    mutationFn: async (taskDefinition: Pick<SprintTaskDefinition, "id" | "name" | "description" | "definition">) => {
      const { data, error } = await supabase
        .from("sprint_task_definitions")
        .update({
          name: taskDefinition.name,
          description: taskDefinition.description,
          definition: taskDefinition.definition as any // Type cast to any for JSON compatibility
        })
        .eq("id", taskDefinition.id)
        .select()
        .single();

      if (error) {
        throw new Error(`Error updating task definition: ${error.message}`);
      }

      return {
        ...data,
        definition: data.definition as TaskDefinition
      } as SprintTaskDefinition;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sprintTaskDefinitions"] });
      toast.success("Task definition updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  // Delete a task definition
  const deleteTaskDefinition = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("sprint_task_definitions")
        .delete()
        .eq("id", id);

      if (error) {
        throw new Error(`Error deleting task definition: ${error.message}`);
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sprintTaskDefinitions"] });
      toast.success("Task definition deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  // Create a new empty task definition template
  const createEmptyTaskDefinition = (): Omit<SprintTaskDefinition, "id" | "created_at" | "updated_at"> => {
    return {
      name: "New Task",
      description: "Task description",
      definition: {
        taskName: "New Task",
        description: "Task description",
        profileQuestions: [],
        steps: [
          {
            id: uuidv4(),
            type: "question",
            text: "Initial question",
            inputType: "radio",
            options: [
              { label: "Option 1", value: "option1" },
              { label: "Option 2", value: "option2" }
            ]
          }
        ]
      }
    };
  };

  return {
    taskDefinitions,
    isLoading,
    error,
    fetchTaskDefinition,
    createTaskDefinition,
    updateTaskDefinition,
    deleteTaskDefinition,
    createEmptyTaskDefinition
  };
};
