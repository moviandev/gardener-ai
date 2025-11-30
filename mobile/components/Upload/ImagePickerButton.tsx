import { TouchableOpacity, Alert } from 'react-native';
import { Image as ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

interface ImagePickerButtonProps {
  onImageSelected: (base64: string) => void;
  disabled?: boolean;
}

export const ImagePickerButton = ({ onImageSelected, disabled }: ImagePickerButtonProps) => {
  
  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert("Permission Required", "You need to allow access to your photos to upload plant images.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        const cleanBase64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
        onImageSelected(cleanBase64);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image.");
    }
  };

  return (
    <TouchableOpacity 
      onPress={pickImage}
      disabled={disabled}
      className={`p-3 mr-1 rounded-full ${disabled ? 'opacity-50' : 'active:bg-white/10'}`}
    >
      <ImageIcon 
        size={24} 
        color={disabled ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.7)"} 
      />
    </TouchableOpacity>
  );
};