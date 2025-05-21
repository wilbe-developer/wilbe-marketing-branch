
import { useEffect } from 'react';
import { useSurveyContext } from '../context/SurveyContext';
import { SurveyAnswer } from '../types';
import { getAllQuestions } from '../config/questions';
import { sessionService } from '../services/sessionService';
import { 
  generateNewQuestion, 
  getQuestionStats, 
  recordAnswer 
} from '../services/questionService';
import { useToast } from '../hooks/useToast';

export function useSurvey() {
  const { state, dispatch } = useSurveyContext();
  const { toast } = useToast();
  
  // Initialize survey from session data
  useEffect(() => {
    const initializeSurvey = async () => {
      try {
        // Clear the session to start fresh on each page load
        sessionService.clearSession();
        
        // Get session data (which should be freshly reset)
        const sessionData = sessionService.getSessionData();
        
        // Load first 20 questions initially
        const questions = getAllQuestions().slice(0, 20);
        
        // Initialize survey state
        dispatch({ 
          type: 'INITIALIZE', 
          payload: { 
            questions,
            sessionData,
          }
        });
      } catch (error) {
        console.error("Error initializing survey:", error);
        toast({
          title: "Error loading questions",
          description: "Unable to load survey questions"
        });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    
    initializeSurvey();
  }, [dispatch, toast]);
  
  // Handle answering a question
  const handleAnswer = async (optionIndex: number) => {
    const currentQuestion = state.questions[state.currentQuestionIndex];
    if (!currentQuestion) return;
    
    // Update UI state
    dispatch({ type: 'SELECT_OPTION', payload: optionIndex });
    dispatch({ type: 'SET_SHOW_STATS', payload: true });
    
    // Record the answer
    const updatedStats = recordAnswer(currentQuestion.id, optionIndex);
    
    // Update stats in state
    dispatch({ 
      type: 'SET_STATS', 
      payload: { 
        questionId: currentQuestion.id, 
        stats: updatedStats 
      }
    });
    
    // Create the answer object
    const answer: SurveyAnswer = {
      questionId: currentQuestion.id,
      selectedOptionIndex: optionIndex,
      timestamp: new Date().toISOString()
    };
    
    // Record answer in state and session
    dispatch({ type: 'ADD_ANSWER', payload: answer });
    sessionService.recordAnswer(answer);
    
    // Check if we should show CTA after 3 answers
    const shouldShowCTA = sessionService.shouldShowCTA();
    if (shouldShowCTA) {
      dispatch({ type: 'SET_SHOW_CTA', payload: true });
    }
  };
  
  // Move to the next question
  const goToNextQuestion = async () => {
    const nextIndex = state.currentQuestionIndex + 1;
    
    // Update session data
    sessionService.updateQuestionIndex(nextIndex);
    
    // Check if we need to load more questions
    if (nextIndex >= state.questions.length) {
      try {
        dispatch({ type: 'SET_GENERATING_QUESTION', payload: true });
        
        // Generate a new question
        const newQuestion = await generateNewQuestion();
        
        // Add the new question to state
        dispatch({ type: 'ADD_QUESTION', payload: newQuestion });
        
        // Update current question index
        dispatch({ type: 'SET_CURRENT_QUESTION', payload: nextIndex });
      } catch (error) {
        console.error("Failed to generate question:", error);
        toast({
          title: "Couldn't retrieve next question",
          description: "Using a fallback question instead."
        });
      } finally {
        dispatch({ type: 'SET_GENERATING_QUESTION', payload: false });
      }
    } else {
      // Move to the next loaded question
      dispatch({ type: 'SET_CURRENT_QUESTION', payload: nextIndex });
    }
    
    // Reset question UI state
    dispatch({ type: 'RESET_QUESTION_UI' });
  };
  
  // Get stats for the current question
  const getCurrentStats = () => {
    const currentQuestion = state.questions[state.currentQuestionIndex];
    if (!currentQuestion) return null;
    
    return state.stats[currentQuestion.id] || getQuestionStats(currentQuestion.id);
  };
  
  return {
    currentQuestion: state.questions[state.currentQuestionIndex],
    currentQuestionIndex: state.currentQuestionIndex,
    isLoading: state.isLoading,
    isGeneratingQuestion: state.isGeneratingQuestion,
    selectedOptionIndex: state.selectedOptionIndex,
    showStats: state.showStats,
    showCTA: state.showCTA,
    stats: getCurrentStats(),
    handleAnswer,
    goToNextQuestion
  };
}
