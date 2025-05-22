
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAppSettings = () => {
  const [isDashboardActive, setIsDashboardActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardSetting = async () => {
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', 'sprint_dashboard_active')
          .single();

        if (error) {
          console.error('Error fetching dashboard setting:', error);
          setIsDashboardActive(false);
        } else {
          // The value is stored as a JSON boolean, so we need to parse it
          const isActive = data?.value === true || data?.value === 'true';
          setIsDashboardActive(isActive);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setIsDashboardActive(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardSetting();
  }, []);

  const updateDashboardSetting = async (isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('app_settings')
        .update({ value: isActive })
        .eq('key', 'sprint_dashboard_active');

      if (error) {
        console.error('Error updating dashboard setting:', error);
        toast.error('Failed to update dashboard setting. Please try again.');
        return false;
      }

      setIsDashboardActive(isActive);
      toast.success(`Sprint dashboard is now ${isActive ? 'active' : 'inactive'}`);
      return true;
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  };

  return {
    isDashboardActive,
    isLoading,
    updateDashboardSetting
  };
};
