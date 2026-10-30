# REGRESSION TEST PLAN

**Статус:** ⚠️ PARTIAL  
**Дата:** 2026-01-15  
**Версия:** 1.0

---

## ⚠️ Критическое ограничение

**Тесты не написаны** — отсутствуют автоматические тесты в qwentopt.  
**Conditera не проверен** — отсутствует доступ к репозиторию.

---

## 🎯 Цель

Обеспечить отсутствие регрессий при конвергенции qwentopt и Conditera через комплексное тестирование.

---

## 📋 Типы тестов

### 1. Unit тесты

**Цель:** Проверка отдельных компонентов и функций

**Покрытие:**
- Компоненты React
- Утилиты
- Хуки
- Адаптеры интеграций
- Расчёт стоимости

**Инструменты:**
- Jest
- React Testing Library

**Примеры:**

```typescript
// Тест расчёта стоимости конструктора
describe('Cake Constructor Price Calculation', () => {
  it('should calculate base price correctly', () => {
    const price = calculatePrice({
      category: 'Торт',
      weight: 2,
      decor: [],
      coating: ''
    });
    expect(price).toBe(1500 + (2 * 1200)); // 3900
  });

  it('should add decor price', () => {
    const price = calculatePrice({
      category: 'Торт',
      weight: 2,
      decor: ['Живые цветы', 'Ягоды'],
      coating: ''
    });
    expect(price).toBe(1500 + (2 * 1200) + (2 * 500)); // 4900
  });

  it('should add coating price', () => {
    const price = calculatePrice({
      category: 'Торт',
      weight: 2,
      decor: [],
      coating: 'Крем-чиз'
    });
    expect(price).toBe(1500 + (2 * 1200) + 800); // 4700
  });
});

// Тест валидации email
describe('Email Validation', () => {
  it('should accept valid email', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
  });

  it('should reject invalid email', () => {
    expect(isValidEmail('invalid-email')).toBe(false);
  });
});

// Тест адаптера YooKassa
describe('YooKassa Adapter', () => {
  it('should create payment in local mode', async () => {
    const adapter = new YooKassaAdapter({ mode: 'local' });
    const result = await adapter.execute('createPayment', {
      orderId: 'test-order',
      amount: 1000,
      currency: 'RUB',
      description: 'Test payment'
    });
    expect(result.success).toBe(true);
    expect(result.data.status).toBe('pending');
  });
});
```

**Критерии приёмки:**
- ✅ Покрытие > 80%
- ✅ Все тесты проходят
- ✅ Нет flaky тестов

---

### 2. Integration тесты

**Цель:** Проверка взаимодействия между компонентами

**Покрытие:**
- API endpoints
- Supabase queries
- Интеграции
- Бизнес-логика

**Инструменты:**
- Jest
- Supabase Testing Library

**Примеры:**

```typescript
// Тест создания заказа
describe('Order Creation', () => {
  it('should create order with valid data', async () => {
    const order = await createOrder({
      buyerId: 'user-1',
      sellerId: 'user-2',
      productId: 'product-1',
      total: 2800,
      deliveryDate: '2026-01-20'
    });
    expect(order.id).toBeDefined();
    expect(order.status).toBe('new');
  });

  it('should reject order with invalid total', async () => {
    await expect(createOrder({
      buyerId: 'user-1',
      sellerId: 'user-2',
      productId: 'product-1',
      total: -100,
      deliveryDate: '2026-01-20'
    })).rejects.toThrow('Invalid total');
  });
});

// Тест RLS policies
describe('RLS Policies', () => {
  it('should allow user to see own orders', async () => {
    const orders = await getOrdersForUser('user-1');
    expect(orders.every(o => o.buyerId === 'user-1')).toBe(true);
  });

  it('should prevent user from seeing other orders', async () => {
    const orders = await getOrdersForUser('user-1');
    expect(orders.some(o => o.buyerId !== 'user-1')).toBe(false);
  });
});

// Тест webhook обработки
describe('YooKassa Webhook', () => {
  it('should process payment.succeeded event', async () => {
    const result = await handleWebhook({
      event: 'payment.succeeded',
      object: {
        id: 'payment-1',
        status: 'succeeded',
        amount: { value: '1000.00', currency: 'RUB' }
      }
    });
    expect(result.success).toBe(true);
  });

  it('should reject duplicate webhook', async () => {
    await handleWebhook({ event: 'payment.succeeded', object: { id: 'payment-1' } });
    await expect(handleWebhook({ event: 'payment.succeeded', object: { id: 'payment-1' } }))
      .rejects.toThrow('Duplicate webhook');
  });
});
```

