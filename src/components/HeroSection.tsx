
import React from 'react';
import Section from './Section';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection: React.FC = () => {
  const scrollToWaitlist = () => {
    const waitlistSection = document.getElementById('waitlist-form');
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Section 
      className="py-20 md:py-32 bg-gradient-to-b from-orange-500 via-orange-300 to-white text-white"
      withContainer={true}
    >
      <div className="text-center space-y-6">
        <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight max-w-7xl mx-auto">
          Bring your science to the world.<br />
        </h1>
        <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
          <strong>Turn your breakthrough into a high-performance startup – in 10 days. </strong> 
        </p>
        <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
          Scientists and engineers hold the keys to the solutions we need for this century.
          Use our focused, guided path to make critical decisions and put together the most
          ambitious version of your company. When there's momentum and a clear plan, we invest
          $100K–$250K to help build your vision alongside a world-class community of scientist founders.
          Worst case? You leave with a plan and a global network of entrepreneurial scientists.
        </p>
        <div className="pt-4">
          <Button 
            onClick={scrollToWaitlist}
            className="bg-white text-orange-500 hover:bg-white/90 text-lg px-6 py-2 h-auto rounded-none"
          >
            Join the waitlist
            <ArrowRight />
          </Button>
        </div>
      </div>
    </Section>
  );
};

export default HeroSection;
