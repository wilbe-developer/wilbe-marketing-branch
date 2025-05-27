
import { UserProfile, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches users with specified role using a more efficient approach
 */
export const fetchUsersByRole = async (role: UserRole | 'all', page = 1, pageSize = 20) => {
  try {
    if (role === 'all') {
      // For 'all', get all user IDs that have any role, then fetch their profiles
      const { data: allUserRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id');

      if (rolesError) throw rolesError;

      // Get unique user IDs
      const userIds = [...new Set(allUserRoles?.map(ur => ur.user_id) || [])];
      
      if (userIds.length === 0) {
        return { 
          data: [], 
          count: 0,
          userRoleMap: {}
        };
      }

      // Apply pagination to user IDs
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      const paginatedUserIds = userIds.slice(from, to + 1);

      // Fetch profiles for paginated user IDs
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', paginatedUserIds)
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;
      
      // Get roles for these profiles
      const { data: userRoles, error: allRolesError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', paginatedUserIds);
      
      if (allRolesError) throw allRolesError;
      
      const userRoleMap: Record<string, UserRole[]> = {};
      userRoles?.forEach(ur => {
        if (!userRoleMap[ur.user_id]) {
          userRoleMap[ur.user_id] = [];
        }
        userRoleMap[ur.user_id].push(ur.role as UserRole);
      });
      
      console.log(`Fetched ${profiles?.length || 0} profiles for 'all' filter. Total users with roles: ${userIds.length}`);
      
      return { 
        data: profiles || [], 
        count: userIds.length,
        userRoleMap
      };
    }

    // For specific roles, first get all user IDs with that role
    if (role === 'user') {
      // For 'user' role, get users who have 'user' role but NOT 'member' or 'admin'
      const { data: adminUsers } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');
      
      const { data: memberUsers } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'member');

      const { data: userRoleUsers, error: userRoleError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'user');

      if (userRoleError) throw userRoleError;

      const excludeIds = [
        ...(adminUsers?.map(u => u.user_id) || []),
        ...(memberUsers?.map(u => u.user_id) || [])
      ];

      const basicUserIds = (userRoleUsers || [])
        .map(u => u.user_id)
        .filter(id => !excludeIds.includes(id));

      console.log(`Basic user IDs found: ${basicUserIds.length}`);

      if (basicUserIds.length === 0) {
        return { data: [], count: 0, userRoleMap: {} };
      }

      // Apply pagination to the filtered user IDs
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      const paginatedUserIds = basicUserIds.slice(from, to + 1);

      console.log(`Paginated basic user IDs (page ${page}): ${paginatedUserIds.length}`);

      // Fetch profiles for these specific user IDs
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', paginatedUserIds)
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      console.log(`Fetched profiles for basic users: ${profiles?.length || 0}`);

      // Get all roles for these users
      const { data: allUserRoles, error: allRolesError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', paginatedUserIds);

      if (allRolesError) throw allRolesError;

      const userRoleMap: Record<string, UserRole[]> = {};
      allUserRoles?.forEach(ur => {
        if (!userRoleMap[ur.user_id]) {
          userRoleMap[ur.user_id] = [];
        }
        userRoleMap[ur.user_id].push(ur.role as UserRole);
      });

      console.log(`Successfully fetched ${profiles?.length || 0} basic user profiles. Total basic users: ${basicUserIds.length}`);
      
      return { 
        data: profiles || [], 
        count: basicUserIds.length,
        userRoleMap
      };
    } else {
      // For admin/member roles, get user IDs with that role
      const { data: roleUsers, error: roleError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', role);
      
      if (roleError) throw roleError;
      
      const userIds = roleUsers?.map(u => u.user_id) || [];
      
      console.log(`User IDs with role ${role}: ${userIds.length}`);
      
      if (userIds.length === 0) {
        return { data: [], count: 0, userRoleMap: {} };
      }

      // Apply pagination to the filtered user IDs
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      const paginatedUserIds = userIds.slice(from, to + 1);

      console.log(`Paginated user IDs for role ${role} (page ${page}): ${paginatedUserIds.length}`);

      // Fetch profiles for these specific user IDs
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', paginatedUserIds)
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      console.log(`Fetched profiles for role ${role}: ${profiles?.length || 0}`);

      // Get all roles for these users
      const { data: allUserRoles, error: allRolesError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', paginatedUserIds);

      if (allRolesError) throw allRolesError;

      const userRoleMap: Record<string, UserRole[]> = {};
      allUserRoles?.forEach(ur => {
        if (!userRoleMap[ur.user_id]) {
          userRoleMap[ur.user_id] = [];
        }
        userRoleMap[ur.user_id].push(ur.role as UserRole);
      });

      console.log(`Successfully fetched ${profiles?.length || 0} profiles with role: ${role}. Total: ${userIds.length}`);
      
      return { 
        data: profiles || [], 
        count: userIds.length,
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
    // Get total count of users who have any role (from user_roles table)
    const { data: allUserRoles, error: allRolesError } = await supabase
      .from('user_roles')
      .select('user_id');
    
    if (allRolesError) throw allRolesError;
    
    // Get unique user IDs who have roles
    const uniqueUserIds = [...new Set(allUserRoles?.map(ur => ur.user_id) || [])];
    const totalCount = uniqueUserIds.length;
    
    // Get admin count
    const { data: adminRoles, error: adminError } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin');
    
    if (adminError) throw adminError;
    
    const adminCount = [...new Set(adminRoles?.map(ur => ur.user_id) || [])].length;
    
    // Get member count
    const { data: memberRoles, error: memberError } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'member');
    
    if (memberError) throw memberError;
    
    const memberCount = [...new Set(memberRoles?.map(ur => ur.user_id) || [])].length;
    
    // Get basic user count (users who have 'user' role but not 'member' or 'admin')
    const { data: userRoles, error: userRolesError } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'user');
    
    if (userRolesError) throw userRolesError;
    
    const adminUserIds = new Set(adminRoles?.map(ur => ur.user_id) || []);
    const memberUserIds = new Set(memberRoles?.map(ur => ur.user_id) || []);
    
    const basicUserCount = (userRoles || [])
      .map(ur => ur.user_id)
      .filter(id => !adminUserIds.has(id) && !memberUserIds.has(id))
      .length;
    
    console.log("Role counts:", {
      'all': totalCount,
      'admin': adminCount,
      'member': memberCount,
      'user': basicUserCount
    });
    
    return {
      'all': totalCount,
      'admin': adminCount,
      'member': memberCount,
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
