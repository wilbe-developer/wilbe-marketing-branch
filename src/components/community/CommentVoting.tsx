
import { useCommentVoting } from '@/hooks/useVoting';
import { VoteButtons } from './VoteButtons';

interface CommentVotingProps {
  commentId: string;
  size?: 'sm' | 'default';
  disabled?: boolean;
}

export const CommentVoting = ({ commentId, size = 'default', disabled = false }: CommentVotingProps) => {
  const { voteData, vote, isVoting } = useCommentVoting(commentId);

  return (
    <VoteButtons
      netVotes={voteData.netVotes}
      userVote={voteData.userVote}
      onVote={vote}
      isVoting={isVoting}
      disabled={disabled}
      size={size}
    />
  );
};
