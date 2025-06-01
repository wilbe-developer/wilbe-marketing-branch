
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import LumaEventsEmbed from "./LumaEventsEmbed";

export default function PlatformsSection() {
  const platforms = [{
    number: 1,
    title: "Wilbe Sandbox: framing your journey and connecting with peers",
    description: "Sandbox is a global community platform uniting scientists to explore entrepreneurial paths and test ideas. It provides startup basics videos, pitch deck guidance, funding opportunities, and exclusive job listings, empowering PhD students, postdocs, and industry scientists to move from academia to real world impact.",
    buttonText: "Scientists Access",
    buttonLink: "https://app.wilbe.com/",
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
    title: "Wilbe Labs: securing the best lab space for your team",
    description: "Wilbe Labs creates fully operational science labs and innovation hubs for ventures and property owners. By managing fit-outs, compliance, and operations, it delivers vibrant workspaces that attract talent and investors, supporting pre-seed to Series B science ventures.",
    buttonText: "Discover Wilbe Labs",
    buttonLink: "https://wilbelab.com",
    showLabGallery: true
  }];

  const labGallery = [
    {
      name: "UCL's IDEALondon",
      location: "London, UK",
      image: "/lovable-uploads/bedb45e3-c04e-46ae-80fb-d5e90ab2cfaa.png"
    },
    {
      name: "Milvus Advanced", 
      location: "Oxford, UK",
      image: "/lovable-uploads/dabb2926-37df-4faa-a83d-8ebfb7db6e9c.png"
    },
    {
      name: "Origen",
      location: "Bristol, UK", 
      image: "/lovable-uploads/cad82760-686a-4c37-9e96-c9f6705dcc92.png"
    },
    {
      name: "CarpeCarbon",
      location: "Turin, Italy",
      image: "/lovable-uploads/c97a82b5-f37b-49a4-accd-5ef983857a24.png"
    }
  ];

  return (
    <section id="tools-section" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left sm:text-center mb-12 sm:mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 px-4">
            All the tools to explore, build, and scale science companies
          </h2>
        </div>

        <div className="space-y-8 sm:space-y-12">
          {platforms.map((platform, index) => (
            <div key={platform.number} className="flex flex-col sm:flex-row">
              {/* Left border line - Mobile: Top, Desktop: Left */}
              <div className="flex sm:flex-col items-center sm:items-center mb-6 sm:mb-0 sm:mr-6 lg:mr-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg mb-0 sm:mb-4 flex-shrink-0">
                  {platform.number}
                </div>
                {index < platforms.length - 1 && (
                  <div className="hidden sm:block w-0.5 bg-green-500 flex-grow min-h-32"></div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-4 sm:pb-8">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                  {platform.title}
                </h3>
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 max-w-4xl">
                  {platform.description}
                </p>

                {/* BSF Screenshots */}
                {platform.showImage && (
                  <div className="mb-4 sm:mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl">
                      <div>
                        <img 
                          src="/lovable-uploads/07ca7619-e835-4216-b83e-b13ee865bdd6.png" 
                          alt="Sprint Journey Dashboard Screenshot" 
                          className="w-full h-48 sm:h-64 object-cover rounded-lg shadow-lg border border-gray-200" 
                          loading="lazy"
                        />
                        <p className="text-gray-600 text-xs mt-2 sm:mt-3 px-1">
                          Tech tools to guide you when putting together the most investible proposition
                        </p>
                      </div>
                      <div>
                        <img 
                          src="/lovable-uploads/dd3d3cc0-9511-45e0-ab92-cd673ffec128.png" 
                          alt="BSF Class 13 gathering in Austin TX" 
                          className="w-full h-48 sm:h-64 object-cover rounded-lg shadow-lg border border-gray-200" 
                          loading="lazy"
                        />
                        <p className="text-gray-600 text-xs mt-2 sm:mt-3 px-1">
                          Austin TX sunset views for BSF Class 13 (Mar 2025)
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Lab Gallery - only show for Wilbe Labs */}
                {platform.showLabGallery && (
                  <div className="mb-4 sm:mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl">
                      {labGallery.map((lab, labIndex) => (
                        <div key={labIndex} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                          <div className="aspect-video">
                            <img
                              src={lab.image}
                              alt={`${lab.name} laboratory facility`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div className="p-3 sm:p-4">
                            <h4 className="font-bold text-gray-900 text-sm mb-1">{lab.name}</h4>
                            <p className="text-xs text-gray-600">{lab.location}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Button - show for platforms that don't have content feeds */}
                {!platform.showLatestContent && (
                  <Button asChild className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 sm:px-6 py-2 mb-4 sm:mb-6 min-h-[44px] w-full sm:w-auto">
                    <a href={platform.buttonLink} target="_blank" rel="noopener noreferrer">
                      {platform.buttonText}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}

                {/* Live Luma Events and Image - only show for Wilbe Sandbox */}
                {platform.showLatestContent && (
                  <>
                    <div className="mt-6 sm:mt-8 max-w-4xl">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <img
                          src="/lovable-uploads/1ea15f19-c70d-4a23-9800-9aab1bf6614d.png"
                          alt="Wilbe Sandbox Platform Interface"
                          className="w-full h-64 sm:h-96 object-cover rounded-lg shadow-lg"
                          loading="lazy"
                          onError={(e) => {
                            console.error("Image failed to load:", e);
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                        <LumaEventsEmbed 
                          height="16rem" 
                          className="sm:h-96" 
                        />
                      </div>
                    </div>
                    
                    {/* Button for Wilbe Sandbox - show after the content feeds */}
                    <div className="mt-4 sm:mt-6">
                      <Button asChild className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 sm:px-6 py-2 min-h-[44px] w-full sm:w-auto">
                        <a href={platform.buttonLink} target="_blank" rel="noopener noreferrer">
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
