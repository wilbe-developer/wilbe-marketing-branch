
import LandingNavigation from "@/components/landing/LandingNavigation"
import TickerStrips from "@/components/landing/TickerStrips"
import LiveNewsStrip from "@/components/landing/LiveNewsStrip"
import CapitalHeroSection from "@/components/capital/CapitalHeroSection"
import WilbeWayHeader from "@/components/capital/WilbeWayHeader"
import BackedFoundersSection from "@/components/landing/BackedFoundersSection"
import OperationalSupport from "@/components/capital/OperationalSupport"
import InvestmentCriteria from "@/components/capital/InvestmentCriteria"
import FundInformation from "@/components/capital/FundInformation"
import PortfolioShowcase from "@/components/capital/PortfolioShowcase"
import BackerInformation from "@/components/capital/BackerInformation"
import LandingFooter from "@/components/landing/LandingFooter"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

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
      
      {/* Wilbe Way Section from landing page */}
      <WilbeWayHeader />
      
      {/* Enhanced Backed Founders section - show more founders */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackedFoundersSection initialCount={12} loadMoreCount={8} />
          
          {/* View All button - links to external wilbe.capital */}
          <div className="text-center mt-12">
            <a href="https://wilbe.capital" target="_blank" rel="noopener noreferrer">
              <Button className="bg-gray-900 hover:bg-gray-800 text-white font-medium px-8 py-3 rounded-none">
                <span className="flex items-center">
                  VIEW ALL PORTFOLIO
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </Button>
            </a>
          </div>
        </div>
      </section>
      
      <OperationalSupport />
      <InvestmentCriteria />
      <FundInformation />
      <PortfolioShowcase />
      <BackerInformation />
      <LandingFooter />
    </div>
  )
}
