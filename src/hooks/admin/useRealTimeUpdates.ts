
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useRealTimeUpdates = (enabled: boolean, onDataChange: () => void) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setIsConnected(false);
      return;
    }

    const sprintProfileChannel = supabase.channel('sprint_profiles_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'sprint_profiles'
      }, () => {
        onDataChange();
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
        console.log('Sprint profiles realtime subscription status:', status);
      });

    const progressChannel = supabase.channel('sprint_progress_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_sprint_progress'
      }, () => {
        onDataChange();
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED' && isConnected);
        console.log('Sprint progress realtime subscription status:', status);
      });

    const filesChannel = supabase.channel('user_files_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_files'
      }, () => {
        onDataChange();
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED' && isConnected);
        console.log('User files realtime subscription status:', status);
      });

    // Cleanup
    return () => {
      supabase.removeChannel(sprintProfileChannel);
      supabase.removeChannel(progressChannel);
      supabase.removeChannel(filesChannel);
    };
  }, [enabled, onDataChange]);

  return { isConnected };
};
