
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { UserProfile, ApprovalStatus } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import LoadingState from "../roles/LoadingState";
import EmptyState from "../roles/EmptyState";

const getInitials = (firstName: string, lastName: string, email: string) => {
  const firstInitial = firstName && firstName.trim() ? firstName.charAt(0).toUpperCase() : '';
  const lastInitial = lastName && lastName.trim() ? lastName.charAt(0).toUpperCase() : '';
  
  if (firstInitial && lastInitial) {
    return `${firstInitial}${lastInitial}`;
  } else if (firstInitial) {
    return firstInitial;
  } else if (lastInitial) {
    return lastInitial;
  } else {
    // Fallback to email if no names
    return email.charAt(0).toUpperCase() || 'U';
  }
};

const UserApprovalsTab = () => {
  const { toast } = useToast();
  const [pendingUsers, setPendingUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        // Get users who have 'user' role but not 'member' role (pending approval)
        const { data: usersWithUserRole, error: userRoleError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'user');

        if (userRoleError) throw userRoleError;

        const { data: usersWithMemberRole, error: memberRoleError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'member');

        if (memberRoleError) throw memberRoleError;

        const { data: usersWithAdminRole, error: adminRoleError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', 'admin');

        if (adminRoleError) throw adminRoleError;

        // Get user IDs that have 'user' role but not 'member' or 'admin' role
        const userRoleIds = new Set(usersWithUserRole?.map(ur => ur.user_id) || []);
        const memberRoleIds = new Set(usersWithMemberRole?.map(ur => ur.user_id) || []);
        const adminRoleIds = new Set(usersWithAdminRole?.map(ur => ur.user_id) || []);
        
        const pendingUserIds = Array.from(userRoleIds).filter(id => 
          !memberRoleIds.has(id) && !adminRoleIds.has(id)
        );

        console.log(`Found ${pendingUserIds.length} pending users for approval`);

        if (pendingUserIds.length === 0) {
          setPendingUsers([]);
          setLoading(false);
          return;
        }

        // Fetch profiles for pending users
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', pendingUserIds);

        if (profileError) {
          throw profileError;
        }

        if (profileData) {
          const userProfiles: UserProfile[] = profileData.map(profile => ({
            id: profile.id,
            firstName: profile.first_name || '',
            lastName: profile.last_name || '',
            email: profile.email || '',
            linkedIn: profile.linked_in,
            institution: profile.institution,
            location: profile.location,
            role: profile.role,
            bio: profile.bio,
            approved: false, // These are pending users
            createdAt: new Date(profile.created_at || Date.now()),
            avatar: profile.avatar
          }));
          setPendingUsers(userProfiles);
        }
      } catch (error) {
        console.error('Error fetching pending users:', error);
        toast({
          title: "Error",
          description: "Failed to fetch pending users",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPendingUsers();
  }, [toast]);

  const handleApprovalAction = async (userId: string, status: ApprovalStatus) => {
    try {
      if (status === 'approved') {
        // Add member role to the user (they already have user role)
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role: 'member' });

        if (insertError) {
          throw insertError;
        }
      } else {
        // For rejection, remove the user role entirely
        const { error: deleteError } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', 'user');

        if (deleteError) {
          throw deleteError;
        }
      }

      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
      
      toast({
        title: status === 'approved' ? "User Approved" : "User Rejected",
        description: `User has been ${status}. ${status === 'approved' ? 'They now have member access.' : 'Their access has been revoked.'}`,
      });
      
      console.log(`User ${userId} ${status}. This would trigger a notification to the user.`);
    } catch (error) {
      console.error('Error updating user approval status:', error);
      toast({
        title: "Error",
        description: "Failed to update user approval status",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Approvals</CardTitle>
        <CardDescription>
          Review and approve users for member access (users with basic access pending member approval)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoadingState message="Loading pending approvals..." />
        ) : pendingUsers.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Institution</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingUsers.map((user) => {
                const displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
                const initials = getInitials(user.firstName || '', user.lastName || '', user.email || '');
                
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Avatar className="w-8 h-8 mr-2">
                          {user.avatar && (
                            <AvatarImage 
                              src={user.avatar} 
                              alt={displayName}
                            />
                          )}
                          <AvatarFallback className="text-sm font-medium">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          {displayName}
                          <div className="text-sm text-gray-500">
                            {user.role}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.institution}</TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleApprovalAction(user.id, "approved")
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleApprovalAction(user.id, "rejected")
                          }
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <EmptyState message="No pending approvals" />
        )}
      </CardContent>
    </Card>
  );
};

export default UserApprovalsTab;
