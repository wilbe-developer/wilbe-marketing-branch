
import React from 'react';
import { QuestionStats } from '../types';
import { cn } from '../utils/cn';

interface OptionsListProps {
  options: string[];
  onSelect: (index: number) => void;
  selectedIndex: number | null;
  disabled?: boolean;
  stats?: QuestionStats | null;
  showStats?: boolean;
}

export const OptionsList: React.FC<OptionsListProps> = ({
  options,
  onSelect,
  selectedIndex,
  disabled = false,
  stats = null,
  showStats = false,
}) => {
  const getPercentage = (index: number): number => {
    if (!stats) return 0;
    
    const totalVotes = Object.values(stats).reduce((sum, count) => sum + count, 0);
    if (totalVotes === 0) return 0;
    
    const optionVotes = stats[index] || 0;
    return Math.round((optionVotes / totalVotes) * 100);
  };
  
  return (
    <div className="space-y-2">
      {options.map((option, index) => {
        const isSelected = selectedIndex === index;
        const percentage = getPercentage(index);
        
        return (
          <div key={index} className="relative">
            <button
              onClick={() => !disabled && onSelect(index)}
              disabled={disabled}
              className={cn(
                "option-box w-full text-left text-sm md:text-base font-['Comic_Sans_MS'] py-2",
                {
                  "border-[#ff0052] border-2": isSelected,
                  "cursor-not-allowed opacity-70": disabled && !isSelected,
                }
              )}
            >
              {option}
            </button>
            
            {showStats && (
              <div className="mt-1 relative h-5 bg-gray-100 border border-gray-300">
                <div 
                  className="results-bar-bright absolute left-0 top-0 h-full"
                  style={{ width: `${percentage}%` }}
                >
                </div>
                <div className="absolute inset-0 flex items-center justify-end pr-2">
                  <span className="text-xs font-bold z-10 text-white">{percentage}%</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
