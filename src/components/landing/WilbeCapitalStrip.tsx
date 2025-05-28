
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useState } from "react";
import BackedFoundersSection from "./BackedFoundersSection";

export default function WilbeCapitalStrip() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Sample portfolio companies for the carousel
  const portfolioCompanies = [
    {
      id: 1,
      name: "DeepTech Therapeutics",
      founder: "Dr. Sarah Chen",
      description: "Revolutionary gene therapy platform targeting rare diseases through precision medicine.",
      sector: "Biotech",
      fundingRound: "Series A",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 2,
      name: "Climate Solutions Lab",
      founder: "Prof. Michael Torres",
      description: "Advanced carbon capture technology using novel crystalline structures.",
      sector: "Climate Tech",
      fundingRound: "Seed",
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 3,
      name: "Quantum Security Inc",
      founder: "Dr. Elena Vasquez",
      description: "Next-generation quantum encryption for secure communications infrastructure.",
      sector: "Security",
      fundingRound: "Series B",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 4,
      name: "BioMaterials Co",
      founder: "Dr. James Park",
      description: "Sustainable biomaterials platform replacing traditional plastics.",
      sector: "Materials",
      fundingRound: "Series A",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, portfolioCompanies.length - 2));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, portfolioCompanies.length - 2)) % Math.max(1, portfolioCompanies.length - 2));
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with navigation arrows */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 tracking-wide">
            WILBE CAPITAL: INVESTING IN SCIENTIST-LED COMPANIES
          </h2>
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-lg leading-relaxed mb-12 max-w-4xl">
          Wilbe Capital backs scientist-led startups solving critical challenges in health, climate, and security. Offering strategic funding and partnerships, it helps researchers transform discoveries into scalable businesses, supporting BSF graduates and Sandbox members to drive impact.
        </p>

        {/* Portfolio carousel */}
        <div className="relative overflow-hidden mb-12">
          <div 
            className="flex transition-transform duration-300 ease-in-out gap-6"
            style={{ transform: `translateX(-${currentIndex * 33.333}%)` }}
          >
            {portfolioCompanies.map((company) => (
              <div key={company.id} className="flex-shrink-0 w-1/3 bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="relative h-48 bg-gray-900">
                  <img 
                    src={company.image} 
                    alt={company.name}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      {company.fundingRound}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-bold text-lg mb-1">{company.name}</h3>
                    <p className="text-sm opacity-90">Founded by {company.founder}</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {company.description}
                  </p>
                  <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                    {company.sector}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Backed Founders section */}
        <BackedFoundersSection initialCount={6} loadMoreCount={6} />
        
        {/* View All button */}
        <div className="text-center mt-12">
          <Button className="bg-gray-900 hover:bg-gray-800 text-white font-medium px-8 py-3 rounded-none">
            <a href="https://www.wilbe.capital/" className="flex items-center">
              VIEW ALL PORTFOLIO
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
