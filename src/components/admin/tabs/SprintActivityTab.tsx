
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WaitlistMetrics from "../sprint-activity/WaitlistMetrics";
import WaitlistSignupsTable from "../sprint-activity/WaitlistSignupsTable";
import SprintConversionMetrics from "../sprint-activity/SprintConversionMetrics";
import SprintEngagementStats from "../sprint-activity/SprintEngagementStats";
import UnifiedAnalytics from "../sprint-activity/UnifiedAnalytics";

const SprintActivityTab = () => {
  const [activeSection, setActiveSection] = useState("unified");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sprint Activity Dashboard</h2>
      </div>

      <Tabs defaultValue="unified" onValueChange={setActiveSection} value={activeSection}>
        <TabsList className="mb-4">
          <TabsTrigger value="unified">Unified Analytics</TabsTrigger>
          <TabsTrigger value="waitlist">Waitlist Analytics</TabsTrigger>
          <TabsTrigger value="conversion">Sprint Conversion</TabsTrigger>
          <TabsTrigger value="engagement">Sprint Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="unified" className="space-y-6">
          <UnifiedAnalytics />
        </TabsContent>

        <TabsContent value="waitlist" className="space-y-6">
          <WaitlistMetrics />
          <WaitlistSignupsTable />
        </TabsContent>

        <TabsContent value="conversion" className="space-y-6">
          <SprintConversionMetrics />
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <SprintEngagementStats />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SprintActivityTab;
