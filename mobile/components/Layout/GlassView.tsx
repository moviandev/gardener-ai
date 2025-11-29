import { View, ViewProps } from 'react-native';
import { BlurView } from 'expo-blur';
import { twMerge } from 'tailwind-merge';

interface GlassViewProps extends ViewProps {
  intensity?: number;
  className?: string;
  children?: React.ReactNode; // Good practice to explicitly type children
}

export const GlassView = ({ children, intensity = 20, className, style, ...props }: GlassViewProps) => {
  return (
    // We pass 'style' specifically to allow NativeWind to merge inline styles if needed
    <View 
      className={twMerge("overflow-hidden rounded-3xl border border-white/20", className)} 
      style={style}
      {...props}
    >
      <BlurView intensity={intensity} tint="dark" className="absolute inset-0" />
      <View className="bg-white/10 p-4">
        {children}
      </View>
    </View>
  );
};