
import { supabase } from '@/integrations/supabase/client';

export const fetchUnifiedData = async (timeRange: '7d' | '30d' | '90d' | 'all') => {
  try {
    // Calculate date range for filtering
    let startDate: Date | null = null;
    if (timeRange !== 'all') {
      startDate = new Date();
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      startDate.setDate(startDate.getDate() - days);
    }
    
    // Fetch waitlist signups
    let waitlistQuery = supabase
      .from('waitlist_signups')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (startDate) {
      waitlistQuery = waitlistQuery.gte('created_at', startDate.toISOString());
    }
    
    const { data: waitlistData, error: waitlistError } = await waitlistQuery;
    
    if (waitlistError) throw waitlistError;
    
    // Fetch sprint profiles
    let sprintQuery = supabase
      .from('sprint_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (startDate) {
      sprintQuery = sprintQuery.gte('created_at', startDate.toISOString());
    }
    
    const { data: sprintData, error: sprintError } = await sprintQuery;
    
    if (sprintError) throw sprintError;
    
    // Fetch profile creations
    let profilesQuery = supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (startDate) {
      profilesQuery = profilesQuery.gte('created_at', startDate.toISOString());
    }
    
    const { data: profilesData, error: profilesError } = await profilesQuery;
    
    if (profilesError) throw profilesError;
    
    // Fetch application submissions
    let applicationsQuery = supabase
      .from('user_applications')
      .select('*')
      .order('submitted_at', { ascending: false });
    
    if (startDate) {
      applicationsQuery = applicationsQuery.gte('submitted_at', startDate.toISOString());
    }
    
    const { data: applicationsData, error: applicationsError } = await applicationsQuery;
    
    if (applicationsError) throw applicationsError;
    
    // Combine and normalize data
    const combinedData = [
      ...(waitlistData || []).map(item => ({
        ...item,
        source_type: 'waitlist'
      })),
      ...(sprintData || []).map(item => ({
        ...item,
        source_type: 'sprint',
        name: item.name || 'Unknown',
        email: item.email || 'No Email'
      })),
      ...(profilesData || []).map(item => ({
        ...item,
        source_type: 'profile_creation',
        name: `${item.first_name || ''} ${item.last_name || ''}`.trim() || 'Unknown',
        email: item.email || 'No Email'
      })),
      ...(applicationsData || []).filter(item => item.submitted_at).map(item => {
        // Find corresponding profile for name/email
        const profile = profilesData?.find(p => p.id === item.user_id);
        return {
          ...item,
          source_type: 'application_submission',
          name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown' : 'Unknown',
          email: profile?.email || 'No Email',
          created_at: item.submitted_at
        };
      })
    ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    return combinedData;
  } catch (err) {
    console.error('Error fetching unified data:', err);
    throw err;
  }
};

export const processDataForCharts = (data: any[]) => {
  // Count signups by source
  const waitlistSignups = data.filter(item => item.source_type === 'waitlist');
  const sprintSignups = data.filter(item => item.source_type === 'sprint');
  const profileCreations = data.filter(item => item.source_type === 'profile_creation');
  const applicationSubmissions = data.filter(item => item.source_type === 'application_submission');
  
  // Calculate counts
  const waitlistCount = waitlistSignups.length;
  const sprintCount = sprintSignups.length;
  const profileCount = profileCreations.length;
  const applicationCount = applicationSubmissions.length;
  const totalCount = data.length;
  
  // Create source distribution data
  const sourceData = [
    { name: 'Profile Creations', value: profileCount },
    { name: 'Applications', value: applicationCount },
    { name: 'Waitlist', value: waitlistCount },
    { name: 'Sprint', value: sprintCount }
  ];
  
  // Process UTM source data (mainly from profiles and waitlist)
  const utmSourceMap: Record<string, number> = {};
  data.forEach(item => {
    const source = item.utm_source || 'direct';
    utmSourceMap[source] = (utmSourceMap[source] || 0) + 1;
  });
  
  const utmSourceData = Object.entries(utmSourceMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  
  // Process UTM medium data
  const utmMediumMap: Record<string, number> = {};
  data.forEach(item => {
    const medium = item.utm_medium || 'direct';
    utmMediumMap[medium] = (utmMediumMap[medium] || 0) + 1;
  });
  
  const utmMediumData = Object.entries(utmMediumMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  
  // Process daily signups (last 14 days)
  const dailyData = processDailySignups(data);
  
  return {
    conversionMetrics: {
      profileCount,
      applicationCount,
      waitlistCount,
      sprintCount,
      totalCount
    },
    sourceDistribution: sourceData,
    dailySignups: dailyData,
    utmSourceData,
    utmMediumData
  };
};

export const processDailySignups = (data: any[]) => {
  // Create a map for the last 14 days
  const dailyMap = new Map();
  
  // Initialize with last 14 days
  for (let i = 13; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    dailyMap.set(dateString, { 
      date: dateString, 
      profiles: 0, 
      applications: 0, 
      waitlist: 0, 
      sprint: 0, 
      total: 0 
    });
  }
  
  // Count signups by date and source
  data.forEach(item => {
    const dateString = new Date(item.created_at).toISOString().split('T')[0];
    if (dailyMap.has(dateString)) {
      const dayData = dailyMap.get(dateString);
      if (item.source_type === 'profile_creation') {
        dayData.profiles += 1;
      } else if (item.source_type === 'application_submission') {
        dayData.applications += 1;
      } else if (item.source_type === 'waitlist') {
        dayData.waitlist += 1;
      } else if (item.source_type === 'sprint') {
        dayData.sprint += 1;
      }
      dayData.total += 1;
      dailyMap.set(dateString, dayData);
    }
  });
  
  // Convert map to array and sort by date
  return Array.from(dailyMap.values()).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
};
