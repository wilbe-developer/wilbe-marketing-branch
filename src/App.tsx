import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster"
import LandingPage from "./pages/LandingPage";
import MediaPage from "./pages/MediaPage";
import NotFoundPage from "./pages/NotFoundPage";
import { ErrorBoundary } from 'react-error-boundary'
import ErrorPage from "./pages/ErrorPage";
import VideoPlayerPage from "@/pages/VideoPlayerPage";

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <BrowserRouter>
        <ErrorBoundary fallback={<ErrorPage />} >
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/landing-page" element={<LandingPage />} />
            <Route path="/media" element={<MediaPage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/video/:id" element={<VideoPlayerPage />} />
          </Routes>
        </ErrorBoundary>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
