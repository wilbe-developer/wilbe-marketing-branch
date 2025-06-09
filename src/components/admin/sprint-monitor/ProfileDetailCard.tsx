import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export interface SprintProfile {
  id: string;
  user_id: string;
  name?: string | null;
  email?: string | null;
  created_at: string;
  updated_at: string;
  linkedin_url?: string | null;
  current_job?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  experiment_validated?: string | null; // Changed from boolean to string
  company_incorporated?: boolean | null;
  received_funding?: boolean | null;
  has_deck?: boolean | null;
  team_status?: string | null;
  commercializing_invention?: boolean | null;
  university_ip?: boolean | null;
  tto_engaged?: boolean | null;
  problem_defined?: boolean | null;
  customer_engagement?: string | null;
  market_known?: boolean | null;
  market_gap_reason?: string | null;
  funding_amount?: string | null;
  has_financial_plan?: boolean | null;
  funding_sources?: string[] | null;
  industry_changing_vision?: boolean | null;
  is_scientist_engineer?: boolean | null;
  job_type?: string | null;
  ip_concerns?: boolean | null;
  potential_beneficiaries?: boolean | null;
  specific_customers?: boolean | null;
  customer_evidence?: boolean | null;
  competition_research?: boolean | null;
  success_vision_1yr?: boolean | null;
  success_vision_10yr?: boolean | null;
  impact_scale?: string[] | null;
  prior_accelerators?: boolean | null;
  prior_accelerators_details?: string | null;
  planned_accelerators?: boolean | null;
  planned_accelerators_details?: string | null;
  lab_space_needed?: boolean | null;
  lab_space_secured?: boolean | null;
  lab_space_details?: string | null;
  deck_feedback?: boolean | null;
  minimal_success_version?: string | null;
  ambitious_version?: string | null;
  cv_url?: string | null;
  funding_details?: string | null;
  dashboard_access_enabled?: boolean | null;
  data_room_public?: boolean | null;
  sprint_start_date?: string | null;
}

interface ProfileDetailCardProps {
  profile: SprintProfile | null;
}

const ProfileDetailCard: React.FC<ProfileDetailCardProps> = ({ profile }) => {
  if (!profile) {
    return <p>No profile selected.</p>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>BSF Profile Details</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium">Name</p>
          <p>{profile.name || 'N/A'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Email</p>
          <p>{profile.email || 'N/A'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">LinkedIn</p>
          <p>
            {profile.linkedin_url ? (
              <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {profile.linkedin_url}
              </a>
            ) : 'N/A'}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Current Job</p>
          <p>{profile.current_job || 'N/A'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Created At</p>
          <p>{format(new Date(profile.created_at), 'PPP p')}</p>
        </div>
        {profile.sprint_start_date && (
          <div className="space-y-1">
            <p className="text-sm font-medium">Sprint Start Date</p>
            <p>{format(new Date(profile.sprint_start_date), 'PPP')}</p>
          </div>
        )}
        <div className="space-y-1">
          <p className="text-sm font-medium">Experiment Validated</p>
          <p>{profile.experiment_validated || 'N/A'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Dashboard Access</p>
          <Badge variant={profile.dashboard_access_enabled ? "success" : "destructive"}>
            {profile.dashboard_access_enabled ? "Enabled" : "Disabled"}
          </Badge>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Data Room Public</p>
          <Badge variant={profile.data_room_public ? "success" : "destructive"}>
            {profile.data_room_public ? "Public" : "Private"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileDetailCard;
