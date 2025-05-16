
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSprintTaskDefinitions } from "@/hooks/task-builder/useSprintTaskDefinitions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SaveAll, ArrowLeft, AlertCircle, Code, RefreshCw, AlertOctagon } from "lucide-react";
import { toast } from "sonner";
import SimpleStepEditor from "./SimpleStepEditor";
import ProfileQuestionsEditor from "./ProfileQuestionsEditor";
import { TaskDefinition, SprintTaskDefinition } from "@/types/task-builder";
import { generateStableId, ensureValidIdsInObject } from "@/utils/stableId";
import { ErrorBoundary } from "react-error-boundary";

// Maximum loading time in milliseconds before showing timeout UI
const LOADING_TIMEOUT = 8000;

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

// JSON Editor component to avoid re-creating it on each render
const JsonEditor = ({ 
  value, 
  onChange, 
  error,
  isValid
}: { 
  value: string, 
  onChange: (value: string) => void,
  error?: string,
  isValid: boolean
}) => {
  return (
    <div className="space-y-4">
      <Label htmlFor="jsonEditor" className="flex justify-between">
        <span>Edit Task Definition JSON</span>
        {error && <span className="text-red-500 text-sm">{error}</span>}
        {!error && isValid && <span className="text-green-500 text-sm">Valid JSON</span>}
      </Label>
      <div className="relative">
        <Textarea
          id="jsonEditor"
          value={value}
          onChange={(e) => onChange(e.target.value)}
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
  );
};

// Minimal JSON validator
const isValidJson = (json: string): boolean => {
  try {
    const parsed = JSON.parse(json);
    if (typeof parsed !== 'object' || parsed === null) return false;
    return true;
  } catch (e) {
    return false;
  }
};

// Basic task schema validator
const validateTaskSchema = (json: string): { valid: boolean, error?: string } => {
  try {
    const parsed = JSON.parse(json);
    
    if (!parsed.taskName) {
      return { valid: false, error: "Missing required field: taskName" };
    }
    
    if (!Array.isArray(parsed.steps)) {
      return { valid: false, error: "steps must be an array" };
    }
    
    if (!Array.isArray(parsed.profileQuestions)) {
      return { valid: false, error: "profileQuestions must be an array" };
    }
    
    // Success
    return { valid: true };
  } catch (e) {
    return { valid: false, error: `Invalid JSON: ${(e as Error).message}` };
  }
};

// Last resort emergency editor when all else fails
const EmergencyJsonEditor = ({ 
  taskId, 
  defaultValue = '',
  onSave,
  onCancel 
}: { 
  taskId?: string, 
  defaultValue?: string,
  onSave: (json: string) => void,
  onCancel: () => void
}) => {
  const [json, setJson] = useState<string>(defaultValue);
  const [error, setError] = useState<string | null>(null);
  
  const handleSave = () => {
    const validation = validateTaskSchema(json);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    
    onSave(json);
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center text-amber-600">
          <AlertOctagon className="mr-2 h-5 w-5" />
          Emergency JSON Editor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4 text-gray-500">
          This is a simplified editor for when the main editor has issues. You can directly edit the JSON definition here.
        </p>
        <Textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          rows={20}
          className="font-mono text-sm"
        />
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </CardFooter>
    </Card>
  );
};

