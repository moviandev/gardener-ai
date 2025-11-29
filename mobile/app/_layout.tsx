import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

export default function Layout() {
  return (
    <View style={{ flex: 1, backgroundColor: '#050a09' }}>
      {/* Forces the top bar text (time, battery) to be white */}
      <StatusBar style="light" />
      
      {/* Main Navigation Stack */}
      <Stack 
        screenOptions={{ 
          headerShown: false, // We will build our own Glass Header
          contentStyle: { backgroundColor: 'transparent' },
          animation: 'fade',
        }} 
      />
    </View>
  );
}