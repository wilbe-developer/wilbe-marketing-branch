
import React, { useRef } from 'react';
import { SurveyQuestion, QuestionStats } from '../types';
import { OptionsList } from './OptionsList';
import { ActionBar } from './ActionBar';

interface QuestionCardProps {
  question: SurveyQuestion;
  onAnswer: (optionIndex: number) => void;
  onNextQuestion: () => void;
  stats: QuestionStats | null;
  isAnswered: boolean;
  selectedOptionIndex: number | null;
  logoSrc?: string;
  ctaUrl?: string;
  ctaText?: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswer,
  onNextQuestion,
  stats,
  isAnswered,
  selectedOptionIndex,
  logoSrc = "/lovable-uploads/e1312da7-f5eb-469d-953a-a520bd9538b9.png",
  ctaUrl = "https://app.wilbe.com/sprint-waitlist",
  ctaText = "Serious about building?"
}) => {
  const resultCardRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full max-w-md mx-auto bg-white px-4 py-4 rounded-sm pixel-border">
      <div ref={resultCardRef} id="result-card" className="space-y-3">
        <h2 className="text-lg md:text-xl font-['Comic_Sans_MS'] mb-3 text-[#333] text-center">
          <span className="blink-marquee">
            {question.text}
          </span>
        </h2>
        
        <OptionsList 
          options={question.options}
          onSelect={onAnswer}
          selectedIndex={selectedOptionIndex}
          disabled={isAnswered}
          stats={stats}
          showStats={isAnswered}
        />
        
        {/* Logo watermark */}
        <div className="text-center mt-3">
          <img src={logoSrc} alt="Logo" className="h-6 mx-auto" />
        </div>
      </div>
      
      {/* Action buttons - only show after answering */}
      <ActionBar 
        onNext={onNextQuestion}
        cardId="result-card"
        questionText={question.text}
        showActions={isAnswered}
        ctaUrl={ctaUrl}
        ctaText={ctaText}
      />
    </div>
  );
};

export default QuestionCard;
