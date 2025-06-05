
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArrowLeft, Clock, Lock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ThreadActions } from '@/components/community/ThreadActions';
import { ThreadContent } from '@/components/community/ThreadContent';
import { ThreadVoting } from '@/components/community/ThreadVoting';
import { Thread } from '@/types/community';

interface ThreadHeaderProps {
  thread: Thread;
  onEdit: () => void;
  onNavigateBack: () => void;
}

export const ThreadHeader = ({ thread, onEdit, onNavigateBack }: ThreadHeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <>
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={onNavigateBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {thread.is_private ? 'Back to private messages' : 'Back to discussions'}
      </Button>

      <div className="bg-white rounded-lg shadow-sm border p-5 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start flex-1">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={thread.author_profile?.avatar || undefined} />
              <AvatarFallback>
                {thread.author_profile?.first_name?.[0] || ''}
                {thread.author_profile?.last_name?.[0] || ''}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center">
                <span className="font-medium">
                  {thread.author_profile?.first_name || ''} {thread.author_profile?.last_name || ''}
                </span>
                {thread.author_role?.role === 'admin' && (
                  <Badge variant="default" className="ml-2 bg-brand-pink">Admin</Badge>
                )}
              </div>
              <div className="text-sm text-gray-500 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}
                {thread.last_edited_at && (
                  <span className="ml-2">(edited)</span>
                )}
              </div>
            </div>
          </div>
          
          <ThreadActions 
            thread={thread} 
            onEdit={onEdit}
          />
        </div>

        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-2xl font-bold">{thread.title}</h1>
          {thread.is_private && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Lock size={14} />
              <span>Private</span>
            </Badge>
          )}
        </div>

        {thread.recipient_profile && thread.is_private && (
          <div className="flex items-center mb-4 text-gray-700">
            <span className="mr-2">To:</span>
            <Avatar className="h-5 w-5 mr-1">
              <AvatarImage src={thread.recipient_profile.avatar || undefined} />
              <AvatarFallback>
                {thread.recipient_profile.first_name?.[0] || ''}
                {thread.recipient_profile.last_name?.[0] || ''}
              </AvatarFallback>
            </Avatar>
            <span>{thread.recipient_profile.first_name} {thread.recipient_profile.last_name}</span>
          </div>
        )}

        {thread.challenge_name && !thread.is_private && (
          <Badge variant="secondary" className="mb-4">
            {thread.challenge_name}
          </Badge>
        )}

        <ThreadContent 
          content={thread.content} 
          showImages={true}
          isPreview={false}
        />
        
        {/* Voting section moved to bottom */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div onClick={(e) => e.stopPropagation()}>
            <ThreadVoting threadId={thread.id} />
          </div>
        </div>
      </div>
    </>
  );
};
