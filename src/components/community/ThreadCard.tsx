
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ThreadActions } from '@/components/community/ThreadActions';
import { ThreadVoting } from '@/components/community/ThreadVoting';
import { ThreadContent } from '@/components/community/ThreadContent';
import { Thread } from '@/types/community';
import { useIsMobile } from '@/hooks/use-mobile';

interface ThreadCardProps {
  thread: Thread;
  onThreadClick: (e: React.MouseEvent, threadId: string) => void;
  onReplyClick: (e: React.MouseEvent, threadId: string) => void;
  onEdit: (thread: Thread) => void;
  onDeleted: () => void;
}

export const ThreadCard = ({ 
  thread, 
  onThreadClick, 
  onReplyClick, 
  onEdit, 
  onDeleted 
}: ThreadCardProps) => {
  const isMobile = useIsMobile();

  return (
    <div
      className="bg-white rounded-lg shadow-sm border p-4 hover:border-brand-pink transition-colors cursor-pointer"
      onClick={(e) => onThreadClick(e, thread.id)}
    >
      {isMobile ? (
        // Mobile layout
        <div className="space-y-3">
          {/* Author info with proper spacing */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 min-w-0 flex-1">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={thread.author_profile?.avatar || undefined} />
                <AvatarFallback className="text-xs">
                  {thread.author_profile?.first_name?.[0] || ''}
                  {thread.author_profile?.last_name?.[0] || ''}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">
                    {thread.author_profile?.first_name || ''} {thread.author_profile?.last_name || ''}
                  </span>
                  {thread.author_role?.role === 'admin' && (
                    <Badge variant="default" className="bg-brand-pink text-xs px-1.5 py-0.5">
                      Admin
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}
                  {thread.last_edited_at && (
                    <span className="ml-1">(edited)</span>
                  )}
                </div>
              </div>
            </div>
            <ThreadActions 
              thread={thread} 
              onEdit={() => onEdit(thread)}
              onDeleted={onDeleted}
            />
          </div>
          
          {/* Title row */}
          <div className="flex items-start gap-2">
            <h3 className="font-semibold text-base leading-tight flex-1">
              {thread.title}
            </h3>
            {thread.is_private && (
              <Lock size={14} className="text-gray-500 flex-shrink-0 mt-0.5" />
            )}
          </div>
          
          {/* Private message recipient */}
          {thread.is_private && thread.recipient_profile && (
            <div className="flex items-center text-xs text-gray-600">
              <span>To: {thread.recipient_profile.first_name} {thread.recipient_profile.last_name}</span>
            </div>
          )}
          
          {/* Content preview */}
          <ThreadContent 
            content={thread.content} 
            className="text-sm"
            isPreview={true}
          />
          
          {/* Footer with voting, metadata and actions */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <div onClick={(e) => e.stopPropagation()}>
                <ThreadVoting threadId={thread.id} size="sm" />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1.5 text-xs px-2 py-1 h-auto text-gray-600 hover:text-gray-800"
                onClick={(e) => onReplyClick(e, thread.id)}
              >
                <MessageCircle size={14} />
                <span>{thread.comment_count && thread.comment_count[0] ? thread.comment_count[0].count : 0}</span>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              {thread.is_private && (
                <Badge variant="outline" className="flex items-center gap-1 text-xs px-1.5 py-0.5">
                  <Lock size={8} />
                  <span>Private</span>
                </Badge>
              )}
              {thread.challenge_id && !thread.is_private && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                  {thread.challenge_name || 'BSF Challenge'}
                </Badge>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Desktop layout
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={thread.author_profile?.avatar || undefined} />
              <AvatarFallback>
                {thread.author_profile?.first_name?.[0] || ''}
                {thread.author_profile?.last_name?.[0] || ''}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">
                    {thread.author_profile?.first_name || ''} {thread.author_profile?.last_name || ''}
                  </span>
                  {thread.author_role?.role === 'admin' && (
                    <Badge variant="default" className="bg-brand-pink">
                      Admin
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}
                  </div>
                  <ThreadActions 
                    thread={thread} 
                    onEdit={() => onEdit(thread)}
                    onDeleted={onDeleted}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg">
              {thread.title}
            </h3>
            {thread.is_private && (
              <Lock size={14} className="text-gray-500" />
            )}
            {thread.last_edited_at && (
              <span className="text-xs text-gray-500">(edited)</span>
            )}
          </div>
          
          {thread.is_private && thread.recipient_profile && (
            <div className="flex items-center text-xs text-gray-600 mb-2">
              <span>To: {thread.recipient_profile.first_name} {thread.recipient_profile.last_name}</span>
            </div>
          )}
          
          <ThreadContent 
            content={thread.content} 
            isPreview={true}
          />
          
          <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <div onClick={(e) => e.stopPropagation()}>
                <ThreadVoting threadId={thread.id} size="sm" />
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1.5 text-xs px-2 py-1 h-auto text-gray-600 hover:text-gray-800"
                onClick={(e) => onReplyClick(e, thread.id)}
              >
                <MessageCircle size={14} />
                <span>{thread.comment_count && thread.comment_count[0] ? thread.comment_count[0].count : 0}</span>
              </Button>
              {thread.is_private && (
                <Badge variant="outline" className="flex items-center gap-1 text-xs">
                  <Lock size={10} />
                  <span>Private</span>
                </Badge>
              )}
              {thread.challenge_id && !thread.is_private && (
                <Badge variant="secondary" className="text-xs">
                  {thread.challenge_name || 'BSF Challenge'}
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
