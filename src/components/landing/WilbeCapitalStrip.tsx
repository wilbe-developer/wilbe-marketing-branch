
import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Globe, FileText, Lightbulb, Rocket } from "lucide-react";
import BackedFoundersSection from "./BackedFoundersSection";

export default function WilbeCapitalStrip() {
  return <section id="wilbe-capital" className="py-20 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 tracking-wide mb-6">
            INVESTING IN SCIENTIST FOUNDERS: THE WILBE WAY
          </h2>
        </div>

        {/* Who This Is For Section - Traditional Paragraph */}
        <div className="mb-12">
          <p className="text-xl text-gray-700 leading-relaxed max-w-4xl">
            Becoming a founder and securing capital requires a mindset shift and operational insight. All the scientists we have backed so far have become founders through a process designed to maximize your chances of success and accelerate our response.
          </p>
        </div>

        {/* Backed Founders section - moved here */}
        <BackedFoundersSection initialCount={6} loadMoreCount={6} />

        {/* Investment Criteria Grid - moved below founders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 mt-12">
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
