
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserWithRoles {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  avatar: string | null;
  created_at: string | null;
  roles: string[];
}

interface RoleCounts {
  total: number;
  admins: number;
  members: number;
  users: number;
}

export const useRoleManagement = () => {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [roleCounts, setRoleCounts] = useState<RoleCounts>({
    total: 0,
    admins: 0,
    members: 0,
    users: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchUsersWithRoles = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching users with roles');

      // Get all unified profiles
      const { data: profiles, error: profilesError } = await supabase
        .rpc('get_all_unified_profiles');

      if (profilesError) {
        throw profilesError;
      }

      // Get all user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) {
        throw rolesError;
      }

      // Group roles by user
      const rolesByUser = userRoles?.reduce((acc, role) => {
        if (!acc[role.user_id]) {
          acc[role.user_id] = [];
        }
        acc[role.user_id].push(role.role);
        return acc;
      }, {} as Record<string, string[]>) || {};

      // Combine profiles with their roles
      const usersWithRoles: UserWithRoles[] = (profiles || []).map(profile => ({
        user_id: profile.user_id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        avatar: profile.avatar,
        created_at: profile.created_at,
        roles: rolesByUser[profile.user_id] || ['user'] // Default to user if no roles found
      }));

      // Calculate role counts
      const counts = usersWithRoles.reduce((acc, user) => {
        acc.total++;
        if (user.roles.includes('admin')) {
          acc.admins++;
        } else if (user.roles.includes('member')) {
          acc.members++;
        } else {
          acc.users++;
        }
        return acc;
      }, { total: 0, admins: 0, members: 0, users: 0 });

      setUsers(usersWithRoles);
      setRoleCounts(counts);
      console.log('Found users with roles:', usersWithRoles.length);
    } catch (error) {
      console.error('Error fetching users with roles:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users and roles',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string, currentRoles: string[]) => {
    try {
      console.log(`Updating user ${userId} role to ${newRole}`);

      // Remove all existing roles for this user
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      if (deleteError) {
        throw deleteError;
      }

      // Add the new role (and 'user' role as base)
      const rolesToAdd = newRole === 'user' ? ['user'] : ['user', newRole];
      
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert(
          rolesToAdd.map(role => ({
            user_id: userId,
            role: role
          }))
        );

      if (insertError) {
        throw insertError;
      }

      toast({
        title: 'Role Updated',
        description: `User role has been updated to ${newRole}`,
      });

      // Refresh data
      await fetchUsersWithRoles();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update user role',
        variant: 'destructive'
      });
    }
  };

  const refreshData = async () => {
    await fetchUsersWithRoles();
    toast({
      title: 'Data Refreshed',
      description: 'User roles have been refreshed',
    });
  };

  useEffect(() => {
    fetchUsersWithRoles();
  }, []);

  return {
    users,
    roleCounts,
    isLoading,
    updateUserRole,
    refreshData
  };
};