**Критерии приёмки:**
- ✅ Покрытие > 70%
- ✅ Все тесты проходят
- ✅ Нет flaky тестов

---

### 3. E2E тесты

**Цель:** Проверка полных пользовательских сценариев

**Покрытие:**
- 14 ключевых пользовательских сценариев
- Все 18 ролей
- Критические бизнес-процессы

**Инструменты:**
- Playwright
- Cypress

**Примеры:**

```typescript
// Тест сценария 3: Покупатель → каталог → карточка → корзина → заказ
test('Customer can complete purchase flow', async ({ page }) => {
  // Вход как клиент
  await page.goto('/auth');
  await page.fill('[data-testid="email"]', 'maria@mail.ru');
  await page.fill('[data-testid="password"]', 'password');
  await page.click('[data-testid="login-button"]');
  
  // Переход в каталог
  await page.goto('/catalog');
  await expect(page.locator('[data-testid="product-card"]')).toHaveCount(9);
  
  // Выбор товара
  await page.click('[data-testid="product-card"]:first-child');
  await expect(page.locator('[data-testid="product-name"]')).toBeVisible();
  
  // Добавление в корзину
  await page.click('[data-testid="add-to-cart"]');
  await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
  
  // Переход в корзину
  await page.goto('/cart');
  await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1);
  
  // Оформление заказа
  await page.fill('[data-testid="delivery-date"]', '2026-01-20');
  await page.fill('[data-testid="notes"]', 'Test order');
  await page.click('[data-testid="checkout-button"]');
  
  // Проверка создания заказа
  await expect(page).toHaveURL('/dashboard/orders');
  await expect(page.locator('[data-testid="order-item"]:first-child')).toContainText('Test order');
});

// Тест сценария 5: Кондитер → получение заказа → принятие → производство → завершение
test('Confectioner can process order', async ({ page }) => {
  // Вход как кондитер
  await page.goto('/auth');
  await page.fill('[data-testid="email"]', 'anna@conditera.ru');
  await page.click('[data-testid="login-button"]');
  
  // Переход в заказы
  await page.goto('/dashboard/orders');
  
  // Принятие заказа
  await page.click('[data-testid="order-item"]:first-child [data-testid="accept-button"]');
  await expect(page.locator('[data-testid="order-status"]:first-child')).toHaveText('accepted');
  
  // Начало производства
  await page.click('[data-testid="order-item"]:first-child [data-testid="start-production-button"]');
  await expect(page.locator('[data-testid="order-status"]:first-child')).toHaveText('in_production');
  
  // Завершение
  await page.click('[data-testid="order-item"]:first-child [data-testid="complete-button"]');
  await expect(page.locator('[data-testid="order-status"]:first-child')).toHaveText('completed');
});

// Тест сценария 4: Покупатель → заказ → чат → отправка сообщения → перезагрузка → сохранённая переписка
test('Chat messages persist after reload', async ({ page }) => {
  // Вход как клиент
  await page.goto('/auth');
  await page.fill('[data-testid="email"]', 'maria@mail.ru');
  await page.click('[data-testid="login-button"]');
  
  // Переход в чат
  await page.goto('/chat');
  
  // Отправка сообщения
  await page.fill('[data-testid="message-input"]', 'Test message');
  await page.click('[data-testid="send-button"]');
  await expect(page.locator('[data-testid="message"]:last-child')).toContainText('Test message');
  
  // Перезагрузка страницы
  await page.reload();
  
  // Проверка сохранения сообщения
  await expect(page.locator('[data-testid="message"]:last-child')).toContainText('Test message');
});
```

**Критерии приёмки:**
- ✅ Все 14 сценариев проходят
- ✅ Все 18 ролей протестированы
- ✅ Нет flaky тестов
- ✅ Время выполнения < 10 минут

