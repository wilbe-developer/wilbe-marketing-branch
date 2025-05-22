
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Download, ExternalLink, FileText, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FileRepositoryProps {
  // Props if needed
}

const FileRepository: React.FC<FileRepositoryProps> = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState<any[]>([]);
  const [taskDefinitions, setTaskDefinitions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFileType, setSelectedFileType] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch task definitions
        const { data: tasksData, error: tasksError } = await supabase
          .from('sprint_task_definitions')
          .select('*');
          
        if (tasksError) throw tasksError;
        
        // Fetch files data with user progress information
        const { data: progressData, error: progressError } = await supabase
          .from('user_sprint_progress')
          .select('*, sprint_profiles(name, email), user_files(*)')
          .not('file_id', 'is', null);
          
        if (progressError) throw progressError;
        
        // Process data
        const processedFiles = progressData
          .filter(item => item.user_files)
          .map(item => {
            const taskDef = tasksData?.find(t => t.id === item.task_id);
            
            // Helper function to extract task name
            const extractTaskName = (definition: any) => {
              if (!definition) return 'Unknown Task';
              
              if (typeof definition === 'object' && definition.taskName) {
                return definition.taskName;
              } else if (typeof definition === 'string') {
                try {
                  const parsed = JSON.parse(definition);
                  return parsed.taskName || 'Unknown Task';
                } catch (e) {
                  return 'Unknown Task';
                }
              }
              
              return 'Unknown Task';
            };
            
            return {
              id: item.user_files.id,
              userId: item.user_id,
              userName: item.sprint_profiles?.name || 'Unknown User',
              userEmail: item.sprint_profiles?.email || 'No Email',
              taskId: item.task_id,
              taskName: taskDef ? extractTaskName(taskDef.definition) : 'Unknown Task',
              fileName: item.user_files.file_name,
              fileType: item.user_files.file_name.split('.').pop()?.toLowerCase() || 'unknown',
              downloadUrl: item.user_files.download_url,
              viewUrl: item.user_files.view_url,
              uploadedAt: item.user_files.uploaded_at
            };
          });
        
        setFiles(processedFiles);
        setTaskDefinitions(tasksData || []);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching file data:', err);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Get unique file types for filtering
  const fileTypes = Array.from(new Set(files.map(file => file.fileType)));
  
  // Filter files based on search term and selected file type
  const filteredFiles = files.filter(file => {
    const matchesSearch = 
      (file.userName && file.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (file.userEmail && file.userEmail.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (file.fileName && file.fileName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (file.taskName && file.taskName.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesFileType = selectedFileType ? file.fileType === selectedFileType : true;
    
    return matchesSearch && matchesFileType;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search files..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <select 
            className="px-3 py-2 border rounded-md"
            value={selectedFileType || ''}
            onChange={(e) => setSelectedFileType(e.target.value || null)}
          >
            <option value="">All File Types</option>
            {fileTypes.map(type => (
              <option key={type} value={type}>
                {type.toUpperCase()}
              </option>
            ))}
          </select>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Filter size={16} />
            More Filters
          </Button>
        </div>
      </div>
      
      {/* Files Table */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Files</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredFiles.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiles.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{file.fileName}</span>
                      </div>
                      <div className="ml-6 text-xs text-gray-500">
                        {file.fileType.toUpperCase()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{file.userName}</div>
                      <div className="text-xs text-gray-500">{file.userEmail}</div>
                    </TableCell>
                    <TableCell>{file.taskName}</TableCell>
                    <TableCell>
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {file.viewUrl && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => window.open(file.viewUrl, '_blank')}
                            className="h-8 w-8 p-0"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                        {file.downloadUrl && (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => window.open(file.downloadUrl, '_blank')}
                            className="h-8 w-8 p-0"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6 text-gray-500">
              No files found matching your criteria
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Files Statistics - Will be implemented in future updates */}
      <Card>
        <CardHeader>
          <CardTitle>File Upload Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">
            File statistics visualization will be implemented in a future update
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileRepository;
