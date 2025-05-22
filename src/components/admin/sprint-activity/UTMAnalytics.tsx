
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface UTMAnalyticsProps {
  timeRange: '7d' | '30d' | '90d' | 'all';
}

const UTMAnalytics: React.FC<UTMAnalyticsProps> = ({ timeRange }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [utmData, setUtmData] = useState<any[]>([]);
  const [campaignChartData, setCampaignChartData] = useState<any[]>([]);
  const [sourceChartData, setSourceChartData] = useState<any[]>([]);
  const [mediumChartData, setMediumChartData] = useState<any[]>([]);
  const [utmType, setUtmType] = useState<'source' | 'medium'>('source');
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#8dd1e1'];
  
  useEffect(() => {
    fetchUTMData();
  }, [timeRange]);
  
  const fetchUTMData = async () => {
    setIsLoading(true);
    try {
      // Query waitlist signups
      let waitlistQuery = supabase
        .from('waitlist_signups')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply time filter if not 'all'
      if (timeRange !== 'all') {
        const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysAgo);
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
      if (timeRange !== 'all') {
        const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysAgo);
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
          utm_source: item.utm_source,
          utm_medium: item.utm_medium
        }))
      ];
      
      setUtmData(combinedData);
      processChartData(combinedData);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching UTM data:', err);
      setIsLoading(false);
    }
  };
  
  const processChartData = (data: any[]) => {
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
    
    setCampaignChartData(campaignChartData);
    setSourceChartData(sourceChartData);
    setMediumChartData(mediumChartData);
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
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">UTM Analytics</h3>
        <Tabs value={utmType} onValueChange={(value) => setUtmType(value as 'source' | 'medium')}>
          <TabsList>
            <TabsTrigger value="source">Source</TabsTrigger>
            <TabsTrigger value="medium">Medium</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Campaign Chart */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">UTM Campaigns</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={campaignChartData.slice(0, 10)}
                  margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" name="Signups" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Source or Medium Chart based on selection */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">UTM {utmType === 'source' ? 'Sources' : 'Mediums'}</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={utmType === 'source' ? sourceChartData : mediumChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {(utmType === 'source' ? sourceChartData : mediumChartData).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">UTM Data Table</h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Medium</TableHead>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {utmData.length > 0 ? (
                  utmData.map((item) => (
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
                        {item.utm_medium ? (
                          <Badge variant="secondary">{item.utm_medium}</Badge>
                        ) : (
                          <Badge variant="outline">direct</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.utm_campaign ? (
                          <Badge variant="secondary">{item.utm_campaign}</Badge>
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
                    <TableCell colSpan={7} className="text-center py-4">
                      No UTM data found for the selected time range
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Total Signups</div>
            <div className="text-2xl font-bold">{utmData.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Sources</div>
            <div className="text-2xl font-bold">
              {new Set(utmData.map(item => item.utm_source || 'direct')).size}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">Mediums</div>
            <div className="text-2xl font-bold">
              {new Set(utmData.map(item => item.utm_medium || 'direct')).size}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UTMAnalytics;
