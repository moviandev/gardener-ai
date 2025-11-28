import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL
});

export interface ChatResponse {
  answer: string;
  sources: string[];
}

export interface IngestResponse {
  status: string;
  message: string;
}

export const chatService = {
  sendMessage: async (question: string, imageBase64?: string | null) => {
    const response = await api.post<ChatResponse>('/chat', {
      question,
      image_base64: imageBase64,
    });
    return response.data;
  },

  ingestVideo: async (url: string) => {
    const response = await api.post<IngestResponse>('/ingest', {
      video_urls: [url],
    });
    return response.data;
  },
};