
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
          <strong>Scientists and engineers</strong> hold the keys to the solutions we need for the century. 
        </p>
        <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
          Go from scientist to founder in 10 days. Use our tailored guided path to make critical decisions
          and put together your most ambitious company. With momentum and a solid plan, we can invest
          $100K–250K to help you build the company only you can, joining our world-class community of
          scientist-founders. Base case, you leave with a plan and the largest network of
          entrepreneurial scientists.
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
