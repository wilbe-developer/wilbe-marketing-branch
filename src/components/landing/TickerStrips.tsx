
import { jobOpportunities } from "@/data/jobOpportunities";

export default function TickerStrips() {
  // Format job opportunities for display
  const jobDisplayItems = jobOpportunities.map(job => 
    `${job.title} at ${job.company} • ${job.location}`
  );

  return (
    <div className="bg-brand-darkBlue border-y border-brand-navy">
      <div className="py-3 overflow-hidden relative">
        {/* Scrolling Content - positioned behind */}
        <div className="absolute inset-0 flex items-center">
          <div className="ticker-content animate-scroll w-full">
            <div className="flex space-x-12 px-4">
              {[...jobDisplayItems, ...jobDisplayItems].map((job, index) => (
                <span key={index} className="text-sm text-gray-300 whitespace-nowrap flex-shrink-0">
                  {job}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Static Title - positioned on top with background */}
        <div className="relative z-10 flex justify-start">
          <span className="text-sm font-bold text-white uppercase tracking-wide whitespace-nowrap bg-brand-darkBlue px-4 py-1">
            OPPORTUNITIES
          </span>
        </div>
      </div>
    </div>
  );
}
