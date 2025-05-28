
import { UserProfile, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches users with specified role using simplified approach
 */
export const fetchUsersByRole = async (role: UserRole | 'all', page = 1, pageSize = 20) => {
  try {
    console.log(`[RoleUtils] Fetching users with role: ${role}, page: ${page}, pageSize: ${pageSize}`);
    
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
        console.error("[RoleUtils] Error fetching all profiles:", profilesError);
        throw profilesError;
      }

      console.log(`[RoleUtils] Raw results for 'all':`, results);
      console.log(`[RoleUtils] Fetched ${(results || []).length} profiles for 'all'. Total: ${count || 0}`);
      return { data: results || [], count: count || 0 };

    } else {
      // For specific roles: use INNER JOIN to get profiles with that specific role
      console.log(`[RoleUtils] Building query for specific role: ${role}`);
      
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
        console.error(`[RoleUtils] Error fetching profiles for role ${role}:`, profilesError);
        throw profilesError;
      }

      console.log(`[RoleUtils] Raw results for role '${role}':`, results);
      console.log(`[RoleUtils] Query returned ${(results || []).length} profiles with role: ${role}. Total: ${count || 0}`);
      
      return { 
        data: results || [], 
        count: count || 0
      };
    }
  } catch (error) {
    console.error("[RoleUtils] Error in fetchUsersByRole:", error);
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
    console.error(`[RoleUtils] Error fetching roles for user ${userId}:`, error);
    return [];
  }
};

/**
 * Counts users by role type using consistent approach
 */
export const fetchRoleCounts = async (): Promise<Record<UserRole | 'all', number>> => {
  try {
    console.log("[RoleUtils] Fetching role counts...");
    
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
    
    console.log("[RoleUtils] Role counts calculated successfully:", counts);
    return counts;
  } catch (error) {
    console.error("[RoleUtils] Error fetching role counts:", error);
    // Return defaults on error to prevent UI from breaking
    return { 'all': 0, 'admin': 0, 'member': 0, 'user': 0 };
  }
};

/**
 * Maps database profiles to UserProfile objects with simplified role extraction
 */
export const mapProfilesToUserProfiles = (profiles: any[]): UserProfile[] => {
  console.log(`[RoleUtils] Mapping ${profiles.length} profiles to UserProfile objects`);
  
  return profiles.map((profile, index) => {
    // Simplified role extraction logic
    let userRole: UserRole | undefined;
    
    console.log(`[RoleUtils] Profile ${index + 1} (${profile.id}) raw user_roles:`, JSON.stringify(profile.user_roles, null, 2));
    
    if (profile.user_roles) {
      if (Array.isArray(profile.user_roles)) {
        // LEFT JOIN result: array (could be empty for users without roles)
        if (profile.user_roles.length > 0 && profile.user_roles[0]?.role) {
          userRole = profile.user_roles[0].role as UserRole;
          console.log(`[RoleUtils] Profile ${index + 1}: Extracted role from array: ${userRole}`);
        } else {
          console.log(`[RoleUtils] Profile ${index + 1}: No role found in array`);
        }
      } else if (typeof profile.user_roles === 'object' && profile.user_roles.role) {
        // INNER JOIN result: single object with role
        userRole = profile.user_roles.role as UserRole;
        console.log(`[RoleUtils] Profile ${index + 1}: Extracted role from object: ${userRole}`);
      }
    } else {
      console.log(`[RoleUtils] Profile ${index + 1}: No user_roles data`);
    }
    
    const userProfile: UserProfile = {
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
    
    console.log(`[RoleUtils] Mapped profile ${index + 1}:`, {
      id: userProfile.id,
      name: `${userProfile.firstName} ${userProfile.lastName}`,
      userRole: userProfile.userRole,
      approved: userProfile.approved,
      isAdmin: userProfile.isAdmin
    });
    
    return userProfile;
  });
};
