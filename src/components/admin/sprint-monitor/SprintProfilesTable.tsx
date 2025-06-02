
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SprintProfile } from './ProfileDetailCard';

interface SprintProfilesTableProps {
  profiles: SprintProfile[];
  onViewProfile: (profile: SprintProfile) => void;
  adminUserIds: string[];
}

const SprintProfilesTable: React.FC<SprintProfilesTableProps> = ({ 
  profiles, 
  onViewProfile,
  adminUserIds 
}) => {
  const [updatingAccess, setUpdatingAccess] = useState<string | null>(null);

  const handleToggleDashboardAccess = async (profile: SprintProfile) => {
    setUpdatingAccess(profile.id);
    
    try {
      const newAccessStatus = !profile.dashboard_access_enabled;
      
      const { error } = await supabase
        .from('sprint_profiles')
        .update({ dashboard_access_enabled: newAccessStatus })
        .eq('id', profile.id);

      if (error) throw error;

      // Update the profile in the local state
      profile.dashboard_access_enabled = newAccessStatus;
      
      toast.success(
        `Dashboard access ${newAccessStatus ? 'enabled' : 'disabled'} for ${profile.name}`
      );
      
      // Refresh the page data to show updated status
      window.location.reload();
      
    } catch (error: any) {
      console.error('Error updating dashboard access:', error);
      toast.error('Failed to update dashboard access');
    } finally {
      setUpdatingAccess(null);
    }
  };

  const isAdmin = (userId: string) => adminUserIds.includes(userId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="text-left p-3 font-medium">Name & Email</th>
              <th className="text-left p-3 font-medium">Team Status</th>
              <th className="text-left p-3 font-medium">Company</th>
              <th className="text-left p-3 font-medium">Market Known</th>
              <th className="text-left p-3 font-medium">Dashboard Access</th>
              <th className="text-left p-3 font-medium">Source</th>
              <th className="text-left p-3 font-medium">Created</th>
              <th className="text-left p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((profile) => (
              <tr key={profile.id} className="border-b hover:bg-muted/30">
                <td className="p-3">
                  <div className="space-y-1">
                    <div className="font-medium flex items-center gap-2">
                      {profile.name}
                      {isAdmin(profile.user_id) && (
                        <Badge variant="secondary" className="text-xs">
                          Admin
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground break-all">
                      {profile.email}
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  <Badge variant="outline" className="text-xs">
                    {profile.team_status || 'N/A'}
                  </Badge>
                </td>
                <td className="p-3">
                  <Badge 
                    variant={profile.company_incorporated ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {profile.company_incorporated ? 'Incorporated' : 'Not Incorporated'}
                  </Badge>
                </td>
                <td className="p-3">
                  <Badge 
                    variant={profile.market_known ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {profile.market_known ? 'Yes' : 'No'}
                  </Badge>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleDashboardAccess(profile)}
                      disabled={updatingAccess === profile.id}
                      className="h-8 w-8 p-0"
                    >
                      {profile.dashboard_access_enabled ? (
                        <ToggleRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ToggleLeft className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                    <Badge 
                      variant={profile.dashboard_access_enabled ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {profile.dashboard_access_enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                </td>
                <td className="p-3">
                  <Badge variant="outline" className="text-xs">
                    {profile.utm_source || 'Direct'}
                  </Badge>
                </td>
                <td className="p-3 text-xs text-muted-foreground">
                  {formatDate(profile.created_at)}
                </td>
                <td className="p-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewProfile(profile)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SprintProfilesTable;
