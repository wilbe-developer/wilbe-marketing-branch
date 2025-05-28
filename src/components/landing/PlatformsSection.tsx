
import { Button } from "@/components/ui/button";
import { ArrowRight, Database, Users, Lightbulb, Calendar, FileText } from "lucide-react";
import LatestMaterialFeed from "./LatestMaterialFeed";
import EventsFeed from "./EventsFeed";

export default function PlatformsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Platforms</h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            From ideation to market success, we provide comprehensive support across every stage of your scientific entrepreneurship journey.
          </p>
        </div>

        <div className="space-y-16">
          {/* Wilbe Labs */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="p-8 lg:p-12">
                <div className="flex items-center mb-6">
                  <Lightbulb className="h-8 w-8 text-orange-600 mr-3" />
                  <h3 className="text-3xl font-bold text-gray-900">Wilbe Labs</h3>
                </div>
                <p className="text-gray-600 mb-8 text-lg">
                  Transform your breakthrough research into a viable business. Our comprehensive incubator program provides the resources, mentorship, and network you need to navigate from lab bench to market launch.
                </p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    12-week intensive program
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    Expert mentorship network
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    Seed funding opportunities
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    IP development support
                  </div>
                </div>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                  Apply to Labs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 lg:p-12 h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-orange-600 mb-2">85%</div>
                  <div className="text-gray-700">Success Rate</div>
                  <div className="text-sm text-gray-600 mt-4">
                    Companies that successfully raise Series A funding
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wilbe Sandbox */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8 lg:p-12">
              <div className="flex items-center mb-6">
                <Database className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-3xl font-bold text-gray-900">Wilbe Sandbox</h3>
                <span className="ml-4 text-lg text-gray-600">Connect and Kickstart Your Journey</span>
              </div>
              <p className="text-gray-600 mb-8 text-lg max-w-4xl">
                Your collaborative workspace for building, learning, and connecting with fellow scientist entrepreneurs. Access exclusive content, join events, and accelerate your journey from lab to market.
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Latest Material Feed */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <LatestMaterialFeed />
                </div>

                {/* Events Feed */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <EventsFeed />
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 mb-8">
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Exclusive workshops
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Founder network access
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Resource library
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Investor connections
                </div>
              </div>

              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Enter Sandbox
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Community Stats */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">250+</div>
                <div className="text-gray-600">Active Scientists</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">150+</div>
                <div className="text-gray-600">Startups Launched</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">$50M+</div>
                <div className="text-gray-600">Funding Raised</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600 mb-2">95%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
