
import React, { useState, useEffect } from 'react';
import { useSprintTaskDefinitions } from '@/hooks/task-builder/useSprintTaskDefinitions';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Eye, RefreshCcw } from "lucide-react";
import { SprintTaskDefinition } from '@/types/task-builder';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';

const TaskDefinitionsTab = () => {
  const { 
    taskDefinitions, 
    isLoading, 
    error, 
    createTaskDefinition, 
    updateTaskDefinition, 
    deleteTaskDefinition, 
    createEmptyTaskDefinition
  } = useSprintTaskDefinitions();
  
  const [viewingTask, setViewingTask] = useState<SprintTaskDefinition | null>(null);
  const [editingTask, setEditingTask] = useState<SprintTaskDefinition | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  if (error) {
    console.error("Error loading task definitions:", error);
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this task definition?")) {
      return;
    }

    try {
      await deleteTaskDefinition(id);
      toast.success("Task definition deleted");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task definition");
    }
  };

  const handleCreatePreBuilt = async (type: string) => {
    try {
      // Create an empty task definition
      const emptyTask = createEmptyTaskDefinition();
      
      // Set properties based on type
      const taskDef = {
        ...emptyTask,
        name: type === 'ip' ? 'IP Assessment' : 'Team Assessment',
        description: type === 'ip' ? 'Evaluate intellectual property status' : 'Evaluate team composition',
        definition: {
          ...emptyTask.definition,
          taskName: type === 'ip' ? 'IP Assessment' : 'Team Assessment',
          description: type === 'ip' ? 'Evaluate intellectual property status' : 'Evaluate team composition',
          category: type,
          steps: [
            {
              id: '1',
              type: 'question',
              text: type === 'ip' ? 'Do you have intellectual property?' : 'Do you have a team?',
              inputType: 'boolean'
            }
          ]
        }
      };
      
      await createTaskDefinition(taskDef);
      toast.success(`Pre-built ${type === 'ip' ? 'IP' : 'Team'} task definition created`);
    } catch (error) {
      console.error("Error creating pre-built task:", error);
      toast.error("Failed to create pre-built task definition");
    }
  };

  const handleSaved = () => {
    setEditingTask(null);
    setIsCreating(false);
  };

  const renderTaskList = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center p-6">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      );
    }

    if (!taskDefinitions || taskDefinitions.length === 0) {
      return (
        <div className="text-center py-6">
          <p className="text-gray-500 mb-4">No task definitions yet. Create your first one!</p>
          <div className="flex justify-center gap-2">
            <Button onClick={() => setIsCreating(true)}>
              <Plus size={16} className="mr-2" />
              Create New Task
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Plus size={16} className="mr-2" />
                  Create From Template
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleCreatePreBuilt('team')}>
                  Team Task
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCreatePreBuilt('ip')}>
                  IP Task
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {taskDefinitions.map((task) => (
          <Card key={task.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle>{task.definition.taskName || task.name}</CardTitle>
              <CardDescription className="truncate">
                {task.definition.description || task.description || "No description provided"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <Badge variant="outline" className="mr-2">
                    {task.definition.category || "Uncategorized"}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {task.definition.steps?.length || 0} steps
                  </span>
                </div>
                <div className="flex gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setViewingTask(task)}
                        >
                          <Eye size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>View task</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingTask(task)}
                        >
                          <Edit size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit task</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(task.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete task</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Task Definitions</h2>
        <div className="flex gap-2">
          <Button onClick={() => setIsCreating(true)}>
            <Plus size={16} className="mr-2" />
            Create New Task
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Plus size={16} className="mr-2" /> 
                Create From Template
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleCreatePreBuilt('team')}>
                Team Task
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleCreatePreBuilt('ip')}>
                IP Task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {renderTaskList()}
    </div>
  );
};

export default TaskDefinitionsTab;
