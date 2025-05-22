
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
import { SaveAll, ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import StepTreeEditor from "./StepTreeEditor";
import ProfileQuestionsEditor from "./ProfileQuestionsEditor";
import StaticPanelsEditor from "./StaticPanelsEditor";
import TaskPreview from "./TaskPreview";
import { TaskDefinition } from "@/types/task-builder";
import { v4 as uuidv4 } from "uuid";
import { ErrorBoundary } from "react-error-boundary";

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => {
  return (
    <div className="text-center p-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="text-red-500 mb-4">{error.message || "An unexpected error occurred"}</p>
      <Button variant="outline" onClick={resetErrorBoundary}>
        Try Again
      </Button>
    </div>
  );
};

const TaskDefinitionEditor: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const {
    fetchTaskDefinition,
    updateTaskDefinition,
    createTaskDefinition,
    createEmptyTaskDefinition,
  } = useSprintTaskDefinitions();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [task, setTask] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [loadAttempts, setLoadAttempts] = useState<number>(0);

  useEffect(() => {
    const loadTask = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log(`Loading task editor, taskId: ${taskId}, attempt: ${loadAttempts + 1}`);
        
        if (taskId) {
          const taskData = await fetchTaskDefinition(taskId);
          console.log("Task data fetched successfully:", taskData);
          
          // Validate task data
          if (!taskData || !taskData.definition) {
            throw new Error("Received invalid task data from server");
          }
          
          setTask(taskData);
        } else {
          console.log("Creating empty task");
          const emptyTask = createEmptyTaskDefinition();
          
          // Generate a temporary ID for UI purposes
          let tempId: string;
          try {
            tempId = uuidv4();
          } catch (error) {
            console.error("UUID generation error:", error);
            tempId = `temp-${Date.now()}`;
          }
          
          setTask({
            id: tempId,
            ...emptyTask,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      } catch (error: any) {
        console.error("Error loading task:", error);
        setError(error.message || "Failed to load task definition");
        toast.error("Failed to load task definition");
        
        // Auto-retry loading once
        if (loadAttempts === 0 && taskId) {
          setLoadAttempts(1);
          setTimeout(() => {
            console.log("Retrying task load automatically");
          }, 1500);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTask();
  }, [taskId, fetchTaskDefinition, createEmptyTaskDefinition, loadAttempts]);

  const handleBasicInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (!task) return;
    
    try {
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
    } catch (error) {
      console.error("Error updating task info:", error);
      // Don't update the state if there's an error
    }
  };

  const updateSteps = (steps: any[]) => {
    if (!task || !task.definition) return;
    
    try {
      console.log("Updating steps:", steps);
      setTask({
        ...task,
        definition: {
          ...task.definition,
          steps,
        },
      });
    } catch (error) {
      console.error("Error updating steps:", error);
      toast.error("Failed to update steps");
    }
  };

  const updateProfileQuestions = (profileQuestions: any[]) => {
    if (!task || !task.definition) return;
    
    try {
      setTask({
        ...task,
        definition: {
          ...task.definition,
          profileQuestions,
        },
      });
    } catch (error) {
      console.error("Error updating profile questions:", error);
      toast.error("Failed to update profile questions");
    }
  };

  const updateStaticPanels = (staticPanels: any[]) => {
    if (!task || !task.definition) return;
    
    try {
      setTask({
        ...task,
        definition: {
          ...task.definition,
          staticPanels,
        },
      });
    } catch (error) {
      console.error("Error updating static panels:", error);
      toast.error("Failed to update static panels");
    }
  };

  const validateTaskDefinition = (definition: TaskDefinition): boolean => {
    if (!definition) {
      toast.error("Task definition is missing");
      return false;
    }
    
    // Basic schema validation
    if (!definition.taskName) {
      toast.error("Task must have a name");
      return false;
    }
    
    if (!Array.isArray(definition.steps)) {
      toast.error("Steps must be an array");
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
    if (!task) {
      toast.error("No task data to save");
      return;
    }
    
    if (!validateTaskDefinition(task.definition)) {
      return;
    }

    setIsSaving(true);

    try {
      console.log("Saving task definition:", task);
      
      if (taskId) {
        await updateTaskDefinition({
          id: taskId,
          name: task.name,
          description: task.description,
          definition: task.definition,
        });
        console.log("Task updated successfully");
        toast.success("Task definition updated successfully");
      } else {
        console.log("Creating new task");
        const result = await createTaskDefinition({
          name: task.name,
          description: task.description,
          definition: task.definition,
        });
        console.log("Task created successfully:", result);
        toast.success("Task definition created successfully");
        // Navigate to edit the newly created task
        navigate(`/admin/task-builder/edit/${result.id}`);
      }
    } catch (error: any) {
      console.error("Error saving task:", error);
      toast.error(`Failed to save task definition: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <span className="ml-2">Loading task definition...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Error Loading Task</h2>
          <p className="text-red-500 mb-4">{error}</p>
          <div className="space-x-4">
            <Button variant="outline" onClick={() => navigate("/admin/task-builder")}>
              <ArrowLeft size={16} className="mr-2" />
              Back to Task List
            </Button>
            {loadAttempts < 3 && (
              <Button onClick={() => setLoadAttempts(prev => prev + 1)}>
                Try Again
              </Button>
            )}
          </div>
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
                value={task.name || ""}
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
                <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[task?.definition?.steps]}>
                  <StepTreeEditor 
                    steps={task.definition?.steps || []} 
                    onChange={updateSteps} 
                  />
                </ErrorBoundary>
              </TabsContent>

              <TabsContent value="profileQuestions">
                <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[task?.definition?.profileQuestions]}>
                  <ProfileQuestionsEditor 
                    profileQuestions={task.definition?.profileQuestions || []} 
                    onChange={updateProfileQuestions} 
                  />
                </ErrorBoundary>
              </TabsContent>

              <TabsContent value="staticPanels">
                <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[task?.definition?.staticPanels]}>
                  <StaticPanelsEditor 
                    staticPanels={task.definition?.staticPanels || []} 
                    onChange={updateStaticPanels} 
                  />
                </ErrorBoundary>
              </TabsContent>

              <TabsContent value="preview">
                <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[task?.definition]}>
                  <TaskPreview taskDefinition={task.definition} />
                </ErrorBoundary>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {renderContent()}
    </ErrorBoundary>
  );
};

export default TaskDefinitionEditor;
