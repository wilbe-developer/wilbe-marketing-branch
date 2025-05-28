
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
      
      // Fetch users based on the current filter and page
      const { data: fetchedUsers, count } = await fetchUsersByRole(filter, currentPage, pageSize);
      
      setTotalUsers(count);
      
      // Map to UserProfile format with role information
      const enhancedProfiles = mapProfilesToUserProfiles(fetchedUsers);
      
      // Build simplified userRoles map - each user has only one role
      const rolesMap: Record<string, UserRole[]> = {};
      fetchedUsers.forEach((user: any) => {
        const roles: UserRole[] = [];
        
        if (user.user_roles) {
          if (Array.isArray(user.user_roles) && user.user_roles.length > 0) {
            roles.push(user.user_roles[0].role as UserRole);
          } else if (user.user_roles.role) {
            roles.push(user.user_roles.role as UserRole);
          }
        }
        
        rolesMap[user.id] = roles;
        console.log(`User ${user.id} roles:`, roles);
      });
      
      setUserRoles(rolesMap);
      
      console.log(`Successfully processed ${enhancedProfiles.length} user profiles for filter: ${filter}`);
      
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
        // Remove role
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
        // Add role - but first remove any existing role since each user should only have one
        await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId);
        
        // Add the new role
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
