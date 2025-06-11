
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import BSFScreenshots from "./BSFScreenshots";
import LabGallery from "./LabGallery";
import SandboxContent from "./SandboxContent";

interface Lab {
  name: string;
  location: string;
  image: string;
}

interface Platform {
  number: number;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  showLatestContent?: boolean;
  showImage?: boolean;
  showLabGallery?: boolean;
}

interface PlatformCardProps {
  platform: Platform;
  index: number;
  totalPlatforms: number;
  labGallery: Lab[];
}

export default function PlatformCard({ platform, index, totalPlatforms, labGallery }: PlatformCardProps) {
  return (
    <div className="flex flex-col sm:flex-row">
      {/* Left border line - Mobile: Top, Desktop: Left */}
      <div className="flex sm:flex-col items-center sm:items-center mb-6 sm:mb-0 sm:mr-6 lg:mr-8">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg mb-0 sm:mb-4 flex-shrink-0">
          {platform.number}
        </div>
        {index < totalPlatforms - 1 && (
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
        {platform.showImage && <BSFScreenshots />}

        {/* Lab Gallery */}
        {platform.showLabGallery && <LabGallery labs={labGallery} />}
        
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
          <SandboxContent 
            buttonText={platform.buttonText}
            buttonLink={platform.buttonLink}
          />
        )}
      </div>
    </div>
  );
}
