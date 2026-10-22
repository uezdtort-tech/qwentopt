import React, { useState } from 'react';
import { b2bPartners } from '../data/mockData';
import { Search, MapPin, Star, ArrowRight, Briefcase, Package, Camera, Flower, Music, Truck } from 'lucide-react';

const b2bCategories = [
  { name: 'Поставщики ингредиентов', icon: <Package className="w-5 h-5" />, count: 12 },
  { name: 'Поставщики упаковки', icon: <Truck className="w-5 h-5" />, count: 8 },
  { name: 'Флористы', icon: <Flower className="w-5 h-5" />, count: 5 },
  { name: 'Организаторы мероприятий', icon: <Briefcase className="w-5 h-5" />, count: 7 },
  { name: 'Фотографы и видеографы', icon: <Camera className="w-5 h-5" />, count: 10 },
  { name: 'Ведущие и аниматоры', icon: <Music className="w-5 h-5" />, count: 6 },
];

export function B2BPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filtered = b2bPartners.filter(p => {
    if (selectedCategory && p.category !== selectedCategory) return false;
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-graphite">Профессиональные партнёры</h1>
        <p className="text-graphite-light mt-2">Найдите поставщиков, флористов, фотографов и других специалистов для вашего бизнеса</p>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {b2bCategories.map(cat => (
          <button key={cat.name} onClick={() => setSelectedCategory(selectedCategory === cat.name ? '' : cat.name)} className={`p-4 rounded-xl border text-center transition-all ${selectedCategory === cat.name ? 'border-berry bg-berry/5' : 'border-cream-dark bg-white hover:border-berry/30'}`}>
            <div className={`mx-auto mb-2 ${selectedCategory === cat.name ? 'text-berry' : 'text-graphite-light'}`}>{cat.icon}</div>
            <p className="text-xs font-medium">{cat.name}</p>
            <p className="text-[10px] text-graphite-light mt-0.5">{cat.count} партнёров</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-graphite-light" />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Поиск партнёров..." className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-cream-dark text-sm focus:outline-none focus:ring-2 focus:ring-berry/30" />
      </div>

      {/* Partners Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(partner => (
          <div key={partner.id} className="bg-white rounded-xl border border-cream-dark p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-lavender/10 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-lavender" />
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${partner.status === 'active' ? 'bg-sage/10 text-sage' : partner.status === 'pending' ? 'bg-gold/10 text-gold' : 'bg-red-100 text-red-500'}`}>
                {partner.status === 'active' ? 'Активен' : partner.status === 'pending' ? 'На проверке' : 'Приостановлен'}
              </span>
            </div>
            <h3 className="font-semibold text-sm">{partner.name}</h3>
            <p className="text-xs text-graphite-light mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{partner.region}</p>
            <p className="text-xs text-graphite-light mt-2 line-clamp-2">{partner.description}</p>
            <p className="text-xs text-berry mt-3">{partner.category}</p>
            <button className="mt-3 w-full py-2 border border-cream-dark rounded-lg text-xs font-medium hover:border-berry/30 hover:text-berry transition-colors">Связаться</button>
          </div>
        ))}
      </div>

      {/* Quote Request CTA */}
      <div className="mt-12 bg-gradient-to-r from-graphite to-graphite-light rounded-2xl p-8 text-white text-center">
        <h2 className="font-display text-2xl font-bold mb-3">Нужен профессиональный запрос?</h2>
        <p className="text-gray-300 text-sm mb-6 max-w-lg mx-auto">Создайте запрос на тендер — партнёры сами предложат свои условия</p>
        <button className="bg-berry text-white px-6 py-3 rounded-xl font-medium hover:bg-berry-dark transition-colors inline-flex items-center gap-2">
          Создать запрос <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
