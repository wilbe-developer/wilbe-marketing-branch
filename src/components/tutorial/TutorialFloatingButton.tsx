
import React from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { useTutorialContext } from './TutorialProvider';
import { useIsMobile } from '@/hooks/use-mobile';

export const TutorialFloatingButton: React.FC = () => {
  const { hasCompleted, isActive, startTutorial, isLoading } = useTutorialContext();
  const isMobile = useIsMobile();

  // Only show if tutorial hasn't been completed and is not currently active
  if (hasCompleted || isActive || isLoading) return null;

  return (
    <Button
      onClick={startTutorial}
      size={isMobile ? "sm" : "default"}
      variant="outline"
      className={`
        fixed z-50 shadow-lg border-2 border-brand-pink/30 bg-brand-pink/10 hover:bg-brand-pink/20 text-brand-pink
        ${isMobile 
          ? 'bottom-4 right-4 h-12 w-12 p-0' 
          : 'bottom-6 right-6 gap-2'
        }
      `}
      title="Start Tutorial"
    >
      <HelpCircle className="h-4 w-4" />
      {!isMobile && (
        <span className="text-sm font-medium">Tutorial</span>
      )}
    </Button>
  );
};
