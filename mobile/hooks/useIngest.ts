import { useState } from 'react';
import { Alert } from 'react-native';
import { chatService } from '../services/api'; 

export const useIngest = () => {
  const [isTraining, setIsTraining] = useState(false);

  const trainAgent = async (url: string) => {
    // Basic validation
    if (!url.trim()) return;
    
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      Alert.alert("Invalid URL", "Please provide a valid YouTube URL.");
      return;
    }

    setIsTraining(true);

    try {
      await chatService.ingestVideo(url);
      Alert.alert("Success!", "I have learned from this video. 🧠");
      
    } catch (error) {
      console.error('Ingest Error:', error);
      Alert.alert("Error", "Failed to process video. It might not be about plants.");
    } finally {
      setIsTraining(false);
    }
  };

  return {
    isTraining,
    trainAgent
  };
};