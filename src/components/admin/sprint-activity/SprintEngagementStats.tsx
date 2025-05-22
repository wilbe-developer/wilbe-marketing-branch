
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
      // This is a placeholder for the actual data fetching logic
      // In a real implementation, you would fetch data from your database
      
      let query = supabase
        .from('user_sprint_progress')
        .select('*');
      
      // Apply time filtering if not 'all'
      if (timeRange !== 'all') {
        const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysAgo);
        query = query.gte('created_at', startDate.toISOString());
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Process the data for visualization
      const processedData = processEngagementData(data || []);
      setEngagementData(processedData.engagementByDay);
      setCompletionRates(processedData.completionRates);
      setTotalUsers(processedData.totalUsers);
      setActiveUsers(processedData.activeUsers);
    } catch (err) {
      console.error('Error fetching engagement data:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const processEngagementData = (data: any[]) => {
    // This is a placeholder for the actual data processing logic
    // In a real implementation, you would process the data from your database
    
    // Sample data for demonstration
    const engagementByDay = [
      { date: '2023-01-01', users: 5 },
      { date: '2023-01-02', users: 7 },
      { date: '2023-01-03', users: 10 },
      { date: '2023-01-04', users: 8 },
      { date: '2023-01-05', users: 12 }
    ];
    
    const completionRates = [
      { name: 'Completed', value: 65 },
      { name: 'In Progress', value: 25 },
      { name: 'Not Started', value: 10 }
    ];
    
    return {
      engagementByDay,
      completionRates,
      totalUsers: 100,
      activeUsers: 75
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
            <div className="text-sm text-gray-500">Total Users</div>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Active Users</div>
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
            <h3 className="text-lg font-medium mb-4">Task Completion Rates</h3>
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
