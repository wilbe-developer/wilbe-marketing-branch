
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ThreadCommentSortControlsProps {
  selectedSort: string;
  onSortChange: (sort: string) => void;
  commentsCount: number;
  className?: string;
}

const sortOptions = [
  { value: 'chronological', label: 'Chronological', description: 'Time posted' },
  { value: 'best', label: 'Best', description: 'Most upvoted' },
];

export const ThreadCommentSortControls = ({ 
  selectedSort, 
  onSortChange, 
  commentsCount,
  className 
}: ThreadCommentSortControlsProps) => {
  // Only show sort controls if there are multiple comments
  if (commentsCount <= 1) {
    return null;
  }

  return (
    <div className={cn("flex items-center justify-between mb-4", className)}>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Sort comments by:</span>
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
    </div>
  );
};
