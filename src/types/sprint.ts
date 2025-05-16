
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
