
import { UserProfile, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Ultra-simple role management - single query approach with Supabase-compatible filtering
 */

interface ProfileWithRole {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  linked_in: string | null;
  institution: string | null;
  location: string | null;
  role: string | null;
  bio: string | null;
  avatar: string | null;
  created_at: string;
  user_roles: { role: UserRole }[] | null;
}

/**
 * Single query function that handles everything
 */
const executeRoleQuery = async (
  roleFilter: UserRole | 'all', 
  page = 1, 
  pageSize = 10
): Promise<{ data: ProfileWithRole[], count: number }> => {
  try {
    console.log(`[SimpleRoleUtils] Query: roleFilter=${roleFilter}, page=${page}`);
    
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    // Build the base query with LEFT JOIN
    let query = supabase
      .from('profiles')
      .select(`
        id,
        first_name,
        last_name,
        email,
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
    
    console.log(`[SimpleRoleUtils] Result: ${(data || []).length} users, total: ${count}`);
    return { data: data || [], count: count || 0 };
    
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
      executeRoleQuery('all', 1, 1),
      executeRoleQuery('admin', 1, 1),
      executeRoleQuery('member', 1, 1),
      executeRoleQuery('user', 1, 1)
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
  return executeRoleQuery(roleFilter, page, pageSize);
};

/**
 * Simple mapping with proper null handling in JavaScript
 */
export const mapToUserProfiles = (profiles: ProfileWithRole[]): UserProfile[] => {
  console.log(`[SimpleRoleUtils] Mapping ${profiles.length} profiles`);
  
  return profiles.map((profile, index) => {
    // Extract user role from the LEFT JOIN result
    let userRole: UserRole | undefined;
    
    if (profile.user_roles && Array.isArray(profile.user_roles) && profile.user_roles.length > 0) {
      userRole = profile.user_roles[0].role;
    }
    
    console.log(`[SimpleRoleUtils] Profile ${index + 1}: ${profile.first_name || ''} ${profile.last_name || ''} (${profile.email || ''}) - role: ${userRole || 'none'}`);
    
    const userProfile: UserProfile = {
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
