
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProcessSectionProps {
  scrollToWaitlist: () => void;
}

const ProcessSection: React.FC<ProcessSectionProps> = ({ scrollToWaitlist }) => {
  const isMobile = useIsMobile();
  
  // Process steps
  const steps = [
    {
      number: "01",
      title: "Complete Your Profile",
      description: "Take 5 minutes to share your project's details, challenges, and vision. We'll use this to customize your experience."
    },
    {
      number: "02",
      title: "Start Your Sprint",
      description: "Receive access to our guided BSF Sprint platform, where you'll tackle key questions and build the foundations of your science company."
    },
    {
      number: "03", 
      title: "Join the Community",
      description: "Connect with fellow scientist founders and Wilbe experts who can provide feedback, guidance, and support."
    },
    {
      number: "04",
      title: "Access Funding",
      description: "For companies with strong momentum, we can invest $100K-$250K to help you take the next steps."
    }
  ];

  return <section className="container my-32 relative">
    <div className="text-center max-w-2xl mx-auto mb-16">
      <h2 className="text-4xl font-bold mb-6">The BSF Process</h2>
      <p className="text-white/80 text-lg">
        Our straightforward, focused process gets you from science breakthrough to fundable company in weeks, not months.
      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {steps.map((step, index) => (
        <div key={index} className="border border-white/20 p-8 hover:border-[#7ED957]/50 transition-all duration-300">
          <div className="text-[#7ED957] text-5xl font-black mb-6">{step.number}</div>
          <h3 className="text-xl font-bold mb-4">{step.title}</h3>
          <p className="text-white/70">{step.description}</p>
        </div>
      ))}
    </div>
    
    <div className="mt-16 text-center">
      <Button 
        onClick={scrollToWaitlist}
        className="bg-[#7ED957] text-black hover:bg-[#7ED957]/90 px-8 py-6 text-lg font-bold rounded-none"
      >
        Start Your Sprint <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  </section>;
};

export default ProcessSection;
