
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  scrollToWaitlist: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ scrollToWaitlist }) => {
  return (
    <section className="container py-16 md:py-24 lg:py-32 relative">
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#7ED957] rounded-full blur-[150px] opacity-10"></div>
      
      <div className="mx-auto max-w-3xl text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            Build Your Science Company
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-white/70 mb-10 max-w-2xl mx-auto">
          Start your founder journey with Wilbe's 10-day guided sprint for scientist entrepreneurs.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Button 
            onClick={scrollToWaitlist}
            className="bg-[#7ED957] text-black hover:bg-[#7ED957]/90 px-8 py-6 text-lg font-bold"
            size="lg"
          >
            Let's Go <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        
        <div className="mt-16 flex justify-center">
          <div className="flex space-x-2 items-center">
            <div className="h-1 w-1 bg-[#7ED957] rounded-full"></div>
            <div className="h-1 w-1 bg-[#7ED957] rounded-full"></div>
            <div className="h-1 w-1 bg-[#7ED957] rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
