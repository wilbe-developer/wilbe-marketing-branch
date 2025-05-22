
// Types for waitlist signups
export type WaitlistSignup = {
  id: string;
  name: string;
  email: string;
  created_at: string;
  referral_code: string;
  referrer_id: string | null;
  successful_referrals: number;
  utm_source: string | null;
  utm_medium: string | null;
  source?: 'waitlist';
};

// Types for sprint profiles
export type SprintProfile = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  created_at: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  source?: 'sprint';
};

// Unified signup type
export type UnifiedSignup = {
  id: string;
  name: string;
  email: string;
  created_at: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  source: 'waitlist' | 'sprint';
};

// UTM source type
export type UTMSource = {
  source: string;
  count: number;
};

// UTM medium type
export type UTMMedium = {
  medium: string;
  count: number;
};

// Referral stats type
export type ReferralStats = {
  totalSignups: number;
  totalReferrals: number;
  topReferrers: Array<{
    name: string;
    email: string;
    referrals: number;
  }>;
};

// Unified stats type
export type UnifiedStats = {
  totalSignups: number;
  waitlistSignups: number;
  sprintSignups: number;
  conversionRate: number;
  utmSources: UTMSource[];
  utmMediums: UTMMedium[];
};

// Signup data by date
export type SignupsByDate = {
  date: string;
  waitlist: number;
  sprint: number;
  total: number;
};
