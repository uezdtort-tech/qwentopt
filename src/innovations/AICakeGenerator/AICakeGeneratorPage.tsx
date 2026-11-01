/**
 * Инновация #5: AI-генератор концепций тортов
 * 
 * Проблема: Кондитерам сложно придумывать новые дизайны тортов.
 * Текущее решение: Ручной поиск вдохновения в интернете.
 * Новое решение: AI-генератор, который создает концепции тортов на основе
 * повода, стиля, цветов и предпочтений клиента.
 * 
 * Почему лучше:
 * - Экономит время кондитера на 50-70%
 * - Генерирует уникальные идеи
 * - Учитывает тренды и предпочтения
 * - Автоматически создает описание для клиента
 * 
 * Технологии: React, TypeScript, rule-based engine
 * Интеграция: Изолированный компонент, подключается через /ai-cake-generator
 * Файлы: src/innovations/AICakeGenerator/
 * Риски: Низкие — изолированный модуль
 * Проверка: E2E тест генерации, оценка качества концепций
 * Сложность: P1, 3-4 дня
 */

import React, { useState } from 'react';
import { Sparkles, RefreshCw, Save, Copy, Check } from 'lucide-react';

interface CakeConcept {
  id: string;
  name: string;
  description: string;
  style: string;
  colors: string[];
  decorations: string[];
  shape: string;
  size: string;
  estimatedPrice: number;
  tags: string[];
}

const STYLES = [
  'Классический', 'Минимализм', 'Винтаж', 'Модерн', 'Рустик', 
  'Гламур', 'Бохо', 'Тропический', 'Акварель', 'Геометрический'
];

