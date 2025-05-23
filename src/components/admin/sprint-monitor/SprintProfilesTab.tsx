
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface SprintProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  team_status: string;
  company_incorporated: boolean;
  received_funding: boolean;
  created_at: string;
  market_known: boolean;
  experiment_validated: boolean;
  job_type: string;
  is_scientist_engineer: boolean;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#8dd1e1'];

const SprintProfilesTab = () => {
  const [filterType, setFilterType] = useState<'team' | 'market' | 'background'>('team');
  
  const { data: profiles, isLoading } = useQuery({
    queryKey: ['sprint-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sprint_profiles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as SprintProfile[];
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!profiles || profiles.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No sprint profile data available</p>
      </div>
    );
  }

  // Process data for charts
  const prepareTeamStatusData = () => {
    const counts: Record<string, number> = {};
    profiles.forEach(profile => {
      const status = profile.team_status || 'Not specified';
      counts[status] = (counts[status] || 0) + 1;
    });
    
    return Object.keys(counts).map(key => ({
      name: key,
      value: counts[key]
    }));
  };

  const prepareIncorporatedData = () => {
    let incorporated = 0;
    let notIncorporated = 0;
    
    profiles.forEach(profile => {
      if (profile.company_incorporated) {
        incorporated++;
      } else {
        notIncorporated++;
      }
    });
    
    return [
      { name: 'Incorporated', value: incorporated },
      { name: 'Not Incorporated', value: notIncorporated }
    ];
  };

  const prepareFundingData = () => {
    let received = 0;
    let notReceived = 0;
    
    profiles.forEach(profile => {
      if (profile.received_funding) {
        received++;
      } else {
        notReceived++;
      }
    });
    
    return [
      { name: 'Received Funding', value: received },
      { name: 'No Funding', value: notReceived }
    ];
  };

  const prepareMarketData = () => {
    let known = 0;
    let unknown = 0;
    
    profiles.forEach(profile => {
      if (profile.market_known) {
        known++;
      } else {
        unknown++;
      }
    });
    
    return [
      { name: 'Market Known', value: known },
      { name: 'Market Unknown', value: unknown }
    ];
  };

  const prepareExperimentData = () => {
    let validated = 0;
    let notValidated = 0;
    
    profiles.forEach(profile => {
      if (profile.experiment_validated) {
        validated++;
      } else {
        notValidated++;
      }
    });
    
    return [
      { name: 'Validated', value: validated },
      { name: 'Not Validated', value: notValidated }
    ];
  };

  const prepareJobTypeData = () => {
    const counts: Record<string, number> = {};
    profiles.forEach(profile => {
      const jobType = profile.job_type || 'Not specified';
      counts[jobType] = (counts[jobType] || 0) + 1;
    });
    
    return Object.keys(counts).map(key => ({
      name: key,
      value: counts[key]
    }));
  };

  const prepareScientistData = () => {
    let isScientist = 0;
    let notScientist = 0;
    
    profiles.forEach(profile => {
      if (profile.is_scientist_engineer) {
        isScientist++;
      } else {
        notScientist++;
      }
    });
    
    return [
      { name: 'Scientist/Engineer', value: isScientist },
      { name: 'Not Scientist/Engineer', value: notScientist }
    ];
  };

  const prepareSourceData = () => {
    const counts: Record<string, number> = {};
    profiles.forEach(profile => {
      const source = profile.utm_source || 'direct';
      counts[source] = (counts[source] || 0) + 1;
    });
    
    return Object.keys(counts).map(key => ({
      name: key,
      value: counts[key]
    }));
  };

  // Chart data based on filter
  let chartData;
  if (filterType === 'team') {
    chartData = {
      teamStatus: prepareTeamStatusData(),
      incorporated: prepareIncorporatedData(),
      funding: prepareFundingData()
    };
  } else if (filterType === 'market') {
    chartData = {
      marketKnown: prepareMarketData(),
      experimentValidated: prepareExperimentData()
    };
  } else {
    chartData = {
      jobType: prepareJobTypeData(),
      scientist: prepareScientistData(),
      source: prepareSourceData()
    };
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex justify-center mb-4">
        <Tabs value={filterType} onValueChange={(value) => setFilterType(value as 'team' | 'market' | 'background')}>
          <TabsList>
            <TabsTrigger value="team">Team & Company</TabsTrigger>
            <TabsTrigger value="market">Market & Validation</TabsTrigger>
            <TabsTrigger value="background">Background & Source</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filterType === 'team' && (
          <>
            <Card className="col-span-1">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Team Status</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData.teamStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.teamStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Company Incorporated</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData.incorporated}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.incorporated.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Funding Status</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData.funding}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.funding.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {filterType === 'market' && (
          <>
            <Card className="col-span-1">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Market Known</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData.marketKnown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.marketKnown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Experiment Validated</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData.experimentValidated}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.experimentValidated.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {filterType === 'background' && (
          <>
            <Card className="col-span-1">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Job Type</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData.jobType}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={120} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Scientist/Engineer</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData.scientist}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.scientist.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Source</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData.source}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.source.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Profiles Table */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Sprint Profiles</h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Team Status</TableHead>
                  <TableHead>Incorporated</TableHead>
                  <TableHead>Funding</TableHead>
                  <TableHead>Scientist/Engineer</TableHead>
                  <TableHead>Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.slice(0, 10).map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell>{profile.name || 'N/A'}</TableCell>
                    <TableCell>{profile.email || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{profile.team_status || 'Not specified'}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={profile.company_incorporated ? "success" : "secondary"}>
                        {profile.company_incorporated ? 'Yes' : 'No'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={profile.received_funding ? "success" : "secondary"}>
                        {profile.received_funding ? 'Yes' : 'No'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={profile.is_scientist_engineer ? "success" : "secondary"}>
                        {profile.is_scientist_engineer ? 'Yes' : 'No'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {profile.utm_source ? (
                        <Badge variant="outline">{profile.utm_source}</Badge>
                      ) : (
                        <Badge variant="outline">direct</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {profiles.length > 10 && (
            <div className="text-center mt-4 text-sm text-muted-foreground">
              Showing 10 of {profiles.length} profiles
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SprintProfilesTab;
