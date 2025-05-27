import { UserProfile, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Get user IDs that exist in both user_roles and profiles tables
 */
const getUserIdsWithProfiles = async (roleFilter?: UserRole): Promise<string[]> => {
  try {
    // Get user IDs from user_roles (with optional role filter)
    let userRolesQuery = supabase
      .from('user_roles')
      .select('user_id');
    
    if (roleFilter) {
      userRolesQuery = userRolesQuery.eq('role', roleFilter);
    }
    
    const { data: userRoles, error: userRolesError } = await userRolesQuery;
    if (userRolesError) throw userRolesError;
    
    const userRoleIds = [...new Set(userRoles?.map(ur => ur.user_id) || [])];
    console.log(`Found ${userRoleIds.length} unique user IDs in user_roles${roleFilter ? ` with role ${roleFilter}` : ''}`);
    
    // Get user IDs that also exist in profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .in('id', userRoleIds);
    
    if (profilesError) throw profilesError;
    
    const profileIds = profiles?.map(p => p.id) || [];
    console.log(`Found ${profileIds.length} of those user IDs that also have profiles`);
    
    if (userRoleIds.length !== profileIds.length) {
      const missingProfiles = userRoleIds.filter(id => !profileIds.includes(id));
      console.warn(`${missingProfiles.length} user IDs have roles but no profiles:`, missingProfiles);
    }
    
    return profileIds;
  } catch (error) {
    console.error('Error getting user IDs with profiles:', error);
    return [];
  }
};

/**
 * Fetches users with specified role using a more efficient approach
 */
export const fetchUsersByRole = async (role: UserRole | 'all', page = 1, pageSize = 20) => {
  try {
    console.log(`\n=== FETCHING USERS BY ROLE ===`);
    console.log(`Role: ${role}, Page: ${page}, PageSize: ${pageSize}`);
    
    if (role === 'all') {
      // Get all user IDs that have any role AND a profile
      const userIds = await getUserIdsWithProfiles();
      
      console.log(`Total users with roles and profiles: ${userIds.length}`);
      
      if (userIds.length === 0) {
        console.log('No users found with roles and profiles');
        return { 
          data: [], 
          count: 0,
          userRoleMap: {}
        };
      }

      // Apply pagination to user IDs - FIXED PAGINATION LOGIC
      const from = (page - 1) * pageSize;
      const paginatedUserIds = userIds.slice(from, from + pageSize);
      
      console.log(`Pagination: showing ${paginatedUserIds.length} users (${from + 1}-${from + paginatedUserIds.length} of ${userIds.length})`);
      console.log(`Paginated user IDs:`, paginatedUserIds);

      // Fetch profiles for paginated user IDs
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', paginatedUserIds)
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;
      
      console.log(`Fetched ${profiles?.length || 0} profiles from database`);
      
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
      
      console.log(`Role map created for ${Object.keys(userRoleMap).length} users`);
      console.log(`Successfully fetched ${profiles?.length || 0} profiles for 'all' filter`);
      
      return { 
        data: profiles || [], 
        count: userIds.length,
        userRoleMap
      };
    }

    // For specific roles
    if (role === 'user') {
      console.log('Processing basic users (user role without member/admin)');
      
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

      const candidateUserIds = (userRoleUsers || [])
        .map(u => u.user_id)
        .filter(id => !excludeIds.includes(id));

      console.log(`Found ${candidateUserIds.length} candidate basic user IDs`);
      console.log(`Candidate IDs:`, candidateUserIds);

      // Now filter to only those that have profiles
      const { data: profilesCheck, error: profilesCheckError } = await supabase
        .from('profiles')
        .select('id')
        .in('id', candidateUserIds);
      
      if (profilesCheckError) throw profilesCheckError;
      
      const basicUserIds = profilesCheck?.map(p => p.id) || [];
      console.log(`Found ${basicUserIds.length} basic users with profiles`);
      console.log(`Basic user IDs with profiles:`, basicUserIds);

      if (candidateUserIds.length !== basicUserIds.length) {
        const missingProfiles = candidateUserIds.filter(id => !basicUserIds.includes(id));
        console.warn(`${missingProfiles.length} basic user IDs have no profiles:`, missingProfiles);
      }

      if (basicUserIds.length === 0) {
        console.log('No basic users found');
        return { data: [], count: 0, userRoleMap: {} };
      }

      // Apply pagination to the filtered user IDs - FIXED PAGINATION LOGIC
      const from = (page - 1) * pageSize;
      const paginatedUserIds = basicUserIds.slice(from, from + pageSize);

      console.log(`Pagination for basic users: showing ${paginatedUserIds.length} users (${from + 1}-${from + paginatedUserIds.length} of ${basicUserIds.length})`);
      console.log(`Paginated basic user IDs:`, paginatedUserIds);

      // Fetch profiles for these specific user IDs
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', paginatedUserIds)
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      console.log(`Fetched ${profiles?.length || 0} basic user profiles from database`);

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
      console.log(`Processing users with role: ${role}`);
      
      // For admin/member roles, get user IDs that have that role AND a profile
      const userIds = await getUserIdsWithProfiles(role);
      
      console.log(`Found ${userIds.length} users with role ${role} and profiles`);
      console.log(`User IDs for role ${role}:`, userIds);
      
      if (userIds.length === 0) {
        console.log(`No users found with role ${role}`);
        return { data: [], count: 0, userRoleMap: {} };
      }

      // Apply pagination to the filtered user IDs - FIXED PAGINATION LOGIC
      const from = (page - 1) * pageSize;
      const paginatedUserIds = userIds.slice(from, from + pageSize);

      console.log(`Pagination for role ${role}: showing ${paginatedUserIds.length} users (${from + 1}-${from + paginatedUserIds.length} of ${userIds.length})`);
      console.log(`Paginated user IDs for role ${role}:`, paginatedUserIds);

      // Fetch profiles for these specific user IDs
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', paginatedUserIds)
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      console.log(`Fetched ${profiles?.length || 0} profiles for role ${role} from database`);

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
 * Counts users by role type using consistent logic
 */
export const fetchRoleCounts = async (): Promise<Record<UserRole | 'all', number>> => {
  try {
    console.log('\n=== FETCHING ROLE COUNTS ===');
    
    // Get total count of users who have any role AND a profile
    const allUserIds = await getUserIdsWithProfiles();
    const totalCount = allUserIds.length;
    console.log(`Total users with roles and profiles: ${totalCount}`);
    
    // Get admin count
    const adminUserIds = await getUserIdsWithProfiles('admin');
    const adminCount = adminUserIds.length;
    console.log(`Admin users: ${adminCount}`);
    
    // Get member count
    const memberUserIds = await getUserIdsWithProfiles('member');
    const memberCount = memberUserIds.length;
    console.log(`Member users: ${memberCount}`);
    
    // Get basic user count (users who have 'user' role but not 'member' or 'admin')
    const { data: adminUsers } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin');
    
    const { data: memberUsers } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'member');

    const { data: userRoles, error: userRolesError } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'user');
    
    if (userRolesError) throw userRolesError;
    
    const adminUserIds_basic = new Set(adminUsers?.map(ur => ur.user_id) || []);
    const memberUserIds_basic = new Set(memberUsers?.map(ur => ur.user_id) || []);
    
    const candidateBasicUsers = (userRoles || [])
      .map(ur => ur.user_id)
      .filter(id => !adminUserIds_basic.has(id) && !memberUserIds_basic.has(id));
    
    // Filter to only those with profiles
    const { data: basicUserProfiles } = await supabase
      .from('profiles')
      .select('id')
      .in('id', candidateBasicUsers);
    
    const basicUserCount = basicUserProfiles?.length || 0;
    console.log(`Basic users: ${basicUserCount}`);
    
    const counts = {
      'all': totalCount,
      'admin': adminCount,
      'member': memberCount,
      'user': basicUserCount
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
