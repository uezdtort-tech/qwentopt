import React, { useState } from 'react';
import { Bot, Send, Sparkles, Calculator, FileText, Search, AlertTriangle } from 'lucide-react';

interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const suggestions = [
  { icon: <Calculator className="w-4 h-4" />, text: 'Рассчитай себестоимость медовика на 12 порций' },
  { icon: <FileText className="w-4 h-4" />, text: 'Помоги написать описание для нового торта' },
  { icon: <AlertTriangle className="w-4 h-4" />, text: 'Каких ингредиентов не хватает для заказов?' },
  { icon: <Search className="w-4 h-4" />, text: 'Найди все заказы на эту неделю' },
];

const mockResponses: Record<string, string> = {
  'default': 'Я AI-помощник Conditera. Могу помочь с расчётом себестоимости, подсказать по рецептам, составить описание товара или проанализировать заказы. Чем могу помочь?',
  'себестоимость': 'На основе рецепта «Медовик классический»:\n\n• Ингредиенты: 593 ₽\n• Упаковка: ~80 ₽\n• Переменные расходы: ~50 ₽\n\n**Итого себестоимость: ~723 ₽**\n\nПри цене продажи 2 800 ₽:\n• Валовая маржа: 2 077 ₽ (74%)\n• Наценка: 287%\n\n⚠️ Трудозатраты не учтены. Рекомендуем добавить стоимость рабочего времени.',
  'ингредиентов': 'На основе текущих остатков и активных заказов:\n\n🔴 **Дефицит:**\n• Сметана 20% — 2 кг при мин. 2 кг (на грани)\n\n🟡 **Может закончиться:**\n• Масло сливочное — хватит на 3 заказа\n• Маскарпоне — хватит на 2 заказа\n\n💡 Рекомендую заказать сметану и масло в ближайшие 2 дня.',
  'описание': 'Вот вариант описания для вашего торта:\n\n---\n**Медовик классический**\n\nНежный многослойный торт с насыщенным медовым ароматом. Восемь тонких коржей, пропитанных сметанным кремом, тают во рту. Готовится по традиционному рецепту без искусственных добавок.\n\n• Вес: 1.2 кг\n• Порций: 8-10\n• Срок изготовления: 24 часа\n\nИдеален для семейных праздников и уютных чаепитий.\n---\n\nХотите, чтобы я адаптировал текст для конкретного повода?',
};

export function AIAssistantPage() {
  const [messages, setMessages] = useState<AIMessage[]>([
    { id: '1', role: 'assistant', content: 'Здравствуйте! Я AI-помощник Conditera. Могу помочь с рецептами, расчётом себестоимости, описанием товаров и анализом заказов. Что вас интересует?', timestamp: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);

  const getResponse = (query: string): string => {
    const lower = query.toLowerCase();
    if (lower.includes('себестоимость') || lower.includes('рассчитай')) return mockResponses['себестоимость'];
    if (lower.includes('дефицит') || lower.includes('ингредиент') || lower.includes('не хватает')) return mockResponses['ингредиентов'];
    if (lower.includes('описание') || lower.includes('напиши') || lower.includes('текст')) return mockResponses['описание'];
    return mockResponses['default'];
  };

  const handleSend = (text?: string) => {
    const message = text || input.trim();
    if (!message) return;

    const userMsg: AIMessage = { id: `u${Date.now()}`, role: 'user', content: message, timestamp: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setThinking(true);

    setTimeout(() => {
      const response = getResponse(message);
      const aiMsg: AIMessage = { id: `a${Date.now()}`, role: 'assistant', content: response, timestamp: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, aiMsg]);
      setThinking(false);
    }, 1200);
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-lavender/10 rounded-xl flex items-center justify-center">
          <Bot className="w-6 h-6 text-lavender" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-graphite">AI-помощник</h1>
          <p className="text-xs text-graphite-light">Локальный AI на базе Ollama · Модель не настроена — используется демо-режим</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chat */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-cream-dark overflow-hidden flex flex-col h-[600px]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-berry text-white rounded-br-md' : 'bg-cream-dark rounded-bl-md'}`}>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-1 mb-1.5">
                      <Sparkles className="w-3 h-3 text-lavender" />
                      <span className="text-[10px] text-lavender font-medium">Conditera AI</span>
                    </div>
                  )}
                  <div className="text-sm whitespace-pre-line">{msg.content}</div>
                  <p className={`text-[10px] mt-1.5 ${msg.role === 'user' ? 'text-white/60' : 'text-graphite-light'}`}>{msg.timestamp}</p>
                </div>
              </div>
            ))}
            {thinking && (
              <div className="flex justify-start">
                <div className="bg-cream-dark rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-lavender rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-lavender rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-lavender rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-cream-dark">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Спросите AI-помощника..."
                className="flex-1 px-4 py-2.5 bg-cream rounded-xl border border-cream-dark text-sm focus:outline-none focus:ring-2 focus:ring-berry/30"
              />
              <button onClick={() => handleSend()} disabled={!input.trim() || thinking} className="p-2.5 bg-lavender text-white rounded-xl hover:bg-lavender/80 transition-colors disabled:opacity-50">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-cream-dark p-5">
            <h3 className="font-semibold text-sm mb-3">Быстрые запросы</h3>
            <div className="space-y-2">
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => handleSend(s.text)} className="w-full flex items-center gap-2 p-2.5 rounded-lg text-left text-xs hover:bg-cream transition-colors border border-cream-dark">
                  <span className="text-lavender">{s.icon}</span>
                  <span className="text-graphite-light">{s.text}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-cream-dark p-5">
            <h3 className="font-semibold text-sm mb-3">Возможности</h3>
            <ul className="space-y-2 text-xs text-graphite-light">
              <li className="flex items-start gap-2"><span className="text-sage">✓</span> Расчёт себестоимости по рецепту</li>
              <li className="flex items-start gap-2"><span className="text-sage">✓</span> Пересчёт порций</li>
              <li className="flex items-start gap-2"><span className="text-sage">✓</span> Описание товаров</li>
              <li className="flex items-start gap-2"><span className="text-sage">✓</span> Анализ остатков</li>
              <li className="flex items-start gap-2"><span className="text-sage">✓</span> Сводка по заказам</li>
              <li className="flex items-start gap-2"><span className="text-gold">○</span> Ollama не подключена</li>
            </ul>
          </div>

          <div className="bg-gold/10 border border-gold/30 rounded-xl p-4">
            <p className="text-xs text-graphite">
              <strong>Демо-режим:</strong> Для работы с реальным AI подключите локальный Ollama. URL и модель настраиваются в конфигурации.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
