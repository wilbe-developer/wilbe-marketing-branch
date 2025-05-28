
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, PartyPopper } from "lucide-react"
import { Link } from "react-router-dom"

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
        From breakthrough to business growth. We're the world's first end-to-end platform connecting entrepreneurial scientists with market intelligence, exclusive insights, venture tools, founders community and lab space—all in one place. Also investing in the best performing.
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
          Getting Started
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <Link to="/quiz" target="_blank" rel="noopener noreferrer">
          <Button
            size="lg"
            className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white font-bold uppercase tracking-wide px-8 border-0 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/30 before:to-transparent before:w-full before:h-full before:translate-x-[-100%] before:animate-[glow-wave_3s_ease-in-out_infinite] before:skew-x-12"
          >
            <PartyPopper className="mr-2 h-5 w-5 relative z-10" />
            <span className="relative z-10">Infinite Quiz</span>
          </Button>
        </Link>
      </div>

      <style jsx>{`
        @keyframes glow-wave {
          0% {
            transform: translateX(-100%) skewX(12deg);
          }
          50% {
            transform: translateX(100%) skewX(12deg);
          }
          100% {
            transform: translateX(100%) skewX(12deg);
          }
        }
      `}</style>
    </div>
  )
}
