# Regression Risks — Риски регрессии и защитные тесты

**Дата:** 2026-01-15  
**Статус:** Предварительный анализ (требует доступа к Conditera)

---

## 1. Категории рисков

### 1.1. Критические риски (блокируют работу продукта)

| Риск | Описание | Вероятность | Влияние | Митигация |
|------|----------|-------------|---------|-----------|
| **CR-01** | Потеря данных пользователей | Средняя | Критическое | Backup перед изменениями, обратимые миграции |
| **CR-02** | Нарушение изоляции данных | Средняя | Критическое | Тесты RLS, проверка прав доступа |
| **CR-03** | Поломка авторизации | Средняя | Критическое | Тесты входа/выхода, проверка сессий |
| **CR-04** | Потеря заказов | Низкая | Критическое | Тесты создания/обработки заказов |
| **CR-05** | Нарушение финансовых расчётов | Средняя | Критическое | Тесты финансовых операций |
| **CR-06** | Поломка складского учёта | Средняя | Критическое | Тесты складских операций |

### 1.2. Высокие риски (существенно влияют на работу)

| Риск | Описание | Вероятность | Влияние | Митигация |
|------|----------|-------------|---------|-----------|
| **HR-01** | Поломка навигации | Низкая | Высокое | Тесты всех ссылок и маршрутов |
| **HR-02** | Поломка фильтров каталога | Средняя | Высокое | Тесты фильтрации и поиска |
| **HR-03** | Поломка чата | Средняя | Высокое | Тесты отправки/получения сообщений |
| **HR-04** | Нарушение OAuth flow | Средняя | Высокое | Интеграционные тесты OAuth |
| **HR-05** | Поломка dashboard | Средняя | Высокое | Тесты всех dashboard-страниц |

### 1.3. Средние риски (влияют на UX)

| Риск | Описание | Вероятность | Влияние | Митигация |
|------|----------|-------------|---------|-----------|
| **MR-01** | Ухудшение производительности | Средняя | Среднее | Нагрузочное тестирование |
| **MR-02** | Поломка адаптивности | Низкая | Среднее | Тесты на разных устройствах |
| **MR-03** | Нарушение дизайн-системы | Низкая | Среднее | Визуальная проверка |
| **MR-04** | Поломка уведомлений | Средняя | Среднее | Тесты уведомлений |

---

## 2. Детальный анализ рисков по этапам

### Этап 1: Дизайн-система

#### Риск DS-01: Несовместимость CSS

**Описание:** Новые стили конфликтуют с существующими компонентами Conditera

**Вероятность:** Низкая  
**Влияние:** Среднее

**Симптомы:**
- Неправильное отображение элементов
- Поломка вёрстки
- Исчезновение элементов

**Защитные тесты:**
```javascript
// Визуальная проверка всех страниц
describe('Design System Integration', () => {
  it('должен корректно отображать главную страницу', () => {
    cy.visit('/');
    cy.get('header').should('be.visible');
    cy.get('main').should('be.visible');
    cy.get('footer').should('be.visible');
  });

  it('должен корректно отображать каталог', () => {
    cy.visit('/catalog');
    cy.get('[data-testid="product-card"]').should('have.length.greaterThan', 0);
  });

  it('должен корректно отображать dashboard', () => {
    cy.login('seller');
    cy.visit('/dashboard');
    cy.get('[data-testid="dashboard-stats"]').should('be.visible');
  });
});
```

**Процедура отката:**
1. Откатить `src/index.css` к предыдущей версии
2. Проверить отображение всех страниц

---

### Этап 2: Layout и навигация

#### Риск LN-01: Поломка навигации

**Описание:** Новые компоненты Layout ломают существующие ссылки

**Вероятность:** Низкая  
**Влияние:** Высокое

**Симптомы:**
- Ссылки не работают
- 404 ошибки
- Неправильные редиректы

**Защитные тесты:**
```javascript
describe('Navigation', () => {
  const publicLinks = [
    { path: '/', expected: 'Главная' },
    { path: '/catalog', expected: 'Каталог' },
    { path: '/b2b', expected: 'Партнёрам' },
    { path: '/events', expected: 'Мероприятия' },
  ];

  publicLinks.forEach(({ path, expected }) => {
    it(`должен корректно открывать ${path}`, () => {
      cy.visit(path);
      cy.contains(expected).should('be.visible');
    });
  });

  it('должен корректно работать header', () => {
    cy.visit('/');
    cy.get('header').find('a').each(($link) => {
      cy.wrap($link).click();
      cy.url().should('not.include', 'undefined');
    });
  });
});
```

