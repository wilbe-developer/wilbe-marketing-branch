
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  // New fields
  ip_concerns?: boolean;
  potential_beneficiaries?: boolean;
  specific_customers?: boolean;
  customer_evidence?: boolean;
  competition_research?: boolean;
  success_vision_1yr?: boolean;
  success_vision_10yr?: boolean;
  impact_scale?: string[];
  prior_accelerators?: boolean;
  prior_accelerators_details?: string;
  planned_accelerators?: boolean;
  planned_accelerators_details?: string;
  lab_space_needed?: boolean;
  lab_space_secured?: boolean;
  lab_space_details?: string;
  deck_feedback?: boolean;
  has_deck?: boolean;
  linkedin_url?: string;
  current_job?: string;
  customer_engagement?: string;
  [key: string]: any; // For any other properties in the profile
}

const SprintProfilesTab = () => {
  const [filterType, setFilterType] = useState<'team' | 'market' | 'background'>('team');
  const [selectedProfile, setSelectedProfile] = useState<SprintProfile | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
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
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Complete Profile Details</DialogTitle>
          </DialogHeader>
          {selectedProfile && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <ProfileDetailCard 
                  title="User Information" 
                  profile={selectedProfile} 
                  fields={[
                    {key: 'name', label: 'Name'},
                    {key: 'email', label: 'Email'},
                    {key: 'created_at', label: 'Created At'},
                    {key: 'linkedin_url', label: 'LinkedIn URL'},
                    {key: 'current_job', label: 'Current Job'}
                  ]} 
                />
                
                {/* Team & Company Status */}
                <ProfileDetailCard 
                  title="Team & Company" 
                  profile={selectedProfile} 
                  fields={[
                    {key: 'team_status', label: 'Team Status'},
                    {key: 'company_incorporated', label: 'Company Incorporated'},
                    {key: 'received_funding', label: 'Received Funding'},
                    {key: 'has_deck', label: 'Has Deck'}
                  ]} 
                />
                
                {/* Market & Validation */}
                <ProfileDetailCard 
                  title="Market & Validation" 
                  profile={selectedProfile} 
                  fields={[
                    {key: 'market_known', label: 'Market Known'},
                    {key: 'experiment_validated', label: 'Experiment Validated'},
                    {key: 'customer_engagement', label: 'Customer Engagement'},
                    {key: 'competition_research', label: 'Competition Research'}
                  ]} 
                />
                
                {/* Customer Information */}
                {(selectedProfile.potential_beneficiaries !== undefined || 
                  selectedProfile.specific_customers !== undefined || 
                  selectedProfile.customer_evidence !== undefined) && (
                  <ProfileDetailCard 
                    title="Customer Information" 
                    profile={selectedProfile} 
                    fields={[
                      {key: 'potential_beneficiaries', label: 'Potential Beneficiaries'},
                      {key: 'specific_customers', label: 'Specific Customers'},
                      {key: 'customer_evidence', label: 'Customer Evidence'}
                    ]} 
                  />
                )}
                
                {/* Background & Skills */}
                <ProfileDetailCard 
                  title="Background & Skills" 
                  profile={selectedProfile} 
                  fields={[
                    {key: 'job_type', label: 'Job Type'},
                    {key: 'is_scientist_engineer', label: 'Is Scientist/Engineer'}
                  ]} 
                />
                
                {/* Vision & Impact */}
                {(selectedProfile.success_vision_1yr !== undefined || 
                  selectedProfile.success_vision_10yr !== undefined || 
                  selectedProfile.impact_scale !== undefined) && (
                  <ProfileDetailCard 
                    title="Vision & Impact" 
                    profile={selectedProfile} 
                    fields={[
                      {key: 'success_vision_1yr', label: 'Success Vision (1yr)'},
                      {key: 'success_vision_10yr', label: 'Success Vision (10yr)'},
                      {key: 'impact_scale', label: 'Impact Scale'}
                    ]} 
                  />
                )}
                
                {/* Accelerator Experience */}
                {(selectedProfile.prior_accelerators !== undefined || 
                  selectedProfile.planned_accelerators !== undefined) && (
                  <ProfileDetailCard 
                    title="Accelerator Experience" 
                    profile={selectedProfile} 
                    fields={[
                      {key: 'prior_accelerators', label: 'Prior Accelerators'},
                      {key: 'prior_accelerators_details', label: 'Prior Accelerators Details'},
                      {key: 'planned_accelerators', label: 'Planned Accelerators'},
                      {key: 'planned_accelerators_details', label: 'Planned Accelerators Details'}
                    ]} 
                  />
                )}
                
                {/* Lab Space */}
                {(selectedProfile.lab_space_needed !== undefined || 
                  selectedProfile.lab_space_secured !== undefined) && (
                  <ProfileDetailCard 
                    title="Lab Space" 
                    profile={selectedProfile} 
                    fields={[
                      {key: 'lab_space_needed', label: 'Lab Space Needed'},
                      {key: 'lab_space_secured', label: 'Lab Space Secured'},
                      {key: 'lab_space_details', label: 'Lab Space Details'}
                    ]} 
                  />
                )}
                
                {/* IP Concerns */}
                {selectedProfile.ip_concerns !== undefined && (
                  <ProfileDetailCard 
                    title="IP & Legal" 
                    profile={selectedProfile} 
                    fields={[
                      {key: 'ip_concerns', label: 'IP Concerns'},
                      {key: 'commercializing_invention', label: 'Commercializing Invention'},
                      {key: 'university_ip', label: 'University IP'}
                    ]} 
                  />
                )}
                
                {/* Pitch Deck */}
                {selectedProfile.deck_feedback !== undefined && (
                  <ProfileDetailCard 
                    title="Pitch Deck" 
                    profile={selectedProfile} 
                    fields={[
                      {key: 'has_deck', label: 'Has Deck'},
                      {key: 'deck_feedback', label: 'Deck Feedback'}
                    ]} 
                  />
                )}
                
                {/* UTM Data */}
                <ProfileDetailCard 
                  title="UTM Data" 
                  profile={selectedProfile} 
                  fields={[
                    {key: 'utm_source', label: 'UTM Source'},
                    {key: 'utm_medium', label: 'UTM Medium'},
                    {key: 'utm_campaign', label: 'UTM Campaign'},
                    {key: 'utm_term', label: 'UTM Term'},
                    {key: 'utm_content', label: 'UTM Content'}
                  ]} 
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ProfileField {
  key: string;
  label: string;
}

interface ProfileDetailCardProps {
  title: string;
  profile: SprintProfile;
  fields: ProfileField[];
}

const ProfileDetailCard: React.FC<ProfileDetailCardProps> = ({ title, profile, fields }) => {
  // Helper function to format field values for display
  const formatFieldValue = (key: string, value: any): string => {
    // Skip if the value is null or undefined
    if (value === null || value === undefined) return 'N/A';
    
    // Format boolean values
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    // Format array values
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    
    // Format date values
    if (key === 'created_at' && value) {
      return new Date(value).toLocaleString();
    }
    
    // Return string value
    return value.toString();
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-card">
      <h3 className="font-semibold text-lg mb-3 border-b pb-2">{title}</h3>
      <div className="space-y-2">
        {fields.map((field) => {
          // Skip if the field doesn't exist in the profile
          if (!(field.key in profile)) return null;
          
          const value = profile[field.key];
          
          // Skip null or undefined values
          if (value === null || value === undefined) return null;
          
          return (
            <div key={field.key} className="grid grid-cols-2">
              <span className="text-sm font-medium text-muted-foreground">
                {field.label}:
              </span>
              <span className="text-sm">
                {formatFieldValue(field.key, value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SprintProfilesTab;
