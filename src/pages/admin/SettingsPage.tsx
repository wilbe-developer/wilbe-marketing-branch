
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the AdminSettingsPage component
    navigate('/admin/settings-page');
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-500">Redirecting to settings page...</p>
      </div>
    </div>
  );
};

export default SettingsPage;
