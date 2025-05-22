
import React, { useState } from 'react';
import FullScreenAdminLayout from '@/components/admin/FullScreenAdminLayout';
import UTMAnalytics from '@/components/admin/sprint-activity/UTMAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UnifiedAnalytics from '@/components/admin/sprint-activity/UnifiedAnalytics';
import SprintEngagementStats from '@/components/admin/sprint-activity/SprintEngagementStats';
import SprintConversionMetrics from '@/components/admin/sprint-activity/SprintConversionMetrics';

// Define component props interfaces if they don't exist
interface AnalyticsComponentProps {
  timeRange: '7d' | '30d' | '90d' | 'all';
}

const UTMAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('all');

  return (
    <FullScreenAdminLayout title="Marketing Analytics">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Marketing Analytics</h1>
        <p className="text-gray-500 mt-2">Track and analyze marketing campaign performance</p>
      </div>
      
      <div className="flex justify-end mb-4">
        <div className="bg-background border rounded-md p-1 flex">
          <button 
            className={`px-3 py-1 text-sm rounded-sm ${timeRange === '7d' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
            onClick={() => setTimeRange('7d')}
          >
            7D
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-sm ${timeRange === '30d' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
            onClick={() => setTimeRange('30d')}
          >
            30D
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-sm ${timeRange === '90d' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
            onClick={() => setTimeRange('90d')}
          >
            90D
          </button>
          <button 
            className={`px-3 py-1 text-sm rounded-sm ${timeRange === 'all' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
            onClick={() => setTimeRange('all')}
          >
            All
          </button>
        </div>
      </div>
      
      <Tabs defaultValue="unified">
        <TabsList className="mb-4">
          <TabsTrigger value="unified">Unified Analytics</TabsTrigger>
          <TabsTrigger value="waitlist">Waitlist Analytics</TabsTrigger>
          <TabsTrigger value="sprint">Sprint Analytics</TabsTrigger>
          <TabsTrigger value="conversion">Conversion Metrics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="unified">
          <Card>
            <CardHeader>
              <CardTitle>Unified Signup Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <UnifiedAnalytics timeRange={timeRange} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="waitlist">
          <Card>
            <CardHeader>
              <CardTitle>Waitlist UTM Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <UTMAnalytics timeRange={timeRange} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sprint">
          <Card>
            <CardHeader>
              <CardTitle>Sprint Signup Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <SprintEngagementStats timeRange={timeRange} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="conversion">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <SprintConversionMetrics timeRange={timeRange} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </FullScreenAdminLayout>
  );
};

export default UTMAnalyticsPage;
