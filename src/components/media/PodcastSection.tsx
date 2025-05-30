
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Clock, ArrowRight } from "lucide-react"

const podcastEpisodes = [
  {
    id: 1,
    title: "The Future of Biotech Funding with Dr. Sarah Chen",
    description: "Exploring new models for science-based startup funding in the post-pandemic world.",
    duration: "45:30",
    date: "2024-01-15",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "Climate Tech Innovations: From Lab to Market",
    description: "How breakthrough climate technologies are scaling from research to commercial success.",
    duration: "38:22",
    date: "2024-01-08",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Building Science Teams: Lessons from Unicorn Startups",
    description: "Insights on recruiting and retaining top scientific talent in competitive markets.",
    duration: "52:15",
    date: "2024-01-01",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

export default function PodcastSection() {
  return (
    <section id="podcasts" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold uppercase tracking-wide text-gray-900">WILBE PODCAST</h2>
          <Button variant="outline" className="hidden md:flex">
            All Episodes
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {podcastEpisodes.map((episode) => (
            <div key={episode.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <div className="relative aspect-video">
                <img
                  src={episode.image}
                  alt={episode.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-2 border-white rounded-full p-3">
                    <Play className="h-6 w-6" />
                  </Button>
                </div>
                <div className="absolute top-4 left-4">
                  <Badge className="bg-green-600 text-white text-xs flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {episode.duration}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2">{episode.title}</h4>
                <p className="text-gray-600 text-xs leading-relaxed mb-3 line-clamp-2">{episode.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs">
                    {new Date(episode.date).toLocaleDateString()}
                  </span>
                  <Button size="sm" variant="ghost" className="text-xs">
                    Listen Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Button variant="outline">
            All Episodes
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
