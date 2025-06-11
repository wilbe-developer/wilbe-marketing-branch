
import { BrowserRouter, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/useAuth";
import { SprintContextProvider } from "@/hooks/useSprintContext";
import MetaWrapper from "@/components/MetaWrapper";

// Import routing components
import { Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import MarketingRoutes from "@/components/routing/MarketingRoutes";
import PublicRoutes from "@/components/routing/PublicRoutes";
import ProtectedUserRoutes from "@/components/routing/ProtectedUserRoutes";
import SprintRoutes from "@/components/routing/SprintRoutes";
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
              {MarketingRoutes()}
              
              {/* Public Routes */}
              {PublicRoutes()}

              {/* Protected User Routes */}
              {ProtectedUserRoutes()}

              {/* Sprint Routes */}
              {SprintRoutes()}

              {/* Admin Routes */}
              {AdminRoutes()}

              {/* Miscellaneous Routes */}
              {MiscRoutes()}
            </Routes>
          </MetaWrapper>
        </SprintContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
