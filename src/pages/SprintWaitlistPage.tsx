
import { WaitlistForm } from "@/components/WaitlistForm";
import { Helmet } from "react-helmet";
import HeroSection from "@/components/HeroSection";
import WhoSection from "@/components/WhoSection";
import ProcessSection from "@/components/ProcessSection";
import WhySection from "@/components/WhySection";
import FocusSection from "@/components/FocusSection";
import AboutSection from "@/components/AboutSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const SprintWaitlistPage = () => {
  const isMobile = useIsMobile();
  
  const scrollToWaitlist = () => {
    const waitlistSection = document.getElementById('waitlist-form');
    if (waitlistSection) {
      // Get the element's position
      const rect = waitlistSection.getBoundingClientRect();
      const absoluteTop = window.pageYOffset + rect.top;
      
      // Calculate center position accounting for viewport height
      const offset = rect.height > window.innerHeight 
        ? 0 
        : (window.innerHeight - rect.height) / 2;
      
      // Use a slight delay to ensure smooth scrolling
      setTimeout(() => {
        window.scrollTo({
          top: absoluteTop - offset,
          behavior: 'smooth'
        });
        
        // Optional: Add a highlight effect
        waitlistSection.classList.add('scroll-highlight');
        setTimeout(() => {
          waitlistSection.classList.remove('scroll-highlight');
        }, 1500);
      }, 100);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {/* Header */}
      <header className="container flex items-center justify-between py-8 border-b border-white/20">
        <div className="flex items-center gap-2">
          <Logo 
            className="h-8" 
            style={{
              '--sails-color': 'white',
              '--text-color': 'white',
            } as React.CSSProperties}
          />
        </div>
        <Button 
          onClick={scrollToWaitlist}
          className="bg-[#7ED957] text-black hover:bg-[#7ED957]/90 px-8 py-6 font-bold rounded-none"
        >
          Join the waitlist
        </Button>
      </header>
      
      <HeroSection scrollToWaitlist={scrollToWaitlist} />
      
      <div className="flex-1 flex flex-col">
        <WhoSection />
        <ProcessSection scrollToWaitlist={scrollToWaitlist} />
        <WhySection />
        <FocusSection />
        <AboutSection />
        
        {/* Waitlist Form Section */}
        <section id="waitlist-form" className="container my-20 md:my-32 transition-all duration-300">
          <div className="border border-white/30 p-8 md:p-14 relative max-w-3xl mx-auto">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-8 text-center">
              <h2 className="text-4xl font-bold">Join the waitlist</h2>
            </div>
            <div className="pt-6 md:pt-0">
              <WaitlistForm />
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <FAQSection />
        
        <Footer />
      </div>
    </div>
  );
};

export default SprintWaitlistPage;
