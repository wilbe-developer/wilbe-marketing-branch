
export interface WaitlistSignup {
  id: string;
  name: string;
  email: string;
  created_at: string;
  utm_source?: string | null;
  utm_medium?: string | null;
  referrer_id?: string | null;
  referral_code?: string;
  successful_referrals?: number;
}

export interface SprintProfile {
  id: string;
  user_id: string;
  name?: string | null;
  email?: string | null;
  created_at: string;
  updated_at: string;
  linkedin_url?: string | null;
  current_job?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  experiment_validated?: string | null; // Changed from boolean to string
  // Add other fields as needed
}

export interface UnifiedSignup {
  id: string;
  name: string;
  email: string;
  source: 'waitlist' | 'sprint';
  created_at: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
}

export interface UTMSource {
  source: string;
  count: number;
}

export interface UTMMedium {
  medium: string;
  count: number;
}

export interface TopReferrer {
  id: string;
  name: string;
  email: string;
  referrals: number;
}

export interface ReferralStats {
  totalSignups: number;
  totalReferrals: number;
  topReferrers: TopReferrer[];
}

export interface SignupsByDate {
  date: string;
  waitlist: number;
  sprint: number;
  total: number;
}

export interface UnifiedStats {
  totalSignups: number;
  waitlistSignups: number;
  sprintSignups: number;
  conversionRate: number;
  utmSources: UTMSource[];
  utmMediums: UTMMedium[];
}

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  linked_in: string | null;
  institution: string | null;
  location: string | null;
  role: string | null;
  bio: string | null;
  about: string | null;
  expertise: string | null;
  avatar: string | null;
  approved: boolean | null;
  created_at: string;
  activity_status: string | null;
  status: string | null;
  twitter_handle: string | null;
  last_login_date: string | null;
}

export interface UserApplication {
  id: string;
  user_id: string;
  application_type: string;
  status: string;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
}
