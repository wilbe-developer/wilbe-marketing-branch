
import { StorageService, storage } from './storageService';
import { SessionData, SurveyAnswer } from '../types';

export class SessionService {
  private storage: StorageService;
  private readonly SESSION_KEY = 'session';
  private readonly SESSION_ID_KEY = 'session_id';
  
  constructor(storage: StorageService) {
    this.storage = storage;
  }
  
  getSessionId(): string {
    let sessionId = this.storage.getItem(this.SESSION_ID_KEY, '');
    if (!sessionId) {
      sessionId = this.generateSessionId();
      this.storage.setItem(this.SESSION_ID_KEY, sessionId);
    }
    return sessionId;
  }
  
  getSessionData(): SessionData {
    // Get the session data, or initialize with defaults if not found
    const defaultData: SessionData = {
      answeredQuestions: [],
      currentQuestionIndex: 0
    };
    
    return this.storage.getItem<SessionData>(this.SESSION_KEY, defaultData);
  }
  
  saveSessionData(data: SessionData): void {
    this.storage.setItem(this.SESSION_KEY, data);
  }
  
  recordAnswer(answer: SurveyAnswer): void {
    const sessionData = this.getSessionData();
    sessionData.answeredQuestions.push(answer);
    this.saveSessionData(sessionData);
  }
  
  updateQuestionIndex(index: number): void {
    const sessionData = this.getSessionData();
    sessionData.currentQuestionIndex = index;
    this.saveSessionData(sessionData);
  }
  
  shouldShowCTA(): boolean {
    const sessionData = this.getSessionData();
    return sessionData.answeredQuestions.length >= 3;
  }
  
  clearSession(): void {
    // Reset session to initial state
    this.saveSessionData({
      answeredQuestions: [],
      currentQuestionIndex: 0
    });
    
    // Ensure the storage is immediately updated
    this.storage.removeItem(this.SESSION_KEY);
    this.saveSessionData({
      answeredQuestions: [],
      currentQuestionIndex: 0
    });
  }
  
  private generateSessionId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}

// Export a default instance
export const sessionService = new SessionService(storage);
