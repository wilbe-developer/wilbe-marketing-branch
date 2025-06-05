
import { useThreadVoting } from '@/hooks/useVoting';
import { VoteButtons } from './VoteButtons';

interface ThreadVotingProps {
  threadId: string;
  size?: 'sm' | 'default';
  disabled?: boolean;
}

export const ThreadVoting = ({ threadId, size = 'default', disabled = false }: ThreadVotingProps) => {
  const { voteData, vote, isVoting } = useThreadVoting(threadId);

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
