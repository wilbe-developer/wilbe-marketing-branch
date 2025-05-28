
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import BackedFoundersSection from "./BackedFoundersSection";

export default function WilbeCapitalStrip() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex">
          {/* Left border line */}
          <div className="flex flex-col items-center mr-8">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4">
              3
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 pb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Wilbe Capital: investing exclusively in scientist-led companies
            </h3>
            <p className="text-gray-700 text-lg leading-relaxed mb-6 max-w-4xl">
              Wilbe Capital backs scientist-led startups solving critical challenges in health, climate, and security. Offering strategic funding and partnerships, it helps researchers transform discoveries into scalable businesses, supporting BSF graduates and Sandbox members to drive impact.
            </p>

            {/* Backed Founders section */}
            <BackedFoundersSection initialCount={6} loadMoreCount={6} />
            
            {/* Button for Wilbe Capital */}
            <div className="mt-6">
              <Button asChild className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-2">
                <a href="https://www.wilbe.capital/">
                  Explore Wilbe Capital
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
