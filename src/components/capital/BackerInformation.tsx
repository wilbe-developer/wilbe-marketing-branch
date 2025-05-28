
import { Badge } from "@/components/ui/badge"
import { MapPin, Award, Building2, Rocket } from "lucide-react"

export default function BackerInformation() {
  const backerTypes = [
    {
      icon: Rocket,
      title: "Exited Founders",
      description: "Successful entrepreneurs who have built and exited technology companies",
      examples: ["Biotech IPOs", "Deep Tech Acquisitions", "SaaS Exits"]
    },
    {
      icon: Building2,
      title: "Big Tech Executives",
      description: "Senior leadership from major technology companies",
      examples: ["FAANG Companies", "Unicorn Startups", "Global Tech Leaders"]
    },
    {
      icon: Award,
      title: "Industry Veterans",
      description: "Experienced investors and operators in life sciences and deep tech",
      examples: ["Venture Partners", "Former CEOs", "Scientific Advisors"]
    },
    {
      icon: MapPin,
      title: "Global Network",
      description: "International presence spanning major innovation hubs",
      examples: ["Bay Area", "London", "Singapore"]
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-white text-black border-0 uppercase tracking-wide text-sm">
            Our Backers
          </Badge>
          <h2 className="text-5xl font-bold text-white mb-4 uppercase tracking-wide">
            Backed by Proven Leaders
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Wilbe Capital is supported by a network of successful entrepreneurs, executives, and investors 
            who understand what it takes to build transformative science-based companies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {backerTypes.map((backer, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-6 backdrop-blur-sm">
              <div className="bg-white/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <backer.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 uppercase tracking-wide">{backer.title}</h3>
              <p className="text-gray-300 text-sm mb-4">{backer.description}</p>
              <div className="space-y-1">
                {backer.examples.map((example, i) => (
                  <div key={i} className="text-xs text-gray-400 uppercase tracking-wide">
                    {example}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/5 rounded-lg p-8 backdrop-blur-sm">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">$2.5B+</div>
              <div className="text-gray-300 uppercase tracking-wide text-sm">
                Combined Exit Value
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Our backers' successful companies
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">50+</div>
              <div className="text-gray-300 uppercase tracking-wide text-sm">
                Years Combined Experience
              </div>
              <div className="text-xs text-gray-400 mt-1">
                In building science companies
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">15+</div>
              <div className="text-gray-300 uppercase tracking-wide text-sm">
                Countries Represented
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Global innovation network
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            Geographic Presence
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "San Francisco", "New York", "London", "Singapore", "Tokyo", 
              "Berlin", "Tel Aviv", "Toronto", "Sydney", "Hong Kong"
            ].map((city) => (
              <Badge key={city} className="bg-white/10 text-white border-white/20 uppercase tracking-wide">
                {city}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
