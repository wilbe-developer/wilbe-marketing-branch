
import { 
  WaitlistSignup, 
  SprintProfile, 
  UnifiedSignup,
  UTMSource,
  UTMMedium,
  ReferralStats,
  UnifiedStats,
  SignupsByDate
} from './types';

// Unify data from waitlist and sprint tables
export const unifyData = (
  waitlistSignups: WaitlistSignup[], 
  sprintProfiles: SprintProfile[]
): UnifiedSignup[] => {
  const waitlistData = waitlistSignups.map(signup => ({
    id: signup.id,
    name: signup.name,
    email: signup.email,
    source: 'waitlist' as const,
    created_at: signup.created_at,
    utm_source: signup.utm_source || null,
    utm_medium: signup.utm_medium || null,
    utm_campaign: null,
    utm_term: null,
    utm_content: null
  }));
  
  const sprintData = sprintProfiles.map(profile => ({
    id: profile.id,
    name: profile.name || 'Unknown',
    email: profile.email || 'No Email',
    source: 'sprint' as const,
    created_at: profile.created_at,
    utm_source: profile.utm_source || null,
    utm_medium: profile.utm_medium || null,
    utm_campaign: profile.utm_campaign || null,
    utm_term: profile.utm_term || null,
    utm_content: profile.utm_content || null
  }));
  
  // Combine and sort by creation date (newest first)
  return [...waitlistData, ...sprintData].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

// Calculate referral statistics from waitlist data
export const calculateReferralStats = (waitlistSignups: WaitlistSignup[]): ReferralStats => {
  // Filter out users who have made successful referrals
  const referrers = waitlistSignups.filter(signup => signup.successful_referrals && signup.successful_referrals > 0);
  
  // Sort by number of referrals
  const topReferrers = [...referrers]
    .sort((a, b) => (b.successful_referrals || 0) - (a.successful_referrals || 0))
    .slice(0, 10)
    .map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      referrals: user.successful_referrals || 0
    }));
  
  // Count total referrals
  const totalReferrals = referrers.reduce((sum, user) => sum + (user.successful_referrals || 0), 0);
  
  return {
    totalSignups: waitlistSignups.length,
    totalReferrals,
    topReferrers
  };
};

// Analyze UTM data from waitlist signups
export const analyzeUTMData = (waitlistSignups: WaitlistSignup[]) => {
  const sourceMap = new Map<string, number>();
  const mediumMap = new Map<string, number>();
  
  waitlistSignups.forEach(signup => {
    // Process UTM source
    if (signup.utm_source) {
      const source = signup.utm_source.toLowerCase();
      sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
    } else {
      sourceMap.set('direct', (sourceMap.get('direct') || 0) + 1);
    }
    
    // Process UTM medium
    if (signup.utm_medium) {
      const medium = signup.utm_medium.toLowerCase();
      mediumMap.set(medium, (mediumMap.get(medium) || 0) + 1);
    } else {
      mediumMap.set('none', (mediumMap.get('none') || 0) + 1);
    }
  });
  
  // Convert Maps to arrays of objects
  const utmSources: UTMSource[] = Array.from(sourceMap.entries())
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);
    
  const utmMediums: UTMMedium[] = Array.from(mediumMap.entries())
    .map(([medium, count]) => ({ medium, count }))
    .sort((a, b) => b.count - a.count);
  
  return { utmSources, utmMediums };
};

// Analyze unified data
export const analyzeUnifiedData = (unifiedSignups: UnifiedSignup[]): UnifiedStats => {
  const waitlistSignups = unifiedSignups.filter(signup => signup.source === 'waitlist').length;
  const sprintSignups = unifiedSignups.filter(signup => signup.source === 'sprint').length;
  const totalSignups = unifiedSignups.length;
  
  // Calculate conversion rate (waitlist to sprint)
  const conversionRate = waitlistSignups > 0 
    ? (sprintSignups / (waitlistSignups + sprintSignups)) * 100 
    : 0;
  
  // Analyze UTM sources and mediums across all data
  const sourceMap = new Map<string, number>();
  const mediumMap = new Map<string, number>();
  
  unifiedSignups.forEach(signup => {
    // Process UTM source
    if (signup.utm_source) {
      const source = signup.utm_source.toLowerCase();
      sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
    } else {
      sourceMap.set('direct', (sourceMap.get('direct') || 0) + 1);
    }
    
    // Process UTM medium
    if (signup.utm_medium) {
      const medium = signup.utm_medium.toLowerCase();
      mediumMap.set(medium, (mediumMap.get(medium) || 0) + 1);
    } else {
      mediumMap.set('none', (mediumMap.get('none') || 0) + 1);
    }
  });
  
  // Convert Maps to arrays of objects
  const utmSources: UTMSource[] = Array.from(sourceMap.entries())
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count);
    
  const utmMediums: UTMMedium[] = Array.from(mediumMap.entries())
    .map(([medium, count]) => ({ medium, count }))
    .sort((a, b) => b.count - a.count);
  
  return {
    totalSignups,
    waitlistSignups,
    sprintSignups,
    conversionRate,
    utmSources,
    utmMediums
  };
};

// Get signups by date for charts
export const getSignupsByDate = (
  unifiedSignups: UnifiedSignup[],
  source: 'all' | 'waitlist' | 'sprint' = 'all',
  days: number = 14
): SignupsByDate[] => {
  // Filter by source if needed
  const filteredSignups = source === 'all' 
    ? unifiedSignups 
    : unifiedSignups.filter(signup => signup.source === source);
  
  // Create a map to hold counts by date
  const dateMap = new Map<string, { waitlist: number, sprint: number }>();
  
  // Get the date N days ago
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);
  
  // Initialize all dates in the range with zero counts
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const dateStr = date.toLocaleDateString();
    dateMap.set(dateStr, { waitlist: 0, sprint: 0 });
  }
  
  // Count signups by date and source
  filteredSignups.forEach(signup => {
    const signupDate = new Date(signup.created_at);
    
    // Skip if before our start date
    if (signupDate < startDate) return;
    
    const dateStr = signupDate.toLocaleDateString();
    const current = dateMap.get(dateStr) || { waitlist: 0, sprint: 0 };
    
    if (signup.source === 'waitlist') {
      current.waitlist += 1;
    } else {
      current.sprint += 1;
    }
    
    dateMap.set(dateStr, current);
  });
  
  // Convert map to array and sort by date
  return Array.from(dateMap.entries())
    .map(([date, counts]) => ({
      date,
      waitlist: counts.waitlist,
      sprint: counts.sprint,
      total: counts.waitlist + counts.sprint
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};
