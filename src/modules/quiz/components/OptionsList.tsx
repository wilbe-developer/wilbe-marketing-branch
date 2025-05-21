
import React from 'react';
import { cn } from '../utils/cn';
import { QuestionStats } from '../types';

interface OptionsListProps {
  options: string[];
  onSelect: (optionIndex: number) => void;
  selectedIndex: number | null;
  disabled: boolean;
  stats: Record<number, number> | null;
  showStats: boolean;
}

export const OptionsList: React.FC<OptionsListProps> = ({
  options,
  onSelect,
  selectedIndex,
  disabled,
  stats,
  showStats
}) => {
  // Calculate total responses for percentages
  const calculatePercentage = (count: number, total: number): string => {
    if (total === 0) return "0%";
    return `${Math.round((count / total) * 100)}%`;
  };

  let totalResponses = 0;
  if (stats) {
    totalResponses = Object.values(stats).reduce((sum, count) => sum + count, 0);
  }
  
  return (
    <div className="space-y-3">
      {options.map((option, index) => {
        const isSelected = selectedIndex === index;
        const percentage = stats ? calculatePercentage(stats[index] || 0, totalResponses) : "0%";
        const percentValue = parseInt(percentage);
        
        return (
          <div key={index} className="w-full">
            <button
              className={cn(
                "option-box font-['Comic_Sans_MS'] text-sm w-full text-left p-3 border-2 rounded-sm",
                disabled && "pointer-events-none",
                isSelected 
                  ? "border-[#ff0052] bg-[#fff5f7] text-[#ff0052] font-bold" 
                  : "border-[#ff6b8b] bg-white hover:bg-[#fff5f7] hover:border-[#ff0052]"
              )}
              onClick={() => !disabled && onSelect(index)}
              disabled={disabled}
            >
              <span className="inline-block w-4 mr-1">{String.fromCharCode(65 + index)}.</span> {option}
            </button>
            
            {/* Results bar - only show after answering */}
            {showStats && (
              <div className="ml-5 mt-1 flex items-center animate-fade-in">
                <div className="w-full bg-gray-200 h-4 pixel-border-sm overflow-hidden">
                  <div 
                    className="results-bar-bright h-full flex items-center justify-end pr-1"
                    style={{ 
                      width: percentValue > 3 ? percentage : '3%',
                      transition: 'width 0.5s ease-out'
                    }}
                  >
                    {percentValue > 10 && (
                      <span className="text-xs text-white font-bold font-['Comic_Sans_MS']">{percentage}</span>
                    )}
                  </div>
                </div>
                {percentValue <= 10 && (
                  <span className="ml-2 text-xs font-['Comic_Sans_MS']">{percentage}</span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OptionsList;
