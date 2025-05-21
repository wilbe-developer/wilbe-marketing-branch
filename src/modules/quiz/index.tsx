
// Main export file for the Quiz module
import QuizApp from './QuizApp';
import './quiz.css';

export { QuizApp };
export default QuizApp;

// Export types
export * from './types';

// Export components that might be useful individually
export { default as QuestionCard } from './components/QuestionCard';
export { default as LoadingQuestion } from './components/LoadingQuestion';
export { default as CTAButton } from './components/CTAButton';
