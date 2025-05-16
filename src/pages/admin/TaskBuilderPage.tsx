
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import TaskDefinitionList from "@/components/admin/task-builder/TaskDefinitionList";
import TaskDefinitionEditor from "@/components/admin/task-builder/TaskDefinitionEditor";

const TaskBuilderPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <Routes>
        <Route path="/" element={<TaskDefinitionList />} />
        <Route path="/edit/:taskId" element={<TaskDefinitionEditor />} />
        <Route path="/new" element={<TaskDefinitionEditor />} />
        <Route path="*" element={<Navigate to="." />} />
      </Routes>
    </div>
  );
};

export default TaskBuilderPage;
