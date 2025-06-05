
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { TopicFilter, Thread } from '@/types/community';

export const useCommunityFilters = (threads: Thread[], privateThreads: Thread[], challenges: any[]) => {
  const [selectedTopic, setSelectedTopic] = useState<TopicFilter>('all');
  const location = useLocation();

  // Check URL parameters for pre-selected topic
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const topic = params.get('topic');
    
    if (topic) {
      setSelectedTopic(topic);
    }
  }, [location]);

  // Filter threads based on selected topic
  const filteredThreads = (() => {
    if (selectedTopic === 'private') {
      return privateThreads;
    }
    
    if (selectedTopic === 'all') return threads;
    if (selectedTopic === 'challenges') return threads.filter(thread => !!thread.challenge_id);
    return threads.filter(thread => thread.challenge_id === selectedTopic);
  })();

  const pageTitle = (() => {
    if (selectedTopic === 'faqs') return 'Frequently Asked Questions';
    if (selectedTopic === 'private') return 'Private Messages';
    if (selectedTopic === 'all') return 'Community Discussions';
    if (selectedTopic === 'challenges') return 'BSF Challenges Discussions';
    return challenges.find(c => c.id === selectedTopic)?.title || 'Discussions';
  })();

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    // Update URL to reflect the selected topic
    const params = new URLSearchParams();
    if (topic !== 'all') {
      params.set('topic', topic);
    }
    const newUrl = params.toString() ? `/community?${params.toString()}` : '/community';
    window.history.replaceState({}, '', newUrl);
  };

  return {
    selectedTopic,
    filteredThreads,
    pageTitle,
    handleTopicSelect,
    setSelectedTopic
  };
};
