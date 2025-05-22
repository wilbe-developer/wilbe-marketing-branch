
import { supabase } from '@/integrations/supabase/client';
import { WaitlistSignup, SprintProfile } from './types';
import { toast } from 'sonner';

export const fetchWaitlistSignups = async (): Promise<WaitlistSignup[]> => {
  try {
    const { data, error } = await supabase
      .from('waitlist_signups')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (err: any) {
    console.error('Error fetching waitlist signups:', err);
    toast.error('Failed to load waitlist data');
    return [];
  }
};

export const fetchSprintProfiles = async (): Promise<SprintProfile[]> => {
  try {
    const { data, error } = await supabase
      .from('sprint_profiles')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (err: any) {
    console.error('Error fetching sprint profiles:', err);
    toast.error('Failed to load sprint profile data');
    return [];
  }
};

export const fetchTaskDefinitions = async () => {
  try {
    const { data, error } = await supabase
      .from('sprint_task_definitions')
      .select('*');
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (err: any) {
    console.error('Error fetching task definitions:', err);
    toast.error('Failed to load task definitions');
    return [];
  }
};

export const fetchTaskProgress = async () => {
  try {
    const { data, error } = await supabase
      .from('user_sprint_progress')
      .select('*');
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (err: any) {
    console.error('Error fetching task progress:', err);
    toast.error('Failed to load task progress data');
    return [];
  }
};

export const fetchUserFiles = async () => {
  try {
    const { data, error } = await supabase
      .from('user_files')
      .select('*');
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (err: any) {
    console.error('Error fetching user files:', err);
    toast.error('Failed to load user files');
    return [];
  }
};
