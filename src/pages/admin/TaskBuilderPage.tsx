
import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TaskDefinitionList from "@/components/admin/task-builder/TaskDefinitionList";
import TaskDefinitionEditor from "@/components/admin/task-builder/TaskDefinitionEditor";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => {
  return (
    <div className="text-center p-8">
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

const TaskBuilderPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            <span className="ml-2">Loading task builder...</span>
          </div>
        }>
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