#### Риск LN-02: Нарушение прав доступа

**Описание:** Новые компоненты Layout показывают защищённые разделы неавторизованным пользователям

**Вероятность:** Средняя  
**Влияние:** Критическое

**Симптомы:**
- Доступ к dashboard без авторизации
- Отображение административных функций
- Утечка данных

**Защитные тесты:**
```javascript
describe('Access Control', () => {
  it('не должен показывать dashboard гостю', () => {
    cy.visit('/dashboard');
    cy.url().should('include', '/auth');
  });

  it('не должен показывать административные функции покупателю', () => {
    cy.login('buyer');
    cy.visit('/dashboard');
    cy.contains('Администрирование').should('not.exist');
  });

  it('должен показывать dashboard кондитеру', () => {
    cy.login('seller');
    cy.visit('/dashboard');
    cy.get('[data-testid="dashboard"]').should('be.visible');
  });
});
```

---

### Этап 3: OAuth UI

#### Риск OA-01: Поломка существующей авторизации

**Описание:** Новые кнопки OAuth ломают существующий вход по email/паролю

**Вероятность:** Средняя  
**Влияние:** Критическое

**Симптомы:**
- Невозможность войти по email
- Ошибки при входе
- Потеря сессии

**Защитные тесты:**
```javascript
describe('Authentication', () => {
  it('должен работать вход по email/паролю', () => {
    cy.visit('/auth');
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="login-button"]').click();
    cy.url().should('not.include', '/auth');
  });

  it('должен работать выход', () => {
    cy.login('buyer');
    cy.get('[data-testid="logout-button"]').click();
    cy.url().should('include', '/');
  });

  it('должен сохранять сессию при перезагрузке', () => {
    cy.login('buyer');
    cy.reload();
    cy.get('[data-testid="user-menu"]').should('be.visible');
  });
});
```

#### Риск OA-02: Нарушение безопасности OAuth

**Описание:** Неправильная реализация OAuth создаёт уязвимости

**Вероятность:** Средняя  
**Влияние:** Критическое

**Симптомы:**
- Возможность подделки state
- Перехват authorization code
- Несанкционированный доступ

**Защитные тесты:**
```javascript
describe('OAuth Security', () => {
  it('должен валидировать state parameter', () => {
    cy.visit('/auth/callback?code=test&state=invalid');
    cy.contains('Ошибка').should('be.visible');
  });

  it('должен отклонять истёкший state', () => {
    // Имитация истёкшего state
    cy.visit('/auth/callback?code=test&state=expired');
    cy.contains('истёк').should('be.visible');
  });

  it('должен использовать PKCE', () => {
    cy.intercept('POST', '**/oauth/token').as('tokenExchange');
    cy.get('[data-testid="yandex-login"]').click();
    cy.wait('@tokenExchange').its('request.body').should('include', 'code_verifier');
  });
});
```

#### Риск OA-03: Дублирование пользователей

**Описание:** OAuth создаёт второго пользователя при существующем email

**Вероятность:** Средняя  
**Влияние:** Высокое

**Симптомы:**
- Два аккаунта с одинаковым email
- Потеря истории заказов
- Нарушение данных

**Защитные тесты:**
```javascript
describe('Account Linking', () => {
  it('не должен создавать дубликат при совпадении email', () => {
    // Регистрация по email
    cy.register('test@example.com', 'password123');
    cy.logout();
    
    // Попытка входа через OAuth с тем же email
    cy.mockOAuth('yandex', { email: 'test@example.com' });
    cy.visit('/auth/callback?code=test&state=test');
    
    // Должна быть ошибка о необходимости связывания
    cy.contains('уже существует').should('be.visible');
  });

  it('должен позволять связывание после подтверждения', () => {
    cy.login('buyer');
    cy.visit('/settings/linked-accounts');
    cy.get('[data-testid="link-yandex"]').click();
    cy.mockOAuth('yandex', { email: 'test@example.com' });
    cy.contains('Аккаунт связан').should('be.visible');
  });
});
```

