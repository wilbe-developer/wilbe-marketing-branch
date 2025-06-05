import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
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
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className={cn("flex items-center gap-3 mb-4", className)}>
        <span className="text-sm text-gray-600 whitespace-nowrap">Sort by:</span>
        <Select value={selectedSort} onValueChange={onSortChange}>
          <SelectTrigger className="w-24 h-8 text-xs">
            <SelectValue placeholder="Sort">
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
      <span className="text-sm text-gray-600 mr-3">Sort by:</span>
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
