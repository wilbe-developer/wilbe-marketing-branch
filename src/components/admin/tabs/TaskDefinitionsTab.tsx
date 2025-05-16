
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Edit, Trash2, Save, X, Eye } from "lucide-react";
import { toast } from "sonner";
import TaskDefinitionEditor from "../tasks/TaskDefinitionEditor";
import TaskDefinitionViewer from "../tasks/TaskDefinitionViewer";

interface TaskDefinition {
  id: string;
  title: string;
  description: string;
  category: string;
  profile_key: string;
  created_at: string;
  updated_at: string;
}

const TaskDefinitionsTab = () => {
  const [tasks, setTasks] = useState<TaskDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "edit" | "view" | "create">("list");

  const fetchTasks = async () => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from("task_definitions")
        .select("*")
        .order("created_at", { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setTasks(data || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load task definitions");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleEditTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setViewMode("edit");
  };

  const handleViewTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    setViewMode("view");
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task definition?")) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from("task_definitions")
        .delete()
        .eq("id", taskId);
        
      if (error) {
        throw error;
      }
      
      toast.success("Task definition deleted");
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task definition");
    }
  };

  const handleCreateNew = () => {
    setSelectedTaskId(null);
    setViewMode("create");
  };

  const handleBack = () => {
    setViewMode("list");
    setSelectedTaskId(null);
  };

  const handleTaskSaved = () => {
    fetchTasks();
    setViewMode("list");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Task Definitions</h2>
        
        {viewMode === "list" ? (
          <Button onClick={handleCreateNew}>
            <Plus size={16} className="mr-2" />
            Create New Task
          </Button>
        ) : (
          <Button variant="outline" onClick={handleBack}>
            Back to List
          </Button>
        )}
      </div>

      {viewMode === "list" && (
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : tasks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No task definitions found</p>
                <Button variant="outline" className="mt-4" onClick={handleCreateNew}>
                  Create Your First Task
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Profile Key</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>{task.category || "-"}</TableCell>
                      <TableCell>{task.profile_key || "-"}</TableCell>
                      <TableCell>
                        {new Date(task.updated_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewTask(task.id)}
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditTask(task.id)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {viewMode === "edit" && selectedTaskId && (
        <TaskDefinitionEditor 
          taskId={selectedTaskId} 
          onSaved={handleTaskSaved} 
          onCancel={handleBack} 
        />
      )}

      {viewMode === "create" && (
        <TaskDefinitionEditor 
          onSaved={handleTaskSaved} 
          onCancel={handleBack} 
        />
      )}

      {viewMode === "view" && selectedTaskId && (
        <TaskDefinitionViewer 
          taskId={selectedTaskId} 
          onEdit={() => setViewMode("edit")} 
          onBack={handleBack} 
        />
      )}
    </div>
  );
};

export default TaskDefinitionsTab;
