
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CommunitySortControlsProps {
  selectedSort: string;
  onSortChange: (sort: string) => void;
  className?: string;
}

const sortOptions = [
  { value: 'hot', label: 'Hot', description: 'Trending discussions' },
  { value: 'new', label: 'New', description: 'Recently posted' },
  { value: 'top', label: 'Top', description: 'Most upvoted' },
  { value: 'rising', label: 'Rising', description: 'Gaining momentum' },
];

export const CommunitySortControls = ({ 
  selectedSort, 
  onSortChange, 
  className 
}: CommunitySortControlsProps) => {
  return (
    <div className={cn("flex items-center gap-2 mb-4", className)}>
      <span className="text-sm text-gray-600 mr-2">Sort by:</span>
      {sortOptions.map((option) => (
        <Button
          key={option.value}
          variant={selectedSort === option.value ? "default" : "ghost"}
          size="sm"
          onClick={() => onSortChange(option.value)}
          className={cn(
            "text-xs",
            selectedSort === option.value 
              ? "bg-brand-pink text-white" 
              : "text-gray-600 hover:text-gray-800"
          )}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
};
