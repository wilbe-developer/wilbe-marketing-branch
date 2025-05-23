
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Thread, Challenge } from '@/types/community';
import { useAuth } from '@/hooks/useAuth';

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
              // If the definition has a taskName, use that as it might be more user-friendly
              if (challengeData.definition && 
                  typeof challengeData.definition === 'object' && 
                  challengeData.definition.taskName) {
                challengeName = challengeData.definition.taskName;
              }
            }
          }

          return {
            ...thread,
            author_profile: profileData || null,
            author_role: roleData || null,
            comment_count: count ? [{ count }] : [{ count: 0 }],
            challenge_name: challengeName
          };
        })
      );
      
      return threadsWithDetails as Thread[];
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
        
        // Extract category and better description from definition if available
        if (task.definition && typeof task.definition === 'object') {
          if (task.definition.category) {
            category = task.definition.category;
          }
          if (task.definition.description && !description) {
            description = task.definition.description;
          }
        }
        
        return {
          id: task.id,
          title: task.definition?.taskName || task.name,
          description: description,
          category: category
        };
      }) as Challenge[];
    }
  });

  const createThread = useMutation({
    mutationFn: async ({ title, content, challenge_id }: Partial<Thread>) => {
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
    threads,
    challenges,
    isLoading: isLoading || isLoadingChallenges,
    createThread,
  };
};
