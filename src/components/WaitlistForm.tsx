
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/lib/constants";

export function WaitlistForm() {
  // Array of colors for instant hover changes - updated to greens
  const hoverColors = [
    '#7ED957',   // Main green
    '#6BC947',   // Darker green
    '#8FE467',   // Lighter green
    '#5AB937',   // Deep green
    '#A1F579',   // Light green
    '#69D344',   // Medium green
  ];

  const getRandomColor = () => hoverColors[Math.floor(Math.random() * hoverColors.length)];
  const [buttonColor, setButtonColor] = useState('#7ED957'); // Set initial color to green
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Extract UTM parameters from the URL
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
    
    navigate(targetUrl);
  };

  return (
    <form className="w-full max-w-2xl mx-auto space-y-8 mt-6 md:mt-0" onSubmit={handleSubmit}>
      <p className="text-lg text-white/80 text-center">
        Fill out the application form to help us chart the best journey for you based on your sector, challenges and stage of development.
      </p>
      <Button 
        type="submit" 
        className="w-full h-14 text-lg font-bold text-black rounded-none"
        style={{ backgroundColor: buttonColor }}
        onMouseEnter={() => setButtonColor(getRandomColor())}
      >
        LET'S GO
      </Button>
    </form>
  );
}
