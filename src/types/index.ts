export interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  linkedIn?: string;
  institution?: string;
  role?: string;
  location?: string;
  approved?: boolean;
  avatar?: string;
  about?: string;
  expertise?: string;
  bio?: string;
  coverPhoto?: string;
  twitterHandle?: string;
  status?: string;
  activityStatus?: string;
  isAdmin?: boolean;
  isMember?: boolean; // New field for member status (includes admins)
  createdAt?: Date; // Add missing createdAt property
  lastLoginDate?: Date; // Add missing lastLoginDate property
  applicationStatus?: 'not_started' | 'under_review'; // New field for application status
  applicationSubmittedAt?: Date; // New field for submission timestamp
}

export interface Module {
  id: string;
  title: string;
  slug: string;
  description: string;
  videos: Video[];
  isDeckBuilderModule?: boolean;
  deckBuilderSlide?: string;
  orderIndex?: number;
}

export interface Video {
  id: string;
  moduleId: string;
  title: string;
  description?: string;
  youtubeId?: string;
  duration?: string;
  order?: number;
  presenter?: string;
  thumbnailUrl?: string;
  completed?: boolean;
  created_at?: string;
  // Deck builder specific properties
  isDeckBuilderVideo?: boolean;
  deckBuilderSlide?: string;
  deckBuilderModuleId?: string; // To store the deck builder specific module
}

// Updated to match what's actually used in the database
export type UserRole = 'user' | 'admin';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
