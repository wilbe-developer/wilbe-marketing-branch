
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAppSettings } from "@/hooks/useAppSettings";
import { Loader2 } from "lucide-react";

export const SprintFeatureFlags = () => {
  const { isDashboardActive, isLoading, updateDashboardSetting } = useAppSettings();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    setIsUpdating(true);
    await updateDashboardSetting(!isDashboardActive);
    setIsUpdating(false);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>BSF Feature Flags</CardTitle>
        <CardDescription>
          Control feature availability in the BSF section
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading settings...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Switch
              id="dashboard-active"
              checked={isDashboardActive}
              onCheckedChange={handleToggle}
              disabled={isUpdating}
            />
            <div className="grid gap-1.5">
              <Label htmlFor="dashboard-active">
                {isDashboardActive ? "BSF Dashboard Active" : "BSF Dashboard Inactive"}
              </Label>
              <p className="text-sm text-muted-foreground">
                {isDashboardActive
                  ? "Users are directed to the dashboard after signup"
                  : "Users are directed to a waiting page after signup"}
              </p>
            </div>
            {isUpdating && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
