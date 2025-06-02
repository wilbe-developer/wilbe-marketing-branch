
import { Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import LandingPageMarketing from "@/pages/LandingPage";
import MediaPage from "@/pages/MediaPage";
import AboutUsPage from "@/pages/AboutUsPage";
import BlogPage from "@/pages/BlogPage";
import BlogPostPage from "@/pages/BlogPostPage";
import ErrorPage from "@/pages/ErrorPage";

export default function MarketingRoutes() {
  return (
    <>
      <Route
        element={
          <ErrorBoundary fallback={<ErrorPage />}>
            <LandingPageMarketing />
          </ErrorBoundary>
        }
        path="/landing-page"
      />
      <Route
        element={
          <ErrorBoundary fallback={<ErrorPage />}>
            <MediaPage />
          </ErrorBoundary>
        }
        path="/media"
      />
      <Route
        element={
          <ErrorBoundary fallback={<ErrorPage />}>
            <AboutUsPage />
          </ErrorBoundary>
        }
        path="/about"
      />
      <Route
        element={
          <ErrorBoundary fallback={<ErrorPage />}>
            <BlogPage />
          </ErrorBoundary>
        }
        path="/blog"
      />
      <Route
        element={
          <ErrorBoundary fallback={<ErrorPage />}>
            <BlogPostPage />
          </ErrorBoundary>
        }
        path="/blog/:slug"
      />
    </>
  );
}
