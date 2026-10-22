import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export function CartPage() {
  const { cart, removeFromCart, clearCart } = useApp();
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center animate-fade-in">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-semibold text-graphite mb-2">Корзина пуста</h2>
        <p className="text-sm text-graphite-light mb-6">Добавьте торты из каталога</p>
        <Link to="/catalog" className="inline-flex items-center gap-2 bg-berry text-white px-6 py-3 rounded-xl font-medium hover:bg-berry-dark transition-colors">
          Перейти в каталог <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <h1 className="font-display text-2xl font-bold text-graphite mb-6">Корзина</h1>

      <div className="space-y-4 mb-6">
        {cart.map(item => (
          <div key={item.id} className="bg-white rounded-xl border border-cream-dark p-4 flex items-center gap-4">
            <div className="w-16 h-16 bg-cream-dark rounded-lg flex items-center justify-center text-2xl">🎂</div>
            <div className="flex-1">
              <h3 className="font-medium text-sm">{item.name}</h3>
              <p className="text-xs text-graphite-light">Количество: {item.qty}</p>
            </div>
            <div className="text-right">
              <p className="font-bold">{(item.price * item.qty).toLocaleString()} ₽</p>
              <button onClick={() => removeFromCart(item.id)} className="text-xs text-berry hover:underline flex items-center gap-1 mt-1">
                <Trash2 className="w-3 h-3" /> Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-cream-dark p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-graphite-light">Итого:</span>
          <span className="text-2xl font-bold">{total.toLocaleString()} ₽</span>
        </div>
        <button className="w-full bg-berry text-white py-3.5 rounded-xl font-medium hover:bg-berry-dark transition-colors shadow-lg shadow-berry/20 flex items-center justify-center gap-2">
          Оформить заказ <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-xs text-graphite-light text-center mt-3">
          В production: сервер проверяет наличие, цену и допустимость даты. Оплата через адаптер платёжного провайдера.
        </p>
        <button onClick={clearCart} className="w-full mt-3 py-2 text-sm text-graphite-light hover:text-berry transition-colors">Очистить корзину</button>
      </div>
    </div>
  );
}
