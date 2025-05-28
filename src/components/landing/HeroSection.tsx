
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

export default function HeroSection() {
  return (
    <div className="lg:col-span-2">
      <div className="mb-4 sm:mb-6">
        <Badge className="bg-green-500 text-black border-0 uppercase tracking-wide text-xs font-bold px-2 sm:px-3 py-1">
          Scientists First
        </Badge>
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight text-white">
        THE MOVEMENT FOR
        <span className="text-green-500"> REAL WORLD</span>
        <span className="text-green-500"> SCIENTISTS</span>
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl leading-relaxed">
        From breakthrough to business. We're the world's first end-to-end platform connecting entrepreneurial scientists with market intelligence, exclusive insights, venture tools, founders community and lab space—all in one place. Also investing in the best performing.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 sm:mb-8">
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold text-green-500 mb-1">1.3K+</div>
          <p className="text-gray-400 text-xs sm:text-sm uppercase tracking-wide">Entrepreneurial Scientists</p>
        </div>
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold text-green-500 mb-1">35%</div>
          <p className="text-gray-400 text-xs sm:text-sm uppercase tracking-wide">Scientist Founders</p>
        </div>
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold text-green-500 mb-1">62%</div>
          <p className="text-gray-400 text-xs sm:text-sm uppercase tracking-wide">MAU Growth</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Button
          size="lg"
          className="bg-green-500 hover:bg-green-600 text-black font-bold uppercase tracking-wide px-6 sm:px-8 text-sm sm:text-base"
        >
          Start Your Journey
          <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-gray-600 text-white hover:bg-gray-800 font-bold uppercase tracking-wide px-6 sm:px-8 text-sm sm:text-base"
        >
          Explore Tools
        </Button>
      </div>
    </div>
  )
}
