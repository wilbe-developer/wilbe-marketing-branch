
import React, { useRef } from 'react';
import { SurveyQuestion, QuestionStats } from '../types';
import { OptionsList } from './OptionsList';
import { ActionBar } from './ActionBar';
import WilbeLogo from "@/assets/WilbeLogo";

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
  logoSrc,
  ctaUrl = "/waitlist",
  ctaText = "Serious about building?"
}) => {
  const resultCardRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full max-w-md mx-auto bg-white px-4 py-6 rounded-sm pixel-border early-internet-card">
      <div ref={resultCardRef} id="result-card" className="space-y-4">
        <h2 className="text-lg md:text-xl font-['Comic_Sans_MS'] mb-3 text-[#333] text-center">
          <span className="blink-marquee">
            ★ {question.text} ★
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
        <div className="text-center mt-4">
          <WilbeLogo
            className="h-6 mx-auto"
            style={{
              '--sails-color': 'var(--brand-pink, #FF2C6D)',
              '--text-color': 'var(--brand-darkBlue, #0A1632)',
            } as React.CSSProperties}
          />
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
