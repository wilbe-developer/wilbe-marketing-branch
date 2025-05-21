
import React from 'react';
import { useSurvey } from '../hooks/useSurvey';
import QuestionCard from './QuestionCard';
import CTAButton from './CTAButton';
import LoadingQuestion from './LoadingQuestion';

interface SurveyProps {
  ctaUrl?: string;
  ctaText?: string;
  logoSrc?: string;
}

const Survey: React.FC<SurveyProps> = ({ 
  ctaUrl = "https://app.wilbe.com/sprint-waitlist",
  ctaText = "Serious about building?",
  logoSrc = "/lovable-uploads/e1312da7-f5eb-469d-953a-a520bd9538b9.png"
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
    return <LoadingQuestion logoSrc={logoSrc} />;
  }

  // Handle case when no question is available
  if (!currentQuestion && !isGeneratingQuestion) {
    return (
      <div className="w-full max-w-md mx-auto bg-white px-4 py-4 rounded-sm border-2 border-[#ff0052] early-internet-card">
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
          <img src={logoSrc} alt="Logo" className="h-8 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center mt-0 px-4 py-1">
      <div className="w-full max-w-md early-internet-card">
        {isGeneratingQuestion ? (
          <LoadingQuestion logoSrc={logoSrc} />
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
