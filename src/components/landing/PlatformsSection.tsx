
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Users, FileText, DollarSign, Briefcase } from "lucide-react"

export default function PlatformsSection() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            All the tools to manage your entrepreneurial journey
          </h2>
        </div>

        <div className="space-y-16">
          {/* Platform 1 */}
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Wilbe Breakthrough: Framing your journey and connecting with peers
              </h3>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                The Wilbe Sandbox is a global community platform uniting scientists to explore entrepreneurial paths and launch startups. It provides startup basics videos, pitch deck guidance, funding opportunities, and exclusive job listings, empowering PhD students, postdocs, and industry scientists to move from academia to impact.
              </p>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center space-x-2 text-gray-700">
                  <Play className="h-5 w-5" />
                  <span>Startup Basics Videos</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <FileText className="h-5 w-5" />
                  <span>Pitch Deck Guidance</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <DollarSign className="h-5 w-5" />
                  <span>Funding Opportunities</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <Briefcase className="h-5 w-5" />
                  <span>Exclusive Job Listings</span>
                </div>
              </div>
              <Button className="bg-gray-900 hover:bg-gray-800 text-white font-bold uppercase tracking-wide px-6">
                I'm with you
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Platform 2 */}
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Wilbe Capital: Building High-Performance Startups
              </h3>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Wilbe Capital invests in scientist-led startups, offering pre-seed to Series A funding with strategic guidance tailored to deep tech ventures. We combine capital with expertise in regulatory pathways, market validation, and scaling science-based innovations to maximize impact and returns.
              </p>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center space-x-2 text-gray-700">
                  <DollarSign className="h-5 w-5" />
                  <span>Pre-seed to Series A</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <FileText className="h-5 w-5" />
                  <span>Strategic Guidance</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <Users className="h-5 w-5" />
                  <span>Expert Network</span>
                </div>
              </div>
              <Button className="bg-gray-900 hover:bg-gray-800 text-white font-bold uppercase tracking-wide px-6">
                Tell a Friend
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Platform 3 */}
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Wilbe Advocacy: Amplifying Scientists' Voices
              </h3>
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Wilbe Advocacy champions policies that support scientist entrepreneurs through strategic partnerships with government agencies, academic institutions, and industry leaders. We work to create favorable regulatory environments and funding ecosystems that enable scientific innovation to thrive in the marketplace.
              </p>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center space-x-2 text-gray-700">
                  <Users className="h-5 w-5" />
                  <span>Policy Advocacy</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <FileText className="h-5 w-5" />
                  <span>Strategic Partnerships</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <DollarSign className="h-5 w-5" />
                  <span>Funding Ecosystem</span>
                </div>
              </div>
              <Button className="bg-gray-900 hover:bg-gray-800 text-white font-bold uppercase tracking-wide px-6">
                Tell a Friend
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
