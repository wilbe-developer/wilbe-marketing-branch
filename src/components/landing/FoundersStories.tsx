
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play } from "lucide-react"
import { useScrollHandler } from "@/hooks/useScrollHandler"
import { videoPlaylist } from "@/data/videoPlaylist"

export default function FoundersStories() {
  const { scrollRef, handleScroll, handleMouseWheel } = useScrollHandler()

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
          <div className="flex space-x-6" ref={scrollRef} onWheel={handleMouseWheel}>
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
