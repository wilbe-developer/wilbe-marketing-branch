
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import LumaEventsEmbed from "./LumaEventsEmbed";

interface SandboxContentProps {
  buttonText: string;
  buttonLink: string;
}

export default function SandboxContent({ buttonText, buttonLink }: SandboxContentProps) {
  return (
    <>
      <div className="mt-6 sm:mt-8 max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <img
            src="/lovable-uploads/cb69c595-aeb4-4208-a8a9-93e43a9ac07e.png"
            alt="Wilbe Sandbox Platform Interface"
            className="w-full h-64 sm:h-96 object-contain rounded-lg shadow-lg bg-gray-100"
            loading="lazy"
            onError={(e) => {
              console.error("Image failed to load:", e);
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          <LumaEventsEmbed />
        </div>
      </div>
      
      {/* Button for Wilbe Sandbox - show after the content feeds */}
      <div className="mt-4 sm:mt-6">
        <Button asChild className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 sm:px-6 py-2 min-h-[44px] w-full sm:w-auto">
          <a href={buttonLink} target="_blank" rel="noopener noreferrer">
            {buttonText}
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </>
  );
}
