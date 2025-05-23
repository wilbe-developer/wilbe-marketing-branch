
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SprintProfilesTable from './SprintProfilesTable';
import ProfileChartSection from './ProfileChartSection';
import ProfileDetailDialog from './ProfileDetailDialog';
import { SprintProfile } from './ProfileDetailCard';
import * as profileDataUtils from './utils/profileDataUtils';
import { useAdminFilter } from '@/hooks/admin/useAdminFilter';

const SprintProfilesTab = () => {
  const [filterType, setFilterType] = useState<'team' | 'market' | 'background'>('team');
  const [selectedProfile, setSelectedProfile] = useState<SprintProfile | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { adminUserIds, isLoading: isLoadingAdmins } = useAdminFilter();
  
  const { data: profiles, isLoading: isLoadingProfiles } = useQuery({
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

  const isLoading = isLoadingProfiles || isLoadingAdmins;

  const handleViewProfile = (profile: SprintProfile) => {
    setSelectedProfile(profile);
    setDialogOpen(true);
  };

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

  // Get non-admin profile count (for statistics display)
  const nonAdminProfilesCount = profiles.filter(profile => !adminUserIds.includes(profile.user_id)).length;

  // Prepare chart data based on filter (excluding admin profiles from statistics)
  let chartData;
  if (filterType === 'team') {
    chartData = {
      teamStatus: profileDataUtils.prepareTeamStatusData(profiles, adminUserIds),
      incorporated: profileDataUtils.prepareIncorporatedData(profiles, adminUserIds),
      funding: profileDataUtils.prepareFundingData(profiles, adminUserIds)
    };
  } else if (filterType === 'market') {
    chartData = {
      marketKnown: profileDataUtils.prepareMarketData(profiles, adminUserIds),
      experimentValidated: profileDataUtils.prepareExperimentData(profiles, adminUserIds)
    };
  } else {
    chartData = {
      jobType: profileDataUtils.prepareJobTypeData(profiles, adminUserIds),
      scientist: profileDataUtils.prepareScientistData(profiles, adminUserIds),
      source: profileDataUtils.prepareSourceData(profiles, adminUserIds)
    };
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-muted-foreground">
          Showing statistics for {nonAdminProfilesCount} non-admin profiles (admin profiles excluded from charts)
        </div>
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
      <SprintProfilesTable 
        profiles={profiles} 
        onViewProfile={handleViewProfile} 
        adminUserIds={adminUserIds}
      />

      {/* Profile Detail Dialog - Now extracted to a separate component */}
      <ProfileDetailDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        profile={selectedProfile}
      />
    </div>
  );
};

export default SprintProfilesTab;
