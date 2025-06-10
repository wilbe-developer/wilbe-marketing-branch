import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ThreadComment, Thread } from '@/types/community';
import { useAuth } from '@/hooks/useAuth';

// Helper function to safely access JSON properties
const getDefinitionProperty = (definition: any, property: string): any => {
  if (definition && typeof definition === 'object' && !Array.isArray(definition)) {
    return definition[property];
  }
  return null;
};

export const useThreadComments = (threadId?: string, commentSort: string = 'chronological') => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [commentAdded, setCommentAdded] = useState(false);

  // Get thread details
  const { data: thread, isLoading: isThreadLoading, refetch: refetchThread } = useQuery({
    queryKey: ['thread', threadId],
    queryFn: async () => {
      if (!threadId) return null;

      const { data, error } = await supabase
        .from('discussion_threads')
        .select('*')
        .eq('id', threadId)
        .single();

      if (error) throw error;

      // Get unified author profile
      const { data: profileData } = await supabase
        .rpc('get_unified_profile', { p_user_id: data.author_id });

      // Get author role - using maybeSingle to handle no results gracefully
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.author_id)
        .maybeSingle();

      // Get challenge name if challenge_id exists
      let challengeName = null;
      if (data.challenge_id) {
        // Updated to use sprint_task_definitions instead of sprint_tasks
        const { data: challengeData } = await supabase
          .from('sprint_task_definitions')
          .select('name, definition')
          .eq('id', data.challenge_id)
          .maybeSingle();
        
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
      if (data.is_private && data.recipient_id) {
        const { data: recipient } = await supabase
          .rpc('get_unified_profile', { p_user_id: data.recipient_id });
        
        // Extract only the fields needed for the Thread type
        if (recipient) {
          recipientProfile = {
            first_name: recipient.first_name,
            last_name: recipient.last_name,
            avatar: recipient.avatar
          };
        }
      }

      return {
        ...data,
        author_profile: profileData ? {
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          avatar: profileData.avatar
        } : null,
        author_role: roleData || null,
        challenge_name: challengeName,
        recipient_profile: recipientProfile
      } as Thread;
    },
    enabled: !!threadId,
  });

  // Get comments for the thread using the new sorting function
  const { data: comments = [], isLoading: isCommentsLoading } = useQuery({
    queryKey: ['thread-comments', threadId, commentSort, commentAdded],
    queryFn: async () => {
      if (!threadId) return [];

      const { data, error } = await supabase
        .rpc('get_sorted_thread_comments', {
          p_thread_id: threadId,
          p_sort_type: commentSort
        });

      if (error) throw error;

      // For each comment, get the unified author profile and role
      const commentsWithAuthor = await Promise.all(
        data.map(async (comment) => {
          // Get unified author profile
          const { data: profileData } = await supabase
            .rpc('get_unified_profile', { p_user_id: comment.author_id });

          // Get author role
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', comment.author_id)
            .maybeSingle();

          return {
            ...comment,
            author_profile: profileData ? {
              first_name: profileData.first_name,
              last_name: profileData.last_name,
              avatar: profileData.avatar
            } : null,
            author_role: roleData || null,
          };
        })
      );

      return commentsWithAuthor as ThreadComment[];
    },
    enabled: !!threadId,
  });

  // Add a comment to the thread
  const addComment = useMutation({
    mutationFn: async ({ threadId, content }: { threadId: string, content: string }) => {
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      const { data, error } = await supabase
        .from('thread_comments')
        .insert([
          {
            thread_id: threadId,
            author_id: user.id,
            content,
          },
        ])
        .select();

      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      setCommentAdded(prev => !prev); // Toggle to trigger query refetch
      queryClient.invalidateQueries({ queryKey: ['thread-comments', threadId] });
      queryClient.invalidateQueries({ queryKey: ['threads'] }); // Refresh thread list to update comment counts
    },
  });

  // Mark thread as viewed
  const markThreadAsViewed = useCallback(async (threadId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('thread_views')
        .upsert(
          {
            user_id: user.id,
            thread_id: threadId,
            last_viewed_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,thread_id' }
        );

      if (error) {
        console.error('Error marking thread as viewed:', error);
      }
    } catch (error) {
      console.error('Error marking thread as viewed:', error);
    }
  }, [user]);

  // Create a refetch function that refetches both thread and comments
  const refetch = useCallback(() => {
    refetchThread();
    queryClient.invalidateQueries({ queryKey: ['thread-comments', threadId] });
  }, [refetchThread, queryClient, threadId]);

  return {
    thread,
    comments,
    isLoading: isThreadLoading || isCommentsLoading,
    addComment,
    markThreadAsViewed,
    refetch,
  };
};
