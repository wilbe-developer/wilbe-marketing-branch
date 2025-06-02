import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Eye } from 'lucide-react';
import { SprintProfile } from './ProfileDetailCard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface SprintProfilesTableProps {
  profiles: SprintProfile[];
  onViewProfile: (profile: SprintProfile) => void;
  adminUserIds?: string[];
}

const SprintProfilesTable: React.FC<SprintProfilesTableProps> = ({ 
  profiles, 
  onViewProfile,
  adminUserIds = []
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingAccess, setUpdatingAccess] = useState<string | null>(null);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(profiles.length / itemsPerPage);
  
  // Calculate the profiles to display on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProfiles = profiles.slice(indexOfFirstItem, indexOfLastItem);
  
  // Change page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  // Generate page numbers
  const pageNumbers = [];
  const maxPageButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
  
  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // Get non-admin profile count
  const nonAdminProfilesCount = profiles.filter(profile => !adminUserIds.includes(profile.user_id)).length;

  const handleDashboardAccessToggle = async (profileId: string, currentAccess: boolean) => {
    setUpdatingAccess(profileId);
    try {
      const { error } = await supabase
        .from('sprint_profiles')
        .update({ dashboard_access_enabled: !currentAccess })
        .eq('id', profileId);

      if (error) throw error;

      toast.success(`Dashboard access ${!currentAccess ? 'enabled' : 'disabled'} successfully`);
      
      // Trigger a refresh of the profiles data
      window.location.reload();
    } catch (error) {
      console.error('Error updating dashboard access:', error);
      toast.error('Failed to update dashboard access');
    } finally {
      setUpdatingAccess(null);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Sprint Profiles</h3>
          <div className="text-sm text-muted-foreground">
            Showing all {profiles.length} profiles ({nonAdminProfilesCount} non-admin)
          </div>
        </div>
        
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] text-center">Actions</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Team Status</TableHead>
                <TableHead>Incorporated</TableHead>
                <TableHead>Funding</TableHead>
                <TableHead>Scientist/Engineer</TableHead>
                <TableHead>Dashboard Access</TableHead>
                <TableHead>Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentProfiles.map((profile) => (
                <TableRow 
                  key={profile.id}
                  className={adminUserIds.includes(profile.user_id) ? "bg-muted/30" : ""}
                >
                  <TableCell className="text-center">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onViewProfile(profile)}
                      className="p-1 w-8 h-8"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {adminUserIds.includes(profile.user_id) && (
                      <Badge variant="outline" className="ml-1 bg-amber-100">Admin</Badge>
                    )}
                  </TableCell>
                  <TableCell>{profile.name || 'N/A'}</TableCell>
                  <TableCell>{profile.email || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{profile.team_status || 'Not specified'}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={profile.company_incorporated ? "success" : "secondary"}>
                      {profile.company_incorporated ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={profile.received_funding ? "success" : "secondary"}>
                      {profile.received_funding ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={profile.is_scientist_engineer ? "success" : "secondary"}>
                      {profile.is_scientist_engineer ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={profile.dashboard_access_enabled || false}
                      onCheckedChange={() => handleDashboardAccessToggle(profile.id, profile.dashboard_access_enabled || false)}
                      disabled={updatingAccess === profile.id}
                    />
                  </TableCell>
                  <TableCell>
                    {profile.utm_source ? (
                      <Badge variant="outline">{profile.utm_source}</Badge>
                    ) : (
                      <Badge variant="outline">direct</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {profiles.length > itemsPerPage && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {startPage > 1 && (
                  <>
                    <PaginationItem>
                      <PaginationLink onClick={() => handlePageChange(1)}>
                        1
                      </PaginationLink>
                    </PaginationItem>
                    {startPage > 2 && (
                      <PaginationItem>
                        <span className="flex h-9 w-9 items-center justify-center">...</span>
                      </PaginationItem>
                    )}
                  </>
                )}
                
                {pageNumbers.map(number => (
                  <PaginationItem key={number}>
                    <PaginationLink
                      isActive={currentPage === number}
                      onClick={() => handlePageChange(number)}
                    >
                      {number}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                {endPage < totalPages && (
                  <>
                    {endPage < totalPages - 1 && (
                      <PaginationItem>
                        <span className="flex h-9 w-9 items-center justify-center">...</span>
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink onClick={() => handlePageChange(totalPages)}>
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
                
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
        
        <div className="text-center mt-4 text-sm text-muted-foreground">
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, profiles.length)} of {profiles.length} profiles
        </div>
      </CardContent>
    </Card>
  );
};

export default SprintProfilesTable;
