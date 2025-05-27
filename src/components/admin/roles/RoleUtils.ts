
import { UserProfile, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches users with specified role using a simplified two-step approach
 */
export const fetchUsersByRole = async (role: UserRole | 'all', page = 1, pageSize = 20) => {
  try {
    console.log(`Fetching users with role: ${role}, page: ${page}, pageSize: ${pageSize}`);
    
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    if (role === 'all') {
      // Get all profiles with their roles using a simple approach
      const { data: profiles, error: profilesError, count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (profilesError) {
        console.error("Error fetching all profiles:", profilesError);
        throw profilesError;
      }

      // Get roles for these users
      const userIds = (profiles || []).map(profile => profile.id);
      let userRoleMap: Record<string, UserRole[]> = {};
      
      if (userIds.length > 0) {
        const { data: allRoles, error: allRolesError } = await supabase
          .from('user_roles')
          .select('user_id, role')
          .in('user_id', userIds);

        if (allRolesError) {
          console.error("Error fetching roles for users:", allRolesError);
          console.warn("Proceeding with incomplete role data");
        } else {
          allRoles?.forEach(ur => {
            if (!userRoleMap[ur.user_id]) {
              userRoleMap[ur.user_id] = [];
            }
            userRoleMap[ur.user_id].push(ur.role as UserRole);
          });
        }
      }

      console.log(`Fetched ${(profiles || []).length} profiles for 'all'. Total: ${count || 0}`);
      return { data: profiles || [], count: count || 0, userRoleMap };

    } else {
      // For specific roles: first get user IDs with that role, then get their profiles
      console.log(`Getting user IDs with role: ${role}`);
      
      const { data: userRoles, error: userRolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', role);

      if (userRolesError) {
        console.error(`Error fetching user IDs for role ${role}:`, userRolesError);
        throw userRolesError;
      }

      const userIds = (userRoles || []).map(ur => ur.user_id);
      console.log(`Found ${userIds.length} users with role ${role}`);

      if (userIds.length === 0) {
        console.log(`No users found with role: ${role}`);
        return { data: [], count: 0, userRoleMap: {} };
      }

      // Get count for pagination
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .in('id', userIds);

      if (countError) {
        console.error(`Error getting count for role ${role}:`, countError);
        throw countError;
      }

      // Get profiles for these users with pagination
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (profilesError) {
        console.error(`Error fetching profiles for role ${role}:`, profilesError);
        throw profilesError;
      }

      // Build role map for these users
      const profileIds = (profiles || []).map(p => p.id);
      let userRoleMap: Record<string, UserRole[]> = {};
      
      if (profileIds.length > 0) {
        const { data: allRoles, error: allRolesError } = await supabase
          .from('user_roles')
          .select('user_id, role')
          .in('user_id', profileIds);

        if (allRolesError) {
          console.error("Error fetching all roles for users:", allRolesError);
          console.warn("Proceeding with incomplete role data");
        } else {
          allRoles?.forEach(ur => {
            if (!userRoleMap[ur.user_id]) {
              userRoleMap[ur.user_id] = [];
            }
            userRoleMap[ur.user_id].push(ur.role as UserRole);
          });
        }
      }

      console.log(`Fetched ${(profiles || []).length} profiles with role: ${role}. Total: ${count || 0}`);
      return { 
        data: profiles || [], 
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
 * Counts users by role type - simplified since no duplicate roles
 */
export const fetchRoleCounts = async (): Promise<Record<UserRole | 'all', number>> => {
  try {
    // Get total user count from profiles table
    const { count: totalCount, error: totalError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (totalError) {
      console.error("Error getting total count:", totalError);
      throw totalError;
    }
    
    // Get counts for each role directly
    const [adminResult, memberResult, userResult] = await Promise.all([
      supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin'),
      supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'member'),
      supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'user')
    ]);

    const counts = {
      'all': totalCount || 0,
      'admin': adminResult.count || 0,
      'member': memberResult.count || 0,
      'user': userResult.count || 0
    };
    
    console.log("Role counts calculated successfully:", counts);
    return counts;
  } catch (error) {
    console.error("Error fetching role counts:", error);
    // Return defaults on error to prevent UI from breaking
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
