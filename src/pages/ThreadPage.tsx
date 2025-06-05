
import { useIsMobile } from '@/hooks/use-mobile';
import { useThreadPageLogic } from '@/hooks/useThreadPageLogic';
import { ThreadHeader } from '@/components/community/ThreadHeader';
import { ThreadRepliesSection } from '@/components/community/ThreadRepliesSection';
import { ThreadCommentSortControls } from '@/components/community/ThreadCommentSortControls';
import { ThreadCommentsList } from '@/components/community/ThreadCommentsList';
import { NewThreadModal } from '@/components/community/NewThreadModal';
import { ReplyModal } from '@/components/community/ReplyModal';
import { EditCommentModal } from '@/components/community/EditCommentModal';

const ThreadPage = () => {
  const {
    thread,
    comments,
    isLoading,
    commentSort,
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
    handleCommentSortChange,
    addComment
  } = useThreadPageLogic();

  const isMobile = useIsMobile();

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

  return (
    <div className={`max-w-4xl mx-auto ${isMobile ? 'p-3' : 'p-6'}`}>
      <ThreadHeader
        thread={thread}
        onEdit={handleEditThread}
        onNavigateBack={() => navigate(returnPath)}
      />

      <ThreadRepliesSection
        commentsCount={comments.length}
        onAddReply={() => setReplyModalOpen(true)}
      />

      <ThreadCommentSortControls
        selectedSort={commentSort}
        onSortChange={handleCommentSortChange}
        commentsCount={comments.length}
      />

      <ThreadCommentsList
        comments={comments}
        onEditComment={handleEditComment}
        onCommentDeleted={handleCommentDeleted}
      />

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
