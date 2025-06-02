
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface SignupMetricsCardsProps {
  profileCount: number;
  applicationCount: number;
  waitlistCount: number;
  sprintCount: number;
  totalCount: number;
}

const SignupMetricsCards: React.FC<SignupMetricsCardsProps> = ({ 
  profileCount,
  applicationCount,
  waitlistCount, 
  sprintCount,
  totalCount
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-gray-500">Total Activity</div>
          <div className="text-2xl font-bold">{totalCount}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-gray-500">Profile Creations</div>
          <div className="text-2xl font-bold">{profileCount}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-gray-500">Applications</div>
          <div className="text-2xl font-bold">{applicationCount}</div>
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
