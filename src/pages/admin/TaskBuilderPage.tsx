
import React, { useState } from 'react';
import FullScreenAdminLayout from '@/components/admin/FullScreenAdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TaskDefinitionsTab from '@/components/admin/tabs/TaskDefinitionsTab';
import TaskTemplatesTab from '@/components/admin/tabs/TaskTemplatesTab';
import TaskProfileIntegration from '@/components/admin/tasks/TaskProfileIntegration';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { TASK_DEFINITIONS_QUERY_KEY } from '@/hooks/task-builder/hooks/useTaskDefinitionsQuery';
import { toast } from 'sonner';

const TaskBuilderPage = () => {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: [TASK_DEFINITIONS_QUERY_KEY] });
      toast.success("Task definitions refreshed");
    } catch (error) {
      console.error("Error refreshing task definitions:", error);
      toast.error("Failed to refresh task definitions");
    } finally {
      setIsRefreshing(false);
    }
  };
  
  return (
    <FullScreenAdminLayout title="Task Builder">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Task Builder</h1>
          <p className="text-gray-500 mt-2">Create and manage sprint tasks</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefresh} 
          disabled={isRefreshing}
        >
          <RefreshCcw size={16} className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      <Tabs defaultValue="definitions">
        <TabsList className="mb-4">
          <TabsTrigger value="definitions">Task Definitions</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="profile">Profile Integration</TabsTrigger>
        </TabsList>
        
        <TabsContent value="definitions">
          <Card>
            <CardHeader>
              <CardTitle>Task Definitions</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskDefinitionsTab />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Task Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskTemplatesTab />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskProfileIntegration
                profileSettings={{
                  profile_key: '',
                  profile_label: '',
                  profile_type: 'boolean',
                  profile_options: null
                }}
                onChange={() => {}}
                isReadOnly={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </FullScreenAdminLayout>
  );
};

export default TaskBuilderPage;
