
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { backedFounders, BackedFounder } from "@/data/backedFounders";

interface BackedFoundersSectionProps {
  initialCount?: number;
  loadMoreCount?: number;
}

export default function BackedFoundersSection({
  initialCount = 6,
  loadMoreCount = 8
}: BackedFoundersSectionProps) {
  // Filter out Alexandre Webster and Ola Hekselman, then limit to first 6
  const filteredFounders = backedFounders.filter(founder => 
    founder.name !== "Alexandre Webster" && founder.name !== "Ola Hekselman"
  );
  const visibleFounders = filteredFounders.slice(0, 6);

  return (
    <div className="mt-8 w-full">
      {/* Header */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-500 uppercase tracking-wide">FROM POSTDOCS TO FOUNDERS WITH US: LEADING THE PACK</h4>
      </div>
      
      {/* Grid container - single row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-6">
        {visibleFounders.map(founder => (
          <FounderCard key={founder.id} founder={founder} />
        ))}
      </div>
    </div>
  );
}

interface FounderCardProps {
  founder: BackedFounder;
}

function FounderCard({ founder }: FounderCardProps) {
  return (
    <div className="bg-white hover:bg-gray-25 transition-colors duration-200 group border border-gray-100 hover:border-gray-200">
      {/* Image section - completely flat */}
      <div className="relative h-32 bg-gray-100">
        <img 
          src={founder.image} 
          alt={founder.name} 
          className="absolute inset-0 w-full h-full object-cover" 
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }} 
        />
      </div>
      
      {/* Content section with geometric spacing */}
      <div className="p-4 bg-white">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h5 className="font-bold text-gray-900 text-sm leading-tight mb-1">{founder.name}</h5>
            <p className="text-gray-600 text-xs">{founder.title}</p>
          </div>
          <div className="flex flex-col gap-2 ml-3">
            {/* Flat rectangular tags */}
            <div className="bg-gray-200 text-gray-700 text-xs px-3 py-1 font-medium">
              {founder.sector}
            </div>
            {founder.bsfClass && (
              <div className="bg-blue-200 text-blue-800 text-xs px-3 py-1 font-medium">
                {founder.bsfClass}
              </div>
            )}
          </div>
        </div>
        
        <h6 className="font-semibold text-gray-800 text-sm mb-2">{founder.company}</h6>
        <p className="text-gray-600 text-xs leading-relaxed mb-4 line-clamp-2">{founder.description}</p>
        
        {/* Quote section - completely flat geometric design */}
        <div className="bg-gray-100 p-4 relative">
          <div className="flex items-start gap-2">
            <Quote className="h-3 w-3 text-gray-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-700 leading-relaxed font-medium">
              {founder.quote}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
