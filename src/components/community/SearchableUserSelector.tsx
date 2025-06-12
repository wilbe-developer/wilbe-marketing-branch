import { useState, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface SearchableUserSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
}

export const SearchableUserSelector = ({ 
  value, 
  onValueChange, 
  placeholder = "Select a user...",
  emptyMessage = "No users found"
}: SearchableUserSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Server-side user search
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['searchable-users', debouncedSearchTerm],
    queryFn: async () => {
      console.log("Searching users with term:", debouncedSearchTerm);
      
      let query = supabase
        .from('unified_profiles')
        .select('user_id, first_name, last_name, email')
        .order('created_at', { ascending: false });

      // Add search filter if search term exists
      if (debouncedSearchTerm.trim()) {
        const searchPattern = `%${debouncedSearchTerm.trim()}%`;
        query = query.or(`first_name.ilike.${searchPattern},last_name.ilike.${searchPattern},email.ilike.${searchPattern}`);
      }

      // Limit results to keep UI responsive
      query = query.limit(50);

      const { data, error } = await query;
      
      if (error) {
        console.error("Error searching users:", error);
        return [];
      }
      
      console.log(`Found ${data?.length || 0} users for search term:`, debouncedSearchTerm);
      return data || [];
    },
    enabled: true // Always enabled, will show recent users when no search term
  });

  // Find selected user
  const selectedUser = users.find(user => user.user_id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedUser ? (
            `${selectedUser.first_name} ${selectedUser.last_name} (${selectedUser.email})`
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" style={{ width: 'var(--radix-popover-trigger-width)' }}>
        <Command>
          <CommandInput 
            placeholder="Search users by name or email..." 
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList className="max-h-80">
            <CommandEmpty>
              {isLoading ? "Searching..." : emptyMessage}
            </CommandEmpty>
            <CommandGroup>
              {users.map((user) => (
                <CommandItem
                  key={user.user_id}
                  value={user.user_id}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === user.user_id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {user.first_name} {user.last_name} ({user.email})
                </CommandItem>
              ))}
            </CommandGroup>
            {users.length > 0 && (
              <div className="px-2 py-1 text-xs text-muted-foreground border-t">
                {users.length} user{users.length !== 1 ? 's' : ''} found
                {debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
