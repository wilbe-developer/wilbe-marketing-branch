
import { Button } from "@/components/ui/button";
import { ArrowRight, Database, Users } from "lucide-react";
import LatestMaterialFeed from "./LatestMaterialFeed";
import EventsFeed from "./EventsFeed";

export default function WilbeSandboxSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            <span className="text-6xl">Wilbe</span> SANDBOX
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Your collaborative workspace for building, learning, and connecting with fellow scientist entrepreneurs.
            Access exclusive content, join events, and accelerate your journey from lab to market.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Main Content Area */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-6">
                <Database className="h-8 w-8 text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-900">Access Your Workspace</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Join the exclusive Wilbe Sandbox to access premium content, connect with mentors, 
                and collaborate with fellow scientist entrepreneurs on your startup journey.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Exclusive workshops and masterclasses
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Direct access to successful founders
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Collaborative project spaces
                </div>
                <div className="flex items-center text-sm text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Investor networking opportunities
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold uppercase tracking-wide px-8"
                >
                  Enter Sandbox
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-50 font-bold uppercase tracking-wide px-8"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>

          {/* Feeds Section */}
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
            {/* Latest Material Feed */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <LatestMaterialFeed />
            </div>

            {/* Events Feed */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <EventsFeed />
            </div>
          </div>
        </div>

        {/* Community Stats */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
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
    </section>
  );
}
