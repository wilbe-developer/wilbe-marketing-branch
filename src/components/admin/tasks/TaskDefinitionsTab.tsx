
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Eye, Copy } from "lucide-react";
import TaskDefinitionEditor from "../tasks/TaskDefinitionEditor";
import TaskDefinitionViewer from "../tasks/TaskDefinitionViewer";
import { ipTaskDefinition, teamTaskDefinition } from "@/data/task-definitions";

const TaskDefinitionsTab = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [viewingTask, setViewingTask] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("task_definitions")
        .select("*")
        .order("title");

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

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this task definition?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("task_definitions")
        .delete()
        .eq("id", id);

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

  const handleCreatePreBuilt = async (type: string) => {
    try {
      // Get the pre-built task definition
      const taskDef = type === 'ip' ? ipTaskDefinition : teamTaskDefinition;
      
      // Prepare for database storage
      const taskData = {
        title: taskDef.title,
        description: taskDef.description,
        category: type, // 'ip' or 'team'
        steps: JSON.stringify(taskDef.steps),
        conditional_flow: JSON.stringify(taskDef.conditionalFlow || {}),
        answer_mapping: JSON.stringify(taskDef.answerMapping || {}),
        profile_key: taskDef.profileKey || '',
        profile_label: taskDef.profileLabel || '',
        profile_type: taskDef.profileType || 'boolean',
        profile_options: taskDef.profileOptions ? JSON.stringify(taskDef.profileOptions) : null
      };
      
      // Create the task in the database
      const { error } = await supabase
        .from("task_definitions")
        .insert(taskData);
        
      if (error) {
        throw error;
      }
      
      toast.success(`Pre-built ${type === 'ip' ? 'IP' : 'Team'} task definition created`);
      fetchTasks();
    } catch (error) {
      console.error("Error creating pre-built task:", error);
      toast.error("Failed to create pre-built task definition");
    }
  };

  const handleSaved = () => {
    setEditingTask(null);
    setIsCreating(false);
    fetchTasks();
  };

  const renderTaskList = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center p-6">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      );
    }

    if (tasks.length === 0) {
      return (
        <div className="text-center py-6">
          <p className="text-gray-500 mb-4">No task definitions yet. Create your first one!</p>
          <div className="flex justify-center gap-2">
            <Button onClick={() => setIsCreating(true)}>
              <Plus size={16} className="mr-2" />
              Create New Task
            </Button>
            <Button variant="outline" onClick={() => handleCreatePreBuilt('team')}>
              <Copy size={16} className="mr-2" />
              Create Team Task
            </Button>
            <Button variant="outline" onClick={() => handleCreatePreBuilt('ip')}>
              <Copy size={16} className="mr-2" />
              Create IP Task
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <Card key={task.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle>{task.title}</CardTitle>
              <CardDescription className="truncate">
                {task.description || "No description provided"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs bg-gray-100 rounded px-2 py-1 mr-2">
                    {task.category || "Uncategorized"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {task.steps && typeof task.steps === 'string' 
                      ? JSON.parse(task.steps).length 
                      : Array.isArray(task.steps) 
                        ? task.steps.length 
                        : 0} steps
                  </span>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewingTask(task.id)}
                  >
                    <Eye size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingTask(task.id)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(task.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (editingTask) {
    return (
      <TaskDefinitionEditor
        taskId={editingTask}
        onSaved={handleSaved}
        onCancel={() => setEditingTask(null)}
      />
    );
  }

  if (isCreating) {
    return (
      <TaskDefinitionEditor
        onSaved={handleSaved}
        onCancel={() => setIsCreating(false)}
      />
    );
  }

  if (viewingTask) {
    return (
      <TaskDefinitionViewer
        taskId={viewingTask}
        onClose={() => setViewingTask(null)}
        onEdit={() => {
          setEditingTask(viewingTask);
          setViewingTask(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Task Definitions</h2>
        <div className="flex gap-2">
          <Button onClick={() => setIsCreating(true)}>
            <Plus size={16} className="mr-2" />
            Create New Task
          </Button>
          <div className="dropdown dropdown-end">
            <Button variant="outline" className="dropdown-trigger">
              <Copy size={16} className="mr-2" /> 
              Create From Template
            </Button>
            <div className="dropdown-menu">
              <Button variant="outline" onClick={() => handleCreatePreBuilt('team')} className="w-full text-left my-1">
                Team Task
              </Button>
              <Button variant="outline" onClick={() => handleCreatePreBuilt('ip')} className="w-full text-left my-1">
                IP Task
              </Button>
            </div>
          </div>
        </div>
      </div>

      {renderTaskList()}
    </div>
  );
};

export default TaskDefinitionsTab;
