import axios from 'axios';
import { Platform } from 'react-native';

const getBaseUrl = () => {
  const devUrl = process.env.EXPO_PUBLIC_MOBILE_API_URL;
  const iosUrl = process.env.EXPO_PUBLIC_IOS_PUBLIC_API_URL;
  const adroindUrl = process.env.EXPO_PUBLIC_ANDROID_PUBLIC_API_URL;

  if (Platform.OS === 'android') 
    return adroindUrl;

  if (Platform.OS === 'ios')
    return iosUrl;

  return devUrl;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000, 
});

export const chatService = {
  sendMessage: async (question: string, imageBase64?: string | null) => {
    try {
      console.log(`🔌 Connected in: ${api.defaults.baseURL}`);
      const response = await api.post('/chat', {
        question,
        image_base64: imageBase64,
      });
      return response.data;
    } catch (error) {
      console.error("Error on mobile API:", error);
      throw error;
    }
  },
};