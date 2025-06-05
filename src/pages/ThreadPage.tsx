
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useThreadComments } from '@/hooks/useThreadComments';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArrowLeft, Clock, Lock, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { ThreadActions } from '@/components/community/ThreadActions';
import { ThreadContent } from '@/components/community/ThreadContent';
import { NewThreadModal } from '@/components/community/NewThreadModal';
import { ReplyModal } from '@/components/community/ReplyModal';
import { CommentActions } from '@/components/community/CommentActions';
import { EditCommentModal } from '@/components/community/EditCommentModal';
import { Thread, ThreadComment } from '@/types/community';

const ThreadPage = () => {
  const { threadId } = useParams<{ threadId: string }>();
  const { 
    thread, 
    comments, 
    isLoading, 
    addComment,
    markThreadAsViewed,
    refetch
  } = useThreadComments(threadId);
  const [editThreadModalOpen, setEditThreadModalOpen] = useState(false);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [editCommentModalOpen, setEditCommentModalOpen] = useState(false);
  const [editingComment, setEditingComment] = useState<ThreadComment | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  // Mark thread as viewed when the page loads
  useEffect(() => {
    if (threadId) {
      markThreadAsViewed(threadId);
    }
  }, [threadId, markThreadAsViewed]);

  // Auto-open reply modal if navigated from community page with #reply
  useEffect(() => {
    if (location.hash === '#reply' && thread) {
      setReplyModalOpen(true);
      // Clear the hash from URL
      window.history.replaceState({}, '', location.pathname);
    }
  }, [location, thread]);

  const handleSubmitComment = async (content: string) => {
    if (!threadId) return;
    
    try {
      await addComment.mutateAsync({ threadId, content });
      toast.success('Reply posted');
    } catch (error) {
      toast.error('Failed to post reply');
      throw error;
    }
  };

  const handleEditThread = () => {
    setEditThreadModalOpen(true);
  };

  const handleThreadEdited = () => {
    refetch();
  };

  const handleEditComment = (comment: ThreadComment) => {
    setEditingComment(comment);
    setEditCommentModalOpen(true);
  };

  const handleCommentUpdated = () => {
    refetch();
    setEditingComment(null);
  };

  const handleCommentDeleted = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!thread) {
    return <div className="p-6 text-center">Thread not found</div>;
  }

  const returnPath = thread.is_private ? '/community?topic=private' : '/community';

  return (
    <div className={`max-w-4xl mx-auto ${isMobile ? 'p-3' : 'p-6'}`}>
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => navigate(returnPath)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {thread.is_private ? 'Back to private messages' : 'Back to discussions'}
      </Button>

      <div className="bg-white rounded-lg shadow-sm border p-5 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={thread.author_profile?.avatar || undefined} />
              <AvatarFallback>
                {thread.author_profile?.first_name?.[0] || ''}
                {thread.author_profile?.last_name?.[0] || ''}
              </AvatarFallback>
            </Avatar>
            <div>
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
            onEdit={handleEditThread}
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
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {comments.length} {comments.length === 1 ? 'Reply' : 'Replies'}
        </h2>
        <Button 
          onClick={() => setReplyModalOpen(true)}
          className="flex items-center gap-2"
        >
          <MessageCircle size={16} />
          Add Reply
        </Button>
      </div>

      {comments.map((comment) => (
        <div key={comment.id} className="bg-white rounded-lg shadow-sm border p-4 mb-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-start">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarImage src={comment.author_profile?.avatar || undefined} />
                <AvatarFallback>
                  {comment.author_profile?.first_name?.[0] || ''}
                  {comment.author_profile?.last_name?.[0] || ''}
                </AvatarFallback>
              </Avatar>
              <div>
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
              onEdit={() => handleEditComment(comment)}
              onDeleted={handleCommentDeleted}
            />
          </div>
          <div className="pl-11">
            <ThreadContent 
              content={comment.content} 
              showImages={true}
              isPreview={false}
            />
          </div>
        </div>
      ))}

      <NewThreadModal
        open={editThreadModalOpen}
        onOpenChange={setEditThreadModalOpen}
        editingThread={thread}
        onThreadCreated={handleThreadEdited}
      />

      <ReplyModal
        open={replyModalOpen}
        onOpenChange={setReplyModalOpen}
        onSubmit={handleSubmitComment}
        isSubmitting={addComment.isPending}
        threadTitle={thread.title}
      />

      {editingComment && (
        <EditCommentModal
          open={editCommentModalOpen}
          onOpenChange={setEditCommentModalOpen}
          comment={editingComment}
          onCommentUpdated={handleCommentUpdated}
        />
      )}
    </div>
  );
};

export default ThreadPage;
