import axios from 'axios';
import { Platform } from 'react-native';

// --- Types ---
export interface ChatResponse {
  answer: string;
  sources: string[];
}

export interface IngestResponse {
  status: string;
  message: string;
  chunks_count?: number;
}

// --- Base URL Logic ---
const getBaseUrl = () => {
  const devUrl = process.env.EXPO_PUBLIC_MOBILE_API_URL;
  const iosUrl = process.env.EXPO_PUBLIC_IOS_API_URL;
  const androidUrl = process.env.EXPO_PUBLIC_ANDROID_API_URL;

  if (Platform.OS === 'android') {
    return androidUrl || devUrl;
  }

  if (Platform.OS === 'ios') {
    return iosUrl || devUrl;
  }

  return devUrl;
};

// --- Axios Instance ---
const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000, // Increased timeout for video ingestion (it takes time)
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Service Methods ---
export const chatService = {
  // 1. Chat Method
  sendMessage: async (question: string, imageBase64?: string | null) => {
    try {
      console.log(`🔌 [${Platform.OS}] Calling Chat API at: ${api.defaults.baseURL}/chat`);
      
      const response = await api.post<ChatResponse>('/chat', {
        question,
        image_base64: imageBase64,
      });
      return response.data;
    } catch (error) {
      console.error("❌ Chat API Error:", error);
      throw error;
    }
  },

  // 2. Ingestion Method (New!)
  ingestVideo: async (url: string) => {
    try {
      console.log(`🔌 [${Platform.OS}] Calling Ingest API at: ${api.defaults.baseURL}/ingest`);

      // The backend expects a list of URLs: { video_urls: [...] }
      const response = await api.post<IngestResponse>('/ingest', {
        video_urls: [url],
      });
      return response.data;
    } catch (error) {
      console.error("❌ Ingest API Error:", error);
      throw error;
    }
  }
};