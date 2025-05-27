
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
  const [retryCount, setRetryCount] = useState(0);
  const pageSize = 10;

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setRetryCount(0);
      
      console.log(`Starting fetchUsers for role: ${filter}, page: ${currentPage}`);
      
      // Get role counts for filter indicators with timeout
      const countsPromise = fetchRoleCounts();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 10000)
      );
      
      try {
        const counts = await Promise.race([countsPromise, timeoutPromise]) as Record<UserRole | 'all', number>;
        setRoleCounts(counts);
        console.log('Role counts fetched successfully:', counts);
      } catch (error) {
        console.error('Error fetching role counts:', error);
        toast({
          title: "Warning",
          description: "Role counts may be inaccurate due to timeout",
          variant: "destructive"
        });
      }
      
      // Fetch users based on the current filter and page with timeout
      const usersPromise = fetchUsersByRole(filter, currentPage, pageSize);
      const usersTimeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Users fetch timeout')), 15000)
      );
      
      const { data: fetchedUsers, count, userRoleMap } = await Promise.race([
        usersPromise, 
        usersTimeoutPromise
      ]) as { data: any[], count: number, userRoleMap: Record<string, UserRole[]> };
      
      setTotalUsers(count);
      setUserRoles(userRoleMap || {});
      
      // Map to UserProfile format with role information
      const enhancedProfiles = mapProfilesToUserProfiles(fetchedUsers, userRoleMap);
      
      console.log(`Successfully processed ${enhancedProfiles.length} user profiles`);
      console.log(`Total users for filter ${filter}: ${count}`);
      
      setUsers(enhancedProfiles);
    } catch (error) {
      console.error("Error in fetchUsers:", error);
      
      // Implement retry logic for timeouts
      if (error instanceof Error && (error.message.includes('timeout') || error.message.includes('Timeout')) && retryCount < 2) {
        console.log(`Retrying fetchUsers (attempt ${retryCount + 1})`);
        setRetryCount(prev => prev + 1);
        setTimeout(() => fetchUsers(), 2000 * (retryCount + 1)); // Progressive backoff
        return;
      }
      
      toast({
        title: "Error",
        description: error instanceof Error && error.message.includes('timeout') 
          ? "Request timed out. Please try a smaller page size or contact support if this persists."
          : "Failed to fetch users. Please try again.",
        variant: "destructive"
      });
      
      // Set empty state on final failure
      setUsers([]);
      setTotalUsers(0);
      setUserRoles({});
    } finally {
      setLoading(false);
    }
  }, [filter, currentPage, toast, retryCount]);

  const handleFilterChange = (newFilter: UserRole | 'all') => {
    console.log(`Changing filter from ${filter} to ${newFilter}`);
    setFilter(newFilter);
    setCurrentPage(1); // Reset to first page when changing filters
    setRetryCount(0); // Reset retry count
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setRetryCount(0); // Reset retry count
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
        // Add role
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
      try {
        const counts = await fetchRoleCounts();
        setRoleCounts(counts);
      } catch (error) {
        console.error('Error updating role counts:', error);
      }
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