---

### 4. Визуальные тесты

**Цель:** Проверка визуального соответствия

**Покрытие:**
- Все страницы
- Все компоненты
- Все состояния (loading, error, empty)
- Адаптивность

**Инструменты:**
- Playwright screenshots
- Percy
- Chromatic

**Примеры:**

```typescript
// Визуальный тест главной страницы
test('Home page visual regression', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('home-page.png', {
    maxDiffPixelRatio: 0.01
  });
});

// Визуальный тест каталога
test('Catalog page visual regression', async ({ page }) => {
  await page.goto('/catalog');
  await expect(page).toHaveScreenshot('catalog-page.png', {
    maxDiffPixelRatio: 0.01
  });
});

// Визуальный тест конструктора
test('Constructor page visual regression', async ({ page }) => {
  await page.goto('/constructor');
  await expect(page).toHaveScreenshot('constructor-page.png', {
    maxDiffPixelRatio: 0.01
  });
});
```

**Критерии приёмки:**
- ✅ Все скриншоты совпадают
- ✅ Нет визуальных регрессий
- ✅ Адаптивность проверена

---

### 5. Тесты безопасности

**Цель:** Проверка безопасности приложения

**Покрытие:**
- Авторизация и аутентификация
- Права доступа
- Защита от атак
- Валидация данных
- Защита секретов

**Инструменты:**
- OWASP ZAP
- Burp Suite
- Snyk

**Примеры:**

```typescript
// Тест защиты от IDOR
test('User cannot access other user orders', async ({ request }) => {
  const response = await request.get('/api/orders/other-user-order-id', {
    headers: { Authorization: 'Bearer user-1-token' }
  });
  expect(response.status()).toBe(403);
});

// Тест защиты от XSS
test('XSS attack is prevented', async ({ page }) => {
  await page.goto('/product/1');
  await page.fill('[data-testid="review-input"]', '<script>alert("xss")</script>');
  await page.click('[data-testid="submit-review"]');
  await expect(page.locator('script')).toHaveCount(0);
});

// Тест защиты от CSRF
test('CSRF token is required', async ({ request }) => {
  const response = await request.post('/api/orders', {
    data: { productId: 'product-1' }
  });
  expect(response.status()).toBe(403);
});
```

**Критерии приёмки:**
- ✅ Все уязвимости устранены
- ✅ Нет критических багов безопасности
- ✅ Секреты не раскрываются

---

### 6. Нагрузочные тесты

**Цель:** Проверка производительности под нагрузкой

**Покрытие:**
- API endpoints
- База данных
- Интеграции
- Frontend

**Инструменты:**
- k6
- Artillery
- Lighthouse

**Примеры:**

```javascript
// k6 тест API
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },
    { duration: '3m', target: 100 },
    { duration: '1m', target: 0 }
  ]
};

export default function () {
  const res = http.get('https://api.conditera.ru/catalog');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500
  });
  sleep(1);
}
```

**Критерии приёмки:**
- ✅ Время ответа API < 500 мс (95-й перцентиль)
- ✅ Время загрузки страницы < 2 сек
- ✅ Нет ошибок под нагрузкой
- ✅ Масштабируемость до 10000 пользователей

---

## 📊 Матрица тестирования

| Тип теста | Количество | Покрытие | Приоритет | Статус |
|-----------|------------|----------|-----------|--------|
| Unit тесты | ~100 | 80% | P1 | ❌ Не написаны |
| Integration тесты | ~50 | 70% | P1 | ❌ Не написаны |
| E2E тесты | ~20 | 14 сценариев | P0 | ❌ Не написаны |
| Визуальные тесты | ~30 | Все страницы | P2 | ❌ Не написаны |
| Тесты безопасности | ~20 | Критические точки | P0 | ❌ Не написаны |
| Нагрузочные тесты | ~10 | API endpoints | P1 | ❌ Не написаны |
| **ИТОГО** | **~230** | **—** | **—** | **❌ 0%** |

---

## 🎯 Приоритеты тестирования

### P0 — Critical (обязательно перед production)

