
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeroSectionProps {
  scrollToWaitlist: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ scrollToWaitlist }) => {
  const isMobile = useIsMobile();
  
  return <section className="container mt-20 mb-32 relative overflow-visible">
      {/* Background effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#7ED957] rounded-full blur-[150px] opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#7ED957] rounded-full blur-[150px] opacity-20"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
        {/* Left column - Main heading and CTA */}
        <div className="space-y-8">
          
          <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tight">
            BRING YOUR <span className="text-[#7ED957]">SCIENCE</span> TO THE WORLD.
          </h1>
          <div className="h-1 w-24 bg-[#7ED957]"></div>
          <p className="text-2xl md:text-3xl font-bold">Turn your breakthrough into a high-performance startup - in 10 days.</p>
          
          <div className="space-y-6 py-6">
            <p className="font-medium text-white/90 leading-relaxed text-lg">
              Scientists and engineers hold the keys to the solutions we need for this century.
              Use our focused, guided path to make critical decisions and put together the most
              ambitious version of your company.
            </p>
            
            <p className="text-white/90 leading-relaxed font-medium text-lg">
              When there's momentum and a clear plan, we invest $100K–$250K to help build your vision 
              alongside a world-class community of scientist founders. Worst case? You leave with a plan and a global network of entrepreneurial scientists.
            </p>
          </div>
          
          <Button onClick={scrollToWaitlist} className="bg-[#7ED957] text-black hover:bg-[#7ED957]/90 px-8 py-6 text-lg font-bold rounded-none">
            Join the waitlist <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Right column - now empty since content has moved */}
        <div className="flex flex-col justify-center h-full">
          {/* Intentionally left empty as per request */}
        </div>
      </div>
    </section>;
};
export default HeroSection;
