
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

interface SprintProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  team_status: string;
  company_incorporated: boolean;
  received_funding: boolean;
  created_at: string;
  market_known: boolean;
  experiment_validated: boolean;
  job_type: string;
  is_scientist_engineer: boolean;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  [key: string]: any; // For any other properties in the profile
}

interface SprintProfilesTableProps {
  profiles: SprintProfile[];
  onViewProfile: (profile: SprintProfile) => void;
}

const SprintProfilesTable: React.FC<SprintProfilesTableProps> = ({ profiles, onViewProfile }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Sprint Profiles</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Team Status</TableHead>
                <TableHead>Incorporated</TableHead>
                <TableHead>Funding</TableHead>
                <TableHead>Scientist/Engineer</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.slice(0, 10).map((profile) => (
                <TableRow key={profile.id}>
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
                    {profile.utm_source ? (
                      <Badge variant="outline">{profile.utm_source}</Badge>
                    ) : (
                      <Badge variant="outline">direct</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onViewProfile(profile)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {profiles.length > 10 && (
          <div className="text-center mt-4 text-sm text-muted-foreground">
            Showing 10 of {profiles.length} profiles
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SprintProfilesTable;
