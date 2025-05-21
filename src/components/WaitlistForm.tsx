
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

  // Array of colors for instant hover changes - updated to blues instead of oranges/reds
  const hoverColors = [
    '#2323FF',   // Deep Blue (main)
    '#3F3FFF',   // Slightly lighter blue
    '#7A7AFF',   // Medium blue
    '#0EA5E9',   // Ocean Blue
    '#0C4A6E',   // Dark blue
    '#38BDF8',   // Light blue
  ];

  const getRandomColor = () => hoverColors[Math.floor(Math.random() * hoverColors.length)];
  const [buttonColor, setButtonColor] = useState('#2323FF'); // Set initial color to blue

  return (
    <div className="w-full max-w-md mx-auto space-y-2">
      <form onSubmit={handleSubmit} className="space-y-1">
        <Input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="h-12 rounded-none w-full"
          disabled={isLoading}
        />
        <Input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-12 rounded-none w-full"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          className="w-full h-12 text-lg font-semibold rounded-none transition-colors"
          style={{ backgroundColor: buttonColor }}
          onMouseEnter={() => setButtonColor(getRandomColor())}
          disabled={isLoading}
        >
          {isLoading ? "Joining..." : "Join waitlist"}
        </Button>
      </form>
    </div>
  );
}
