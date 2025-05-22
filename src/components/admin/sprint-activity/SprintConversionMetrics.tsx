
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface SprintConversionMetricsProps {
  timeRange: '7d' | '30d' | '90d' | 'all';
}

const SprintConversionMetrics: React.FC<SprintConversionMetricsProps> = ({ timeRange }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [conversionData, setConversionData] = useState({
    totalWaitlist: 0,
    totalSignups: 0,
    conversionRate: 0,
    completionRates: [] as {name: string, value: number}[]
  });
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  useEffect(() => {
    fetchConversionData();
  }, [timeRange]);
  
  const fetchConversionData = async () => {
    setIsLoading(true);
    try {
      // Calculate date range
      let startDate = null;
      if (timeRange !== 'all') {
        const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        startDate = new Date();
        startDate.setDate(startDate.getDate() - daysAgo);
      }
      
      // Fetch waitlist signups
      let waitlistQuery = supabase.from('waitlist_signups').select('count');
      if (startDate) {
        waitlistQuery = waitlistQuery.gte('created_at', startDate.toISOString());
      }
      const { data: waitlistData, error: waitlistError } = await waitlistQuery;
      
      if (waitlistError) throw waitlistError;
      
      // Fetch sprint signups
      let sprintQuery = supabase.from('sprint_profiles').select('count');
      if (startDate) {
        sprintQuery = sprintQuery.gte('created_at', startDate.toISOString());
      }
      const { data: sprintData, error: sprintError } = await sprintQuery;
      
      if (sprintError) throw sprintError;
      
      // Fetch task progress data to calculate completion rates
      const { data: progressData, error: progressError } = await supabase
        .from('user_sprint_progress')
        .select('user_id, task_id, completed');
        
      if (progressError) throw progressError;
      
      // Calculate completion rates by task
      const taskCompletionMap = new Map();
      
      progressData?.forEach(progress => {
        if (!taskCompletionMap.has(progress.task_id)) {
          taskCompletionMap.set(progress.task_id, { total: 0, completed: 0 });
        }
        
        const taskStats = taskCompletionMap.get(progress.task_id);
        taskStats.total += 1;
        if (progress.completed) {
          taskStats.completed += 1;
        }
        
        taskCompletionMap.set(progress.task_id, taskStats);
      });
      
      // Get task names
      const { data: taskData, error: taskError } = await supabase
        .from('sprint_task_definitions')
        .select('id, name');
        
      if (taskError) throw taskError;
      
      // Create task name map
      const taskNameMap = new Map();
      taskData?.forEach(task => {
        taskNameMap.set(task.id, task.name);
      });
      
      // Calculate completion rates
      const completionRates = Array.from(taskCompletionMap.entries())
        .map(([taskId, stats]) => ({
          name: taskNameMap.get(taskId) || `Task ${taskId.substring(0, 4)}...`,
          value: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0
        }))
        .sort((a, b) => b.value - a.value);
      
      // Calculate total counts and conversion rate
      const totalWaitlist = waitlistData?.[0]?.count || 0;
      const totalSignups = sprintData?.[0]?.count || 0;
      const conversionRate = totalWaitlist > 0 ? (totalSignups / totalWaitlist) * 100 : 0;
      
      setConversionData({
        totalWaitlist,
        totalSignups,
        conversionRate,
        completionRates
      });
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching conversion data:', err);
      setIsLoading(false);
    }
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Waitlist Signups</div>
            <div className="text-2xl font-bold">{conversionData.totalWaitlist}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Sprint Signups</div>
            <div className="text-2xl font-bold">{conversionData.totalSignups}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Conversion Rate</div>
            <div className="text-2xl font-bold">{conversionData.conversionRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Conversion Funnel</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Waitlist', value: conversionData.totalWaitlist },
                    { name: 'Sprint Signups', value: conversionData.totalSignups }
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" name="Users" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Task Completion Rates */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Task Completion Rates</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={conversionData.completionRates.slice(0, 5)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {conversionData.completionRates.slice(0, 5).map((entry, index) => (
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
      
      {/* Task Completion Rates Table */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Task Completion Rates</h3>
          <div className="h-64 overflow-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={conversionData.completionRates}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" name="Completion Rate (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SprintConversionMetrics;
