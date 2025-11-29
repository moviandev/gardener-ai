import { View, Image, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';

interface ImagePreviewProps {
  imageUri: string | null;
  onRemove: () => void;
}

export const ImagePreview = ({ imageUri, onRemove }: ImagePreviewProps) => {
  if (!imageUri) return null;

  return (
    <View className="mb-3 relative w-20 h-20 shadow-lg">
      <Image 
        source={{ uri: imageUri }} 
        className="w-20 h-20 rounded-xl border border-white/30" 
        resizeMode="cover"
      />
      <TouchableOpacity 
        onPress={onRemove}
        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1.5 shadow-md border border-white/10"
        activeOpacity={0.7}
      >
        <X size={12} color="white" strokeWidth={3} />
      </TouchableOpacity>
    </View>
  );
};