
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { backedFounders, BackedFounder } from "@/data/backedFounders";

interface BackedFoundersSectionProps {
  initialCount?: number;
  loadMoreCount?: number;
}

export default function BackedFoundersSection({
  initialCount = 4,
  loadMoreCount = 8
}: BackedFoundersSectionProps) {
  const visibleFounders = backedFounders.slice(0, 4);
  
  return (
    <div className="mt-8 w-full">
      {/* Header without controls */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-gray-500 uppercase tracking-wide">FROM POSTDOCS TO FOUNDERS WITH US</h4>
      </div>
      
      {/* Gallery container aligned with content */}
      <div className="relative overflow-hidden">
        <div id="founders-gallery" className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 mb-6" style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}>
          {visibleFounders.map(founder => <FounderCard key={founder.id} founder={founder} />)}
        </div>
        
        {/* Gradient fade indicators */}
        <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
}

interface FounderCardProps {
  founder: BackedFounder;
}

function FounderCard({ founder }: FounderCardProps) {
  return (
    <div className="flex-shrink-0 w-72 sm:w-64 md:w-56 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
      <div className="relative h-32 sm:h-28 bg-gray-100">
        <img 
          src={founder.image} 
          alt={founder.name} 
          className="absolute inset-0 w-full h-full object-cover" 
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
      
      <div className="p-3">
        <div className="flex justify-between items-start mb-1">
          <div className="flex-1">
            <h5 className="font-bold text-gray-900 text-xs leading-tight">{founder.name}</h5>
            <p className="text-gray-600 text-xs">{founder.title}</p>
          </div>
          <div className="flex flex-col gap-1">
            {founder.fundingRound && (
              <span className="bg-green-100 text-green-700 text-xs px-1 py-0.5 rounded-full font-medium">
                {founder.fundingRound}
              </span>
            )}
            {founder.bsfClass && (
              <span className="bg-blue-100 text-blue-700 text-xs px-1 py-0.5 rounded-full font-medium">
                {founder.bsfClass}
              </span>
            )}
          </div>
        </div>
        
        <h6 className="font-semibold text-gray-800 text-xs mb-1">{founder.company}</h6>
        <p className="text-gray-600 text-xs leading-relaxed mb-2 line-clamp-2">{founder.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">{founder.sector}</span>
        </div>
      </div>
    </div>
  );
}
