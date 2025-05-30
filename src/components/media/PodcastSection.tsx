
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
    category: "Funding"
  },
  {
    id: 2,
    title: "Climate Tech Innovations: From Lab to Market",
    description: "How breakthrough climate technologies are scaling from research to commercial success.",
    duration: "38:22",
    date: "2024-01-08",
    category: "Climate"
  },
  {
    id: 3,
    title: "Building Science Teams: Lessons from Unicorn Startups",
    description: "Insights on recruiting and retaining top scientific talent in competitive markets.",
    duration: "52:15",
    date: "2024-01-01",
    category: "Leadership"
  }
];

export default function PodcastSection() {
  return (
    <section id="podcasts" className="py-12 bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 pb-2 border-b-2 border-black">PODCASTS</h2>
          <Button variant="ghost" className="text-gray-900 hover:bg-gray-100 text-sm font-medium">
            ALL EPISODES
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {podcastEpisodes.map((episode, index) => (
            <article key={episode.id} className={`${index === 0 ? 'md:flex md:gap-8' : ''} bg-white border border-gray-200 p-6 hover:shadow-md transition-shadow`}>
              {index === 0 && (
                <div className="md:w-1/3 mb-4 md:mb-0">
                  <div className="aspect-square bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Play className="h-16 w-16 text-white" />
                  </div>
                </div>
              )}
              <div className={`${index === 0 ? 'md:w-2/3' : ''}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="text-xs font-medium">
                    {episode.category}
                  </Badge>
                  <Badge className="bg-blue-600 text-white text-xs flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {episode.duration}
                  </Badge>
                </div>
                <h3 className={`font-bold text-gray-900 mb-2 leading-tight ${index === 0 ? 'text-xl' : 'text-lg'}`}>
                  {episode.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{episode.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-medium">
                    {new Date(episode.date).toLocaleDateString().toUpperCase()}
                  </span>
                  <Button size="sm" variant="outline" className="text-xs font-medium">
                    <Play className="h-3 w-3 mr-1" />
                    LISTEN NOW
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
