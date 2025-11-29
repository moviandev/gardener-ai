import { useRef } from 'react';
import { FlatList, View, Text, TouchableOpacity } from 'react-native';
import { Sprout, MoreHorizontal } from 'lucide-react-native';
import { ScreenWrapper } from '../components/Layout/ScreenWrapper';
import { KeyboardWrapper } from '../components/Layout/KeyboardWrapper';
import { GlassView } from '../components/Layout/GlassView';
import { ChatBubble } from '../components/Chat/ChatBubble';
import { ChatInput } from '../components/Chat/ChatInput';
import { useChat } from '../hooks/useChat';

export default function Home() {
  const { messages, isLoading, sendMessage } = useChat();
  const flatListRef = useRef<FlatList>(null);

  // Auto-scroll to bottom when new messages arrive
  const handleContentSizeChange = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <ScreenWrapper>
      <KeyboardWrapper>
        <View className="flex-1 flex-col">

          {/* --- HEADER --- */}
          <View className="px-4 pt-2 pb-4 z-10">
            <GlassView intensity={20} className="flex-row items-center justify-between p-4 rounded-[25px]">
              
              <View className="flex-row items-center gap-3">
                {/* Logo Icon */}
                <View className="w-10 h-10 bg-plant-green/20 rounded-full items-center justify-center border border-plant-green/30">
                  <Sprout size={20} color="#10b981" />
                </View>
                
                {/* Title & Status */}
                <View>
                  <Text className="text-white font-bold text-lg leading-5">
                    Plant AI
                  </Text>
                  <View className="flex-row items-center mt-0.5">
                    <View className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse" />
                    <Text className="text-white/50 text-xs font-medium uppercase tracking-widest">
                      Online
                    </Text>
                  </View>
                </View>
              </View>

              {/* Menu Button (Visual Only) */}
              <TouchableOpacity className="p-2 bg-white/5 rounded-full">
                <MoreHorizontal size={20} color="white" />
              </TouchableOpacity>

            </GlassView>
          </View>

          {/* --- MESSAGES LIST --- */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => <ChatBubble message={item} />}
            contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
            onContentSizeChange={handleContentSizeChange}
            onLayout={handleContentSizeChange}
            showsVerticalScrollIndicator={false}
            // ListEmptyComponent isn't needed because useChat has a default welcome message
          />

          {/* --- LOADING INDICATOR --- */}
          {isLoading && (
            <View className="absolute bottom-20 left-6 z-20">
              <GlassView intensity={40} className="rounded-full px-4 py-2 flex-row items-center gap-2">
                <Sprout size={14} color="#10b981" />
                <Text className="text-white/70 text-xs font-medium">
                  Thinking...
                </Text>
              </GlassView>
            </View>
          )}

          {/* --- INPUT AREA --- */}
          <View className="mb-2">
            <ChatInput onSend={sendMessage} disabled={isLoading} />
          </View>

        </View>
      </KeyboardWrapper>
    </ScreenWrapper>
  );
}