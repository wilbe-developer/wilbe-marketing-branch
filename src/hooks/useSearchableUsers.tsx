import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useSearchableUsers = (searchTerm: string = '', enabled: boolean = true) => {
  return useQuery({
    queryKey: ['searchable-users', searchTerm],
    queryFn: async () => {
      console.log("Searching users with term:", searchTerm);
      
      let query = supabase
        .from('unified_profiles')
        .select('user_id, first_name, last_name, email')
        .order('created_at', { ascending: false });

      // Add search filter if search term exists
      if (searchTerm.trim()) {
        const searchPattern = `%${searchTerm.trim()}%`;
        query = query.or(`first_name.ilike.${searchPattern},last_name.ilike.${searchPattern},email.ilike.${searchPattern}`);
      }

      // Limit results to keep UI responsive
      query = query.limit(50);

      const { data, error } = await query;
      
      if (error) {
        console.error("Error searching users:", error);
        return [];
      }
      
      console.log(`Found ${data?.length || 0} users for search term:`, searchTerm);
      return data || [];
    },
    enabled
  });
};
