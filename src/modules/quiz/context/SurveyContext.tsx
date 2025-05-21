
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { SurveyQuestion, SurveyAnswer, QuestionStats, SessionData } from '../types';
import { getAllQuestions } from '../config/questions';
import { sessionService } from '../services/sessionService';

// Define the Survey state
export interface SurveyState {
  questions: SurveyQuestion[];
  currentQuestionIndex: number;
  answeredQuestions: SurveyAnswer[];
  stats: Record<string, QuestionStats>;
  isLoading: boolean;
  isGeneratingQuestion: boolean;
  selectedOptionIndex: number | null;
  showStats: boolean;
  showCTA: boolean;
}

// Define possible actions
type SurveyAction =
  | { type: 'INITIALIZE', payload: { questions: SurveyQuestion[], sessionData: SessionData } }
  | { type: 'SET_LOADING', payload: boolean }
  | { type: 'SET_GENERATING_QUESTION', payload: boolean }
  | { type: 'SET_CURRENT_QUESTION', payload: number }
  | { type: 'SELECT_OPTION', payload: number }
  | { type: 'SET_SHOW_STATS', payload: boolean }
  | { type: 'SET_STATS', payload: { questionId: string, stats: QuestionStats } }
  | { type: 'ADD_ANSWER', payload: SurveyAnswer }
  | { type: 'ADD_QUESTION', payload: SurveyQuestion }
  | { type: 'SET_SHOW_CTA', payload: boolean }
  | { type: 'RESET_QUESTION_UI' };

// Define the initial state
const initialState: SurveyState = {
  questions: [],
  currentQuestionIndex: 0,
  answeredQuestions: [],
  stats: {},
  isLoading: true,
  isGeneratingQuestion: false,
  selectedOptionIndex: null,
  showStats: false,
  showCTA: false,
};

// Create the reducer function
function surveyReducer(state: SurveyState, action: SurveyAction): SurveyState {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        questions: action.payload.questions,
        currentQuestionIndex: action.payload.sessionData.currentQuestionIndex,
        answeredQuestions: action.payload.sessionData.answeredQuestions,
        showCTA: action.payload.sessionData.answeredQuestions.length >= 3,
        isLoading: false,
      };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_GENERATING_QUESTION':
      return { ...state, isGeneratingQuestion: action.payload };

    case 'SET_CURRENT_QUESTION':
      return { ...state, currentQuestionIndex: action.payload };

    case 'SELECT_OPTION':
      return { ...state, selectedOptionIndex: action.payload };

    case 'SET_SHOW_STATS':
      return { ...state, showStats: action.payload };

    case 'SET_STATS':
      return {
        ...state,
        stats: {
          ...state.stats,
          [action.payload.questionId]: action.payload.stats
        }
      };

    case 'ADD_ANSWER':
      return {
        ...state,
        answeredQuestions: [...state.answeredQuestions, action.payload],
        showCTA: state.showCTA || state.answeredQuestions.length + 1 >= 3
      };

    case 'ADD_QUESTION':
      return {
        ...state,
        questions: [...state.questions, action.payload]
      };

    case 'SET_SHOW_CTA':
      return { ...state, showCTA: action.payload };

    case 'RESET_QUESTION_UI':
      return {
        ...state,
        selectedOptionIndex: null,
        showStats: false
      };

    default:
      return state;
  }
}

// Create the context
interface SurveyContextType {
  state: SurveyState;
  dispatch: React.Dispatch<SurveyAction>;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

// Create the provider component
export const SurveyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(surveyReducer, initialState);

  return (
    <SurveyContext.Provider value={{ state, dispatch }}>
      {children}
    </SurveyContext.Provider>
  );
};

// Create a custom hook to use the survey context
export const useSurveyContext = () => {
  const context = useContext(SurveyContext);
  
  if (context === undefined) {
    throw new Error('useSurveyContext must be used within a SurveyProvider');
  }
  
  return context;
};
