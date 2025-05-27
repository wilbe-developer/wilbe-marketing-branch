
import { UserProfile, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches users with specified role using database-level pagination
 */
export const fetchUsersByRole = async (role: UserRole | 'all', page = 1, pageSize = 20) => {
  try {
    console.log(`\n=== FETCHING USERS BY ROLE (OPTIMIZED) ===`);
    console.log(`Role: ${role}, Page: ${page}, PageSize: ${pageSize}`);
    
    const from = (page - 1) * pageSize;
    
    if (role === 'all') {
      console.log('Processing all users with any role');
      
      // Get all users who have any role AND a profile with database-level pagination
      const { data: profiles, error: profilesError, count } = await supabase
        .from('profiles')
        .select('*, user_roles!inner(role)', { count: 'exact' })
        .range(from, from + pageSize - 1)
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching all users:', profilesError);
        throw profilesError;
      }
      
      console.log(`Fetched ${profiles?.length || 0} profiles directly from database`);
      console.log(`Total count: ${count}`);
      
      // Get all roles for these users
      const userIds = profiles?.map(p => p.id) || [];
      const { data: allUserRoles, error: allRolesError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', userIds);
      
      if (allRolesError) throw allRolesError;
      
      const userRoleMap: Record<string, UserRole[]> = {};
      allUserRoles?.forEach(ur => {
        if (!userRoleMap[ur.user_id]) {
          userRoleMap[ur.user_id] = [];
        }
        userRoleMap[ur.user_id].push(ur.role as UserRole);
      });
      
      console.log(`Successfully processed ${profiles?.length || 0} user profiles for 'all' filter`);
      
      return { 
        data: profiles || [], 
        count: count || 0,
        userRoleMap
      };
    }

    if (role === 'user') {
      console.log('Processing basic users (user role without member/admin)');
      
      // Get users who have 'user' role but NOT 'member' or 'admin' using a more efficient query
      const { data: profiles, error: profilesError, count } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles!inner(role)
        `, { count: 'exact' })
        .eq('user_roles.role', 'user')
        .not('id', 'in', `(
          SELECT user_id FROM user_roles 
          WHERE role IN ('admin', 'member')
        )`)
        .range(from, from + pageSize - 1)
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching basic users:', profilesError);
        throw profilesError;
      }

      console.log(`Fetched ${profiles?.length || 0} basic user profiles directly from database`);
      console.log(`Total basic users count: ${count}`);

      // Get all roles for these users
      const userIds = profiles?.map(p => p.id) || [];
      const { data: allUserRoles, error: allRolesError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', userIds);

      if (allRolesError) throw allRolesError;

      const userRoleMap: Record<string, UserRole[]> = {};
      allUserRoles?.forEach(ur => {
        if (!userRoleMap[ur.user_id]) {
          userRoleMap[ur.user_id] = [];
        }
        userRoleMap[ur.user_id].push(ur.role as UserRole);
      });

      console.log(`Successfully processed ${profiles?.length || 0} basic user profiles`);
      
      return { 
        data: profiles || [], 
        count: count || 0,
        userRoleMap
      };
    } else {
      console.log(`Processing users with role: ${role}`);
      
      // For admin/member roles, get users with database-level pagination
      const { data: profiles, error: profilesError, count } = await supabase
        .from('profiles')
        .select('*, user_roles!inner(role)', { count: 'exact' })
        .eq('user_roles.role', role)
        .range(from, from + pageSize - 1)
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error(`Error fetching users with role ${role}:`, profilesError);
        throw profilesError;
      }

      console.log(`Fetched ${profiles?.length || 0} profiles for role ${role} directly from database`);
      console.log(`Total count for role ${role}: ${count}`);

      // Get all roles for these users
      const userIds = profiles?.map(p => p.id) || [];
      const { data: allUserRoles, error: allRolesError } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .in('user_id', userIds);

      if (allRolesError) throw allRolesError;

      const userRoleMap: Record<string, UserRole[]> = {};
      allUserRoles?.forEach(ur => {
        if (!userRoleMap[ur.user_id]) {
          userRoleMap[ur.user_id] = [];
        }
        userRoleMap[ur.user_id].push(ur.role as UserRole);
      });

      console.log(`Successfully processed ${profiles?.length || 0} profiles with role: ${role}`);
      
      return { 
        data: profiles || [], 
        count: count || 0,
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
 * Counts users by role type using optimized queries
 */
export const fetchRoleCounts = async (): Promise<Record<UserRole | 'all', number>> => {
  try {
    console.log('\n=== FETCHING ROLE COUNTS (OPTIMIZED) ===');
    
    // Get total count of users who have any role AND a profile
    const { count: totalCount, error: totalError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .not('id', 'is', null)
      .in('id', supabase.from('user_roles').select('user_id'));
    
    if (totalError) {
      console.error('Error getting total count:', totalError);
      // Fallback to simpler count
      const { count: fallbackCount } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });
      console.log(`Using fallback total count: ${fallbackCount || 0}`);
    }
    
    console.log(`Total users with profiles: ${totalCount || 0}`);
    
    // Get admin count
    const { count: adminCount, error: adminError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .in('id', supabase.from('user_roles').select('user_id').eq('role', 'admin'));
    
    if (adminError) console.error('Error getting admin count:', adminError);
    console.log(`Admin users: ${adminCount || 0}`);
    
    // Get member count
    const { count: memberCount, error: memberError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .in('id', supabase.from('user_roles').select('user_id').eq('role', 'member'));
    
    if (memberError) console.error('Error getting member count:', memberError);
    console.log(`Member users: ${memberCount || 0}`);
    
    // Get basic user count (users who have 'user' role but not 'member' or 'admin')
    const { count: basicUserCount, error: basicUserError } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .in('id', supabase.from('user_roles').select('user_id').eq('role', 'user'))
      .not('id', 'in', supabase.from('user_roles').select('user_id').in('role', ['admin', 'member']));
    
    if (basicUserError) console.error('Error getting basic user count:', basicUserError);
    console.log(`Basic users: ${basicUserCount || 0}`);
    
    const counts = {
      'all': totalCount || 0,
      'admin': adminCount || 0,
      'member': memberCount || 0,
      'user': basicUserCount || 0
    };
    
    console.log("Final role counts:", counts);
    
    return counts;
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
