
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export interface UnifiedAnalyticsProps {
  timeRange: '7d' | '30d' | '90d' | 'all';
}

const UnifiedAnalytics: React.FC<UnifiedAnalyticsProps> = ({ timeRange }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [signupData, setSignupData] = useState<any[]>([]);
  const [sourceDistribution, setSourceDistribution] = useState<any[]>([]);
  const [dailySignups, setDailySignups] = useState<any[]>([]);
  const [conversionMetrics, setConversionMetrics] = useState({
    waitlistCount: 0,
    sprintCount: 0,
    conversionRate: 0
  });
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];
  
  useEffect(() => {
    fetchUnifiedData();
  }, [timeRange]);
  
  const fetchUnifiedData = async () => {
    setIsLoading(true);
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
        }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setSignupData(combinedData);
      
      // Process data for visualization
      processDataForCharts(combinedData);
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching unified data:', err);
      setIsLoading(false);
    }
  };
  
  const processDataForCharts = (data: any[]) => {
    // Count signups by source
    const waitlistSignups = data.filter(item => item.source_type === 'waitlist');
    const sprintSignups = data.filter(item => item.source_type === 'sprint');
    
    // Calculate conversion metrics
    const waitlistCount = waitlistSignups.length;
    const sprintCount = sprintSignups.length;
    const totalCount = data.length;
    const conversionRate = waitlistCount > 0 ? (sprintCount / totalCount) * 100 : 0;
    
    setConversionMetrics({
      waitlistCount,
      sprintCount,
      conversionRate
    });
    
    // Create source distribution data
    const sourceData = [
      { name: 'Waitlist', value: waitlistCount },
      { name: 'Sprint', value: sprintCount }
    ];
    
    setSourceDistribution(sourceData);
    
    // Process daily signups (last 14 days)
    const dailyData = processDailySignups(data);
    setDailySignups(dailyData);
  };
  
  const processDailySignups = (data: any[]) => {
    // Create a map for the last 14 days
    const dailyMap = new Map();
    
    // Initialize with last 14 days
    for (let i = 13; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      dailyMap.set(dateString, { date: dateString, waitlist: 0, sprint: 0, total: 0 });
    }
    
    // Count signups by date
    data.forEach(item => {
      const dateString = new Date(item.created_at).toISOString().split('T')[0];
      if (dailyMap.has(dateString)) {
        const dayData = dailyMap.get(dateString);
        if (item.source_type === 'waitlist') {
          dayData.waitlist += 1;
        } else {
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
            <div className="text-sm text-gray-500">Total Signups</div>
            <div className="text-2xl font-bold">{signupData.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Waitlist Signups</div>
            <div className="text-2xl font-bold">{conversionMetrics.waitlistCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Sprint Signups</div>
            <div className="text-2xl font-bold">{conversionMetrics.sprintCount}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source Distribution Chart */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Signup Source Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {sourceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  {/* No Legend as requested */}
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Daily Signups Chart */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Daily Signups (Last 14 Days)</h3>
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
                  <Line type="monotone" dataKey="waitlist" stroke="#8884d8" name="Waitlist" />
                  <Line type="monotone" dataKey="sprint" stroke="#82ca9d" name="Sprint" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Recent Signups</h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {signupData.length > 0 ? (
                  signupData.slice(0, 10).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell>
                        {item.utm_source ? (
                          <Badge variant="secondary">{item.utm_source}</Badge>
                        ) : (
                          <Badge variant="outline">direct</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={item.source_type === 'waitlist' ? 'outline' : 'default'}>
                          {item.source_type}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No signup data found for the selected time range
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedAnalytics;
