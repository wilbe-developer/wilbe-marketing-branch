
import React from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { SurveyProvider } from "./context/SurveyContext";
import Survey from "./components/Survey";
import { QuizAppProps } from "./types";
import { cn } from "./utils/cn";
import WilbeLogo from "@/assets/WilbeLogo";
import "./quiz.css";

const QuizApp: React.FC<QuizAppProps> = ({ 
  title = "Infinite Scientist Founder Quiz",
  logoSrc,
  ctaUrl = "/waitlist",
  ctaText = "Serious about building?",
  className
}) => {
  return (
    <ThemeProvider>
      <SurveyProvider>
        <div className={cn("min-h-screen bg-white flex flex-col justify-center py-8", className)}>
          <div className="text-center mb-6">
            <div className="mx-auto mb-2">
              <WilbeLogo
                className="h-12 mx-auto"
                style={{
                  '--sails-color': 'var(--brand-pink, #FF2C6D)',
                  '--text-color': 'var(--brand-darkBlue, #0A1632)',
                } as React.CSSProperties}
              />
            </div>
            <div className="text-xl font-['Comic_Sans_MS'] text-[#ff0052] mb-1 marquee-effect">
              {title}
            </div>
          </div>
          <Survey ctaUrl={ctaUrl} ctaText={ctaText} logoSrc={logoSrc} />
        </div>
      </SurveyProvider>
    </ThemeProvider>
  );
};

export default QuizApp;
