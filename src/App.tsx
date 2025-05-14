
import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster"
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SprintDashboardPage from "./pages/SprintDashboardPage";
import SprintTaskPage from "./pages/SprintTaskPage";
import { NotificationManager } from "@/components/ui/notification-manager";

function App() {
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="app">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<HomePage />} />
            <Route path="/sprint/dashboard" element={<SprintDashboardPage />} />
            <Route path="/sprint/task/:taskId" element={<SprintTaskPage />} />
          </Routes>
          <Toaster />
          <NotificationManager />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
