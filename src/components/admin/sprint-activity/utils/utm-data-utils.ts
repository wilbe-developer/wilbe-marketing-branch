
import { supabase } from '@/integrations/supabase/client';

export const fetchUTMData = async (timeRange: '7d' | '30d' | '90d' | 'all') => {
  try {
    // Calculate date range for filtering
    let startDate: Date | null = null;
    if (timeRange !== 'all') {
      startDate = new Date();
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      startDate.setDate(startDate.getDate() - days);
    }
    
    // Query waitlist signups
    let waitlistQuery = supabase
      .from('waitlist_signups')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Apply time filter if not 'all'
    if (startDate) {
      waitlistQuery = waitlistQuery.gte('created_at', startDate.toISOString());
    }
    
    const { data: waitlistData, error: waitlistError } = await waitlistQuery;
    
    if (waitlistError) throw waitlistError;
    
    // Query sprint profiles for UTM data
    let sprintQuery = supabase
      .from('sprint_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Apply time filter if not 'all'
    if (startDate) {
      sprintQuery = sprintQuery.gte('created_at', startDate.toISOString());
    }
    
    const { data: sprintData, error: sprintError } = await sprintQuery;
    
    if (sprintError) throw sprintError;
    
    // Combine data from both sources
    const combinedData = [
      ...(waitlistData || []).map(item => ({ 
        ...item,
        source_type: 'waitlist'
      })),
      ...(sprintData || []).map(item => ({ 
        ...item,
        source_type: 'sprint',
        // Ensure sprint data has the same property names as waitlist data
        name: item.name || 'Unknown',
        email: item.email || 'No Email'
      }))
    ];
    
    return combinedData;
  } catch (err) {
    console.error('Error fetching UTM data:', err);
    throw err;
  }
};

export const processUTMChartData = (data: any[]) => {
  // Process data for campaign chart
  const campaignCounts: Record<string, number> = {};
  const sourceCounts: Record<string, number> = {};
  const mediumCounts: Record<string, number> = {};
  
  data.forEach(item => {
    const campaign = item.utm_campaign || 'direct';
    const source = item.utm_source || 'direct';
    const medium = item.utm_medium || 'direct';
    
    campaignCounts[campaign] = (campaignCounts[campaign] || 0) + 1;
    sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    mediumCounts[medium] = (mediumCounts[medium] || 0) + 1;
  });
  
  const campaignChartData = Object.entries(campaignCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  
  const sourceChartData = Object.entries(sourceCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
    
  const mediumChartData = Object.entries(mediumCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  
  return {
    campaignChartData,
    sourceChartData,
    mediumChartData
  };
};
