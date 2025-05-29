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

type UserRole = 'admin' | 'member' | 'user';

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
      console.log('🔍 DEBUG: Fetching users with roles');

      // Get all unified profiles
      const { data: profiles, error: profilesError } = await supabase
        .rpc('get_all_unified_profiles');

      if (profilesError) {
        throw profilesError;
      }

      console.log('👥 DEBUG: Total profiles fetched:', profiles?.length);

      // Get all user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) {
        throw rolesError;
      }

      console.log('🎭 DEBUG: Raw user roles from database:', userRoles);
      console.log('📊 DEBUG: Total role entries:', userRoles?.length);

      // Group roles by user
      const rolesByUser = userRoles?.reduce((acc, role) => {
        if (!acc[role.user_id]) {
          acc[role.user_id] = [];
        }
        acc[role.user_id].push(role.role);
        return acc;
      }, {} as Record<string, string[]>) || {};

      console.log('🗂️ DEBUG: Roles grouped by user:', rolesByUser);

      // Find the specific user we're debugging
      const debugUser = userRoles?.find(role => {
        const profile = profiles?.find(p => p.user_id === role.user_id);
        return profile?.email === 'kart.tomberg@expressionedits.com';
      });
      
      if (debugUser) {
        console.log('🎯 DEBUG: Found Kärt Tomberg in user_roles:', debugUser);
        console.log('🎯 DEBUG: Kärt\'s roles array will be:', rolesByUser[debugUser.user_id]);
      }

      // Combine profiles with their roles
      const usersWithRoles: UserWithRoles[] = (profiles || []).map(profile => {
        const userRoleArray = rolesByUser[profile.user_id] || ['user'];
        
        // Debug logging for Kärt specifically
        if (profile.email === 'kart.tomberg@expressionedits.com') {
          console.log('🎯 DEBUG: Processing Kärt Tomberg:');
          console.log('  - Profile:', profile);
          console.log('  - User ID:', profile.user_id);
          console.log('  - Roles from database:', rolesByUser[profile.user_id]);
          console.log('  - Final roles array:', userRoleArray);
        }
        
        return {
          user_id: profile.user_id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
          avatar: profile.avatar,
          created_at: profile.created_at,
          roles: userRoleArray
        };
      });

      console.log('👤 DEBUG: Users with roles processed:', usersWithRoles.length);

      // Debug the specific user in the final array
      const kartInFinalArray = usersWithRoles.find(user => user.email === 'kart.tomberg@expressionedits.com');
      if (kartInFinalArray) {
        console.log('🎯 DEBUG: Kärt in final array:', kartInFinalArray);
      }

      // Calculate role counts with detailed logging
      const counts = usersWithRoles.reduce((acc, user) => {
        acc.total++;
        
        // Debug logging for Kärt specifically during counting
        if (user.email === 'kart.tomberg@expressionedits.com') {
          console.log('🎯 DEBUG: Counting Kärt:');
          console.log('  - Roles:', user.roles);
          console.log('  - Has admin?', user.roles.includes('admin'));
          console.log('  - Has member?', user.roles.includes('member'));
        }
        
        if (user.roles.includes('admin')) {
          acc.admins++;
          if (user.email === 'kart.tomberg@expressionedits.com') {
            console.log('🎯 DEBUG: Kärt counted as ADMIN');
          }
        } else if (user.roles.includes('member')) {
          acc.members++;
          if (user.email === 'kart.tomberg@expressionedits.com') {
            console.log('🎯 DEBUG: Kärt counted as MEMBER');
          }
        } else {
          acc.users++;
          if (user.email === 'kart.tomberg@expressionedits.com') {
            console.log('🎯 DEBUG: Kärt counted as USER');
          }
        }
        return acc;
      }, { total: 0, admins: 0, members: 0, users: 0 });

      console.log('📈 DEBUG: Final counts:', counts);
      console.log('📈 DEBUG: Expected counts from database: 6 admins, 1012 members, 12 users');

      setUsers(usersWithRoles);
      setRoleCounts(counts);
      console.log('✅ DEBUG: Found users with roles:', usersWithRoles.length);
    } catch (error) {
      console.error('❌ DEBUG: Error fetching users with roles:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users and roles',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole, currentRoles: string[]) => {
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
      const rolesToAdd: UserRole[] = newRole === 'user' ? ['user'] : ['user', newRole];
      
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
