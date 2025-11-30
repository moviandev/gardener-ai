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
    if ((!input.trim() && !selectedImage) || disabled) return;
    onSend(input, selectedImage);
    setInput('');
    setSelectedImage(null);
  };

  return (
    <View className="px-4 pb-8 pt-2">
      {/* Container Principal do Input */}
      <GlassView intensity={80} className="p-2 rounded-[30px] border border-white/20">
        
        {/* Área de Preview da Imagem (aparece acima do texto se tiver imagem) */}
        {selectedImage && (
          <View className="px-2 pt-2 pb-1">
            <ImagePreview 
              imageUri={selectedImage} 
              onRemove={() => setSelectedImage(null)} 
            />
          </View>
        )}

        {/* Linha de Controles: Botão Foto + Texto + Enviar */}
        <View className="flex-row items-center justify-between">
          
          {/* Botão de Foto (Esquerda) */}
          <View className="ml-1">
            <ImagePickerButton 
              onImageSelected={setSelectedImage} 
              disabled={disabled}
            />
          </View>

          {/* Input de Texto (Meio - Flex 1 para ocupar espaço) */}
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask about plants..."
            placeholderTextColor="rgba(255,255,255,0.4)"
            multiline
            className="flex-1 text-white text-[16px] mx-3 max-h-24 py-3"
            style={{ fontFamily: 'System', includeFontPadding: false, textAlignVertical: 'center' }}
          />

          {/* Botão de Enviar (Direita) */}
          <TouchableOpacity 
            onPress={handleSend}
            disabled={disabled || (!input.trim() && !selectedImage)}
            className={`p-3 rounded-full mr-1 ${
              disabled || (!input.trim() && !selectedImage)
                ? "bg-white/10"
                : "bg-plant-green"
            }`}
          >
            <Send size={20} color="white" strokeWidth={2.5} />
          </TouchableOpacity>

        </View>
      </GlassView>
    </View>
  );
};