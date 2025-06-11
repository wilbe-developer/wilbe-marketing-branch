
import React from 'react';
import { Linkedin, Mail } from 'lucide-react';

interface ProfileField {
  key: string;
  label: string;
}

export interface SprintProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  team_status: string;
  company_incorporated: boolean;
  received_funding: boolean;
  created_at: string;
  market_known: boolean;
  experiment_validated: string; // Changed from boolean to string
  job_type: string;
  is_scientist_engineer: boolean;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  dashboard_access_enabled?: boolean;
  // Extended fields
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
  minimal_success_version?: string;
  ambitious_version?: string;
  [key: string]: any; // For any other properties in the profile
}

interface ProfileDetailCardProps {
  title: string;
  profile: SprintProfile;
  fields: ProfileField[];
}

const ProfileDetailCard: React.FC<ProfileDetailCardProps> = ({ title, profile, fields }) => {
  // Helper function to format field values for display
  const formatFieldValue = (key: string, value: any): React.ReactNode => {
    // Skip if the value is null or undefined
    if (value === null || value === undefined) return 'N/A';
    
    // Format email with a mail icon and link
    if (key === 'email' && value) {
      return (
        <div className="flex items-center space-x-1 break-all">
          <Mail size={14} className="text-muted-foreground shrink-0" />
          <a 
            href={`mailto:${value}`} 
            className="text-blue-500 hover:underline"
            title={value}
          >
            {value}
          </a>
        </div>
      );
    }
    
    // Format LinkedIn URL with an icon and link
    if (key === 'linkedin_url' && value) {
      return (
        <div className="flex items-center space-x-1 break-all">
          <Linkedin size={14} className="text-muted-foreground shrink-0" />
          <a 
            href={value.startsWith('http') ? value : `https://${value}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
            title={value}
          >
            {value}
          </a>
        </div>
      );
    }
    
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
    
    // Format long text values (like minimal_success_version)
    if (key === 'minimal_success_version' && value) {
      return (
        <div className="text-sm whitespace-pre-wrap break-words max-w-prose">
          {value}
        </div>
      );
    }
    
    // Return string value
    return String(value);
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
            <div key={field.key} className="grid grid-cols-[1fr,2fr]">
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

export default ProfileDetailCard;
