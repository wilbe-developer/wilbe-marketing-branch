
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
import { SaveAll, ArrowLeft, AlertCircle, Code } from "lucide-react";
import { toast } from "sonner";
import SimpleStepEditor from "./SimpleStepEditor";
import ProfileQuestionsEditor from "./ProfileQuestionsEditor";
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

const SimplifiedTaskEditor: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  
  console.log("SimplifiedTaskEditor initializing with taskId:", taskId);
  
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
  const [rawJsonMode, setRawJsonMode] = useState<boolean>(false);
  const [rawJson, setRawJson] = useState<string>("");
  const [loadAttempts, setLoadAttempts] = useState<number>(0);

  useEffect(() => {
    const loadTask = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log(`Simplified Editor loading task, taskId: ${taskId}, attempt: ${loadAttempts + 1}`);
        
        if (taskId) {
          const taskData = await fetchTaskDefinition(taskId);
          console.log("Task data fetched successfully:", taskData);
          
          // Validate task data
          if (!taskData || !taskData.definition) {
            throw new Error("Received invalid task data from server");
          }
          
          setTask(taskData);
          setRawJson(JSON.stringify(taskData.definition, null, 2));
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
          
          const newTask = {
            id: tempId,
            ...emptyTask,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          
          setTask(newTask);
          setRawJson(JSON.stringify(newTask.definition, null, 2));
        }
      } catch (error: any) {
        console.error("Error loading task:", error);
        setError(error.message || "Failed to load task definition");
        toast.error("Failed to load task definition");
        
        // Try to create an empty task as fallback
        if (loadAttempts === 0) {
          console.log("Creating fallback empty task after load failure");
          try {
            const emptyTask = createEmptyTaskDefinition();
            const fallbackTask = {
              id: taskId || `temp-${Date.now()}`,
              ...emptyTask,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            
            setTask(fallbackTask);
            setRawJson(JSON.stringify(fallbackTask.definition, null, 2));
            toast.warning("Using a fallback empty task. Your changes may overwrite the original task.");
          } catch (fallbackError) {
            console.error("Error creating fallback task:", fallbackError);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTask();
  }, [taskId, fetchTaskDefinition, createEmptyTaskDefinition, loadAttempts]);

  const toggleRawJsonMode = () => {
    if (!rawJsonMode) {
      // When switching to JSON mode, update the raw JSON
      setRawJson(JSON.stringify(task?.definition || {}, null, 2));
    } else {
      // When switching back from JSON mode, try to parse the JSON
      try {
        const parsedJson = JSON.parse(rawJson);
        if (task) {
          setTask({
            ...task,
            definition: parsedJson
          });
        }
        toast.success("JSON successfully parsed");
      } catch (error) {
        toast.error("Invalid JSON. Please correct it before switching back.");
        return; // Prevent toggling if JSON is invalid
      }
    }
    setRawJsonMode(!rawJsonMode);
  };

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
      console.log("Updating steps:", steps.length);
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

    return true;
  };

  const handleSave = async () => {
    if (!task) {
      toast.error("No task data to save");
      return;
    }
    
    let definitionToSave = task.definition;
    
    // If in raw JSON mode, use the raw JSON
    if (rawJsonMode) {
      try {
        definitionToSave = JSON.parse(rawJson);
      } catch (error) {
        toast.error("Invalid JSON. Please correct it before saving.");
        return;
      }
    }
    
    if (!validateTaskDefinition(definitionToSave)) {
      return;
    }

    setIsSaving(true);

    try {
      console.log("Saving task definition:", task);
      
      if (taskId) {
        await updateTaskDefinition.mutateAsync({
          id: taskId,
          name: task.name,
          description: task.description,
          definition: definitionToSave,
        });
        console.log("Task updated successfully");
        toast.success("Task definition updated successfully");
      } else {
        console.log("Creating new task");
        const result = await createTaskDefinition.mutateAsync({
          name: task.name,
          description: task.description,
          definition: definitionToSave,
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

    if (error && !task) {
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
              {taskId ? "Edit Task Definition (Simplified)" : "Create Task Definition (Simplified)"}
            </h2>
          </div>

          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={toggleRawJsonMode}
              className="flex items-center"
            >
              <Code size={16} className="mr-2" />
              {rawJsonMode ? "Visual Editor" : "JSON Editor"}
            </Button>
            
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
            {rawJsonMode ? (
              <div className="space-y-4">
                <Label htmlFor="jsonEditor">Edit Task Definition JSON</Label>
                <div className="relative">
                  <Textarea
                    id="jsonEditor"
                    value={rawJson}
                    onChange={(e) => setRawJson(e.target.value)}
                    className="font-mono text-sm h-[500px] resize-none"
                    placeholder="Enter JSON task definition"
                  />
                </div>
                <div className="text-xs text-gray-500">
                  <p>Edit the task definition in JSON format. Required fields:</p>
                  <ul className="list-disc pl-5">
                    <li>taskName (string): The name of the task</li>
                    <li>steps (array): Array of step objects with id, type, and text properties</li>
                    <li>profileQuestions (array): Array of profile question objects</li>
                  </ul>
                </div>
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="steps">Task Steps</TabsTrigger>
                  <TabsTrigger value="profileQuestions">Profile Questions</TabsTrigger>
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
                    <SimpleStepEditor 
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
              </Tabs>
            )}
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

export default SimplifiedTaskEditor;
