
import React from 'react';
import { useSurvey } from '../hooks/useSurvey';
import QuestionCard from './QuestionCard';
import CTAButton from './CTAButton';
import LoadingQuestion from './LoadingQuestion';
import WilbeLogo from "@/assets/WilbeLogo";

interface SurveyProps {
  ctaUrl?: string;
  ctaText?: string;
  logoSrc?: string;
}

const Survey: React.FC<SurveyProps> = ({ 
  ctaUrl = "/waitlist",
  ctaText = "Join the waitlist",
  logoSrc
}) => {
  const { 
    currentQuestion,
    isLoading,
    isGeneratingQuestion,
    selectedOptionIndex,
    showStats,
    showCTA,
    stats,
    handleAnswer,
    goToNextQuestion
  } = useSurvey();

  // Display loading component while initializing
  if (isLoading) {
    return <LoadingQuestion />;
  }

  // Handle case when no question is available
  if (!currentQuestion && !isGeneratingQuestion) {
    return (
      <div className="w-full max-w-md mx-auto bg-white px-4 py-4 rounded-sm pixel-border early-internet-card">
        <div className="text-center text-[#ff0052] font-['Comic_Sans_MS']">
          <p>Unable to load survey questions.</p>
          <button 
            className="option-button-bright mt-4 text-sm font-['Comic_Sans_MS']"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
        <div className="mt-4 text-center">
          <WilbeLogo
            className="h-6 mx-auto"
            style={{
              '--sails-color': 'var(--brand-pink, #FF2C6D)',
              '--text-color': 'var(--brand-darkBlue, #0A1632)',
            } as React.CSSProperties}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-0 px-4 py-1">
      <div className="w-full max-w-md">
        {isGeneratingQuestion ? (
          <LoadingQuestion />
        ) : (
          <QuestionCard
            question={currentQuestion}
            onAnswer={handleAnswer}
            onNextQuestion={goToNextQuestion}
            stats={stats}
            isAnswered={showStats}
            selectedOptionIndex={selectedOptionIndex}
            logoSrc={logoSrc}
            ctaUrl={ctaUrl}
            ctaText={ctaText}
          />
        )}
      </div>
      
      {/* Only show CTA at the bottom if not showing stats */}
      {showCTA && !showStats && <CTAButton visible={true} url={ctaUrl} text={ctaText} />}
    </div>
  );
};

export default Survey;
