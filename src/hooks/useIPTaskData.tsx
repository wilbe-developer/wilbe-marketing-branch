
import { useState, useEffect, useCallback } from "react";
import { useSprintTasks } from "./useSprintTasks";
import { Step } from "@/components/sprint/StepBasedTaskLogic";

export const useIPTaskData = (task: any, sprintProfile: any) => {
  const [uploadedFileId, setUploadedFileId] = useState<string | undefined>();
  const { updateProgress } = useSprintTasks();
  
  // Load existing file ID if available
  useEffect(() => {
    if (task.progress?.file_id) {
      setUploadedFileId(task.progress.file_id);
    }
  }, [task.progress]);
  
  // Complete the task and save data
  const handleComplete = async (answers: Record<string, any>, fileId?: string) => {
    try {
      await updateProgress.mutateAsync({
        taskId: task.id,
        completed: true,
        fileId: fileId || uploadedFileId,
        taskAnswers: answers
      });
      return true;
    } catch (error) {
      console.error("Error saving IP task data:", error);
      return false;
    }
  };
  
  return {
    uploadedFileId,
    setUploadedFileId,
    updateProgress,
    handleComplete
  };
};