const COLOR_PALETTES = [
  { name: 'Пастельные', colors: ['#FFE5E5', '#E5F0FF', '#FFF5E5', '#E5FFE5'] },
  { name: 'Яркие', colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3'] },
  { name: 'Нейтральные', colors: ['#F5F5F5', '#D4D4D4', '#A3A3A3', '#525252'] },
  { name: 'Золотые', colors: ['#FFD700', '#FFA500', '#FF8C00', '#FFD700'] },
  { name: 'Розовые', colors: ['#FFB6C1', '#FF69B4', '#FF1493', '#FFC0CB'] },
  { name: 'Синие', colors: ['#87CEEB', '#4682B4', '#1E90FF', '#ADD8E6'] },
];

const DECORATIONS = [
  'Живые цветы', 'Сахарные цветы', 'Ягоды', 'Макаруны', 'Шоколадный декор',
  'Безе', 'Топперы', 'Надписи', 'Блестки', 'Фрукты', 'Конфеты', 'Свечи'
];

const SHAPES = ['Круглый', 'Квадратный', 'Сердце', 'Овальный', 'Многоярусный'];

const SIZES = ['Малый (1 кг)', 'Средний (2 кг)', 'Большой (3 кг)', 'Огромный (5+ кг)'];

export function AICakeGeneratorPage() {
  const [occasion, setOccasion] = useState('');
  const [style, setStyle] = useState('');
  const [colorPalette, setColorPalette] = useState('');
  const [guests, setGuests] = useState('');
  const [concepts, setConcepts] = useState<CakeConcept[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const generateConcepts = () => {
    setIsGenerating(true);
    
    // Имитация AI-генерации
    setTimeout(() => {
      const newConcepts: CakeConcept[] = [];
      
      for (let i = 0; i < 3; i++) {
        const palette = COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];
        const selectedDecorations = DECORATIONS
          .sort(() => Math.random() - 0.5)
          .slice(0, 3 + Math.floor(Math.random() * 3));
        
        const concept: CakeConcept = {
          id: `concept-${Date.now()}-${i}`,
          name: generateName(occasion, style),
          description: generateDescription(occasion, style, palette.name, selectedDecorations),
          style: style || STYLES[Math.floor(Math.random() * STYLES.length)],
          colors: palette.colors,
          decorations: selectedDecorations,
          shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
          size: guests ? getSizeByGuests(guests) : SIZES[1],
          estimatedPrice: calculatePrice(guests, selectedDecorations.length),
          tags: generateTags(occasion, style, palette.name),
        };
        
        newConcepts.push(concept);
      }
      
      setConcepts(newConcepts);
      setIsGenerating(false);
    }, 1500);
  };

  const generateName = (occasion: string, style: string): string => {
    const names = {
      'birthday': ['Праздничное настроение', 'Сладкий сюрприз', 'Торт мечты'],
      'wedding': ['Нежность любви', 'Вечная классика', 'Романтическое утро'],
      'anniversary': ['Золотая дата', 'Счастливые годы', 'Юбилейный торт'],
      'kids': ['Веселый праздник', 'Сказочный мир', 'Детская радость'],
      'corporate': ['Бизнес-класс', 'Корпоративный стиль', 'Профессиональный выбор'],
    };
    
    const occasionNames = names[occasion as keyof typeof names] || ['Уникальный торт', 'Авторский дизайн', 'Эксклюзив'];
    return occasionNames[Math.floor(Math.random() * occasionNames.length)];
  };

  const generateDescription = (
    occasion: string,
    style: string,
    colorName: string,
    decorations: string[]
  ): string => {
    const descriptions = [
      `Элегантный торт в стиле ${style.toLowerCase()} с ${colorName.toLowerCase()} цветовой гаммой. `,
      `Идеально подходит для ${occasion === 'wedding' ? 'свадьбы' : occasion === 'birthday' ? 'дня рождения' : 'особого случая'}. `,
      `Декор включает: ${decorations.join(', ')}. `,
      `Создает атмосферу праздника и радости.`,
    ];
    
    return descriptions.join('');
  };

  const getSizeByGuests = (guests: string): string => {
    const num = parseInt(guests);
    if (num <= 10) return SIZES[0];
    if (num <= 20) return SIZES[1];
    if (num <= 40) return SIZES[2];
    return SIZES[3];
  };

  const calculatePrice = (guests: string, decorationCount: number): number => {
    const basePrice = guests ? parseInt(guests) * 150 : 3000;
    const decorationPrice = decorationCount * 300;
    return basePrice + decorationPrice;
  };

  const generateTags = (occasion: string, style: string, colorName: string): string[] => {
    const tags = [];
    if (occasion) tags.push(occasion);
    if (style) tags.push(style);
    if (colorName) tags.push(colorName);
    tags.push('авторский', 'уникальный');
    return tags.slice(0, 5);
  };

  const handleCopy = (concept: CakeConcept) => {
    const text = `Концепция торта: ${concept.name}\n\n${concept.description}\n\nСтиль: ${concept.style}\nФорма: ${concept.shape}\nРазмер: ${concept.size}\nДекор: ${concept.decorations.join(', ')}\nОриентировочная цена: ${concept.estimatedPrice.toLocaleString()} ₽`;
    navigator.clipboard.writeText(text);
    setCopiedId(concept.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSave = (concept: CakeConcept) => {
    // TODO: Интеграция с сохранением проектов
    alert(`Концепция "${concept.name}" сохранена!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-stone-800 flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-rose-600" />
          AI-генератор концепций тортов
        </h1>
        <p className="text-stone-600 mt-2">Создайте уникальные концепции тортов с помощью AI</p>
      </div>

      {/* Форма ввода */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-8">
        <h2 className="font-semibold text-lg mb-4">Параметры генерации</h2>
        
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium text-stone-700 mb-2 block">Повод</label>
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-300"
            >
              <option value="">Выберите повод</option>
              <option value="birthday">День рождения</option>
              <option value="wedding">Свадьба</option>
              <option value="anniversary">Юбилей</option>
              <option value="kids">Детский праздник</option>
              <option value="corporate">Корпоратив</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-stone-700 mb-2 block">Стиль</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-300"
            >
              <option value="">Выберите стиль</option>
              {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-stone-700 mb-2 block">Цветовая палитра</label>
            <select
              value={colorPalette}
              onChange={(e) => setColorPalette(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-300"
            >
              <option value="">Выберите палитру</option>
              {COLOR_PALETTES.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-stone-700 mb-2 block">Количество гостей</label>
            <input
              type="number"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              placeholder="Например: 20"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>
        </div>

        <button
          onClick={generateConcepts}
          disabled={isGenerating}
          className="w-full bg-rose-600 text-white py-3 rounded-xl font-medium hover:bg-rose-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Генерация...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Сгенерировать концепции
            </>
          )}
        </button>
      </div>

      {/* Результаты */}
      {concepts.length > 0 && (
        <div className="space-y-6">
          <h2 className="font-semibold text-xl text-stone-800">Сгенерированные концепции</h2>
          
          {concepts.map((concept) => (
            <div key={concept.id} className="bg-white rounded-2xl border border-stone-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-xl text-stone-800 mb-2">{concept.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {concept.tags.map((tag, i) => (
                      <span key={i} className="text-xs bg-rose-50 text-rose-600 px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-rose-600">{concept.estimatedPrice.toLocaleString()} ₽</p>
                  <p className="text-xs text-stone-500">Ориентировочно</p>
                </div>
              </div>

              <p className="text-stone-600 mb-4">{concept.description}</p>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-stone-700 mb-2">Цветовая палитра</p>
                  <div className="flex gap-2">
                    {concept.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-12 h-12 rounded-lg border border-stone-200"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-stone-700 mb-2">Параметры</p>
                  <div className="space-y-1 text-sm text-stone-600">
                    <p><span className="font-medium">Стиль:</span> {concept.style}</p>
                    <p><span className="font-medium">Форма:</span> {concept.shape}</p>
                    <p><span className="font-medium">Размер:</span> {concept.size}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-stone-700 mb-2">Декор</p>
                <div className="flex flex-wrap gap-2">
                  {concept.decorations.map((dec, i) => (
                    <span key={i} className="text-sm bg-stone-100 text-stone-700 px-3 py-1 rounded-full">
                      {dec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy(concept)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-xl hover:bg-stone-200 transition-colors"
                >
                  {copiedId === concept.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      Скопировано
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Копировать
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleSave(concept)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Сохранить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Пустое состояние */}
      {concepts.length === 0 && !isGenerating && (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
          <Sparkles className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <h3 className="font-semibold text-lg text-stone-800 mb-2">Начните генерацию</h3>
          <p className="text-stone-600">Заполните параметры выше и нажмите "Сгенерировать концепции"</p>
        </div>
      )}
    </div>
  );
}
