
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
        const searchTermLower = searchTerm.trim().toLowerCase();
        const searchWords = searchTermLower.split(' ').filter(word => word.length > 0);
        
        if (searchWords.length === 1) {
          // Single word search - search across individual fields
          const searchPattern = `%${searchWords[0]}%`;
          query = query.or(`first_name.ilike.${searchPattern},last_name.ilike.${searchPattern},email.ilike.${searchPattern}`);
        } else if (searchWords.length > 1) {
          // Multi-word search - use SQL CONCAT for full name matching
          const fullNamePattern = `%${searchTermLower}%`;
          const firstWordPattern = `%${searchWords[0]}%`;
          const lastWordPattern = `%${searchWords[searchWords.length - 1]}%`;
          
          // Search for full name match OR individual word matches
          query = query.or([
            `concat(first_name, ' ', last_name).ilike.${fullNamePattern}`,
            `first_name.ilike.${firstWordPattern}`,
            `last_name.ilike.${lastWordPattern}`,
            `email.ilike.${fullNamePattern}`
          ].join(','));
        }
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
