
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAppSettings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isDashboardActive, setIsDashboardActive] = useState(false);
  const [isWaitlistActive, setIsWaitlistActive] = useState(true);
  const [isAutoApprovalEnabled, setIsAutoApprovalEnabled] = useState(false);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);

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
      setIsDashboardActive(settingsObj.dashboardActive?.enabled || false);
      setIsWaitlistActive(settingsObj.waitlistActive?.enabled !== false); // default to true
      setIsAutoApprovalEnabled(settingsObj.autoApproval?.enabled || false);
      setEmailNotificationsEnabled(settingsObj.emailNotifications?.enabled !== false); // default to true
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateDashboardSetting = async (enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          key: 'dashboardActive',
          value: { enabled },
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

      if (error) throw error;

      setIsDashboardActive(enabled);
      return true;
    } catch (err) {
      console.error('Error updating dashboard setting:', err);
      toast.error('Failed to update setting');
      return false;
    }
  };

  const updateWaitlistSetting = async (enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          key: 'waitlistActive',
          value: { enabled },
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

      if (error) throw error;

      setIsWaitlistActive(enabled);
      return true;
    } catch (err) {
      console.error('Error updating waitlist setting:', err);
      toast.error('Failed to update setting');
      return false;
    }
  };

  const updateAutoApprovalSetting = async (enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          key: 'autoApproval',
          value: { enabled },
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

      if (error) throw error;

      setIsAutoApprovalEnabled(enabled);
      return true;
    } catch (err) {
      console.error('Error updating auto approval setting:', err);
      toast.error('Failed to update setting');
      return false;
    }
  };

  const updateEmailNotificationsSetting = async (enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          key: 'emailNotifications',
          value: { enabled },
          updated_at: new Date().toISOString()
        }, { onConflict: 'key' });

      if (error) throw error;

      setEmailNotificationsEnabled(enabled);
      return true;
    } catch (err) {
      console.error('Error updating email notifications setting:', err);
      toast.error('Failed to update setting');
      return false;
    }
  };

  return {
    isLoading,
    isDashboardActive,
    isWaitlistActive,
    isAutoApprovalEnabled,
    emailNotificationsEnabled,
    updateDashboardSetting,
    updateWaitlistSetting,
    updateAutoApprovalSetting,
    updateEmailNotificationsSetting,
    refreshSettings: fetchSettings
  };
};
