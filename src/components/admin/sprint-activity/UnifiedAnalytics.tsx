
import React, { useState } from "react";
import { useSprintAdminData } from "@/hooks/useSprintAdminData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { RefreshCcw, Users, TrendingUp, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#10B981', '#2dd4bf', '#4ade80', '#facc15', '#fb923c', '#f87171'];

const UnifiedAnalytics = () => {
  const { unifiedSignups, unifiedStats, isLoading, refreshData, getSignupsByDate } = useSprintAdminData();
  const [timeRange, setTimeRange] = useState<'14' | '30' | '90' | 'all'>('14');
  const [dataView, setDataView] = useState<'all' | 'waitlist' | 'sprint'>('all');

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Get the appropriate data for charts based on selected time range
  const signupData = getSignupsByDate(dataView, parseInt(timeRange));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium">Unified Analytics</h3>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dataView} onValueChange={(value) => setDataView(value as any)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Data Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Signups</SelectItem>
              <SelectItem value="waitlist">Waitlist Only</SelectItem>
              <SelectItem value="sprint">Sprint Only</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={refreshData}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-gray-500">Total Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-gray-500" />
              <span className="text-2xl font-bold">{unifiedStats.totalSignups}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-gray-500">Waitlist Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-gray-500" />
              <span className="text-2xl font-bold">{unifiedStats.waitlistSignups}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-gray-500">Sprint Signups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-gray-500" />
              <span className="text-2xl font-bold">{unifiedStats.sprintSignups}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-gray-500">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="mr-2 h-4 w-4 text-gray-500" />
              <span className="text-2xl font-bold">
                {unifiedStats.conversionRate.toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Signups over time</CardTitle>
            <CardDescription>
              {dataView === 'all' ? 'All signups' : dataView === 'waitlist' ? 'Waitlist signups' : 'Sprint signups'}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={signupData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {dataView === 'all' && (
                  <>
                    <Area type="monotone" dataKey="waitlist" stackId="1" stroke="#8884d8" fill="#8884d8" name="Waitlist" />
                    <Area type="monotone" dataKey="sprint" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Sprint" />
                  </>
                )}
                {dataView === 'waitlist' && (
                  <Area type="monotone" dataKey="waitlist" stroke="#8884d8" fill="#8884d8" name="Waitlist" />
                )}
                {dataView === 'sprint' && (
                  <Area type="monotone" dataKey="sprint" stroke="#82ca9d" fill="#82ca9d" name="Sprint" />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>UTM Sources</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            {unifiedStats.utmSources.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={unifiedStats.utmSources}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    label={({ source, count }) => `${source}: ${count}`}
                    dataKey="count"
                    nameKey="source"
                  >
                    {unifiedStats.utmSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">No UTM source data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Signups</CardTitle>
          <CardDescription>
            Most recent signups across both waitlist and sprint signup flows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>UTM Source</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unifiedSignups.slice(0, 10).map((signup) => (
                <TableRow key={signup.id}>
                  <TableCell className="font-medium">{signup.name}</TableCell>
                  <TableCell>{signup.email}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      signup.source === 'waitlist' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {signup.source === 'waitlist' ? 'Waitlist' : 'Sprint'}
                    </span>
                  </TableCell>
                  <TableCell>{signup.utm_source || 'Direct'}</TableCell>
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

export default UnifiedAnalytics;
