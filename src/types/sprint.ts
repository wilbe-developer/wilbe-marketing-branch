
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

export interface SharedSprint {
  owner_id: string;
  owner_name: string;
  tasks: SharedTask[];
}

export interface SharedTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface TaskOption {
  label: string;
  value: string;
}