const SimplifiedTaskEditor: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const loadTimeoutRef = useRef<number | null>(null);
  const loadAttemptsRef = useRef<number>(0);
  
  console.log("SimplifiedTaskEditor initializing with taskId:", taskId);
  
  const {
    fetchTaskDefinition,
    updateTaskDefinition,
    createTaskDefinition,
    createEmptyTaskDefinition,
  } = useSprintTaskDefinitions();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingTimedOut, setIsLoadingTimedOut] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [task, setTask] = useState<SprintTaskDefinition | null>(null);
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [jsonMode, setJsonMode] = useState<boolean>(false);
  const [rawJson, setRawJson] = useState<string>("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonIsValid, setJsonIsValid] = useState<boolean>(false);
  const [loadAttempts, setLoadAttempts] = useState<number>(0);
  const [showEmergencyEditor, setShowEmergencyEditor] = useState<boolean>(false);
  
  // Use a stable ID that won't change between renders for new tasks
  const tempIdRef = useRef<string>(generateStableId());

  // Check if JSON is valid when it changes
  useEffect(() => {
    setJsonIsValid(isValidJson(rawJson));
    setJsonError(null); // Clear error when JSON changes
  }, [rawJson]);

  // Set a loading timeout to show a helpful message for users
  useEffect(() => {
    // Set a timeout to show a message if loading takes too long
    loadTimeoutRef.current = window.setTimeout(() => {
      setIsLoadingTimedOut(true);
    }, LOADING_TIMEOUT);
    
    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
    };
  }, [loadAttempts]);

  // Load task data
  const loadTask = useCallback(async () => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }
    
    setIsLoading(true);
    setError(null);
    setJsonError(null);
    loadAttemptsRef.current += 1;
    
    try {
      console.log(`Simplified Editor loading task, taskId: ${taskId}, attempt: ${loadAttemptsRef.current}`);
      
      if (taskId) {
        const taskData = await fetchTaskDefinition(taskId);
        console.log("Task data fetched successfully:", taskData);
        
        // Validate task data
        if (!taskData || !taskData.definition) {
          throw new Error("Received invalid task data from server");
        }
        
        // Ensure all IDs in the definition are valid
        const processedTaskData = {
          ...taskData,
          definition: ensureValidIdsInObject(taskData.definition)
        };
        
        setTask(processedTaskData);
        setRawJson(JSON.stringify(processedTaskData.definition, null, 2));
      } else {
        console.log("Creating empty task with stable ID:", tempIdRef.current);
        const emptyTask = createEmptyTaskDefinition();
        
        const newTask = {
          id: tempIdRef.current,
          name: emptyTask.name,
          description: emptyTask.description,
          definition: ensureValidIdsInObject(emptyTask.definition),
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
      
      // Create an empty task as fallback
      if (loadAttemptsRef.current <= 2) {
        console.log("Creating fallback empty task after load failure");
        try {
          const emptyTask = createEmptyTaskDefinition();
          const fallbackTask = {
            id: taskId || tempIdRef.current,
            name: emptyTask.name,
            description: emptyTask.description,
            definition: ensureValidIdsInObject(emptyTask.definition),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          
          setTask(fallbackTask);
          setRawJson(JSON.stringify(fallbackTask.definition, null, 2));
          toast.warning("Using a fallback empty task. Your changes may overwrite the original task.");
        } catch (fallbackError) {
          console.error("Error creating fallback task:", fallbackError);
          setTask(null);
        }
      } else if (taskId) {
        // If multiple load attempts failed, try to load raw JSON for emergency editor
        try {
          const { data } = await supabase
            .from("sprint_task_definitions")
            .select("definition")
            .eq("id", taskId)
            .single();
            
          if (data?.definition) {
            const rawDefinition = typeof data.definition === 'string' 
              ? data.definition 
              : JSON.stringify(data.definition, null, 2);
              
            setRawJson(rawDefinition);
            // Show emergency editor as a last resort
            setShowEmergencyEditor(true);
          }
        } catch (rawError) {
          console.error("Failed to load raw definition:", rawError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [taskId, fetchTaskDefinition, createEmptyTaskDefinition]);

  // Load task on initial render and when taskId or loadAttempts changes
  useEffect(() => {
    loadTask();
  }, [loadTask, loadAttempts]);

  const toggleJsonMode = () => {
    if (!jsonMode) {
      // When switching to JSON mode, update the raw JSON
      if (task?.definition) {
        setRawJson(JSON.stringify(task.definition, null, 2));
      }
      setJsonMode(true);
      setJsonError(null);
    } else {
      // When switching back from JSON mode, try to parse the JSON
      try {
        const parsedJson = JSON.parse(rawJson);
        // Validate that it has the minimum required fields
        if (!parsedJson.taskName) {
          setJsonError("Invalid task: missing taskName field");
          toast.error("Missing required taskName field");
          return;
        }
        
        if (!Array.isArray(parsedJson.steps)) {
          setJsonError("Invalid task: steps must be an array");
          toast.error("Steps must be an array");
          return;
        }
        
        // Process IDs to ensure they're valid
        const validatedJson = ensureValidIdsInObject(parsedJson);
        
        if (task) {
          setTask({
            ...task,
            definition: validatedJson
          });
        }
        setJsonMode(false);
        setJsonError(null);
        setRawJson(JSON.stringify(validatedJson, null, 2));
        toast.success("JSON successfully parsed");
      } catch (error: any) {
        setJsonError("Invalid JSON: " + error.message);
        toast.error("Invalid JSON. Please correct it before switching back.");
        // Don't toggle if JSON is invalid
      }
    }
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
      
      // Ensure all steps have valid IDs
      const validatedSteps = steps.map(step => {
        return ensureValidIdsInObject(step);
      });
      
      setTask({
        ...task,
        definition: {
          ...task.definition,
          steps: validatedSteps,
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

  const handleEmergencySave = async (jsonString: string) => {
    try {
      const parsedDefinition = JSON.parse(jsonString);
      
      if (!taskId) {
        toast.error("Cannot save: No task ID available");
        return;
      }
      
      setIsSaving(true);
      
      // Parse the definition name from the JSON if possible
      const taskName = parsedDefinition.taskName || "Recovered Task";
      const taskDescription = parsedDefinition.description || "";
      
      // Ensure all IDs are valid
      const validatedDefinition = ensureValidIdsInObject(parsedDefinition);
      
      const result = await updateTaskDefinition.mutateAsync({
        id: taskId,
        name: taskName,
        description: taskDescription,
        definition: validatedDefinition,
      });
      
      toast.success("Task recovery successful");
      setShowEmergencyEditor(false);
      
      // Reload the task after successful save
      setTimeout(() => {
        setLoadAttempts(prev => prev + 1);
      }, 500);
    } catch (error: any) {
      console.error("Emergency save failed:", error);
      toast.error(`Save failed: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    if (!task) {
      toast.error("No task data to save");
      return;
    }
    
    let definitionToSave = task.definition;
    
    // If in JSON mode, use the raw JSON
    if (jsonMode) {
      try {
        const validation = validateTaskSchema(rawJson);
        if (!validation.valid) {
          setJsonError(validation.error);
          toast.error(validation.error);
          return;
        }
        
        definitionToSave = JSON.parse(rawJson);
        // Ensure all IDs are valid
        definitionToSave = ensureValidIdsInObject(definitionToSave);
      } catch (error: any) {
        setJsonError("Invalid JSON: " + error.message);
        toast.error("Invalid JSON. Please correct it before saving.");
        return;
      }
    }
    
    if (!validateTaskDefinition(definitionToSave)) {
      return;
    }

    setIsSaving(true);

    try {
      console.log("Saving task definition:", {
        id: taskId || task.id,
        name: task.name,
        description: task.description
      });
      
      if (taskId) {
        const result = await updateTaskDefinition.mutateAsync({
          id: taskId,
          name: task.name,
          description: task.description,
          definition: definitionToSave,
        });
        
        console.log("Task updated successfully:", result);
        toast.success("Task definition updated successfully");
        
        // Reset the editor after successful save to avoid state issues
        setTimeout(() => {
          setLoadAttempts(prev => prev + 1);
        }, 500);
      } else {
        const result = await createTaskDefinition.mutateAsync({
          name: task.name,
          description: task.description,
          definition: definitionToSave,
        });
        
        console.log("Task created successfully:", result);
        toast.success("Task definition created successfully");
        
        // Navigate to edit the newly created task
        setTimeout(() => {
          navigate(`/admin/task-builder/simple/edit/${result.id}`);
        }, 500);
      }
    } catch (error: any) {
      console.error("Error saving task:", error);
      toast.error(`Failed to save task definition: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const renderContent = () => {
    if (showEmergencyEditor) {
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
                Emergency Task Recovery
              </h2>
            </div>
          </div>
          
          <EmergencyJsonEditor 
            taskId={taskId}
            defaultValue={rawJson}
            onSave={handleEmergencySave}
            onCancel={() => navigate("/admin/task-builder")}
          />
          
          <Card>
            <CardContent className="py-6">
              <div className="flex flex-col items-center justify-center gap-4">
                <p className="text-sm text-gray-500">
                  Still having issues? You can return to the task list and try again later.
                </p>
                <Button variant="outline" onClick={() => navigate("/admin/task-builder")}>
                  <ArrowLeft size={16} className="mr-2" />
                  Return to Task List
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    if (isLoading) {
      return (
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
          <p className="text-lg text-gray-600">Loading task definition...</p>
          {isLoadingTimedOut && (
            <div className="mt-6 text-center">
              <p className="text-amber-600 mb-2">This is taking longer than expected.</p>
              <div className="flex gap-2 justify-center mt-2">
                <Button onClick={() => setLoadAttempts(prev => prev + 1)}>
                  <RefreshCw size={16} className="mr-2" />
                  Retry
                </Button>
                <Button variant="outline" onClick={() => navigate("/admin/task-builder")}>
                  <ArrowLeft size={16} className="mr-2" />
                  Back to List
                </Button>
                <Button variant="secondary" onClick={() => setShowEmergencyEditor(true)}>
                  <AlertOctagon size={16} className="mr-2" />
                  Recovery Mode
                </Button>
              </div>
            </div>
          )}
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
          <div className="space-y-4">
            <Button variant="outline" onClick={() => navigate("/admin/task-builder")}>
              <ArrowLeft size={16} className="mr-2" />
              Back to Task List
            </Button>
            <Button onClick={() => setLoadAttempts(prev => prev + 1)}>
              <RefreshCw size={16} className="mr-2" />
              Try Again
            </Button>
            {taskId && (
              <div className="pt-4 border-t border-gray-200 mt-4">
                <Button variant="secondary" onClick={() => setShowEmergencyEditor(true)}>
                  <AlertOctagon size={16} className="mr-2" />
                  Recovery Mode
                </Button>
              </div>
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
              onClick={() => setLoadAttempts(prev => prev + 1)}
              className="flex items-center"
            >
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </Button>
            
            <Button 
              variant="outline" 
              onClick={toggleJsonMode}
              className="flex items-center"
            >
              <Code size={16} className="mr-2" />
              {jsonMode ? "Visual Editor" : "JSON Editor"}
            </Button>
            
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="min-w-[120px]"
            >
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
                disabled={jsonMode}
              />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {jsonMode ? (
              <JsonEditor 
                value={rawJson}
                onChange={setRawJson}
                error={jsonError || undefined}
                isValid={jsonIsValid}
              />
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
                  <ErrorBoundary 
                    FallbackComponent={ErrorFallback} 
                    resetKeys={[JSON.stringify(task?.definition?.steps)]}
                    onReset={() => {
                      console.log("Step editor error boundary reset");
                      // If the steps editor errors out, switch to JSON mode
                      setJsonMode(true);
                    }}
                  >
                    <SimpleStepEditor 
                      steps={task.definition?.steps || []} 
                      onChange={updateSteps} 
                    />
                  </ErrorBoundary>
                </TabsContent>

                <TabsContent value="profileQuestions">
                  <ErrorBoundary 
                    FallbackComponent={ErrorFallback}
                    resetKeys={[JSON.stringify(task?.definition?.profileQuestions)]}
                    onReset={() => {
                      console.log("Profile questions editor error boundary reset");
                      // If the profile questions editor errors out, switch to JSON mode
                      setJsonMode(true);
                    }}
                  >
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
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onReset={() => {
        console.log("Main error boundary reset");
        setLoadAttempts(prev => prev + 1);
      }}
    >
      {renderContent()}
    </ErrorBoundary>
  );
};

export default SimplifiedTaskEditor;
