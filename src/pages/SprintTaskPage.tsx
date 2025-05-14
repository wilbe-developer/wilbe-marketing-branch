
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSprintSubmission } from "@/hooks/useSprintSubmission";
import { supabase } from "@/integrations/supabase/client";
import { SprintTaskLogicRouter } from "@/components/sprint/sprint-task-logic";
import { useSharedSprint } from "@/hooks/useSharedSprint";
import { SharedSprintNotification } from "@/components/sprint/SharedSprintNotification";
import { SprintLayout } from "@/components/sprint/SprintLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const SprintTaskPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState<any>(null);
  const [progress, setProgress] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const { isSubmitting, handleSubmit } = useSprintSubmission();
  const { isSharedSprint, sprintOwnerId } = useSharedSprint();

  useEffect(() => {
    const fetchTaskAndProgress = async () => {
      if (!taskId || !user) return;
      
      setIsLoading(true);
      try {
        // If it's a shared sprint, we need to fetch the task from the owner's tasks
        const userId = isSharedSprint ? sprintOwnerId : user.id;
        
        // Fetch the task
        const { data: taskData, error: taskError } = await supabase
          .from("sprint_tasks")
          .select("*")
          .eq("id", taskId)
          .eq("user_id", userId)
          .single();
          
        if (taskError) throw taskError;
        
        setTask(taskData);
        
        // Check if we're in view-only mode for shared sprint
        if (isSharedSprint) {
          const { data: accessLevelData, error: accessError } = await supabase
            .from("sprint_collaborators")
            .select("access_level")
            .eq("sprint_owner_id", sprintOwnerId)
            .eq("collaborator_id", user.id)
            .single();
            
          if (!accessError && accessLevelData) {
            setIsReadOnly(accessLevelData.access_level === "view");
          }
        }
        
        // Fetch progress data for this task
        // For shared sprints, we'll fetch the owner's progress
        const { data: progressData, error: progressError } = await supabase
          .from("user_sprint_progress")
          .select("*")
          .eq("task_id", taskId)
          .eq("user_id", userId)
          .maybeSingle();
          
        if (progressError && progressError.code !== "PGRST116") throw progressError;
        
        if (progressData) {
          setProgress(progressData);
        }
      } catch (error) {
        console.error("Error fetching task:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTaskAndProgress();
  }, [taskId, user, isSharedSprint, sprintOwnerId]);
  
  const handleBack = () => {
    navigate("/sprint/dashboard");
  };
  
  if (isLoading) {
    return (
      <SprintLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </SprintLayout>
    );
  }
  
  if (!task) {
    return (
      <SprintLayout>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Task Not Found</h1>
          <p className="mb-6">This task may not exist or you may not have access to it.</p>
          <Button onClick={handleBack}>Back to Dashboard</Button>
        </div>
      </SprintLayout>
    );
  }
  
  return (
    <SprintLayout>
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="mb-4 pl-0" 
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <SharedSprintNotification taskId={taskId} />
        
        <h1 className="text-2xl font-bold">{task.title}</h1>
        {task.description && (
          <p className="text-gray-600 mt-2">{task.description}</p>
        )}
      </div>
      
      <SprintTaskLogicRouter 
        task={task} 
        progress={progress}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        readOnly={isReadOnly}
      />
    </SprintLayout>
  );
};

export default SprintTaskPage;
