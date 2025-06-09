
import { SprintProfile } from '../ProfileDetailCard';

export const prepareTeamStatusData = (profiles: SprintProfile[], adminUserIds: string[]) => {
  const nonAdminProfiles = profiles.filter(profile => !adminUserIds.includes(profile.user_id));
  
  const teamStatusCounts = nonAdminProfiles.reduce((acc: Record<string, number>, profile) => {
    const status = profile.team_status || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(teamStatusCounts).map(([name, value]) => ({ name, value }));
};

export const prepareIncorporatedData = (profiles: SprintProfile[], adminUserIds: string[]) => {
  const nonAdminProfiles = profiles.filter(profile => !adminUserIds.includes(profile.user_id));
  
  const incorporatedCounts = nonAdminProfiles.reduce((acc: Record<string, number>, profile) => {
    const status = profile.company_incorporated ? 'Yes' : 'No';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(incorporatedCounts).map(([name, value]) => ({ name, value }));
};

export const prepareFundingData = (profiles: SprintProfile[], adminUserIds: string[]) => {
  const nonAdminProfiles = profiles.filter(profile => !adminUserIds.includes(profile.user_id));
  
  const fundingCounts = nonAdminProfiles.reduce((acc: Record<string, number>, profile) => {
    const status = profile.received_funding ? 'Yes' : 'No';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(fundingCounts).map(([name, value]) => ({ name, value }));
};

export const prepareMarketData = (profiles: SprintProfile[], adminUserIds: string[]) => {
  const nonAdminProfiles = profiles.filter(profile => !adminUserIds.includes(profile.user_id));
  
  const marketCounts = nonAdminProfiles.reduce((acc: Record<string, number>, profile) => {
    const status = profile.market_known ? 'Yes' : 'No';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(marketCounts).map(([name, value]) => ({ name, value }));
};

export const prepareExperimentData = (profiles: SprintProfile[], adminUserIds: string[]) => {
  const nonAdminProfiles = profiles.filter(profile => !adminUserIds.includes(profile.user_id));
  
  const experimentCounts = nonAdminProfiles.reduce((acc: Record<string, number>, profile) => {
    // Handle string values for experiment_validated
    const status = profile.experiment_validated || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(experimentCounts).map(([name, value]) => ({ name, value }));
};

export const prepareJobTypeData = (profiles: SprintProfile[], adminUserIds: string[]) => {
  const nonAdminProfiles = profiles.filter(profile => !adminUserIds.includes(profile.user_id));
  
  const jobTypeCounts = nonAdminProfiles.reduce((acc: Record<string, number>, profile) => {
    const jobType = profile.job_type || 'Unknown';
    acc[jobType] = (acc[jobType] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(jobTypeCounts).map(([name, value]) => ({ name, value }));
};

export const prepareScientistData = (profiles: SprintProfile[], adminUserIds: string[]) => {
  const nonAdminProfiles = profiles.filter(profile => !adminUserIds.includes(profile.user_id));
  
  const scientistCounts = nonAdminProfiles.reduce((acc: Record<string, number>, profile) => {
    const status = profile.is_scientist_engineer ? 'Yes' : 'No';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(scientistCounts).map(([name, value]) => ({ name, value }));
};

export const prepareSourceData = (profiles: SprintProfile[], adminUserIds: string[]) => {
  const nonAdminProfiles = profiles.filter(profile => !adminUserIds.includes(profile.user_id));
  
  const sourceCounts = nonAdminProfiles.reduce((acc: Record<string, number>, profile) => {
    const source = profile.utm_source || 'Direct';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(sourceCounts).map(([name, value]) => ({ name, value }));
};
