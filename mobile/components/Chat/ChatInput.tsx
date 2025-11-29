import { useState } from 'react';
import { View, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { Send, Image as ImageIcon, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { GlassView } from '../Layout/GlassView';

interface ChatInputProps {
  onSend: (message: string, image: string | null) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const base64Img = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setSelectedImage(base64Img);
    }
  };

  const handleSend = () => {
    if ((!input.trim() && !selectedImage) || disabled) return;
    
    onSend(input, selectedImage);
    setInput('');
    setSelectedImage(null);
  };

  return (
    <View className="px-4 pb-4 pt-2">
      <GlassView intensity={40} className="flex-row items-end p-2 rounded-[25px]">
        
        {/* Image Picker Button */}
        <TouchableOpacity 
          onPress={pickImage}
          className="p-3 mr-1"
        >
          <ImageIcon size={24} color={selectedImage ? "#10b981" : "rgba(255,255,255,0.6)"} />
        </TouchableOpacity>

        {/* Input Field */}
        <View className="flex-1 min-h-[48px] justify-center py-2">
          {selectedImage && (
            <View className="mb-2 relative w-16 h-16">
              <Image 
                source={{ uri: selectedImage }} 
                className="w-16 h-16 rounded-lg border border-white/20" 
              />
              <TouchableOpacity 
                onPress={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
              >
                <X size={10} color="white" />
              </TouchableOpacity>
            </View>
          )}
          
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask about plants..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            multiline
            className="text-white text-base max-h-24"
            style={{ fontFamily: 'System' }}
          />
        </View>

        {/* Send Button */}
        <TouchableOpacity 
          onPress={handleSend}
          disabled={disabled || (!input.trim() && !selectedImage)}
          className={`p-3 rounded-full mb-1 ml-1 ${
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