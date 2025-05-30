
import { Button } from "@/components/ui/button"
import { Play, ArrowRight } from "lucide-react"

export default function MediaHeroSection() {
  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Featured Story */}
          <div className="lg:col-span-2">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="Featured story"
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-2 border-white rounded-full p-4">
                  <Play className="h-8 w-8" />
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
                The Future of Science Entrepreneurship: Q1 2024 Insights
              </h1>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                Exclusive analysis of breakthrough funding rounds, emerging biotech trends, and the scientist-founders reshaping industries from climate tech to precision medicine.
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span>WILBE MEDIA</span>
                <span className="mx-2">•</span>
                <span>12 MIN READ</span>
                <span className="mx-2">•</span>
                <span>2 HOURS AGO</span>
              </div>
            </div>
          </div>

          {/* Side Stories */}
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                Climate Tech Raises $2.1B in Q1
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                Record-breaking quarter shows investor confidence in science-based climate solutions.
              </p>
              <div className="text-xs text-gray-500">15 MIN AGO</div>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                FDA Approves Gene Therapy
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                Latest breakthrough in personalized medicine opens new treatment pathways.
              </p>
              <div className="text-xs text-gray-500">1 HOUR AGO</div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                AI Drug Discovery Platform
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                Machine learning accelerates pharmaceutical research timelines.
              </p>
              <div className="text-xs text-gray-500">3 HOURS AGO</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
