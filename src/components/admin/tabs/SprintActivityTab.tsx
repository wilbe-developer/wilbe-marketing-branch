
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WaitlistMetrics from "../sprint-activity/WaitlistMetrics";
import WaitlistSignupsTable from "../sprint-activity/WaitlistSignupsTable";
import SprintConversionMetrics, { SprintConversionMetricsProps } from "../sprint-activity/SprintConversionMetrics";
import SprintEngagementStats, { SprintEngagementStatsProps } from "../sprint-activity/SprintEngagementStats";
import UnifiedAnalytics, { UnifiedAnalyticsProps } from "../sprint-activity/UnifiedAnalytics";

const SprintActivityTab = () => {
  const [activeSection, setActiveSection] = useState("unified");
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('all');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">BSF Activity Dashboard</h2>
        
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

      <Tabs defaultValue="unified" onValueChange={setActiveSection} value={activeSection}>
        <TabsList className="mb-4">
          <TabsTrigger value="unified">Unified Analytics</TabsTrigger>
          <TabsTrigger value="waitlist">Waitlist Analytics</TabsTrigger>
          <TabsTrigger value="conversion">BSF Conversion</TabsTrigger>
          <TabsTrigger value="engagement">BSF Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="unified" className="space-y-6">
          <UnifiedAnalytics timeRange={timeRange} />
        </TabsContent>

        <TabsContent value="waitlist" className="space-y-6">
          <WaitlistMetrics timeRange={timeRange} />
          <WaitlistSignupsTable timeRange={timeRange} />
        </TabsContent>

        <TabsContent value="conversion" className="space-y-6">
          <SprintConversionMetrics timeRange={timeRange} />
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <SprintEngagementStats timeRange={timeRange} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SprintActivityTab;
