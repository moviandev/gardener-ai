import { Text, TouchableOpacity, Linking } from 'react-native';
import { Video } from 'lucide-react-native';

interface SourceBadgeProps {
  url: string;
  index: number;
}

export const SourceBadge = ({ url, index }: SourceBadgeProps) => {
  const handlePress = () => {
    Linking.openURL(url);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="flex-row items-center bg-white/10 border border-white/20 rounded-full px-3 py-2 mr-2 mt-2"
    >
      <Video size={14} color="#f87171" /> 
      {/* #f87171 is Tailwind red-400 */}
      <Text className="text-white/80 text-xs font-medium ml-2">
        Source {index + 1}
      </Text>
    </TouchableOpacity>
  );
};