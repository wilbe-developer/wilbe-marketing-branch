
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import RolesManager from './RolesManager';
import SprintFeatureFlags from './SprintFeatureFlags';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminSettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<{
    enableWaitlist: boolean;
    enableSprintSignup: boolean;
  }>({
    enableWaitlist: true,
    enableSprintSignup: false
  });
  
  useEffect(() => {
    fetchSettings();
  }, []);
  
  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      // Fetch app settings from database
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .eq('key', 'feature_flags');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const flags = data[0].value;
        setSettings({
          enableWaitlist: flags.enableWaitlist !== false, // default to true
          enableSprintSignup: flags.enableSprintSignup === true // default to false
        });
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching app settings:', err);
      toast.error('Failed to load settings');
      setIsLoading(false);
    }
  };
  
  const updateSettings = async () => {
    try {
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          key: 'feature_flags',
          value: {
            enableWaitlist: settings.enableWaitlist,
            enableSprintSignup: settings.enableSprintSignup
          }
        });
      
      if (error) throw error;
      
      toast.success('Settings updated successfully');
    } catch (err) {
      console.error('Error updating settings:', err);
      toast.error('Failed to update settings');
    }
  };
  
  const handleToggleWaitlist = (checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      enableWaitlist: checked
    }));
  };
  
  const handleToggleSprintSignup = (checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      enableSprintSignup: checked
    }));
  };
  
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-gray-500 mt-2">Configure platform settings and manage users</p>
      </div>
      
      <Tabs defaultValue="features">
        <TabsList className="mb-4">
          <TabsTrigger value="features">Feature Flags</TabsTrigger>
          <TabsTrigger value="roles">User Roles</TabsTrigger>
          <TabsTrigger value="sprint">Sprint Features</TabsTrigger>
        </TabsList>
        
        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Feature Flags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="space-y-0.5">
                        <Label htmlFor="waitlist-toggle" className="text-base">Enable Waitlist</Label>
                        <p className="text-sm text-gray-500">
                          When enabled, new users are added to the waitlist
                        </p>
                      </div>
                      <Switch 
                        id="waitlist-toggle" 
                        checked={settings.enableWaitlist}
                        onCheckedChange={handleToggleWaitlist}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="space-y-0.5">
                        <Label htmlFor="sprint-toggle" className="text-base">Enable Sprint Signup</Label>
                        <p className="text-sm text-gray-500">
                          When enabled, users skip the waitlist and go directly to the sprint onboarding
                        </p>
                      </div>
                      <Switch 
                        id="sprint-toggle" 
                        checked={settings.enableSprintSignup}
                        onCheckedChange={handleToggleSprintSignup}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={updateSettings}>Save Settings</Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>User Role Management</CardTitle>
            </CardHeader>
            <CardContent>
              <RolesManager />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sprint">
          <Card>
            <CardHeader>
              <CardTitle>Sprint Feature Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <SprintFeatureFlags />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
