import { useState, type KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { ImageUploader } from '../Upload/ImageUploader';

interface ChatInputProps {
  onSend: (message: string, image: string | null) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleSend = () => {
    if ((!input.trim() && !selectedImage) || disabled) return;
    
    onSend(input, selectedImage);
    setInput('');
    setSelectedImage(null);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="glass-panel p-2 rounded-3xl flex items-end gap-2 relative">
      <div className="pb-1 pl-1">
        <ImageUploader 
          selectedImage={selectedImage} 
          onImageSelect={setSelectedImage} 
        />
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about your plants..."
        className="glass-input w-full rounded-2xl py-3 px-4 resize-none h-12 max-h-32 min-h-[48px] overflow-hidden focus:h-24 transition-all"
        disabled={disabled}
        rows={1}
      />
      <button
        onClick={handleSend}
        disabled={disabled || (!input.trim() && !selectedImage)}
        className="p-3 bg-plant-green hover:bg-plant-green-dark disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-white shadow-lg shadow-plant-green/20 transition-all mb-1 mr-1"
      >
        <Send size={20} />
      </button>
    </div>
  );
};