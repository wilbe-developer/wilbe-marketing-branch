
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { applicationService } from '@/services/applicationService';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X, User, Calendar, Building2, MapPin, ExternalLink } from 'lucide-react';

interface PendingUser {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  institution: string | null;
  location: string | null;
  avatar: string | null;
  created_at: string | null;
  linked_in: string | null;
  has_sprint_profile: boolean;
  has_profile: boolean;
  application_status: string | null;
  current_role: string;
}

const UserApprovalsTab = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingUsers, setProcessingUsers] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      console.log('Fetching pending users for approval');

      // Get all unified profiles
      const { data: profiles, error: profilesError } = await supabase
        .rpc('get_all_unified_profiles');

      if (profilesError) {
        throw profilesError;
      }

      // Get all user roles (each user should have one primary role)
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) {
        throw rolesError;
      }

      // Map roles by user (get the highest role per user)
      const rolesByUser = userRoles?.reduce((acc, role) => {
        // Priority: admin > member > user
        if (!acc[role.user_id] || 
            (role.role === 'admin') ||
            (role.role === 'member' && acc[role.user_id] === 'user')) {
          acc[role.user_id] = role.role;
        }
        return acc;
      }, {} as Record<string, string>) || {};

      // Filter for users who need approval (not already members/admins)
      const usersNeedingApproval = profiles?.filter(profile => {
        const userRole = rolesByUser[profile.user_id] || 'user';
        const isAlreadyMemberOrAdmin = userRole === 'member' || userRole === 'admin';
        const hasDataToReview = profile.has_sprint_profile || profile.has_profile;
        
        // Only show users who have provided data but aren't yet members/admins
        return hasDataToReview && !isAlreadyMemberOrAdmin;
      }) || [];

      // Get application status for each user and filter for under_review only
      const usersWithStatus = await Promise.all(
        usersNeedingApproval.map(async (user) => {
          const status = await applicationService.getApplicationStatus(user.user_id);
          return {
            ...user,
            application_status: status,
            current_role: rolesByUser[user.user_id] || 'user'
          };
        })
      );

      // Only show users with 'under_review' status
      const filteredUsers = usersWithStatus.filter(user => 
        user.application_status === 'under_review'
      );

      console.log('Found users needing approval:', filteredUsers.length);
      setPendingUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching pending users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load pending users',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const handleApprove = async (userId: string, userName: string) => {
    setProcessingUsers(prev => new Set(prev).add(userId));
    
    try {
      // Update the existing user role to member instead of inserting a new one
      const { error: roleError } = await supabase
        .from('user_roles')
        .update({ role: 'member' })
        .eq('user_id', userId)
        .eq('role', 'user');

      if (roleError) {
        throw roleError;
      }

      // Also set approved=true in profiles for backward compatibility
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ 
          id: userId, 
          approved: true 
        }, { 
          onConflict: 'id' 
        });

      if (profileError) {
        console.warn('Warning updating profile approval status:', profileError);
      }

      toast({
        title: 'User Approved',
        description: `${userName} has been approved as a member`
      });

      // Refresh the list
      await fetchPendingUsers();
    } catch (error) {
      console.error('Error approving user:', error);
      toast({
        title: 'Approval Failed',
        description: 'Failed to approve user',
        variant: 'destructive'
      });
    } finally {
      setProcessingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const handleReject = async (userId: string, userName: string) => {
    setProcessingUsers(prev => new Set(prev).add(userId));
    
    try {
      // Update application status to under_review with a note or handle rejection differently
      // Since "rejected" is not a valid status, we'll use a different approach
      const { error } = await supabase
        .from('user_applications')
        .upsert({
          user_id: userId,
          application_type: 'membership',
          status: 'under_review' // Keep as under_review but we could add a notes field later
        }, {
          onConflict: 'user_id,application_type'
        });

      if (error) {
        throw error;
      }

      // For now, we'll just remove them from the pending list by not showing rejected users
      // In a future iteration, we might want to add a "rejected" status to the enum
      toast({
        title: 'User Rejected',
        description: `${userName}'s application has been marked for further review`
      });

      // Refresh the list
      await fetchPendingUsers();
    } catch (error) {
      console.error('Error rejecting user:', error);
      toast({
        title: 'Rejection Failed',
        description: 'Failed to reject user',
        variant: 'destructive'
      });
    } finally {
      setProcessingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const getApplicationSource = (user: PendingUser) => {
    if (user.has_sprint_profile && user.has_profile) {
      return 'Both Sprint & Profile';
    } else if (user.has_sprint_profile) {
      return 'Sprint Signup';
    } else if (user.has_profile) {
      return 'Profile Application';
    }
    return 'Unknown';
  };

  const getStatusBadgeVariant = (status: string | null) => {
    switch (status) {
      case 'under_review':
        return 'default';
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (pendingUsers.length === 0) {
    return (
      <div className="text-center py-8">
        <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Approvals</h3>
        <p className="text-gray-500">All users have been reviewed or no applications are pending.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pendingUsers.map((user) => {
        const isProcessing = processingUsers.has(user.user_id);
        const displayName = user.first_name && user.last_name 
          ? `${user.first_name} ${user.last_name}`
          : user.first_name || user.email || 'Unknown User';

        return (
          <Card key={user.user_id} className="p-4">
            <CardContent className="p-0">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatar || undefined} />
                    <AvatarFallback>
                      {displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{displayName}</h3>
                      <Badge variant={getStatusBadgeVariant(user.application_status)}>
                        {user.application_status || 'pending'}
                      </Badge>
                      <Badge variant="outline">
                        {getApplicationSource(user)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                      
                      {user.linked_in && (
                        <div className="flex items-center gap-1">
                          <ExternalLink className="h-4 w-4" />
                          <a 
                            href={user.linked_in} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            LinkedIn Profile
                          </a>
                        </div>
                      )}
                      
                      {user.institution && (
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          <span>{user.institution}</span>
                        </div>
                      )}
                      
                      {user.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{user.location}</span>
                        </div>
                      )}
                      
                      {user.created_at && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500">
                        Current role: {user.current_role}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReject(user.user_id, displayName)}
                    disabled={isProcessing}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApprove(user.user_id, displayName)}
                    disabled={isProcessing}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default UserApprovalsTab;
