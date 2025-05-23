
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
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
  [key: string]: any; // For any other properties in the profile
}

const SprintProfilesTab = () => {
  const [filterType, setFilterType] = useState<'team' | 'market' | 'background'>('team');
  const [selectedProfile, setSelectedProfile] = useState<SprintProfile | null>(null);
  
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

  const handleViewProfile = (profile: SprintProfile) => {
    setSelectedProfile(profile);
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
      <SprintProfilesTable 
        profiles={profiles} 
        onViewProfile={handleViewProfile} 
      />

      {/* Profile Detail Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <span className="hidden">View Profile</span>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complete Profile Details</DialogTitle>
          </DialogHeader>
          {selectedProfile && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ProfileDetailCard 
                  title="User Information" 
                  profile={selectedProfile} 
                  fields={['name', 'email', 'created_at']} 
                />
                <ProfileDetailCard 
                  title="Team & Company" 
                  profile={selectedProfile} 
                  fields={['team_status', 'company_incorporated', 'received_funding', 'funding_details', 'has_deck']} 
                />
                <ProfileDetailCard 
                  title="Market & Validation" 
                  profile={selectedProfile} 
                  fields={['market_known', 'market_gap_reason', 'experiment_validated', 'problem_defined', 'customer_engagement']} 
                />
                <ProfileDetailCard 
                  title="Background" 
                  profile={selectedProfile} 
                  fields={['job_type', 'is_scientist_engineer', 'current_job', 'linkedin_url']} 
                />
                <ProfileDetailCard 
                  title="UTM Data" 
                  profile={selectedProfile} 
                  fields={['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']} 
                />
                {selectedProfile.funding_sources && (
                  <ProfileDetailCard 
                    title="Funding Sources" 
                    profile={selectedProfile} 
                    fields={['funding_sources', 'funding_amount', 'has_financial_plan']} 
                  />
                )}
                {selectedProfile.commercializing_invention && (
                  <ProfileDetailCard 
                    title="IP & Commercialization" 
                    profile={selectedProfile} 
                    fields={['commercializing_invention', 'university_ip', 'tto_engaged', 'ip_concerns']} 
                  />
                )}
                {selectedProfile.impact_scale && (
                  <ProfileDetailCard 
                    title="Vision & Impact" 
                    profile={selectedProfile} 
                    fields={['success_vision_1yr', 'success_vision_10yr', 'impact_scale', 'industry_changing_vision']} 
                  />
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ProfileDetailCardProps {
  title: string;
  profile: SprintProfile;
  fields: string[];
}

const ProfileDetailCard: React.FC<ProfileDetailCardProps> = ({ title, profile, fields }) => {
  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <div className="space-y-2">
        {fields.map((field) => {
          // Skip if the field doesn't exist in the profile
          if (!(field in profile)) return null;
          
          let value = profile[field];
          
          // Format boolean values
          if (typeof value === 'boolean') {
            value = value ? 'Yes' : 'No';
          }
          
          // Format array values
          if (Array.isArray(value)) {
            value = value.join(', ');
          }
          
          // Format date values
          if (field === 'created_at' && value) {
            value = new Date(value).toLocaleString();
          }
          
          // Skip null or undefined values
          if (value === null || value === undefined) return null;
          
          return (
            <div key={field} className="grid grid-cols-2">
              <span className="text-sm text-muted-foreground capitalize">
                {field.replace(/_/g, ' ')}:
              </span>
              <span className="text-sm font-medium">{value.toString()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SprintProfilesTab;
