
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { VoteType } from '@/hooks/useVoting';
import { cn } from '@/lib/utils';

interface VoteButtonsProps {
  netVotes: number;
  userVote: VoteType;
  onVote: (voteType: VoteType) => void;
  isVoting?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'default';
}

export const VoteButtons = ({ 
  netVotes, 
  userVote, 
  onVote, 
  isVoting = false, 
  disabled = false,
  size = 'default' 
}: VoteButtonsProps) => {
  const { user } = useAuth();

  const buttonSize = size === 'sm' ? 'h-6 w-6' : 'h-7 w-7';
  const iconSize = size === 'sm' ? 14 : 16;
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  const handleVote = (voteType: VoteType) => {
    if (!user) return;
    onVote(voteType);
  };

  const isDisabled = disabled || isVoting || !user;

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          buttonSize,
          'p-0 transition-colors rounded-full',
          userVote === 'up' 
            ? 'text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100' 
            : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50',
          isDisabled && 'opacity-50 cursor-not-allowed'
        )}
        onClick={() => handleVote('up')}
        disabled={isDisabled}
        aria-label={userVote === 'up' ? 'Remove upvote' : 'Upvote'}
      >
        <ChevronUp size={iconSize} />
      </Button>
      
      <span 
        className={cn(
          'font-medium tabular-nums min-w-0 px-2',
          textSize,
          netVotes > 0 && 'text-blue-600',
          netVotes < 0 && 'text-red-600',
          netVotes === 0 && 'text-gray-500'
        )}
      >
        {netVotes}
      </span>
      
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          buttonSize,
          'p-0 transition-colors rounded-full',
          userVote === 'down' 
            ? 'text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100' 
            : 'text-gray-400 hover:text-red-600 hover:bg-red-50',
          isDisabled && 'opacity-50 cursor-not-allowed'
        )}
        onClick={() => handleVote('down')}
        disabled={isDisabled}
        aria-label={userVote === 'down' ? 'Remove downvote' : 'Downvote'}
      >
        <ChevronDown size={iconSize} />
      </Button>
    </div>
  );
};
