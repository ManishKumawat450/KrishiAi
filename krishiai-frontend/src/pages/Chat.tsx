import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5001/api';

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  suggestedActions?: string[];
}

interface ChatData {
  response: string;
  intent: string;
  suggestedActions?: string[];
  relatedTopics?: string[];
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      role: 'assistant',
      text: '🙏 Jai Kisan! Welcome to KrishiAI Chat.\n\nAsk me anything about farming — crop selection, disease treatment, market prices, fertilizer, government schemes, or irrigation tips.\n\nYou can type in English, Hindi, Punjabi, or any Indian language.',
      suggestedActions: ['What crops grow in Punjab?', 'My wheat leaves are yellowing', 'What is wheat MSP?', 'Show government schemes'],
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: ChatMessage = { id: Date.now(), role: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post<{ success: boolean; data: ChatData }>(`${API_BASE}/chat`, { query: text });
      const data = response.data.data;
      const botMessage: ChatMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        text: data.response,
        suggestedActions: data.suggestedActions,
      };
      setMessages(prev => [...prev, botMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        text: '❌ Sorry, I could not process your request. Please check your connection and try again.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  return (
    <div className="mx-auto max-w-4xl flex flex-col" style={{ height: 'calc(100vh - 180px)' }}>
      <header className="mb-4 flex-shrink-0">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">💬 KrishiAI Chat</h1>
        <p className="mt-1 text-sm text-slate-600 sm:text-base">
          Ask anything about farming in English, Hindi, or any Indian language.
        </p>
      </header>

      <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-md backdrop-blur-sm space-y-4 min-h-0">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
              {msg.role === 'assistant' && (
                <div className="mb-1 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-sm">🌾</span>
                  <span className="text-xs font-semibold text-emerald-700">KrishiAI</span>
                </div>
              )}
              <div
                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-sm'
                    : 'bg-slate-100 text-slate-800 rounded-tl-sm'
                }`}
              >
                {msg.text}
              </div>
              {msg.role === 'assistant' && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {msg.suggestedActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(action)}
                      className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[85%]">
              <div className="mb-1 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-sm">🌾</span>
                <span className="text-xs font-semibold text-emerald-700">KrishiAI</span>
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-3">
                <div className="flex gap-1 items-center">
                  <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="mt-3 flex gap-2 flex-shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about crops, diseases, prices, fertilizer... (English / हिंदी / ਪੰਜਾਬੀ)"
          disabled={loading}
          className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-3 font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? '⏳' : '📤'}
        </button>
      </form>
    </div>
  );
}
