
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface CommunityHeaderProps {
  pageTitle: string;
  selectedTopic: string;
  onNewThreadClick: () => void;
}

export const CommunityHeader = ({ pageTitle, selectedTopic, onNewThreadClick }: CommunityHeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={`mb-6 ${isMobile ? 'space-y-4' : 'flex justify-between items-center'}`}>
      <h1 className={`font-bold ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
        {pageTitle}
      </h1>
      {selectedTopic !== 'faqs' && (
        <Button 
          onClick={onNewThreadClick}
          size={isMobile ? 'sm' : 'default'}
          className={isMobile ? 'w-full' : ''}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          {selectedTopic === 'private' ? 'New Message' : 'New Thread'}
        </Button>
      )}
    </div>
  );
};
