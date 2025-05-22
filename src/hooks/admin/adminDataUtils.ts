
import { 
  WaitlistSignup, 
  SprintProfile, 
  UnifiedSignup, 
  UTMSource, 
  UTMMedium, 
  ReferralStats, 
  UnifiedStats,
  SignupsByDate
} from "./types";

// Unify data from both waitlist and sprint profiles
export const unifyData = (
  waitlistSignups: WaitlistSignup[], 
  sprintProfiles: SprintProfile[]
): UnifiedSignup[] => {
  const waitlistData = waitlistSignups.map(signup => ({
    id: signup.id,
    name: signup.name,
    email: signup.email,
    created_at: signup.created_at,
    utm_source: signup.utm_source,
    utm_medium: signup.utm_medium,
    utm_campaign: null,
    utm_term: null,
    utm_content: null,
    source: 'waitlist' as const
  }));
  
  const sprintData = sprintProfiles.map(profile => ({
    id: profile.id,
    name: profile.name,
    email: profile.email,
    created_at: profile.created_at,
    utm_source: profile.utm_source,
    utm_medium: profile.utm_medium,
    utm_campaign: profile.utm_campaign,
    utm_term: profile.utm_term,
    utm_content: profile.utm_content,
    source: 'sprint' as const
  }));
  
  // Combine both datasets and sort by creation date (newest first)
  return [...waitlistData, ...sprintData].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

// Calculate referral statistics
export const calculateReferralStats = (waitlistSignups: WaitlistSignup[]): ReferralStats => {
  const totalSignups = waitlistSignups.length;
  const totalReferrals = waitlistSignups.reduce((sum, signup) => 
    sum + (signup.successful_referrals || 0), 0
  );
  
  // Find top referrers
  const topReferrers = [...waitlistSignups]
    .filter(signup => signup.successful_referrals && signup.successful_referrals > 0)
    .sort((a, b) => (b.successful_referrals || 0) - (a.successful_referrals || 0))
    .slice(0, 5)
    .map(signup => ({
      name: signup.name,
      email: signup.email,
      referrals: signup.successful_referrals || 0
    }));
  
  return {
    totalSignups,
    totalReferrals,
    topReferrers
  };
};

// Analyze UTM data - Modified to handle both direct types and UnifiedSignup
export const analyzeUTMData = (signups: (WaitlistSignup | SprintProfile | UnifiedSignup)[]): { utmSources: UTMSource[], utmMediums: UTMMedium[] } => {
  const sourceCount: Record<string, number> = {};
  const mediumCount: Record<string, number> = {};
  
  signups.forEach(signup => {
    if (signup.utm_source) {
      sourceCount[signup.utm_source] = (sourceCount[signup.utm_source] || 0) + 1;
    }
    
    if (signup.utm_medium) {
      mediumCount[signup.utm_medium] = (mediumCount[signup.utm_medium] || 0) + 1;
    }
  });
  
  const utmSources = Object.entries(sourceCount)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);
    
  const utmMediums = Object.entries(mediumCount)
    .map(([medium, count]) => ({ medium, count }))
    .sort((a, b) => b.count - a.count);
  
  return { utmSources, utmMediums };
};

// Analyze unified data
export const analyzeUnifiedData = (unifiedSignups: UnifiedSignup[]): UnifiedStats => {
  const totalSignups = unifiedSignups.length;
  const waitlistSignups = unifiedSignups.filter(signup => signup.source === 'waitlist').length;
  const sprintSignups = unifiedSignups.filter(signup => signup.source === 'sprint').length;
  
  // Calculate conversion rate
  const conversionRate = waitlistSignups > 0 
    ? (sprintSignups / totalSignups) * 100 
    : 0;
  
  // Analyze UTM data
  const { utmSources, utmMediums } = analyzeUTMData(unifiedSignups);
  
  return {
    totalSignups,
    waitlistSignups,
    sprintSignups,
    conversionRate,
    utmSources,
    utmMediums
  };
};

// Get signup data by date for charts
export const getSignupsByDate = (
  unifiedSignups: UnifiedSignup[],
  source: 'all' | 'waitlist' | 'sprint' = 'all',
  days: number = 14
): SignupsByDate[] => {
  // Create date buckets for the last N days
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today
  
  const dates: SignupsByDate[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0); // Start of day
    
    dates.push({
      date: date.toISOString().split('T')[0],
      waitlist: 0,
      sprint: 0,
      total: 0
    });
  }
  
  // Filter signups by source if needed
  const filteredSignups = source === 'all' 
    ? unifiedSignups 
    : unifiedSignups.filter(signup => signup.source === source);
  
  // Count signups per date
  filteredSignups.forEach(signup => {
    const signupDate = new Date(signup.created_at).toISOString().split('T')[0];
    
    const dateEntry = dates.find(d => d.date === signupDate);
    if (dateEntry) {
      if (signup.source === 'waitlist') {
        dateEntry.waitlist += 1;
      } else if (signup.source === 'sprint') {
        dateEntry.sprint += 1;
      }
      
      dateEntry.total += 1;
    }
  });
  
  return dates;
};
