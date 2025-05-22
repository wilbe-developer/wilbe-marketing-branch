import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSprintTaskDefinitions } from '@/hooks/task-builder/useSprintTaskDefinitions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MoreVertical, Plus, Edit, Trash2, Copy, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const TaskDefinitionList = () => {
  const navigate = useNavigate();
  const { taskDefinitions, isLoading, error, deleteTaskDefinition, refetch } = useSprintTaskDefinitions();

  if (isLoading) {
    return (
      <div className="flex justify-center p-6">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-6">
        <p className="text-red-500">Error: {error.message || 'Failed to load task definitions'}</p>
      </div>
    );
  }

  const handleEditTask = (id: string) => {
    navigate(`/admin/task-builder/edit/${id}`);
  };

  const handleViewTask = (id: string) => {
    navigate(`/admin/task-builder/view/${id}`);
  };

  const handleCreateTask = () => {
    navigate('/admin/task-builder/create');
  };

  const handleDelete = async (taskId: string) => {
    if (!window.confirm(`Are you sure you want to delete this task definition?`)) {
      return;
    }
    
    try {
      deleteTaskDefinition.mutate(taskId, {
        onSuccess: () => {
          toast.success("Task definition deleted");
          refetch();
        },
        onError: (error) => {
          console.error("Error deleting task:", error);
          toast.error("Failed to delete task definition");
        }
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task definition");
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Task Definitions</h2>
        <Button onClick={handleCreateTask}>
          <Plus className="mr-2 h-4 w-4" />
          Create Task
        </Button>
      </div>
      {taskDefinitions && taskDefinitions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {taskDefinitions.map((task) => (
            <Card key={task.id}>
              <CardHeader>
                <CardTitle>{task.name}</CardTitle>
                <CardDescription>{task.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary">{task.definition.category || 'General'}</Badge>
              </CardContent>
              <CardFooter className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewTask(task.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditTask(task.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(task.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center">
            No task definitions found.
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TaskDefinitionList;
