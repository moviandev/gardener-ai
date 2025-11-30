import axios from 'axios';
import { Platform } from 'react-native';

export interface ChatResponse {
  answer: string;
  sources: string[];
}

export interface IngestResponse {
  status: string;
  message: string;
  chunks_count?: number;
}

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

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatService = {
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

  ingestVideo: async (url: string) => {
    try {
      console.log(`🔌 [${Platform.OS}] Calling Ingest API at: ${api.defaults.baseURL}/ingest`);
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