
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export interface SprintEngagementStatsProps {
  timeRange: '7d' | '30d' | '90d' | 'all';
}

const SprintEngagementStats: React.FC<SprintEngagementStatsProps> = ({ timeRange }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [engagementData, setEngagementData] = useState<any[]>([]);
  const [completionRates, setCompletionRates] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  useEffect(() => {
    fetchEngagementData();
  }, [timeRange]);
  
  const fetchEngagementData = async () => {
    setIsLoading(true);
    
    try {
      // Calculate date range for filtering
      let startDate: Date | null = null;
      if (timeRange !== 'all') {
        startDate = new Date();
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        startDate.setDate(startDate.getDate() - days);
      }
      
      // Fetch sprint profiles
      let sprintQuery = supabase
        .from('sprint_profiles')
        .select('*');
      
      if (startDate) {
        sprintQuery = sprintQuery.gte('created_at', startDate.toISOString());
      }
      
      const { data: sprintData, error: sprintError } = await sprintQuery;
      
      if (sprintError) throw sprintError;
      
      // Fetch sprint task progress
      let progressQuery = supabase
        .from('user_sprint_progress')
        .select('*');
      
      if (startDate) {
        progressQuery = progressQuery.gte('created_at', startDate.toISOString());
      }
      
      const { data: progressData, error: progressError } = await progressQuery;
      
      if (progressError) throw progressError;
      
      // Process the data for visualization
      const { engagementByDay, completionRates, totalUsers, activeUsers } = 
        processEngagementData(sprintData || [], progressData || []);
      
      setEngagementData(engagementByDay);
      setCompletionRates(completionRates);
      setTotalUsers(totalUsers);
      setActiveUsers(activeUsers);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching engagement data:', err);
      setIsLoading(false);
    }
  };
  
  const processEngagementData = (sprintData: any[], progressData: any[]) => {
    // Calculate total users and active users
    const totalUsers = sprintData.length;
    
    // Consider a user active if they have any progress records
    const userIds = new Set(sprintData.map(item => item.user_id));
    const activeUserIds = new Set(progressData.map(item => item.user_id));
    const activeUsers = [...userIds].filter(id => activeUserIds.has(id)).length;
    
    // Create engagement by day data
    const dailyData = new Map();
    
    // Initialize with last 14 days
    for (let i = 13; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toLocaleDateString();
      dailyData.set(dateString, { date: dateString, users: 0 });
    }
    
    // Count unique users by day
    progressData.forEach(item => {
      const date = new Date(item.created_at).toLocaleDateString();
      if (dailyData.has(date)) {
        const current = dailyData.get(date);
        // Only increment if this is the first time we've seen this user on this day
        const dayUserIds = new Set();
        if (!dayUserIds.has(item.user_id)) {
          dayUserIds.add(item.user_id);
          current.users += 1;
          dailyData.set(date, current);
        }
      }
    });
    
    // Calculate completion rates
    let completed = 0;
    let inProgress = 0;
    let notStarted = 0;
    
    // Group progress by user
    const userProgress = new Map();
    progressData.forEach(item => {
      if (!userProgress.has(item.user_id)) {
        userProgress.set(item.user_id, []);
      }
      userProgress.get(item.user_id).push(item);
    });
    
    // Count users in each category
    userIds.forEach(userId => {
      if (!userProgress.has(userId)) {
        notStarted++;
      } else {
        const userTasks = userProgress.get(userId);
        const hasCompleted = userTasks.some((task: any) => task.completed);
        if (hasCompleted) {
          completed++;
        } else {
          inProgress++;
        }
      }
    });
    
    const completionRates = [
      { name: 'Completed', value: completed },
      { name: 'In Progress', value: inProgress },
      { name: 'Not Started', value: notStarted }
    ];
    
    return {
      engagementByDay: Array.from(dailyData.values()),
      completionRates,
      totalUsers,
      activeUsers
    };
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
            <div className="text-sm text-gray-500">Total Sprint Users</div>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Active Sprint Users</div>
            <div className="text-2xl font-bold">{activeUsers}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent>
            <h3 className="text-lg font-medium mb-4">Daily Active Users</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="users" fill="#8884d8" name="Active Users" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <h3 className="text-lg font-medium mb-4">Task Completion Status</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={completionRates}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {completionRates.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SprintEngagementStats;
