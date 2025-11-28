export interface Message {
  role: 'user' | 'ai';
  content: string;
  image?: string | null;
  sources?: string[];
}

export interface ChatResponse {
  answer: string;
  sources: string[];
}

export interface IngestResponse {
  status: 'success' | 'error';
  message: string;
}