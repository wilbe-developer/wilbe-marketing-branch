
import React, { Suspense, useState, useEffect, useRef } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import TaskDefinitionList from "@/components/admin/task-builder/TaskDefinitionList";
import TaskDefinitionEditor from "@/components/admin/task-builder/TaskDefinitionEditor";
import SimplifiedTaskEditor from "@/components/admin/task-builder/SimplifiedTaskEditor";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle, RefreshCw, AlertOctagon } from "lucide-react";
import { toast } from "sonner";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => {
  React.useEffect(() => {
    console.error("TaskBuilderPage error:", error);
    toast.error("An error occurred in the Task Builder");
  }, [error]);

  return (
    <div className="text-center p-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
        <AlertCircle className="h-8 w-8 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="text-red-500 mb-4">{error.message}</p>
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={() => window.location.href = "/admin/task-builder"}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Task List
        </Button>
        <Button onClick={resetErrorBoundary}>Try Again</Button>
      </div>
    </div>
  );
};

// Custom loading component
const LoadingFallback = () => (
  <div className="flex flex-col justify-center items-center h-64">
    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
    <p className="text-lg text-gray-600">Loading task builder...</p>
    <p className="text-sm text-gray-500 mt-2">This may take a moment...</p>
  </div>
);

// Maximum loading time before showing recovery options
const EDITOR_LOAD_TIMEOUT = 12000;

