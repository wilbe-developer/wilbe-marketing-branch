
import LandingNavigation from "@/components/landing/LandingNavigation"
import TickerStrips from "@/components/landing/TickerStrips"
import LiveNewsStrip from "@/components/landing/LiveNewsStrip"
import CapitalHeroSection from "@/components/capital/CapitalHeroSection"
import FundInformation from "@/components/capital/FundInformation"
import PortfolioShowcase from "@/components/capital/PortfolioShowcase"
import BackerInformation from "@/components/capital/BackerInformation"
import LandingFooter from "@/components/landing/LandingFooter"

export default function WilbeCapitalPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <style>{`
        html, body {
          font-family: Helvetica, Arial, sans-serif;
        }
        
        /* Ticker animation styles */
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
      `}</style>
      
      <LandingNavigation />
      
      {/* Community Asks Ticker Strip */}
      <TickerStrips />

      {/* Live News Ticker Strip */}
      <LiveNewsStrip />
      
      <CapitalHeroSection />
      <FundInformation />
      <PortfolioShowcase />
      <BackerInformation />
      <LandingFooter />
    </div>
  )
}
