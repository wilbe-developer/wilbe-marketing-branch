
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserProfile, UserRole } from "@/types";
import UserRoleRow from "./UserRoleRow";

interface UsersTableProps {
  users: UserProfile[];
  onRoleToggle: (userId: string, role: UserRole, hasRole: boolean) => void;
}

const UsersTable = ({ users, onRoleToggle }: UsersTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Current Role</TableHead>
            <TableHead>Admin</TableHead>
            <TableHead>Member</TableHead>
            <TableHead>Last Login</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <UserRoleRow
              key={user.id}
              user={user}
              onRoleToggle={onRoleToggle}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersTable;
