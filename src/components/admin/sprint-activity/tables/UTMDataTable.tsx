
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface UTMDataTableProps {
  data: any[];
}

const UTMDataTable: React.FC<UTMDataTableProps> = ({ data }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Medium</TableHead>
            <TableHead>Campaign</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((item) => (
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
                  {item.utm_medium ? (
                    <Badge variant="secondary">{item.utm_medium}</Badge>
                  ) : (
                    <Badge variant="outline">direct</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {item.utm_campaign ? (
                    <Badge variant="secondary">{item.utm_campaign}</Badge>
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
              <TableCell colSpan={7} className="text-center py-4">
                No UTM data found for the selected time range
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UTMDataTable;
