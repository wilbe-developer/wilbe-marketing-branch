
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
    <div className="flex items-center gap-1.5">
      <Badge 
        variant="secondary" 
        className={`
          flex items-center gap-1 border-0 font-medium
          ${size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'}
          ${workload.level === 'low' ? 'bg-green-50 text-green-700' : ''}
          ${workload.level === 'medium' ? 'bg-yellow-50 text-yellow-700' : ''}
          ${workload.level === 'high' ? 'bg-red-50 text-red-700' : ''}
        `}
      >
        <Clock size={size === 'sm' ? 10 : 12} />
        {workload.estimatedTime}
      </Badge>
    </div>
  );
};
