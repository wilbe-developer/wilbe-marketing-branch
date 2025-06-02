import { supabase } from '@/integrations/supabase/client';
import { WaitlistSignup, SprintProfile, UserProfile, UserApplication, UserRole } from './types';
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

export const fetchSprintProfilesWithUserInfo = async () => {
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
    console.error('Error fetching sprint profiles with user info:', err);
    toast.error('Failed to load sprint profiles with user info');
    return [];
  }
};

export const fetchTaskProgressWithUserInfo = async () => {
  try {
    // First get all sprint profiles to map user information
    const { data: profilesData, error: profilesError } = await supabase
      .from('sprint_profiles')
      .select('user_id, name, email');
      
    if (profilesError) {
      throw profilesError;
    }

    // Create a map for quick lookups
    const userMap = new Map();
    (profilesData || []).forEach(profile => {
      userMap.set(profile.user_id, {
        name: profile.name || 'Unknown User',
        email: profile.email || 'No Email'
      });
    });

    // Get all task progress data
    const { data: progressData, error: progressError } = await supabase
      .from('user_sprint_progress')
      .select('*');
      
    if (progressError) {
      throw progressError;
    }
    
    // Combine the data
    const enrichedData = (progressData || []).map(progress => {
      const userInfo = userMap.get(progress.user_id) || { name: 'Unknown User', email: 'No Email' };
      return {
        ...progress,
        user_name: userInfo.name,
        user_email: userInfo.email
      };
    });
    
    return enrichedData;
  } catch (err: any) {
    console.error('Error fetching task progress with user info:', err);
    toast.error('Failed to load task progress with user info');
    return [];
  }
};

export const fetchUserProfiles = async (): Promise<UserProfile[]> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (err: any) {
    console.error('Error fetching user profiles:', err);
    toast.error('Failed to load user profiles');
    return [];
  }
};

export const fetchUserApplications = async (): Promise<UserApplication[]> => {
  try {
    const { data, error } = await supabase
      .from('user_applications')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (err: any) {
    console.error('Error fetching user applications:', err);
    toast.error('Failed to load user applications');
    return [];
  }
};

export const fetchUserRoles = async (): Promise<UserRole[]> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (err: any) {
    console.error('Error fetching user roles:', err);
    toast.error('Failed to load user roles');
    return [];
  }
};
