export interface AIRecommendation {
  id: string;
  type: 'next_service' | 'optimal_time' | 'master';
  service?: {
    id: string;
    name: string;
  };
  master?: {
    id: string;
    name: string;
  };
  suggestedDate?: string;
  suggestedTimeSlots?: string[];
  confidence: number;
  reasoning: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  intent?: string;
  entities?: {
    service?: string;
    date?: string;
    time?: string;
    master?: string;
  };
  suggestedSlots?: string[];
}

export interface AIConversation {
  id: string;
  messages: AIMessage[];
  startedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isLoading?: boolean;
}

export type ChatIntent = 
  | 'book_appointment'
  | 'reschedule'
  | 'cancel'
  | 'check_availability'
  | 'general_info'
  | 'unknown';
