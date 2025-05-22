
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Download, ExternalLink, FileText, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

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
        
        // Fetch sprint profiles first
        const { data: profilesData, error: profilesError } = await supabase
          .from('sprint_profiles')
          .select('user_id, name, email');
          
        if (profilesError) throw profilesError;
        
        // Create a map of user_id to profile info
        const profileMap = new Map();
        if (profilesData) {
          profilesData.forEach(profile => {
            profileMap.set(profile.user_id, {
              name: profile.name || 'Unknown User',
              email: profile.email || 'No Email'
            });
          });
        }
        
        // Fetch user files
        const { data: filesData, error: filesError } = await supabase
          .from('user_files')
          .select('*');
          
        if (filesError) throw filesError;
        
        // Fetch progress data to link files to tasks
        const { data: progressData, error: progressError } = await supabase
          .from('user_sprint_progress')
          .select('*')
          .not('file_id', 'is', null);
          
        if (progressError) throw progressError;
        
        // Process data
        const processedFiles = [];
        
        // Process files that are linked to sprint progress
        for (const progress of progressData || []) {
          const fileData = filesData?.find(f => f.id === progress.file_id);
          if (!fileData) continue;
          
          const taskDef = tasksData?.find(t => t.id === progress.task_id);
          const userProfile = profileMap.get(progress.user_id) || { name: 'Unknown User', email: 'No Email' };
          
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
          
          processedFiles.push({
            id: fileData.id,
            userId: progress.user_id,
            userName: userProfile.name,
            userEmail: userProfile.email,
            taskId: progress.task_id,
            taskName: taskDef ? extractTaskName(taskDef.definition) : 'Unknown Task',
            fileName: fileData.file_name,
            fileType: fileData.file_name.split('.').pop()?.toLowerCase() || 'unknown',
            downloadUrl: fileData.download_url,
            viewUrl: fileData.view_url,
            uploadedAt: fileData.uploaded_at
          });
        }
        
        // Also include files that aren't linked to any task progress
        for (const file of filesData || []) {
          // Skip if we've already processed this file
          if (processedFiles.some(p => p.id === file.id)) continue;
          
          const userProfile = profileMap.get(file.user_id) || { name: 'Unknown User', email: 'No Email' };
          
          processedFiles.push({
            id: file.id,
            userId: file.user_id,
            userName: userProfile.name,
            userEmail: userProfile.email,
            taskId: null,
            taskName: 'Unlinked File',
            fileName: file.file_name,
            fileType: file.file_name.split('.').pop()?.toLowerCase() || 'unknown',
            downloadUrl: file.download_url,
            viewUrl: file.view_url,
            uploadedAt: file.uploaded_at
          });
        }
        
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
                    <TableCell>
                      {file.taskId ? (
                        file.taskName
                      ) : (
                        <Badge variant="outline">Unlinked File</Badge>
                      )}
                    </TableCell>
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
      
      {/* Files Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>File Upload Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Total Files</div>
              <div className="text-2xl font-bold">{files.length}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">File Types</div>
              <div className="text-2xl font-bold">{fileTypes.length}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Recent Uploads</div>
              <div className="text-2xl font-bold">
                {files.filter(f => {
                  const uploadDate = new Date(f.uploadedAt);
                  const today = new Date();
                  const daysDiff = Math.floor((today.getTime() - uploadDate.getTime()) / (1000 * 60 * 60 * 24));
                  return daysDiff < 7;
                }).length}
              </div>
              <div className="text-xs text-gray-500">Last 7 days</div>
            </div>
          </div>
          
          {/* File type distribution */}
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">File Type Distribution</h4>
            <div className="space-y-2">
              {fileTypes.map(type => {
                const count = files.filter(f => f.fileType === type).length;
                const percentage = Math.round((count / files.length) * 100) || 0;
                
                return (
                  <div key={type} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{type.toUpperCase()}</span>
                      <span>{count} files ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileRepository;
