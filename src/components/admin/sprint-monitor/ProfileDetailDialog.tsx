
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import ProfileDetailCard from './ProfileDetailCard';
import type { SprintProfile } from './ProfileDetailCard';

interface ProfileDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: SprintProfile | null;
}

const ProfileDetailDialog: React.FC<ProfileDetailDialogProps> = ({ 
  open, 
  onOpenChange, 
  profile 
}) => {
  if (!profile) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Complete Profile Details</DialogTitle>
          <DialogDescription>
            View detailed information about this sprint profile
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Information - Full width on all screens */}
            <div className="md:col-span-2">
              <ProfileDetailCard 
                title="User Information" 
                profile={profile} 
                fields={[
                  {key: 'name', label: 'Name'},
                  {key: 'email', label: 'Email'},
                  {key: 'linkedin_url', label: 'LinkedIn URL'},
                  {key: 'current_job', label: 'Current Job'},
                  {key: 'created_at', label: 'Created At'}
                ]} 
              />
            </div>
            
            {/* Access Control */}
            <ProfileDetailCard 
              title="Access Control" 
              profile={profile} 
              fields={[
                {key: 'dashboard_access_enabled', label: 'Dashboard Access Enabled'}
              ]} 
            />
            
            {/* Team & Company Status */}
            <ProfileDetailCard 
              title="Team & Company" 
              profile={profile} 
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
              profile={profile} 
              fields={[
                {key: 'market_known', label: 'Market Known'},
                {key: 'experiment_validated', label: 'Experiment Validated'},
                {key: 'customer_engagement', label: 'Customer Engagement'},
                {key: 'competition_research', label: 'Competition Research'}
              ]} 
            />
            
            {/* Customer Information */}
            {(profile.potential_beneficiaries !== undefined || 
              profile.specific_customers !== undefined || 
              profile.customer_evidence !== undefined) && (
              <ProfileDetailCard 
                title="Customer Information" 
                profile={profile} 
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
              profile={profile} 
              fields={[
                {key: 'job_type', label: 'Job Type'},
                {key: 'is_scientist_engineer', label: 'Is Scientist/Engineer'}
              ]} 
            />
            
            {/* Vision & Impact */}
            {(profile.success_vision_1yr !== undefined || 
              profile.success_vision_10yr !== undefined || 
              profile.impact_scale !== undefined || 
              profile.minimal_success_version !== undefined) && (
              <ProfileDetailCard 
                title="Vision & Impact" 
                profile={profile} 
                fields={[
                  {key: 'success_vision_1yr', label: 'Success Vision (1yr)'},
                  {key: 'success_vision_10yr', label: 'Success Vision (10yr)'},
                  {key: 'impact_scale', label: 'Impact Scale'},
                  {key: 'minimal_success_version', label: 'Minimal Success Version'}
                ]} 
              />
            )}
            
            {/* Accelerator Experience */}
            {(profile.prior_accelerators !== undefined || 
              profile.planned_accelerators !== undefined) && (
              <ProfileDetailCard 
                title="Accelerator Experience" 
                profile={profile} 
                fields={[
                  {key: 'prior_accelerators', label: 'Prior Accelerators'},
                  {key: 'prior_accelerators_details', label: 'Prior Accelerators Details'},
                  {key: 'planned_accelerators', label: 'Planned Accelerators'},
                  {key: 'planned_accelerators_details', label: 'Planned Accelerators Details'}
                ]} 
              />
            )}
            
            {/* Lab Space */}
            {(profile.lab_space_needed !== undefined || 
              profile.lab_space_secured !== undefined) && (
              <ProfileDetailCard 
                title="Lab Space" 
                profile={profile} 
                fields={[
                  {key: 'lab_space_needed', label: 'Lab Space Needed'},
                  {key: 'lab_space_secured', label: 'Lab Space Secured'},
                  {key: 'lab_space_details', label: 'Lab Space Details'}
                ]} 
              />
            )}
            
            {/* IP Concerns */}
            {profile.ip_concerns !== undefined && (
              <ProfileDetailCard 
                title="IP & Legal" 
                profile={profile} 
                fields={[
                  {key: 'ip_concerns', label: 'IP Concerns'},
                  {key: 'commercializing_invention', label: 'Commercializing Invention'},
                  {key: 'university_ip', label: 'University IP'}
                ]} 
              />
            )}
            
            {/* Pitch Deck */}
            {profile.deck_feedback !== undefined && (
              <ProfileDetailCard 
                title="Pitch Deck" 
                profile={profile} 
                fields={[
                  {key: 'has_deck', label: 'Has Deck'},
                  {key: 'deck_feedback', label: 'Deck Feedback'}
                ]} 
              />
            )}
            
            {/* UTM Data */}
            <ProfileDetailCard 
              title="UTM Data" 
              profile={profile} 
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
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDetailDialog;
