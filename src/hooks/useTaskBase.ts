
import { useState, useEffect } from 'react';
import { useSprintTasks } from './useSprintTasks.tsx';
import { StepContext, StepContextType } from './team-step-builder/types';
import { toast } from 'sonner';

export interface TaskState {
  [key: string]: any;
}

export interface TaskStep {
  type: 'question' | 'content' | 'upload';
  question?: string;
  options?: Array<{ label: string; value: string }>;
  content?: string | React.ReactNode | (string | React.ReactNode)[];
  context?: StepContextType;
  action?: string;
  uploads?: string[];
}

export interface TaskBaseProps {
  task: any;
  sprintProfile?: any;
  initialState?: TaskState;
}

export const useTaskBase = ({ task, sprintProfile, initialState = {} }: TaskBaseProps) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [currentStepContext, setCurrentStepContext] = useState<StepContext | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [uploadedFileId, setUploadedFileId] = useState<string | undefined>(undefined);
  const [answers, setAnswers] = useState<TaskState>({});
  const [state, setState] = useState<TaskState>(initialState);
  const { updateProgress } = useSprintTasks();

  // Load existing answers and file ID from progress
  useEffect(() => {
    if (task?.progress) {
      setIsLoading(true);
      
      if (task.progress.file_id) {
        setUploadedFileId(task.progress.file_id);
      }
      
      // Load existing answers from progress
      if (task.progress.task_answers && Object.keys(task.progress.task_answers).length > 0) {
        setAnswers(task.progress.task_answers);
        
        // Also update state with matching answers
        setState(prevState => ({
          ...prevState,
          ...Object.keys(prevState).reduce((acc, key) => {
            if (task.progress.task_answers[key] !== undefined) {
              acc[key] = task.progress.task_answers[key];
            }
            return acc;
          }, {})
        }));
      }
      
      setIsLoading(false);
    }
  }, [task?.progress]);

  // Handle step changes
  const handleStepChange = (stepIndex: number, context?: StepContext) => {
    setCurrentStep(stepIndex);
    setCurrentStepContext(context);
  };
  
  // Update answer for a specific step
  const updateAnswer = (key: string, value: any) => {
    setAnswers(prevAnswers => {
      const newAnswers = { ...prevAnswers, [key]: value };
      
      // Immediately save to database when answers change
      if (task?.id) {
        updateProgress.mutate({
          taskId: task.id,
          completed: false,
          fileId: uploadedFileId,
          taskAnswers: newAnswers
        });
      }
      
      return newAnswers;
    });
  };
  
  // Update multiple answers at once
  const updateAnswers = (stepIndex: number, answer: any) => {
    // Map numeric index to semantic key for current step if needed
    const key = typeof stepIndex === 'string' ? stepIndex : `step_${stepIndex}`;
    updateAnswer(key, answer);
  };
  
  // Update state
  const updateState = (key: string, value: any) => {
    setState(prevState => ({ ...prevState, [key]: value }));
  };
  
  // Update multiple state fields at once
  const updateMultipleState = (updates: TaskState) => {
    setState(prevState => ({ ...prevState, ...updates }));
  };
  
  // Handle completion
  const handleComplete = async (fileId?: string) => {
    setIsLoading(true);
    try {
      await updateProgress.mutateAsync({
        taskId: task.id,
        completed: true,
        fileId: fileId || uploadedFileId,
        taskAnswers: answers
      });
      return true;
    } catch (error) {
      console.error("Error saving task data:", error);
      toast.error("Failed to save your progress");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentStep,
    currentStepContext,
    answers,
    state,
    isLoading,
    uploadedFileId,
    handleStepChange,
    updateAnswer,
    updateAnswers,
    updateState,
    updateMultipleState,
    setUploadedFileId,
    handleComplete
  };
};
