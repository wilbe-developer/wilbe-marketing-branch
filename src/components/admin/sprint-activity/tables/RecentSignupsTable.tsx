
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface RecentSignupsTableProps {
  data: Array<{
    id: string;
    name: string;
    email: string;
    source_type: 'waitlist' | 'sprint';
    utm_source?: string | null;
    created_at: string;
  }>;
  limit?: number;
}

const RecentSignupsTable: React.FC<RecentSignupsTableProps> = ({ data, limit = 10 }) => {
  const limitedData = data.slice(0, limit);
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {limitedData.length > 0 ? (
            limitedData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>
                  {item.utm_source ? (
                    <Badge variant="secondary">{item.utm_source}</Badge>
                  ) : (
                    <Badge variant="outline">direct</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={item.source_type === 'waitlist' ? 'outline' : 'default'}>
                    {item.source_type}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No signup data found for the selected time range
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default RecentSignupsTable;
