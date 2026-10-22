import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { products, categories } from '../data/mockData';
import { Search, SlidersHorizontal, Star, Clock } from 'lucide-react';

export function CatalogPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [sortBy, setSortBy] = useState('popular');

  const filtered = useMemo(() => {
    let result = products.filter(p => p.status === 'published');
    if (searchQuery) result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    if (selectedCategory !== 'Все') result = result.filter(p => p.category === selectedCategory);
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (sortBy === 'price_asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return result;
  }, [searchQuery, selectedCategory, priceRange, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-stone-800">Каталог тортов и десертов</h1>
        <p className="text-stone-600 mt-2">Найдите идеальный торт для любого повода</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Поиск по названию или описанию..." className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-500 text-sm" />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-stone-200 hover:border-rose-300 transition-colors text-sm font-medium">
          <SlidersHorizontal className="w-4 h-4" /> Фильтры
        </button>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-3 bg-white rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300">
          <option value="popular">По популярности</option>
          <option value="price_asc">Цена: по возрастанию</option>
          <option value="price_desc">Цена: по убыванию</option>
          <option value="rating">По рейтингу</option>
        </select>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6 animate-fade-in">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="text-sm font-medium text-stone-700 mb-2 block">Категория</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedCategory === cat ? 'bg-rose-600 text-white' : 'bg-stone-100 text-stone-600 hover:bg-rose-50'}`}>{cat}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-stone-700 mb-2 block">Цена до</label>
              <input type="range" min={0} max={50000} step={500} value={priceRange[1]} onChange={(e) => setPriceRange([0, Number(e.target.value)])} className="w-full accent-rose-600" />
              <p className="text-xs text-stone-500 mt-1">до {priceRange[1].toLocaleString()} ₽</p>
            </div>
          </div>
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-stone-500 mb-4">Найдено: {filtered.length} {filtered.length === 1 ? 'товар' : filtered.length < 5 ? 'товара' : 'товаров'}</p>

      {/* Products Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(product => (
            <Link key={product.id} to={`/product/${product.id}`} className="group bg-white rounded-2xl overflow-hidden border border-stone-200 hover:shadow-lg transition-all">
              <div className="aspect-[4/3] bg-stone-100 flex items-center justify-center relative">
                <span className="text-7xl group-hover:scale-110 transition-transform">{product.images[0]}</span>
                {!product.available && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-white/90 px-3 py-1 rounded-full text-sm font-medium">Нет в наличии</span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-stone-100 px-2 py-0.5 rounded-full text-stone-600">{product.category}</span>
                  {product.rating && <span className="text-xs flex items-center gap-0.5 text-amber-500"><Star className="w-3 h-3 fill-current" /> {product.rating}</span>}
                </div>
                <h3 className="font-semibold text-stone-800 group-hover:text-rose-600 transition-colors">{product.name}</h3>
                <p className="text-sm text-stone-500 mt-1 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg font-bold">{product.price.toLocaleString()} ₽</span>
                  <div className="flex items-center gap-1 text-xs text-stone-500"><Clock className="w-3 h-3" /> {product.prepTime}</div>
                </div>
                <p className="text-xs text-stone-500 mt-2">{product.seller} · {product.weight}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-stone-800 mb-2">Ничего не найдено</h3>
          <p className="text-stone-500 text-sm">Попробуйте изменить параметры поиска</p>
        </div>
      )}
    </div>
  );
}
