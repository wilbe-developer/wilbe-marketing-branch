
import { useCommunityThreads } from '@/hooks/useCommunityThreads';
import { useCommunityFilters } from '@/hooks/useCommunityFilters';
import { useCommunityNavigation } from '@/hooks/useCommunityNavigation';
import { CommunityPageLayout } from '@/components/community/CommunityPageLayout';

const CommunityPage = () => {
  const {
    selectedTopic,
    selectedSort,
    filteredThreads,
    pageTitle,
    handleTopicSelect,
    handleSortSelect
  } = useCommunityFilters([], [], []); // We'll get the actual data from the hook below

  const { threads, privateThreads, challenges, isLoading, refetch } = useCommunityThreads({
    sortType: selectedSort,
    challengeId: selectedTopic !== 'all' && selectedTopic !== 'challenges' && selectedTopic !== 'private' && selectedTopic !== 'faqs' ? selectedTopic : undefined,
    isPrivate: selectedTopic === 'private'
  });

  // Update the filters with the fetched data
  const {
    filteredThreads: actualFilteredThreads,
    pageTitle: actualPageTitle
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

  // Use the threads that match the current topic selection
  const displayThreads = selectedTopic === 'private' ? privateThreads : 
                        selectedTopic === 'all' ? threads :
                        selectedTopic === 'challenges' ? threads.filter(t => !!t.challenge_id) :
                        threads.filter(t => t.challenge_id === selectedTopic);

  return (
    <CommunityPageLayout
      challenges={challenges}
      hasPrivateMessages={privateThreads.length > 0}
      selectedTopic={selectedTopic}
      selectedSort={selectedSort}
      onSelectTopic={handleTopicSelect}
      onSelectSort={handleSortSelect}
      onNewThreadClick={() => handleNewThreadClick(selectedTopic)}
      pageTitle={actualPageTitle}
      filteredThreads={displayThreads}
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
