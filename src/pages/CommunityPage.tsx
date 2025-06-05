import { useState, useEffect } from 'react';
import { useCommunityThreads } from '@/hooks/useCommunityThreads';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { PlusCircle, Lock, MessageCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CommunitySidebar } from '@/components/community/CommunitySidebar';
import { FAQContent } from '@/components/community/FAQContent';
import { NewThreadModal } from '@/components/community/NewThreadModal';
import { ThreadActions } from '@/components/community/ThreadActions';
import { TopicFilter, Thread } from '@/types/community';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { ThreadContent } from '@/components/community/ThreadContent';

const CommunityPage = () => {
  const { threads, privateThreads, challenges, isLoading, refetch } = useCommunityThreads();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [selectedTopic, setSelectedTopic] = useState<TopicFilter>('all');
  const [newThreadModalOpen, setNewThreadModalOpen] = useState(false);
  const [editingThread, setEditingThread] = useState<Thread | null>(null);
  const [preselectedChallenge, setPreselectedChallenge] = useState<string | undefined>();
  const location = useLocation();
  const { user } = useAuth();

  // Check URL parameters for pre-selected topic
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const topic = params.get('topic');
    const challengeParam = params.get('challenge');
    
    if (topic) {
      setSelectedTopic(topic);
    }
    
    // If there's a challenge parameter, open the modal with preselected challenge
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

  // Filter threads based on selected topic
  const filteredThreads = (() => {
    if (selectedTopic === 'private') {
      return privateThreads;
    }
    
    if (selectedTopic === 'all') return threads;
    if (selectedTopic === 'challenges') return threads.filter(thread => !!thread.challenge_id);
    return threads.filter(thread => thread.challenge_id === selectedTopic);
  })();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

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

  const handleNewThreadClick = () => {
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

  return (
    <div className="flex h-full">
      <CommunitySidebar 
        challenges={challenges}
        onSelectTopic={handleTopicSelect}
        selectedTopic={selectedTopic}
        isMobile={isMobile}
        hasPrivateMessages={privateThreads.length > 0}
        onNewThreadClick={handleNewThreadClick}
      />
      
      <div className="flex-1 overflow-auto p-4">
        <div className={`mb-6 ${isMobile ? 'space-y-4' : 'flex justify-between items-center'}`}>
          <h1 className={`font-bold ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
            {pageTitle}
          </h1>
          {selectedTopic !== 'faqs' && (
            <Button 
              onClick={handleNewThreadClick}
              size={isMobile ? 'sm' : 'default'}
              disabled={selectedTopic === 'private'}
              className={isMobile ? 'w-full' : ''}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              {selectedTopic === 'faqs' ? 'Ask a Question' : 'New Thread'}
            </Button>
          )}
        </div>

        {selectedTopic === 'faqs' ? (
          <FAQContent />
        ) : (
          <div className="space-y-4">
            {filteredThreads.length === 0 ? (
              <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
                <p className="text-gray-500">
                  {selectedTopic === 'private' 
                    ? "No private messages. Contact an admin using the 'Request Call' button on your BSF dashboard."
                    : "No discussions yet. Start a new thread!"}
                </p>
              </div>
            ) : (
              filteredThreads.map((thread) => (
                <div
                  key={thread.id}
                  className="bg-white rounded-lg shadow-sm border p-4 hover:border-brand-pink transition-colors cursor-pointer"
                  onClick={(e) => handleThreadClick(e, thread.id)}
                >
                  {isMobile ? (
                    // Mobile layout - stacked vertically
                    <div className="space-y-3">
                      {/* Author and metadata row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <Avatar className="h-7 w-7 flex-shrink-0">
                            <AvatarImage src={thread.author_profile?.avatar || undefined} />
                            <AvatarFallback className="text-xs">
                              {thread.author_profile?.first_name?.[0] || ''}
                              {thread.author_profile?.last_name?.[0] || ''}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1 flex-wrap">
                              <span className="font-medium text-sm truncate">
                                {thread.author_profile?.first_name || ''} {thread.author_profile?.last_name || ''}
                              </span>
                              {thread.author_role?.role === 'admin' && (
                                <Badge variant="default" className="bg-brand-pink text-xs px-1 py-0">
                                  Admin
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}
                          </span>
                          <ThreadActions 
                            thread={thread} 
                            onEdit={() => handleEditThread(thread)}
                            onDeleted={handleThreadDeleted}
                          />
                        </div>
                      </div>
                      
                      {/* Title row */}
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-base leading-tight flex-1">
                          {thread.title}
                        </h3>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {thread.is_private && (
                            <Lock size={12} className="text-gray-500" />
                          )}
                          {thread.last_edited_at && (
                            <span className="text-xs text-gray-500">(edited)</span>
                          )}
                        </div>
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
                      
                      {/* Footer with metadata and actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>
                            {thread.comment_count && thread.comment_count[0] ? thread.comment_count[0].count : 0} replies
                          </span>
                          {thread.is_private && (
                            <Badge variant="outline" className="flex items-center gap-1 text-xs px-1 py-0">
                              <Lock size={8} />
                              <span>Private</span>
                            </Badge>
                          )}
                          {thread.challenge_id && !thread.is_private && (
                            <Badge variant="secondary" className="text-xs px-1 py-0">
                              {thread.challenge_name || 'BSF Challenge'}
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-1 text-xs px-2 py-1 h-auto"
                          onClick={(e) => handleReplyClick(e, thread.id)}
                        >
                          <MessageCircle size={10} />
                          Reply
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Desktop layout - existing layout
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={thread.author_profile?.avatar || undefined} />
                            <AvatarFallback>
                              {thread.author_profile?.first_name?.[0] || ''}
                              {thread.author_profile?.last_name?.[0] || ''}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-medium text-sm">
                              {thread.author_profile?.first_name || ''} {thread.author_profile?.last_name || ''}
                            </span>
                            {thread.author_role?.role === 'admin' && (
                              <Badge variant="default" className="bg-brand-pink ml-2">
                                Admin
                              </Badge>
                            )}
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
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}
                        </div>
                        <ThreadActions 
                          thread={thread} 
                          onEdit={() => handleEditThread(thread)}
                          onDeleted={handleThreadDeleted}
                        />
                      </div>
                    </div>
                  )}
                  
                  {!isMobile && (
                    <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                      <span>
                        {thread.comment_count && thread.comment_count[0] ? thread.comment_count[0].count : 0} replies
                      </span>
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
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto flex items-center gap-1 text-xs px-2 py-1 h-auto"
                        onClick={(e) => handleReplyClick(e, thread.id)}
                      >
                        <MessageCircle size={12} />
                        Reply
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <NewThreadModal
        open={newThreadModalOpen}
        onOpenChange={setNewThreadModalOpen}
        preselectedChallengeId={preselectedChallenge}
        onThreadCreated={handleThreadCreated}
        editingThread={editingThread}
      />
    </div>
  );
};

export default CommunityPage;
