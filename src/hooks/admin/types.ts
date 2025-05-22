// Types for admin dashboard
export interface WaitlistSignup {
  id: string;
  name: string;
  email: string;
  created_at: string;
  utm_source: string | null;
  utm_medium: string | null;
  successful_referrals?: number;
  referral_code?: string;
  referrer_id?: string;
}

export interface SprintProfile {
  id: string;
  user_id: string;
  name: string | null;
  email: string | null;
  created_at: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  // Other sprint profile fields can be added as needed
}

export interface UnifiedSignup {
  id: string;
  name: string | null;
  email: string | null;
  created_at: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  source: 'waitlist' | 'sprint';
}

export interface UTMSource {
  source: string;
  count: number;
}

export interface UTMMedium {
  medium: string;
  count: number;
}

export interface ReferralStats {
  totalSignups: number;
  totalReferrals: number;
  topReferrers: {
    name: string;
    email: string;
    referrals: number;
  }[];
}

export interface UnifiedStats {
  totalSignups: number;
  waitlistSignups: number;
  sprintSignups: number;
  conversionRate: number;
  utmSources: UTMSource[];
  utmMediums: UTMMedium[];
}

export interface SignupsByDate {
  date: string;
  waitlist: number;
  sprint: number;
  total: number;
}
