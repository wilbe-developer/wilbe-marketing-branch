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

      // Debug: Check if Kärt's role exists in raw data
      const kartRole = userRoles?.find(role => {
        const profile = profiles?.find(p => p.user_id === role.user_id);
        return profile?.email === 'kart.tomberg@expressionedits.com';
      });
      
      if (kartRole) {
        console.log('🎯 DEBUG: Found Kärt Tomberg in raw user_roles:', kartRole);
        console.log('🎯 DEBUG: Kärt user_id type:', typeof kartRole.user_id, 'value:', kartRole.user_id);
        console.log('🎯 DEBUG: Kärt role:', kartRole.role);
      } else {
        console.log('❌ DEBUG: Kärt Tomberg NOT found in raw user_roles data');
        // Check if profile exists
        const kartProfile = profiles?.find(p => p.email === 'kart.tomberg@expressionedits.com');
        if (kartProfile) {
          console.log('🎯 DEBUG: But Kärt profile exists:', kartProfile.user_id);
          console.log('🎯 DEBUG: Profile user_id type:', typeof kartProfile.user_id);
        }
      }

      // Group roles by user with enhanced debugging
      const rolesByUser = userRoles?.reduce((acc, role) => {
        // Debug each entry
        const userIdKey = String(role.user_id); // Ensure string conversion
        
        if (!acc[userIdKey]) {
          acc[userIdKey] = [];
        }
        acc[userIdKey].push(role.role);
        
        // Special logging for Kärt
        if (kartRole && String(role.user_id) === String(kartRole.user_id)) {
          console.log('🎯 DEBUG: Processing Kärt role entry:');
          console.log('  - Original user_id:', role.user_id, typeof role.user_id);
          console.log('  - String key:', userIdKey);
          console.log('  - Role:', role.role);
          console.log('  - Accumulated roles so far:', acc[userIdKey]);
        }
        
        return acc;
      }, {} as Record<string, string[]>) || {};

      console.log('🗂️ DEBUG: Roles grouped by user (first 5 entries):');
      const entries = Object.entries(rolesByUser).slice(0, 5);
      entries.forEach(([userId, roles]) => {
        console.log(`  ${userId}: [${roles.join(', ')}]`);
      });

      // Debug: Check if Kärt's ID exists as a key
      if (kartRole) {
        const kartUserId = String(kartRole.user_id);
        console.log('🎯 DEBUG: Looking for Kärt with key:', kartUserId);
        console.log('🎯 DEBUG: Kärt roles in object:', rolesByUser[kartUserId]);
        console.log('🎯 DEBUG: Object has this key?', Object.prototype.hasOwnProperty.call(rolesByUser, kartUserId));
        
        // Check all possible variations
        console.log('🎯 DEBUG: All keys containing Kärt user_id:');
        Object.keys(rolesByUser).forEach(key => {
          if (key.includes(kartUserId.substring(0, 8))) {
            console.log(`  Found similar key: ${key} -> [${rolesByUser[key].join(', ')}]`);
          }
        });
      }

      // Combine profiles with their roles
      const usersWithRoles: UserWithRoles[] = (profiles || []).map(profile => {
        const profileUserId = String(profile.user_id); // Ensure string conversion
        const userRoleArray = rolesByUser[profileUserId] || ['user'];
        
        // Debug logging for Kärt specifically
        if (profile.email === 'kart.tomberg@expressionedits.com') {
          console.log('🎯 DEBUG: Processing Kärt Profile Mapping:');
          console.log('  - Profile user_id:', profile.user_id, typeof profile.user_id);
          console.log('  - String key used for lookup:', profileUserId);
          console.log('  - Lookup result:', rolesByUser[profileUserId]);
          console.log('  - Final roles array:', userRoleArray);
          console.log('  - rolesByUser object keys sample:', Object.keys(rolesByUser).slice(0, 3));
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
