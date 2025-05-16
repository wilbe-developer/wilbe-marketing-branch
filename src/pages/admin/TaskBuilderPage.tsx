
import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TaskDefinitionList from "@/components/admin/task-builder/TaskDefinitionList";
import TaskDefinitionEditor from "@/components/admin/task-builder/TaskDefinitionEditor";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";

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
            <Route path="/edit/:taskId" element={<TaskDefinitionEditor />} />
            <Route path="/new" element={<TaskDefinitionEditor />} />
            <Route path="*" element={<Navigate to="." />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default TaskBuilderPage;
