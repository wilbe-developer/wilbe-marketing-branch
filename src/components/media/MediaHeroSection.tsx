
import { Button } from "@/components/ui/button"
import { Play, ArrowRight } from "lucide-react"

export default function MediaHeroSection() {
  return (
    <section className="bg-black text-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              WILBE MEDIA
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Discover the latest insights, stories, and breakthroughs from the world of science entrepreneurship. 
              From founder interviews to industry analysis, we bring you the content that matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-white text-black hover:bg-gray-100 font-bold uppercase tracking-wide px-8 py-3">
                <Play className="mr-2 h-5 w-5" />
                Watch Latest
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black font-bold uppercase tracking-wide px-8 py-3">
                Browse All Content
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="Media production"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-2 border-white rounded-full p-4">
                  <Play className="h-8 w-8" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
