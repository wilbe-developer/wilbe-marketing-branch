
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useScrollHandler } from "@/hooks/useScrollHandler";
import { portfolioCompanies } from "@/data/portfolioCompanies";
import PortfolioCard from "./PortfolioCard";

export default function PortfolioSection() {
  const { scrollRef, handleScroll, handleMouseWheel } = useScrollHandler();

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4 uppercase tracking-wide">Wilbe Capital Portfolio</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We invest in the world's most promising scientist entrepreneurs. Meet some of our portfolio founders who
            are transforming industries through science.
          </p>
        </div>

        <div className="relative mb-12">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold uppercase tracking-wide text-gray-900">Founder Spotlights</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => handleScroll(-300)}
                className="bg-gray-200 hover:bg-gray-300 p-2"
              >
                <ArrowRight className="w-5 h-5 transform rotate-180" />
              </button>
              <button onClick={() => handleScroll(300)} className="bg-gray-200 hover:bg-gray-300 p-2">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="overflow-hidden">
            <div
              className="flex space-x-6"
              ref={scrollRef}
              onWheel={handleMouseWheel}
            >
              {portfolioCompanies.map((company) => (
                <PortfolioCard key={company.id} company={company} />
              ))}
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="bg-black hover:bg-gray-800 text-white px-8 py-3 uppercase tracking-wide font-bold"
          >
            View Full Portfolio
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
