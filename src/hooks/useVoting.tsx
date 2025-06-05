
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export type VoteType = 'up' | 'down' | null;

interface VoteData {
  upvotes: number;
  downvotes: number;
  netVotes: number;
  userVote: VoteType;
}

// Hook for thread voting
export const useThreadVoting = (threadId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch current vote data
  const { data: voteData, isLoading } = useQuery({
    queryKey: ['thread-votes', threadId],
    queryFn: async (): Promise<VoteData> => {
      // Get vote summary
      const { data: summary, error: summaryError } = await supabase
        .rpc('get_thread_vote_summary', { p_thread_id: threadId });

      if (summaryError) throw summaryError;

      const voteSummary = summary?.[0] || { upvotes: 0, downvotes: 0, net_votes: 0 };

      // Get user's current vote if logged in
      let userVote: VoteType = null;
      if (user) {
        const { data: userVoteData } = await supabase
          .from('thread_votes')
          .select('vote_type')
          .eq('thread_id', threadId)
          .eq('user_id', user.id)
          .maybeSingle();

        userVote = userVoteData?.vote_type as VoteType || null;
      }

      return {
        upvotes: Number(voteSummary.upvotes),
        downvotes: Number(voteSummary.downvotes),
        netVotes: Number(voteSummary.net_votes),
        userVote
      };
    },
    enabled: !!threadId
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async ({ voteType }: { voteType: VoteType }) => {
      if (!user) throw new Error('Must be logged in to vote');

      if (voteType === null) {
        // Remove vote
        const { error } = await supabase
          .from('thread_votes')
          .delete()
          .eq('thread_id', threadId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Add or update vote
        const { error } = await supabase
          .from('thread_votes')
          .upsert({
            thread_id: threadId,
            user_id: user.id,
            vote_type: voteType
          }, {
            onConflict: 'user_id,thread_id'
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['thread-votes', threadId] });
    },
    onError: (error) => {
      console.error('Error voting:', error);
      toast.error('Failed to submit vote');
    }
  });

  const vote = (newVoteType: VoteType) => {
    const currentVote = voteData?.userVote;
    const actualVote = currentVote === newVoteType ? null : newVoteType;
    voteMutation.mutate({ voteType: actualVote });
  };

  return {
    voteData: voteData || { upvotes: 0, downvotes: 0, netVotes: 0, userVote: null },
    isLoading,
    vote,
    isVoting: voteMutation.isPending
  };
};

// Hook for comment voting
export const useCommentVoting = (commentId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch current vote data
  const { data: voteData, isLoading } = useQuery({
    queryKey: ['comment-votes', commentId],
    queryFn: async (): Promise<VoteData> => {
      // Get vote summary
      const { data: summary, error: summaryError } = await supabase
        .rpc('get_comment_vote_summary', { p_comment_id: commentId });

      if (summaryError) throw summaryError;

      const voteSummary = summary?.[0] || { upvotes: 0, downvotes: 0, net_votes: 0 };

      // Get user's current vote if logged in
      let userVote: VoteType = null;
      if (user) {
        const { data: userVoteData } = await supabase
          .from('comment_votes')
          .select('vote_type')
          .eq('comment_id', commentId)
          .eq('user_id', user.id)
          .maybeSingle();

        userVote = userVoteData?.vote_type as VoteType || null;
      }

      return {
        upvotes: Number(voteSummary.upvotes),
        downvotes: Number(voteSummary.downvotes),
        netVotes: Number(voteSummary.net_votes),
        userVote
      };
    },
    enabled: !!commentId
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async ({ voteType }: { voteType: VoteType }) => {
      if (!user) throw new Error('Must be logged in to vote');

      if (voteType === null) {
        // Remove vote
        const { error } = await supabase
          .from('comment_votes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Add or update vote
        const { error } = await supabase
          .from('comment_votes')
          .upsert({
            comment_id: commentId,
            user_id: user.id,
            vote_type: voteType
          }, {
            onConflict: 'user_id,comment_id'
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comment-votes', commentId] });
    },
    onError: (error) => {
      console.error('Error voting:', error);
      toast.error('Failed to submit vote');
    }
  });

  const vote = (newVoteType: VoteType) => {
    const currentVote = voteData?.userVote;
    const actualVote = currentVote === newVoteType ? null : newVoteType;
    voteMutation.mutate({ voteType: actualVote });
  };

  return {
    voteData: voteData || { upvotes: 0, downvotes: 0, netVotes: 0, userVote: null },
    isLoading,
    vote,
    isVoting: voteMutation.isPending
  };
};
