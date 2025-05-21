
import { SurveyQuestion, QuestionStats } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { getAllQuestions } from '../config/questions';

// In-memory statistics store (would be server-side in production)
const questionStats: Record<string, QuestionStats> = {};
const usedQuestionIds: Set<string> = new Set();
let currentQuestionIndex = 0;

// Initialize stats for questions
export const initializeQuestionStats = () => {
  // Initialize stats for all questions
  const questions = getAllQuestions();
  
  questions.forEach(question => {
    if (!questionStats[question.id]) {
      questionStats[question.id] = {
        0: Math.floor(Math.random() * 40) + 10,  // 10-50
        1: Math.floor(Math.random() * 30) + 10,  // 10-40
        2: Math.floor(Math.random() * 20) + 5,   // 5-25
        3: Math.floor(Math.random() * 10) + 5    // 5-15
      };
    }
  });

  // Reset used question tracking
  usedQuestionIds.clear();
  currentQuestionIndex = 0;
};

// Record an answer
export const recordAnswer = (questionId: string, optionIndex: number) => {
  if (!questionStats[questionId]) {
    questionStats[questionId] = { 0: 0, 1: 0, 2: 0, 3: 0 };
  }
  
  questionStats[questionId][optionIndex] = (questionStats[questionId][optionIndex] || 0) + 1;
  return getQuestionStats(questionId);
};

// Get stats for a question
export const getQuestionStats = (questionId: string): QuestionStats => {
  return questionStats[questionId] || { 0: 0, 1: 0, 2: 0, 3: 0 };
};

// Get the next question sequentially from the list
export const generateNewQuestion = async (): Promise<SurveyQuestion> => {
  try {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const questions = getAllQuestions();
    
    // If we've gone through all questions, reset to beginning
    if (currentQuestionIndex >= questions.length) {
      currentQuestionIndex = 0;
    }
    
    // Get the next question in sequence
    const selectedQuestion = questions[currentQuestionIndex];
    
    // Mark as used
    usedQuestionIds.add(selectedQuestion.id);
    
    // Increment index for next time
    currentQuestionIndex++;
    
    return selectedQuestion;
  } catch (error) {
    console.error("Error generating question:", error);
    return getFallbackQuestion();
  }
};

// Get a fallback question in case of errors
export const getFallbackQuestion = (): SurveyQuestion => {
  // Create a simple fallback question with a random ID
  const fallbackQuestion = {
    id: `fallback-${uuidv4()}`,
    text: "Something went wrong. Which approach do you take?",
    options: [
      "Refresh the page and try again.",
      "Contact support for assistance.",
      "Take a deep breath and continue anyway.",
      "Close the browser and pretend this never happened."
    ],
    category: 'strategy',
    tags: ['error', 'resilience']
  };
  
  // Initialize stats for the fallback
  questionStats[fallbackQuestion.id] = {
    0: Math.floor(Math.random() * 20) + 5,
    1: Math.floor(Math.random() * 20) + 5,
    2: Math.floor(Math.random() * 10) + 5,
    3: Math.floor(Math.random() * 10) + 5
  };
  
  return fallbackQuestion;
};

// Initialize stats when module loads
initializeQuestionStats();
