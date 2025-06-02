export interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  linkedIn?: string;
  institution?: string;
  location?: string;
  role?: string;
  bio?: string;
  about?: string;
  expertise?: string;
  avatar?: string;
  approved?: boolean;
  createdAt?: string;
  activityStatus?: string;
  status?: string;
  twitterHandle?: string;
  lastLoginDate?: string;
  isAdmin?: boolean;
  isMember?: boolean;
  isDashboardActive?: boolean;
  dashboardAccessEnabled?: boolean;
}
