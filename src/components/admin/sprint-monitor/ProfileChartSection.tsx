
import React from 'react';
import ProfilePieChart from './charts/ProfilePieChart';
import ProfileBarChart from './charts/ProfileBarChart';

interface ChartData {
  [key: string]: { name: string; value: number }[];
}

interface ProfileChartSectionProps {
  chartData: ChartData;
  filterType: 'team' | 'market' | 'background';
}

const ProfileChartSection: React.FC<ProfileChartSectionProps> = ({ chartData, filterType }) => {
  if (filterType === 'team') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProfilePieChart title="Team Status" data={chartData.teamStatus} />
        <ProfilePieChart title="Company Incorporated" data={chartData.incorporated} />
        <ProfilePieChart title="Funding Status" data={chartData.funding} />
      </div>
    );
  } else if (filterType === 'market') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfilePieChart title="Market Known" data={chartData.marketKnown} />
        <ProfilePieChart title="Experiment Validated" data={chartData.experimentValidated} />
      </div>
    );
  } else {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProfileBarChart title="Job Type" data={chartData.jobType} />
        <ProfilePieChart title="Scientist/Engineer" data={chartData.scientist} />
        <ProfilePieChart title="Source" data={chartData.source} />
      </div>
    );
  }
};

export default ProfileChartSection;
