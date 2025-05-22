
import { WaitlistSignup, SprintProfile, UnifiedSignup, UTMSource, UTMMedium, ReferralStats, UnifiedStats, SignupsByDate } from "./types";

// Unify the data from both sources
export const unifyData = (waitlistSignups: WaitlistSignup[], sprintProfiles: SprintProfile[]): UnifiedSignup[] => {
  // Convert waitlist signups to unified format
  const waitlistUnified: UnifiedSignup[] = waitlistSignups.map(signup => ({
    id: signup.id,
    name: signup.name,
    email: signup.email,
    created_at: signup.created_at,
    utm_source: signup.utm_source,
    utm_medium: signup.utm_medium,
    utm_campaign: null,
    utm_term: null,
    utm_content: null,
    source: 'waitlist'
  }));

  // Convert sprint profiles to unified format
  const sprintUnified: UnifiedSignup[] = sprintProfiles.map(profile => ({
    id: profile.id,
    name: profile.name || '',
    email: profile.email || '',
    created_at: profile.created_at,
    utm_source: profile.utm_source,
    utm_medium: profile.utm_medium,
    utm_campaign: profile.utm_campaign,
    utm_term: profile.utm_term,
    utm_content: profile.utm_content,
    source: 'sprint'
  }));

  // Combine and sort by date
  return [...waitlistUnified, ...sprintUnified].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

// Calculate referral statistics
export const calculateReferralStats = (signups: WaitlistSignup[]): ReferralStats => {
  const totalSignups = signups.length;
  const signupsWithReferrers = signups.filter(signup => signup.referrer_id).length;
  
  // Get top referrers
  const referrerMap = new Map<string, { name: string; email: string; referrals: number }>();
  
  signups.forEach(signup => {
    if (signup.successful_referrals > 0) {
      referrerMap.set(signup.id, {
        name: signup.name,
        email: signup.email,
        referrals: signup.successful_referrals
      });
    }
  });
  
  const topReferrers = Array.from(referrerMap.values())
    .sort((a, b) => b.referrals - a.referrals)
    .slice(0, 10);
  
  return {
    totalSignups,
    totalReferrals: signupsWithReferrers,
    topReferrers
  };
};

// Analyze unified data
export const analyzeUnifiedData = (signups: UnifiedSignup[]): UnifiedStats => {
  // Count by source
  const waitlistCount = signups.filter(s => s.source === 'waitlist').length;
  const sprintCount = signups.filter(s => s.source === 'sprint').length;
  const totalCount = signups.length;
  
  // Calculate conversion rate
  const conversionRate = waitlistCount > 0 ? (sprintCount / totalCount) * 100 : 0;
  
  // Analyze UTM sources
  const sourceMap = new Map<string, number>();
  const mediumMap = new Map<string, number>();
  
  signups.forEach(signup => {
    if (signup.utm_source) {
      const currentCount = sourceMap.get(signup.utm_source) || 0;
      sourceMap.set(signup.utm_source, currentCount + 1);
    }
    
    if (signup.utm_medium) {
      const currentCount = mediumMap.get(signup.utm_medium) || 0;
      mediumMap.set(signup.utm_medium, currentCount + 1);
    }
  });
  
  const utmSourcesArray = Array.from(sourceMap.entries()).map(([source, count]) => ({
    source,
    count
  })).sort((a, b) => b.count - a.count);
  
  const utmMediumsArray = Array.from(mediumMap.entries()).map(([medium, count]) => ({
    medium,
    count
  })).sort((a, b) => b.count - a.count);
  
  return {
    totalSignups: totalCount,
    waitlistSignups: waitlistCount,
    sprintSignups: sprintCount,
    conversionRate,
    utmSources: utmSourcesArray,
    utmMediums: utmMediumsArray
  };
};

// Analyze UTM data for waitlist only
export const analyzeUTMData = (signups: WaitlistSignup[]): { utmSources: UTMSource[], utmMediums: UTMMedium[] } => {
  const sourceMap = new Map<string, number>();
  const mediumMap = new Map<string, number>();
  
  signups.forEach(signup => {
    if (signup.utm_source) {
      const currentCount = sourceMap.get(signup.utm_source) || 0;
      sourceMap.set(signup.utm_source, currentCount + 1);
    }
    
    if (signup.utm_medium) {
      const currentCount = mediumMap.get(signup.utm_medium) || 0;
      mediumMap.set(signup.utm_medium, currentCount + 1);
    }
  });
  
  const utmSourcesArray = Array.from(sourceMap.entries()).map(([source, count]) => ({
    source,
    count
  })).sort((a, b) => b.count - a.count);
  
  const utmMediumsArray = Array.from(mediumMap.entries()).map(([medium, count]) => ({
    medium,
    count
  })).sort((a, b) => b.count - a.count);
  
  return { utmSources: utmSourcesArray, utmMediums: utmMediumsArray };
};

// Get signup data by date for charts
export const getSignupsByDate = (
  unifiedSignups: UnifiedSignup[],
  source: 'all' | 'waitlist' | 'sprint' = 'all',
  days: number = 14
): SignupsByDate[] => {
  let data = unifiedSignups;
  
  if (source === 'waitlist') {
    data = unifiedSignups.filter(signup => signup.source === 'waitlist');
  } else if (source === 'sprint') {
    data = unifiedSignups.filter(signup => signup.source === 'sprint');
  }
  
  const dateMap = new Map<string, SignupsByDate>();
  
  // Initialize all dates in the range with zeros
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString();
    dateMap.set(dateStr, { date: dateStr, waitlist: 0, sprint: 0, total: 0 });
  }
  
  // Fill in actual counts
  data.forEach(signup => {
    const date = new Date(signup.created_at).toLocaleDateString();
    if (dateMap.has(date)) {
      const current = dateMap.get(date)!;
      if (signup.source === 'waitlist') {
        current.waitlist += 1;
      } else {
        current.sprint += 1;
      }
      current.total += 1;
      dateMap.set(date, current);
    }
  });
  
  return Array.from(dateMap.values())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};
