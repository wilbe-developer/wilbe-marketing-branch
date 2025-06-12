
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface UserSelectorProps {
  users: User[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
}

export const UserSelector = ({ 
  users, 
  value, 
  onValueChange, 
  placeholder = "Select a user...",
  emptyMessage = "No users available"
}: UserSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-8"
        />
      </div>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="max-h-60">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <SelectItem key={user.user_id} value={user.user_id}>
                {user.first_name} {user.last_name} ({user.email})
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-users" disabled>
              {searchTerm ? 'No users found' : emptyMessage}
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};
