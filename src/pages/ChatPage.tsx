import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Send, User, Bot } from 'lucide-react';

export function ChatPage() {
  const { messages, sendMessage } = useApp();
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setSending(true);
    sendMessage(input.trim());
    setInput('');
    setTimeout(() => setSending(false), 500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="bg-white rounded-2xl border border-cream-dark overflow-hidden flex flex-col h-[calc(100vh-200px)]">
        {/* Chat Header */}
        <div className="p-4 border-b border-cream-dark flex items-center gap-3">
          <div className="w-10 h-10 bg-sage rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">А</span>
          </div>
          <div>
            <h2 className="font-semibold text-sm">Анна Пекарская</h2>
            <p className="text-xs text-sage">● Онлайн</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                msg.sender === 'user' 
                  ? 'bg-berry text-white rounded-br-md' 
                  : msg.isAI 
                    ? 'bg-lavender/10 border border-lavender/30 rounded-bl-md'
                    : 'bg-cream-dark rounded-bl-md'
              }`}>
                {msg.isAI && (
                  <div className="flex items-center gap-1 mb-1">
                    <Bot className="w-3 h-3 text-lavender" />
                    <span className="text-[10px] text-lavender font-medium">AI-помощник</span>
                  </div>
                )}
                <p className="text-sm">{msg.text}</p>
                <p className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-graphite-light'}`}>{msg.time}</p>
              </div>
            </div>
          ))}
          {sending && (
            <div className="flex justify-end">
              <div className="bg-berry/20 rounded-2xl px-4 py-2.5 rounded-br-md">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-berry rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-berry rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-berry rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-cream-dark">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Напишите сообщение..."
              className="flex-1 px-4 py-2.5 bg-cream rounded-xl border border-cream-dark text-sm focus:outline-none focus:ring-2 focus:ring-berry/30 focus:border-berry"
            />
            <button onClick={handleSend} disabled={!input.trim()} className="p-2.5 bg-berry text-white rounded-xl hover:bg-berry-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-[10px] text-graphite-light mt-2 text-center">Сообщения сохраняются в базе данных. Поддержка real-time при наличии инфраструктуры.</p>
        </div>
      </div>
    </div>
  );
}
