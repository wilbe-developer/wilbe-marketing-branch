
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface SignupMetricsCardsProps {
  totalCount: number;
  waitlistCount: number;
  sprintCount: number;
}

const SignupMetricsCards: React.FC<SignupMetricsCardsProps> = ({ 
  totalCount, 
  waitlistCount, 
  sprintCount 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-gray-500">Total Signups</div>
          <div className="text-2xl font-bold">{totalCount}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-gray-500">Waitlist Signups</div>
          <div className="text-2xl font-bold">{waitlistCount}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-gray-500">Sprint Signups</div>
          <div className="text-2xl font-bold">{sprintCount}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupMetricsCards;
