
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Thread, Challenge } from '@/types/community';
import { useAuth } from '@/hooks/useAuth';

// Helper function to safely access JSON properties
const getDefinitionProperty = (definition: any, property: string): any => {
  if (definition && typeof definition === 'object' && !Array.isArray(definition)) {
    return definition[property];
  }
  return null;
};

interface UseCommunityThreadsParams {
  sortType?: string;
  challengeId?: string;
  isPrivate?: boolean;
}

export const useCommunityThreads = (params: UseCommunityThreadsParams = {}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { sortType = 'hot', challengeId, isPrivate = false } = params;

  // Main threads query (public threads only)
  const { data: publicThreads = [], isLoading: isLoadingPublic, refetch: refetchPublic } = useQuery({
    queryKey: ['threads', 'public', sortType, challengeId],
    queryFn: async () => {
      // Use the updated sorting function with pinned fields for public threads only
      const { data: threadsData, error: threadsError } = await supabase
        .rpc('get_sorted_community_threads', {
          p_sort_type: sortType,
          p_challenge_id: challengeId || null,
          p_is_private: false, // Always fetch public threads
          p_limit: 50,
          p_offset: 0
        });

      if (threadsError) throw threadsError;
      
      // For each thread, get the unified author profile, role, and comment count
      const threadsWithDetails = await Promise.all(
        threadsData.map(async (thread) => {
          // Get unified author profile
          const { data: profileData } = await supabase
            .rpc('get_unified_profile', { p_user_id: thread.author_id });

          // Get author role - using maybeSingle instead of single to handle no results gracefully
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', thread.author_id)
            .maybeSingle();

          // Get comment count
          const { count } = await supabase
            .from('thread_comments')
            .select('*', { count: 'exact', head: true })
            .eq('thread_id', thread.id);
            
          // Get challenge name if challenge_id is present
          let challengeName = null;
          if (thread.challenge_id) {
            // Updated to use sprint_task_definitions instead of sprint_tasks
            const { data: challengeData } = await supabase
              .from('sprint_task_definitions')
              .select('name, definition')
              .eq('id', thread.challenge_id)
              .maybeSingle();
            
            // Extract the task name from either the name field or the definition.taskName
            if (challengeData) {
              challengeName = challengeData.name;
              // Safely access the taskName property using the helper function
              const taskName = getDefinitionProperty(challengeData.definition, 'taskName');
              if (taskName) {
                challengeName = taskName;
              }
            }
          }

          return {
            ...thread,
            author_profile: profileData && profileData[0] ? {
              first_name: profileData[0].first_name,
              last_name: profileData[0].last_name,
              avatar: profileData[0].avatar
            } : null,
            author_role: roleData || null,
            comment_count: count ? [{ count }] : [{ count: 0 }],
            challenge_name: challengeName
          };
        })
      );
      
      return threadsWithDetails as Thread[];
    },
  });

  // Separate private threads query - always runs when user is authenticated
  const { data: privateThreads = [], isLoading: isLoadingPrivate, refetch: refetchPrivate } = useQuery({
    queryKey: ['threads', 'private', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Fetch private threads where user is either author or recipient
      const { data: threadsData, error: threadsError } = await supabase
        .rpc('get_sorted_community_threads', {
          p_sort_type: 'new', // Use chronological for private messages
          p_challenge_id: null,
          p_is_private: true,
          p_limit: 50,
          p_offset: 0
        });

      if (threadsError) throw threadsError;
      
      // Filter to only include threads where current user is author or recipient
      const userThreads = threadsData.filter(thread => 
        thread.author_id === user.id || thread.recipient_id === user.id
      );

      // For each thread, get the unified author and recipient profiles, role, and comment count
      const threadsWithDetails = await Promise.all(
        userThreads.map(async (thread) => {
          // Get unified author profile
          const { data: profileData } = await supabase
            .rpc('get_unified_profile', { p_user_id: thread.author_id });

          // Get author role
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', thread.author_id)
            .maybeSingle();

          // Get comment count
          const { count } = await supabase
            .from('thread_comments')
            .select('*', { count: 'exact', head: true })
            .eq('thread_id', thread.id);

          // Get recipient profile if this is a private thread
          let recipientProfile = null;
          if (thread.is_private && thread.recipient_id) {
            const { data: recipient } = await supabase
              .rpc('get_unified_profile', { p_user_id: thread.recipient_id });
            
            // Extract only the fields needed for the Thread type
            if (recipient && recipient[0]) {
              recipientProfile = {
                first_name: recipient[0].first_name,
                last_name: recipient[0].last_name,
                avatar: recipient[0].avatar
              };
            }
          }

          return {
            ...thread,
            author_profile: profileData && profileData[0] ? {
              first_name: profileData[0].first_name,
              last_name: profileData[0].last_name,
              avatar: profileData[0].avatar
            } : null,
            author_role: roleData || null,
            recipient_profile: recipientProfile,
            comment_count: count ? [{ count }] : [{ count: 0 }],
            challenge_name: null // Private threads don't have challenges
          };
        })
      );
      
      return threadsWithDetails as Thread[];
    },
    enabled: !!user, // Only run when user is authenticated
  });

  // Combined threads based on current selection
  const threads = isPrivate ? privateThreads : 
                 challengeId ? publicThreads.filter(t => t.challenge_id === challengeId) :
                 publicThreads;

  // Get admin users only for Request Call feature - simplified direct query
  const { data: adminUsers = [], isLoading: isLoadingAdmins } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log("Fetching admin users for Request Call...");
      try {
        // Direct query for admin profiles using unified_profiles view
        const { data: adminProfiles, error } = await supabase
          .from('unified_profiles')
          .select('*')
          .eq('role', 'admin');
        
        if (error) {
          console.error("Error fetching admin profiles:", error);
          throw error;
        }
        
        console.log("Admin profiles data:", adminProfiles);
        console.log("Number of admin users found:", adminProfiles?.length || 0);
        
        // Ensure we return an array, even if data is null or undefined
        return Array.isArray(adminProfiles) ? adminProfiles : [];
      } catch (error) {
        console.error("Error in admin users query:", error);
        return [];
      }
    },
  });

  const { data: challenges = [], isLoading: isLoadingChallenges } = useQuery({
    queryKey: ['sprint-challenges'],
    queryFn: async () => {
      // Updated to use sprint_task_definitions instead of sprint_tasks
      const { data, error } = await supabase
        .from('sprint_task_definitions')
        .select('id, name, description, definition')
        .order('name', { ascending: true });

      if (error) throw error;
      
      // Transform the data to match the Challenge type
      return data.map(task => {
        let category = 'Other';
        let description = task.description || '';
        
        // Safely access properties from definition
        const categoryFromDef = getDefinitionProperty(task.definition, 'category');
        if (categoryFromDef) {
          category = categoryFromDef;
        }
        
        const descriptionFromDef = getDefinitionProperty(task.definition, 'description');
        if (descriptionFromDef && !description) {
          description = descriptionFromDef;
        }
        
        // Safely access taskName property
        const taskName = getDefinitionProperty(task.definition, 'taskName');
        
        return {
          id: task.id,
          title: taskName || task.name,
          description: description,
          category: category
        };
      }) as Challenge[];
    }
  });

  // Combined refetch function
  const refetch = () => {
    refetchPublic();
    refetchPrivate();
  };

  // Add pinThread mutation
  const pinThread = useMutation({
    mutationFn: async (threadId: string) => {
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // First unpin any existing pinned thread
      await supabase
        .from('discussion_threads')
        .update({ 
          is_pinned: false, 
          pinned_at: null, 
          pinned_by: null 
        })
        .eq('is_pinned', true);

      // Then pin the new thread
      const { data, error } = await supabase
        .from('discussion_threads')
        .update({ 
          is_pinned: true, 
          pinned_at: new Date().toISOString(),
          pinned_by: user.id 
        })
        .eq('id', threadId)
        .select();

      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threads'] });
    },
  });

  // Add unpinThread mutation
  const unpinThread = useMutation({
    mutationFn: async (threadId: string) => {
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      const { data, error } = await supabase
        .from('discussion_threads')
        .update({ 
          is_pinned: false, 
          pinned_at: null, 
          pinned_by: null 
        })
        .eq('id', threadId)
        .select();

      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threads'] });
    },
  });

  const createThread = useMutation({
    mutationFn: async ({ 
      title, 
      content, 
      challenge_id, 
      is_private = false, 
      recipient_id = null 
    }: Partial<Thread>) => {
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      const { data, error } = await supabase
        .from('discussion_threads')
        .insert([
          {
            title,
            content,
            challenge_id,
            author_id: user.id,
            is_private,
            recipient_id
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating thread:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threads'] });
    },
  });

  const updateThread = useMutation({
    mutationFn: async ({ 
      id, 
      title, 
      content 
    }: { id: string; title: string; content: string }) => {
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      const { data, error } = await supabase
        .from('discussion_threads')
        .update({ title, content })
        .eq('id', id)
        .eq('author_id', user.id) // Ensure only the author can edit
        .select()
        .single();

      if (error) {
        console.error('Error updating thread:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threads'] });
    },
  });

  const deleteThread = useMutation({
    mutationFn: async (threadId: string) => {
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      const { error } = await supabase
        .from('discussion_threads')
        .delete()
        .eq('id', threadId)
        .eq('author_id', user.id); // Ensure only the author can delete

      if (error) {
        console.error('Error deleting thread:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threads'] });
    },
  });

  return {
    threads,
    privateThreads,
    adminUsers, // For Request Call feature
    challenges,
    isLoading: isLoadingPublic || isLoadingPrivate || isLoadingChallenges || isLoadingAdmins,
    createThread,
    updateThread,
    deleteThread,
    pinThread,
    unpinThread,
    refetch,
  };
};
