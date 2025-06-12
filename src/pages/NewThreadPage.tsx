
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCommunityThreads } from '@/hooks/useCommunityThreads';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { SearchableUserSelector } from '@/components/community/SearchableUserSelector';
import { Challenge } from '@/types/community';

const NewThreadPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [recipientId, setRecipientId] = useState('');
  const { createThread, challenges, adminUsers, isLoading: isLoadingChallenges } = useCommunityThreads();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const location = useLocation();

  // Check if user is admin to show private messaging option
  const isAdmin = user && adminUsers.some(admin => admin.user_id === user.id);

  // Check if we should pre-select a challenge
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const preselectedChallengeId = params.get('challenge');
    if (preselectedChallengeId) {
      setChallengeId(preselectedChallengeId);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (isPrivate && !recipientId) {
      toast.error('Please select a recipient for private messages');
      return;
    }
    
    try {
      await createThread.mutateAsync({ 
        title, 
        content,
        challenge_id: challengeId || undefined,
        is_private: isPrivate,
        recipient_id: isPrivate ? recipientId : undefined
      });
      toast.success(isPrivate ? 'Private message sent successfully' : 'Thread created successfully');
      navigate('/community');
    } catch (error) {
      console.error('Error creating thread:', error);
      toast.error(isPrivate ? 'Failed to send private message' : 'Failed to create thread');
    }
  };

  // Group challenges by category for the select dropdown
  const groupedChallenges = challenges.reduce((acc, challenge) => {
    const category = challenge.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(challenge);
    return acc;
  }, {} as Record<string, Challenge[]>);

  if (isLoadingChallenges) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className={isMobile ? 'p-3' : 'p-6'}>
      <h1 className={`font-bold mb-6 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
        {isPrivate ? 'Send Private Message' : 'Start a New Discussion'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        {isAdmin && (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="private"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="private" className="text-sm font-medium">
              Send as private message
            </label>
          </div>
        )}

        {isPrivate && (
          <div>
            <label htmlFor="recipient" className="block text-sm font-medium mb-1">
              Recipient
            </label>
            <SearchableUserSelector
              value={recipientId}
              onValueChange={setRecipientId}
              placeholder="Search for a user..."
              emptyMessage="No users found"
            />
          </div>
        )}

        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            {isPrivate ? 'Subject' : 'Title'}
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={isPrivate ? "What is this message about?" : "What would you like to discuss?"}
            required
          />
        </div>
        
        {!isPrivate && (
          <div>
            <label htmlFor="challenge" className="block text-sm font-medium mb-1">
              Related Challenge (optional)
            </label>
            <Select 
              value={challengeId || "none"}
              onValueChange={(value) => setChallengeId(value === "none" ? null : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a challenge (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No specific challenge</SelectItem>
                
                {Object.entries(groupedChallenges).map(([category, items]) => (
                  <div key={category}>
                    <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase">
                      {category}
                    </div>
                    {items.map(challenge => (
                      <SelectItem key={challenge.id} value={challenge.id}>
                        {challenge.title}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">
            {isPrivate ? 'Message' : 'Content'}
          </label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={isPrivate ? "Write your message..." : "Share your thoughts..."}
            rows={6}
            required
          />
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={createThread.isPending}>
            {isPrivate ? 'Send Message' : 'Create Thread'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/community')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewThreadPage;
