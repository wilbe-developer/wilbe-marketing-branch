import { UserProfile, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches users with specified role using role-first approach
 */
export const fetchUsersByRole = async (role: UserRole | 'all', page = 1, pageSize = 20) => {
  try {
    console.log(`Fetching users with role: ${role}, page: ${page}, pageSize: ${pageSize}`);
    
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    if (role === 'all') {
      // For 'all', get all profiles with pagination and their roles
      const { data: profiles, error: profilesError, count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (profilesError) throw profilesError;

      if (!profiles || profiles.length === 0) {
        console.log("No profiles found");
        return { data: [], count: 0, userRoleMap: {} };
      }

      // Get roles for these profiles
      const profileIds = profiles.map(profile => profile.id);
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', profileIds);

      if (rolesError) throw rolesError;

      // Create role map
      const userRoleMap: Record<string, UserRole[]> = {};
      userRoles?.forEach(ur => {
        if (!userRoleMap[ur.user_id]) {
          userRoleMap[ur.user_id] = [];
        }
        userRoleMap[ur.user_id].push(ur.role as UserRole);
      });

      console.log(`Fetched ${profiles.length} profiles for 'all'. Total: ${count || 0}`);
      return { data: profiles, count: count || 0, userRoleMap };

    } else {
      // For specific roles, get user IDs with that role first
      const { data: roleUsers, error: roleError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', role);

      if (roleError) throw roleError;

      if (!roleUsers || roleUsers.length === 0) {
        console.log(`No users found with role: ${role}`);
        return { data: [], count: 0, userRoleMap: {} };
      }

      // Get unique user IDs
      const userIds = [...new Set(roleUsers.map(ru => ru.user_id))];
      
      // For 'user' role, we need users who ONLY have 'user' role (not member or admin)
      if (role === 'user') {
        // Get all roles for these users
        const { data: allRolesForUsers, error: allRolesError } = await supabase
          .from('user_roles')
          .select('user_id, role')
          .in('user_id', userIds);

        if (allRolesError) throw allRolesError;

        // Filter to only users who have ONLY 'user' role
        const userRoleMap: Record<string, UserRole[]> = {};
        allRolesForUsers?.forEach(ur => {
          if (!userRoleMap[ur.user_id]) {
            userRoleMap[ur.user_id] = [];
          }
          userRoleMap[ur.user_id].push(ur.role as UserRole);
        });

        // Keep only users who have 'user' role but not 'member' or 'admin'
        const basicUserIds = userIds.filter(userId => {
          const roles = userRoleMap[userId] || [];
          return roles.includes('user') && !roles.includes('member') && !roles.includes('admin');
        });

        if (basicUserIds.length === 0) {
          console.log(`No basic users found`);
          return { data: [], count: 0, userRoleMap: {} };
        }

        // Get profiles for basic users with pagination
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', basicUserIds)
          .order('created_at', { ascending: false })
          .range(from, to);

        if (profilesError) throw profilesError;

        console.log(`Fetched ${profiles?.length || 0} basic user profiles. Total basic users: ${basicUserIds.length}`);
        return { 
          data: profiles || [], 
          count: basicUserIds.length,
          userRoleMap
        };

      } else {
        // For admin/member roles, get profiles for all users with that role
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', userIds)
          .order('created_at', { ascending: false })
          .range(from, to);

        if (profilesError) throw profilesError;

        // Get all roles for these users
        const { data: allRoles, error: allRolesError } = await supabase
          .from('user_roles')
          .select('user_id, role')
          .in('user_id', userIds);

        if (allRolesError) throw allRolesError;

        const userRoleMap: Record<string, UserRole[]> = {};
        allRoles?.forEach(ur => {
          if (!userRoleMap[ur.user_id]) {
            userRoleMap[ur.user_id] = [];
          }
          userRoleMap[ur.user_id].push(ur.role as UserRole);
        });

        console.log(`Fetched ${profiles?.length || 0} profiles with role: ${role}. Total: ${userIds.length}`);
        return { 
          data: profiles || [], 
          count: userIds.length,
          userRoleMap
        };
      }
    }
  } catch (error) {
    console.error("Error fetching users by role:", error);
    throw error;
  }
};

/**
 * Fetches all roles for a specific user
 */
export const fetchUserRoles = async (userId: string): Promise<UserRole[]> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);
    
    if (error) throw error;
    
    return (data || []).map(row => row.role as UserRole);
  } catch (error) {
    console.error(`Error fetching roles for user ${userId}:`, error);
    return [];
  }
};

/**
 * Counts users by role type
 */
export const fetchRoleCounts = async (): Promise<Record<UserRole | 'all', number>> => {
  try {
    // Get total user count from profiles table
    const { count: totalCount, error: totalError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (totalError) throw totalError;
    
    // Get all user roles
    const { data: allUserRoles, error: allRolesError } = await supabase
      .from('user_roles')
      .select('user_id, role');
    
    if (allRolesError) throw allRolesError;
    
    // Count users by role
    const adminUsers = new Set();
    const memberUsers = new Set();
    const userRoleMap: Record<string, UserRole[]> = {};
    
    allUserRoles?.forEach(ur => {
      if (!userRoleMap[ur.user_id]) {
        userRoleMap[ur.user_id] = [];
      }
      userRoleMap[ur.user_id].push(ur.role as UserRole);
      
      if (ur.role === 'admin') adminUsers.add(ur.user_id);
      if (ur.role === 'member') memberUsers.add(ur.user_id);
    });
    
    // Count basic users (have 'user' role but not 'member' or 'admin')
    const basicUserCount = Object.entries(userRoleMap).filter(([userId, roles]) => 
      roles.includes('user') && !roles.includes('member') && !roles.includes('admin')
    ).length;
    
    const counts = {
      'all': totalCount || 0,
      'admin': adminUsers.size,
      'member': memberUsers.size,
      'user': basicUserCount
    };
    
    console.log("Role counts:", counts);
    return counts;
  } catch (error) {
    console.error("Error fetching role counts:", error);
    return { 'all': 0, 'admin': 0, 'member': 0, 'user': 0 };
  }
};

/**
 * Maps database profiles to UserProfile objects
 */
export const mapProfilesToUserProfiles = (profiles: any[], roleMap: Record<string, UserRole[]> = {}): UserProfile[] => {
  return profiles.map(profile => ({
    id: profile.id,
    firstName: profile.first_name || '',
    lastName: profile.last_name || '',
    email: profile.email || '',
    linkedIn: profile.linked_in,
    institution: profile.institution,
    location: profile.location,
    role: profile.role,
    bio: profile.bio,
    approved: roleMap[profile.id]?.includes("member") || false,
    isAdmin: roleMap[profile.id]?.includes("admin") || false,
    createdAt: new Date(profile.created_at || Date.now()),
    avatar: profile.avatar
  }));
};
