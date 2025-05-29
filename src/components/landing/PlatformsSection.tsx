
import { Badge } from "@/components/ui/badge"

export default function PlatformsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 tracking-wide mb-6">
            ALL THE TOOLS TO SECURE REAL FUNDING
          </h2>
        </div>

        {/* Platform Cards */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Wilbe Breakthrough */}
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">1</span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Wilbe Breakthrough: framing your journey and connecting with peers
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our global community platform brings together scientist-entrepreneurs to share experiences, 
                find co-founders, and access exclusive resources. Connect with like-minded innovators who 
                understand the unique challenges of turning scientific breakthroughs into successful businesses.
              </p>
              <Badge className="bg-blue-100 text-blue-700 border-0">
                Coming Soon
              </Badge>
            </div>
          </div>

          {/* Wilbe Sandbox */}
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">2</span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Wilbe Sandbox: 10-day company building sprint
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Transform your scientific breakthrough into a fundable startup in just 10 days. 
                Our intensive, guided program helps you validate your idea, build your team, 
                and create a compelling pitch that investors can't ignore.
              </p>
              <Badge className="bg-green-100 text-green-700 border-0">
                Live Now
              </Badge>
            </div>
          </div>

          {/* Wilbe Labs */}
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">3</span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Wilbe Labs: accessing lab space and equipment
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Access world-class laboratory facilities and cutting-edge equipment without the overhead. 
                Our network of partner labs provides flexible access to the resources you need to develop 
                and validate your technology.
              </p>
              <Badge className="bg-blue-100 text-blue-700 border-0">
                Coming Soon
              </Badge>
            </div>
          </div>

          {/* Wilbe Capital */}
          <div className="flex gap-6">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-sm">4</span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Wilbe Capital: investing in the best performing
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Strategic funding for scientist-led companies that are ready to scale. 
                We provide capital, mentorship, and strategic partnerships to help you 
                navigate the path from breakthrough to market success.
              </p>
              <Badge className="bg-green-100 text-green-700 border-0">
                Live Now
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
