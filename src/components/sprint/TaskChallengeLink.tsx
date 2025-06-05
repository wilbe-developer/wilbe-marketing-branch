
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface TaskChallengeLinkProps {
  taskId: string;
}

export const TaskChallengeLink = ({ taskId }: TaskChallengeLinkProps) => {
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ['task-threads-count', taskId],
    queryFn: async () => {
      try {
        const { count, error } = await supabase
          .from('discussion_threads')
          .select('*', { count: 'exact', head: true })
          .eq('challenge_id', taskId);
        
        if (error) {
          console.error('Error fetching thread count:', error);
          return { count: 0 };
        }
        
        return { count: count || 0 };
      } catch (err) {
        console.error('Failed to fetch thread count:', err);
        return { count: 0 };
      }
    }
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Navigate to community with challenge parameter to trigger modal
    navigate(`/community?challenge=${taskId}`);
  };

  return (
    <Button 
      variant="ghost" 
      className="text-sm text-gray-600 hover:text-brand-pink"
      onClick={handleClick}
    >
      <MessageCircle className="mr-1 h-4 w-4" />
      {data?.count ? `View ${data.count} discussions` : 'Start a discussion'}
    </Button>
  );
};
