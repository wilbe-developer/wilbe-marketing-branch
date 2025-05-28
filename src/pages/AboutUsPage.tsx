
import LandingNavigation from "@/components/landing/LandingNavigation"
import AboutHeroSection from "@/components/about/AboutHeroSection"
import TeamShowcase from "@/components/about/TeamShowcase"
import OurStoryTimeline from "@/components/about/OurStoryTimeline"
import RoadshowGallery from "@/components/about/RoadshowGallery"
import CommunityImpact from "@/components/about/CommunityImpact"
import LandingFooter from "@/components/landing/LandingFooter"

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <style>{`
        html, body {
          font-family: Helvetica, Arial, sans-serif;
        }
      `}</style>
      
      <LandingNavigation />
      <AboutHeroSection />
      <TeamShowcase />
      <OurStoryTimeline />
      <RoadshowGallery />
      <CommunityImpact />
      <LandingFooter />
    </div>
  )
}
