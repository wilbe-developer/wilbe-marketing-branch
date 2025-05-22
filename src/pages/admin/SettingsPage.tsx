
import React from 'react';
import FullScreenAdminLayout from '@/components/admin/FullScreenAdminLayout';
import AdminSettings from '@/components/admin/AdminSettings';

const SettingsPage = () => {
  return (
    <FullScreenAdminLayout title="Admin Settings">
      <AdminSettings />
    </FullScreenAdminLayout>
  );
};

export default SettingsPage;
