
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import BackedFoundersSection from "./BackedFoundersSection";

export default function WilbeCapitalStrip() {
  return (
    <section className="py-20 bg-white relative">
      {/* Top separator - subtle gradient border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-green-500 to-purple-500"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with strong typography */}
        <div className="mb-12 text-center">
          <h2 className="text-5xl font-black text-gray-900 tracking-tight mb-6 leading-tight">
            WILBE CAPITAL
          </h2>
          <div className="w-24 h-1 bg-green-500 mx-auto mb-8"></div>
          <p className="text-xl font-semibold text-gray-700 uppercase tracking-wide mb-4">
            INVESTING IN SCIENTIST-LED COMPANIES
          </p>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-lg leading-relaxed mb-12 max-w-4xl mx-auto text-center">
          Wilbe Capital partners with scientist-led companies solving the most urgent and valuable challenges in health, climate, and security - on day zero. We work alongside our founders to transform novel insights into scalable businesses, supporting BSF graduates and Sandbox members to drive impact.
        </p>

        {/* Backed Founders section */}
        <BackedFoundersSection initialCount={6} loadMoreCount={6} />
        
        {/* View All button */}
        <div className="text-center mt-12">
          <Link to="/capital">
            <Button className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-200">
              <span className="flex items-center">
                VIEW ALL PORTFOLIO
                <ArrowRight className="ml-2 h-5 w-5" />
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
