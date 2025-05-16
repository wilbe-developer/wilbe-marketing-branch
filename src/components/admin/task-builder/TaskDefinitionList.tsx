
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSprintTaskDefinitions } from "@/hooks/task-builder/useSprintTaskDefinitions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Input } from "@/components/ui/input";
import { Edit, MoreVertical, Plus, Trash2, Copy, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { ErrorBoundary } from "react-error-boundary";

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => {
  React.useEffect(() => {
    console.error("TaskDefinitionList error:", error);
    toast.error("Error loading task definitions");
  }, [error]);

  return (
    <div className="text-center p-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="text-red-500 mb-4">{error.message}</p>
      <Button onClick={resetErrorBoundary}>Try Again</Button>
    </div>
  );
};

const TaskDefinitionList: React.FC = () => {
  const navigate = useNavigate();
  const { taskDefinitions, isLoading, error, deleteTaskDefinition } = useSprintTaskDefinitions();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [editorType, setEditorType] = useState<"advanced" | "simplified">("advanced");

  useEffect(() => {
    document.title = "Task Builder - Task Definitions";
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const confirmDelete = (id: string) => {
    setTaskToDelete(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!taskToDelete) return;
    
    try {
      await deleteTaskDefinition.mutateAsync(taskToDelete);
      toast.success("Task definition deleted successfully");
    } catch (error) {
      console.error("Error deleting task definition:", error);
      toast.error("Failed to delete task definition");
    } finally {
      setTaskToDelete(null);
      setConfirmOpen(false);
    }
  };

  const handleCreateNew = () => {
    if (editorType === "simplified") {
      navigate("/admin/task-builder/simple/new");
    } else {
      navigate("/admin/task-builder/new");
    }
  };

  const handleEditTask = (id: string) => {
    if (editorType === "simplified") {
      navigate(`/admin/task-builder/simple/edit/${id}`);
    } else {
      navigate(`/admin/task-builder/edit/${id}`);
    }
  };

  const filteredTasks = taskDefinitions?.filter(task => 
    task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (error) {
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <div>
              <h3 className="text-red-800 font-medium">Error loading task definitions</h3>
              <p className="text-red-700 text-sm">{error.message}</p>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Task Definitions</h1>
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="mr-2">
                {editorType === "simplified" ? "Simplified Editor" : "Advanced Editor"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Editor Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setEditorType("advanced")}
                className={editorType === "advanced" ? "bg-gray-100" : ""}
              >
                Advanced Editor
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setEditorType("simplified")}
                className={editorType === "simplified" ? "bg-gray-100" : ""}
              >
                Simplified Editor
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button onClick={handleCreateNew}>
            <Plus size={16} className="mr-2" />
            New Task Definition
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Definitions</CardTitle>
          <CardDescription>
            Manage your task definitions for sprint tasks
          </CardDescription>
          <div className="mt-4">
            <Input
              placeholder="Search task definitions..."
              value={searchTerm}
              onChange={handleSearch}
              className="max-w-md"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              <span className="ml-2">Loading task definitions...</span>
            </div>
          ) : (
            <>
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No task definitions found</h3>
                  {searchTerm ? (
                    <p className="text-gray-500">Try adjusting your search term</p>
                  ) : (
                    <p className="text-gray-500">Get started by creating your first task definition</p>
                  )}
                  {!searchTerm && (
                    <Button onClick={handleCreateNew} className="mt-4">
                      <Plus size={16} className="mr-2" />
                      Create Task Definition
                    </Button>
                  )}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Updated</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.name}</TableCell>
                        <TableCell className="text-sm truncate max-w-xs">
                          {task.description || "No description"}
                        </TableCell>
                        <TableCell className="text-sm">
                          {task.created_at && format(new Date(task.created_at), "PPP")}
                        </TableCell>
                        <TableCell className="text-sm">
                          {task.updated_at && format(new Date(task.updated_at), "PPP")}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditTask(task.id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => confirmDelete(task.id)}
                                className="text-red-600 focus:text-red-700"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
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
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TaskDefinitionList;
