
import { WaitlistForm } from "@/components/WaitlistForm";
import { Helmet } from "react-helmet";
import HeroSection from "@/components/HeroSection";
import WhoSection from "@/components/WhoSection";
import ProcessSection from "@/components/ProcessSection";
import FocusSection from "@/components/FocusSection";
import AboutSection from "@/components/AboutSection";
import WhySection from "@/components/WhySection";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import Section from "@/components/Section";
import FAQSection from "@/components/FAQSection";

const SprintWaitlistPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-500 via-orange-300 to-white">
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Helmet>
      
      <div className="p-6 flex justify-center">
        <Logo 
          className="h-8" 
          style={{
            '--sails-color': 'white',
            '--text-color': 'white',
          } as React.CSSProperties}
        />
      </div>
      
      <HeroSection />
      
      <div className="bg-white flex-1 flex flex-col">
        <WhoSection />
        <ProcessSection />
        <WhySection />
        <FocusSection />
        <AboutSection />
        
        {/* Waitlist Form Section */}
        <Section id="waitlist-form" className="bg-white">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">Join the waitlist</h2>
            <WaitlistForm />
          </div>
        </Section>
        
        {/* FAQ Section */}
        <FAQSection />
        
        <Footer />
      </div>
    </div>
  );
};

export default SprintWaitlistPage;
