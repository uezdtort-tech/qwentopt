import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { products, categories, occasions } from '../data/mockData';
import { Search, ArrowRight, Star, Clock, Shield, Users, ChefHat, Sparkles } from 'lucide-react';

export function HomePage() {
  const navigate = useNavigate();
  const featured = products.filter(p => p.available).slice(0, 6);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cream via-cream-dark to-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-graphite leading-tight">
                Торты и десерты<br />от лучших кондитеров
              </h1>
              <p className="mt-6 text-lg text-graphite-light leading-relaxed max-w-lg">
                Находите уникальные торты для любого повода. Заказывайте напрямую у кондитеров — без посредников, с прозрачной ценой и гарантией качества.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-graphite-light" />
                  <input
                    type="text"
                    placeholder="Найти торт, кондитера..."
                    className="w-full pl-12 pr-4 py-3.5 bg-white rounded-xl border border-cream-dark shadow-sm focus:outline-none focus:ring-2 focus:ring-berry/30 focus:border-berry text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && navigate('/catalog')}
                  />
                </div>
                <button onClick={() => navigate('/catalog')} className="bg-berry text-white px-6 py-3.5 rounded-xl font-medium hover:bg-berry-dark transition-colors flex items-center justify-center gap-2 shadow-lg shadow-berry/20">
                  Найти торт <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {occasions.slice(0, 4).map(o => (
                  <Link key={o} to={`/catalog?occasion=${o}`} className="text-xs bg-white/80 px-3 py-1.5 rounded-full text-graphite-light hover:bg-berry hover:text-white transition-colors border border-cream-dark">
                    {o}
                  </Link>
                ))}
              </div>
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-cream-dark">
                  <div className="text-5xl mb-3">🎂</div>
                  <p className="font-medium text-sm">Свадебные торты</p>
                  <p className="text-xs text-graphite-light mt-1">от 8 000 ₽</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-cream-dark">
                  <div className="text-5xl mb-3">🧁</div>
                  <p className="font-medium text-sm">Макаруны</p>
                  <p className="text-xs text-graphite-light mt-1">от 1 800 ₽</p>
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-cream-dark">
                  <div className="text-5xl mb-3">🍰</div>
                  <p className="font-medium text-sm">Классические торты</p>
                  <p className="text-xs text-graphite-light mt-1">от 2 200 ₽</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-cream-dark">
                  <div className="text-5xl mb-3">🦄</div>
                  <p className="font-medium text-sm">Детские торты</p>
                  <p className="text-xs text-graphite-light mt-1">от 3 500 ₽</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-graphite mb-8">Популярные поводы</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {occasions.map((occ, i) => (
            <Link key={occ} to={`/catalog?occasion=${occ}`} className="group bg-white rounded-xl p-5 border border-cream-dark hover:border-berry/30 hover:shadow-md transition-all">
              <div className="text-3xl mb-2">{['🎂', '💒', '🎉', '🧒', '🏢', '❤️', '🌸', '🎁'][i]}</div>
              <p className="font-medium text-sm group-hover:text-berry transition-colors">{occ}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-graphite">Популярные торты</h2>
          <Link to="/catalog" className="text-berry text-sm font-medium hover:underline flex items-center gap-1">
            Все торты <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map(product => (
            <Link key={product.id} to={`/product/${product.id}`} className="group bg-white rounded-2xl overflow-hidden border border-cream-dark hover:shadow-lg transition-all">
              <div className="aspect-[4/3] bg-cream-dark flex items-center justify-center">
                <span className="text-7xl group-hover:scale-110 transition-transform">{product.images[0]}</span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-cream-dark px-2 py-0.5 rounded-full text-graphite-light">{product.category}</span>
                  {product.rating && (
                    <span className="text-xs flex items-center gap-0.5 text-gold">
                      <Star className="w-3 h-3 fill-current" /> {product.rating}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-graphite group-hover:text-berry transition-colors">{product.name}</h3>
                <p className="text-sm text-graphite-light mt-1 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <span className="text-lg font-bold text-graphite">{product.price.toLocaleString()} ₽</span>
                    {product.priceFrom && <span className="text-xs text-graphite-light ml-1">от</span>}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-graphite-light">
                    <Clock className="w-3 h-3" /> {product.prepTime}
                  </div>
                </div>
                <p className="text-xs text-graphite-light mt-2">{product.seller} · {product.weight}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Advantages */}
      <section className="bg-white border-y border-cream-dark mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-graphite text-center mb-12">Почему Conditera</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Shield className="w-6 h-6" />, title: 'Проверенные кондитеры', desc: 'Каждый продавец проходит верификацию' },
              { icon: <Sparkles className="w-6 h-6" />, title: 'Уникальные рецепты', desc: 'Авторские торты, которых нет в магазинах' },
              { icon: <Users className="w-6 h-6" />, title: 'Прямое общение', desc: 'Обсуждайте детали напрямую с кондитером' },
              { icon: <ChefHat className="w-6 h-6" />, title: 'Гарантия качества', desc: 'Контроль качества и поддержка на каждом этапе' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-berry/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-berry">{item.icon}</div>
                <h3 className="font-semibold text-graphite mb-2">{item.title}</h3>
                <p className="text-sm text-graphite-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Sellers CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-gradient-to-r from-graphite to-graphite-light rounded-3xl p-8 sm:p-12 text-white">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">Вы кондитер? Присоединяйтесь к Conditera</h2>
              <p className="text-gray-300 leading-relaxed mb-6">
                Получайте заказы, управляйте рецептами и себестоимостью, общайтесь с клиентами — всё в одном удобном рабочем пространстве. AI-помощник упростит рутину.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/auth" className="bg-berry text-white px-6 py-3 rounded-xl font-medium hover:bg-berry-light transition-colors">Стать кондитером</Link>
                <Link to="/dashboard" className="border border-white/30 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/10 transition-colors">Посмотреть кабинет</Link>
              </div>
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-2xl font-bold">📋</p>
                <p className="text-sm mt-2">Управление заказами</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-2xl font-bold">📖</p>
                <p className="text-sm mt-2">Рецепты и себестоимость</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-2xl font-bold">📦</p>
                <p className="text-sm mt-2">Учёт ингредиентов</p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-2xl font-bold">🤖</p>
                <p className="text-sm mt-2">AI-помощник</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-16">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-graphite text-center mb-12">Как это работает</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Выберите торт', desc: 'Просмотрите каталог или закажите индивидуальный торт' },
            { step: '02', title: 'Обсудите детали', desc: 'Свяжитесь с кондитером для уточнения пожеланий' },
            { step: '03', title: 'Оформите заказ', desc: 'Выберите дату и подтвердите заказ' },
            { step: '04', title: 'Получите торт', desc: 'Заберите готовый торт или получите доставку' },
          ].map((item, i) => (
            <div key={i} className="relative bg-white rounded-xl p-6 border border-cream-dark">
              <span className="text-4xl font-bold text-berry/20">{item.step}</span>
              <h3 className="font-semibold text-graphite mt-2 mb-1">{item.title}</h3>
              <p className="text-sm text-graphite-light">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
