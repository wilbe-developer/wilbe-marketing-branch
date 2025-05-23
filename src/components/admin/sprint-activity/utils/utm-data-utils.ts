
import { supabase } from "@/integrations/supabase/client";

export const fetchUTMData = async (timeRange: '7d' | '30d' | '90d' | 'all') => {
  try {
    let query = supabase.from('waitlist_signups').select('*');
    
    // Apply time range filter if not 'all'
    if (timeRange !== 'all') {
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      query = query.gte('created_at', startDate.toISOString());
    }
    
    // Execute query
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching UTM data:', err);
    return [];
  }
};

export const processUTMChartData = (data: any[], adminUserIds: string[] = []) => {
  // Filter out admin profiles if needed
  const filteredData = adminUserIds.length > 0 
    ? data.filter(item => !adminUserIds.includes(item.user_id))
    : data;
    
  // Source chart data
  const sourceMap = new Map();
  filteredData.forEach(item => {
    const source = item.utm_source || 'direct';
    sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
  });
  
  const sourceChartData = Array.from(sourceMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  
  // Medium chart data  
  const mediumMap = new Map();
  filteredData.forEach(item => {
    const medium = item.utm_medium || 'none';
    mediumMap.set(medium, (mediumMap.get(medium) || 0) + 1);
  });
  
  const mediumChartData = Array.from(mediumMap.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
  
  // Campaign chart data (placeholder for compatibility)
  const campaignChartData = [];
  
  // Daily signups data for line chart
  const dailySignupsMap = new Map();
  
  // Get the date for 14 days ago
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  twoWeeksAgo.setHours(0, 0, 0, 0);
  
  // Initialize all dates in the range with zero counts
  for (let i = 0; i < 14; i++) {
    const date = new Date(twoWeeksAgo);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    dailySignupsMap.set(dateStr, 0);
  }
  
  // Count signups by date
  filteredData.forEach(item => {
    const date = new Date(item.created_at);
    if (date >= twoWeeksAgo) {
      const dateStr = date.toISOString().split('T')[0];
      dailySignupsMap.set(dateStr, (dailySignupsMap.get(dateStr) || 0) + 1);
    }
  });
  
  // Convert map to array and sort by date
  const dailySignups = Array.from(dailySignupsMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  return {
    campaignChartData,
    sourceChartData,
    mediumChartData,
    dailySignups
  };
};
