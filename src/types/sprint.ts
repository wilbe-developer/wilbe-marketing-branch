
import { WorkloadIndicator } from "@/utils/workloadCalculation";

export interface TaskOption {
  label: string;
  value: string;
}

export interface SprintTask {
  id: string;
  title: string;
  description: string;
  order_index: number;
  upload_required: boolean;
  content?: string;
  question?: string;
  options?: TaskOption[] | null;
  category?: string;
  status: "pending" | "active" | "completed";
}

export interface UserSprintProgress {
  id: string;
  user_id: string;
  task_id: string;
  completed: boolean;
  file_id?: string | null;
  answers?: Record<string, any> | null;
  task_answers?: Record<string, any> | null;
  completed_at?: string | null;
  created_at: string;
}

export interface UserTaskProgress extends SprintTask {
  workload?: WorkloadIndicator; // Add workload indicator
  progress?: UserSprintProgress;
}
