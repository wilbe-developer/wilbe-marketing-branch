
import React from "react";
import { QuizApp } from "@/modules/quiz";

const QuizPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <QuizApp 
        title="Infinite Scientist Founder Quiz"
        logoSrc="/lovable-uploads/e1312da7-f5eb-469d-953a-a520bd9538b9.png"
        ctaText="Serious about building?"
        ctaUrl="/waitlist"
      />
    </div>
  );
};

export default QuizPage;
