
import { TeamMember } from "../team-members/types";

// Define step contexts to be used for displaying the right profile info
export type StepContext = 'company_reason' | 'incorporation' | 'team';

export interface EnhancedStep {
  type: string;
  context?: StepContext;
  content?: React.ReactNode[];
  label?: string;
  question?: string;
  validate?: () => boolean;
}

export interface UseTeamStepBuilderProps {
  teamStatus: string | undefined;
  isIncorporated: boolean;
  teamMembers: TeamMember[];
  neededSkills: string;
  uploadedFileId?: string;
  hiringPlanStep: 'download' | 'upload';
  companyReasons: string[];
  
  // Incorporation data
  companyFormationDate: string;
  companyFormationLocation: string;
  plannedFormationDate: string;
  plannedFormationLocation: string;
  formationLocationReason: string;
  
  // Equity data
  equityAgreed: boolean | null;
  equitySplit: string;
  equityConcerns: string;
  
  // Handlers
  onTeamMemberAdd: () => void;
  onTeamMemberRemove: (index: number) => void;
  onTeamMemberUpdate: (index: number, field: keyof TeamMember, value: string) => void;
  onSkillsChange: (skills: string) => void;
  onFileUpload: (fileId: string) => void;
  onHiringPlanStepChange: (step: 'download' | 'upload') => void;
  onCompanyReasonsChange: (reasons: string[]) => void;
  
  // Incorporation data handlers
  onCompanyFormationDateChange: (value: string) => void;
  onCompanyFormationLocationChange: (value: string) => void;
  onPlannedFormationDateChange: (value: string) => void;
  onPlannedFormationLocationChange: (value: string) => void;
  onFormationLocationReasonChange: (value: string) => void;
  
  // Equity data handlers
  onEquityAgreedChange: (value: boolean | null) => void;
  onEquitySplitChange: (value: string) => void;
  onEquityConcernsChange: (value: string) => void;
}
