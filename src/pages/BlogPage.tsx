
import LandingNavigation from "@/components/landing/LandingNavigation";
import BlogHeroSection from "@/components/blog/BlogHeroSection";
import BlogGrid from "@/components/blog/BlogGrid";
import LandingFooter from "@/components/landing/LandingFooter";

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNavigation />
      <BlogHeroSection />
      <BlogGrid />
      <LandingFooter />
    </div>
  );
}