---

### Этап 4: UX каталога

#### Риск CT-01: Поломка фильтрации

**Описание:** Новые фильтры не работают с реальными данными

**Вероятность:** Средняя  
**Влияние:** Высокое

**Симптомы:**
- Фильтры не применяются
- Неправильные результаты
- Ошибки API

**Защитные тесты:**
```javascript
describe('Catalog Filters', () => {
  it('должен фильтровать по категории', () => {
    cy.visit('/catalog');
    cy.get('[data-testid="category-filter"]').select('Торты');
    cy.get('[data-testid="product-card"]').each(($card) => {
      cy.wrap($card).contains('Торты').should('exist');
    });
  });

  it('должен сохранять фильтры в URL', () => {
    cy.visit('/catalog');
    cy.get('[data-testid="category-filter"]').select('Торты');
    cy.url().should('include', 'category=Торты');
  });

  it('должен работать с пагинацией', () => {
    cy.visit('/catalog');
    cy.get('[data-testid="page-2"]').click();
    cy.get('[data-testid="product-card"]').should('have.length.greaterThan', 0);
  });
});
```

#### Риск CT-02: Ухудшение производительности

**Описание:** Новые фильтры замедляют загрузку каталога

**Вероятность:** Средняя  
**Влияние:** Среднее

**Симптомы:**
- Долгая загрузка страницы
- Таймауты API
- Высокая нагрузка на сервер

**Защитные тесты:**
```javascript
describe('Catalog Performance', () => {
  it('должен загружаться быстрее 2 секунд', () => {
    const start = Date.now();
    cy.visit('/catalog');
    cy.get('[data-testid="product-card"]').should('be.visible');
    const duration = Date.now() - start;
    expect(duration).to.be.lessThan(2000);
  });

  it('должен применять фильтры быстрее 500мс', () => {
    cy.visit('/catalog');
    const start = Date.now();
    cy.get('[data-testid="category-filter"]').select('Торты');
    cy.get('[data-testid="product-card"]').should('be.visible');
    const duration = Date.now() - start;
    expect(duration).to.be.lessThan(500);
  });
});
```

---

### Этап 5: Dashboard UX

#### Риск DB-01: Поломка отображения данных

**Описание:** Новые компоненты dashboard не работают с реальными данными

**Вероятность:** Средняя  
**Влияние:** Высокое

**Симптомы:**
- Пустые карточки статистики
- Неправильные числа
- Ошибки загрузки

**Защитные тесты:**
```javascript
describe('Dashboard Data Display', () => {
  beforeEach(() => {
    cy.login('seller');
  });

  it('должен отображать статистику заказов', () => {
    cy.visit('/dashboard');
    cy.get('[data-testid="new-orders-count"]').should('not.be.empty');
  });

  it('должен отображать список заказов', () => {
    cy.visit('/dashboard/orders');
    cy.get('[data-testid="order-row"]').should('have.length.greaterThan', 0);
  });

  it('должен отображать список товаров', () => {
    cy.visit('/dashboard/products');
    cy.get('[data-testid="product-row"]').should('have.length.greaterThan', 0);
  });
});
```

#### Риск DB-02: Нарушение прав доступа

**Описание:** Кондитер видит данные другого кондитера

**Вероятность:** Средняя  
**Влияние:** Критическое

**Симптомы:**
- Чужие заказы в списке
- Чужие товары
- Утечка данных

**Защитные тесты:**
```javascript
describe('Dashboard Access Control', () => {
  it('должен показывать только свои заказы', () => {
    cy.login('seller1');
    cy.visit('/dashboard/orders');
    cy.get('[data-testid="order-row"]').each(($row) => {
      cy.wrap($row).should('contain', 'seller1');
      cy.wrap($row).should('not.contain', 'seller2');
    });
  });

  it('должен показывать только свои товары', () => {
    cy.login('seller1');
    cy.visit('/dashboard/products');
    cy.get('[data-testid="product-row"]').each(($row) => {
      cy.wrap($row).should('contain', 'seller1');
    });
  });

  it('не должен позволять редактировать чужие товары', () => {
    cy.login('seller1');
    cy.request({
      url: '/api/products/seller2-product-id',
      method: 'PUT',
      failOnStatusCode: false
    }).its('status').should('eq', 403);
  });
});
```

