
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SprintProfilesTable from './SprintProfilesTable';
import ProfileChartSection from './ProfileChartSection';
import * as profileDataUtils from './utils/profileDataUtils';

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

  // Prepare chart data based on filter
  let chartData;
  if (filterType === 'team') {
    chartData = {
      teamStatus: profileDataUtils.prepareTeamStatusData(profiles),
      incorporated: profileDataUtils.prepareIncorporatedData(profiles),
      funding: profileDataUtils.prepareFundingData(profiles)
    };
  } else if (filterType === 'market') {
    chartData = {
      marketKnown: profileDataUtils.prepareMarketData(profiles),
      experimentValidated: profileDataUtils.prepareExperimentData(profiles)
    };
  } else {
    chartData = {
      jobType: profileDataUtils.prepareJobTypeData(profiles),
      scientist: profileDataUtils.prepareScientistData(profiles),
      source: profileDataUtils.prepareSourceData(profiles)
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
      <ProfileChartSection chartData={chartData} filterType={filterType} />

      {/* Profiles Table */}
      <SprintProfilesTable profiles={profiles} />
    </div>
  );
};

export default SprintProfilesTab;
