import { UserProfile, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches users with specified role using a more efficient approach
 */
export const fetchUsersByRole = async (role: UserRole | 'all', page = 1, pageSize = 20) => {
  try {
    if (role === 'all') {
      // For 'all', fetch profiles directly with pagination
      let profilesQuery = supabase.from('profiles')
        .select('*', { count: 'exact' });

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
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
      
      // Get roles for these profiles
      const profileIds = profiles.map(profile => profile.id);
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', profileIds);
      
      if (rolesError) throw rolesError;
      
      const userRoleMap: Record<string, UserRole[]> = {};
      userRoles?.forEach(ur => {
        if (!userRoleMap[ur.user_id]) {
          userRoleMap[ur.user_id] = [];
        }
        userRoleMap[ur.user_id].push(ur.role as UserRole);
      });
      
      return { 
        data: profiles, 
        count: count || 0,
        userRoleMap
      };
    }

    // For specific roles, first get all user IDs with that role
    let roleQuery = supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', role);

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

      const excludeIds = [
        ...(adminUsers?.map(u => u.user_id) || []),
        ...(memberUsers?.map(u => u.user_id) || [])
      ];

      const { data: userRoleUsers, error: userRoleError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'user');

      if (userRoleError) throw userRoleError;

      const basicUserIds = (userRoleUsers || [])
        .map(u => u.user_id)
        .filter(id => !excludeIds.includes(id));

      if (basicUserIds.length === 0) {
        return { data: [], count: 0, userRoleMap: {} };
      }

      // Apply pagination to the filtered user IDs
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      const paginatedUserIds = basicUserIds.slice(from, to + 1);

      // Fetch profiles for these specific user IDs
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', paginatedUserIds)
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

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

      console.log(`Fetched ${profiles?.length || 0} basic user profiles. Total basic users: ${basicUserIds.length}`);
      
      return { 
        data: profiles || [], 
        count: basicUserIds.length,
        userRoleMap
      };
    } else {
      // For admin/member roles, get user IDs with that role
      const { data: roleUsers, error: roleError } = await roleQuery;
      
      if (roleError) throw roleError;
      
      const userIds = roleUsers?.map(u => u.user_id) || [];
      
      if (userIds.length === 0) {
        return { data: [], count: 0, userRoleMap: {} };
      }

      // Apply pagination to the filtered user IDs
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      const paginatedUserIds = userIds.slice(from, to + 1);

      // Fetch profiles for these specific user IDs
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', paginatedUserIds)
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

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

      console.log(`Fetched ${profiles?.length || 0} profiles with role: ${role}. Total: ${userIds.length}`);
      
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
