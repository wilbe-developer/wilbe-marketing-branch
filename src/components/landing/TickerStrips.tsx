
export default function TickerStrips() {
  const communityAsks = [
    "How do I validate my technology in the market?",
    "What's the best way to protect my IP before fundraising?", 
    "How do I find the right co-founder for my deep-tech startup?",
    "What are the key metrics investors look for in biotech companies?",
    "How do I transition from academia to entrepreneurship?",
    "What's the difference between licensing and spinning out?",
    "How do I build a business model around my research?",
    "What are the common mistakes first-time founder-scientists make?"
  ];

  return (
    <div className="bg-brand-darkBlue border-y border-brand-navy">
      <div className="py-3 overflow-hidden relative">
        {/* Scrolling Content - positioned behind */}
        <div className="absolute inset-0 flex items-center">
          <div className="ticker-content animate-scroll w-full">
            <div className="flex space-x-12 px-4">
              {[...communityAsks, ...communityAsks].map((ask, index) => (
                <span key={index} className="text-sm text-gray-300 whitespace-nowrap flex-shrink-0">
                  {ask}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Static Title - positioned on top with background */}
        <div className="relative z-10 flex justify-start">
          <span className="text-sm font-bold text-white uppercase tracking-wide whitespace-nowrap bg-brand-darkBlue px-4 py-1">
            COMMUNITY OPPORTUNITIES
          </span>
        </div>
      </div>
    </div>
  );
}
