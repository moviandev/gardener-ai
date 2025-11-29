import { useState } from 'react';
import { Alert } from 'react-native';
import { chatService } from '../services/api';

export interface Message {
  role: 'user' | 'ai';
  content: string;
  image?: string | null;
  sources?: string[];
}

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'ai', 
      content: 'Hello! I am your Botanical AI Assistant. 🌱\n\nAsk me anything about plant care, or upload a photo for a diagnosis!' 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string, image: string | null) => {
    const userMessage: Message = { role: 'user', content, image };
    setMessages((prev) => [...prev, userMessage]);
    
    setIsLoading(true);

    try {
      // 2. Call the Python Backend
      const response = await chatService.sendMessage(content, image);

      // 3. Add AI response
      const aiMessage: Message = {
        role: 'ai',
        content: response.answer,
        sources: response.sources
      };
      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      console.error('Mobile Chat Error:', error);
      Alert.alert(
        "Connection Error", 
        "Could not reach the Plant Brain. Check if your computer is on the same Wi-Fi and the server is running with --host 0.0.0.0"
      );
      
      setMessages((prev) => [...prev, { 
        role: 'ai', 
        content: '⚠️ Connection failed. Please try again.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage
  };
};