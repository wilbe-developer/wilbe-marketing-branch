
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchUnifiedData, processDataForCharts } from './utils/unified-data-utils';
import SignupMetricsCards from './cards/SignupMetricsCards';
import SourceDistributionChart from './charts/SourceDistributionChart';
import DailySignupsChart from './charts/DailySignupsChart';
import RecentSignupsTable from './tables/RecentSignupsTable';
import UTMPieChart from './charts/UTMPieChart';

export interface UnifiedAnalyticsProps {
  timeRange: '7d' | '30d' | '90d' | 'all';
}

const UnifiedAnalytics: React.FC<UnifiedAnalyticsProps> = ({ timeRange }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [signupData, setSignupData] = useState<any[]>([]);
  const [sourceDistribution, setSourceDistribution] = useState<any[]>([]);
  const [dailySignups, setDailySignups] = useState<any[]>([]);
  const [utmSourceData, setUtmSourceData] = useState<any[]>([]);
  const [utmMediumData, setUtmMediumData] = useState<any[]>([]);
  const [utmType, setUtmType] = useState<'source' | 'medium'>('source');
  const [conversionMetrics, setConversionMetrics] = useState({
    waitlistCount: 0,
    sprintCount: 0,
    totalCount: 0,
    conversionRate: 0
  });
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#8dd1e1'];
  
  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);
  
  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchUnifiedData(timeRange);
      setSignupData(data);
      
      const processedData = processDataForCharts(data);
      setConversionMetrics(processedData.conversionMetrics);
      setSourceDistribution(processedData.sourceDistribution);
      setDailySignups(processedData.dailySignups);
      setUtmSourceData(processedData.utmSourceData);
      setUtmMediumData(processedData.utmMediumData);
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error in fetchAnalyticsData:', err);
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
      <SignupMetricsCards 
        totalCount={conversionMetrics.totalCount}
        waitlistCount={conversionMetrics.waitlistCount}
        sprintCount={conversionMetrics.sprintCount}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* UTM Distribution Chart */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">UTM {utmType === 'source' ? 'Sources' : 'Mediums'}</h3>
              <Tabs value={utmType} onValueChange={(value) => setUtmType(value as 'source' | 'medium')}>
                <TabsList>
                  <TabsTrigger value="source">Source</TabsTrigger>
                  <TabsTrigger value="medium">Medium</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <UTMPieChart 
              data={utmType === 'source' ? utmSourceData : utmMediumData}
              colors={COLORS}
            />
          </CardContent>
        </Card>
        
        {/* Daily Signups Chart */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Daily Signups (Last 14 Days)</h3>
            <DailySignupsChart data={dailySignups} />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Recent Signups</h3>
          <RecentSignupsTable data={signupData} limit={10} />
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedAnalytics;
