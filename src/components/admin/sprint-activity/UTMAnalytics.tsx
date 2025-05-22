
import React, { useState } from 'react';
import { useSprintAdminData } from '@/hooks/useSprintAdminData';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#10B981', '#2dd4bf', '#4ade80', '#facc15', '#fb923c', '#f87171'];

const UTMAnalytics = () => {
  const { unifiedStats, unifiedSignups, refreshData } = useSprintAdminData();
  const [dataView, setDataView] = useState<'source' | 'medium'>('source');

  // Filter for only signups with UTM parameters
  const signupsWithUTM = unifiedSignups.filter(signup => 
    signup.utm_source || signup.utm_medium || signup.utm_campaign || signup.utm_term || signup.utm_content
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium">UTM Analytics</h3>
        <Select value={dataView} onValueChange={(value) => setDataView(value as 'source' | 'medium')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="View Parameter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="source">UTM Source</SelectItem>
            <SelectItem value="medium">UTM Medium</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{dataView === 'source' ? 'UTM Source' : 'UTM Medium'} Distribution</CardTitle>
            <CardDescription>
              {dataView === 'source' 
                ? 'Where your users are coming from' 
                : 'Which channels are driving traffic'}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {(dataView === 'source' ? unifiedStats.utmSources : unifiedStats.utmMediums).length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataView === 'source' ? unifiedStats.utmSources : unifiedStats.utmMediums}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    label={({ name, value }) => `${name}: ${value}`}
                    dataKey="count"
                    nameKey={dataView === 'source' ? 'source' : 'medium'}
                  >
                    {(dataView === 'source' ? unifiedStats.utmSources : unifiedStats.utmMediums).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No UTM {dataView} data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion by {dataView === 'source' ? 'Source' : 'Medium'}</CardTitle>
            <CardDescription>
              Conversion from waitlist to sprint signup
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dataView === 'source' ? unifiedStats.utmSources : unifiedStats.utmMediums}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey={dataView === 'source' ? 'source' : 'medium'} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent UTM Parameters</CardTitle>
          <CardDescription>
            Latest signups with marketing attribution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Medium</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {signupsWithUTM.slice(0, 10).map((signup) => (
                <TableRow key={signup.id}>
                  <TableCell className="font-medium">{signup.name}</TableCell>
                  <TableCell>{signup.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{signup.utm_source || 'N/A'}</Badge>
                  </TableCell>
                  <TableCell>{signup.utm_medium || 'N/A'}</TableCell>
                  <TableCell>{signup.utm_campaign || 'N/A'}</TableCell>
                  <TableCell>{new Date(signup.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UTMAnalytics;
