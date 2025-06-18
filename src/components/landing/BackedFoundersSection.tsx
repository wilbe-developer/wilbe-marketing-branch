
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
  // Filter to only show Kärt, Francesco, Assia, and Shamit
  const allowedFounders = ["Kärt Tomberg", "Francesco Sciortino", "Assia Kasdi", "Shamit Shrivastava"];
  const visibleFounders = backedFounders.filter(founder => 
    allowedFounders.includes(founder.name)
  );

  return (
    <div className="mt-8 w-full">
      {/* Header */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-500 uppercase tracking-wide">FROM POSTDOCS TO FOUNDERS WITH US: LEADING THE PACK</h4>
      </div>
      
      {/* Grid container - full width, responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 w-full">
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
      {/* Image section with quote overlay */}
      <div className="relative h-48 bg-gray-100">
        <img 
          src={founder.image} 
          alt={founder.name} 
          className="absolute inset-0 w-full h-full object-cover" 
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }} 
        />
        
        {/* Quote overlay with dark semi-transparent background */}
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="text-center">
            {/* Large decorative opening quote */}
            <div className="text-4xl font-serif text-white/40 leading-none mb-2">"</div>
            
            {/* Quote text */}
            <p className="text-white text-sm leading-relaxed font-light italic px-2">
              {founder.quote}
            </p>
            
            {/* Large decorative closing quote */}
            <div className="text-4xl font-serif text-white/40 leading-none mt-2 rotate-180">"</div>
          </div>
        </div>
      </div>
      
      {/* Content section with founder info */}
      <div className="p-4 bg-white">
        <div className="mb-3">
          <h5 className="font-bold text-gray-900 text-sm leading-tight mb-1">{founder.name}</h5>
          <p className="text-gray-600 text-xs">{founder.title}</p>
        </div>
        
        <h6 className="font-semibold text-gray-800 text-sm mb-2">{founder.company}</h6>
        <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 mb-3">{founder.description}</p>
        
        {/* Tags moved to bottom */}
        <div className="flex gap-2 flex-wrap">
          <div className="bg-gray-200 text-gray-700 text-xs px-3 py-1 font-medium">
            {founder.sector}
          </div>
          {founder.bsfClass && (
            <div className="bg-green-200 text-green-800 text-xs px-3 py-1 font-medium">
              {founder.bsfClass}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
