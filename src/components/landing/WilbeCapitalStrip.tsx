
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Globe, FileText, Lightbulb, Rocket } from "lucide-react";
import BackedFoundersSection from "./BackedFoundersSection";

export default function WilbeCapitalStrip() {
  return <section id="wilbe-capital" className="py-20 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 tracking-wide mb-6">
            INVESTING IN SCIENTIST FOUNDERS
          </h2>
        </div>

        {/* Who This Is For Section - Traditional Paragraph */}
        <div className="mb-12 text-center">
          <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
            We invest in scientists transitioning to full-time founders - the industrial leaders of this century.
          </p>
        </div>

        {/* Investment Criteria Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Stage */}
          <div className="text-center">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-red-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Stage</h4>
            <p className="text-gray-600 text-sm">We are typically the first check, half of the scientists we backed did not have foundational IP</p>
          </div>

          {/* Sectors */}
          <div className="text-center">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="h-8 w-8 text-red-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Sectors</h4>
            <p className="text-gray-600 text-sm">All scientific applications from fusion to fertility therapeutics</p>
          </div>

          {/* Region */}
          <div className="text-center">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="h-8 w-8 text-red-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Region</h4>
            <p className="text-gray-600 text-sm">Science knows no border, we have invested across all of US, Europe and even in India</p>
          </div>

          {/* Wilbe Way */}
          <div className="text-center">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-red-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Wilbe Way</h4>
            <p className="text-gray-600 text-sm">All the scientists became founders through our support process</p>
          </div>
        </div>

        {/* Fund Strategy Section */}
        <div className="bg-white rounded-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Our Fund Strategy</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Fund 1 */}
            <div className="text-center">
              <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-700 font-bold text-lg">1</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Fund 1</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Supported scientists in their transition from researchers to founders through our comprehensive process
              </p>
            </div>

            {/* Fund 2 */}
            <div className="text-center">
              <div className="bg-red-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 font-bold text-lg">2</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Fund 2</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Investing solely in scientists who have completed the Wilbe Way methodology
              </p>
            </div>
          </div>
        </div>

        {/* Backed Founders section */}
        <BackedFoundersSection initialCount={6} loadMoreCount={6} />
        
        {/* View All button - now links to external wilbe.capital */}
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
    </section>;
}
