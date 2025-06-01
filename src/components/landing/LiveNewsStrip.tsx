
import { Circle } from "lucide-react";
import { newsItems } from "@/data/newsItems";

export default function LiveNewsStrip() {
  // Format news items for display
  const newsDisplayItems = newsItems.map(news => 
    `${news.title} • ${news.timestamp}`
  );

  return (
    <div className="bg-green-600 border-y border-green-700">
      <div className="py-2 overflow-hidden relative">
        {/* Scrolling Content - positioned behind */}
        <div className="absolute inset-0 flex items-center">
          <div className="ticker-content animate-scroll w-full">
            <div className="flex space-x-12 px-4">
              {[...newsDisplayItems, ...newsDisplayItems].map((news, index) => (
                <span key={index} className="text-sm text-white whitespace-nowrap flex-shrink-0">
                  {news}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Static Title - positioned on top with background */}
        <div className="relative z-10 flex justify-start">
          <span className="text-sm font-bold text-white uppercase tracking-wide whitespace-nowrap bg-green-600 px-4 py-0.5 flex items-center gap-2">
            <Circle className="w-3 h-3 fill-red-500 text-red-500 animate-pulse" />
            LIVE
          </span>
        </div>
      </div>
    </div>
  );
}
