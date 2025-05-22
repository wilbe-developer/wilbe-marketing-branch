
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Home, Users, Settings, BarChart2, Database, Clock, FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/hooks/useAuth';

interface FullScreenAdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const FullScreenAdminLayout: React.FC<FullScreenAdminLayoutProps> = ({ children, title }) => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(true);

  // Check if user is admin, if not redirect to home
  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-gray-900 text-white ${expanded ? 'w-64' : 'w-16'} flex flex-col transition-all duration-300 ease-in-out`}>
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          {expanded && <h2 className="text-xl font-bold">Admin</h2>}
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-gray-800" 
            onClick={() => setExpanded(!expanded)}
          >
            <X size={18} />
          </Button>
        </div>
        
        <div className="p-4 flex-grow">
          <nav className="space-y-2">
            <TooltipProvider>
              <div className={`flex items-center p-2 rounded-md hover:bg-gray-800 transition-colors ${location.pathname.includes('/admin/dashboard') ? 'bg-gray-800' : ''}`}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/admin/dashboard" className="flex items-center">
                      <Home size={20} />
                      {expanded && <span className="ml-3">Dashboard</span>}
                    </Link>
                  </TooltipTrigger>
                  {!expanded && <TooltipContent side="right">Dashboard</TooltipContent>}
                </Tooltip>
              </div>
              
              <div className={`flex items-center p-2 rounded-md hover:bg-gray-800 transition-colors ${location.pathname.includes('/admin/users') ? 'bg-gray-800' : ''}`}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/admin/users" className="flex items-center">
                      <Users size={20} />
                      {expanded && <span className="ml-3">Users</span>}
                    </Link>
                  </TooltipTrigger>
                  {!expanded && <TooltipContent side="right">Users</TooltipContent>}
                </Tooltip>
              </div>
              
              <div className={`flex items-center p-2 rounded-md hover:bg-gray-800 transition-colors ${location.pathname.includes('/admin/sprint-monitor') ? 'bg-gray-800' : ''}`}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/admin/sprint-monitor" className="flex items-center">
                      <BarChart2 size={20} />
                      {expanded && <span className="ml-3">Sprint Monitor</span>}
                    </Link>
                  </TooltipTrigger>
                  {!expanded && <TooltipContent side="right">Sprint Monitor</TooltipContent>}
                </Tooltip>
              </div>
              
              <div className={`flex items-center p-2 rounded-md hover:bg-gray-800 transition-colors ${location.pathname.includes('/admin/data-explorer') ? 'bg-gray-800' : ''}`}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/admin/data-explorer" className="flex items-center">
                      <Database size={20} />
                      {expanded && <span className="ml-3">Data Explorer</span>}
                    </Link>
                  </TooltipTrigger>
                  {!expanded && <TooltipContent side="right">Data Explorer</TooltipContent>}
                </Tooltip>
              </div>
              
              <div className={`flex items-center p-2 rounded-md hover:bg-gray-800 transition-colors ${location.pathname.includes('/admin/activity') ? 'bg-gray-800' : ''}`}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/admin/activity" className="flex items-center">
                      <Clock size={20} />
                      {expanded && <span className="ml-3">Activity Log</span>}
                    </Link>
                  </TooltipTrigger>
                  {!expanded && <TooltipContent side="right">Activity Log</TooltipContent>}
                </Tooltip>
              </div>
              
              <div className={`flex items-center p-2 rounded-md hover:bg-gray-800 transition-colors ${location.pathname.includes('/admin/settings') ? 'bg-gray-800' : ''}`}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/admin/settings" className="flex items-center">
                      <Settings size={20} />
                      {expanded && <span className="ml-3">Settings</span>}
                    </Link>
                  </TooltipTrigger>
                  {!expanded && <TooltipContent side="right">Settings</TooltipContent>}
                </Tooltip>
              </div>
            </TooltipProvider>
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-800">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full flex items-center justify-center gap-2 text-white border-gray-700 hover:bg-gray-800"
            onClick={() => navigate('/')}
          >
            <ArrowLeft size={16} />
            {expanded && <span>Exit Admin</span>}
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-grow overflow-auto">
        <header className="bg-white shadow">
          <div className="px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Admin Control Panel</span>
            </div>
          </div>
        </header>
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default FullScreenAdminLayout;
