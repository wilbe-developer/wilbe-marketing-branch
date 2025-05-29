
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ShieldCheck, Users, User } from 'lucide-react';

interface RoleStats {
  totalUsers: number;
  adminCount: number;
  memberCount: number;
  userCount: number;
}

interface RoleStatsCardsProps {
  stats: RoleStats;
}

const RoleStatsCards = ({ stats }: RoleStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Total Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
            <Shield className="h-4 w-4 text-red-500" />
            Admins
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.adminCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.memberCount}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-600">{stats.userCount}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleStatsCards;
