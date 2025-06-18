
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
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

        {/* Description */}
        <p className="text-gray-700 text-lg leading-relaxed mb-12 max-w-4xl">Wilbe Capital is our investment arm and is entirely dedicated to investing in scientists that can become the industrial leaders of this century. We invest in scientists looking to disrupt all sectors (from fusion to therapeutics) regions (from Bangalore to Los Angeles). Only interested in the first round, with or without foundational IP. What all the scientists we have backed so far have in common: they have met them and transitioned from scientist to founders through our process.</p>

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
