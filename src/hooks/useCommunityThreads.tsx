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

  const { data: threads = [], isLoading, refetch } = useQuery({
    queryKey: ['threads', sortType, challengeId, isPrivate],
    queryFn: async () => {
      // Use the updated sorting function with pinned fields
      const { data: threadsData, error: threadsError } = await supabase
        .rpc('get_sorted_community_threads', {
          p_sort_type: sortType,
          p_challenge_id: challengeId || null,
          p_is_private: isPrivate,
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
            challenge_name: challengeName
          };
        })
      );
      
      return threadsWithDetails as Thread[];
    },
  });

  // Filter to get only private threads where the current user is either author or recipient
  const privateThreads = threads.filter(thread => 
    thread.is_private && 
    (thread.author_id === user?.id || thread.recipient_id === user?.id)
  );

  // Filter to get only public threads
  const publicThreads = threads.filter(thread => !thread.is_private);

  // Get admin users for the "Request Call" feature
  const { data: adminUsers = [], isLoading: isLoadingAdmins } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log("Fetching admin users...");
      try {
        // First, get all user_ids with admin role
        const { data: adminRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'admin');
        
        if (rolesError) {
          console.error("Error fetching admin roles:", rolesError);
          throw rolesError;
        }
        
        console.log("Admin roles data:", adminRoles);
        
        if (!adminRoles || adminRoles.length === 0) {
          console.log("No admin roles found");
          return [];
        }
        
        // Extract user_ids
        const adminUserIds = adminRoles.map(role => role.user_id);
        console.log("Admin user IDs:", adminUserIds);
        
        // Then fetch the unified profiles for these users
        const adminProfiles = await Promise.all(
          adminUserIds.map(async (userId) => {
            const { data: profile } = await supabase
              .rpc('get_unified_profile', { p_user_id: userId });
            return profile && profile[0] ? profile[0] : null;
          })
        );
        
        console.log("Admin profiles:", adminProfiles);
        return adminProfiles.filter(profile => profile !== null) || [];
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
    threads: publicThreads,
    privateThreads,
    adminUsers,
    challenges,
    isLoading: isLoading || isLoadingChallenges || isLoadingAdmins,
    createThread,
    updateThread,
    deleteThread,
    pinThread,
    unpinThread,
    refetch,
  };
};
