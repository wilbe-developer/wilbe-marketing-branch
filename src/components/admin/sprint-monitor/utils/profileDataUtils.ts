
import { useAdminFilter } from '@/hooks/admin/useAdminFilter';

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

// Helper function to filter out admin profiles
const filterAdminProfiles = (profiles: SprintProfile[], adminUserIds: string[]) => {
  return profiles.filter(profile => !adminUserIds.includes(profile.user_id));
};

export const prepareTeamStatusData = (profiles: SprintProfile[], adminUserIds: string[] = []) => {
  // Filter out admin profiles for statistics
  const filteredProfiles = filterAdminProfiles(profiles, adminUserIds);
  
  const counts: Record<string, number> = {};
  filteredProfiles.forEach(profile => {
    const status = profile.team_status || 'Not specified';
    counts[status] = (counts[status] || 0) + 1;
  });
  
  return Object.keys(counts).map(key => ({
    name: key,
    value: counts[key]
  }));
};

export const prepareIncorporatedData = (profiles: SprintProfile[], adminUserIds: string[] = []) => {
  // Filter out admin profiles for statistics
  const filteredProfiles = filterAdminProfiles(profiles, adminUserIds);
  
  let incorporated = 0;
  let notIncorporated = 0;
  
  filteredProfiles.forEach(profile => {
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

export const prepareFundingData = (profiles: SprintProfile[], adminUserIds: string[] = []) => {
  // Filter out admin profiles for statistics
  const filteredProfiles = filterAdminProfiles(profiles, adminUserIds);
  
  let received = 0;
  let notReceived = 0;
  
  filteredProfiles.forEach(profile => {
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

export const prepareMarketData = (profiles: SprintProfile[], adminUserIds: string[] = []) => {
  // Filter out admin profiles for statistics
  const filteredProfiles = filterAdminProfiles(profiles, adminUserIds);
  
  let known = 0;
  let unknown = 0;
  
  filteredProfiles.forEach(profile => {
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

export const prepareExperimentData = (profiles: SprintProfile[], adminUserIds: string[] = []) => {
  // Filter out admin profiles for statistics
  const filteredProfiles = filterAdminProfiles(profiles, adminUserIds);
  
  let validated = 0;
  let notValidated = 0;
  
  filteredProfiles.forEach(profile => {
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

export const prepareJobTypeData = (profiles: SprintProfile[], adminUserIds: string[] = []) => {
  // Filter out admin profiles for statistics
  const filteredProfiles = filterAdminProfiles(profiles, adminUserIds);
  
  const counts: Record<string, number> = {};
  filteredProfiles.forEach(profile => {
    const jobType = profile.job_type || 'Not specified';
    counts[jobType] = (counts[jobType] || 0) + 1;
  });
  
  return Object.keys(counts).map(key => ({
    name: key,
    value: counts[key]
  }));
};

export const prepareScientistData = (profiles: SprintProfile[], adminUserIds: string[] = []) => {
  // Filter out admin profiles for statistics
  const filteredProfiles = filterAdminProfiles(profiles, adminUserIds);
  
  let isScientist = 0;
  let notScientist = 0;
  
  filteredProfiles.forEach(profile => {
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

export const prepareSourceData = (profiles: SprintProfile[], adminUserIds: string[] = []) => {
  // Filter out admin profiles for statistics
  const filteredProfiles = filterAdminProfiles(profiles, adminUserIds);
  
  const counts: Record<string, number> = {};
  filteredProfiles.forEach(profile => {
    const source = profile.utm_source || 'direct';
    counts[source] = (counts[source] || 0) + 1;
  });
  
  return Object.keys(counts).map(key => ({
    name: key,
    value: counts[key]
  }));
};