1. **E2E тесты 14 пользовательских сценариев**
   - Регистрация → вход → профиль
   - OAuth → callback → профиль
   - Каталог → карточка → корзина → заказ
   - Заказ → чат → перезагрузка
   - Кондитер → заказ → производство
   - Рецепт → расчёт → списание
   - Недостаток → блокировка
   - Повторное списание
   - Запрос возврата
   - Платёж → webhook
   - Повторный webhook
   - Модерация → журнал
   - B2B → предложение
   - Поддержка → история

2. **Тесты безопасности**
   - Защита от IDOR
   - Защита от XSS
   - Защита от CSRF
   - Защита секретов
   - RLS policies

3. **Integration тесты критических операций**
   - Создание заказа
   - Обработка платежа
   - Списание склада
   - Webhook обработка

### P1 — High (обязательно после P0)

1. **Unit тесты компонентов**
   - Все React компоненты
   - Все утилиты
   - Все хуки
   - Все адаптеры

2. **Integration тесты API**
   - Все API endpoints
   - Все Supabase queries
   - Все интеграции

3. **Нагрузочные тесты**
   - API endpoints
   - База данных
   - Frontend

### P2 — Medium (желательно)

1. **Визуальные тесты**
   - Все страницы
   - Все компоненты
   - Все состояния

2. **Дополнительные E2E тесты**
   - Все 18 ролей
   - Все интеграции
   - Все сценарии

---

## 📋 Чек-лист тестирования перед каждым этапом конвергенции

### Перед Этапом 1: Дизайн-система

- [ ] Визуальные тесты всех страниц (baseline)
- [ ] E2E тесты навигации
- [ ] Проверка адаптивности
- [ ] Проверка доступности

### Перед Этапом 2: Ролевая модель

- [ ] Unit тесты RLS policies
- [ ] Integration тесты прав доступа
- [ ] E2E тесты для каждой роли
- [ ] Тесты безопасности

### Перед Этапом 3: Интеграции

- [ ] Unit тесты адаптеров
- [ ] Integration тесты интеграций
- [ ] Тесты webhook обработки
- [ ] Тесты безопасности

### Перед Этапом 4: Тестирование

- [ ] Все unit тесты проходят
- [ ] Все integration тесты проходят
- [ ] Все E2E тесты проходят
- [ ] Все визуальные тесты проходят
- [ ] Все тесты безопасности проходят
- [ ] Нагрузочные тесты проходят

---

## 🚨 Критерии остановки

Немедленно остановить конвергенцию, если:

1. **Обнаружена критическая уязвимость безопасности**
   - Утечка данных
   - Возможность несанкционированного доступа
   - Возможность финансовых потерь

2. **Обнаружена потеря данных**
   - Потеря заказов
   - Потеря платежей
   - Потеря пользовательских данных

3. **Обнаружена критическая регрессия**
   - Поломка ключевого функционала
   - Невозможность完成 пользовательских сценариев
   - Критические ошибки

4. **Производительность ниже критического уровня**
   - Время ответа API > 2 сек
   - Время загрузки страницы > 5 сек
   - Ошибки под нагрузкой

---

## 📝 Рекомендации

### Немедленные действия

1. **Написать E2E тесты для 14 сценариев**
   - Приоритет P0
   - Срок: 1 неделя
   - Ответственный: QA инженер

2. **Написать тесты безопасности**
   - Приоритет P0
   - Срок: 1 неделя
   - Ответственный: Security инженер

3. **Настроить CI/CD для тестов**
   - Приоритет P1
   - Срок: 3 дня
   - Ответственный: DevOps инженер

### Стратегические рекомендации

1. **Тестировать на каждом этапе**
   - Не откладывать тестирование
   - Проверять каждый этап конвергенции
   - Иметь план отката

2. **Использовать автоматизацию**
   - Автоматические тесты
   - Автоматическая проверка покрытия
   - Автоматическая проверка безопасности

3. **Иметь план отката**
   - Backup перед каждым этапом
   - Возможность отката
   - Мониторинг после каждого этапа

---

**Подпись:** AI Assistant  
**Дата:** 2026-01-15  
**Версия:** 1.0  
**Статус:** ⚠️ PARTIAL — тесты не написаны, Conditera не проверен
