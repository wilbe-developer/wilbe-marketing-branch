
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play } from "lucide-react"
import { useRef } from "react"

export default function FoundersStories() {
  const foundersStoriesRef = useRef<HTMLDivElement>(null)

  const videoPlaylist = [
    {
      id: 1,
      title: "From PhD to $100M: Dr. Maria Rodriguez's Journey",
      duration: "24:30",
      thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "Founder Stories",
      description: "How a failed cancer drug became revolutionary gene therapy",
    },
    {
      id: 2,
      title: "CRISPR's $50B Market: Dr. Jennifer Doudna Interview",
      duration: "18:45",
      thumbnail: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "Science Deep Dive",
      description: "The future of gene editing and biotechnology startups",
    },
    {
      id: 3,
      title: "Pitch Perfect: Biotech Edition Masterclass",
      duration: "32:15",
      thumbnail: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "Masterclass",
      description: "5 pitch deck mistakes that kill science startups",
    },
    {
      id: 4,
      title: "Inside a $50M Biotech Lab Tour",
      duration: "15:20",
      thumbnail: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "Lab Tours",
      description: "Exclusive behind-the-scenes at cutting-edge research facilities",
    },
    {
      id: 5,
      title: "Climate Tech Scaling: Climeworks Case Study",
      duration: "28:10",
      thumbnail: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      category: "Case Studies",
      description: "From lab breakthrough to $110M Series C funding",
    },
    {
      id: 6,
      title: "Building Teams Over Technology",
      duration: "8:42",
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      category: "CEO Insights",
      description: "Dr. Tim Fell on what investors really fund",
    },
    {
      id: 7,
      title: "From Vision to Execution",
      duration: "12:15",
      thumbnail: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      category: "Scaling",
      description: "Dr. Christoph Gebald on growth rounds vs early stage",
    },
    {
      id: 8,
      title: "Hiring for Values First",
      duration: "15:30",
      thumbnail: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      category: "Culture",
      description: "Dr. Karsten Temme on building startup culture",
    },
  ]

  const handleScroll = (scrollOffset: number) => {
    if (foundersStoriesRef.current) {
      foundersStoriesRef.current.scrollLeft += scrollOffset
    }
  }

  const handleMouseWheel = (e: any) => {
    e.preventDefault()
    if (foundersStoriesRef.current) {
      foundersStoriesRef.current.scrollLeft += e.deltaY
    }
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold uppercase tracking-wide text-gray-900">Founders Stories</h2>
          <div className="flex space-x-4">
            <button onClick={() => handleScroll(-300)} className="bg-gray-200 hover:bg-gray-300 p-2">
              <ArrowRight className="w-5 h-5 transform rotate-180" />
            </button>
            <button onClick={() => handleScroll(300)} className="bg-gray-200 hover:bg-gray-300 p-2">
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex space-x-6" ref={foundersStoriesRef} onWheel={handleMouseWheel}>
            {videoPlaylist.map((video) => (
              <div
                key={video.id}
                className="flex-shrink-0 w-80 bg-gray-50 overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-16 h-16 bg-white flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg">
                      <Play className="h-6 w-6 text-gray-900 ml-1" />
                    </button>
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-gray-900 text-white text-xs">{video.category}</Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/70 backdrop-blur-sm p-3">
                      <h3 className="text-white font-bold text-sm mb-1">{video.title}</h3>
                      <p className="text-gray-300 text-xs">{video.description}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-gray-900 text-sm mb-2">{video.title}</h4>
                  <p className="text-gray-600 text-xs leading-relaxed mb-3">{video.description}</p>
                  <div className="flex items-center">
                    <span className="text-gray-500 text-xs">{video.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center mt-12">
        <a href="https://wilbe.com/media">
          <Button size="lg" className="bg-gray-900 hover:bg-black text-white font-bold uppercase tracking-wide px-8">
            VIEW ALL MEDIA
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </a>
      </div>
    </div>
  )
}
