import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface WaitlistMetricsProps {
  timeRange?: '7d' | '30d' | '90d' | 'all';
}

const WaitlistMetrics: React.FC<WaitlistMetricsProps> = ({ timeRange = 'all' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [signupsByDay, setSignupsByDay] = useState<any[]>([]);
  const [totalSignups, setTotalSignups] = useState(0);
  const [totalReferrals, setTotalReferrals] = useState(0);
  
  useEffect(() => {
    fetchMetrics();
  }, [timeRange]);
  
  const fetchMetrics = async () => {
    setIsLoading(true);
    
    try {
      let query = supabase
        .from('waitlist_signups')
        .select('created_at, successful_referrals')
        .order('created_at', { ascending: false });
      
      // Apply time filtering if not 'all'
      if (timeRange !== 'all') {
        const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysAgo);
        query = query.gte('created_at', startDate.toISOString());
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Process data for chart
      const dailyCounts: Record<string, number> = {};
      let totalSignupsCount = 0;
      let totalReferralsCount = 0;
      
      data?.forEach(item => {
        const date = new Date(item.created_at).toLocaleDateString();
        dailyCounts[date] = (dailyCounts[date] || 0) + 1;
        totalSignupsCount++;
        totalReferralsCount += item.successful_referrals || 0;
      });
      
      const chartData = Object.entries(dailyCounts)
        .map(([date, count]) => ({ date, signups: count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      setSignupsByDay(chartData);
      setTotalSignups(totalSignupsCount);
      setTotalReferrals(totalReferralsCount);
    } catch (err) {
      console.error('Error fetching waitlist metrics:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div className="flex justify-center p-4">
            <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Total Signups</div>
            <div className="text-2xl font-bold">{totalSignups}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Total Referrals</div>
            <div className="text-2xl font-bold">{totalReferrals}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent>
          <h3 className="text-lg font-medium mb-4">Signups Over Time</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={signupsByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="signups" fill="#8884d8" name="Signups" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaitlistMetrics;
