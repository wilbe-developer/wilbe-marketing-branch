import { Construction } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

interface Lab {
  name: string;
  location: string;
  image: string;
}

interface LabGalleryProps {
  labs: Lab[];
}

export default function LabGallery({ labs }: LabGalleryProps) {
  return (
    <div className="mb-4 sm:mb-6">
      <div className="block md:hidden">
        {/* Mobile: Horizontal Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
            dragFree: true,
            containScroll: "trimSnaps",
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2">
            {labs.map((lab, labIndex) => (
              <CarouselItem key={labIndex} className="pl-2 basis-64">
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow relative">
                  <div className="aspect-video relative">
                    <img
                      src={lab.image}
                      alt={`${lab.name} laboratory facility`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {lab.name === "Dinura" && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-yellow-400 text-black px-3 py-1 rounded-full flex items-center gap-2 font-bold text-sm">
                          <Construction className="h-4 w-4" />
                          Under Construction
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-gray-900 text-sm mb-1">{lab.name}</h4>
                    <p className="text-xs text-gray-600">{lab.location}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      
      <div className="hidden md:block">
        {/* Desktop: Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 max-w-5xl">
          {labs.map((lab, labIndex) => (
            <div key={labIndex} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow relative">
              <div className="aspect-video relative">
                <img
                  src={lab.image}
                  alt={`${lab.name} laboratory facility`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {lab.name === "Dinura" && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-yellow-400 text-black px-3 py-1 rounded-full flex items-center gap-2 font-bold text-sm">
                      <Construction className="h-4 w-4" />
                      Under Construction
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3 sm:p-4">
                <h4 className="font-bold text-gray-900 text-sm mb-1">{lab.name}</h4>
                <p className="text-xs text-gray-600">{lab.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
