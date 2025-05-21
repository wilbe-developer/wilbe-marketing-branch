
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWaitlistSignup } from "@/hooks/useWaitlistSignup";
import { useParams, useSearchParams } from "react-router-dom";

export function WaitlistForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { code: referralCode } = useParams();
  const [searchParams] = useSearchParams();
  const { signup, isLoading } = useWaitlistSignup();

  const utmSource = searchParams.get("utm_source") || undefined;
  const utmMedium = searchParams.get("utm_medium") || undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signup(name, email, referralCode, utmSource, utmMedium);
  };

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

  return (
    <form className="w-full max-w-2xl mx-auto space-y-8 mt-6 md:mt-0" onSubmit={handleSubmit}>
      <div>
        <Input
          type="text"
          placeholder="YOUR NAME"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="bg-transparent border-white/30 h-14 text-white placeholder:text-white/60 focus:border-[#7ED957] focus:ring-[#7ED957] rounded-none"
          disabled={isLoading}
        />
      </div>
      <div>
        <Input
          type="email"
          placeholder="YOUR EMAIL"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-transparent border-white/30 h-14 text-white placeholder:text-white/60 focus:border-[#7ED957] focus:ring-[#7ED957] rounded-none"
          disabled={isLoading}
        />
      </div>
      <Button 
        type="submit" 
        className="w-full h-14 text-lg font-bold text-black rounded-none"
        style={{ backgroundColor: buttonColor }}
        onMouseEnter={() => setButtonColor(getRandomColor())}
        disabled={isLoading}
      >
        {isLoading ? "JOINING..." : "JOIN THE WAITLIST"}
      </Button>
    </form>
  );
}
