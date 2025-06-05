
import { WorkloadIndicator } from '@/utils/workloadCalculation';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface WorkloadBadgeProps {
  workload: WorkloadIndicator;
  showTime?: boolean;
  size?: 'sm' | 'default';
}

export const WorkloadBadge = ({ workload, showTime = false, size = 'default' }: WorkloadBadgeProps) => {
  return (
    <div className="flex items-center gap-1">
      <Badge 
        variant="secondary" 
        className={`${workload.bgColor} ${workload.color} border-0 ${size === 'sm' ? 'text-xs px-1.5 py-0.5' : ''}`}
      >
        {workload.label}
      </Badge>
      {showTime && (
        <span className={`text-gray-500 flex items-center gap-1 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
          <Clock size={size === 'sm' ? 10 : 12} />
          {workload.estimatedTime}
        </span>
      )}
    </div>
  );
};
