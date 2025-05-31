

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import UpcomingEventsFeeder from "./UpcomingEventsFeeder";

export default function PlatformsSection() {
  const platforms = [{
    number: 1,
    title: "Wilbe Sandbox: framing your journey and connecting with peers",
    description: "Sandbox is a global community platform uniting scientists to explore entrepreneurial paths and test ideas. It provides startup basics videos, pitch deck guidance, funding opportunities, and exclusive job listings, empowering PhD students, postdocs, and industry scientists to move from academia to real world impact.",
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
    <section id="tools-section" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">All the tools to explore, build, and scale science companies</h2>
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
                
                {/* Button - show for platforms that don't have content feeds */}
                {!platform.showLatestContent && (
                  <Button asChild className="bg-green-500 hover:bg-green-600 text-white font-medium px-6 py-2 mb-6">
                    <a href={platform.buttonLink} target="_blank" rel="noopener noreferrer">
                      {platform.buttonText}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}

                {/* Raw Image and Upcoming Events - only show for Wilbe Sandbox */}
                {platform.showLatestContent && (
                  <>
                    <div className="mt-8 max-w-4xl">
                      <div className="grid md:grid-cols-2 gap-6">
                        <img
                          src="/lovable-uploads/1ea15f19-c70d-4a23-9800-9aab1bf6614d.png"
                          alt="Wilbe Sandbox Platform Interface"
                          className="w-full h-96 object-cover rounded-lg"
                          onError={(e) => {
                            console.error("Image failed to load:", e);
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm h-96 overflow-hidden">
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
