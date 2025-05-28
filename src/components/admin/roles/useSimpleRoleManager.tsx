
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { UserProfile, UserRole } from "@/types";
import { 
  getSimpleRoleCounts, 
  getSimpleUsersWithRoles, 
  mapToUserProfiles,
  updateSimpleUserRole
} from "./SimpleRoleUtils";

export const useSimpleRoleManager = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
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

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      console.log(`[useSimpleRoleManager] Fetching users for filter: ${filter}, page: ${currentPage}`);
      
      // Get role counts
      const counts = await getSimpleRoleCounts();
      setRoleCounts(counts);
      
      // Get users with roles
      const { data: fetchedUsers, count } = await getSimpleUsersWithRoles(filter, currentPage, pageSize);
      
      setTotalUsers(count);
      
      // Map to UserProfile format
      const userProfiles = mapToUserProfiles(fetchedUsers);
      
      console.log(`[useSimpleRoleManager] Successfully fetched ${userProfiles.length} users`);
      setUsers(userProfiles);
    } catch (error) {
      console.error(`[useSimpleRoleManager] Error fetching users:`, error);
      toast({
        title: "Error",
        description: `Failed to fetch users. ${error.message || 'Please try again.'}`,
        variant: "destructive"
      });
      setUsers([]);
      setTotalUsers(0);
    } finally {
      setLoading(false);
    }
  }, [filter, currentPage, toast]);

  const handleFilterChange = (newFilter: UserRole | 'all') => {
    console.log(`[useSimpleRoleManager] Changing filter from ${filter} to ${newFilter}`);
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    console.log(`[useSimpleRoleManager] Changing page from ${currentPage} to ${page}`);
    setCurrentPage(page);
  };

  const handleRoleToggle = async (userId: string, role: UserRole, hasRole: boolean) => {
    try {
      console.log(`[useSimpleRoleManager] Toggling role ${role} for user ${userId}. Has role: ${hasRole}`);
      
      await updateSimpleUserRole(userId, role, hasRole);
      
      toast({
        title: hasRole 
          ? `${role.charAt(0).toUpperCase() + role.slice(1)} Role Removed`
          : `${role.charAt(0).toUpperCase() + role.slice(1)} Role Added`,
        description: hasRole 
          ? `${role.charAt(0).toUpperCase() + role.slice(1)} privileges have been removed.`
          : `${role.charAt(0).toUpperCase() + role.slice(1)} access has been granted.`
      });
      
      // Refresh data
      console.log(`[useSimpleRoleManager] Role toggle completed, refreshing users...`);
      fetchUsers();
    } catch (error) {
      console.error("[useSimpleRoleManager] Error updating role:", error);
      toast({
        title: "Error",
        description: "Failed to update role. Please try again.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    console.log(`[useSimpleRoleManager] useEffect triggered: filter=${filter}, currentPage=${currentPage}`);
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    filter,
    handleRoleToggle,
    handleFilterChange,
    currentPage,
    totalPages: Math.ceil(totalUsers / pageSize),
    handlePageChange,
    roleCounts
  };
};
