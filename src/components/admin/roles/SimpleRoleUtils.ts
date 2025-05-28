
import { UserProfile, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Simple role management utilities - rebuilt for clarity and reliability
 */

interface ProfileWithRole {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  linked_in: string | null;
  institution: string | null;
  location: string | null;
  role: string | null; // job role, not system role
  bio: string | null;
  avatar: string | null;
  created_at: string;
  user_role: UserRole | null; // system role from user_roles table
}

/**
 * Get simple role counts using direct query on user_roles table
 */
export const getSimpleRoleCounts = async (): Promise<Record<UserRole | 'all', number>> => {
  try {
    console.log("[SimpleRoleUtils] Fetching role counts...");
    
    // Get total profiles count
    const { count: totalCount, error: totalError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (totalError) throw totalError;
    
    // Get role counts from user_roles table
    const { data: roleCounts, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .then(({ data, error }) => {
        if (error) throw error;
        
        const counts = {
          admin: 0,
          member: 0,
          user: 0
        };
        
        data?.forEach(row => {
          if (row.role in counts) {
            counts[row.role as UserRole]++;
          }
        });
        
        return { data: counts, error: null };
      });
    
    if (roleError) throw roleError;
    
    const result = {
      'all': totalCount || 0,
      'admin': roleCounts?.admin || 0,
      'member': roleCounts?.member || 0,
      'user': roleCounts?.user || 0
    };
    
    console.log("[SimpleRoleUtils] Role counts:", result);
    return result;
  } catch (error) {
    console.error("[SimpleRoleUtils] Error fetching role counts:", error);
    return { 'all': 0, 'admin': 0, 'member': 0, 'user': 0 };
  }
};

/**
 * Fetch users with their roles using appropriate JOIN strategy
 */
export const getSimpleUsersWithRoles = async (
  roleFilter: UserRole | 'all', 
  page = 1, 
  pageSize = 10
): Promise<{ data: ProfileWithRole[], count: number }> => {
  try {
    console.log(`[SimpleRoleUtils] Fetching users for filter: ${roleFilter}, page: ${page}`);
    
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    if (roleFilter === 'all') {
      // For "All Users": Use LEFT JOIN to include all profiles (with or without roles)
      const { data, error, count } = await supabase
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
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) throw error;
      
      // Transform data to include user_role directly
      const transformedData: ProfileWithRole[] = (data || []).map(profile => ({
        ...profile,
        user_role: profile.user_roles?.[0]?.role || null
      }));
      
      console.log(`[SimpleRoleUtils] Fetched ${transformedData.length} users for 'all', total: ${count}`);
      return { data: transformedData, count: count || 0 };
      
    } else {
      // For specific roles: Use INNER JOIN to only get profiles with that specific role
      const { data, error, count } = await supabase
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
          user_roles!inner(role)
        `, { count: 'exact' })
        .eq('user_roles.role', roleFilter)
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) throw error;
      
      // Transform data to include user_role directly
      const transformedData: ProfileWithRole[] = (data || []).map(profile => ({
        ...profile,
        user_role: profile.user_roles?.[0]?.role || null
      }));
      
      console.log(`[SimpleRoleUtils] Fetched ${transformedData.length} users for role '${roleFilter}', total: ${count}`);
      return { data: transformedData, count: count || 0 };
    }
  } catch (error) {
    console.error(`[SimpleRoleUtils] Error fetching users:`, error);
    throw error;
  }
};

/**
 * Simple mapping from ProfileWithRole to UserProfile
 */
export const mapToUserProfiles = (profiles: ProfileWithRole[]): UserProfile[] => {
  console.log(`[SimpleRoleUtils] Mapping ${profiles.length} profiles to UserProfile objects`);
  
  return profiles.map((profile, index) => {
    const userRole = profile.user_role;
    
    console.log(`[SimpleRoleUtils] Profile ${index + 1} (${profile.id}): role = ${userRole}`);
    
    const userProfile: UserProfile = {
      id: profile.id,
      firstName: profile.first_name || '',
      lastName: profile.last_name || '',
      email: profile.email || '',
      linkedIn: profile.linked_in,
      institution: profile.institution,
      location: profile.location,
      role: profile.role, // job role
      bio: profile.bio,
      approved: userRole === "member",
      isAdmin: userRole === "admin",
      createdAt: new Date(profile.created_at || Date.now()),
      avatar: profile.avatar,
      userRole: userRole // system role
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
