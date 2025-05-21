
import React from 'react';
import { cn } from '../utils/cn';

interface CTAButtonProps {
  visible: boolean;
  className?: string;
  url?: string;
  text?: string;
}

const CTAButton: React.FC<CTAButtonProps> = ({ 
  visible, 
  className,
  url = "https://app.wilbe.com/sprint-waitlist",
  text = "Join the waitlist"
}) => {
  if (!visible) return null;

  return (
    <div className={cn(
      "fixed bottom-4 left-0 w-full flex justify-center animate-slide-up z-10 md:static md:mt-3",
      className
    )}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="cta-button-bright font-['Comic_Sans_MS'] text-xs md:text-sm marquee-effect pixel-border w-full h-full flex items-center justify-center whitespace-nowrap px-1 sm:px-2"
      >
        {text}
      </a>
    </div>
  );
};

export default CTAButton;
