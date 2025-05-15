
import { useState, useEffect, useCallback } from "react";
import { useSprintTasks } from "./useSprintTasks";
import { Step } from "@/components/sprint/StepBasedTaskLogic";

export const useIPTaskData = (task: any, sprintProfile: any) => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [uploadedFileId, setUploadedFileId] = useState<string | undefined>();
  const { updateProgress } = useSprintTasks();
  
  // Load existing answers if available
  useEffect(() => {
    if (task.progress?.task_answers) {
      setAnswers(task.progress.task_answers);
    }
    
    if (task.progress?.file_id) {
      setUploadedFileId(task.progress.file_id);
    }
  }, [task.progress]);
  
  // Update steps based on profile and answers
  const updateSteps = useCallback(() => {
    const hasUniversityIP = sprintProfile?.university_ip === true;
    const newSteps: Step[] = [];
    
    // Build the steps array based on profile and current answers
    // This is where the step logic would go
    
    setSteps(newSteps);
  }, [sprintProfile, answers]);
  
  useEffect(() => {
    updateSteps();
  }, [updateSteps, sprintProfile, answers]);
  
  // Update answers when a step changes
  const handleAnswerUpdate = (stepIndex: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [stepIndex]: value
    }));
  };
  
  // Complete the task and save data
  const handleComplete = async () => {
    try {
      await updateProgress.mutateAsync({
        taskId: task.id,
        completed: true,
        fileId: uploadedFileId,
        task_answers: answers
      });
      return true;
    } catch (error) {
      console.error("Error saving IP task data:", error);
      return false;
    }
  };
  
  return {
    steps,
    answers,
    uploadedFileId,
    handleAnswerUpdate,
    handleComplete,
    setUploadedFileId
  };
};
