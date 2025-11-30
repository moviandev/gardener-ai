import { View, ViewProps, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { twMerge } from 'tailwind-merge';

interface GlassViewProps extends ViewProps {
  intensity?: number;
  className?: string;
  children?: React.ReactNode;
}

export const GlassView = ({ children, intensity = 60, className, style, ...props }: GlassViewProps) => {
  const blurAmount = Platform.OS === 'android' ? 100 : intensity;

  return (
    <View 
      className={twMerge("overflow-hidden rounded-[20px] border border-white/10", className)} 
      style={style}
      {...props}
    >
      <BlurView 
        intensity={blurAmount} 
        tint="dark"
        className="absolute inset-0" 
      />
      <View className="bg-white/5 px-4 py-3">
        {children}
      </View>
    </View>
  );
};