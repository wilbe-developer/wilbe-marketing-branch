
import { useState, useEffect } from 'react';
import { useCommunityThreads } from '@/hooks/useCommunityThreads';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { PlusCircle, Lock } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CommunitySidebar } from '@/components/community/CommunitySidebar';
import { TopicFilter } from '@/types/community';
import { useAuth } from '@/hooks/useAuth';

const CommunityPage = () => {
  const { threads, privateThreads, challenges, isLoading } = useCommunityThreads();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [selectedTopic, setSelectedTopic] = useState<TopicFilter>('all');
  const location = useLocation();
  const { user } = useAuth();

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const pageTitle = (() => {
    if (selectedTopic === 'private') return 'Private Messages';
    if (selectedTopic === 'all') return 'Community Discussions';
    if (selectedTopic === 'challenges') return 'Sprint Challenges Discussions';
    return challenges.find(c => c.id === selectedTopic)?.title || 'Discussions';
  })();

  return (
    <div className="flex h-full">
      <CommunitySidebar 
        challenges={challenges}
        onSelectTopic={setSelectedTopic}
        selectedTopic={selectedTopic}
        isMobile={isMobile}
        hasPrivateMessages={privateThreads.length > 0}
      />
      
      <div className="flex-1 overflow-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className={`font-bold ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
            {pageTitle}
          </h1>
          <Button 
            onClick={() => navigate('/community/new')} 
            size={isMobile ? 'sm' : 'default'}
            disabled={selectedTopic === 'private'}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Thread
          </Button>
        </div>

        <div className="space-y-4">
          {filteredThreads.length === 0 ? (
            <div className="text-center p-6 bg-white rounded-lg shadow-sm border">
              <p className="text-gray-500">
                {selectedTopic === 'private' 
                  ? "No private messages. Contact an admin using the 'Request Call' button on your sprint dashboard."
                  : "No discussions yet. Start a new thread!"}
              </p>
            </div>
          ) : (
            filteredThreads.map((thread) => (
              <div
                key={thread.id}
                className="bg-white rounded-lg shadow-sm border p-4 hover:border-brand-pink transition-colors cursor-pointer"
                onClick={() => navigate(`/community/thread/${thread.id}`)}
              >
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
                        <span className="font-medium">
                          {thread.author_profile?.first_name || ''} {thread.author_profile?.last_name || ''}
                        </span>
                        {thread.author_role?.role === 'admin' && (
                          <Badge variant="default" className="ml-2 bg-brand-pink">Admin</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{thread.title}</h3>
                      {thread.is_private && (
                        <Lock size={16} className="text-gray-500" />
                      )}
                    </div>
                    
                    {thread.is_private && thread.recipient_profile && (
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <span>To: {thread.recipient_profile.first_name} {thread.recipient_profile.last_name}</span>
                      </div>
                    )}
                    
                    <p className="text-gray-600 line-clamp-2">{thread.content}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(thread.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                  <span>
                    {thread.comment_count && thread.comment_count[0] ? thread.comment_count[0].count : 0} replies
                  </span>
                  {thread.is_private && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Lock size={12} />
                      <span>Private</span>
                    </Badge>
                  )}
                  {thread.challenge_id && !thread.is_private && (
                    <Badge variant="secondary">
                      {thread.challenge_name || 'Sprint Challenge'}
                    </Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
