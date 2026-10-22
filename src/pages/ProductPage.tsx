import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/mockData';
import { useApp } from '../context/AppContext';
import { Star, Clock, ShoppingCart, Heart, Share2, ArrowLeft, AlertTriangle } from 'lucide-react';

export function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useApp();
  const product = products.find(p => p.id === id);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="text-5xl mb-4">😔</div>
        <h2 className="text-xl font-semibold mb-2">Товар не найден</h2>
        <Link to="/catalog" className="text-berry hover:underline">Вернуться в каталог</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({ id: product.id, name: product.name, price: product.price });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <Link to="/catalog" className="inline-flex items-center gap-1 text-sm text-graphite-light hover:text-berry mb-6">
        <ArrowLeft className="w-4 h-4" /> Назад в каталог
      </Link>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="bg-cream-dark rounded-2xl aspect-square flex items-center justify-center">
          <span className="text-[120px]">{product.images[0]}</span>
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs bg-cream-dark px-2.5 py-1 rounded-full text-graphite-light">{product.category}</span>
            {product.rating && <span className="text-xs flex items-center gap-0.5 text-gold"><Star className="w-3.5 h-3.5 fill-current" /> {product.rating}</span>}
          </div>
          <h1 className="font-display text-3xl font-bold text-graphite">{product.name}</h1>
          <p className="text-graphite-light mt-2">{product.seller}</p>

          <div className="mt-6">
            <span className="text-3xl font-bold text-graphite">{product.price.toLocaleString()} ₽</span>
            {product.priceFrom && <span className="text-sm text-graphite-light ml-2">минимальная цена</span>}
          </div>

          <p className="mt-6 text-graphite-light leading-relaxed">{product.description}</p>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-cream rounded-xl p-4">
              <p className="text-xs text-graphite-light">Вес</p>
              <p className="font-semibold">{product.weight}</p>
            </div>
            <div className="bg-cream rounded-xl p-4">
              <p className="text-xs text-graphite-light">Порций</p>
              <p className="font-semibold">{product.portions}</p>
            </div>
            <div className="bg-cream rounded-xl p-4">
              <p className="text-xs text-graphite-light">Срок изготовления</p>
              <p className="font-semibold">{product.prepTime}</p>
            </div>
            <div className="bg-cream rounded-xl p-4">
              <p className="text-xs text-graphite-light">Доступность</p>
              <p className={`font-semibold ${product.available ? 'text-sage' : 'text-berry'}`}>{product.available ? 'Доступен' : 'Нет в наличии'}</p>
            </div>
          </div>

          {/* Allergens */}
          {product.allergens.length > 0 && (
            <div className="mt-6 flex items-start gap-2 bg-gold/10 rounded-xl p-4">
              <AlertTriangle className="w-4 h-4 text-gold mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">Аллергены</p>
                <p className="text-xs text-graphite-light mt-0.5">{product.allergens.join(', ')}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-8 flex gap-3">
            <button onClick={handleAddToCart} disabled={!product.available} className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-medium transition-all ${product.available ? (added ? 'bg-sage text-white' : 'bg-berry text-white hover:bg-berry-dark shadow-lg shadow-berry/20') : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
              <ShoppingCart className="w-5 h-5" />
              {added ? 'Добавлено!' : 'В корзину'}
            </button>
            <button className="p-3.5 rounded-xl border border-cream-dark hover:border-berry/30 transition-colors">
              <Heart className="w-5 h-5 text-graphite-light" />
            </button>
            <button className="p-3.5 rounded-xl border border-cream-dark hover:border-berry/30 transition-colors">
              <Share2 className="w-5 h-5 text-graphite-light" />
            </button>
          </div>

          {/* Seller info */}
          <div className="mt-6 bg-white rounded-xl border border-cream-dark p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-sage rounded-full flex items-center justify-center">
              <span className="text-white font-bold">{product.seller.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">{product.seller}</p>
              <p className="text-xs text-graphite-light">Кондитер на Conditera</p>
            </div>
            <Link to="/chat" className="text-sm text-berry font-medium hover:underline">Написать</Link>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display text-2xl font-bold text-graphite mb-6">Похожие торты</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map(p => (
              <Link key={p.id} to={`/product/${p.id}`} className="group bg-white rounded-2xl overflow-hidden border border-cream-dark hover:shadow-lg transition-all">
                <div className="aspect-[4/3] bg-cream-dark flex items-center justify-center">
                  <span className="text-6xl group-hover:scale-110 transition-transform">{p.images[0]}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm group-hover:text-berry transition-colors">{p.name}</h3>
                  <p className="text-sm font-bold mt-1">{p.price.toLocaleString()} ₽</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
