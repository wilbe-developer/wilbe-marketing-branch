
import { Badge } from "@/components/ui/badge"
import { Building, Target, Globe, Zap } from "lucide-react"

export default function FundInformation() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-black text-white border-0 uppercase tracking-wide text-sm">
            Current Fund
          </Badge>
          <h2 className="text-5xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Fund II Now Investing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our second fund continues our mission to back the world's most promising scientist entrepreneurs, 
            building on the success of our inaugural fund.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
              Investment Focus
            </h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-black text-white p-2 rounded">
                  <Building className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Deep Tech & Life Sciences</h4>
                  <p className="text-gray-600">
                    Companies leveraging breakthrough scientific research in biotechnology, materials science, 
                    and advanced manufacturing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-black text-white p-2 rounded">
                  <Target className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Platform Integration</h4>
                  <p className="text-gray-600">
                    Priority access to companies that have completed our BSF program and are part of 
                    our scientist entrepreneur ecosystem.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-black text-white p-2 rounded">
                  <Globe className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Global Reach</h4>
                  <p className="text-gray-600">
                    Investing in scientist-led companies worldwide, with strong networks in North America, 
                    Europe, and Asia-Pacific.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-black text-white p-2 rounded">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Early Stage Focus</h4>
                  <p className="text-gray-600">
                    Seed to Series A investments, typically $100K-$2M initial checks with follow-on 
                    capability for breakout companies.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 uppercase tracking-wide">
              Fund II Highlights
            </h3>
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Fund Size</span>
                  <span className="font-bold text-gray-900">$50M</span>
                </div>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Investment Range</span>
                  <span className="font-bold text-gray-900">$100K - $2M</span>
                </div>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Portfolio Target</span>
                  <span className="font-bold text-gray-900">25-30 Companies</span>
                </div>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Investment Stage</span>
                  <span className="font-bold text-gray-900">Seed to Series A</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Geographic Focus</span>
                  <span className="font-bold text-gray-900">Global</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
