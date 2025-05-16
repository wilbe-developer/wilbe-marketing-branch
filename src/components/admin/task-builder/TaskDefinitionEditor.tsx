
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSprintTaskDefinitions } from "@/hooks/task-builder/useSprintTaskDefinitions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SaveAll, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import StepTreeEditor from "./StepTreeEditor";
import ProfileQuestionsEditor from "./ProfileQuestionsEditor";
import StaticPanelsEditor from "./StaticPanelsEditor";
import TaskPreview from "./TaskPreview";
import { TaskDefinition } from "@/types/task-builder";
import { v4 as uuidv4 } from "uuid";

const TaskDefinitionEditor: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const {
    fetchTaskDefinition,
    updateTaskDefinition,
    createEmptyTaskDefinition,
  } = useSprintTaskDefinitions();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [task, setTask] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    const loadTask = async () => {
      setIsLoading(true);
      try {
        if (taskId) {
          const taskData = await fetchTaskDefinition(taskId);
          setTask(taskData);
        } else {
          const emptyTask = createEmptyTaskDefinition();
          setTask({
            id: uuidv4(), // Temporary ID for new task
            ...emptyTask,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error("Error loading task:", error);
        toast.error("Failed to load task definition");
      } finally {
        setIsLoading(false);
      }
    };

    loadTask();
  }, [taskId, fetchTaskDefinition, createEmptyTaskDefinition]);

  const handleBasicInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === "name" || name === "description") {
      setTask({
        ...task,
        [name]: value,
        definition: {
          ...task.definition,
          taskName: name === "name" ? value : task.definition.taskName,
          description: name === "description" ? value : task.definition.description,
        }
      });
    } else {
      setTask({
        ...task,
        definition: {
          ...task.definition,
          [name]: value,
        },
      });
    }
  };

  const updateSteps = (steps: any[]) => {
    setTask({
      ...task,
      definition: {
        ...task.definition,
        steps,
      },
    });
  };

  const updateProfileQuestions = (profileQuestions: any[]) => {
    setTask({
      ...task,
      definition: {
        ...task.definition,
        profileQuestions,
      },
    });
  };

  const updateStaticPanels = (staticPanels: any[]) => {
    setTask({
      ...task,
      definition: {
        ...task.definition,
        staticPanels,
      },
    });
  };

  const validateTaskDefinition = (definition: TaskDefinition): boolean => {
    // Basic schema validation
    if (!definition.taskName || !definition.steps || !Array.isArray(definition.steps)) {
      toast.error("Task must have a name and valid steps array");
      return false;
    }

    // Validate steps have required fields
    for (const step of definition.steps) {
      if (!step.id || !step.type || !step.text) {
        toast.error("All steps must have an id, type, and text");
        return false;
      }
    }

    // Validate profile questions
    if (!Array.isArray(definition.profileQuestions)) {
      toast.error("Profile questions must be an array");
      return false;
    }

    for (const question of definition.profileQuestions) {
      if (!question.key || !question.text || !question.type) {
        toast.error("All profile questions must have a key, text, and type");
        return false;
      }
      
      // Keys must be alphanumeric with underscores
      if (!/^[a-zA-Z0-9_]+$/.test(question.key)) {
        toast.error("Profile question keys must contain only letters, numbers, and underscores");
        return false;
      }
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateTaskDefinition(task.definition)) {
      return;
    }

    setIsSaving(true);

    try {
      if (taskId) {
        await updateTaskDefinition.mutateAsync({
          id: taskId,
          name: task.name,
          description: task.description,
          definition: task.definition,
        });
      } else {
        // For new tasks, we'd normally create them, but we set this up to 
        // create an empty one first and then navigate
        toast.error("Please create a new task from the task list page");
        navigate("/admin/task-builder");
        return;
      }

      toast.success("Task definition saved successfully");
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("Failed to save task definition");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Task not found</h2>
        <Button variant="outline" onClick={() => navigate("/admin/task-builder")}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Task List
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/task-builder")}
            className="mr-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <h2 className="text-2xl font-bold">
            {taskId ? "Edit Task Definition" : "Create Task Definition"}
          </h2>
        </div>

        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <SaveAll size={16} className="mr-2" />
              Save Task
            </>
          )}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <Input
              name="name"
              value={task.name}
              onChange={handleBasicInfoChange}
              placeholder="Task Name"
              className="text-2xl font-bold border-none p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="steps">Task Steps</TabsTrigger>
              <TabsTrigger value="profileQuestions">Profile Questions</TabsTrigger>
              <TabsTrigger value="staticPanels">Static Panels</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={task.description || ""}
                  onChange={handleBasicInfoChange}
                  placeholder="Enter a description for this task"
                  rows={4}
                />
              </div>
            </TabsContent>

            <TabsContent value="steps">
              <StepTreeEditor 
                steps={task.definition.steps} 
                onChange={updateSteps} 
              />
            </TabsContent>

            <TabsContent value="profileQuestions">
              <ProfileQuestionsEditor 
                profileQuestions={task.definition.profileQuestions || []} 
                onChange={updateProfileQuestions} 
              />
            </TabsContent>

            <TabsContent value="staticPanels">
              <StaticPanelsEditor 
                staticPanels={task.definition.staticPanels || []} 
                onChange={updateStaticPanels} 
              />
            </TabsContent>

            <TabsContent value="preview">
              <TaskPreview taskDefinition={task.definition} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskDefinitionEditor;
