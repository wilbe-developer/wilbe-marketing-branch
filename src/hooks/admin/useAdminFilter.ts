
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAdminFilter = () => {
  const [adminUserIds, setAdminUserIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminUsers = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'admin');
          
        if (error) throw error;
        
        const adminIds = data.map(item => item.user_id);
        setAdminUserIds(adminIds);
      } catch (err) {
        console.error('Error fetching admin users:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAdminUsers();
  }, []);

  // Function to filter out admin profiles from an array
  const filterOutAdmins = <T extends { user_id: string }>(data: T[]): T[] => {
    return data.filter(item => !adminUserIds.includes(item.user_id));
  };
  
  // Function to check if a user is an admin
  const isAdmin = (userId: string): boolean => {
    return adminUserIds.includes(userId);
  };

  return { adminUserIds, isLoading, filterOutAdmins, isAdmin };
};
