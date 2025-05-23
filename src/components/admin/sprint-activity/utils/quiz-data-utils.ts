
import { supabase } from '@/integrations/supabase/client';

export const fetchQuizVisitData = async (timeRange: '7d' | '30d' | '90d' | 'all') => {
  try {
    // Calculate date range for filtering
    let startDate: Date | null = null;
    if (timeRange !== 'all') {
      startDate = new Date();
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      startDate.setDate(startDate.getDate() - days);
    }
    
    // Query quiz visits
    let quizQuery = supabase
      .from('quiz_visits')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Apply time filter if not 'all'
    if (startDate) {
      quizQuery = quizQuery.gte('created_at', startDate.toISOString());
    }
    
    const { data: quizData, error: quizError } = await quizQuery;
    
    if (quizError) throw quizError;
    
    return quizData || [];
  } catch (err) {
    console.error('Error fetching quiz visit data:', err);
    throw err;
  }
};

export const processQuizChartData = (data: any[]) => {
  // Process data for source chart
  const sourceCounts: Record<string, number> = {};
  const mediumCounts: Record<string, number> = {};
  const campaignCounts: Record<string, number> = {};
  
  data.forEach(item => {
    const source = item.utm_source || 'direct';
    const medium = item.utm_medium || 'direct';
    const campaign = item.utm_campaign || 'direct';
    
    sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    mediumCounts[medium] = (mediumCounts[medium] || 0) + 1;
    campaignCounts[campaign] = (campaignCounts[campaign] || 0) + 1;
  });
  
  const sourceChartData = Object.entries(sourceCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
    
  const mediumChartData = Object.entries(mediumCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
    
  const campaignChartData = Object.entries(campaignCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Process daily visits data
  const dailyMap = new Map();
  
  // Initialize with last 14 days
  for (let i = 13; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    dailyMap.set(dateString, { date: dateString, visits: 0 });
  }
  
  // Count visits by date
  data.forEach(item => {
    const dateString = new Date(item.created_at).toISOString().split('T')[0];
    if (dailyMap.has(dateString)) {
      const dayData = dailyMap.get(dateString);
      dayData.visits += 1;
      dailyMap.set(dateString, dayData);
    }
  });
  
  // Convert map to array and sort by date
  const dailyVisits = Array.from(dailyMap.values()).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  return {
    sourceChartData,
    mediumChartData,
    campaignChartData,
    dailyVisits
  };
};
