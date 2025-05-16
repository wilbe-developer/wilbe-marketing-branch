
import React from "react";
import { useSprintTaskDefinitions } from "@/hooks/task-builder/useSprintTaskDefinitions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Plus, Edit, Trash2, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const TaskDefinitionList: React.FC = () => {
  const navigate = useNavigate();
  const {
    taskDefinitions,
    isLoading,
    error,
    deleteTaskDefinition,
    createTaskDefinition,
    createEmptyTaskDefinition,
  } = useSprintTaskDefinitions();

  const handleCreateNew = async () => {
    const emptyTask = createEmptyTaskDefinition();
    
    try {
      const result = await createTaskDefinition.mutateAsync(emptyTask);
      navigate(`/admin/task-builder/edit/${result.id}`);
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Task Definitions</h2>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="flex justify-end">
                  <Skeleton className="h-9 w-9 rounded-md mr-2" />
                  <Skeleton className="h-9 w-9 rounded-md" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-800">
        <p>Error loading task definitions: {error.toString()}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Task Definitions</h2>
        <Button onClick={handleCreateNew}>
          <Plus size={16} className="mr-2" />
          Create New Task
        </Button>
      </div>

      {taskDefinitions && taskDefinitions.length === 0 ? (
        <div className="text-center py-12 border rounded-lg border-dashed">
          <h3 className="text-lg font-medium text-gray-600 mb-2">No task definitions found</h3>
          <p className="text-gray-500 mb-4">Create your first task definition to get started</p>
          <Button onClick={handleCreateNew}>
            <Plus size={16} className="mr-2" />
            Create New Task
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {taskDefinitions?.map((task) => (
            <Card key={task.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="truncate">{task.name}</CardTitle>
                <CardDescription className="truncate">
                  {task.description || "No description"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500">
                  <span>
                    {task.definition.steps.length} steps 
                  </span>
                  {task.definition.profileQuestions.length > 0 && (
                    <span className="ml-2">• {task.definition.profileQuestions.length} profile questions</span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigate(`/admin/task-builder/edit/${task.id}`)}
                >
                  <Edit size={16} />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Trash2 size={16} />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Task Definition</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this task definition? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => deleteTaskDefinition.mutate(task.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskDefinitionList;
