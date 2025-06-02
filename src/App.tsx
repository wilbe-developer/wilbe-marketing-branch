
import { BrowserRouter, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/useAuth";
import { SprintContextProvider } from "@/hooks/useSprintContext";
import MetaWrapper from "@/components/MetaWrapper";

// Routing Components
import MarketingRoutes from "@/components/routing/MarketingRoutes";
import PublicRoutes from "@/components/routing/PublicRoutes";
import SprintRoutes from "@/components/routing/SprintRoutes";
import ProtectedUserRoutes from "@/components/routing/ProtectedUserRoutes";
import AdminRoutes from "@/components/routing/AdminRoutes";
import MiscRoutes from "@/components/routing/MiscRoutes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Toaster />
    <BrowserRouter>
      <AuthProvider>
        <SprintContextProvider>
          <MetaWrapper>
            <Routes>
              {/* Marketing Routes */}
              <MarketingRoutes />
              
              {/* Public Routes */}
              <PublicRoutes />
              
              {/* Sprint Routes */}
              <SprintRoutes />
              
              {/* Protected User Routes */}
              <ProtectedUserRoutes />
              
              {/* Admin Routes */}
              <AdminRoutes />
              
              {/* Miscellaneous Routes */}
              <MiscRoutes />
            </Routes>
          </MetaWrapper>
        </SprintContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
