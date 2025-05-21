
import React, { useState } from 'react';
import { Camera, ChevronRight } from 'lucide-react';
import CTAButton from './CTAButton';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from '../utils/cn';

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
  const [showScreenshotDialog, setShowScreenshotDialog] = useState<boolean>(false);

  // Handle screenshot button click - now just shows dialog
  const handleScreenshotClick = () => {
    setShowScreenshotDialog(true);
  };

  if (!showActions) return null;

  return (
    <>
      <div className={cn("mt-4 flex flex-row gap-2 justify-between items-center animate-fade-in",
        { "opacity-0": !showActions }
      )}>
        <button
          onClick={handleScreenshotClick}
          className="flex items-center gap-1 bg-[#f1f1f1] text-[#333] hover:bg-[#e5e5e5] 
                   text-xs py-1 px-2 font-['Comic_Sans_MS'] pixel-button h-8"
        >
          <Camera size={12} /> 
          Screenshot
        </button>
        
        {/* CTA Button between screenshot and next */}
        <div className="flex-grow px-1">
          <CTAButton 
            visible={true} 
            className="static m-0 p-0 h-8 w-full"
            url={ctaUrl}
            text={ctaText}
          />
        </div>
        
        <button
          onClick={onNext}
          className="flex items-center gap-1 bg-[#ff0052] text-white hover:bg-[#cc0042] 
                   text-xs py-1 px-2 font-['Comic_Sans_MS'] pixel-button h-8"
        >
          Next <ChevronRight size={12} />
        </button>
      </div>

      {/* Screenshot instruction dialog */}
      <Dialog open={showScreenshotDialog} onOpenChange={setShowScreenshotDialog}>
        <DialogContent className="sm:max-w-md border-4 border-[#ff0052] early-internet-card">
          <div className="text-center px-4 py-6 space-y-4">
            <div className="text-xl font-bold font-['Comic_Sans_MS'] blink-marquee">
              <span className="star-blink">★</span> 
              <span className="text-[#ff0052]">Nice try!</span> 
              <span className="star-blink">★</span>
            </div>
            
            <p className="text-lg font-['Comic_Sans_MS'] text-black">
              Take a real screenshot using your device 🎯
            </p>
            
            <div className="mt-4">
              <button 
                onClick={() => setShowScreenshotDialog(false)}
                className="pixel-button bg-[#ff0052] text-white hover:bg-[#cc0042] px-4 py-2 font-['Comic_Sans_MS']"
              >
                Got it!
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
