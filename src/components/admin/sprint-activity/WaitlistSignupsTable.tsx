
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WaitlistSignupsTableProps {
  timeRange?: '7d' | '30d' | '90d' | 'all';
}

const WaitlistSignupsTable: React.FC<WaitlistSignupsTableProps> = ({ timeRange = 'all' }) => {
  const [signups, setSignups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchSignups();
  }, [timeRange]);
  
  const fetchSignups = async () => {
    setIsLoading(true);
    
    try {
      let query = supabase.from('waitlist_signups').select('*').order('created_at', { ascending: false });
      
      // Apply time filtering if not 'all'
      if (timeRange !== 'all') {
        const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - daysAgo);
        query = query.gte('created_at', startDate.toISOString());
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setSignups(data || []);
    } catch (err) {
      console.error('Error fetching waitlist signups:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Waitlist Signups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-4">
            <div className="animate-spin h-6 w-6 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Waitlist Signups</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Referrals</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {signups.length > 0 ? (
                signups.map((signup) => (
                  <TableRow key={signup.id}>
                    <TableCell>{signup.name}</TableCell>
                    <TableCell>{signup.email}</TableCell>
                    <TableCell>
                      {signup.utm_source ? (
                        <Badge variant="secondary">{signup.utm_source}</Badge>
                      ) : (
                        <Badge variant="outline">direct</Badge>
                      )}
                    </TableCell>
                    <TableCell>{new Date(signup.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{signup.successful_referrals || 0}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No waitlist signups found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default WaitlistSignupsTable;
