import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export interface SprintConversionMetricsProps {
  timeRange: '7d' | '30d' | '90d' | 'all';
}

const SprintConversionMetrics: React.FC<SprintConversionMetricsProps> = ({ timeRange }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [conversionData, setConversionData] = useState<any[]>([]);
  const [conversionRate, setConversionRate] = useState(0);
  const [totalSignups, setTotalSignups] = useState(0);
  const [totalConversions, setTotalConversions] = useState(0);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  useEffect(() => {
    fetchConversionData();
  }, [timeRange]);
  
  const fetchConversionData = async () => {
    setIsLoading(true);
    
    try {
      let startDate: Date | null = null;
      if (timeRange !== 'all') {
        startDate = new Date();
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        startDate.setDate(startDate.getDate() - days);
      }
      
      let waitlistQuery = supabase
        .from('waitlist_signups')
        .select('email, created_at');
      
      if (startDate) {
        waitlistQuery = waitlistQuery.gte('created_at', startDate.toISOString());
      }
      
      const { data: waitlistData, error: waitlistError } = await waitlistQuery;
      
      if (waitlistError) throw waitlistError;
      
      let sprintQuery = supabase
        .from('sprint_profiles')
        .select('email, created_at');
      
      if (startDate) {
        sprintQuery = sprintQuery.gte('created_at', startDate.toISOString());
      }
      
      const { data: sprintData, error: sprintError } = await sprintQuery;
      
      if (sprintError) throw sprintError;
      
      const waitlistEmails = new Set((waitlistData || []).map(item => item.email?.toLowerCase()).filter(Boolean));
      const sprintEmails = new Set((sprintData || []).map(item => item.email?.toLowerCase()).filter(Boolean));
      
      const conversions = [...waitlistEmails].filter(email => sprintEmails.has(email));
      
      const totalWaitlist = waitlistEmails.size;
      const totalConversions = conversions.length;
      const totalSprints = sprintEmails.size;
      
      const conversionRate = totalWaitlist > 0 ? (totalConversions / totalWaitlist) * 100 : 0;
      
      const chartData = [
        { name: 'Converted', value: totalConversions },
        { name: 'Not Converted', value: totalWaitlist - totalConversions }
      ];
      
      setConversionData(chartData);
      setConversionRate(conversionRate);
      setTotalSignups(totalWaitlist);
      setTotalConversions(totalSprints);
    } catch (error) {
      console.error('Error fetching conversion data:', error);
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Conversion Rate</div>
            <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Total Waitlist Signups</div>
            <div className="text-2xl font-bold">{totalSignups}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Total BSF Signups</div>
            <div className="text-2xl font-bold">{totalConversions}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent>
          <h3 className="text-lg font-medium mb-4">Conversion Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={conversionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {conversionData.map((entry, index) => (
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
  );
};

export default SprintConversionMetrics;
