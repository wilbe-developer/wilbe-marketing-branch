
import LandingNavigation from "@/components/landing/LandingNavigation"
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
      `}</style>
      
      <LandingNavigation />
      <CapitalHeroSection />
      <FundInformation />
      <PortfolioShowcase />
      <BackerInformation />
      <LandingFooter />
    </div>
  )
}
