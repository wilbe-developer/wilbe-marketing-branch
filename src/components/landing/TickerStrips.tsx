
export default function TickerStrips() {
  return (
    <>
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
        .ticker-content {
          display: flex;
          width: 200%;
        }
      `}</style>

      {/* Community Asks Ticker Strip */}
      <div className="bg-green-600 text-white py-2 overflow-hidden relative">
        <div className="flex items-center">
          <div className="bg-green-700 px-4 py-1 text-xs font-bold uppercase tracking-wide whitespace-nowrap">
            COMMUNITY ASKS
          </div>
          <div className="flex-1 relative overflow-hidden">
            <div className="ticker-content animate-scroll">
              <div className="flex whitespace-nowrap w-full">
                <span className="mx-8 text-sm font-medium">
                  💼 NOW HIRING: Synthace seeks Senior Biotech Engineer - Remote OK - Apply via community
                </span>
                <span className="mx-8 text-sm font-medium">
                  🚀 OPEN ROLE: Climeworks looking for Climate Policy Director - Berlin/Zurich - Community referrals welcome
                </span>
                <span className="mx-8 text-sm font-medium">
                  🔬 OPPORTUNITY: Pivot Bio hiring Microbiology Lead - SF Bay Area - Founder: "Looking for Wilbe community talent"
                </span>
                <span className="mx-8 text-sm font-medium">
                  ⚡ HOT ROLE: Oxford Nanopore seeks AI/ML Engineer - Cambridge UK - Fast track for community members
                </span>
                <span className="mx-8 text-sm font-medium">
                  🧬 URGENT: Series A biotech needs VP of Product - Boston - Founder offering equity boost for Wilbe members
                </span>
                <span className="mx-8 text-sm font-medium">
                  🌱 NEW POST: AgTech startup seeks CTO co-founder - Austin TX - Looking within Wilbe community first
                </span>
                <span className="mx-8 text-sm font-medium">
                  💡 EXCLUSIVE: MedTech Series B hiring Head of Regulatory - San Diego - Community-only posting
                </span>
              </div>
              <div className="flex whitespace-nowrap w-full">
                <span className="mx-8 text-sm font-medium">
                  💼 NOW HIRING: Synthace seeks Senior Biotech Engineer - Remote OK - Apply via community
                </span>
                <span className="mx-8 text-sm font-medium">
                  🚀 OPEN ROLE: Climeworks looking for Climate Policy Director - Berlin/Zurich - Community referrals welcome
                </span>
                <span className="mx-8 text-sm font-medium">
                  🔬 OPPORTUNITY: Pivot Bio hiring Microbiology Lead - SF Bay Area - Founder: "Looking for Wilbe community talent"
                </span>
                <span className="mx-8 text-sm font-medium">
                  ⚡ HOT ROLE: Oxford Nanopore seeks AI/ML Engineer - Cambridge UK - Fast track for community members
                </span>
                <span className="mx-8 text-sm font-medium">
                  🧬 URGENT: Series A biotech needs VP of Product - Boston - Founder offering equity boost for Wilbe members
                </span>
                <span className="mx-8 text-sm font-medium">
                  🌱 NEW POST: AgTech startup seeks CTO co-founder - Austin TX - Looking within Wilbe community first
                </span>
                <span className="mx-8 text-sm font-medium">
                  💡 EXCLUSIVE: MedTech Series B hiring Head of Regulatory - San Diego - Community-only posting
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breaking News Ticker Strip */}
      <div className="bg-gray-800 text-white py-2 overflow-hidden relative">
        <div className="flex items-center">
          <div className="bg-gray-900 px-4 py-1 text-xs font-bold uppercase tracking-wide whitespace-nowrap flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 animate-pulse"></div>
            <span>LIVE</span>
          </div>
          <div className="flex-1 relative overflow-hidden">
            <div className="ticker-content animate-scroll">
              <div className="flex whitespace-nowrap w-full">
                <span className="mx-8 text-sm font-medium">
                  🚀 JUST IN: BioGenesis raises $100M Series A led by Wilbe Capital
                </span>
                <span className="mx-8 text-sm font-medium">
                  📊 NEW PODCAST: Dr. Jennifer Doudna on CRISPR's $50B market opportunity
                </span>
                <span className="mx-8 text-sm font-medium">
                  🔬 EXCLUSIVE: Inside the lab that's revolutionizing cancer treatment
                </span>
                <span className="mx-8 text-sm font-medium">
                  💡 TOOLS UPDATE: Knowledge now supports AI-powered market analysis
                </span>
                <span className="mx-8 text-sm font-medium">
                  🎯 INVESTMENT: Climeworks closes $110M Series C for carbon capture tech
                </span>
                <span className="mx-8 text-sm font-medium">
                  📈 MARKET: Biotech IPOs surge 40% as scientist founders lead innovation
                </span>
              </div>
              <div className="flex whitespace-nowrap w-full">
                <span className="mx-8 text-sm font-medium">
                  🚀 JUST IN: BioGenesis raises $100M Series A led by Wilbe Capital
                </span>
                <span className="mx-8 text-sm font-medium">
                  📊 NEW PODCAST: Dr. Jennifer Doudna on CRISPR's $50B market opportunity
                </span>
                <span className="mx-8 text-sm font-medium">
                  🔬 EXCLUSIVE: Inside the lab that's revolutionizing cancer treatment
                </span>
                <span className="mx-8 text-sm font-medium">
                  💡 TOOLS UPDATE: Knowledge now supports AI-powered market analysis
                </span>
                <span className="mx-8 text-sm font-medium">
                  🎯 INVESTMENT: Climeworks closes $110M Series C for carbon capture tech
                </span>
                <span className="mx-8 text-sm font-medium">
                  📈 MARKET: Biotech IPOs surge 40% as scientist founders lead innovation
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
