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

export const useCommunityThreads = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: threads = [], isLoading } = useQuery({
    queryKey: ['threads'],
    queryFn: async () => {
      // First, fetch the threads
      const { data: threadsData, error: threadsError } = await supabase
        .from('discussion_threads')
        .select('*')
        .order('created_at', { ascending: false });

      if (threadsError) throw threadsError;
      
      // For each thread, get the author profile, role, and comment count
      const threadsWithDetails = await Promise.all(
        threadsData.map(async (thread) => {
          // Get author profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('first_name, last_name, avatar')
            .eq('id', thread.author_id)
            .maybeSingle();

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
              .from('profiles')
              .select('first_name, last_name, avatar')
              .eq('id', thread.recipient_id)
              .maybeSingle();
            
            recipientProfile = recipient;
          }

          return {
            ...thread,
            author_profile: profileData || null,
            author_role: roleData || null,
            comment_count: count ? [{ count }] : [{ count: 0 }],
            challenge_name: challengeName,
            recipient_profile: recipientProfile
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
      const { data, error } = await supabase
        .from('user_roles')
        .select('user_id, profiles:user_id(id, first_name, last_name, avatar)')
        .eq('role', 'admin');
      
      if (error) throw error;
      return data.map(item => item.profiles);
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

  return {
    threads: publicThreads,
    privateThreads,
    adminUsers,
    challenges,
    isLoading: isLoading || isLoadingChallenges || isLoadingAdmins,
    createThread,
  };
};
