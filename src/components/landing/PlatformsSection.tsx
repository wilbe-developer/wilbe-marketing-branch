
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, Zap, TrendingUp } from "lucide-react";
import BackedFoundersSection from "./BackedFoundersSection";
import LatestContentFeed from "./LatestContentFeed";

export default function PlatformsSection() {
  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4 md:mb-6">
            <Users className="h-8 w-8 md:h-12 md:w-12 text-gray-900 mb-2 sm:mb-0 sm:mr-4" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 uppercase tracking-wide text-center">
              The Platforms
            </h2>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Everything a scientist entrepreneur needs in one integrated platform. From market intelligence to 
            lab space, funding to community - we've built the complete ecosystem for science commercialization.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          {/* Wilbe Terminal */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <Zap className="h-6 w-6 md:h-8 md:w-8 text-blue-600 mr-3" />
              <Badge className="bg-blue-100 text-blue-700 text-xs">PLATFORM</Badge>
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-900">Wilbe Terminal</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
              Market intelligence platform providing real-time insights on industry trends, competitor analysis, 
              and funding opportunities specifically for scientist entrepreneurs.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Active Users</span>
                <span className="font-bold text-gray-900">1,200+</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Data Points</span>
                <span className="font-bold text-gray-900">50,000+</span>
              </div>
            </div>
            <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm">
              Access Terminal
            </Button>
          </div>

          {/* Wilbe Capital */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-green-600 mr-3" />
              <Badge className="bg-green-100 text-green-700 text-xs">FUNDING</Badge>
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-900">Wilbe Capital</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
              Dedicated venture fund investing in science-based startups. We understand the unique challenges 
              of commercializing breakthrough research.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Portfolio Companies</span>
                <span className="font-bold text-gray-900">25+</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Total Deployed</span>
                <span className="font-bold text-gray-900">$15M+</span>
              </div>
            </div>
            <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white text-sm">
              View Portfolio
            </Button>
          </div>

          {/* Wilbe Labs */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <Users className="h-6 w-6 md:h-8 md:w-8 text-purple-600 mr-3" />
              <Badge className="bg-purple-100 text-purple-700 text-xs">LABS</Badge>
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-900">Wilbe Labs</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
              Premium laboratory spaces and equipment access for scientist entrepreneurs. From wet labs to 
              specialized equipment, we provide the infrastructure you need.
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Lab Locations</span>
                <span className="font-bold text-gray-900">8</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm">
                <span className="text-gray-600">Equipment Value</span>
                <span className="font-bold text-gray-900">$2M+</span>
              </div>
            </div>
            <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm">
              Book Lab Time
            </Button>
          </div>
        </div>

        {/* Two-column layout for founders and content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          <div>
            <BackedFoundersSection />
          </div>
          <div>
            <LatestContentFeed />
          </div>
        </div>

        <div className="text-center mt-12 md:mt-16">
          <Button
            size="lg"
            className="bg-gray-900 hover:bg-black text-white font-bold uppercase tracking-wide px-6 sm:px-8 text-sm sm:text-base"
          >
            Join The Platform
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
