
import { portfolioCompanies } from "@/data/portfolioCompanies"
import PortfolioCard from "@/components/landing/PortfolioCard"
import { Button } from "@/components/ui/button"
import { ArrowRight, ExternalLink } from "lucide-react"

export default function PortfolioShowcase() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Fund I Portfolio
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our inaugural fund has backed transformative scientist-led companies across biotechnology, 
            climate tech, and deep technology sectors.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {portfolioCompanies.map((company) => (
            <div key={company.id} className="transform hover:scale-105 transition-transform">
              <PortfolioCard company={company} />
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Portfolio Impact
          </h3>
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{portfolioCompanies.length}+</div>
              <div className="text-gray-600 uppercase tracking-wide text-sm">Portfolio Companies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">$2.1B+</div>
              <div className="text-gray-600 uppercase tracking-wide text-sm">Follow-on Funding</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">12</div>
              <div className="text-gray-600 uppercase tracking-wide text-sm">Countries</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">5</div>
              <div className="text-gray-600 uppercase tracking-wide text-sm">Sectors</div>
            </div>
          </div>
          
          <Button
            variant="outline"
            className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-bold uppercase tracking-wide px-6"
            onClick={() => window.open('https://www.wilbe.capital/portfolio', '_blank')}
          >
            View Full Portfolio
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
