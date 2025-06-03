import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, XCircle, Clock, User, FileText, Eye } from 'lucide-react';
import { useSprintAdminData } from '@/hooks/admin/useSprintAdminData';
import { useProfileApprovals } from '@/hooks/admin/useProfileApprovals';

const UserApprovalsTab = () => {
  const { pendingApprovals, approveUser, refreshData } = useSprintAdminData();
  const { pendingProfiles, approveProfile, rejectProfile, refreshProfiles } = useProfileApprovals();
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  const handleApproveUser = async (userId: string, email: string) => {
    try {
      await approveUser(userId, email);
      await refreshData();
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleApproveProfile = async (profileId: string) => {
    try {
      await approveProfile(profileId);
      await refreshProfiles();
    } catch (error) {
      console.error('Error approving profile:', error);
    }
  };

  const handleRejectProfile = async (profileId: string) => {
    try {
      await rejectProfile(profileId);
      await refreshProfiles();
    } catch (error) {
      console.error('Error rejecting profile:', error);
    }
  };

  const getInitials = (firstName: string | null, lastName: string | null) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return (first + last).toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="both" className="w-full">
        <TabsList>
          <TabsTrigger value="both">Both BSF & Profile</TabsTrigger>
          <TabsTrigger value="bsf">BSF Only</TabsTrigger>
          <TabsTrigger value="profile">Profile Only</TabsTrigger>
        </TabsList>

        <TabsContent value="both" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  BSF Approvals ({pendingApprovals?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingApprovals && pendingApprovals.length > 0 ? (
                  <div className="space-y-3">
                    {pendingApprovals.slice(0, 3).map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{user.email}</p>
                          <p className="text-sm text-gray-500">
                            Applied: {formatDate(user.created_at)}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleApproveUser(user.id, user.email)}
                          className="flex items-center gap-1"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Approve
                        </Button>
                      </div>
                    ))}
                    {pendingApprovals.length > 3 && (
                      <p className="text-sm text-gray-500 text-center">
                        +{pendingApprovals.length - 3} more...
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No pending BSF approvals</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Profile Approvals ({pendingProfiles?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingProfiles && pendingProfiles.length > 0 ? (
                  <div className="space-y-3">
                    {pendingProfiles.slice(0, 3).map((profile) => (
                      <div key={profile.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={profile.avatar || undefined} />
                            <AvatarFallback>
                              {getInitials(profile.first_name, profile.last_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {profile.first_name} {profile.last_name}
                            </p>
                            <p className="text-sm text-gray-500">{profile.email}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedProfileId(profile.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApproveProfile(profile.id)}
                            className="flex items-center gap-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    ))}
                    {pendingProfiles.length > 3 && (
                      <p className="text-sm text-gray-500 text-center">
                        +{pendingProfiles.length - 3} more...
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No pending profile approvals</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bsf" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>BSF Approval Queue</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingApprovals && pendingApprovals.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingApprovals.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>{formatDate(user.created_at)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            <Clock className="mr-1 h-3 w-3" />
                            Pending
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() => handleApproveUser(user.id, user.email)}
                            className="flex items-center gap-1"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Approve
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500 text-center py-8">No pending BSF approvals</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Approval Queue</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingProfiles && pendingProfiles.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingProfiles.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={profile.avatar || undefined} />
                              <AvatarFallback>
                                {getInitials(profile.first_name, profile.last_name)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">
                              {profile.first_name} {profile.last_name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{profile.email}</TableCell>
                        <TableCell>{formatDate(profile.created_at)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            <Clock className="mr-1 h-3 w-3" />
                            Pending
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedProfileId(profile.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleApproveProfile(profile.id)}
                              className="flex items-center gap-1"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectProfile(profile.id)}
                              className="flex items-center gap-1"
                            >
                              <XCircle className="h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-gray-500 text-center py-8">No pending profile approvals</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserApprovalsTab;
