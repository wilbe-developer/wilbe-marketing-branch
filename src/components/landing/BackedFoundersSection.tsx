
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { backedFounders, BackedFounder } from "@/data/backedFounders";

interface BackedFoundersSectionProps {
  initialCount?: number;
  loadMoreCount?: number;
}

export default function BackedFoundersSection({ 
  initialCount = 6, 
  loadMoreCount = 6 
}: BackedFoundersSectionProps) {
  const [visibleCount, setVisibleCount] = useState(initialCount);
  
  const visibleFounders = backedFounders.slice(0, visibleCount);
  const hasMore = visibleCount < backedFounders.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + loadMoreCount, backedFounders.length));
  };

  const handleShowLess = () => {
    setVisibleCount(initialCount);
  };

  return (
    <div className="mt-8">
      <h4 className="text-lg font-medium text-gray-500 uppercase tracking-wide mb-6">
        SCIENTIST FOUNDERS WE HAVE BACKED
      </h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {visibleFounders.map((founder) => (
          <FounderCard key={founder.id} founder={founder} />
        ))}
      </div>

      {/* Load More / Show Less buttons */}
      <div className="flex justify-center space-x-4">
        {hasMore && (
          <Button
            onClick={handleLoadMore}
            variant="outline"
            className="border-green-500 text-green-600 hover:bg-green-50"
          >
            Load More Founders ({backedFounders.length - visibleCount} remaining)
          </Button>
        )}
        
        {visibleCount > initialCount && (
          <Button
            onClick={handleShowLess}
            variant="ghost"
            className="text-gray-500 hover:text-gray-700"
          >
            Show Less
          </Button>
        )}
      </div>
    </div>
  );
}

interface FounderCardProps {
  founder: BackedFounder;
}

function FounderCard({ founder }: FounderCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h5 className="font-bold text-gray-900 text-sm leading-tight">{founder.name}</h5>
            <p className="text-gray-600 text-xs">{founder.title}</p>
          </div>
          {founder.fundingRound && (
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
              {founder.fundingRound}
            </span>
          )}
        </div>
        
        <h6 className="font-semibold text-gray-800 text-sm mb-2">{founder.company}</h6>
        <p className="text-gray-600 text-xs leading-relaxed mb-3">{founder.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">{founder.sector}</span>
        </div>
      </div>
    </div>
  );
}