// Emergency editor when all else fails
const EmergencyJsonEditor = ({ taskId }: { taskId: string }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [taskData, setTaskData] = useState<any>(null);
  const [jsonContent, setJsonContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    const fetchRawTask = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("sprint_task_definitions")
          .select("*")
          .eq("id", taskId)
          .single();
          
        if (error) throw error;
        
        setTaskData(data);
        setJsonContent(JSON.stringify(data.definition, null, 2));
      } catch (err: any) {
        console.error("Error loading raw task data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRawTask();
  }, [taskId]);
  
  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Validate JSON
      const parsedJson = JSON.parse(jsonContent);
      
      // Update the task
      const { error } = await supabase
        .from("sprint_task_definitions")
        .update({
          definition: parsedJson
        })
        .eq("id", taskId);
        
      if (error) throw error;
      
      toast.success("Task definition updated successfully");
      // Redirect back to task list
      setTimeout(() => navigate("/admin/task-builder"), 1000);
    } catch (err: any) {
      console.error("Error saving task:", err);
      setError(err.message);
      toast.error(`Failed to save: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return <LoadingFallback />;
  }
  
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertOctagon className="text-amber-600 mr-2" size={20} />
          Emergency Task Editor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4 text-gray-600">
          This is a simplified emergency editor for when the main editors are not working.
          You can directly edit the JSON definition of the task.
        </p>
        {error && (
          <div className="mb-4 text-red-500 text-sm p-2 bg-red-50 rounded">
            Error: {error}
          </div>
        )}
        <textarea
          value={jsonContent}
          onChange={(e) => setJsonContent(e.target.value)}
          className="w-full h-[400px] font-mono text-sm p-4 border border-gray-300 rounded"
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => navigate("/admin/task-builder")}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Task List
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
};

// Editor wrapper component that allows switching between editor types
const EditorWrapper = ({ simplified = false }) => {
  const [useSimplifiedEditor, setUseSimplifiedEditor] = useState<boolean>(simplified);
  const [editorKey, setEditorKey] = useState<number>(0);
  const [editorError, setEditorError] = useState<boolean>(false);
  const [editorTimedOut, setEditorTimedOut] = useState<boolean>(false);
  const timeoutRef = useRef<number | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get taskId from URL
  const taskId = location.pathname.split('/').pop() || "";
  
  // Clear previous timeout when component unmounts or editor type changes
  useEffect(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    
    // Set a timeout to show recovery options if editor takes too long to load
    timeoutRef.current = window.setTimeout(() => {
      setEditorTimedOut(true);
    }, EDITOR_LOAD_TIMEOUT);
    
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [useSimplifiedEditor, editorKey]);
  
  // If we're on a simplified route but not using simplified editor, or vice versa, redirect
  useEffect(() => {
    const isSimplifiedRoute = location.pathname.includes("/simple/");
    if (isSimplifiedRoute !== useSimplifiedEditor) {
      setUseSimplifiedEditor(isSimplifiedRoute);
    }
  }, [location.pathname, useSimplifiedEditor]);
  
  const toggleEditor = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    const newEditorType = !useSimplifiedEditor;
    setUseSimplifiedEditor(newEditorType);
    
    // Update the URL to match the editor type
    const newPath = location.pathname.replace(
      newEditorType ? "/edit/" : "/simple/edit/",
      newEditorType ? "/simple/edit/" : "/edit/"
    );
    
    navigate(newPath);
    setEditorKey(prev => prev + 1); // Force a complete remount
    setEditorError(false);
    setEditorTimedOut(false);
  };
  
  const handleRefresh = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    setEditorKey(prev => prev + 1);
    setEditorError(false);
    setEditorTimedOut(false);
    
    // Set a new timeout
    timeoutRef.current = window.setTimeout(() => {
      setEditorTimedOut(true);
    }, EDITOR_LOAD_TIMEOUT);
  };
  
  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback} 
      resetKeys={[useSimplifiedEditor, editorKey]}
      onReset={() => {
        console.log("Editor error boundary reset");
        setEditorError(true);
        setEditorKey(prev => prev + 1); // Force fresh remount on recovery
      }}
    >
      <div className="mb-4">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="flex items-center justify-between text-sm">
              <span>Editor Type</span>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleRefresh}
                >
                  <RefreshCw size={16} className="mr-2" />
                  Refresh Editor
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={toggleEditor}
                >
                  Switch to {useSimplifiedEditor ? "Advanced" : "Simplified"} Editor
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="py-3 text-sm text-gray-500">
            {useSimplifiedEditor 
              ? "You're using the simplified editor. It has fewer features but is more stable."
              : "You're using the advanced editor with all features including drag-and-drop."
            }
            {editorError && (
              <div className="mt-2 text-amber-600">
                There was an error with the editor. You may want to switch to the 
                {useSimplifiedEditor ? " advanced " : " simplified "}
                editor or refresh.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {editorTimedOut && (
        <Card className="mb-4 border-amber-200">
          <CardHeader className="py-3 bg-amber-50">
            <CardTitle className="flex items-center text-amber-700 text-sm">
              <AlertOctagon className="mr-2 h-4 w-4" />
              Editor Load Timeout
            </CardTitle>
          </CardHeader>
          <CardContent className="py-4">
            <p className="text-sm mb-4">
              The editor is taking longer than expected to load. You have several options:
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={handleRefresh}>
                <RefreshCw size={16} className="mr-2" />
                Refresh Current Editor
              </Button>
              <Button size="sm" variant="outline" onClick={toggleEditor}>
                Try {useSimplifiedEditor ? "Advanced" : "Simplified"} Editor
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => navigate("/admin/task-builder")}
              >
                <ArrowLeft size={16} className="mr-2" />
                Return to Task List
              </Button>
              {taskId && taskId !== "new" && (
                <Button 
                  size="sm" 
                  variant="secondary"
                  className="bg-amber-100 hover:bg-amber-200 text-amber-900"
                  onClick={() => setEditorError(true)}
                >
                  <AlertOctagon size={16} className="mr-2" />
                  Use Emergency Editor
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {editorError && taskId && taskId !== "new" ? (
        <EmergencyJsonEditor taskId={taskId} />
      ) : (
        <div key={editorKey}>
          {useSimplifiedEditor 
            ? <SimplifiedTaskEditor />
            : <TaskDefinitionEditor />
          }
        </div>
      )}
    </ErrorBoundary>
  );
};

const TaskBuilderPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <ErrorBoundary 
        FallbackComponent={ErrorFallback}
        onReset={() => {
          console.log("Error boundary reset");
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<TaskDefinitionList />} />
            <Route path="/edit/:taskId" element={<EditorWrapper simplified={false} />} />
            <Route path="/simple/edit/:taskId" element={<EditorWrapper simplified={true} />} />
            <Route path="/new" element={<EditorWrapper simplified={false} />} />
            <Route path="/simple/new" element={<EditorWrapper simplified={true} />} />
            <Route path="*" element={<Navigate to="." />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default TaskBuilderPage;
