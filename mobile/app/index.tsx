import { useRef } from 'react';
import { FlatList, View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import { Sprout, Video } from 'lucide-react-native';
import { ScreenWrapper } from '../components/Layout/ScreenWrapper';
import { KeyboardWrapper } from '../components/Layout/KeyboardWrapper';
import { GlassView } from '../components/Layout/GlassView';
import { ChatBubble } from '../components/Chat/ChatBubble';
import { ChatInput } from '../components/Chat/ChatInput';
import { useChat } from '../hooks/useChat';
import { useIngest } from '../hooks/useIngest';

export default function Home() {
  const { messages, isLoading, sendMessage } = useChat();
  const { trainAgent, isTraining } = useIngest();
  const flatListRef = useRef<FlatList>(null);

  const handleContentSizeChange = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const handleOpenTraining = () => {
    if (Platform.OS === 'ios') {
      Alert.prompt(
        "Train AI",
        "Paste a YouTube URL to teach the agent:",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Teach", onPress: (url) => url && trainAgent(url) }
        ],
        "plain-text"
      );
    } else {
      Alert.alert("Not supported", "Training is iOS/Web only for now.");
    }
  };

  return (
    <ScreenWrapper>
      <KeyboardWrapper>
        <View className="flex-1 flex-col w-full">

          {/* --- HEADER CORRIGIDO --- */}
          <View className="px-4 pt-4 pb-2 z-10 w-full">
            {/* 1. GlassView lida apenas com borda, arredondamento e o efeito de vidro */}
            <GlassView 
              intensity={60} 
              className="rounded-[25px] border-white/10 overflow-hidden" 
              style={{ width: '100%' }}
            >
              {/* 2. Criamos uma View interna EXPLICITA para controlar o layout (row/justify) */}
              <View className="flex-row items-center justify-between p-4 w-full">
                
                {/* Grupo Esquerdo */}
                <View className="flex-1 flex-row items-center mr-2">
                  <View className="w-12 h-12 bg-plant-green/10 rounded-full items-center justify-center border border-plant-green/20 mr-3">
                    <Sprout size={24} color="#10b981" />
                  </View>
                  
                  <View className="flex-1">
                    <Text className="text-white font-bold text-lg" numberOfLines={1}>
                      Plant AI
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <View className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5" />
                      <Text className="text-white/50 text-[10px] uppercase font-bold tracking-widest">
                        {isTraining ? "Learning..." : "Online"}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Botão Youtube */}
                <TouchableOpacity 
                  onPress={handleOpenTraining}
                  disabled={isTraining}
                  className="w-10 h-10 items-center justify-center bg-white/5 rounded-full border border-white/10"
                >
                  <Video size={20} color={isTraining ? "gray" : "#f87171"} strokeWidth={2} />
                </TouchableOpacity>

              </View>
            </GlassView>
          </View>
          {/* --- FIM DO HEADER --- */}

          {/* --- LISTA --- */}
          <View className="flex-1 w-full">
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => <ChatBubble message={item} />}
              contentContainerStyle={{ paddingBottom: 20, paddingTop: 10, paddingHorizontal: 0 }}
              onContentSizeChange={handleContentSizeChange}
              onLayout={handleContentSizeChange}
              showsVerticalScrollIndicator={false}
              style={{ width: '100%' }}
            />
          </View>

          {/* --- INPUT --- */}
          <View className="w-full">
            <ChatInput onSend={sendMessage} disabled={isLoading} />
          </View>

        </View>
      </KeyboardWrapper>
    </ScreenWrapper>
  );
}