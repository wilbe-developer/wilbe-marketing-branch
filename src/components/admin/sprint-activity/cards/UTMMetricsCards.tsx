
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface UTMMetricsCardsProps {
  totalSignups: number;
  sourcesCount: number;
  mediumsCount: number;
}

const UTMMetricsCards: React.FC<UTMMetricsCardsProps> = ({ 
  totalSignups, 
  sourcesCount, 
  mediumsCount 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-gray-500">Total Signups</div>
          <div className="text-2xl font-bold">{totalSignups}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-gray-500">Sources</div>
          <div className="text-2xl font-bold">{sourcesCount}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-sm text-gray-500">Mediums</div>
          <div className="text-2xl font-bold">{mediumsCount}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UTMMetricsCards;
