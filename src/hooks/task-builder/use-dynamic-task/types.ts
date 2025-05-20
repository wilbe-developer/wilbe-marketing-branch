
import { TaskDefinition, StepNode } from "@/types/task-builder";

export interface UseDynamicTaskProps {
  taskId: string;
  sprintProfile: any;
}

export interface UseDynamicTaskReturn {
  taskDefinition: TaskDefinition | null;
  isLoading: boolean;
  visibleSteps: StepNode[];
  currentStep: StepNode | undefined;
  currentStepIndex: number;
  answers: Record<string, any>;
  userProgress: any;
  answerNode: (stepId: string, value: any) => Promise<void>;
  uploadFile: (stepId: string, file: File) => Promise<void>;
  updateProfile: (key: string, value: any) => Promise<void>;
  completeTask: () => Promise<void>;
  goToStep: (index: number) => void;
  isCompleted: boolean;
}
