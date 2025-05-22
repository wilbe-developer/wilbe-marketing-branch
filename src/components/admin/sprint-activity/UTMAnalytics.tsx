
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchUTMData, processUTMChartData } from './utils/utm-data-utils';
import UTMPieChart from './charts/UTMPieChart';
import UTMDataTable from './tables/UTMDataTable';
import UTMMetricsCards from './cards/UTMMetricsCards';
import DailySignupsChart from './charts/DailySignupsChart';

interface UTMAnalyticsProps {
  timeRange: '7d' | '30d' | '90d' | 'all';
}

const UTMAnalytics: React.FC<UTMAnalyticsProps> = ({ timeRange }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [utmData, setUtmData] = useState<any[]>([]);
  const [sourceChartData, setSourceChartData] = useState<any[]>([]);
  const [mediumChartData, setMediumChartData] = useState<any[]>([]);
  const [dailySignups, setDailySignups] = useState<any[]>([]);
  const [utmType, setUtmType] = useState<'source' | 'medium'>('source');
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#8dd1e1'];
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchUTMData(timeRange);
        setUtmData(data);
        
        const { campaignChartData, sourceChartData, mediumChartData, dailySignups } = processUTMChartData(data);
        setSourceChartData(sourceChartData);
        setMediumChartData(mediumChartData);
        setDailySignups(dailySignups);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading UTM data:', err);
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [timeRange]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  const sourcesCount = new Set(utmData.map(item => item.utm_source || 'direct')).size;
  const mediumsCount = new Set(utmData.map(item => item.utm_medium || 'direct')).size;
  
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
        {/* Daily Signups Chart (Replacing Campaign Chart) */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Daily Signups (Last 14 Days)</h3>
            <DailySignupsChart data={dailySignups} />
          </CardContent>
        </Card>
        
        {/* Source or Medium Chart based on selection */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">UTM {utmType === 'source' ? 'Sources' : 'Mediums'}</h3>
            <UTMPieChart 
              data={utmType === 'source' ? sourceChartData : mediumChartData}
              colors={COLORS}
            />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">UTM Data Table</h3>
          <UTMDataTable data={utmData} />
        </CardContent>
      </Card>
      
      <UTMMetricsCards 
        totalSignups={utmData.length}
        sourcesCount={sourcesCount}
        mediumsCount={mediumsCount}
      />
    </div>
  );
};

export default UTMAnalytics;
