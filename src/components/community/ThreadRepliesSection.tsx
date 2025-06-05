
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { ThreadComment } from '@/types/community';

interface ThreadRepliesSectionProps {
  commentsCount: number;
  onAddReply: () => void;
}

export const ThreadRepliesSection = ({ commentsCount, onAddReply }: ThreadRepliesSectionProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <Button
        variant="ghost"
        className="flex items-center gap-2 text-xl font-semibold p-0 h-auto hover:bg-transparent"
        onClick={onAddReply}
      >
        <MessageCircle size={20} />
        <span>{commentsCount}</span>
      </Button>
      <Button 
        onClick={onAddReply}
        className="flex items-center gap-2"
      >
        <MessageCircle size={16} />
        Add Reply
      </Button>
    </div>
  );
};
