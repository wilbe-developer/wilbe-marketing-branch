
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface RecentSignupsTableProps {
  data: Array<{
    id: string;
    name: string;
    email: string;
    source_type: 'waitlist' | 'sprint' | 'profile_creation' | 'application_submission';
    created_at: string;
    utm_source?: string | null;
    utm_medium?: string | null;
  }>;
  limit?: number;
}

const RecentSignupsTable: React.FC<RecentSignupsTableProps> = ({ data, limit = 20 }) => {
  const limitedData = data.slice(0, limit);

  const getSourceBadge = (sourceType: string) => {
    switch (sourceType) {
      case 'profile_creation':
        return <Badge variant="info">Profile</Badge>;
      case 'application_submission':
        return <Badge variant="warning">Application</Badge>;
      case 'waitlist':
        return <Badge variant="success">Waitlist</Badge>;
      case 'sprint':
        return <Badge variant="secondary">Sprint</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        No signup data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3">Name</th>
            <th scope="col" className="px-4 py-3">Email</th>
            <th scope="col" className="px-4 py-3">Type</th>
            <th scope="col" className="px-4 py-3">UTM Source</th>
            <th scope="col" className="px-4 py-3">UTM Medium</th>
            <th scope="col" className="px-4 py-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {limitedData.map((item) => (
            <tr key={`${item.source_type}-${item.id}`} className="bg-white border-b hover:bg-gray-50">
              <td className="px-4 py-4 font-medium text-gray-900">
                {item.name}
              </td>
              <td className="px-4 py-4 text-gray-700">
                {item.email}
              </td>
              <td className="px-4 py-4">
                {getSourceBadge(item.source_type)}
              </td>
              <td className="px-4 py-4 text-gray-700">
                {item.utm_source || 'Direct'}
              </td>
              <td className="px-4 py-4 text-gray-700">
                {item.utm_medium || 'None'}
              </td>
              <td className="px-4 py-4 text-gray-700">
                {new Date(item.created_at).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentSignupsTable;
