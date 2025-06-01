
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, PartyPopper } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <div className="lg:col-span-2">
      <div className="mb-4 sm:mb-6">
        <Badge className="bg-green-500 text-black border-0 uppercase tracking-wide text-xs font-bold px-3 py-1">
          Scientists First
        </Badge>
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight text-white">
        THE MOVEMENT FOR
        <span className="text-green-500"> SCIENTIST</span>
        <span className="text-green-500"> ENTREPRENEURS</span>
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl leading-relaxed">
        Where breakthroughs become businesses. We help scientist founders turn research into high performing companies — with venture tools, capital, market intelligence, community, and lab space from day zero.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="text-center p-4 bg-black/20 rounded-lg backdrop-blur-sm">
          <div className="text-2xl sm:text-3xl font-bold text-green-500 mb-1">1.3K+</div>
          <p className="text-gray-400 text-xs sm:text-sm uppercase tracking-wide">SCIENTIST COMMUNITY</p>
        </div>
        <div className="text-center p-4 bg-black/20 rounded-lg backdrop-blur-sm">
          <div className="text-2xl sm:text-3xl font-bold text-green-500 mb-1">30%</div>
          <p className="text-gray-400 text-xs sm:text-sm uppercase tracking-wide">MONTHLY USER GROWTH</p>
        </div>
        <div className="text-center p-4 bg-black/20 rounded-lg backdrop-blur-sm">
          <div className="text-2xl sm:text-3xl font-bold text-green-500 mb-1">$680M</div>
          <p className="text-gray-400 text-xs sm:text-sm uppercase tracking-wide">COMBINED PORTFOLIO VALUATION</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          size="lg" 
          asChild 
          className="bg-green-500 hover:bg-green-600 text-black font-bold uppercase tracking-wide px-6 sm:px-8 min-h-[48px] w-full sm:w-auto"
        >
          <a href="#tools-section">
            Getting Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </Button>
        <Link to="/quiz" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
          <Button 
            size="lg" 
            className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white font-bold uppercase tracking-wide px-6 sm:px-8 border-0 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-purple-500/25 overflow-hidden before:absolute before:top-0 before:left-[-100%] before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:animate-[shimmer_2.5s_ease-in-out_infinite] before:skew-x-12 rounded-lg min-h-[48px] w-full"
          >
            <PartyPopper className="mr-2 h-5 w-5 relative z-10" />
            <span className="relative z-10">Infinite Quiz</span>
          </Button>
        </Link>
      </div>

      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) skewX(12deg);
          }
          100% {
            transform: translateX(200%) skewX(12deg);
          }
        }
      `}</style>
    </div>
  );
}
