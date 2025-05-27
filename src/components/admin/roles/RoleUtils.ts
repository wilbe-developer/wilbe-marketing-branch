
import { UserProfile, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches users with specified role using a simplified single-query approach with LEFT JOIN
 */
export const fetchUsersByRole = async (role: UserRole | 'all', page = 1, pageSize = 20) => {
  try {
    console.log(`Fetching users with role: ${role}, page: ${page}, pageSize: ${pageSize}`);
    
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('profiles')
      .select(`
        *,
        user_roles!left (
          role
        )
      `, { count: 'exact' })
      .not('user_roles.role', 'is', null) // Only get users who have a role
      .order('created_at', { ascending: false })
      .range(from, to);

    // Apply role filter if not 'all'
    if (role !== 'all') {
      query = query.eq('user_roles.role', role);
    }

    const { data: results, error: profilesError, count } = await query;

    if (profilesError) {
      console.error(`Error fetching profiles for role ${role}:`, profilesError);
      throw profilesError;
    }

    console.log(`Fetched ${(results || []).length} profiles with role: ${role}. Total: ${count || 0}`);
    console.log('Sample result structure:', results?.[0]);
    
    return { 
      data: results || [], 
      count: count || 0
    };
  } catch (error) {
    console.error("Error in fetchUsersByRole:", error);
    throw new Error(`Failed to fetch users with role ${role}: ${error.message || 'Unknown error'}`);
  }
};

/**
 * Counts users by role type using the same JOIN approach for consistency
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
          user_roles!left (
            role
          )
        `, { count: 'exact', head: true })
        .eq('user_roles.role', 'admin'),
      supabase
        .from('profiles')
        .select(`
          *,
          user_roles!left (
            role
          )
        `, { count: 'exact', head: true })
        .eq('user_roles.role', 'member'),
      supabase
        .from('profiles')
        .select(`
          *,
          user_roles!left (
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
    // Extract the role from the joined user_roles data
    const userRole = profile.user_roles?.role as UserRole;
    
    console.log(`Mapping profile ${profile.id}: role=${userRole}, profile.role=${profile.role}`);
    
    return {
      id: profile.id,
      firstName: profile.first_name || '',
      lastName: profile.last_name || '',
      email: profile.email || '',
      linkedIn: profile.linked_in,
      institution: profile.institution,
      location: profile.location,
      role: profile.role, // Keep the original profile role field
      bio: profile.bio,
      approved: userRole === "member", // User is approved if they have member role
      isAdmin: userRole === "admin", // User is admin if they have admin role
      createdAt: new Date(profile.created_at || Date.now()),
      avatar: profile.avatar,
      // Add the actual role from user_roles for display
      actualRole: userRole
    };
  });
};

/**
 * Fetches all roles for a specific user (simplified since users have only one role)
 */
export const fetchUserRoles = async (userId: string): Promise<UserRole[]> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single(); // Since users have only one role
    
    if (error) {
      console.error(`Error fetching role for user ${userId}:`, error);
      return [];
    }
    
    return data ? [data.role as UserRole] : [];
  } catch (error) {
    console.error(`Error fetching roles for user ${userId}:`, error);
    return [];
  }
};
