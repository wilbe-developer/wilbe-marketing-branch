
import React, { useState } from 'react';
import { Camera, ChevronRight } from 'lucide-react';
import CTAButton from './CTAButton';
import { generateAndDownloadImage } from '../utils/imageGenerator';

interface ActionBarProps {
  onNext: () => void;
  cardId: string;
  questionText: string;
  showActions: boolean;
  ctaUrl?: string;
  ctaText?: string;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  onNext,
  cardId,
  questionText,
  showActions,
  ctaUrl,
  ctaText
}) => {
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Handle save button click
  const handleSaveClick = async () => {
    setIsGeneratingImage(true);
    try {
      await generateAndDownloadImage(cardId, questionText);
      setIsSaved(true);
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  if (!showActions) return null;

  return (
    <div className="mt-4 flex flex-row gap-2 justify-between items-center animate-fade-in">
      <button
        onClick={handleSaveClick}
        disabled={isGeneratingImage}
        className="flex items-center gap-1 bg-[#f1f1f1] text-[#333] hover:bg-[#e5e5e5] 
                 text-xs py-1 px-2 font-['Comic_Sans_MS'] pixel-button h-8"
      >
        <Camera size={12} /> 
        {isGeneratingImage ? "Generating..." : isSaved ? "Saved" : "Screenshot"}
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
  );
};

export default ActionBar;
