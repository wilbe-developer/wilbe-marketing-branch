
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { CommentActions } from '@/components/community/CommentActions';
import { ThreadContent } from '@/components/community/ThreadContent';
import { CommentVoting } from '@/components/community/CommentVoting';
import { ThreadComment } from '@/types/community';

interface ThreadCommentsListProps {
  comments: ThreadComment[];
  onEditComment: (comment: ThreadComment) => void;
  onCommentDeleted: () => void;
}

export const ThreadCommentsList = ({ comments, onEditComment, onCommentDeleted }: ThreadCommentsListProps) => {
  return (
    <>
      {comments.map((comment) => (
        <div key={comment.id} className="bg-white rounded-lg shadow-sm border p-4 mb-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-start flex-1">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarImage src={comment.author_profile?.avatar || undefined} />
                <AvatarFallback>
                  {comment.author_profile?.first_name?.[0] || ''}
                  {comment.author_profile?.last_name?.[0] || ''}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center">
                  <span className="font-medium">
                    {comment.author_profile?.first_name || ''} {comment.author_profile?.last_name || ''}
                  </span>
                  {comment.author_role?.role === 'admin' && (
                    <Badge variant="default" className="ml-2 bg-brand-pink text-xs">Admin</Badge>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  {comment.updated_at && comment.updated_at !== comment.created_at && (
                    <span className="ml-2">(edited)</span>
                  )}
                </div>
              </div>
            </div>
            <CommentActions 
              comment={comment}
              onEdit={() => onEditComment(comment)}
              onDeleted={onCommentDeleted}
            />
          </div>
          
          <div className="pl-11">
            <ThreadContent 
              content={comment.content} 
              showImages={true}
              isPreview={false}
            />
            
            {/* Comment voting moved to bottom */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div onClick={(e) => e.stopPropagation()}>
                <CommentVoting commentId={comment.id} size="sm" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
