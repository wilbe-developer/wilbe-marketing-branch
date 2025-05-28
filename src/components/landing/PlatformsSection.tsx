import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import BackedFoundersSection from "./BackedFoundersSection";
import LatestContentFeed from "./LatestContentFeed";
import UpcomingEventsFeeder from "./UpcomingEventsFeeder";

export default function PlatformsSection() {
  const platforms = [{
    number: 1,
    title: "Breakthrough to Scientist Founder (BSF): our flagship program",
    description: "The Wilbe Sandbox is a global community platform uniting scientists to explore entrepreneurial paths and launch startups. It provides startup basics videos, pitch deck guidance, funding opportunities, and exclusive job listings, empowering PhD students, postdocs, and industry scientists to move from academia to impact.",
    buttonText: "Scientists Access",
    buttonLink: "/login",
    showLatestContent: true
  }, {
    number: 2,
    title: "Breakthrough to Scientist Founder (BSF): our flagship program",
    description: "Get practical building your company with the guidance and founders community needed to avoid expensive mistakes and validate the most ambitious version of your vision. Complete our tech-enabled process in 10 days and you will grab our attention as investors to be invited for Bootcamp our in-person residency where we chart the operational steps to kick-off.",
    buttonText: "Join the BSF Waitlist",
    buttonLink: "/waitlist",
    showImage: true
  }, {
    number: 3,
    title: "Wilbe Capital: investing exclusively in scientist-led companies",
    description: "Wilbe Capital backs scientist-led startups solving critical challenges in health, climate, and security. Offering strategic funding and partnerships, it helps researchers transform discoveries into scalable businesses, supporting BSF graduates and Sandbox members to drive impact.",
    buttonText: "Explore Wilbe Capital",
    buttonLink: "https://www.wilbe.capital/",
    showCompanies: true
  }, {
    number: 4,
    title: "Wilbe Labs: Build Your Science Hub",
    description: "Wilbe Labs creates fully operational science labs and innovation hubs for ventures and property owners. By managing fit-outs, compliance, and operations, it delivers vibrant workspaces that attract talent and investors, supporting pre-seed to Series B science ventures.",
    buttonText: "Discover Wilbe Labs",
    buttonLink: "/labs",
    showLabGallery: true
  }];

  const labGallery = [
    {
      name: "UCL's IDEALondon",
      location: "London, UK",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Milvus Advanced", 
      location: "Oxford, UK",
      image: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "Origen",
      location: "Bristol, UK", 
      image: "https://images.unsplash.com/photo-1431576901776-e539bd916ba2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      name: "CarpeCarbon",
      location: "Turin, Italy",
      image: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">All the tools to manage your entrepreneurial journey</h2>
        </div>

        <div className="space-y-12">
          {platforms.map((platform, index) => (
            <div key={platform.number} className="flex">
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

                {/* BSF Screenshots */}
                {platform.showImage && (
                  <div className="mb-6">
                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
                      <div>
                        <img 
                          src="/lovable-uploads/07ca7619-e835-4216-b83e-b13ee865bdd6.png" 
                          alt="Sprint Journey Dashboard Screenshot" 
                          className="w-full h-64 object-cover rounded-lg shadow-lg border border-gray-200" 
                        />
                        <p className="text-gray-600 text-xs mt-3">
                          Tech tools to guide you when putting together the most investible proposition
                        </p>
                      </div>
                      <div>
                        <img 
                          src="/lovable-uploads/dd3d3cc0-9511-45e0-ab92-cd673ffec128.png" 
                          alt="BSF Class 13 gathering in Austin TX" 
                          className="w-full h-64 object-cover rounded-lg shadow-lg border border-gray-200" 
                        />
                        <p className="text-gray-600 text-xs mt-3">
                          Austin TX sunset views for BSF Class 13 (Mar 2025)
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lab Gallery - only show for Wilbe Labs */}
                {platform.showLabGallery && (
                  <div className="mb-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl">
                      {labGallery.map((lab, labIndex) => (
                        <div key={labIndex} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                          <div className="aspect-video">
                            <img
                              src={lab.image}
                              alt={`${lab.name} laboratory facility`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h4 className="font-bold text-gray-900 text-sm mb-1">{lab.name}</h4>
                            <p className="text-xs text-gray-600">{lab.location}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Button - show for platforms that don't have content feeds or companies, or show after content */}
                {!platform.showLatestContent && !platform.showCompanies && (
                  <Button asChild className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-2 mb-6">
                    <a href={platform.buttonLink}>
                      {platform.buttonText}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}

                {/* Latest Content Feed and Upcoming Events - only show for Wilbe Sandbox */}
                {platform.showLatestContent && (
                  <>
                    <div className="mt-8 max-w-4xl">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                          <LatestContentFeed />
                        </div>
                        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                          <UpcomingEventsFeeder />
                        </div>
                      </div>
                    </div>
                    
                    {/* Button for Wilbe Sandbox - show after the content feeds */}
                    <div className="mt-6">
                      <Button asChild className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-2">
                        <a href={platform.buttonLink}>
                          {platform.buttonText}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </>
                )}

                {/* Backed Founders section - only show for Wilbe Capital */}
                {platform.showCompanies && (
                  <>
                    <BackedFoundersSection initialCount={6} loadMoreCount={6} />
                    
                    {/* Button for Wilbe Capital - show after the gallery */}
                    <div className="mt-6">
                      <Button asChild className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-2">
                        <a href={platform.buttonLink}>
                          {platform.buttonText}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
