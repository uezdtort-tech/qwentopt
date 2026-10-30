import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Package, DollarSign, Clock, AlertTriangle, Plus, CheckCircle, Circle, Calendar, Users, Shield, BarChart3, Heart, User } from 'lucide-react';
import { useStore, useCurrentUser } from './store';

// ==================== DASHBOARD OVERVIEW ====================
export function DashboardOverview() {
  const { store } = useStore();
  const currentUser = useCurrentUser();
  if (!currentUser) return <div className="p-6 text-center"><Link to="/auth" className="text-rose-600">Войти</Link></div>;

  const role = currentUser.role;

  if (role === 'confectioner') {
    const myOrders = store.orders.filter(o => o.sellerId === currentUser.id);
    const newOrders = myOrders.filter(o => o.status === 'new');
    const activeOrders = myOrders.filter(o => ['accepted', 'in_production'].includes(o.status));
    const revenue = myOrders.filter(o => o.status === 'completed').reduce((s, o) => s + o.total, 0);
    const lowStock = store.inventory.filter(i => i.ownerId === currentUser.id && i.stock <= i.minStock);

    return (
      <div className="p-6">
        <h1 className="font-display text-2xl font-bold mb-2">Добро пожаловать, {currentUser.name.split(' ')[0]}!</h1>
        <p className="text-stone-600 text-sm mb-6">Обзор вашего бизнеса</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-stone-200 p-5"><div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center mb-3"><Package className="w-5 h-5 text-rose-600" /></div><p className="text-2xl font-bold">{newOrders.length}</p><p className="text-xs text-stone-500">Новые заказы</p></div>
          <div className="bg-white rounded-xl border border-stone-200 p-5"><div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-3"><Clock className="w-5 h-5 text-amber-600" /></div><p className="text-2xl font-bold">{activeOrders.length}</p><p className="text-xs text-stone-500">В производстве</p></div>
          <div className="bg-white rounded-xl border border-stone-200 p-5"><div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-3"><DollarSign className="w-5 h-5 text-emerald-600" /></div><p className="text-2xl font-bold">{revenue.toLocaleString()} ₽</p><p className="text-xs text-stone-500">Выручка</p></div>
          <div className="bg-white rounded-xl border border-stone-200 p-5"><div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3"><Package className="w-5 h-5 text-purple-600" /></div><p className="text-2xl font-bold">{store.products.filter(p => p.sellerId === currentUser.id && p.available).length}</p><p className="text-xs text-stone-500">Товаров</p></div>
        </div>
        {lowStock.length > 0 && <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3"><AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" /><div><p className="text-sm font-medium">Дефицит ингредиентов</p><p className="text-xs text-stone-600 mt-1">{lowStock.map(i => i.name).join(', ')}</p></div></div>}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h2 className="font-semibold mb-4">Последние заказы</h2>
          <div className="space-y-2">
            {myOrders.slice(0, 5).map(o => (
              <div key={o.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-stone-50">
                <div><p className="text-sm font-medium">{o.productName}</p><p className="text-xs text-stone-500">{o.createdAt}</p></div>
                <div className="text-right"><p className="text-sm font-semibold">{o.total.toLocaleString()} ₽</p><span className={`text-xs px-2 py-0.5 rounded-full ${o.status === 'new' ? 'bg-rose-100 text-rose-600' : o.status === 'completed' ? 'bg-stone-100 text-stone-600' : 'bg-amber-100 text-amber-600'}`}>{o.status}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (role === 'client') {
    const myOrders = store.orders.filter(o => o.buyerId === currentUser.id);
    return (
      <div className="p-6">
        <h1 className="font-display text-2xl font-bold mb-2">Мой кабинет</h1>
        <p className="text-stone-600 text-sm mb-6">{currentUser.name}</p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-stone-200 p-5"><p className="text-2xl font-bold">{myOrders.length}</p><p className="text-xs text-stone-500">Заказов</p></div>
          <div className="bg-white rounded-xl border border-stone-200 p-5"><p className="text-2xl font-bold">{myOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length}</p><p className="text-xs text-stone-500">Активных</p></div>
          <div className="bg-white rounded-xl border border-stone-200 p-5"><p className="text-2xl font-bold">{myOrders.reduce((s, o) => s + o.total, 0).toLocaleString()} ₽</p><p className="text-xs text-stone-500">Потрачено</p></div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h2 className="font-semibold mb-4">Мои заказы</h2>
          <div className="space-y-2">
            {myOrders.map(o => (
              <div key={o.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-stone-50">
                <div><p className="text-sm font-medium">{o.productName}</p><p className="text-xs text-stone-500">{o.id} · {o.deliveryDate}</p></div>
                <div className="text-right"><p className="text-sm font-semibold">{o.total.toLocaleString()} ₽</p><span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-600">{o.status}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (role === 'admin') {
    return (
      <div className="p-6">
        <h1 className="font-display text-2xl font-bold mb-2">Админ-панель</h1>
        <p className="text-stone-600 text-sm mb-6">Управление платформой</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-stone-200 p-5"><p className="text-2xl font-bold">{store.users.length}</p><p className="text-xs text-stone-500">Пользователей</p></div>
          <div className="bg-white rounded-xl border border-stone-200 p-5"><p className="text-2xl font-bold">{store.products.length}</p><p className="text-xs text-stone-500">Товаров</p></div>
          <div className="bg-white rounded-xl border border-stone-200 p-5"><p className="text-2xl font-bold">{store.orders.length}</p><p className="text-xs text-stone-500">Заказов</p></div>
          <div className="bg-white rounded-xl border border-stone-200 p-5"><p className="text-2xl font-bold">{store.orders.reduce((s, o) => s + o.total, 0).toLocaleString()} ₽</p><p className="text-xs text-stone-500">Оборот</p></div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h2 className="font-semibold mb-4">Последние заказы</h2>
          <div className="space-y-2">
            {store.orders.slice(0, 10).map(o => {
              const buyer = store.users.find(u => u.id === o.buyerId);
              return (
                <div key={o.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-stone-50">
                  <div><p className="text-sm font-medium">{o.productName}</p><p className="text-xs text-stone-500">{buyer?.name} · {o.id}</p></div>
                  <div className="text-right"><p className="text-sm font-semibold">{o.total.toLocaleString()} ₽</p><span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-600">{o.status}</span></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="font-display text-2xl font-bold mb-2">Кабинет</h1>
      <p className="text-stone-600 text-sm mb-6">{currentUser.name} · {currentUser.role}</p>
      <div className="bg-white rounded-xl border border-stone-200 p-8 text-center">
        <div className="text-5xl mb-4">👋</div>
        <h3 className="font-semibold mb-2">Добро пожаловать!</h3>
        <p className="text-sm text-stone-500">Используйте боковое меню для навигации.</p>
      </div>
    </div>
  );
}

// ==================== DASHBOARD ORDERS ====================
export function DashboardOrders() {
  const { store, setStore } = useStore();
  const currentUser = useCurrentUser();
  if (!currentUser) return null;

  const myOrders = currentUser.role === 'admin' ? store.orders : currentUser.role === 'confectioner' ? store.orders.filter(o => o.sellerId === currentUser.id) : store.orders.filter(o => o.buyerId === currentUser.id);

  const statusLabels: Record<string, string> = { new: 'Новый', accepted: 'Принят', in_production: 'Готовится', ready: 'Готов', completed: 'Завершён', cancelled: 'Отменён' };

  return (
    <div className="p-6">
      <h1 className="font-display text-2xl font-bold mb-6">Заказы</h1>
      <div className="space-y-3">
        {myOrders.map(order => {
          const buyer = store.users.find(u => u.id === order.buyerId);
          return (
            <div key={order.id} className="bg-white rounded-xl border border-stone-200 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-stone-500">{order.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${order.status === 'new' ? 'bg-rose-100 text-rose-600' : order.status === 'completed' ? 'bg-stone-100 text-stone-600' : 'bg-amber-100 text-amber-600'}`}>{statusLabels[order.status]}</span>
                  </div>
                  <h3 className="font-semibold">{order.productName}</h3>
                  <p className="text-sm text-stone-500">{buyer?.name} · Доставка: {order.deliveryDate}</p>
                  {order.notes && <p className="text-xs text-stone-500 italic mt-1">«{order.notes}»</p>}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-lg font-bold">{order.total.toLocaleString()} ₽</span>
                  {currentUser.role === 'confectioner' && order.status === 'new' && (
                    <div className="flex gap-2">
                      <button onClick={() => setStore(s => ({ ...s, orders: s.orders.map(o => o.id === order.id ? { ...o, status: 'accepted' } : o) }))} className="px-3 py-1.5 bg-emerald-600 text-white text-xs rounded-lg">Принять</button>
                      <button onClick={() => setStore(s => ({ ...s, orders: s.orders.map(o => o.id === order.id ? { ...o, status: 'cancelled' } : o) }))} className="px-3 py-1.5 bg-stone-200 text-stone-700 text-xs rounded-lg">Отклонить</button>
                    </div>
                  )}
                  {currentUser.role === 'confectioner' && order.status === 'accepted' && <button onClick={() => setStore(s => ({ ...s, orders: s.orders.map(o => o.id === order.id ? { ...o, status: 'in_production' } : o) }))} className="px-3 py-1.5 bg-amber-500 text-white text-xs rounded-lg">Начать готовить</button>}
                  {currentUser.role === 'confectioner' && order.status === 'in_production' && <button onClick={() => setStore(s => ({ ...s, orders: s.orders.map(o => o.id === order.id ? { ...o, status: 'ready' } : o) }))} className="px-3 py-1.5 bg-purple-600 text-white text-xs rounded-lg">Готов</button>}
                  {currentUser.role === 'confectioner' && order.status === 'ready' && <button onClick={() => setStore(s => ({ ...s, orders: s.orders.map(o => o.id === order.id ? { ...o, status: 'completed' } : o) }))} className="px-3 py-1.5 bg-stone-800 text-white text-xs rounded-lg">Выдан</button>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {myOrders.length === 0 && <div className="text-center py-16"><div className="text-5xl mb-4">📋</div><h3 className="text-lg font-semibold mb-2">Нет заказов</h3></div>}
    </div>
  );
}

// ==================== DASHBOARD PRODUCTS ====================
export function DashboardProducts() {
  const { store, setStore } = useStore();
  const currentUser = useCurrentUser();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', category: 'Торты', price: 0, weight: '', portions: 1, prepTime: '', emoji: '🎂', allergens: [] as string[], available: true });

  if (!currentUser) return null;
  const myProducts = store.products.filter(p => p.sellerId === currentUser.id);

  const handleAdd = () => {
    if (!form.name || !form.price) return;
    setStore(s => ({ ...s, products: [...s.products, { ...form, id: 'p' + Date.now(), sellerId: currentUser.id, rating: 0 }] }));
    setShowForm(false);
    setForm({ name: '', description: '', category: 'Торты', price: 0, weight: '', portions: 1, prepTime: '', emoji: '🎂', allergens: [], available: true });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Мои товары</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-rose-700"><Plus className="w-4 h-4" /> Добавить</button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6 animate-fade-in">
          <h3 className="font-semibold mb-4">Новый товар</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Название" className="px-3 py-2 rounded-lg border border-stone-200 text-sm" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-3 py-2 rounded-lg border border-stone-200 text-sm">
              <option>Торты</option><option>Пирожные</option><option>Свадебные</option><option>Детские</option><option>Декор</option>
            </select>
            <input type="number" value={form.price || ''} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} placeholder="Цена" className="px-3 py-2 rounded-lg border border-stone-200 text-sm" />
            <input type="text" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} placeholder="Вес" className="px-3 py-2 rounded-lg border border-stone-200 text-sm" />
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Описание" rows={2} className="sm:col-span-2 px-3 py-2 rounded-lg border border-stone-200 text-sm resize-none" />
          </div>
          <div className="flex gap-3 mt-4"><button onClick={handleAdd} className="bg-rose-600 text-white px-5 py-2 rounded-lg text-sm font-medium">Сохранить</button><button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-lg text-sm border border-stone-200">Отмена</button></div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-stone-200 bg-stone-50"><th className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase">Товар</th><th className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase">Категория</th><th className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase">Цена</th><th className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase">Статус</th></tr></thead>
          <tbody>
            {myProducts.map(p => (
              <tr key={p.id} className="border-b border-stone-200 last:border-0 hover:bg-stone-50">
                <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center text-xl">{p.emoji}</div><div><p className="font-medium text-sm">{p.name}</p><p className="text-xs text-stone-500">{p.weight}</p></div></div></td>
                <td className="px-5 py-4 text-sm text-stone-500">{p.category}</td>
                <td className="px-5 py-4 text-sm font-semibold">{p.price.toLocaleString()} ₽</td>
                <td className="px-5 py-4"><span className={`text-xs px-2 py-1 rounded-full font-medium ${p.available ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>{p.available ? 'Опубликован' : 'Черновик'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== DASHBOARD RECIPES ====================
export function DashboardRecipes() {
  const { store, setStore } = useStore();
  const currentUser = useCurrentUser();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', ingredients: [{ name: '', amount: 0, unit: 'г', cost: 0 }] });

  if (!currentUser) return null;
  const myRecipes = store.recipes.filter(r => r.confectionerId === currentUser.id);
  const totalCost = (r: any) => r.ingredients.reduce((s: number, i: any) => s + i.cost, 0);

  const handleAdd = () => {
    if (!form.name) return;
    setStore(s => ({ ...s, recipes: [...s.recipes, { id: 'r' + Date.now(), confectionerId: currentUser.id, ...form }] }));
    setShowForm(false);
    setForm({ name: '', ingredients: [{ name: '', amount: 0, unit: 'г', cost: 0 }] });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Рецептуры</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-rose-700"><Plus className="w-4 h-4" /> Новый рецепт</button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6 animate-fade-in">
          <h3 className="font-semibold mb-4">Новый рецепт</h3>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Название" className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm mb-4" />
          <div className="flex gap-3"><button onClick={handleAdd} className="bg-rose-600 text-white px-5 py-2 rounded-lg text-sm font-medium">Сохранить</button><button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-lg text-sm border border-stone-200">Отмена</button></div>
        </div>
      )}

      <div className="space-y-4">
        {myRecipes.map(r => (
          <div key={r.id} className="bg-white rounded-xl border border-stone-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{r.name}</h3>
              <div className="text-right"><p className="text-sm font-bold">{totalCost(r).toLocaleString()} ₽</p><p className="text-xs text-stone-500">себестоимость</p></div>
            </div>
            <table className="w-full"><tbody>{r.ingredients.map((ing, i) => <tr key={i} className="border-t border-stone-100"><td className="py-2 text-sm">{ing.name}</td><td className="py-2 text-sm text-right text-stone-500">{ing.amount} {ing.unit}</td><td className="py-2 text-sm text-right font-medium">{ing.cost} ₽</td></tr>)}</tbody></table>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== DASHBOARD INVENTORY ====================
export function DashboardInventory() {
  const { store, setStore } = useStore();
  const currentUser = useCurrentUser();
  if (!currentUser) return null;
  const myItems = store.inventory.filter(i => i.ownerId === currentUser.id);
  const lowStock = myItems.filter(i => i.stock <= i.minStock);

  return (
    <div className="p-6">
      <h1 className="font-display text-2xl font-bold mb-6">Склад</h1>
      {lowStock.length > 0 && <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3"><AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" /><div><p className="text-sm font-medium">Дефицит</p><p className="text-xs text-stone-600 mt-1">{lowStock.map(i => i.name).join(', ')}</p></div></div>}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-stone-200 bg-stone-50"><th className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase">Ингредиент</th><th className="text-right px-5 py-3 text-xs font-medium text-stone-500 uppercase">Остаток</th><th className="text-right px-5 py-3 text-xs font-medium text-stone-500 uppercase">Мин.</th><th className="text-right px-5 py-3 text-xs font-medium text-stone-500 uppercase">Действия</th></tr></thead>
          <tbody>
            {myItems.map(item => (
              <tr key={item.id} className={`border-b border-stone-200 last:border-0 ${item.stock <= item.minStock ? 'bg-rose-50' : ''}`}>
                <td className="px-5 py-3.5"><div className="flex items-center gap-2">{item.stock <= item.minStock && <AlertTriangle className="w-4 h-4 text-amber-600" />}<span className="text-sm font-medium">{item.name}</span></div></td>
                <td className="px-5 py-3.5 text-right"><span className={`text-sm font-semibold ${item.stock <= item.minStock ? 'text-rose-600' : ''}`}>{item.stock} {item.unit}</span></td>
                <td className="px-5 py-3.5 text-right text-sm text-stone-500">{item.minStock} {item.unit}</td>
                <td className="px-5 py-3.5 text-right"><div className="flex items-center justify-end gap-1"><button onClick={() => setStore(s => ({ ...s, inventory: s.inventory.map(i => i.id === item.id ? { ...i, stock: i.stock + 1 } : i) }))} className="p-1.5 rounded-lg hover:bg-stone-100 text-emerald-600">+</button><button onClick={() => setStore(s => ({ ...s, inventory: s.inventory.map(i => i.id === item.id ? { ...i, stock: Math.max(0, i.stock - 1) } : i) }))} className="p-1.5 rounded-lg hover:bg-stone-100 text-rose-600">−</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== DASHBOARD FINANCE ====================
export function DashboardFinance() {
  const { store } = useStore();
  const currentUser = useCurrentUser();
  if (!currentUser) return null;
  const myOrders = currentUser.role === 'confectioner' ? store.orders.filter(o => o.sellerId === currentUser.id) : store.orders.filter(o => o.buyerId === currentUser.id);
  const completed = myOrders.filter(o => o.status === 'completed');
  const revenue = completed.reduce((s, o) => s + o.total, 0);
  const commission = Math.round(revenue * 0.08);

  return (
    <div className="p-6">
      <h1 className="font-display text-2xl font-bold mb-6">Финансы</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-stone-200 p-5"><p className="text-xs text-stone-500 mb-2">Выручка</p><p className="text-2xl font-bold">{revenue.toLocaleString()} ₽</p></div>
        <div className="bg-white rounded-xl border border-stone-200 p-5"><p className="text-xs text-stone-500 mb-2">Комиссия (8%)</p><p className="text-2xl font-bold">{commission.toLocaleString()} ₽</p></div>
        <div className="bg-white rounded-xl border border-stone-200 p-5"><p className="text-xs text-stone-500 mb-2">К выплате</p><p className="text-2xl font-bold text-emerald-600">{(revenue - commission).toLocaleString()} ₽</p></div>
        <div className="bg-white rounded-xl border border-stone-200 p-5"><p className="text-xs text-stone-500 mb-2">Заказов</p><p className="text-2xl font-bold">{completed.length}</p></div>
      </div>
    </div>
  );
}

// ==================== DASHBOARD CUSTOMERS ====================
export function DashboardCustomers() {
  const { store } = useStore();
  const currentUser = useCurrentUser();
  if (!currentUser) return null;
  const myOrders = store.orders.filter(o => o.sellerId === currentUser.id);
  const buyerIds = [...new Set(myOrders.map(o => o.buyerId))];
  const myCustomers = buyerIds.map(id => store.users.find(u => u.id === id)).filter(Boolean) as any[];

  return (
    <div className="p-6">
      <h1 className="font-display text-2xl font-bold mb-6">Клиенты</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {myCustomers.map((c: any) => {
          const customerOrders = myOrders.filter(o => o.buyerId === c.id);
          return (
            <div key={c.id} className="bg-white rounded-xl border border-stone-200 p-5">
              <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-700 rounded-full flex items-center justify-center"><span className="text-white font-bold text-sm">{c.name.charAt(0)}</span></div><div><h3 className="font-semibold text-sm">{c.name}</h3><p className="text-xs text-stone-500">{c.email}</p></div></div>
              <div className="flex items-center justify-between pt-3 border-t border-stone-200"><div className="text-center"><p className="text-sm font-bold">{customerOrders.length}</p><p className="text-[10px] text-stone-500">заказов</p></div><div className="text-center"><p className="text-sm font-bold">{customerOrders.reduce((s, o) => s + o.total, 0).toLocaleString()} ₽</p><p className="text-[10px] text-stone-500">потрачено</p></div></div>
            </div>
          );
        })}
      </div>
      {myCustomers.length === 0 && <div className="text-center py-16"><div className="text-5xl mb-4">👥</div><h3 className="text-lg font-semibold mb-2">Нет клиентов</h3></div>}
    </div>
  );
}

// ==================== DASHBOARD PRODUCTION ====================
export function DashboardProduction() {
  const { store } = useStore();
  const currentUser = useCurrentUser();
  if (!currentUser) return null;
  const activeOrders = store.orders.filter(o => o.sellerId === currentUser.id && ['accepted', 'in_production', 'ready'].includes(o.status));

  return (
    <div className="p-6">
      <h1 className="font-display text-2xl font-bold mb-6">Производственный календарь</h1>
      <div className="space-y-3">
        {activeOrders.map(o => (
          <div key={o.id} className="bg-white rounded-xl border border-stone-200 p-5">
            <div className="flex items-center justify-between">
              <div><p className="font-semibold">{o.productName}</p><p className="text-sm text-stone-500">Доставка: {o.deliveryDate}</p></div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${o.status === 'accepted' ? 'bg-amber-100 text-amber-600' : o.status === 'in_production' ? 'bg-purple-100 text-purple-600' : 'bg-emerald-100 text-emerald-600'}`}>{o.status === 'accepted' ? 'Принят' : o.status === 'in_production' ? 'Готовится' : 'Готов'}</span>
            </div>
          </div>
        ))}
      </div>
      {activeOrders.length === 0 && <div className="text-center py-16"><div className="text-5xl mb-4">📅</div><h3 className="text-lg font-semibold mb-2">Нет активных заказов</h3></div>}
    </div>
  );
}

// ==================== DASHBOARD USERS (ADMIN) ====================
export function DashboardUsers() {
  const { store } = useStore();
  const roleNames: Record<string, string> = { client: 'Клиент', confectioner: 'Кондитер', supplier: 'Поставщик', decorator: 'Декоратор', animator: 'Аниматор', organizer: 'Организатор', admin: 'Админ' };

  return (
    <div className="p-6">
      <h1 className="font-display text-2xl font-bold mb-6">Пользователи</h1>
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-stone-200 bg-stone-50"><th className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase">Имя</th><th className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase">Email</th><th className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase">Роль</th><th className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase">Город</th></tr></thead>
          <tbody>
            {store.users.map(u => (
              <tr key={u.id} className="border-b border-stone-200 last:border-0 hover:bg-stone-50">
                <td className="px-5 py-3.5"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-700 rounded-full flex items-center justify-center"><span className="text-white font-bold text-xs">{u.name.charAt(0)}</span></div><span className="text-sm font-medium">{u.name}</span></div></td>
                <td className="px-5 py-3.5 text-sm text-stone-500">{u.email}</td>
                <td className="px-5 py-3.5"><span className="text-xs px-2 py-1 rounded-full bg-stone-100 text-stone-600">{roleNames[u.role]}</span></td>
                <td className="px-5 py-3.5 text-sm text-stone-500">{u.city || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== PLACEHOLDER PAGES ====================
export function DashboardFavorites() {
  return <div className="p-6"><h1 className="font-display text-2xl font-bold mb-6">Избранное</h1><div className="text-center py-16"><div className="text-5xl mb-4">❤️</div><p className="text-stone-500">Нет избранных товаров</p></div></div>;
}

export function DashboardProfile() {
  const currentUser = useCurrentUser();
  if (!currentUser) return null;
  return (
    <div className="p-6">
      <h1 className="font-display text-2xl font-bold mb-6">Профиль</h1>
      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-rose-700 rounded-full flex items-center justify-center"><span className="text-white font-bold text-2xl">{currentUser.name.charAt(0)}</span></div>
          <div><h2 className="text-xl font-bold">{currentUser.name}</h2><p className="text-stone-500">{currentUser.email}</p><p className="text-sm text-rose-600 mt-1">{currentUser.role}</p></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><p className="text-xs text-stone-500">Телефон</p><p className="font-medium">{currentUser.phone || 'Не указан'}</p></div>
          <div><p className="text-xs text-stone-500">Город</p><p className="font-medium">{currentUser.city || 'Не указан'}</p></div>
          <div className="sm:col-span-2"><p className="text-xs text-stone-500">О себе</p><p className="font-medium">{currentUser.about || 'Не указано'}</p></div>
        </div>
      </div>
    </div>
  );
}

export function DashboardEvents() {
  return <div className="p-6"><h1 className="font-display text-2xl font-bold mb-6">Мои мероприятия</h1><p className="text-stone-500">Раздел в разработке</p></div>;
}

export function DashboardModeration() {
  return <div className="p-6"><h1 className="font-display text-2xl font-bold mb-6">Модерация</h1><p className="text-stone-500">Ожидает проверки: 0 товаров</p></div>;
}

export function DashboardAnalytics() {
  return <div className="p-6"><h1 className="font-display text-2xl font-bold mb-6">Аналитика</h1><p className="text-stone-500">Статистика платформы</p></div>;
}

export function ProjectsPage() {
  const { store } = useStore();
  const currentUser = useCurrentUser();
  if (!currentUser) return <div className="p-6 text-center"><Link to="/auth" className="text-rose-600">Войти</Link></div>;
  
  const myProjects = store.cakeProjects.filter(p => p.userId === currentUser.id);
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold mb-6">Мои проекты</h1>
      {myProjects.length === 0 ? (
        <div className="text-center py-16"><div className="text-5xl mb-4">🎂</div><h3 className="text-lg font-semibold mb-2">Нет сохранённых проектов</h3><p className="text-stone-500">Создайте первый проект в конструкторе</p><Link to="/constructor" className="inline-block mt-4 bg-rose-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-rose-700">Открыть конструктор</Link></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {myProjects.map(p => (
            <div key={p.id} className="bg-white rounded-xl border border-stone-200 p-5">
              <div className="text-4xl mb-3">🎂</div>
              <h3 className="font-semibold mb-2">{p.category}</h3>
              <div className="space-y-1 text-sm text-stone-600">
                <p>Форма: {p.shape}</p>
                <p>Вес: {p.weight} кг</p>
                <p>Порций: {p.portions}</p>
                {p.layers.length > 0 && <p>Коржи: {p.layers.join(', ')}</p>}
                {p.filling && <p>Начинка: {p.filling}</p>}
                {p.decor.length > 0 && <p>Декор: {p.decor.join(', ')}</p>}
              </div>
              <div className="mt-4 pt-4 border-t border-stone-200 flex justify-between items-center">
                <span className="text-xs text-stone-500">{p.deliveryDate || 'Дата не указана'}</span>
                <span className="font-bold text-rose-600">{p.price.toLocaleString()} ₽</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
