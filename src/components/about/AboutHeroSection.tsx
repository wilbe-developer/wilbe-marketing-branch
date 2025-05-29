
import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Heart, Globe } from "lucide-react"

export default function AboutHeroSection() {
  return (
    <section className="bg-black text-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6 uppercase tracking-wide">
            About <span className="text-7xl">Wilbe</span>
          </h1>
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Since 2020, we've been putting scientists first. Our mission is to empower scientist entrepreneurs 
            with the tools, community, and capital they need to change the world.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 uppercase tracking-wide">Community First</h3>
            <p className="text-gray-300">
              Building a global network of scientist entrepreneurs who support and learn from each other.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 uppercase tracking-wide">Science First</h3>
            <p className="text-gray-300">
              We believe the best solutions to global challenges come from deep scientific research and innovation.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2 uppercase tracking-wide">Global Impact</h3>
            <p className="text-gray-300">
              From lab to market, we help scientist entrepreneurs create companies that change the world.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="bg-white text-black hover:bg-gray-100 font-bold uppercase tracking-wide px-8 py-3"
          >
            Join Our Community
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  )
}
