
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Users, Lightbulb } from "lucide-react"

export default function CapitalHeroSection() {
  return (
    <section className="bg-gray-900 text-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6 uppercase tracking-wide">
            Wilbe Capital
          </h1>
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Investing exclusively in scientist-led companies. Backed by exited founders from the Bay Area to Singapore, 
            and executives in big tech.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 uppercase tracking-wide">Scientist-Led Focus</h3>
            <p className="text-gray-300">
              We invest solely in companies founded by scientists and engineers solving real-world problems.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 uppercase tracking-wide">Platform Originated</h3>
            <p className="text-gray-300">
              Most of our investments originate through our platform and BSF program, ensuring deep founder relationships.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 uppercase tracking-wide">Proven Backers</h3>
            <p className="text-gray-300">
              Backed by successful exited founders and big tech executives from Silicon Valley to Singapore.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="bg-white text-black hover:bg-gray-100 font-bold uppercase tracking-wide px-8 py-3"
          >
            View Portfolio
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
