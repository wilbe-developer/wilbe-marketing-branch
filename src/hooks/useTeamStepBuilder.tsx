
import { EnhancedStep, StepContext } from "./team-step-builder/types";
import { getCompanySteps } from "./team-step-builder/company-steps";
import { getIncorporationSteps } from "./team-step-builder/incorporation-steps";
import { getTeamSteps } from "./team-step-builder/team-steps";

export type { StepContext } from "./team-step-builder/types";

export const useTeamStepBuilder = (props: any): EnhancedStep[] => {
  // Get all steps from the different modules
  const companySteps = getCompanySteps(
    props.companyReasons,
    props.onCompanyReasonsChange
  );
  
  const incorporationSteps = getIncorporationSteps(
    props.isIncorporated,
    props.companyFormationDate,
    props.companyFormationLocation,
    props.plannedFormationDate,
    props.plannedFormationLocation,
    props.formationLocationReason,
    props.equityAgreed,
    props.equitySplit,
    props.equityConcerns,
    props.onCompanyFormationDateChange,
    props.onCompanyFormationLocationChange,
    props.onPlannedFormationDateChange,
    props.onPlannedFormationLocationChange,
    props.onFormationLocationReasonChange,
    props.onEquityAgreedChange,
    props.onEquitySplitChange,
    props.onEquityConcernsChange
  );
  
  const teamSteps = getTeamSteps(
    props.teamStatus,
    props.teamMembers,
    props.neededSkills,
    props.uploadedFileId,
    props.hiringPlanStep,
    props.onTeamMemberAdd,
    props.onTeamMemberRemove,
    props.onTeamMemberUpdate,
    props.onSkillsChange,
    props.onFileUpload,
    props.onHiringPlanStepChange
  );
  
  // Combine all steps in the desired order
  return [
    ...companySteps,
    ...incorporationSteps,
    ...teamSteps
  ];
};
