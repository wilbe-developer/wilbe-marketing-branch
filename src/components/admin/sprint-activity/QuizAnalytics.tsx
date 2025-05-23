
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchQuizVisitData, processQuizChartData } from './utils/quiz-data-utils';
import UTMPieChart from './charts/UTMPieChart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface QuizAnalyticsProps {
  timeRange: '7d' | '30d' | '90d' | 'all';
}

const QuizAnalytics: React.FC<QuizAnalyticsProps> = ({ timeRange }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [quizData, setQuizData] = useState<any[]>([]);
  const [sourceChartData, setSourceChartData] = useState<any[]>([]);
  const [mediumChartData, setMediumChartData] = useState<any[]>([]);
  const [campaignChartData, setCampaignChartData] = useState<any[]>([]);
  const [dailyVisits, setDailyVisits] = useState<any[]>([]);
  const [utmType, setUtmType] = useState<'source' | 'medium' | 'campaign'>('source');
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#8dd1e1'];
  
  useEffect(() => {
    fetchData();
  }, [timeRange]);
  
  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      const data = await fetchQuizVisitData(timeRange);
      setQuizData(data);
      
      const { sourceChartData, mediumChartData, campaignChartData, dailyVisits } = processQuizChartData(data);
      setSourceChartData(sourceChartData);
      setMediumChartData(mediumChartData);
      setCampaignChartData(campaignChartData);
      setDailyVisits(dailyVisits);
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error in fetchData:', err);
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
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-500">Total Quiz Visits</div>
            <div className="text-2xl font-bold">{quizData.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-500">Unique Session Count</div>
            <div className="text-2xl font-bold">
              {new Set(quizData.map(item => item.session_id)).size}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-gray-500">Unique Sources</div>
            <div className="text-2xl font-bold">
              {new Set(quizData.map(item => item.utm_source || 'direct')).size}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Visits Chart */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Daily Quiz Visits (Last 14 Days)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dailyVisits}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} 
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(date) => new Date(date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                  />
                  <Line type="monotone" dataKey="visits" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* UTM Distribution Chart */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">UTM {utmType === 'source' ? 'Sources' : utmType === 'medium' ? 'Mediums' : 'Campaigns'}</h3>
              <Tabs value={utmType} onValueChange={(value) => setUtmType(value as 'source' | 'medium' | 'campaign')}>
                <TabsList>
                  <TabsTrigger value="source">Source</TabsTrigger>
                  <TabsTrigger value="medium">Medium</TabsTrigger>
                  <TabsTrigger value="campaign">Campaign</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <UTMPieChart 
              data={utmType === 'source' ? sourceChartData : utmType === 'medium' ? mediumChartData : campaignChartData}
              colors={COLORS}
            />
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Quiz Visits Table */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Recent Quiz Visits</h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Session ID</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Medium</TableHead>
                  <TableHead>Campaign</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quizData.length > 0 ? (
                  quizData.slice(0, 10).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className="text-xs font-mono">
                          {item.session_id.substring(0, 8)}...
                        </span>
                      </TableCell>
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
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No quiz visit data found for the selected time range
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

export default QuizAnalytics;
