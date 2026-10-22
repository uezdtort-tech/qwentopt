import React, { useState } from 'react';
import { inventory as initialInventory } from '../data/mockData';
import { AlertTriangle, Plus, ArrowUpCircle, ArrowDownCircle, Edit3 } from 'lucide-react';

export function InventoryPage() {
  const [items, setItems] = useState(initialInventory);
  const [showForm, setShowForm] = useState(false);

  const lowStock = items.filter(i => i.stock <= i.minStock);
  const totalValue = items.reduce((s, i) => s + i.stock * i.costPerUnit, 0);

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-graphite">Склад</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-berry text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-berry-dark transition-colors">
          <Plus className="w-4 h-4" /> Поступление
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-cream-dark p-4">
          <p className="text-xs text-graphite-light">Позиций</p>
          <p className="text-xl font-bold">{items.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-cream-dark p-4">
          <p className="text-xs text-graphite-light">Стоимость склада</p>
          <p className="text-xl font-bold">{totalValue.toLocaleString()} ₽</p>
        </div>
        <div className="bg-white rounded-xl border border-cream-dark p-4">
          <p className="text-xs text-graphite-light">Дефицит</p>
          <p className={`text-xl font-bold ${lowStock.length > 0 ? 'text-berry' : 'text-sage'}`}>{lowStock.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-cream-dark p-4">
          <p className="text-xs text-graphite-light">Обновлено</p>
          <p className="text-xl font-bold text-sm">Сегодня</p>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-graphite">Внимание: дефицит ингредиентов</p>
            <p className="text-xs text-graphite-light mt-1">{lowStock.map(i => i.name).join(', ')}</p>
          </div>
        </div>
      )}

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-cream-dark p-6 mb-6 animate-fade-in">
          <h3 className="font-semibold mb-4">Поступление на склад</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-graphite mb-1 block">Ингредиент</label>
              <select className="w-full px-3 py-2.5 rounded-lg border border-cream-dark text-sm focus:outline-none focus:ring-2 focus:ring-berry/30">
                {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-graphite mb-1 block">Количество</label>
              <input type="number" placeholder="0" className="w-full px-3 py-2.5 rounded-lg border border-cream-dark text-sm focus:outline-none focus:ring-2 focus:ring-berry/30" />
            </div>
            <div>
              <label className="text-sm font-medium text-graphite mb-1 block">Тип операции</label>
              <select className="w-full px-3 py-2.5 rounded-lg border border-cream-dark text-sm focus:outline-none focus:ring-2 focus:ring-berry/30">
                <option>Поступление</option>
                <option>Списание</option>
                <option>Корректировка</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="bg-berry text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-berry-dark">Провести</button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-lg text-sm font-medium border border-cream-dark hover:bg-cream">Отмена</button>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-cream-dark overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-dark bg-cream/50">
                <th className="text-left px-5 py-3 text-xs font-medium text-graphite-light uppercase">Ингредиент</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-graphite-light uppercase">Остаток</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-graphite-light uppercase">Мин. остаток</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-graphite-light uppercase">Цена за ед.</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-graphite-light uppercase">Стоимость</th>
                <th className="text-right px-5 py-3 text-xs font-medium text-graphite-light uppercase">Действия</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className={`border-b border-cream-dark last:border-0 ${item.stock <= item.minStock ? 'bg-berry/5' : ''}`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      {item.stock <= item.minStock && <AlertTriangle className="w-4 h-4 text-gold" />}
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className={`text-sm font-semibold ${item.stock <= item.minStock ? 'text-berry' : ''}`}>{item.stock} {item.unit}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right text-sm text-graphite-light">{item.minStock} {item.unit}</td>
                  <td className="px-5 py-3.5 text-right text-sm">{item.costPerUnit.toLocaleString()} ₽</td>
                  <td className="px-5 py-3.5 text-right text-sm font-medium">{(item.stock * item.costPerUnit).toLocaleString()} ₽</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-cream transition-colors" title="Поступление"><ArrowUpCircle className="w-4 h-4 text-sage" /></button>
                      <button className="p-1.5 rounded-lg hover:bg-cream transition-colors" title="Списание"><ArrowDownCircle className="w-4 h-4 text-berry" /></button>
                      <button className="p-1.5 rounded-lg hover:bg-cream transition-colors" title="Редактировать"><Edit3 className="w-4 h-4 text-graphite-light" /></button>
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
