
import PlatformCard from "./PlatformCard";

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
      image: "/lovable-uploads/816e6141-9e66-472e-8b16-d7196060771e.png"
    },
    {
      name: "Origen",
      location: "Bristol, UK", 
      image: "/lovable-uploads/2af3b264-f549-43f1-adea-52626de48c4c.png"
    },
    {
      name: "CarpeCarbon",
      location: "Turin, Italy",
      image: "/lovable-uploads/52b6b8f5-17d0-4344-ac5d-c35b60bea127.png"
    },
    {
      name: "Dinura",
      location: "Milan, Italy",
      image: "/lovable-uploads/fd524d0d-e48e-4aed-ad02-d25a0c30d49e.png"
    }
  ];

  return (
    <section id="tools-section" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-12 sm:mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 px-4">
            All the tools to explore, build, and scale science companies
          </h2>
        </div>

        <div className="space-y-8 sm:space-y-12">
          {platforms.map((platform, index) => (
            <PlatformCard
              key={platform.number}
              platform={platform}
              index={index}
              totalPlatforms={platforms.length}
              labGallery={labGallery}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
