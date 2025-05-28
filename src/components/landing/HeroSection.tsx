
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

export default function HeroSection() {
  return (
    <div className="lg:col-span-2">
      <div className="mb-6">
        <Badge className="bg-green-500 text-black border-0 uppercase tracking-wide text-xs font-bold px-3 py-1">
          Scientists First
        </Badge>
      </div>
      <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight text-white">
        THE MOVEMENT FOR
        <span className="text-green-500"> SCIENTIST</span>
        <span className="text-green-500"> ENTREPRENEURS</span>
      </h1>
      <p className="text-xl text-gray-300 mb-8 max-w-2xl">
        From breakthrough to business. We're the world's first end-to-end platform connecting entrepreneurial scientists with market intelligence, exclusive insights, venture tools, founders community and lab space—all in one place. Also investing in the best performing.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-500 mb-1">1.3K+</div>
          <p className="text-gray-400 text-sm uppercase tracking-wide">Entrepreneurial Scientists</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-500 mb-1">35%</div>
          <p className="text-gray-400 text-sm uppercase tracking-wide">Scientist Founders</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-500 mb-1">62%</div>
          <p className="text-gray-400 text-sm uppercase tracking-wide">MAU Growth</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          size="lg"
          className="bg-green-500 hover:bg-green-600 text-black font-bold uppercase tracking-wide px-8"
        >
          Start Your Journey
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="border-gray-600 text-white hover:bg-gray-800 font-bold uppercase tracking-wide px-8"
        >
          Explore Tools
        </Button>
      </div>
    </div>
  )
}
