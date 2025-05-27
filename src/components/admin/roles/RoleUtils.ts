import { UserProfile, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches users with specified role using direct JOIN queries for better performance
 */
export const fetchUsersByRole = async (role: UserRole | 'all', page = 1, pageSize = 20) => {
  try {
    console.log(`Fetching users with role: ${role}, page: ${page}, pageSize: ${pageSize}`);
    
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    if (role === 'all') {
      // Get all profiles with their roles using JOIN
      const { data: profilesWithRoles, error: profilesError, count } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles!inner(role)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (profilesError) {
        console.error("Error fetching all profiles:", profilesError);
        throw profilesError;
      }

      // Build role map from the joined data
      const userRoleMap: Record<string, UserRole[]> = {};
      const profiles = profilesWithRoles || [];
      
      profiles.forEach(profile => {
        if (!userRoleMap[profile.id]) {
          userRoleMap[profile.id] = [];
        }
        // Handle both single role and array of roles from JOIN
        const roles = Array.isArray(profile.user_roles) ? profile.user_roles : [profile.user_roles];
        roles.forEach(roleObj => {
          if (roleObj && roleObj.role && !userRoleMap[profile.id].includes(roleObj.role as UserRole)) {
            userRoleMap[profile.id].push(roleObj.role as UserRole);
          }
        });
      });

      console.log(`Fetched ${profiles.length} profiles for 'all'. Total: ${count || 0}`);
      return { data: profiles, count: count || 0, userRoleMap };

    } else if (role === 'user') {
      // For basic users: users who have ONLY 'user' role (not member or admin)
      const { data: basicUserProfiles, error: basicUserError, count } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles!inner(role)
        `, { count: 'exact' })
        .eq('user_roles.role', 'user')
        .not('id', 'in', `(
          SELECT DISTINCT user_id 
          FROM user_roles 
          WHERE role IN ('member', 'admin')
        )`)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (basicUserError) {
        console.error("Error fetching basic users:", basicUserError);
        throw basicUserError;
      }

      // Build role map for basic users
      const userRoleMap: Record<string, UserRole[]> = {};
      const profiles = basicUserProfiles || [];
      
      profiles.forEach(profile => {
        userRoleMap[profile.id] = ['user'];
      });

      console.log(`Fetched ${profiles.length} basic user profiles. Total: ${count || 0}`);
      return { 
        data: profiles, 
        count: count || 0,
        userRoleMap
      };

    } else {
      // For admin/member roles: direct JOIN query
      const { data: roleProfiles, error: roleError, count } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles!inner(role)
        `, { count: 'exact' })
        .eq('user_roles.role', role)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (roleError) {
        console.error(`Error fetching ${role} users:`, roleError);
        throw roleError;
      }

      // Get all roles for these users to build complete role map
      const userIds = (roleProfiles || []).map(profile => profile.id);
      let userRoleMap: Record<string, UserRole[]> = {};
      
      if (userIds.length > 0) {
        const { data: allRoles, error: allRolesError } = await supabase
          .from('user_roles')
          .select('user_id, role')
          .in('user_id', userIds);

        if (allRolesError) {
          console.error("Error fetching all roles for users:", allRolesError);
          throw allRolesError;
        }

        allRoles?.forEach(ur => {
          if (!userRoleMap[ur.user_id]) {
            userRoleMap[ur.user_id] = [];
          }
          userRoleMap[ur.user_id].push(ur.role as UserRole);
        });
      }

      console.log(`Fetched ${(roleProfiles || []).length} profiles with role: ${role}. Total: ${count || 0}`);
      return { 
        data: roleProfiles || [], 
        count: count || 0,
        userRoleMap
      };
    }
  } catch (error) {
    console.error("Error in fetchUsersByRole:", error);
    throw new Error(`Failed to fetch users with role ${role}: ${error.message || 'Unknown error'}`);
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