---

## 3. Критические сценарии для тестирования

### 3.1. Сквозной сценарий заказа

```javascript
describe('Critical Path: Order Flow', () => {
  it('должен завершить полный цикл заказа', () => {
    // 1. Регистрация покупателя
    cy.register('buyer@example.com', 'password123', 'buyer');
    
    // 2. Поиск товара
    cy.visit('/catalog');
    cy.get('[data-testid="product-card"]').first().click();
    
    // 3. Добавление в корзину
    cy.get('[data-testid="add-to-cart"]').click();
    cy.get('[data-testid="cart-count"]').should('contain', '1');
    
    // 4. Оформление заказа
    cy.visit('/cart');
    cy.get('[data-testid="checkout-button"]').click();
    cy.get('[data-testid="delivery-date"]').type('2026-02-01');
    cy.get('[data-testid="confirm-order"]').click();
    
    // 5. Проверка статуса заказа
    cy.contains('Заказ оформлен').should('be.visible');
    cy.get('[data-testid="order-id"]').invoke('text').as('orderId');
    
    // 6. Вход кондитера
    cy.logout();
    cy.login('seller');
    
    // 7. Принятие заказа
    cy.visit('/dashboard/orders');
    cy.get(`[data-testid="order-${orderId}"]`).contains('Принять').click();
    
    // 8. Начало производства
    cy.get(`[data-testid="order-${orderId}"]`).contains('Начать готовить').click();
    
    // 9. Завершение
    cy.get(`[data-testid="order-${orderId}"]`).contains('Готов').click();
    cy.get(`[data-testid="order-${orderId}"]`).contains('Выдан').click();
    
    // 10. Проверка статуса
    cy.get(`[data-testid="order-${orderId}"]`).should('contain', 'Завершён');
  });
});
```

### 3.2. Сценарий складских операций

```javascript
describe('Critical Path: Inventory Operations', () => {
  it('должен корректно списать ингредиенты при заказе', () => {
    // Подготовка
    cy.login('seller');
    cy.visit('/dashboard/inventory');
    cy.get('[data-testid="ingredient-flour"] [data-testid="stock"]').as('initialStock');
    
    // Создание заказа
    cy.visit('/dashboard/orders');
    cy.get('[data-testid="new-order"]').click();
    cy.get('[data-testid="product-select"]').select('Медовик');
    cy.get('[data-testid="confirm-order"]').click();
    
    // Проверка списания
    cy.visit('/dashboard/inventory');
    cy.get('[data-testid="ingredient-flour"] [data-testid="stock"]')
      .should('be.lessThan', initialStock);
  });

  it('не должен допускать отрицательный остаток', () => {
    cy.login('seller');
    cy.visit('/dashboard/inventory');
    
    // Попытка списания больше наличия
    cy.get('[data-testid="ingredient-sugar"] [data-testid="write-off"]').click();
    cy.get('[data-testid="amount-input"]').type('999999');
    cy.get('[data-testid="confirm-write-off"]').click();
    
    cy.contains('Недостаточно').should('be.visible');
  });
});
```

### 3.3. Сценарий безопасности

```javascript
describe('Critical Path: Security', () => {
  it('не должен позволять IDOR', () => {
    cy.login('buyer1');
    cy.get('[data-testid="order-id"]').invoke('text').as('order1Id');
    
    cy.logout();
    cy.login('buyer2');
    
    // Попытка доступа к чужому заказу
    cy.request({
      url: `/api/orders/${order1Id}`,
      failOnStatusCode: false
    }).its('status').should('eq', 403);
  });

  it('не должен позволять подмену роли', () => {
    cy.login('buyer');
    
    // Попытка получить административный доступ
    cy.request({
      url: '/api/admin/users',
      failOnStatusCode: false
    }).its('status').should('eq', 403);
  });

  it('не должен передавать service-role ключ в браузер', () => {
    cy.visit('/');
    cy.window().then((win) => {
      expect(win.__SUPABASE_SERVICE_ROLE__).to.be.undefined;
    });
  });
});
```

---

