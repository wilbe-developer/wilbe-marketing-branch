
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useRealTimeUpdates = (isEnabled: boolean, refreshCallback: () => void) => {
  const [isConnected, setIsConnected] = useState(false);
  
  useEffect(() => {
    if (!isEnabled) {
      setIsConnected(false);
      return;
    }
    
    // Enable realtime for the tables we want to monitor
    const channel = supabase
      .channel('sprint-admin-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public',
        table: 'user_sprint_progress'
      }, (payload) => {
        console.log('Realtime update received:', payload);
        refreshCallback();
        
        // Show notifications based on the type of change
        if (payload.eventType === 'INSERT') {
          toast.info('New task progress recorded');
        } else if (payload.eventType === 'UPDATE' && payload.new.completed && !payload.old.completed) {
          toast.success('Task completed by a user');
        }
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public',
        table: 'user_files'
      }, (payload) => {
        console.log('File update received:', payload);
        refreshCallback();
        
        if (payload.eventType === 'INSERT') {
          toast.info('New file uploaded');
        }
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public',
        table: 'sprint_profiles'
      }, (payload) => {
        console.log('Profile update received:', payload);
        refreshCallback();
        
        if (payload.eventType === 'INSERT') {
          toast.success('New user signed up for sprint');
        } else if (payload.eventType === 'UPDATE') {
          toast.info('User profile updated');
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Connected to realtime updates');
          setIsConnected(true);
          toast.success('Real-time updates enabled');
        } else {
          console.log('Realtime subscription status:', status);
        }
      });
    
    // Cleanup function
    return () => {
      console.log('Cleaning up realtime subscription');
      supabase.removeChannel(channel);
      setIsConnected(false);
    };
  }, [isEnabled, refreshCallback]);
  
  return { isConnected };
};
