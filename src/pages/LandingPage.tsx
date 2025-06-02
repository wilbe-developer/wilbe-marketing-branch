
import LandingNavigation from "@/components/landing/LandingNavigation"
import TickerStrips from "@/components/landing/TickerStrips"
import LiveNewsStrip from "@/components/landing/LiveNewsStrip"
import HeroSection from "@/components/landing/HeroSection"
import WilbeStreamPlayer from "@/components/landing/WilbeStreamPlayer"
import FoundersStories from "@/components/landing/FoundersStories"
import PlatformsSection from "@/components/landing/PlatformsSection"
import WilbeCapitalStrip from "@/components/landing/WilbeCapitalStrip"
import ScientistsFirstSection from "@/components/landing/ScientistsFirstSection"
import BlogReel from "@/components/landing/BlogReel"
import LandingFooter from "@/components/landing/LandingFooter"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
        .ticker-content {
          display: flex;
          width: 200%;
        }
        html, body {
          font-family: Helvetica, Arial, sans-serif;
        }
        
        /* Touch optimization */
        .touch-manipulation {
          touch-action: manipulation;
        }
        
        /* Improve scrolling on mobile */
        @media (max-width: 768px) {
          body {
            -webkit-overflow-scrolling: touch;
            overflow-scrolling: touch;
          }
        }
      `}</style>
      
      {/* Navigation */}
      <LandingNavigation />

      {/* Community Asks Ticker Strip */}
      <TickerStrips />

      {/* Live News Ticker Strip */}
      <LiveNewsStrip />

      {/* Main Hero Section with Video Player */}
      <section className="bg-black text-white py-12 sm:py-16 lg:py-20 xl:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 items-start">
            <HeroSection />
            <div className="lg:col-span-1 flex justify-center">
              <WilbeStreamPlayer />
            </div>
          </div>
        </div>
      </section>

      <FoundersStories />
      <PlatformsSection />
      <WilbeCapitalStrip />
      <ScientistsFirstSection />
      <BlogReel />
      <LandingFooter />
    </div>
  )
}
