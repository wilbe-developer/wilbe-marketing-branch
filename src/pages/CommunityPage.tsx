
import { useCommunityThreads } from '@/hooks/useCommunityThreads';
import { useCommunityFilters } from '@/hooks/useCommunityFilters';
import { useCommunityNavigation } from '@/hooks/useCommunityNavigation';
import { CommunityPageLayout } from '@/components/community/CommunityPageLayout';

const CommunityPage = () => {
  const { threads, privateThreads, challenges, isLoading, refetch } = useCommunityThreads();
  
  const {
    selectedTopic,
    filteredThreads,
    pageTitle,
    handleTopicSelect
  } = useCommunityFilters(threads, privateThreads, challenges);
  
  const {
    newThreadModalOpen,
    setNewThreadModalOpen,
    editingThread,
    preselectedChallenge,
    handleNewThreadClick,
    handleEditThread,
    handleThreadCreated,
    handleThreadDeleted,
    handleThreadClick,
    handleReplyClick
  } = useCommunityNavigation(refetch);

  return (
    <CommunityPageLayout
      challenges={challenges}
      hasPrivateMessages={privateThreads.length > 0}
      selectedTopic={selectedTopic}
      onSelectTopic={handleTopicSelect}
      onNewThreadClick={() => handleNewThreadClick(selectedTopic)}
      pageTitle={pageTitle}
      filteredThreads={filteredThreads}
      onThreadClick={handleThreadClick}
      onReplyClick={handleReplyClick}
      onEditThread={handleEditThread}
      onThreadDeleted={handleThreadDeleted}
      newThreadModalOpen={newThreadModalOpen}
      setNewThreadModalOpen={setNewThreadModalOpen}
      preselectedChallenge={preselectedChallenge}
      editingThread={editingThread}
      onThreadCreated={handleThreadCreated}
      isLoading={isLoading}
    />
  );
};

export default CommunityPage;
