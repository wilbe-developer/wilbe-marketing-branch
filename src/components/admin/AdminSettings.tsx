
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SprintFeatureFlags } from './SprintFeatureFlags';

const AdminSettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<Record<string, any>>({
    isDashboardActive: false,
    isWaitlistActive: true,
    isAutoApprovalEnabled: false,
    emailNotificationsEnabled: true
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('app_settings')
        .select('*');

      if (error) throw error;

      // Process settings
      const settingsObj: Record<string, any> = {};
      data.forEach(setting => {
        settingsObj[setting.key] = setting.value;
      });

      // Set default values if not found
      setSettings({
        isDashboardActive: settingsObj.dashboardActive?.enabled || false,
        isWaitlistActive: settingsObj.waitlistActive?.enabled !== false, // default to true
        isAutoApprovalEnabled: settingsObj.autoApproval?.enabled || false,
        emailNotificationsEnabled: settingsObj.emailNotifications?.enabled !== false // default to true
      });
    } catch (err) {
      console.error('Error fetching settings:', err);
      toast.error('Failed to load admin settings');
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setIsSaving(true);

      // Update dashboard active setting
      const { error: dashboardError } = await supabase
        .from('app_settings')
        .upsert({
          key: 'dashboardActive',
          value: { enabled: settings.isDashboardActive },
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

      if (dashboardError) throw dashboardError;

      // Update waitlist active setting
      const { error: waitlistError } = await supabase
        .from('app_settings')
        .upsert({
          key: 'waitlistActive',
          value: { enabled: settings.isWaitlistActive },
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

      if (waitlistError) throw waitlistError;

      // Update auto approval setting
      const { error: approvalError } = await supabase
        .from('app_settings')
        .upsert({
          key: 'autoApproval',
          value: { enabled: settings.isAutoApprovalEnabled },
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

      if (approvalError) throw approvalError;

      // Update email notifications setting
      const { error: emailError } = await supabase
        .from('app_settings')
        .upsert({
          key: 'emailNotifications',
          value: { enabled: settings.emailNotificationsEnabled },
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

      if (emailError) throw emailError;

      toast.success('Settings saved successfully');
    } catch (err) {
      console.error('Error saving settings:', err);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Settings</h1>
      <p className="text-gray-500">Configure system-wide settings and preferences</p>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="features">Feature Flags</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Signup Flow</CardTitle>
              <CardDescription>
                Control the user signup and onboarding experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Switch
                  id="dashboard-active"
                  checked={settings.isDashboardActive}
                  onCheckedChange={() => handleToggle('isDashboardActive')}
                />
                <div className="grid gap-1.5">
                  <Label htmlFor="dashboard-active">
                    {settings.isDashboardActive ? "Dashboard Active" : "Dashboard Inactive"}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {settings.isDashboardActive
                      ? "Users are directed to the sprint dashboard after signup"
                      : "Users are directed to a waiting page after signup"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Switch
                  id="waitlist-active"
                  checked={settings.isWaitlistActive}
                  onCheckedChange={() => handleToggle('isWaitlistActive')}
                />
                <div className="grid gap-1.5">
                  <Label htmlFor="waitlist-active">
                    {settings.isWaitlistActive ? "Waitlist Active" : "Waitlist Inactive"}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {settings.isWaitlistActive
                      ? "Waitlist signup process is enabled"
                      : "Waitlist signup process is disabled"}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Switch
                  id="auto-approval"
                  checked={settings.isAutoApprovalEnabled}
                  onCheckedChange={() => handleToggle('isAutoApprovalEnabled')}
                />
                <div className="grid gap-1.5">
                  <Label htmlFor="auto-approval">
                    {settings.isAutoApprovalEnabled ? "Auto Approval Enabled" : "Manual Approval Required"}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {settings.isAutoApprovalEnabled
                      ? "New users are automatically approved"
                      : "New users require manual approval"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6 mt-6">
          <SprintFeatureFlags />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Configure email notification settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotificationsEnabled}
                  onCheckedChange={() => handleToggle('emailNotificationsEnabled')}
                />
                <div className="grid gap-1.5">
                  <Label htmlFor="email-notifications">
                    {settings.emailNotificationsEnabled ? "Notifications Enabled" : "Notifications Disabled"}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {settings.emailNotificationsEnabled
                      ? "System email notifications are enabled"
                      : "System email notifications are disabled"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={saveSettings} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