## 4. Чек-лист тестирования перед production

### 4.1. Функциональное тестирование

- [ ] Регистрация нового пользователя
- [ ] Вход по email/паролю
- [ ] Вход через Яндекс ID
- [ ] Вход через VK ID
- [ ] Выход из системы
- [ ] Восстановление пароля
- [ ] Создание товара кондитером
- [ ] Редактирование товара
- [ ] Публикация/скрытие товара
- [ ] Поиск товара в каталоге
- [ ] Фильтрация товаров
- [ ] Добавление в корзину
- [ ] Оформление заказа
- [ ] Принятие заказа кондитером
- [ ] Изменение статуса заказа
- [ ] Отправка сообщения в чате
- [ ] Получение сообщения в чате
- [ ] Создание рецепта
- [ ] Расчёт себестоимости
- [ ] Поступление на склад
- [ ] Списание со склада
- [ ] Просмотр финансовой статистики
- [ ] Создание мероприятия
- [ ] Добавление задачи к мероприятию

### 4.2. Тестирование безопасности

- [ ] Изоляция данных пользователей
- [ ] Проверка прав доступа к заказам
- [ ] Проверка прав доступа к товарам
- [ ] Проверка прав доступа к складу
- [ ] Защита от IDOR
- [ ] Защита от подмены роли
- [ ] Валидация state в OAuth
- [ ] Проверка PKCE в OAuth
- [ ] Защита от повторного использования code
- [ ] Проверка redirect URI allowlist
- [ ] Отсутствие service-role ключа в браузере
- [ ] Проверка RLS policies
- [ ] Аудит критических действий

### 4.3. Тестирование производительности

- [ ] Загрузка главной страницы < 2с
- [ ] Загрузка каталога < 2с
- [ ] Применение фильтров < 500мс
- [ ] Отправка сообщения в чате < 1с
- [ ] Создание товара < 2с
- [ ] Оформление заказа < 3с

### 4.4. Тестирование адаптивности

- [ ] Mobile (320px)
- [ ] Tablet (768px)
- [ ] Desktop (1024px)
- [ ] Large Desktop (1440px)

### 4.5. Тестирование совместимости

- [ ] Chrome (последняя версия)
- [ ] Firefox (последняя версия)
- [ ] Safari (последняя версия)
- [ ] Edge (последняя версия)
- [ ] Mobile Safari
- [ ] Mobile Chrome

---

## 5. Процедура отката

### 5.1. Немедленный откат

**Когда применять:** Критический дефект, блокирующий работу продукта

**Шаги:**
1. Определить проблемный коммит
2. Выполнить `git revert <commit-hash>`
3. Запустить production build
4. Развернуть на production
5. Проверить работоспособность

**Время:** 15-30 минут

### 5.2. Плановый откат

**Когда применять:** Обнаружены дефекты, но продукт работает

**Шаги:**
1. Создать ветку для исправлений
2. Исправить дефекты
3. Протестировать
4. Создать PR
5. После approval — merge в main
6. Развернуть на production

**Время:** 1-2 дня

### 5.3. Откат миграций БД

**Когда применять:** Проблемы с базой данных

**Шаги:**
1. Определить проблемную миграцию
2. Выполнить `supabase migration down`
3. Проверить целостность данных
4. Восстановить из backup (если необходимо)

**Время:** 30-60 минут

---

## 6. Мониторинг после развёртывания

### 6.1. Ключевые метрики

- **Error Rate:** < 0.1%
- **Response Time:** < 500мс (95-й перцентиль)
- **Uptime:** > 99.9%
- **Failed Login Attempts:** мониторинг аномалий
- **OAuth Failures:** мониторинг ошибок авторизации

### 6.2. Алерты

- Error Rate > 1%
- Response Time > 2с
- Uptime < 99%
- Failed OAuth attempts > 10/мин
- Database connection failures

### 6.3. Логирование

- Все критические действия (создание заказа, изменение статуса)
- Все ошибки авторизации
- Все нарушения прав доступа
- Все ошибки OAuth

**НЕ логировать:**
- Пароли
- Токены
- Секреты
- Персональные данные (без необходимости)

---

**Подпись:** AI Assistant  
**Дата:** 2026-01-15  
**Версия:** 1.0
