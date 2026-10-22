import React, { useState } from 'react';
import { products as initialProducts, Product } from '../data/mockData';
import { Plus, Edit3, Archive, Eye, EyeOff, MoreVertical } from 'lucide-react';

export function ProductsPage() {
  const [productsList, setProductsList] = useState(initialProducts.filter(p => p.sellerId === 's1'));
  const [showForm, setShowForm] = useState(false);

  const toggleStatus = (id: string) => {
    setProductsList(prev => prev.map(p => p.id === id ? { ...p, status: p.status === 'published' ? 'draft' : 'published' } as Product : p));
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-graphite">Мои товары</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-berry text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-berry-dark transition-colors">
          <Plus className="w-4 h-4" /> Добавить товар
        </button>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-cream-dark p-6 mb-6 animate-fade-in">
          <h3 className="font-semibold mb-4">Новый товар</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-graphite mb-1 block">Название</label>
              <input type="text" placeholder="Например: Медовик классический" className="w-full px-3 py-2.5 rounded-lg border border-cream-dark text-sm focus:outline-none focus:ring-2 focus:ring-berry/30" />
            </div>
            <div>
              <label className="text-sm font-medium text-graphite mb-1 block">Категория</label>
              <select className="w-full px-3 py-2.5 rounded-lg border border-cream-dark text-sm focus:outline-none focus:ring-2 focus:ring-berry/30">
                <option>Торты</option><option>Пирожные</option><option>Свадебные</option><option>Детские</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-graphite mb-1 block">Цена (₽)</label>
              <input type="number" placeholder="2800" className="w-full px-3 py-2.5 rounded-lg border border-cream-dark text-sm focus:outline-none focus:ring-2 focus:ring-berry/30" />
            </div>
            <div>
              <label className="text-sm font-medium text-graphite mb-1 block">Вес</label>
              <input type="text" placeholder="1.2 кг" className="w-full px-3 py-2.5 rounded-lg border border-cream-dark text-sm focus:outline-none focus:ring-2 focus:ring-berry/30" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-graphite mb-1 block">Описание</label>
              <textarea rows={3} placeholder="Опишите ваш торт..." className="w-full px-3 py-2.5 rounded-lg border border-cream-dark text-sm focus:outline-none focus:ring-2 focus:ring-berry/30 resize-none" />
            </div>
            <div>
              <label className="text-sm font-medium text-graphite mb-1 block">Срок изготовления</label>
              <input type="text" placeholder="24 часа" className="w-full px-3 py-2.5 rounded-lg border border-cream-dark text-sm focus:outline-none focus:ring-2 focus:ring-berry/30" />
            </div>
            <div>
              <label className="text-sm font-medium text-graphite mb-1 block">Количество порций</label>
              <input type="number" placeholder="8" className="w-full px-3 py-2.5 rounded-lg border border-cream-dark text-sm focus:outline-none focus:ring-2 focus:ring-berry/30" />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button className="bg-berry text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-berry-dark">Сохранить</button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-lg text-sm font-medium border border-cream-dark hover:bg-cream">Отмена</button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-cream-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-dark bg-cream/50">
                <th className="text-left px-5 py-3 text-xs font-medium text-graphite-light uppercase">Товар</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-graphite-light uppercase">Категория</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-graphite-light uppercase">Цена</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-graphite-light uppercase">Статус</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-graphite-light uppercase">Действия</th>
              </tr>
            </thead>
            <tbody>
              {productsList.map(product => (
                <tr key={product.id} className="border-b border-cream-dark last:border-0 hover:bg-cream/30">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-cream-dark rounded-lg flex items-center justify-center text-xl">{product.images[0]}</div>
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-graphite-light">{product.weight} · {product.portions} порц.</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-graphite-light">{product.category}</td>
                  <td className="px-5 py-4 text-sm font-semibold">{product.price.toLocaleString()} ₽</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${product.status === 'published' ? 'bg-sage/10 text-sage' : product.status === 'draft' ? 'bg-gold/10 text-gold' : 'bg-gray-100 text-gray-500'}`}>
                      {product.status === 'published' ? 'Опубликован' : product.status === 'draft' ? 'Черновик' : 'Архив'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => toggleStatus(product.id)} className="p-1.5 rounded-lg hover:bg-cream transition-colors" title={product.status === 'published' ? 'Скрыть' : 'Опубликовать'}>
                        {product.status === 'published' ? <EyeOff className="w-4 h-4 text-graphite-light" /> : <Eye className="w-4 h-4 text-graphite-light" />}
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-cream transition-colors" title="Редактировать">
                        <Edit3 className="w-4 h-4 text-graphite-light" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
