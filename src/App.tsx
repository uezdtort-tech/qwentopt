import React from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <HashRouter>
      <div style={{ minHeight: '100vh', backgroundColor: '#fafaf9' }}>
        {/* Header */}
        <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e7e5e4', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div style={{ width: '40px', height: '40px', backgroundColor: '#e11d48', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '20px' }}>C</div>
            <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#292524' }}>Conditera</span>
          </Link>
          <nav style={{ display: 'flex', gap: '1.5rem' }}>
            <Link to="/" style={{ color: '#57534e', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Главная</Link>
            <Link to="/catalog" style={{ color: '#57534e', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Каталог</Link>
            <Link to="/constructor" style={{ color: '#57534e', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Конструктор</Link>
            <Link to="/auth" style={{ backgroundColor: '#e11d48', color: 'white', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Войти</Link>
          </nav>
        </header>

        {/* Main */}
        <main>
          <Routes>
            <Route path="/" element={
              <div>
                {/* Hero */}
                <section style={{ background: 'linear-gradient(to bottom right, #fafaf9, #fff1f2, #f5f5f4)', padding: '5rem 2rem' }}>
                  <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <div style={{ maxWidth: '600px' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#ffe4e6', color: '#be123c', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', marginBottom: '1rem' }}>
                        <span>✨</span> Экосистема для кондитеров
                      </div>
                      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#292524', lineHeight: '1.1', marginBottom: '1.5rem' }}>
                        Торты, десерты<br />и услуги для<br />вашего праздника
                      </h1>
                      <p style={{ fontSize: '1.125rem', color: '#57534e', lineHeight: '1.6', marginBottom: '2rem' }}>
                        Закажите уникальный торт у проверенного кондитера, спланируйте мероприятие, найдите аниматоров и декор — всё в одной платформе.
                      </p>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <Link to="/catalog" style={{ backgroundColor: '#e11d48', color: 'white', padding: '16px 32px', borderRadius: '12px', textDecoration: 'none', fontWeight: '500', boxShadow: '0 10px 15px -3px rgba(225, 29, 72, 0.2)' }}>
                          Найти торт →
                        </Link>
                        <Link to="/constructor" style={{ backgroundColor: 'white', color: '#292524', padding: '16px 32px', borderRadius: '12px', textDecoration: 'none', fontWeight: '500', border: '1px solid #d6d3d1' }}>
                          🎨 Конструктор торта
                        </Link>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Featured */}
                <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '4rem 2rem' }}>
                  <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#292524', marginBottom: '2rem' }}>Популярные торты</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {[
                      { emoji: '🎂', name: 'Медовик классический', desc: 'Традиционный медовый торт с нежным сметанным кремом', price: '2 800 ₽', category: 'Торты', rating: '4.9' },
                      { emoji: '🍰', name: 'Красный бархат', desc: 'Яркий бисквит с бархатной текстурой и кремом из маскарпоне', price: '3 200 ₽', category: 'Торты', rating: '4.8' },
                      { emoji: '🧁', name: 'Набор макарон (12 шт)', desc: 'Ассорти французских макарон: фисташка, малина, шоколад', price: '1 800 ₽', category: 'Пирожные', rating: '5.0' },
                    ].map((item, i) => (
                      <div key={i} style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e7e5e4' }}>
                        <div style={{ aspectRatio: '4/3', background: 'linear-gradient(to bottom right, #f5f5f4, #e7e5e4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '70px' }}>{item.emoji}</span>
                        </div>
                        <div style={{ padding: '20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', backgroundColor: '#f5f5f4', padding: '2px 8px', borderRadius: '9999px', color: '#57534e' }}>{item.category}</span>
                            <span style={{ fontSize: '12px', color: '#f59e0b' }}>⭐ {item.rating}</span>
                          </div>
                          <h3 style={{ fontWeight: '600', color: '#292524', marginBottom: '8px' }}>{item.name}</h3>
                          <p style={{ fontSize: '14px', color: '#78716c', marginBottom: '16px' }}>{item.desc}</p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{item.price}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Advantages */}
                <section style={{ backgroundColor: 'white', borderTop: '1px solid #e7e5e4', borderBottom: '1px solid #e7e5e4', padding: '4rem 2rem' }}>
                  <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#292524', textAlign: 'center', marginBottom: '3rem' }}>Почему Conditera</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                      {[
                        { icon: '🛡️', title: 'Проверенные кондитеры', desc: 'Модерация и верификация всех продавцов' },
                        { icon: '✨', title: 'Уникальные рецепты', desc: 'Авторские торты от лучших мастеров' },
                        { icon: '💬', title: 'Прямое общение', desc: 'Чат напрямую с кондитером' },
                        { icon: '👨‍🍳', title: 'Полный цикл', desc: 'От торта до оформления мероприятия' },
                      ].map((item, i) => (
                        <div key={i} style={{ textAlign: 'center' }}>
                          <div style={{ width: '56px', height: '56px', backgroundColor: '#fff1f2', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '24px' }}>{item.icon}</div>
                          <h3 style={{ fontWeight: '600', color: '#292524', marginBottom: '8px' }}>{item.title}</h3>
                          <p style={{ fontSize: '14px', color: '#78716c' }}>{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            } />
            <Route path="/catalog" element={
              <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#292524', marginBottom: '0.5rem' }}>Каталог</h1>
                <p style={{ color: '#57534e', marginBottom: '2rem' }}>Торты, десерты, декор и услуги</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  {['🎂', '🍰', '🧁', '💒', '🦄', '🥐'].map((emoji, i) => (
                    <div key={i} style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e7e5e4' }}>
                      <div style={{ aspectRatio: '4/3', background: 'linear-gradient(to bottom right, #f5f5f4, #e7e5e4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '70px' }}>{emoji}</span>
                      </div>
                      <div style={{ padding: '20px' }}>
                        <h3 style={{ fontWeight: '600', color: '#292524', marginBottom: '8px' }}>Торт #{i + 1}</h3>
                        <p style={{ fontSize: '14px', color: '#78716c', marginBottom: '16px' }}>Описание товара</p>
                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{(2000 + i * 500).toLocaleString()} ₽</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            } />
            <Route path="/constructor" element={
              <div style={{ maxWidth: '1024px', margin: '0 auto', padding: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#292524', marginBottom: '0.5rem' }}>Конструктор торта</h1>
                <p style={{ color: '#57534e', marginBottom: '2rem' }}>Создайте торт вашей мечты</p>
                <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e7e5e4', padding: '2rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '100px', marginBottom: '1rem' }}>🎂</div>
                  <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Конструктор в разработке</h3>
                  <p style={{ color: '#78716c' }}>Полноценный конструктор торта с расчётом стоимости</p>
                </div>
              </div>
            } />
            <Route path="/auth" element={
              <div style={{ minHeight: 'calc(100vh - 4rem)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div style={{ width: '100%', maxWidth: '400px' }}>
                  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '64px', height: '64px', backgroundColor: '#e11d48', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                      <span style={{ color: 'white', fontWeight: 'bold', fontSize: '30px' }}>C</span>
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#292524' }}>Вход в Conditera</h1>
                  </div>
                  <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e7e5e4', padding: '1.5rem' }}>
                    <div style={{ marginBottom: '1rem' }}>
                      <button style={{ width: '100%', padding: '12px', backgroundColor: '#fbbf24', color: 'black', borderRadius: '12px', fontWeight: '500', border: 'none', cursor: 'pointer', marginBottom: '8px' }}>Я Войти через Яндекс ID</button>
                      <button style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: 'white', borderRadius: '12px', fontWeight: '500', border: 'none', cursor: 'pointer' }}>VK Войти через VK ID</button>
                    </div>
                    <div style={{ position: 'relative', margin: '1.5rem 0' }}>
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
                        <div style={{ width: '100%', borderTop: '1px solid #e7e5e4' }}></div>
                      </div>
                      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', fontSize: '12px' }}>
                        <span style={{ backgroundColor: 'white', padding: '0 12px', color: '#78716c' }}>или через email</span>
                      </div>
                    </div>
                    <input type="email" placeholder="Email" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e7e5e4', marginBottom: '12px', fontSize: '14px' }} />
                    <input type="password" placeholder="Пароль" style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e7e5e4', marginBottom: '12px', fontSize: '14px' }} />
                    <button style={{ width: '100%', padding: '12px', backgroundColor: '#e11d48', color: 'white', borderRadius: '12px', fontWeight: '500', border: 'none', cursor: 'pointer' }}>Войти</button>
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </main>

        {/* Footer */}
        <footer style={{ backgroundColor: '#292524', color: 'white', padding: '3rem 2rem', marginTop: 'auto' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <div style={{ width: '32px', height: '32px', backgroundColor: '#e11d48', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontWeight: 'bold' }}>C</span>
                </div>
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Conditera</span>
              </div>
              <p style={{ fontSize: '14px', color: '#a8a29e' }}>Цифровая экосистема для кондитеров</p>
            </div>
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: '12px', fontSize: '14px' }}>Клиентам</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '8px' }}><Link to="/catalog" style={{ color: '#a8a29e', textDecoration: 'none', fontSize: '14px' }}>Каталог</Link></li>
                <li style={{ marginBottom: '8px' }}><Link to="/constructor" style={{ color: '#a8a29e', textDecoration: 'none', fontSize: '14px' }}>Конструктор</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: '12px', fontSize: '14px' }}>Партнёрам</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ marginBottom: '8px' }}><Link to="/auth" style={{ color: '#a8a29e', textDecoration: 'none', fontSize: '14px' }}>Стать кондитером</Link></li>
              </ul>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #44403c', marginTop: '2rem', paddingTop: '2rem', textAlign: 'center', fontSize: '12px', color: '#78716c' }}>
            © 2026 Conditera Next
          </div>
        </footer>
      </div>
    </HashRouter>
  );
}

export default App;
