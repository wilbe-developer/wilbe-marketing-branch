
import { Badge } from "@/components/ui/badge"
import { MapPin, Camera, Calendar } from "lucide-react"

export default function RoadshowGallery() {
  const roadshowStops = [
    {
      location: "San Francisco, CA",
      date: "March 2024",
      description: "Kickoff at UCSF - Meeting biotech founders",
      image: "/placeholder.svg"
    },
    {
      location: "Boston, MA",
      date: "April 2024", 
      description: "Harvard & MIT campus visits",
      image: "/placeholder.svg"
    },
    {
      location: "Austin, TX",
      date: "May 2024",
      description: "UT research collaboration discussions",
      image: "/placeholder.svg"
    },
    {
      location: "Seattle, WA",
      date: "June 2024",
      description: "UW medicine and tech crossover",
      image: "/placeholder.svg"
    },
    {
      location: "Denver, CO",
      date: "July 2024",
      description: "Rocky Mountain biotech scene",
      image: "/placeholder.svg"
    },
    {
      location: "Chicago, IL",
      date: "August 2024",
      description: "Midwest innovation hub exploration",
      image: "/placeholder.svg"
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-white text-black border-0 uppercase tracking-wide text-sm">
            On The Road
          </Badge>
          <h2 className="text-5xl font-bold text-white mb-4 uppercase tracking-wide">
            RV Roadshow Gallery
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our iconic RV has traveled across the country, connecting with scientist entrepreneurs 
            at universities, research institutions, and innovation hubs nationwide.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {roadshowStops.map((stop, index) => (
            <div key={index} className="bg-white/5 rounded-lg overflow-hidden backdrop-blur-sm transform hover:scale-105 transition-transform">
              <div className="h-48 bg-gray-700 flex items-center justify-center relative">
                <Camera className="h-12 w-12 text-gray-400" />
                <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  Photo Coming Soon
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="font-bold text-white">{stop.location}</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300 text-sm">{stop.date}</span>
                </div>
                <p className="text-gray-300 text-sm">{stop.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white/5 rounded-lg p-8 backdrop-blur-sm text-center">
          <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-wide">
            The Journey Continues
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Our RV roadshow has become a symbol of our commitment to meeting scientists where they are. 
            From coast to coast, we're building bridges between academic research and entrepreneurial success.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-bold text-white mb-2">15+</div>
              <div className="text-gray-300 uppercase tracking-wide text-sm">Cities Visited</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-gray-300 uppercase tracking-wide text-sm">Scientists Met</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">25,000</div>
              <div className="text-gray-300 uppercase tracking-wide text-sm">Miles Traveled</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
