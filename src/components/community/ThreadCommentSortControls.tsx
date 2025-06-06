
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
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
  const isMobile = useIsMobile();

  // Only show sort controls if there are multiple comments
  if (commentsCount <= 1) {
    return null;
  }

  if (isMobile) {
    return (
      <div className={cn("flex items-center gap-3 mb-4", className)}>
        <span className="text-sm text-gray-600 whitespace-nowrap">Sort comments by:</span>
        <Select value={selectedSort} onValueChange={onSortChange}>
          <SelectTrigger className="w-32 h-8 text-xs">
            <SelectValue>
              {sortOptions.find(option => option.value === selectedSort)?.label}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-1 mb-4", className)}>
      <span className="text-sm text-gray-600 mr-3">Sort comments by:</span>
      <div className="flex items-center bg-gray-100 rounded-lg p-1">
        {sortOptions.map((option) => (
          <Button
            key={option.value}
            variant="ghost"
            size="sm"
            onClick={() => onSortChange(option.value)}
            className={cn(
              "text-xs px-3 py-1.5 h-auto rounded-md transition-all duration-200",
              selectedSort === option.value 
                ? "bg-white text-gray-900 shadow-sm font-medium" 
                : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
            )}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
