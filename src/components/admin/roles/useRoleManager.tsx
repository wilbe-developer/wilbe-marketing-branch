
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { UserProfile, UserRole } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { fetchUsersByRole, fetchRoleCounts, mapProfilesToUserProfiles } from "./RoleUtils";

export const useRoleManager = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<Record<string, UserRole[]>>({});
  const [filter, setFilter] = useState<UserRole | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [roleCounts, setRoleCounts] = useState<Record<UserRole | 'all', number>>({
    'all': 0,
    'admin': 0,
    'member': 0,
    'user': 0
  });
  const pageSize = 10;

  const fetchUsers = useCallback(async (retryCount = 0) => {
    const maxRetries = 2;
    
    try {
      setLoading(true);
      
      console.log(`Attempting to fetch users for filter: ${filter}, page: ${currentPage}`);
      
      // Get role counts for filter indicators
      const counts = await fetchRoleCounts();
      setRoleCounts(counts);
      
      // Fetch users based on the current filter and page with timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 15000)
      );
      
      const fetchPromise = fetchUsersByRole(filter, currentPage, pageSize);
      
      const { data: fetchedUsers, count } = await Promise.race([
        fetchPromise,
        timeoutPromise
      ]) as any;
      
      setTotalUsers(count);
      
      // Map to UserProfile format with role information
      const enhancedProfiles = mapProfilesToUserProfiles(fetchedUsers);
      
      // Build simplified userRoles map from the fetched data (each user has only one role)
      const rolesMap: Record<string, UserRole[]> = {};
      enhancedProfiles.forEach((user: any) => {
        if (user.actualRole) {
          rolesMap[user.id] = [user.actualRole];
        }
      });
      setUserRoles(rolesMap);
      
      console.log(`Successfully processed ${enhancedProfiles.length} user profiles for filter: ${filter}`);
      console.log('Enhanced profiles sample:', enhancedProfiles[0]);
      
      setUsers(enhancedProfiles);
    } catch (error) {
      console.error(`Error fetching users (attempt ${retryCount + 1}):`, error);
      
      if (retryCount < maxRetries && (error.message?.includes('timeout') || error.message?.includes('network'))) {
        console.log(`Retrying fetch users (attempt ${retryCount + 2}/${maxRetries + 1})...`);
        setTimeout(() => fetchUsers(retryCount + 1), 1000 * (retryCount + 1));
        return;
      }
      
      toast({
        title: "Error",
        description: `Failed to fetch ${filter === 'all' ? 'all users' : `${filter}s`}. ${error.message || 'Please try again.'}`,
        variant: "destructive"
      });
      
      // Set empty state on error
      setUsers([]);
      setTotalUsers(0);
      setUserRoles({});
    } finally {
      setLoading(false);
    }
  }, [filter, currentPage, toast]);

  const handleFilterChange = (newFilter: UserRole | 'all') => {
    console.log(`Changing filter from ${filter} to ${newFilter}`);
    setFilter(newFilter);
    setCurrentPage(1); // Reset to first page when changing filters
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRoleToggle = async (userId: string, role: UserRole, hasRole: boolean) => {
    try {
      if (hasRole) {
        // Remove role (delete the user's role record)
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', role);
          
        if (error) throw error;
        
        toast({
          title: role === "admin" ? "Admin Role Removed" : role === "member" ? "Member Role Removed" : "User Role Removed",
          description: role === "admin" 
            ? "Admin privileges have been removed."
            : role === "member"
            ? "Member access has been revoked."
            : "User role has been removed."
        });
      } else {
        // Since users can only have one role, we need to replace their existing role
        // First delete any existing role
        await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId);
        
        // Then add the new role
        const { error } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role: role
          });
          
        if (error) throw error;
        
        toast({
          title: role === "admin" ? "Admin Role Added" : role === "member" ? "Member Role Added" : "User Role Added",
          description: role === "admin" 
            ? "Admin privileges have been added."
            : role === "member"
            ? "Member access has been granted."
            : "User role has been added."
        });
      }
      
      // Refresh users
      fetchUsers();
      
      // Also update role counts
      const counts = await fetchRoleCounts();
      setRoleCounts(counts);
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Error",
        description: "Failed to update role. Please try again.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    userRoles,
    filter,
    handleRoleToggle,
    handleFilterChange,
    fetchUsers,
    currentPage,
    totalPages: Math.ceil(totalUsers / pageSize),
    handlePageChange,
    roleCounts
  };
};
