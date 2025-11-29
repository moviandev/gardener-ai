import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, View } from 'react-native';
import { ReactNode } from 'react';

interface KeyboardWrapperProps {
  children: ReactNode;
}

export const KeyboardWrapper = ({ children }: KeyboardWrapperProps) => {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1">
          {children}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};