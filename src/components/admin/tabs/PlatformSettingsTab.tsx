
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SprintFeatureFlags } from "../SprintFeatureFlags";

const PlatformSettingsTab = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Platform Settings</h2>
      
      <SprintFeatureFlags />
      
      <Card>
        <CardHeader>
          <CardTitle>Platform Configuration</CardTitle>
          <CardDescription>
            Configure global platform settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Additional platform settings will be available here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlatformSettingsTab;
