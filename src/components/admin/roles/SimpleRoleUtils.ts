
import { UserProfile, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Ultra-simple role management - single query approach with SQL filtering
 */

interface ProfileWithRole {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  linked_in: string | null;
  institution: string | null;
  location: string | null;
  role: string | null;
  bio: string | null;
  avatar: string | null;
  created_at: string;
  user_role: UserRole | null;
}

/**
 * Single query function that handles everything
 */
const executeRoleQuery = async (
  roleFilter: UserRole | 'all', 
  page = 1, 
  pageSize = 10,
  countOnly = false
): Promise<{ data: ProfileWithRole[], count: number }> => {
  try {
    console.log(`[SimpleRoleUtils] Query: roleFilter=${roleFilter}, page=${page}, countOnly=${countOnly}`);
    
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    // Build the base query with SQL filtering
    let query = supabase
      .from('profiles')
      .select(`
        id,
        COALESCE(first_name, '') as first_name,
        COALESCE(last_name, '') as last_name,
        COALESCE(email, '') as email,
        linked_in,
        institution,
        location,
        role,
        bio,
        avatar,
        created_at,
        user_roles!left(role)
      `, { count: 'exact' });
    
    // Apply SQL filtering based on role
    if (roleFilter !== 'all') {
      query = query.eq('user_roles.role', roleFilter);
    }
    
    // Add ordering and pagination
    query = query
      .order('created_at', { ascending: false })
      .range(from, to);
    
    const { data, error, count } = await query;
    
    if (error) throw error;
    
    // Simple transformation with null safety
    const transformedData: ProfileWithRole[] = (data || []).map(profile => ({
      id: profile.id,
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      email: profile.email || '',
      linked_in: profile.linked_in,
      institution: profile.institution,
      location: profile.location,
      role: profile.role,
      bio: profile.bio,
      avatar: profile.avatar,
      created_at: profile.created_at,
      user_role: profile.user_roles?.[0]?.role || null
    }));
    
    console.log(`[SimpleRoleUtils] Result: ${transformedData.length} users, total: ${count}`);
    return { data: transformedData, count: count || 0 };
    
  } catch (error) {
    console.error(`[SimpleRoleUtils] Query error:`, error);
    throw error;
  }
};

/**
 * Get role counts using the same query pattern
 */
export const getSimpleRoleCounts = async (): Promise<Record<UserRole | 'all', number>> => {
  try {
    console.log("[SimpleRoleUtils] Fetching role counts...");
    
    // Use Promise.all to run all count queries in parallel
    const [allResult, adminResult, memberResult, userResult] = await Promise.all([
      executeRoleQuery('all', 1, 1, true),
      executeRoleQuery('admin', 1, 1, true),
      executeRoleQuery('member', 1, 1, true),
      executeRoleQuery('user', 1, 1, true)
    ]);
    
    const counts = {
      'all': allResult.count,
      'admin': adminResult.count,
      'member': memberResult.count,
      'user': userResult.count
    };
    
    console.log("[SimpleRoleUtils] Role counts:", counts);
    return counts;
  } catch (error) {
    console.error("[SimpleRoleUtils] Error fetching role counts:", error);
    return { 'all': 0, 'admin': 0, 'member': 0, 'user': 0 };
  }
};

/**
 * Fetch users with the same query pattern used for counts
 */
export const getSimpleUsersWithRoles = async (
  roleFilter: UserRole | 'all', 
  page = 1, 
  pageSize = 10
): Promise<{ data: ProfileWithRole[], count: number }> => {
  return executeRoleQuery(roleFilter, page, pageSize, false);
};

/**
 * Simple mapping with proper null handling
 */
export const mapToUserProfiles = (profiles: ProfileWithRole[]): UserProfile[] => {
  console.log(`[SimpleRoleUtils] Mapping ${profiles.length} profiles`);
  
  return profiles.map((profile, index) => {
    const userRole = profile.user_role;
    
    console.log(`[SimpleRoleUtils] Profile ${index + 1}: ${profile.first_name} ${profile.last_name} (${profile.email}) - role: ${userRole}`);
    
    const userProfile: UserProfile = {
      id: profile.id,
      firstName: profile.first_name,
      lastName: profile.last_name,
      email: profile.email,
      linkedIn: profile.linked_in,
      institution: profile.institution,
      location: profile.location,
      role: profile.role,
      bio: profile.bio,
      approved: userRole === "member",
      isAdmin: userRole === "admin",
      createdAt: new Date(profile.created_at || Date.now()),
      avatar: profile.avatar,
      userRole: userRole
    };
    
    return userProfile;
  });
};

/**
 * Simple role update function
 */
export const updateSimpleUserRole = async (
  userId: string, 
  newRole: UserRole, 
  currentHasRole: boolean
): Promise<void> => {
  try {
    console.log(`[SimpleRoleUtils] Updating role for user ${userId}: ${newRole}, currently has role: ${currentHasRole}`);
    
    if (currentHasRole) {
      // Remove the role
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', newRole);
      
      if (error) throw error;
      console.log(`[SimpleRoleUtils] Removed ${newRole} role from user ${userId}`);
    } else {
      // Remove any existing role first (since one role per user)
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);
      
      // Add the new role
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: newRole
        });
      
      if (error) throw error;
      console.log(`[SimpleRoleUtils] Added ${newRole} role to user ${userId}`);
    }
  } catch (error) {
    console.error(`[SimpleRoleUtils] Error updating role:`, error);
    throw error;
  }
};
