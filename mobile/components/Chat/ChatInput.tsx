import { useState } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Send } from 'lucide-react-native';
import { GlassView } from '../Layout/GlassView';
import { ImagePickerButton } from '../Upload/ImagePickerButton';
import { ImagePreview } from '../Upload/ImagePreview';

interface ChatInputProps {
  onSend: (message: string, image: string | null) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleSend = () => {
    // Prevent sending empty messages
    if ((!input.trim() && !selectedImage) || disabled) return;
    
    onSend(input, selectedImage);
    
    // Reset state
    setInput('');
    setSelectedImage(null);
  };

  return (
    <View className="px-4 pb-4 pt-2">
      <GlassView intensity={40} className="flex-row items-end p-2 rounded-[25px]">
        
        {/* 1. The new Modular Upload Button */}
        <ImagePickerButton 
          onImageSelected={setSelectedImage} 
          disabled={disabled}
        />

        {/* 2. Middle Section: Preview + Text Input */}
        <View className="flex-1 min-h-[48px] justify-center py-2 mx-2">
          
          {/* Shows only if an image is selected */}
          <ImagePreview 
            imageUri={selectedImage} 
            onRemove={() => setSelectedImage(null)} 
          />
          
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask about plants..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            multiline
            className="text-white text-base max-h-24 leading-5"
            style={{ fontFamily: 'System' }} 
          />
        </View>

        {/* 3. Send Button */}
        <TouchableOpacity 
          onPress={handleSend}
          disabled={disabled || (!input.trim() && !selectedImage)}
          className={`p-3 rounded-full mb-1 ${
            disabled || (!input.trim() && !selectedImage)
              ? "bg-white/10"
              : "bg-plant-green"
          }`}
        >
          <Send size={20} color="white" />
        </TouchableOpacity>

      </GlassView>
    </View>
  );
};