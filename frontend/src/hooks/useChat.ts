import { useState } from 'react';
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
      const response = await chatService.sendMessage(content, image);

      const aiMessage: Message = {
        role: 'ai',
        content: response.answer,
        sources: response.sources
      };
      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      console.error('Chat Error:', error);
      setMessages((prev) => [...prev, { 
        role: 'ai', 
        content: '⚠️ I am having trouble connecting to my brain server. Please make sure the Python backend is running.' 
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