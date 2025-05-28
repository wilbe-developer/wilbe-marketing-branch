
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
      <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
        THE HOME FOR
        <span className="text-green-500"> ENTREPRENEURIAL SCIENTISTS</span>
      </h1>
      <p className="text-xl text-gray-300 mb-8 max-w-2xl">
        From breakthrough to business. We're the world's first comprehensive platform connecting scientist
        founders with market intelligence, exclusive insights, venture tools, founders community, lab space and
        capital—all in one place.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="text-center">
          <div className="text-3xl font-bold text-green-500 mb-1">10K+</div>
          <p className="text-gray-400 text-sm uppercase tracking-wide">Scientist Founders</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-500 mb-1">$2.1B+</div>
          <p className="text-gray-400 text-sm uppercase tracking-wide">Capital Deployed</p>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-500 mb-1">47+</div>
          <p className="text-gray-400 text-sm uppercase tracking-wide">Portfolio Companies</p>
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
