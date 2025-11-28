import { useState } from 'react';
import { chatService } from '../services/api';

export const useIngest = () => {
  const [isTraining, setIsTraining] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const trainAgent = async (url: string) => {
    if (!url.trim()) return;
    
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      setFeedback({ type: 'error', message: 'Please provide a valid YouTube URL.' });
      return;
    }

    setIsTraining(true);
    setFeedback(null);

    try {
      await chatService.ingestVideo(url);
      setFeedback({ type: 'success', message: 'Video processed successfully! I am smarter now. 🧠' });
      
    } catch (error) {
      console.error('Ingest Error:', error);
      setFeedback({ type: 'error', message: 'Failed to process video. It might not be about plants or the server is down.' });
    } finally {
      setIsTraining(false);
      
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  return {
    isTraining,
    feedback,
    trainAgent
  };
};