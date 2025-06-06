
export type TopicFilter = 'all' | 'challenges' | 'faqs' | 'private' | string;

export interface Thread {
  id: string;
  title: string;
  content: string;
  author_id: string;
  challenge_id?: string;
  is_private: boolean;
  recipient_id?: string;
  created_at: string;
  last_edited_at?: string;
  is_pinned?: boolean;
  pinned_at?: string;
  pinned_by?: string;
  author_profile?: {
    first_name: string;
    last_name: string;
    avatar?: string;
  };
  author_role?: {
    role: string;
  };
  comment_count?: Array<{ count: number }>;
  challenge_name?: string;
  recipient_profile?: {
    first_name: string;
    last_name: string;
    avatar?: string;
  };
}

export interface ThreadComment {
  id: string;
  thread_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at?: string;
  author_profile?: {
    first_name: string;
    last_name: string;
    avatar?: string;
  };
  author_role?: {
    role: string;
  };
}

export interface Challenge {
  id: string;
  title: string;
  category?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category?: string;
  created_at: string;
}
