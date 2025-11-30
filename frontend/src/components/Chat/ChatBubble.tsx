import ReactMarkdown from 'react-markdown';
import { Bot, User } from 'lucide-react';
import { clsx } from 'clsx';
import { SourceBadge } from './SourceBadge';

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

  return (
    <div className={clsx("flex gap-4 mb-6", isAi ? "flex-row" : "flex-row-reverse")}>
      <div className={clsx(
        "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg",
        isAi ? "bg-plant-green/20 text-plant-green border border-plant-green/30" : "bg-white/10 text-white border border-white/20"
      )}>
        {isAi ? <Bot size={20} /> : <User size={20} />}
      </div>

      <div className={clsx(
        "max-w-[80%] rounded-2xl p-5 shadow-sm backdrop-blur-sm",
        isAi 
          ? "glass-panel rounded-tl-none text-white/90" 
          : "bg-plant-green text-white rounded-tr-none shadow-[0_0_15px_rgba(16,185,129,0.3)]"
      )}>
        {message.image && (
          <img 
            src={message.image} 
            alt="Uploaded plant" 
            className="w-full max-w-xs rounded-lg mb-3 border border-white/20" 
          />
        )}

        <div className="prose prose-invert prose-sm max-w-none leading-relaxed">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>

        {isAi && message.sources && message.sources.length > 0 && (
          <div className="mt-4 pt-3 border-t border-white/10">
            <p className="text-xs text-white/50 mb-2 uppercase tracking-wider font-semibold">Sources learned:</p>
            <div className="flex flex-wrap">
              {message.sources.map((url, idx) => (
                <SourceBadge key={idx} url={url} index={idx} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};