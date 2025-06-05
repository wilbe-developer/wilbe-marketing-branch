
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useThreadComments } from '@/hooks/useThreadComments';
import { toast } from 'sonner';
import { ThreadComment } from '@/types/community';

export const useThreadPageLogic = () => {
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

  const returnPath = thread?.is_private ? '/community?topic=private' : '/community';

  return {
    thread,
    comments,
    isLoading,
    threadId,
    editThreadModalOpen,
    setEditThreadModalOpen,
    replyModalOpen,
    setReplyModalOpen,
    editCommentModalOpen,
    setEditCommentModalOpen,
    editingComment,
    navigate,
    returnPath,
    handleSubmitComment,
    handleEditThread,
    handleThreadEdited,
    handleEditComment,
    handleCommentUpdated,
    handleCommentDeleted,
    addComment
  };
};
