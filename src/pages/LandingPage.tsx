
import LandingNavigation from "@/components/landing/LandingNavigation"
import TickerStrips from "@/components/landing/TickerStrips"
import HeroSection from "@/components/landing/HeroSection"
import WilbeStreamPlayer from "@/components/landing/WilbeStreamPlayer"
import FoundersStories from "@/components/landing/FoundersStories"
import PlatformsSection from "@/components/landing/PlatformsSection"
import ScientistsFirstSection from "@/components/landing/ScientistsFirstSection"
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
      `}</style>
      
      {/* Navigation */}
      <LandingNavigation />

      {/* Community Asks Ticker Strip */}
      <TickerStrips />

      {/* Main Hero Section with Video Player */}
      <section className="bg-black text-white py-12 sm:py-16 lg:py-20 xl:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 items-start">
            <HeroSection />
            <WilbeStreamPlayer />
          </div>
        </div>
      </section>

      <FoundersStories />
      <PlatformsSection />
      <ScientistsFirstSection />
      <LandingFooter />
    </div>
  )
}
