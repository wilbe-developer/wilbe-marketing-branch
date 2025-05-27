
import { UserProfile, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches users with specified role using separate queries instead of a JOIN
 */
export const fetchUsersByRole = async (role: UserRole | 'all', page = 1, pageSize = 20) => {
  try {
    console.log(`Fetching users for role: ${role}, page: ${page}`);
    
    // Get role counts for filter indicators
    const counts = await fetchRoleCounts();
    
    let profilesQuery = supabase.from('profiles')
      .select('*', { count: 'exact' });

    // Apply pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    let filteredProfileIds: string[] = [];
    let totalCount = 0;
    
    if (role === 'all') {
      // For 'all', get all profiles
      const { data: profiles, error: profilesError, count } = await profilesQuery
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (profilesError) throw profilesError;
      
      if (!profiles || profiles.length === 0) {
        console.log("No profiles found");
        return { 
          data: [], 
          count: 0,
          userRoleMap: {}
        };
      }
      
      // Get roles for all these profiles
      const profileIds = profiles.map(profile => profile.id);
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', profileIds);
      
      if (rolesError) throw rolesError;
      
      // Create a map of user_id to roles for easier access
      const userRoleMap: Record<string, UserRole[]> = {};
      userRoles?.forEach(ur => {
        if (!userRoleMap[ur.user_id]) {
          userRoleMap[ur.user_id] = [];
        }
        userRoleMap[ur.user_id].push(ur.role as UserRole);
      });
      
      const enhancedProfiles = mapProfilesToUserProfiles(profiles, userRoleMap);
      
      return { 
        data: enhancedProfiles, 
        count: count || 0,
        userRoleMap
      };
    } else {
      // For specific roles, first get user IDs with that role
      if (role === 'user') {
        // For 'user' role, show users who have 'user' role but NOT 'member' or 'admin'
        const { data: allUserRoles, error: allRolesError } = await supabase
          .from('user_roles')
          .select('user_id, role');
        
        if (allRolesError) throw allRolesError;
        
        // Group roles by user_id
        const userRoleMap: Record<string, UserRole[]> = {};
        allUserRoles?.forEach(ur => {
          if (!userRoleMap[ur.user_id]) {
            userRoleMap[ur.user_id] = [];
          }
          userRoleMap[ur.user_id].push(ur.role as UserRole);
        });
        
        // Find users who only have 'user' role
        filteredProfileIds = Object.entries(userRoleMap)
          .filter(([userId, roles]) => 
            roles.includes('user') && !roles.includes('member') && !roles.includes('admin')
          )
          .map(([userId]) => userId);
          
        totalCount = counts['user'];
      } else {
        // For admin/member roles, get users who have those specific roles
        const { data: roleUsers, error: roleError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('role', role);
        
        if (roleError) throw roleError;
        
        filteredProfileIds = roleUsers?.map(ru => ru.user_id) || [];
        totalCount = counts[role];
      }
      
      if (filteredProfileIds.length === 0) {
        return { 
          data: [], 
          count: totalCount,
          userRoleMap: {}
        };
      }
      
      // Apply pagination to filtered IDs
      const paginatedIds = filteredProfileIds.slice(from, from + pageSize);
      
      // Get profiles for these specific user IDs
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', paginatedIds)
        .order('created_at', { ascending: false });
      
      if (profilesError) throw profilesError;
      
      if (!profiles || profiles.length === 0) {
        return { 
          data: [], 
          count: totalCount,
          userRoleMap: {}
        };
      }
      
      // Get roles for these profiles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', paginatedIds);
      
      if (rolesError) throw rolesError;
      
      // Create a map of user_id to roles for easier access
      const userRoleMap: Record<string, UserRole[]> = {};
      userRoles?.forEach(ur => {
        if (!userRoleMap[ur.user_id]) {
          userRoleMap[ur.user_id] = [];
        }
        userRoleMap[ur.user_id].push(ur.role as UserRole);
      });
      
      const enhancedProfiles = mapProfilesToUserProfiles(profiles, userRoleMap);
      
      console.log(`Found ${enhancedProfiles.length} profiles for role ${role}`);
      
      return { 
        data: enhancedProfiles, 
        count: totalCount,
        userRoleMap
      };
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
    
    // Get admin count
    const { count: adminCount, error: adminError } = await supabase
      .from('user_roles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'admin');
    
    if (adminError) throw adminError;
    
    // Get member count
    const { count: memberCount, error: memberError } = await supabase
      .from('user_roles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'member');
    
    if (memberError) throw memberError;
    
    // Get user role count (users who only have 'user' role, not member/admin)
    const { data: allUserRoles, error: allRolesError } = await supabase
      .from('user_roles')
      .select('user_id, role');
    
    if (allRolesError) throw allRolesError;
    
    // Count users who only have 'user' role
    const userRoleMap: Record<string, UserRole[]> = {};
    allUserRoles?.forEach(ur => {
      if (!userRoleMap[ur.user_id]) {
        userRoleMap[ur.user_id] = [];
      }
      userRoleMap[ur.user_id].push(ur.role as UserRole);
    });
    
    const basicUserCount = Object.values(userRoleMap).filter(roles => 
      roles.includes('user') && !roles.includes('member') && !roles.includes('admin')
    ).length;
    
    console.log("Role counts:", {
      'all': totalCount || 0,
      'admin': adminCount || 0,
      'member': memberCount || 0,
      'user': basicUserCount
    });
    
    return {
      'all': totalCount || 0,
      'admin': adminCount || 0,
      'member': memberCount || 0,
      'user': basicUserCount
    };
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
