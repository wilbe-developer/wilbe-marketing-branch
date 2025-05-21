
import React from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { SurveyProvider } from "./context/SurveyContext";
import Survey from "./components/Survey";
import { QuizAppProps } from "./types";
import { cn } from "./utils/cn";
import "./quiz.css";

const QuizApp: React.FC<QuizAppProps> = ({ 
  title = "Infinite Scientist Founder Quiz",
  logoSrc = "/lovable-uploads/e1312da7-f5eb-469d-953a-a520bd9538b9.png",
  ctaUrl = "https://app.wilbe.com/sprint-waitlist",
  ctaText = "Serious about building?",
  className
}) => {
  return (
    <ThemeProvider>
      <SurveyProvider>
        <div className={cn("min-h-screen bg-white flex flex-col justify-center py-8", className)}>
          <div className="text-center mb-4">
            <img 
              src={logoSrc} 
              alt="Logo" 
              className="h-12 mx-auto mb-1" 
            />
            <div className="text-xl font-['Comic_Sans_MS'] text-[#ff0052] mb-1">
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
