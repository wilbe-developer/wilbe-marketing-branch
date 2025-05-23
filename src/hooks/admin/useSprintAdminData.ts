
import { useState, useEffect } from "react";
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
import { 
  fetchWaitlistSignups, 
  fetchSprintProfiles 
} from "./fetchAdminData";
import { 
  unifyData, 
  calculateReferralStats, 
  analyzeUnifiedData, 
  analyzeUTMData, 
  getSignupsByDate as getSignupsByDateUtil 
} from "./adminDataUtils";
import { useAdminFilter } from "./useAdminFilter";

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
  
  // Get admin user IDs for filtering
  const { adminUserIds, isLoading: isLoadingAdmins } = useAdminFilter();

  // Initialize data fetching
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const waitlistData = await fetchWaitlistSignups();
        const sprintData = await fetchSprintProfiles();
        
        setWaitlistSignups(waitlistData);
        setSprintProfiles(sprintData);
        
        // Calculate referral stats
        if (waitlistData.length > 0) {
          setReferralStats(calculateReferralStats(waitlistData));
        }
        
        // Analyze UTM data for waitlist only
        if (waitlistData.length > 0) {
          const { utmSources, utmMediums } = analyzeUTMData(waitlistData);
          setUtmSources(utmSources);
          setUtmMediums(utmMediums);
        }
        
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Unify data whenever either data source changes or adminUserIds changes
  useEffect(() => {
    if ((waitlistSignups.length > 0 || sprintProfiles.length > 0) && adminUserIds.length >= 0) {
      const unified = unifyData(waitlistSignups, sprintProfiles, adminUserIds);
      setUnifiedSignups(unified);
      
      // Analyze unified data
      const stats = analyzeUnifiedData(unified);
      setUnifiedStats(stats);
    }
  }, [waitlistSignups, sprintProfiles, adminUserIds]);

  // Get signup data by date for charts
  const getSignupsByDate = (
    source: 'all' | 'waitlist' | 'sprint' = 'all',
    days: number = 14
  ): SignupsByDate[] => {
    return getSignupsByDateUtil(unifiedSignups, source, days);
  };

  // Refresh data
  const refreshData = async () => {
    try {
      setIsLoading(true);
      const waitlistData = await fetchWaitlistSignups();
      const sprintData = await fetchSprintProfiles();
      
      setWaitlistSignups(waitlistData);
      setSprintProfiles(sprintData);
      
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    waitlistSignups,
    sprintProfiles,
    unifiedSignups,
    referralStats,
    utmSources,
    utmMediums,
    unifiedStats,
    isLoading: isLoading || isLoadingAdmins,
    error,
    refreshData,
    getSignupsByDate,
    adminUserIds
  };
};
