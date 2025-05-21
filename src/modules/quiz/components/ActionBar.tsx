
import React from 'react';
import { cn } from '../utils/cn';
import CTAButton from './CTAButton';

interface ActionBarProps {
  onNext: () => void;
  cardId?: string;
  questionText?: string;
  showActions?: boolean;
  ctaUrl?: string;
  ctaText?: string;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  onNext,
  cardId,
  questionText,
  showActions = true,
  ctaUrl = "/waitlist",
  ctaText = "Serious about building?"
}) => {
  if (!showActions) return null;
  
  const handleNext = () => {
    onNext();
  };
  
  return (
    <div className={cn("pt-4 flex flex-col space-y-3 animate-fade-in", 
      { "opacity-0": !showActions }
    )}>
      <button
        onClick={handleNext}
        className="cta-button-bright w-full text-sm md:text-base"
      >
        Next Question &rarr;
      </button>
      
      <CTAButton 
        visible={true} 
        url={ctaUrl}
        text={ctaText}
      />
    </div>
  );
};
