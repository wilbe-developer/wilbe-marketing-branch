
import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  BarChart2, 
  ArrowLeft, 
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FullScreenAdminLayoutProps {
  children: ReactNode;
  title?: string;
}

const FullScreenAdminLayout = ({ children, title = 'Admin' }: FullScreenAdminLayoutProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Admin navigation items
  const navItems = [
    { 
      path: '/admin/dashboard', 
      label: 'Dashboard', 
      icon: <LayoutDashboard size={20} /> 
    },
    { 
      path: '/admin/users', 
      label: 'Users', 
      icon: <Users size={20} /> 
    },
    { 
      path: '/admin/approvals', 
      label: 'User Approvals', 
      icon: <UserCheck size={20} /> 
    },
    { 
      path: '/admin/roles', 
      label: 'Role Management', 
      icon: <Settings size={20} /> 
    },
    { 
      path: '/admin/sprint-monitor', 
      label: 'Sprint Monitor', 
      icon: <BarChart2 size={20} /> 
    },
    { 
      path: '/admin/task-builder', 
      label: 'Task Builder', 
      icon: <FileText size={20} /> 
    },
    { 
      path: '/admin/utm-analytics', 
      label: 'UTM Analytics', 
      icon: <TrendingUp size={20} /> 
    },
    { 
      path: '/admin/settings', 
      label: 'Settings', 
      icon: <Settings size={20} /> 
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm hidden md:block">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        <div className="py-4">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-2 py-2 text-sm font-medium rounded-md group",
                  currentPath === item.path
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <span className="mr-3 text-gray-500">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t mt-auto">
          <Link
            to="/"
            className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
          >
            <ArrowLeft size={20} className="mr-3" />
            Back to App
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default FullScreenAdminLayout;
