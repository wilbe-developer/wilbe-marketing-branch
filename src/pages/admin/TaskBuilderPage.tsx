
import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TaskDefinitionList from "@/components/admin/task-builder/TaskDefinitionList";
import TaskDefinitionEditor from "@/components/admin/task-builder/TaskDefinitionEditor";

const TaskBuilderPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
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
    </div>
  );
};

export default TaskBuilderPage;
