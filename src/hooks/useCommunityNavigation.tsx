
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Thread } from '@/types/community';

export const useCommunityNavigation = (refetch: () => void) => {
  const [newThreadModalOpen, setNewThreadModalOpen] = useState(false);
  const [editingThread, setEditingThread] = useState<Thread | null>(null);
  const [preselectedChallenge, setPreselectedChallenge] = useState<string | undefined>();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for pre-selected challenge in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const challengeParam = params.get('challenge');
    
    if (challengeParam) {
      setPreselectedChallenge(challengeParam);
      setNewThreadModalOpen(true);
      // Clear the URL parameter
      const newParams = new URLSearchParams(location.search);
      newParams.delete('challenge');
      const newUrl = newParams.toString() ? `/community?${newParams.toString()}` : '/community';
      window.history.replaceState({}, '', newUrl);
    }
  }, [location]);

  const handleNewThreadClick = (selectedTopic: string) => {
    setEditingThread(null);
    setPreselectedChallenge(selectedTopic !== 'all' && selectedTopic !== 'faqs' && selectedTopic !== 'private' ? selectedTopic : undefined);
    setNewThreadModalOpen(true);
  };

  const handleEditThread = (thread: Thread) => {
    setEditingThread(thread);
    setNewThreadModalOpen(true);
  };

  const handleThreadCreated = () => {
    refetch();
  };

  const handleThreadDeleted = () => {
    refetch();
  };

  const handleThreadClick = (e: React.MouseEvent, threadId: string) => {
    // Prevent navigation if the click is on a button or form element
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('[role="button"]') || target.closest('form')) {
      return;
    }
    navigate(`/community/thread/${threadId}`);
  };

  const handleReplyClick = (e: React.MouseEvent, threadId: string) => {
    e.stopPropagation();
    navigate(`/community/thread/${threadId}#reply`);
  };

  return {
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
  };
};
