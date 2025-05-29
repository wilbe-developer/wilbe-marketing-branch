
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface RoleManagementUser {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  institution: string | null;
  role: 'admin' | 'member' | 'user';
  avatar: string | null;
  created_at: string | null;
  last_login_date: string | null;
}

interface RoleStats {
  totalUsers: number;
  adminCount: number;
  memberCount: number;
  userCount: number;
}

export const useRoleManagement = () => {
  const [users, setUsers] = useState<RoleManagementUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [roleStats, setRoleStats] = useState<RoleStats>({
    totalUsers: 0,
    adminCount: 0,
    memberCount: 0,
    userCount: 0
  });
  const { toast } = useToast();

  const fetchUsersWithRoles = useCallback(async () => {
    setLoading(true);
    try {
      console.log('🔄 Fetching users with roles...');
      
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

      console.log('📊 Raw profiles:', profiles?.length || 0);
      console.log('🎭 Raw roles:', userRoles?.length || 0);

      // Create role mapping
      const rolesByUser = userRoles?.reduce((acc, role) => {
        // Priority: admin > member > user
        if (!acc[role.user_id] || 
            (role.role === 'admin') ||
            (role.role === 'member' && acc[role.user_id] === 'user')) {
          acc[role.user_id] = role.role as 'admin' | 'member' | 'user';
        }
        return acc;
      }, {} as Record<string, 'admin' | 'member' | 'user'>) || {};

      // Combine profiles with roles
      const usersWithRoles: RoleManagementUser[] = profiles?.map(profile => ({
        user_id: profile.user_id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        institution: profile.institution,
        role: rolesByUser[profile.user_id] || 'user',
        avatar: profile.avatar,
        created_at: profile.created_at,
        last_login_date: profile.last_login_date
      })) || [];

      // Calculate stats
      const stats = usersWithRoles.reduce((acc, user) => {
        acc.totalUsers++;
        switch (user.role) {
          case 'admin':
            acc.adminCount++;
            break;
          case 'member':
            acc.memberCount++;
            break;
          case 'user':
            acc.userCount++;
            break;
        }
        return acc;
      }, { totalUsers: 0, adminCount: 0, memberCount: 0, userCount: 0 });

      console.log('📈 Role stats:', stats);
      
      setUsers(usersWithRoles);
      setRoleStats(stats);
    } catch (error) {
      console.error('❌ Error fetching users with roles:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users and roles',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateUserRole = useCallback(async (userId: string, newRole: 'admin' | 'member' | 'user') => {
    try {
      console.log(`🔄 Updating role for user ${userId} to ${newRole}`);
      
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      toast({
        title: 'Role Updated',
        description: `User role has been updated to ${newRole}`
      });

      // Refresh data
      await fetchUsersWithRoles();
    } catch (error) {
      console.error('❌ Error updating user role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive'
      });
      throw error;
    }
  }, [fetchUsersWithRoles, toast]);

  const bulkUpdateRoles = useCallback(async (userIds: string[], newRole: 'admin' | 'member' | 'user') => {
    try {
      console.log(`🔄 Bulk updating ${userIds.length} users to ${newRole}`);
      
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .in('user_id', userIds);

      if (error) {
        throw error;
      }

      toast({
        title: 'Roles Updated',
        description: `${userIds.length} users have been updated to ${newRole}`
      });

      // Refresh data
      await fetchUsersWithRoles();
    } catch (error) {
      console.error('❌ Error bulk updating roles:', error);
      toast({
        title: 'Error',
        description: 'Failed to bulk update roles',
        variant: 'destructive'
      });
      throw error;
    }
  }, [fetchUsersWithRoles, toast]);

  return {
    users,
    loading,
    roleStats,
    refreshData: fetchUsersWithRoles,
    updateUserRole,
    bulkUpdateRoles
  };
};
