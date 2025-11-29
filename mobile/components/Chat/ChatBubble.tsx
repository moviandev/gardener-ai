import { View, Text, Image } from 'react-native';
import { Bot, User } from 'lucide-react-native';
import { GlassView } from '../Layout/GlassView';
import { SourceBadge } from './SourceBadge';
import { clsx } from 'clsx';

interface Message {
  role: 'user' | 'ai';
  content: string;
  image?: string | null;
  sources?: string[];
}

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble = ({ message }: ChatBubbleProps) => {
  const isAi = message.role === 'ai';

  // Component to render the content text
  const ContentText = () => (
    <Text className={clsx("text-base leading-6", isAi ? "text-white/90" : "text-white")}>
      {message.content}
    </Text>
  );

  return (
    <View className={clsx("flex-row mb-6 mx-4", isAi ? "justify-start" : "justify-end")}>
      
      {/* Avatar (Only for AI) */}
      {isAi && (
        <View className="w-8 h-8 rounded-full bg-plant-green/20 items-center justify-center mr-2 border border-plant-green/30 mt-1">
          <Bot size={16} color="#10b981" />
        </View>
      )}

      {/* Bubble Container */}
      <View className="max-w-[85%]">
        {isAi ? (
          <GlassView intensity={30} className="rounded-tl-none p-4">
             {/* Text Content */}
            <ContentText />

            {/* Sources Section */}
            {message.sources && message.sources.length > 0 && (
              <View className="mt-3 pt-3 border-t border-white/10">
                <Text className="text-white/40 text-[10px] uppercase font-bold mb-1">
                  Learned from:
                </Text>
                <View className="flex-row flex-wrap">
                  {message.sources.map((url, idx) => (
                    <SourceBadge key={idx} url={url} index={idx} />
                  ))}
                </View>
              </View>
            )}
          </GlassView>
        ) : (
          <View className="bg-plant-green p-4 rounded-2xl rounded-tr-none shadow-sm">
            {/* User Image Preview */}
            {message.image && (
              <Image 
                source={{ uri: message.image }} 
                className="w-48 h-48 rounded-lg mb-2 border border-white/20"
                resizeMode="cover"
              />
            )}
            <ContentText />
          </View>
        )}
      </View>

      {/* Avatar (Only for User) */}
      {!isAi && (
        <View className="w-8 h-8 rounded-full bg-white/10 items-center justify-center ml-2 border border-white/20 mt-1">
          <User size={16} color="white" />
        </View>
      )}
    </View>
  );
};