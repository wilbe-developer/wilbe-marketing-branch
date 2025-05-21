
export interface SurveyQuestion {
  id: string;
  text: string;
  options: string[];
  category?: string;
  difficulty?: number;
  tags?: string[];
  createdAt?: string;
}

export interface SurveyAnswer {
  questionId: string;
  selectedOptionIndex: number;
  timestamp?: string;
}

export interface QuestionStats {
  [optionIndex: number]: number;
}

export interface SessionData {
  answeredQuestions: SurveyAnswer[];
  currentQuestionIndex: number;
  userId?: string;
  startedAt?: string;
  lastActiveAt?: string;
}

export interface QuestionCategory {
  id: string;
  label: string;
  description?: string;
}

// Quiz module specific props
export interface QuizAppProps {
  title?: string;
  logoSrc?: string;
  ctaUrl?: string;
  ctaText?: string;
  className?: string;
}
