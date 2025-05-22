
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ProcessSectionProps {
  scrollToWaitlist: () => void;
}

const steps = [{
  number: 1,
  title: 'Sign-up - it\'s free, it\'s rolling',
  description: "Fill out the application form to help us chart the best journey for you based on your sector, challenges and stage of development."
}, {
  number: 2,
  title: '10 days to show us your best',
  description: 'In our online process, you can move at your own pace to build the foundations. But, complete it in 10 days and you get our attention as investors.'
}, {
  number: 3,
  title: 'Become a Wilbe Founder',
  description: 'If it\'s a fit, we invest up to $250K and partner with you to unlock the next stage.'
}, {
  number: 4,
  title: 'Join the community of scientist leaders',
  description: "You will be invited to join us at an in-person residency where we chart the future steps alongside fellow Wilbe founders."
}];

const ProcessSection: React.FC<ProcessSectionProps> = ({ scrollToWaitlist }) => {
  return <section className="container mb-24 relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#7ED957] rounded-full blur-[150px] opacity-10"></div>

      <div className="flex flex-col md:flex-row gap-4 items-start mb-16">
        <div className="text-6xl font-black">02 //</div>
        <h2 className="text-4xl md:text-5xl font-bold max-w-3xl">Your journey to Be a Scientist Founder (BSF)</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/30">
        {steps.map((step, index) => <div key={index} className="bg-black p-8 relative">
            <div className="absolute top-8 right-8 text-8xl font-black text-white/10">{String(step.number).padStart(2, '0')}</div>
            <h3 className="text-3xl font-bold mb-4 flex items-center">
              
              {step.title}
            </h3>
            <p className="text-lg mb-4 text-white/70">{step.description}</p>
          </div>)}
      </div>

      <div className="flex justify-center mt-12">
        <Button onClick={scrollToWaitlist} className="bg-[#7ED957] text-black hover:bg-[#7ED957]/90 px-8 py-6 text-lg font-bold">
          Join the waitlist <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>;
};
export default ProcessSection;
