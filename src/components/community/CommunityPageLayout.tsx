
import { CommunitySidebar } from '@/components/community/CommunitySidebar';
import { CommunityHeader } from '@/components/community/CommunityHeader';
import { CommunitySortControls } from '@/components/community/CommunitySortControls';
import { FAQContent } from '@/components/community/FAQContent';
import { ThreadList } from '@/components/community/ThreadList';
import { NewThreadModal } from '@/components/community/NewThreadModal';
import { useIsMobile } from '@/hooks/use-mobile';
import { Challenge, Thread } from '@/types/community';

interface CommunityPageLayoutProps {
  // Sidebar props
  challenges: Challenge[];
  hasPrivateMessages: boolean;
  selectedTopic: string;
  selectedSort: string;
  onSelectTopic: (topic: string) => void;
  onSelectSort: (sort: string) => void;
  onNewThreadClick: () => void;
  
  // Header props
  pageTitle: string;
  
  // Thread list props
  filteredThreads: Thread[];
  onThreadClick: (e: React.MouseEvent, threadId: string) => void;
  onReplyClick: (e: React.MouseEvent, threadId: string) => void;
  onEditThread: (thread: Thread) => void;
  onThreadDeleted: () => void;
  
  // Modal props
  newThreadModalOpen: boolean;
  setNewThreadModalOpen: (open: boolean) => void;
  preselectedChallenge?: string;
  editingThread: Thread | null;
  onThreadCreated: () => void;
  
  // Loading state
  isLoading: boolean;
}

export const CommunityPageLayout = ({
  challenges,
  hasPrivateMessages,
  selectedTopic,
  selectedSort,
  onSelectTopic,
  onSelectSort,
  onNewThreadClick,
  pageTitle,
  filteredThreads,
  onThreadClick,
  onReplyClick,
  onEditThread,
  onThreadDeleted,
  newThreadModalOpen,
  setNewThreadModalOpen,
  preselectedChallenge,
  editingThread,
  onThreadCreated,
  isLoading
}: CommunityPageLayoutProps) => {
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <CommunitySidebar 
        challenges={challenges}
        onSelectTopic={onSelectTopic}
        selectedTopic={selectedTopic}
        isMobile={isMobile}
        hasPrivateMessages={hasPrivateMessages}
        onNewThreadClick={onNewThreadClick}
      />
      
      <div className="flex-1 overflow-auto p-4">
        <CommunityHeader
          pageTitle={pageTitle}
          selectedTopic={selectedTopic}
          onNewThreadClick={onNewThreadClick}
        />

        {selectedTopic === 'faqs' ? (
          <FAQContent onNewThreadClick={onNewThreadClick} />
        ) : (
          <>
            <CommunitySortControls 
              selectedSort={selectedSort}
              onSortChange={onSelectSort}
            />
            
            <ThreadList
              threads={filteredThreads}
              selectedTopic={selectedTopic}
              onThreadClick={onThreadClick}
              onReplyClick={onReplyClick}
              onEditThread={onEditThread}
              onThreadDeleted={onThreadDeleted}
            />
          </>
        )}
      </div>

      <NewThreadModal
        open={newThreadModalOpen}
        onOpenChange={setNewThreadModalOpen}
        preselectedChallengeId={preselectedChallenge}
        onThreadCreated={onThreadCreated}
        editingThread={editingThread}
      />
    </div>
  );
};
