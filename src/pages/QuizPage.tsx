
import React from "react";
import { QuizApp } from "@/modules/quiz";

const QuizPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <QuizApp 
        title="Infinite Scientist Founder Quiz"
        ctaText="Serious about building?"
        ctaUrl="/waitlist?utm_source=quiz&utm_medium=web"
      />
    </div>
  );
};

export default QuizPage;
