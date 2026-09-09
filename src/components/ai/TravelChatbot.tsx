import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Trash2,
  Minimize2,
  Maximize2,
  CornerDownLeft,
  Lightbulb,
} from 'lucide-react';
import { Destination, ChatMessage } from '../../types';
import { askGeminiTravelAssistant } from '../../services/geminiApi';

interface TravelChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  activeDestination?: Destination;
  allDestinations: Destination[];
}

export const TravelChatbot: React.FC<TravelChatbotProps> = ({
  isOpen,
  onClose,
  activeDestination,
  allDestinations,
}) => {
  const [selectedDestId, setSelectedDestId] = useState<string>(activeDestination?.id || 'all');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const currentDestination = allDestinations.find((d) => d.id === selectedDestId) || activeDestination;

  // Initialize messages with warm welcoming greeting
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Greetings. I am **VOYAGE Concierge**, your personal travel advisor powered by Google Gemini.\n\nWhether you are wondering **how long to spend** in a destination, **what to see**, **when to go**, or **what to pack**, ask me anything.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Sync destination if activeDestination changes
  useEffect(() => {
    if (activeDestination) {
      setSelectedDestId(activeDestination.id);
    }
  }, [activeDestination]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt || input).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
        text: m.text,
      }));

      const reply = await askGeminiTravelAssistant(textToSend, currentDestination, history);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (e) {
      const errorMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: 'Apologies, I encountered a temporary disturbance connecting to the intelligence service. Please ask again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `Conversation cleared. Ready for your next inquiry about **${currentDestination ? currentDestination.name : 'global destinations'}**.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Quick suggestion chips based on requirements
  const promptSuggestions = currentDestination
    ? [
        `How long to spend in ${currentDestination.name}?`,
        `What to see in ${currentDestination.name}?`,
        `When is the best time to visit?`,
        `What should I pack?`,
        `What local food must I try?`,
      ]
    : [
        'How long should I stay in Paris?',
        'What to see in Kyoto in 3 days?',
        'When to visit Santorini?',
        'Packing tips for Iceland?',
      ];

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[440px] h-[600px] max-h-[88vh] rounded-3xl glass-panel border border-amber-500/30 shadow-2xl flex flex-col overflow-hidden text-left animate-in slide-in-from-bottom-5 duration-300">
      {/* Chat Header */}
      <div className="p-4 bg-gradient-to-r from-[#171924] via-[#12141d] to-[#0d0f16] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white font-serif flex items-center gap-1.5">
              VOYAGE Concierge
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
                Gemini
              </span>
            </h4>
            <div className="flex items-center gap-1.5 text-[11px] text-neutral-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Context:</span>
              <select
                value={selectedDestId}
                onChange={(e) => setSelectedDestId(e.target.value)}
                className="bg-transparent text-amber-200 font-medium focus:outline-none cursor-pointer text-[11px] max-w-[130px] truncate"
              >
                <option value="all" className="bg-neutral-900">All Destinations</option>
                {allDestinations.map((d) => (
                  <option key={d.id} value={d.id} className="bg-neutral-900">
                    {d.name}, {d.country}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 text-neutral-400">
          <button
            onClick={clearChat}
            className="p-1.5 hover:text-white rounded-lg hover:bg-white/5 transition"
            title="Clear conversation"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 hover:text-white rounded-lg hover:bg-white/5 transition"
            title="Close concierge"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#090a0f]/60">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-[13px] leading-relaxed ${
                  isUser
                    ? 'bg-amber-400 text-neutral-950 font-medium rounded-tr-none shadow-md'
                    : 'glass-card border border-white/10 text-neutral-200 rounded-tl-none'
                }`}
              >
                {/* Parse simple markdown bold and bullet points */}
                <div className="whitespace-pre-wrap font-light">
                  {msg.text.split('\n').map((line, lIdx) => {
                    // Bold replacer
                    const parts = line.split(/(\*\*.*?\*\*)/g);
                    return (
                      <p key={lIdx} className={line.startsWith('•') || line.startsWith('-') ? 'ml-2 my-0.5' : 'my-1'}>
                        {parts.map((part, pIdx) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={pIdx} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
                          }
                          return part;
                        })}
                      </p>
                    );
                  })}
                </div>
                <span className={`block text-[10px] mt-1 ${isUser ? 'text-neutral-800' : 'text-neutral-500'}`}>
                  {msg.timestamp}
                </span>
              </div>

              {isUser && (
                <div className="w-6 h-6 rounded-lg bg-white/10 text-neutral-300 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-2.5 items-center text-xs text-neutral-400 pl-1">
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="flex items-center gap-1.5 p-2 rounded-xl glass-card border border-white/5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Consulting Gemini Travel Intelligence...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="px-3 py-2 bg-[#0c0e14] border-t border-white/5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-1" />
        {promptSuggestions.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 text-[11px] text-neutral-300 shrink-0 border border-white/5 transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-[#11131a] border-t border-white/10 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about ${currentDestination ? currentDestination.name : 'destinations, weather, culture'}...`}
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-white/10 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500/50"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-neutral-950 transition"
          title="Send inquiry"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
