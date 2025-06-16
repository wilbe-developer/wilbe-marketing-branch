import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "@/components/ErrorFallback";
import LandingPage from "./pages/LandingPage";
import PricingPage from "./pages/PricingPage";
import CommunityPage from "./pages/CommunityPage";
import ModulePage from "./pages/ModulePage";
import VideoPage from "./pages/VideoPage";
import SprintDashboard from "./pages/SprintDashboard";
import SprintTaskPage from "./pages/SprintTaskPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTaskBuilder from "./pages/AdminTaskBuilder";
import AdminTaskEditor from "./pages/AdminTaskEditor";
import AdminVideoManager from "./pages/AdminVideoManager";
import AdminModuleManager from "./pages/AdminModuleManager";
import AdminModuleEditor from "./pages/AdminModuleEditor";
import AdminLiveEvents from "./pages/AdminLiveEvents";
import AdminLiveEventEditor from "./pages/AdminLiveEventEditor";
import AdminUserManagement from "./pages/AdminUserManagement";
import { useAuth } from "./hooks/useAuth";
import { useEffect } from "react";
import { VideoPlayerProvider } from '@/contexts/VideoPlayerContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <TooltipProvider>
            <VideoPlayerProvider>
              <BrowserRouter>
                <div className="min-h-screen bg-background font-sans antialiased">
                  <Toaster />
                  <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/community" element={<CommunityPage />} />
                    <Route path="/modules/:moduleId" element={<ModulePage />} />
                    <Route path="/video/:videoId" element={<VideoPage />} />
                    <Route path="/sprint" element={<SprintDashboard />} />
                    <Route path="/sprint/task/:taskId" element={<SprintTaskPage />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/task-builder" element={<AdminTaskBuilder />} />
                    <Route path="/admin/task-editor/:taskId" element={<AdminTaskEditor />} />
                    <Route path="/admin/video-manager" element={<AdminVideoManager />} />
                    <Route path="/admin/module-manager" element={<AdminModuleManager />} />
                    <Route path="/admin/module-editor/:moduleId" element={<AdminModuleEditor />} />
                    <Route path="/admin/live-events" element={<AdminLiveEvents />} />
                    <Route path="/admin/live-event-editor/:eventId" element={<AdminLiveEventEditor />} />
                    <Route path="/admin/user-management" element={<AdminUserManagement />} />
                  </Routes>
                </div>
              </BrowserRouter>
            </VideoPlayerProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
