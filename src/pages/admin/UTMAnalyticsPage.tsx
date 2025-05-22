
import React from 'react';
import FullScreenAdminLayout from '@/components/admin/FullScreenAdminLayout';
import UTMAnalytics from '@/components/admin/sprint-activity/UTMAnalytics';

const UTMAnalyticsPage = () => {
  return (
    <FullScreenAdminLayout title="UTM Analytics">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">UTM Analytics</h1>
        <p className="text-gray-500 mt-2">Track and analyze marketing campaign performance</p>
      </div>
      
      <UTMAnalytics />
    </FullScreenAdminLayout>
  );
};

export default UTMAnalyticsPage;
