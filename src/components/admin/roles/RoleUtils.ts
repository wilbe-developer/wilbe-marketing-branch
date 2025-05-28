
import { UserProfile, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches users with specified role using simplified approach
 */
export const fetchUsersByRole = async (role: UserRole | 'all', page = 1, pageSize = 20) => {
  try {
    console.log(`Fetching users with role: ${role}, page: ${page}, pageSize: ${pageSize}`);
    
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    if (role === 'all') {
      // Get all profiles with their roles using LEFT JOIN to include profiles without roles
      const { data: results, error: profilesError, count } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles (
            role
          )
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (profilesError) {
        console.error("Error fetching all profiles:", profilesError);
        throw profilesError;
      }

      console.log(`Fetched ${(results || []).length} profiles for 'all'. Total: ${count || 0}`);
      return { data: results || [], count: count || 0 };

    } else {
      // For specific roles: use INNER JOIN to get profiles with that specific role
      const { data: results, error: profilesError, count } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles!inner (
            role
          )
        `, { count: 'exact' })
        .eq('user_roles.role', role)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (profilesError) {
        console.error(`Error fetching profiles for role ${role}:`, profilesError);
        throw profilesError;
      }

      console.log(`Fetched ${(results || []).length} profiles with role: ${role}. Total: ${count || 0}`);
      return { 
        data: results || [], 
        count: count || 0
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
 * Counts users by role type using consistent approach
 */
export const fetchRoleCounts = async (): Promise<Record<UserRole | 'all', number>> => {
  try {
    // Get counts using the same approach as the main query for consistency
    const [allResult, adminResult, memberResult, userResult] = await Promise.all([
      // Count all profiles (using LEFT JOIN to include those without roles)
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true }),
      // Count admins using INNER JOIN
      supabase
        .from('profiles')
        .select(`
          *,
          user_roles!inner (
            role
          )
        `, { count: 'exact', head: true })
        .eq('user_roles.role', 'admin'),
      // Count members using INNER JOIN
      supabase
        .from('profiles')
        .select(`
          *,
          user_roles!inner (
            role
          )
        `, { count: 'exact', head: true })
        .eq('user_roles.role', 'member'),
      // Count basic users using INNER JOIN
      supabase
        .from('profiles')
        .select(`
          *,
          user_roles!inner (
            role
          )
        `, { count: 'exact', head: true })
        .eq('user_roles.role', 'user')
    ]);

    const counts = {
      'all': allResult.count || 0,
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
 * Maps database profiles to UserProfile objects with proper role extraction
 */
export const mapProfilesToUserProfiles = (profiles: any[]): UserProfile[] => {
  return profiles.map(profile => {
    // Extract the single role from the user_roles array (each user has only one role)
    const userRoleData = profile.user_roles;
    let userRole: UserRole | undefined;
    
    if (Array.isArray(userRoleData) && userRoleData.length > 0) {
      userRole = userRoleData[0].role as UserRole;
    } else if (userRoleData && userRoleData.role) {
      userRole = userRoleData.role as UserRole;
    }
    
    console.log(`User ${profile.id} role data:`, userRoleData, 'extracted role:', userRole);
    
    return {
      id: profile.id,
      firstName: profile.first_name || '',
      lastName: profile.last_name || '',
      email: profile.email || '',
      linkedIn: profile.linked_in,
      institution: profile.institution,
      location: profile.location,
      role: profile.role, // This is job role, not system role
      bio: profile.bio,
      approved: userRole === "member",
      isAdmin: userRole === "admin",
      createdAt: new Date(profile.created_at || Date.now()),
      avatar: profile.avatar,
      userRole: userRole // Store the actual system role
    };
  });
};
