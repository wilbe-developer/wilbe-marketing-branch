
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

interface SprintEngagementStatsProps {
  timeRange: '7d' | '30d' | '90d' | 'all';
}

const SprintEngagementStats: React.FC<SprintEngagementStatsProps> = ({ timeRange }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [signupData, setSignupData] = useState<any[]>([]);
  const [dailySignups, setDailySignups] = useState<any[]>([]);
  const [engagementStats, setEngagementStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    tasksStarted: 0,
    tasksCompleted: 0,
    completionRate: 0
  });
  
  useEffect(() => {
    fetchEngagementData();
  }, [timeRange]);
  
  const fetchEngagementData = async () => {
    setIsLoading(true);
    try {
      // Calculate date range
      let startDate = null;
      if (timeRange !== 'all') {
        const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        startDate = new Date();
        startDate.setDate(startDate.getDate() - daysAgo);
      }
      
      // Fetch sprint profiles
      let query = supabase
        .from('sprint_profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (startDate) {
        query = query.gte('created_at', startDate.toISOString());
      }
      
      const { data: profilesData, error: profilesError } = await query;
      
      if (profilesError) throw profilesError;
      
      // Fetch task progress
      const { data: progressData, error: progressError } = await supabase
        .from('user_sprint_progress')
        .select('*');
        
      if (progressError) throw progressError;
      
      setSignupData(profilesData || []);
      
      // Process daily signup data for chart
      const dailyData = processDailySignups(profilesData || []);
      setDailySignups(dailyData);
      
      // Calculate engagement metrics
      const totalUsers = profilesData?.length || 0;
      
      // Users with at least one task started
      const usersWithTasks = new Set();
      progressData?.forEach(progress => usersWithTasks.add(progress.user_id));
      const activeUsers = usersWithTasks.size;
      
      // Tasks started and completed
      const tasksStarted = progressData?.length || 0;
      const tasksCompleted = progressData?.filter(p => p.completed).length || 0;
      
      setEngagementStats({
        totalUsers,
        activeUsers,
        tasksStarted,
        tasksCompleted,
        completionRate: tasksStarted > 0 ? (tasksCompleted / tasksStarted) * 100 : 0
      });
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching engagement data:', err);
      setIsLoading(false);
    }
  };
  
  const processDailySignups = (data: any[]) => {
    const dailyCounts: Record<string, number> = {};
    
    // Initialize with zeros for the last 30 days
    const today = new Date();
    const numDays = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 30;
    
    for (let i = 0; i < numDays; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      dailyCounts[dateString] = 0;
    }
    
    // Count signups by day
    data.forEach(item => {
      const dateString = new Date(item.created_at).toISOString().split('T')[0];
      dailyCounts[dateString] = (dailyCounts[dateString] || 0) + 1;
    });
    
    // Convert to array for chart
    return Object.entries(dailyCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Total Users</div>
            <div className="text-2xl font-bold">{engagementStats.totalUsers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Active Users</div>
            <div className="text-2xl font-bold">
              {engagementStats.activeUsers} 
              <span className="text-sm text-gray-500 ml-2">
                ({engagementStats.totalUsers > 0 
                  ? Math.round((engagementStats.activeUsers / engagementStats.totalUsers) * 100) 
                  : 0}%)
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Tasks Started</div>
            <div className="text-2xl font-bold">{engagementStats.tasksStarted}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Tasks Completed</div>
            <div className="text-2xl font-bold">
              {engagementStats.tasksCompleted}
              <span className="text-sm text-gray-500 ml-2">
                ({Math.round(engagementStats.completionRate)}%)
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Signup Trend Chart */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Signup Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dailySignups}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" name="Signups" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* User Activity Chart */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Sprint Activity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Total Users', value: engagementStats.totalUsers },
                  { name: 'Active Users', value: engagementStats.activeUsers },
                  { name: 'Tasks Started', value: engagementStats.tasksStarted },
                  { name: 'Tasks Completed', value: engagementStats.tasksCompleted }
                ]}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SprintEngagementStats;
