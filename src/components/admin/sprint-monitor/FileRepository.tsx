
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, ExternalLink, Search } from 'lucide-react';
import { toast } from 'sonner';

export interface FileRepositoryProps {
  isLoading?: boolean;
  refreshData?: () => void;
}

const FileRepository: React.FC<FileRepositoryProps> = ({ isLoading = false, refreshData }) => {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      
      // Fetch user files
      const { data: filesData, error: filesError } = await supabase
        .from('user_files')
        .select('*')
        .order('uploaded_at', { ascending: false });
        
      if (filesError) throw filesError;
      
      // Fetch user info for each file
      const userIds = Array.from(new Set(filesData.map(file => file.user_id)));
      const { data: profilesData, error: profilesError } = await supabase
        .from('sprint_profiles')
        .select('user_id, name, email')
        .in('user_id', userIds);
        
      if (profilesError) throw profilesError;
      
      // Create a map for quick lookup
      const userMap = new Map();
      profilesData.forEach(profile => {
        userMap.set(profile.user_id, {
          name: profile.name || 'Unknown User',
          email: profile.email || 'No Email'
        });
      });
      
      // Combine the data
      const enrichedFiles = filesData.map(file => {
        const userInfo = userMap.get(file.user_id) || { name: 'Unknown User', email: 'No Email' };
        return {
          ...file,
          userName: userInfo.name,
          userEmail: userInfo.email
        };
      });
      
      setFiles(enrichedFiles);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  // Filter files based on search term
  const filteredFiles = files.filter(file => {
    const searchString = searchTerm.toLowerCase();
    return (
      file.file_name.toLowerCase().includes(searchString) ||
      file.userName.toLowerCase().includes(searchString) ||
      file.userEmail.toLowerCase().includes(searchString)
    );
  });

  if (isLoading || loading) {
    return (
      <div className="flex justify-center p-6">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        No files have been uploaded yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search files or users..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => {
          fetchFiles();
          if (refreshData) refreshData();
        }}>
          Refresh
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Filename</TableHead>
            <TableHead>Uploaded By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredFiles.map((file) => (
            <TableRow key={file.id}>
              <TableCell className="font-medium">{file.file_name}</TableCell>
              <TableCell>
                <div>{file.userName}</div>
                <div className="text-xs text-gray-500">{file.userEmail}</div>
              </TableCell>
              <TableCell>{new Date(file.uploaded_at).toLocaleString()}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" size="sm" asChild>
                    <a href={file.view_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={file.download_url} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default FileRepository;
