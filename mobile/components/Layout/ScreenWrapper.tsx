import { ReactNode } from 'react';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ViewProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

interface ScreenWrapperProps extends ViewProps {
  children: ReactNode;
  className?: string;
}

export const ScreenWrapper = ({ children, className, ...props }: ScreenWrapperProps) => {
  return (
    <LinearGradient
      colors={['#1a2e29', '#0f1c19', '#050a09']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView className={twMerge("flex-1 w-full", className)} {...props}>
        <StatusBar style="light" />
        {children}
      </SafeAreaView>
    </LinearGradient>
  );
};