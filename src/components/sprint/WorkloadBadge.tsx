
import { WorkloadIndicator } from '@/utils/workloadCalculation';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';
import { BatteryIndicator } from './BatteryIndicator';

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
          flex items-center gap-2 border-0 font-medium bg-slate-100 text-slate-700
          ${size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5'}
        `}
      >
        <BatteryIndicator level={workload.level} size={size} />
        <div className="flex items-center gap-1">
          <Clock size={size === 'sm' ? 10 : 12} />
          {workload.estimatedTime}
        </div>
      </Badge>
    </div>
  );
};
