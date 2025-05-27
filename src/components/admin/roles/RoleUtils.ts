
import { UserProfile, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches users with specified role using a simplified single-query approach
 */
export const fetchUsersByRole = async (role: UserRole | 'all', page = 1, pageSize = 20) => {
  try {
    console.log(`Fetching users with role: ${role}, page: ${page}, pageSize: ${pageSize}`);
    
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    if (role === 'all') {
      // Get all profiles with their roles using LEFT JOIN
      const { data: results, error: profilesError, count } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles!inner (
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
      // For specific roles: use JOIN to get profiles with that specific role
      console.log(`Getting profiles with role: ${role}`);
      
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
 * Counts users by role type using JOIN for consistency
 */
export const fetchRoleCounts = async (): Promise<Record<UserRole | 'all', number>> => {
  try {
    // Get counts using the same JOIN approach as the main query for consistency
    const [allResult, adminResult, memberResult, userResult] = await Promise.all([
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .not('user_roles.role', 'is', null),
      supabase
        .from('profiles')
        .select(`
          *,
          user_roles!inner (
            role
          )
        `, { count: 'exact', head: true })
        .eq('user_roles.role', 'admin'),
      supabase
        .from('profiles')
        .select(`
          *,
          user_roles!inner (
            role
          )
        `, { count: 'exact', head: true })
        .eq('user_roles.role', 'member'),
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
 * Maps database profiles to UserProfile objects - simplified since we get role directly
 */
export const mapProfilesToUserProfiles = (profiles: any[]): UserProfile[] => {
  return profiles.map(profile => {
    // Extract the role from the joined user_roles data
    const userRole = profile.user_roles?.role;
    
    return {
      id: profile.id,
      firstName: profile.first_name || '',
      lastName: profile.last_name || '',
      email: profile.email || '',
      linkedIn: profile.linked_in,
      institution: profile.institution,
      location: profile.location,
      role: profile.role,
      bio: profile.bio,
      approved: userRole === "member",
      isAdmin: userRole === "admin",
      createdAt: new Date(profile.created_at || Date.now()),
      avatar: profile.avatar
    };
  });
};
