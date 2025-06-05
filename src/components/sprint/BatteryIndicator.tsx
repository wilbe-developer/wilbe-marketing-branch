
import React from 'react';

interface BatteryIndicatorProps {
  level: 'low' | 'medium' | 'high';
  size?: 'sm' | 'default';
}

export const BatteryIndicator = ({ level, size = 'default' }: BatteryIndicatorProps) => {
  const barCount = level === 'low' ? 1 : level === 'medium' ? 2 : 3;
  const barSize = size === 'sm' ? 'w-1.5 h-2.5' : 'w-2 h-3';
  const gapSize = size === 'sm' ? 'gap-0.5' : 'gap-1';
  
  return (
    <div className={`flex items-end ${gapSize}`}>
      {[1, 2, 3].map((bar) => (
        <div
          key={bar}
          className={`
            ${barSize} rounded-sm transition-colors
            ${bar <= barCount 
              ? 'bg-slate-600' 
              : 'bg-slate-200'
            }
          `}
        />
      ))}
    </div>
  );
};
