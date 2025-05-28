import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import BackedFoundersSection from "./BackedFoundersSection";
import LatestContentFeed from "./LatestContentFeed";
export default function PlatformsSection() {
  const platforms = [{
    number: 1,
    title: "Wilbe Sandbox: Connect and Kickstart Your Journey",
    description: "The Wilbe Sandbox is a global community platform uniting scientists to explore entrepreneurial paths and launch startups. It provides startup basics videos, pitch deck guidance, funding opportunities, and exclusive job listings, empowering PhD students, postdocs, and industry scientists to move from academia to impact.",
    buttonText: "Join the Sandbox",
    buttonLink: "/login",
    showLatestContent: true
  }, {
    number: 2,
    title: "Bootcamp for Scientist Founders (BSF): Become a Founder",
    description: "Start putting the company pieces together with the guidance and founders community needed to avoid expensive mistakes and validate the most ambitious version of your vision. Complete our guided process in 10 days and you will grab our attention as investors to be invited for our in-person residency where we chart the operational steps to kick-off.",
    buttonText: "Join the BSF Waitlist",
    buttonLink: "/sprint-signup"
  }, {
    number: 3,
    title: "Wilbe Capital: Fund Your Breakthrough",
    description: "Wilbe Capital backs scientist-led startups solving critical challenges in health, climate, and security. Offering strategic funding and partnerships, it helps researchers transform discoveries into scalable businesses, supporting BSF graduates and Sandbox members to drive impact.",
    buttonText: "Explore Wilbe Capital",
    buttonLink: "/capital",
    showCompanies: true
  }, {
    number: 4,
    title: "Wilbe Labs: Build Your Science Hub",
    description: "Wilbe Labs creates fully operational science labs and innovation hubs for ventures and property owners. By managing fit-outs, compliance, and operations, it delivers vibrant workspaces that attract talent and investors, supporting pre-seed to Series B science ventures.",
    buttonText: "Discover Wilbe Labs",
    buttonLink: "/labs"
  }];
  return <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">All the tools to manage your entrepreneurial journey</h2>
        </div>

        <div className="space-y-12">
          {platforms.map((platform, index) => <div key={platform.number} className="flex">
              {/* Left border line */}
              <div className="flex flex-col items-center mr-8">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4">
                  {platform.number}
                </div>
                {index < platforms.length - 1 && <div className="w-0.5 bg-green-500 flex-grow min-h-32"></div>}
              </div>

              {/* Content */}
              <div className="flex-1 pb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {platform.title}
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed mb-6 max-w-4xl">
                  {platform.description}
                </p>
                <Button asChild className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-2 mb-6">
                  <a href={platform.buttonLink}>
                    {platform.buttonText}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>

                {/* Latest Content Feed - only show for Wilbe Sandbox */}
                {platform.showLatestContent && <div className="mt-8 bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <LatestContentFeed />
                  </div>}

                {/* Backed Founders section - only show for Wilbe Capital */}
                {platform.showCompanies && <BackedFoundersSection initialCount={6} loadMoreCount={6} />}
              </div>
            </div>)}
        </div>
      </div>
    </section>;
}
