import { useState } from 'react';
import { Sprout, Video, Sparkles, BrainCircuit } from 'lucide-react';
import { GlassCard } from './components/Layout/GlassCard';
import { ChatBubble } from './components/Chat/ChatBubble';
import { ChatInput } from './components/Chat/ChatInput';
import { useChat } from './hooks/useChat';
import { useIngest } from './hooks/useIngest';
import { clsx } from 'clsx';

function App() {
  const { messages, isLoading, sendMessage } = useChat();
  const { isTraining, feedback, trainAgent } = useIngest();
  const [videoUrl, setVideoUrl] = useState('');

  const handleTrain = async () => {
    if (!videoUrl) return;
    await trainAgent(videoUrl);
    setVideoUrl('');
  };

  return (
    <div className="h-screen w-full flex p-4 md:p-8 gap-6 justify-center items-center">
      
      {/* LEFT COLUMN: Control Panel / Training */}
      <GlassCard className="hidden md:flex flex-col w-1/3 max-w-sm h-full rounded-[2.5rem] border-white/5 relative overflow-hidden">
        {/* Decorative background blob */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-plant-green/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-plant-green/20 rounded-2xl border border-plant-green/30 text-plant-green">
              <Sprout size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Plant AI</h1>
              <p className="text-xs text-white/50 uppercase tracking-widest font-medium">Botanical Agent</p>
            </div>
          </div>

          {/* Training Section */}
          <div className="mt-auto mb-auto">
            <h2 className="flex items-center gap-2 text-lg font-medium text-white/90 mb-4">
              <BrainCircuit size={20} className="text-purple-400" />
              Neural Training
            </h2>
            <p className="text-sm text-white/60 mb-6 leading-relaxed">
              Feed me YouTube videos to expand my knowledge base. I learn instantly.
            </p>

            <div className="space-y-3">
              <div className="relative">
                <Video className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <input 
                  type="text" 
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="Paste YouTube URL..."
                  className="glass-input w-full py-4 pl-12 pr-4 rounded-2xl text-sm"
                />
              </div>

              <button 
                onClick={handleTrain}
                disabled={isTraining || !videoUrl}
                className={clsx(
                  "w-full py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg",
                  isTraining 
                    ? "bg-white/5 text-white/30 cursor-not-allowed" 
                    : "bg-gradient-to-r from-plant-green to-plant-green/80 hover:scale-[1.02] text-white shadow-plant-green/20"
                )}
              >
                {isTraining ? (
                  <>
                    <Sparkles className="animate-spin" size={18} /> Processing...
                  </>
                ) : (
                  "Ingest Knowledge"
                )}
              </button>
            </div>

            {/* Feedback Message */}
            {feedback && (
              <div className={clsx(
                "mt-4 p-3 rounded-xl text-xs font-medium border text-center animate-pulse",
                feedback.type === 'success' 
                  ? "bg-green-500/10 border-green-500/20 text-green-200" 
                  : "bg-red-500/10 border-red-500/20 text-red-200"
              )}>
                {feedback.message}
              </div>
            )}
          </div>

          <div className="mt-auto pt-6 border-t border-white/5">
            <p className="text-[10px] text-center text-white/30">
              Powered by RAG & GPT-4o Vision
            </p>
          </div>
        </div>
      </GlassCard>

      {/* RIGHT COLUMN: Chat Interface */}
      <GlassCard className="flex-1 h-full rounded-[2.5rem] flex flex-col relative overflow-hidden border-white/5">
        
        {/* Chat Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/10 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-medium text-white/80">Assistant Online</span>
          </div>
          <div className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40">
            v1.0.0
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scroll-smooth">
          {messages.map((msg, index) => (
            <ChatBubble key={index} message={msg} />
          ))}
          
          {isLoading && (
            <div className="flex gap-4 mb-6 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-plant-green/20 border border-plant-green/30 flex items-center justify-center">
                <Sprout size={20} className="text-plant-green animate-bounce" />
              </div>
              <div className="glass-panel px-5 py-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms'}} />
                <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms'}} />
                <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms'}} />
              </div>
            </div>
          )}
        </div>

        {/* Chat Input Area */}
        <div className="p-6 bg-gradient-to-t from-black/20 to-transparent z-10">
          <ChatInput onSend={sendMessage} disabled={isLoading} />
        </div>

      </GlassCard>

    </div>
  );
}

export default App;