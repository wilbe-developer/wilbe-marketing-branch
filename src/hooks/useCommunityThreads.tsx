
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Thread } from '@/types/community';

interface CommunityThreadsOptions {
  sortType?: string;
  challengeId?: string;
  isPrivate?: boolean;
  limit?: number;
  offset?: number;
}

export const useCommunityThreads = (options: CommunityThreadsOptions = {}) => {
  const { 
    sortType = 'hot', 
    challengeId, 
    isPrivate = false, 
    limit = 50, 
    offset = 0 
  } = options;

  const { data: threadsData, isLoading: threadsLoading, refetch: refetchThreads } = useQuery({
    queryKey: ['community-threads', sortType, challengeId, isPrivate, limit, offset],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_sorted_community_threads', {
          p_sort_type: sortType,
          p_challenge_id: challengeId || null,
          p_is_private: isPrivate,
          p_limit: limit,
          p_offset: offset
        });

      if (error) throw error;
      return data;
    },
  });

  const { data: privateThreadsData, isLoading: privateLoading, refetch: refetchPrivateThreads } = useQuery({
    queryKey: ['private-threads', sortType],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('get_sorted_community_threads', {
          p_sort_type: sortType,
          p_challenge_id: null,
          p_is_private: true,
          p_limit: 50,
          p_offset: 0
        });

      if (error) throw error;
      return data;
    },
  });

  const { data: challenges, isLoading: challengesLoading } = useQuery({
    queryKey: ['sprint-challenges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sprint_task_definitions')
        .select('id, name')
        .order('name');

      if (error) throw error;
      return data;
    },
  });

  // Process threads data to match the expected Thread interface
  const processThreads = async (rawThreads: any[]) => {
    if (!rawThreads?.length) return [];

    const threadsWithMetadata = await Promise.all(
      rawThreads.map(async (thread) => {
        // Get author profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar')
          .eq('id', thread.author_id)
          .maybeSingle();

        // Get author role
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', thread.author_id)
          .maybeSingle();

        // Get comment count
        const { data: commentCount } = await supabase
          .from('thread_comments')
          .select('id', { count: 'exact' })
          .eq('thread_id', thread.id);

        // Get challenge name if challenge_id exists
        let challengeName = null;
        if (thread.challenge_id) {
          const { data: challengeData } = await supabase
            .from('sprint_task_definitions')
            .select('name, definition')
            .eq('id', thread.challenge_id)
            .maybeSingle();
          
          if (challengeData) {
            challengeName = challengeData.name;
            // Try to get taskName from definition if available
            if (challengeData.definition && typeof challengeData.definition === 'object') {
              const taskName = (challengeData.definition as any)?.taskName;
              if (taskName) {
                challengeName = taskName;
              }
            }
          }
        }

        // Get recipient profile if private thread
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
          comment_count: [{ count: commentCount?.length || 0 }],
          challenge_name: challengeName,
          recipient_profile: recipientProfile
        } as Thread;
      })
    );

    return threadsWithMetadata;
  };

  const { data: threads = [], isLoading: processedThreadsLoading } = useQuery({
    queryKey: ['processed-threads', threadsData],
    queryFn: () => processThreads(threadsData || []),
    enabled: !!threadsData,
  });

  const { data: privateThreads = [], isLoading: processedPrivateLoading } = useQuery({
    queryKey: ['processed-private-threads', privateThreadsData],
    queryFn: () => processThreads(privateThreadsData || []),
    enabled: !!privateThreadsData,
  });

  const isLoading = threadsLoading || privateLoading || challengesLoading || processedThreadsLoading || processedPrivateLoading;

  const refetch = () => {
    refetchThreads();
    refetchPrivateThreads();
  };

  return {
    threads,
    privateThreads,
    challenges: challenges || [],
    isLoading,
    refetch,
  };
};
