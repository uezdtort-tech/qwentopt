/**
 * Тесты для B2B Marketplace V2
 * 
 * Проверяют:
 * - Валидацию форм
 * - Расчёт себестоимости
 * - Сравнение товаров
 * - Сохранение в localStorage
 * - Обработку ошибок
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { B2BMarketplacePage } from './B2BMarketplacePage';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock alert
window.alert = vi.fn();

describe('B2B Marketplace V2', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe('Базовая функциональность', () => {
    it('должен рендериться без ошибок', () => {
      render(<B2BMarketplacePage />);
      expect(screen.getByText('B2B Marketplace')).toBeInTheDocument();
    });

    it('должен отображать DEMO баннер', () => {
      render(<B2BMarketplacePage />);
      expect(screen.getByText(/DEMO:/)).toBeInTheDocument();
    });

    it('должен отображать вкладки', () => {
      render(<B2BMarketplacePage />);
      expect(screen.getByText('Поставщики')).toBeInTheDocument();
      expect(screen.getByText('Товары')).toBeInTheDocument();
      expect(screen.getByText('Тендеры')).toBeInTheDocument();
      expect(screen.getByText('Сравнение')).toBeInTheDocument();
      expect(screen.getByText('Калькулятор')).toBeInTheDocument();
    });
  });

  describe('Поиск и фильтрация', () => {
    it('должен фильтровать поставщиков по поисковому запросу', async () => {
      render(<B2BMarketplacePage />);
      const searchInput = screen.getByPlaceholderText('Поиск...');
      
      await userEvent.type(searchInput, 'Молочный');
      
      expect(screen.getByText('Молочный комбинат "Заречье"')).toBeInTheDocument();
    });

    it('должен фильтровать по категории', async () => {
      render(<B2BMarketplacePage />);
      const categorySelect = screen.getByRole('combobox');
      
      await userEvent.selectOptions(categorySelect, 'Молочные продукты');
      
      expect(screen.getByText('Молочный комбинат "Заречье"')).toBeInTheDocument();
    });

    it('должен показывать пустое состояние при отсутствии результатов', async () => {
      render(<B2BMarketplacePage />);
      const searchInput = screen.getByPlaceholderText('Поиск...');
      
      await userEvent.type(searchInput, 'несуществующий_поставщик');
      
      expect(screen.getByText('Ничего не найдено')).toBeInTheDocument();
    });
  });

  describe('Сравнение товаров', () => {
    it('должен добавлять товар в список сравнения', async () => {
      render(<B2BMarketplacePage />);
      
      // Перейти на вкладку товаров
      await userEvent.click(screen.getByText('Товары'));
      
      // Найти кнопку "Сравнить"
      const compareButtons = screen.getAllByText('Сравнить');
      await userEvent.click(compareButtons[0]);
      
      // Проверить счётчик
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('должен ограничивать сравнение 4 товарами', async () => {
      render(<B2BMarketplacePage />);
      await userEvent.click(screen.getByText('Товары'));
      
      const compareButtons = screen.getAllByText('Сравнить');
      
      // Добавить 4 товара
      for (let i = 0; i < 4; i++) {
        await userEvent.click(compareButtons[i]);
      }
      
      // Попытаться добавить 5-й
      await userEvent.click(compareButtons[4]);
      
      expect(window.alert).toHaveBeenCalledWith('Можно сравнить максимум 4 товара');
    });

    it('должен удалять товар из списка сравнения', async () => {
      render(<B2BMarketplacePage />);
      await userEvent.click(screen.getByText('Товары'));
      
      const compareButtons = screen.getAllByText('Сравнить');
      await userEvent.click(compareButtons[0]);
      
      // Удалить из сравнения
      const removeButton = screen.getByText('В сравнении');
      await userEvent.click(removeButton);
      
      expect(screen.queryByText('1')).not.toBeInTheDocument();
    });
  });

  describe('Калькулятор себестоимости', () => {
    it('должен добавлять ингредиенты', async () => {
      render(<B2BMarketplacePage />);
      await userEvent.click(screen.getByText('Калькулятор'));
      
      const addButton = screen.getByText('Добавить ингредиент');
      await userEvent.click(addButton);
      
      expect(screen.getByText('Выберите товар')).toBeInTheDocument();
    });

    it('должен рассчитывать стоимость', async () => {
      render(<B2BMarketplacePage />);
      await userEvent.click(screen.getByText('Калькулятор'));
      
      const addButton = screen.getByText('Добавить ингредиент');
      await userEvent.click(addButton);
      
      // Выбрать товар
      const select = screen.getByRole('combobox');
      await userEvent.selectOptions(select, 'p1'); // Масло сливочное
      
      // Ввести количество
      const quantityInput = screen.getByPlaceholderText('Кол-во');
      await userEvent.type(quantityInput, '5');
      
      // Проверить расчёт
      expect(screen.getByText('4 000 ₽')).toBeInTheDocument(); // 800 * 5
    });

    it('должен удалять ингредиенты', async () => {
      render(<B2BMarketplacePage />);
      await userEvent.click(screen.getByText('Калькулятор'));
      
      const addButton = screen.getByText('Добавить ингредиент');
      await userEvent.click(addButton);
      
      const removeButton = screen.getByRole('button', { name: /удалить/i });
      await userEvent.click(removeButton);
      
      expect(screen.queryByText('Выберите товар')).not.toBeInTheDocument();
    });
  });

  describe('Контактный запрос', () => {
    it('должен открывать форму при клике на "Связаться"', async () => {
      render(<B2BMarketplacePage />);
      
      const contactButtons = screen.getAllByText('Связаться');
      await userEvent.click(contactButtons[0]);
      
      expect(screen.getByText('Связаться с поставщиком')).toBeInTheDocument();
    });

    it('должен валидировать обязательные поля', async () => {
      render(<B2BMarketplacePage />);
      
      const contactButtons = screen.getAllByText('Связаться');
      await userEvent.click(contactButtons[0]);
      
      const submitButton = screen.getByText('Отправить');
      await userEvent.click(submitButton);
      
      expect(screen.getByText('Имя обязательно')).toBeInTheDocument();
      expect(screen.getByText('Email обязателен')).toBeInTheDocument();
      expect(screen.getByText('Телефон обязателен')).toBeInTheDocument();
      expect(screen.getByText('Сообщение обязательно')).toBeInTheDocument();
    });

    it('должен валидировать формат email', async () => {
      render(<B2BMarketplacePage />);
      
      const contactButtons = screen.getAllByText('Связаться');
      await userEvent.click(contactButtons[0]);
      
      const emailInput = screen.getByPlaceholderText('your@email.com');
      await userEvent.type(emailInput, 'invalid-email');
      
      const submitButton = screen.getByText('Отправить');
      await userEvent.click(submitButton);
      
      expect(screen.getByText('Некорректный формат email')).toBeInTheDocument();
    });

    it('должен валидировать формат телефона', async () => {
      render(<B2BMarketplacePage />);
      
      const contactButtons = screen.getAllByText('Связаться');
      await userEvent.click(contactButtons[0]);
      
      const phoneInput = screen.getByPlaceholderText('+7 (900) 123-45-67');
      await userEvent.type(phoneInput, '123');
      
      const submitButton = screen.getByText('Отправить');
      await userEvent.click(submitButton);
      
      expect(screen.getByText('Некорректный формат телефона')).toBeInTheDocument();
    });

    it('должен валидировать минимальную длину сообщения', async () => {
      render(<B2BMarketplacePage />);
      
      const contactButtons = screen.getAllByText('Связаться');
      await userEvent.click(contactButtons[0]);
      
      const messageInput = screen.getByPlaceholderText('Опишите ваш запрос...');
      await userEvent.type(messageInput, 'короткое');
      
      const submitButton = screen.getByText('Отправить');
      await userEvent.click(submitButton);
      
      expect(screen.getByText('Сообщение должно содержать минимум 10 символов')).toBeInTheDocument();
    });

    it('должен отправлять запрос при валидных данных', async () => {
      render(<B2BMarketplacePage />);
      
      const contactButtons = screen.getAllByText('Связаться');
      await userEvent.click(contactButtons[0]);
      
      // Заполнить форму
      await userEvent.type(screen.getByPlaceholderText('Ваше имя'), 'Иван Иванов');
      await userEvent.type(screen.getByPlaceholderText('your@email.com'), 'ivan@example.com');
      await userEvent.type(screen.getByPlaceholderText('+7 (900) 123-45-67'), '+79001234567');
      await userEvent.type(screen.getByPlaceholderText('Опишите ваш запрос...'), 'Интересует ваше предложение по молочным продуктам');
      
      const submitButton = screen.getByText('Отправить');
      await userEvent.click(submitButton);
      
      // Проверить состояние отправки
      await waitFor(() => {
        expect(screen.getByText('Запрос отправлен!')).toBeInTheDocument();
      });
    });
  });

  describe('Закупочный запрос', () => {
    it('должен открывать форму при клике на "Заказать"', async () => {
      render(<B2BMarketplacePage />);
      await userEvent.click(screen.getByText('Товары'));
      
      const orderButtons = screen.getAllByText('Заказать');
      await userEvent.click(orderButtons[0]);
      
      expect(screen.getByText('Закупка товара')).toBeInTheDocument();
    });

    it('должен валидировать минимальное количество', async () => {
      render(<B2BMarketplacePage />);
      await userEvent.click(screen.getByText('Товары'));
      
      const orderButtons = screen.getAllByText('Заказать');
      await userEvent.click(orderButtons[0]);
      
      const quantityInput = screen.getByPlaceholderText(/Мин\./);
      await userEvent.clear(quantityInput);
      await userEvent.type(quantityInput, '1');
      
      const submitButton = screen.getByText('Создать запрос');
      await userEvent.click(submitButton);
      
      expect(screen.getByText(/Минимальное количество/)).toBeInTheDocument();
    });

    it('должен валидировать целое число', async () => {
      render(<B2BMarketplacePage />);
      await userEvent.click(screen.getByText('Товары'));
      
      const orderButtons = screen.getAllByText('Заказать');
      await userEvent.click(orderButtons[0]);
      
      const quantityInput = screen.getByPlaceholderText(/Мин\./);
      await userEvent.clear(quantityInput);
      await userEvent.type(quantityInput, '5.5');
      
      const submitButton = screen.getByText('Создать запрос');
      await userEvent.click(submitButton);
      
      expect(screen.getByText('Количество должно быть целым числом')).toBeInTheDocument();
    });

    it('должен рассчитывать итоговую стоимость', async () => {
      render(<B2BMarketplacePage />);
      await userEvent.click(screen.getByText('Товары'));
      
      const orderButtons = screen.getAllByText('Заказать');
      await userEvent.click(orderButtons[0]);
      
      const quantityInput = screen.getByPlaceholderText(/Мин\./);
      await userEvent.clear(quantityInput);
      await userEvent.type(quantityInput, '10');
      
      expect(screen.getByText('8 000 ₽')).toBeInTheDocument(); // 800 * 10
    });

    it('должен создавать запрос при валидных данных', async () => {
      render(<B2BMarketplacePage />);
      await userEvent.click(screen.getByText('Товары'));
      
      const orderButtons = screen.getAllByText('Заказать');
      await userEvent.click(orderButtons[0]);
      
      const quantityInput = screen.getByPlaceholderText(/Мин\./);
      await userEvent.clear(quantityInput);
      await userEvent.type(quantityInput, '10');
      
      const submitButton = screen.getByText('Создать запрос');
      await userEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText('Запрос создан!')).toBeInTheDocument();
      });
    });
  });

  describe('Сохранение в localStorage', () => {
    it('должен сохранять контактные запросы', async () => {
      render(<B2BMarketplacePage />);
      
      const contactButtons = screen.getAllByText('Связаться');
      await userEvent.click(contactButtons[0]);
      
      await userEvent.type(screen.getByPlaceholderText('Ваше имя'), 'Иван Иванов');
      await userEvent.type(screen.getByPlaceholderText('your@email.com'), 'ivan@example.com');
      await userEvent.type(screen.getByPlaceholderText('+7 (900) 123-45-67'), '+79001234567');
      await userEvent.type(screen.getByPlaceholderText('Опишите ваш запрос...'), 'Интересует ваше предложение');
      
      await userEvent.click(screen.getByText('Отправить'));
      
      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'b2b-contact-requests',
          expect.any(String)
        );
      });
    });

    it('должен сохранять закупочные запросы', async () => {
      render(<B2BMarketplacePage />);
      await userEvent.click(screen.getByText('Товары'));
      
      const orderButtons = screen.getAllByText('Заказать');
      await userEvent.click(orderButtons[0]);
      
      const quantityInput = screen.getByPlaceholderText(/Мин\./);
      await userEvent.clear(quantityInput);
      await userEvent.type(quantityInput, '10');
      
      await userEvent.click(screen.getByText('Создать запрос'));
      
      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          'b2b-purchase-requests',
          expect.any(String)
        );
      });
    });

    it('должен загружать сохранённые запросы при монтировании', () => {
      const savedRequests = [
        {
          id: 'cr-123',
          supplierId: 's1',
          name: 'Иван Иванов',
          email: 'ivan@example.com',
          phone: '+79001234567',
          message: 'Тестовый запрос',
          status: 'sent',
          createdAt: new Date().toISOString(),
        },
      ];
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedRequests));
      
      render(<B2BMarketplacePage />);
      
      expect(screen.getByText('Мои запросы (DEMO)')).toBeInTheDocument();
    });
  });

  describe('Обработка ошибок', () => {
    it('должен обрабатывать ошибки localStorage при чтении', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });
      
      render(<B2BMarketplacePage />);
      
      // Компонент должен отрендериться без ошибок
      expect(screen.getByText('B2B Marketplace')).toBeInTheDocument();
    });

    it('должен обрабатывать ошибки localStorage при записи', async () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });
      
      render(<B2BMarketplacePage />);
      
      const contactButtons = screen.getAllByText('Связаться');
      await userEvent.click(contactButtons[0]);
      
      await userEvent.type(screen.getByPlaceholderText('Ваше имя'), 'Иван Иванов');
      await userEvent.type(screen.getByPlaceholderText('your@email.com'), 'ivan@example.com');
      await userEvent.type(screen.getByPlaceholderText('+7 (900) 123-45-67'), '+79001234567');
      await userEvent.type(screen.getByPlaceholderText('Опишите ваш запрос...'), 'Тестовый запрос для проверки обработки ошибок');
      
      await userEvent.click(screen.getByText('Отправить'));
      
      // Компонент не должен упасть
      await waitFor(() => {
        expect(screen.getByText('Запрос отправлен!')).toBeInTheDocument();
      });
    });
  });

  describe('Повторные действия', () => {
    it('должен предотвращать повторную отправку контактного запроса', async () => {
      render(<B2BMarketplacePage />);
      
      const contactButtons = screen.getAllByText('Связаться');
      await userEvent.click(contactButtons[0]);
      
      await userEvent.type(screen.getByPlaceholderText('Ваше имя'), 'Иван Иванов');
      await userEvent.type(screen.getByPlaceholderText('your@email.com'), 'ivan@example.com');
      await userEvent.type(screen.getByPlaceholderText('+7 (900) 123-45-67'), '+79001234567');
      await userEvent.type(screen.getByPlaceholderText('Опишите ваш запрос...'), 'Тестовый запрос');
      
      const submitButton = screen.getByText('Отправить');
      await userEvent.click(submitButton);
      
      // Кнопка должна быть disabled во время отправки
      expect(submitButton).toBeDisabled();
    });

    it('должен предотвращать повторную отправку закупочного запроса', async () => {
      render(<B2BMarketplacePage />);
      await userEvent.click(screen.getByText('Товары'));
      
      const orderButtons = screen.getAllByText('Заказать');
      await userEvent.click(orderButtons[0]);
      
      const quantityInput = screen.getByPlaceholderText(/Мин\./);
      await userEvent.clear(quantityInput);
      await userEvent.type(quantityInput, '10');
      
      const submitButton = screen.getByText('Создать запрос');
      await userEvent.click(submitButton);
      
      // Кнопка должна быть disabled во время отправки
      expect(submitButton).toBeDisabled();
    });
  });
});
