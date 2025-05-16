
import React, { Suspense, useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import TaskDefinitionList from "@/components/admin/task-builder/TaskDefinitionList";
import TaskDefinitionEditor from "@/components/admin/task-builder/TaskDefinitionEditor";
import SimplifiedTaskEditor from "@/components/admin/task-builder/SimplifiedTaskEditor";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

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

// Editor wrapper component that allows switching between editor types
const EditorWrapper = ({ simplified = false }) => {
  const [useSimplifiedEditor, setUseSimplifiedEditor] = useState<boolean>(simplified);
  const [editorKey, setEditorKey] = useState<number>(0);
  const location = useLocation();
  const navigate = useNavigate();
  
  // If we're on a simplified route but not using simplified editor, or vice versa, redirect
  useEffect(() => {
    const isSimplifiedRoute = location.pathname.includes("/simple/");
    if (isSimplifiedRoute !== useSimplifiedEditor) {
      setUseSimplifiedEditor(isSimplifiedRoute);
    }
  }, [location.pathname, useSimplifiedEditor]);
  
  const toggleEditor = () => {
    const newEditorType = !useSimplifiedEditor;
    setUseSimplifiedEditor(newEditorType);
    
    // Update the URL to match the editor type
    const newPath = location.pathname.replace(
      newEditorType ? "/edit/" : "/simple/edit/",
      newEditorType ? "/simple/edit/" : "/edit/"
    );
    
    navigate(newPath);
    setEditorKey(prev => prev + 1); // Force a complete remount
  };
  
  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback} 
      resetKeys={[useSimplifiedEditor, editorKey]}
      onReset={() => {
        console.log("Editor error boundary reset");
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
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw size={16} className="mr-2" />
                  Refresh
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
          </CardContent>
        </Card>
      </div>
      
      <div key={editorKey}>
        {useSimplifiedEditor 
          ? <SimplifiedTaskEditor />
          : <TaskDefinitionEditor />
        }
      </div>
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
