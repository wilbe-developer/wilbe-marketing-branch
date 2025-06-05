
import { WorkloadIndicator } from '@/utils/workloadCalculation';

export interface UserTaskProgress {
  id: string;
  title: string;
  description: string;
  order_index: number;
  upload_required: boolean;
  content: string | null;
  question: string | null;
  options: any | null;
  category: string | null;
  status: string;
  workload?: WorkloadIndicator; // Add workload field
  progress?: {
    id: string;
    user_id: string;
    task_id: string;
    completed: boolean;
    completed_at: string | null;
    created_at: string;
    file_id: string | null;
    answers: Record<string, any> | null;
    task_answers: Record<string, any> | null;
  }
}

export interface SprintTask {
  id: string;
  title: string;
  description: string;
  order_index: number; // Add the missing field
  upload_required: boolean;
  content: string | null;
  question: string | null;
  options: any | null;
  category: string | null;
  status: string;
}

export interface UploadedFile {
  id: string;
  file_name: string;
  view_url: string;
  download_url: string;
  uploaded_at: string;
}

// Using snake_case for database fields as we're committing to the new system
export interface SharedSprint {
  owner_id: string;
  owner_name: string;
  owner_email?: string;
  tasks: SharedTask[];
}

// Define interface matching what's actually used in components
export interface SharedTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  upload_required?: boolean;
  category?: string | null;
  order_index?: number;
  progress?: {
    id: string;
    completed: boolean;
    completed_at: string | null;
    answers: Record<string, any> | null;
    file_id: string | null;
  };
}

export interface TaskOption {
  label: string;
  value: string;
}

// Add the UserSprintProgress interface that's missing
export interface UserSprintProgress {
  id: string;
  user_id: string;
  task_id: string;
  completed: boolean;
  file_id: string | null;
  answers: Record<string, any> | null;
  task_answers: Record<string, any> | null;
  completed_at: string | null;
  created_at: string;
}
