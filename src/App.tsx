import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastProvider } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import MetaWrapper from "./MetaWrapper";
import HomePage from "./pages/HomePage";
import PricingPage from "./pages/PricingPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import SprintDashboardPage from "./pages/SprintDashboardPage";
import SprintTaskPage from "./pages/SprintTaskPage";
import { NotificationManager } from "@/components/ui/notification-manager";

function App() {
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="app">
          <MetaWrapper>
            <ToastProvider>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/sprint/dashboard" element={<SprintDashboardPage />} />
                <Route path="/sprint/task/:taskId" element={<SprintTaskPage />} />
              </Routes>
              <Toaster />
              <NotificationManager />
            </ToastProvider>
          </MetaWrapper>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
