
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Download, Eye, File } from 'lucide-react';

interface UploadedFile {
  id: string;
  file_name: string;
  user_name: string;
  user_email: string;
  task_name: string;
  uploaded_at: string;
  view_url: string;
  download_url: string;
}

const FileRepository = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        
        // Fetch files
        const { data: progressData, error: progressError } = await supabase
          .from('user_sprint_progress')
          .select(`
            file_id,
            user_id,
            task_id,
            created_at,
            user_files(id, file_name, view_url, download_url, uploaded_at)
          `)
          .not('file_id', 'is', null);
          
        if (progressError) throw progressError;
        
        // Fetch task titles separately
        const { data: taskData, error: taskError } = await supabase
          .from('sprint_tasks')
          .select('id, title');
          
        if (taskError) throw taskError;
        
        // Create a map of task IDs to titles
        const taskMap = new Map<string, string>();
        if (taskData) {
          taskData.forEach(task => {
            taskMap.set(task.id, task.title);
          });
        }
        
        // Fetch user details
        const { data: profileData, error: profileError } = await supabase
          .from('sprint_profiles')
          .select('user_id, name, email');
          
        if (profileError) throw profileError;
        
        // Process files
        if (progressData && profileData) {
          const processedFiles: UploadedFile[] = [];
          
          progressData.forEach(item => {
            if (!item.user_files) return;
            
            const userProfile = profileData.find(p => p.user_id === item.user_id);
            const taskTitle = taskMap.get(item.task_id) || 'Unknown Task';
            
            processedFiles.push({
              id: item.user_files.id,
              file_name: item.user_files.file_name,
              user_name: userProfile?.name || 'Unknown User',
              user_email: userProfile?.email || 'No Email',
              task_name: taskTitle,
              uploaded_at: item.user_files.uploaded_at,
              view_url: item.user_files.view_url,
              download_url: item.user_files.download_url
            });
          });
          
          // Sort by upload date, newest first
          processedFiles.sort((a, b) => 
            new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
          );
          
          setFiles(processedFiles);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching files:', error);
        setLoading(false);
      }
    };
    
    fetchFiles();
  }, []);

  const filteredFiles = files.filter(file => 
    file.file_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.task_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Uploaded Files</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        
        {filteredFiles.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{file.file_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{file.user_name}</div>
                      <div className="text-sm text-gray-500">{file.user_email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{file.task_name}</TableCell>
                  <TableCell>{new Date(file.uploaded_at).toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => window.open(file.view_url, '_blank')}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => window.open(file.download_url, '_blank')}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-gray-500">No files found</div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileRepository;
