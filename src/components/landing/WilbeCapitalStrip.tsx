
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import BackedFoundersSection from "./BackedFoundersSection";

export default function WilbeCapitalStrip() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white tracking-wide mb-6">
            WILBE CAPITAL: INVESTING IN SCIENTIST-LED COMPANIES
          </h2>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-lg leading-relaxed mb-12 max-w-4xl">
          Wilbe Capital backs scientist-led startups solving critical challenges in health, climate, and security. Offering strategic funding and partnerships, it helps researchers transform discoveries into scalable businesses, supporting BSF graduates and Sandbox members to drive impact.
        </p>

        {/* Backed Founders section */}
        <BackedFoundersSection initialCount={6} loadMoreCount={6} />
        
        {/* View All button */}
        <div className="text-center mt-12">
          <Link to="/capital">
            <Button className="bg-white hover:bg-gray-100 text-gray-900 font-medium px-8 py-3 rounded-none">
              <span className="flex items-center">
                VIEW ALL PORTFOLIO
                <ArrowRight className="ml-2 h-4 w-4" />
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
