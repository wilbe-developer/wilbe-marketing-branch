
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

export type UTMSource = {
  source: string;
  count: number;
};

export type UTMMedium = {
  medium: string;
  count: number;
};

export type ReferralStats = {
  totalSignups: number;
  totalReferrals: number;
  topReferrers: Array<{
    name: string;
    email: string;
    referrals: number;
  }>;
};

export type UnifiedStats = {
  totalSignups: number;
  waitlistSignups: number;
  sprintSignups: number;
  conversionRate: number;
  utmSources: UTMSource[];
  utmMediums: UTMMedium[];
};

export const useSprintAdminData = () => {
  const [waitlistSignups, setWaitlistSignups] = useState<WaitlistSignup[]>([]);
  const [sprintProfiles, setSprintProfiles] = useState<SprintProfile[]>([]);
  const [unifiedSignups, setUnifiedSignups] = useState<UnifiedSignup[]>([]);
  const [utmSources, setUtmSources] = useState<UTMSource[]>([]);
  const [utmMediums, setUtmMediums] = useState<UTMMedium[]>([]);
  const [unifiedStats, setUnifiedStats] = useState<UnifiedStats>({
    totalSignups: 0,
    waitlistSignups: 0,
    sprintSignups: 0,
    conversionRate: 0,
    utmSources: [],
    utmMediums: []
  });
  const [referralStats, setReferralStats] = useState<ReferralStats>({
    totalSignups: 0,
    totalReferrals: 0,
    topReferrers: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all waitlist signups
  const fetchWaitlistSignups = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("waitlist_signups")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      if (data) {
        const waitlistData = data.map(item => ({
          ...item,
          source: 'waitlist' as const
        }));
        setWaitlistSignups(waitlistData as WaitlistSignup[]);
        calculateReferralStats(waitlistData as WaitlistSignup[]);
      }
    } catch (error: any) {
      console.error("Error fetching waitlist signups:", error);
      toast.error("Failed to load waitlist data");
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all sprint profiles
  const fetchSprintProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from("sprint_profiles")
        .select("id, user_id, name, email, created_at, utm_source, utm_medium, utm_campaign, utm_term, utm_content")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      if (data) {
        const sprintData = data.map(item => ({
          ...item,
          source: 'sprint' as const
        }));
        setSprintProfiles(sprintData as SprintProfile[]);
      }
    } catch (error: any) {
      console.error("Error fetching sprint profiles:", error);
      toast.error("Failed to load sprint profile data");
    }
  };

  // Unify the data from both sources
  const unifyData = () => {
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
    const combined = [...waitlistUnified, ...sprintUnified].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    setUnifiedSignups(combined);
    analyzeUnifiedData(combined);
  };

  // Calculate referral statistics
  const calculateReferralStats = (signups: WaitlistSignup[]) => {
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
    
    setReferralStats({
      totalSignups,
      totalReferrals: signupsWithReferrers,
      topReferrers
    });
  };

  // Analyze unified data
  const analyzeUnifiedData = (signups: UnifiedSignup[]) => {
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
    
    setUtmSources(utmSourcesArray);
    setUtmMediums(utmMediumsArray);
    
    // Set unified stats
    setUnifiedStats({
      totalSignups: totalCount,
      waitlistSignups: waitlistCount,
      sprintSignups: sprintCount,
      conversionRate: conversionRate,
      utmSources: utmSourcesArray,
      utmMediums: utmMediumsArray
    });
  };

  // Analyze UTM data for waitlist only
  const analyzeUTMData = (signups: WaitlistSignup[]) => {
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
    
    setUtmSources(utmSourcesArray);
    setUtmMediums(utmMediumsArray);
  };

  // Get signup data by date for charts
  const getSignupsByDate = (source: 'all' | 'waitlist' | 'sprint' = 'all', days: number = 14) => {
    let data = unifiedSignups;
    
    if (source === 'waitlist') {
      data = unifiedSignups.filter(signup => signup.source === 'waitlist');
    } else if (source === 'sprint') {
      data = unifiedSignups.filter(signup => signup.source === 'sprint');
    }
    
    const dateMap = new Map<string, { date: string; waitlist: number; sprint: number; total: number }>();
    
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

  // Initialize data fetching
  useEffect(() => {
    fetchWaitlistSignups();
    fetchSprintProfiles();
  }, []);

  // Unify data whenever either data source changes
  useEffect(() => {
    if (waitlistSignups.length > 0 || sprintProfiles.length > 0) {
      unifyData();
    }
  }, [waitlistSignups, sprintProfiles]);

  // Refresh data
  const refreshData = () => {
    fetchWaitlistSignups();
    fetchSprintProfiles();
  };

  return {
    waitlistSignups,
    sprintProfiles,
    unifiedSignups,
    referralStats,
    utmSources,
    utmMediums,
    unifiedStats,
    isLoading,
    error,
    refreshData,
    getSignupsByDate
  };
};
