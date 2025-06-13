import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, ChevronsUpDown, Loader2, X } from 'lucide-react';
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
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Server-side user search with full name support
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
        
        // Build multiple OR conditions for better compatibility
        query = query.or([
          `first_name.ilike.${searchPattern}`,
          `last_name.ilike.${searchPattern}`,
          `email.ilike.${searchPattern}`
        ].join(','));
        
        // Add a separate query for full name search using textSearch or additional filter
        // This is a workaround for the concatenation issue
        const searchTermWords = debouncedSearchTerm.trim().split(' ');
        if (searchTermWords.length > 1) {
          // For multi-word searches, we'll filter results client-side after getting broader results
          query = query.or([
            `first_name.ilike.%${searchTermWords[0]}%`,
            `last_name.ilike.%${searchTermWords[searchTermWords.length - 1]}%`,
            `email.ilike.${searchPattern}`
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
      
      let filteredData = data || [];
      
      // Client-side filter for full name matching when we have multiple words
      if (debouncedSearchTerm.trim()) {
        const searchTermLower = debouncedSearchTerm.toLowerCase();
        filteredData = filteredData.filter(user => {
          const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
          const email = user.email?.toLowerCase() || '';
          const firstName = user.first_name?.toLowerCase() || '';
          const lastName = user.last_name?.toLowerCase() || '';
          
          return fullName.includes(searchTermLower) || 
                 email.includes(searchTermLower) ||
                 firstName.includes(searchTermLower) ||
                 lastName.includes(searchTermLower);
        });
      }
      
      console.log(`Found ${filteredData?.length || 0} users for search term:`, debouncedSearchTerm);
      return filteredData;
    },
    enabled: true // Always enabled, will show recent users when no search term
  });

  // Find selected user
  const selectedUser = users.find(user => user.user_id === value);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
        setSearchTerm('');
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleUserSelect = (userId: string) => {
    console.log("Selecting user:", userId);
    onValueChange(userId === value ? "" : userId);
    setOpen(false);
    setSearchTerm('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Input change:", e.target.value);
    setSearchTerm(e.target.value);
  };

  const handleInputFocus = () => {
    setOpen(true);
  };

  const handleClearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();
    onValueChange("");
    setOpen(false);
    setSearchTerm('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Main Input/Button */}
      {!open ? (
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={false}
          className="w-full justify-between"
          onClick={() => setOpen(true)}
        >
          {selectedUser ? (
            `${selectedUser.first_name} ${selectedUser.last_name} (${selectedUser.email})`
          ) : (
            placeholder
          )}
          <div className="flex items-center gap-1">
            {selectedUser && (
              <X 
                className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100" 
                onClick={handleClearSelection}
              />
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      ) : (
        <Input
          ref={inputRef}
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          className="w-full"
        />
      )}

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto rounded-md border bg-popover shadow-md">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-muted-foreground">Searching...</span>
            </div>
          ) : users.length > 0 ? (
            <>
              {users.map((user) => (
                <div
                  key={user.user_id}
                  className="flex items-center p-2 hover:bg-accent cursor-pointer"
                  onClick={() => handleUserSelect(user.user_id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === user.user_id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="flex-1 text-sm">
                    {user.first_name} {user.last_name} ({user.email})
                  </span>
                </div>
              ))}
              <div className="px-2 py-1 text-xs text-muted-foreground border-t bg-muted/50">
                {users.length} user{users.length !== 1 ? 's' : ''} found
                {debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}
              </div>
            </>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
