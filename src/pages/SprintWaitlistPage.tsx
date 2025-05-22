
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
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/lib/constants";

const SprintWaitlistPage = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const scrollToWaitlist = () => {
    // Extract UTM parameters from the current URL
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');
    const utmTerm = urlParams.get('utm_term');
    const utmContent = urlParams.get('utm_content');
    
    // Construct the target URL with UTM parameters
    let targetUrl = PATHS.SPRINT_SIGNUP;
    const utmParams = new URLSearchParams();
    
    if (utmSource) utmParams.append('utm_source', utmSource);
    if (utmMedium) utmParams.append('utm_medium', utmMedium);
    if (utmCampaign) utmParams.append('utm_campaign', utmCampaign);
    if (utmTerm) utmParams.append('utm_term', utmTerm);
    if (utmContent) utmParams.append('utm_content', utmContent);
    
    if (utmParams.toString()) {
      targetUrl += `?${utmParams.toString()}`;
    }
    
    // Navigate to the signup page with UTM parameters
    navigate(targetUrl);
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
          Let's Go
        </Button>
      </header>
      
      <HeroSection scrollToWaitlist={scrollToWaitlist} />
      
      <div className="flex-1 flex flex-col">
        <WhoSection />
        <ProcessSection scrollToWaitlist={scrollToWaitlist} />
        <WhySection />
        <FocusSection />
        <AboutSection />
        
        {/* Waitlist Form Section - Updated heading only */}
        <section id="waitlist-form" className="container my-20 md:my-32 transition-all duration-300">
          <div className="border border-white/30 p-8 md:p-14 relative max-w-3xl mx-auto">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-8 text-center">
              <h2 className="text-4xl font-bold">Ready to start?</h2>
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
