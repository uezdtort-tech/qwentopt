/**
 * Тесты для Visual Constructor V2
 * 
 * Проверяют:
 * - Базовую функциональность
 * - Undo/redo
 * - Автосохранение
 * - Экспорт/импорт
 * - Доступность
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { VisualConstructorV2Page } from './VisualConstructorV2Page';

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

describe('Visual Constructor V2', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe('Базовая функциональность', () => {
    it('должен рендериться без ошибок', () => {
      render(<VisualConstructorV2Page />);
      expect(screen.getByText('Визуальный конструктор V2')).toBeInTheDocument();
    });

    it('должен отображать превью торта', () => {
      render(<VisualConstructorV2Page />);
      expect(screen.getByRole('img', { name: /превью торта/i })).toBeInTheDocument();
    });

    it('должен отображать форму для выбора формы торта', () => {
      render(<VisualConstructorV2Page />);
      expect(screen.getByText('Круглый')).toBeInTheDocument();
      expect(screen.getByText('Квадратный')).toBeInTheDocument();
      expect(screen.getByText('Сердце')).toBeInTheDocument();
    });

    it('должен отображать форму для выбора размера', () => {
      render(<VisualConstructorV2Page />);
      expect(screen.getByText('Малый')).toBeInTheDocument();
      expect(screen.getByText('Средний')).toBeInTheDocument();
      expect(screen.getByText('Большой')).toBeInTheDocument();
    });

    it('должен отображать количество слоёв', () => {
      render(<VisualConstructorV2Page />);
      expect(screen.getByText('Количество слоёв:')).toBeInTheDocument();
    });
  });

  describe('Изменение параметров', () => {
    it('должен изменять форму торта при клике', () => {
      render(<VisualConstructorV2Page />);
      const squareButton = screen.getByRole('radio', { name: /квадратный/i });
      fireEvent.click(squareButton);
      expect(squareButton).toHaveAttribute('aria-checked', 'true');
    });

    it('должен изменять размер торта при клике', () => {
      render(<VisualConstructorV2Page />);
      const largeButton = screen.getByRole('radio', { name: /большой/i });
      fireEvent.click(largeButton);
      expect(largeButton).toHaveAttribute('aria-checked', 'true');
    });

    it('должен увеличивать количество слоёв при клике на +', () => {
      render(<VisualConstructorV2Page />);
      const addButton = screen.getByRole('button', { name: /увеличить количество слоёв/i });
      fireEvent.click(addButton);
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('должен уменьшать количество слоёв при клике на -', () => {
      render(<VisualConstructorV2Page />);
      const removeButton = screen.getByRole('button', { name: /уменьшить количество слоёв/i });
      fireEvent.click(removeButton);
      expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('должен не позволять уменьшить количество слоёв ниже 1', () => {
      render(<VisualConstructorV2Page />);
      const removeButton = screen.getByRole('button', { name: /уменьшить количество слоёв/i });
      
      // Уменьшаем до 1
      fireEvent.click(removeButton);
      expect(removeButton).toBeDisabled();
    });

    it('должен не позволять увеличить количество слоёв выше 5', () => {
      render(<VisualConstructorV2Page />);
      const addButton = screen.getByRole('button', { name: /увеличить количество слоёв/i });
      
      // Увеличиваем до 5
      for (let i = 0; i < 3; i++) {
        fireEvent.click(addButton);
      }
      expect(addButton).toBeDisabled();
    });
  });

  describe('Декор', () => {
    it('должен добавлять декор при клике', () => {
      render(<VisualConstructorV2Page />);
      const flowersButton = screen.getByRole('checkbox', { name: /цветы/i });
      fireEvent.click(flowersButton);
      expect(flowersButton).toHaveAttribute('aria-checked', 'true');
    });

    it('должен удалять декор при повторном клике', () => {
      render(<VisualConstructorV2Page />);
      const flowersButton = screen.getByRole('checkbox', { name: /цветы/i });
      
      // Добавляем
      fireEvent.click(flowersButton);
      expect(flowersButton).toHaveAttribute('aria-checked', 'true');
      
      // Удаляем
      fireEvent.click(flowersButton);
      expect(flowersButton).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('Надпись', () => {
    it('должен позволять вводить надпись', () => {
      render(<VisualConstructorV2Page />);
      const inscriptionInput = screen.getByLabelText(/надпись/i);
      fireEvent.change(inscriptionInput, { target: { value: 'С Днём Рождения!' } });
      expect(inscriptionInput).toHaveValue('С Днём Рождения!');
    });

    it('должен показывать счётчик символов', () => {
      render(<VisualConstructorV2Page />);
      const inscriptionInput = screen.getByLabelText(/надпись/i);
      fireEvent.change(inscriptionInput, { target: { value: 'Тест' } });
      expect(screen.getByText('4/30 символов')).toBeInTheDocument();
    });

    it('должен ограничивать длину надписи 30 символами', () => {
      render(<VisualConstructorV2Page />);
      const inscriptionInput = screen.getByLabelText(/надпись/i);
      const longText = 'а'.repeat(35);
      fireEvent.change(inscriptionInput, { target: { value: longText } });
      expect(inscriptionInput).toHaveValue('а'.repeat(30));
    });
  });

  describe('Расчёт цены', () => {
    it('должен отображать итоговую цену', () => {
      render(<VisualConstructorV2Page />);
      expect(screen.getByText('Итого:')).toBeInTheDocument();
      expect(screen.getByText('2 500 ₽')).toBeInTheDocument(); // Базовая цена для среднего размера
    });

    it('должен увеличивать цену при добавлении слоёв', () => {
      render(<VisualConstructorV2Page />);
      const addButton = screen.getByRole('button', { name: /увеличить количество слоёв/i });
      fireEvent.click(addButton);
      expect(screen.getByText('2 800 ₽')).toBeInTheDocument(); // 2500 + 300
    });

    it('должен увеличивать цену при добавлении декора', () => {
      render(<VisualConstructorV2Page />);
      const flowersButton = screen.getByRole('checkbox', { name: /цветы/i });
      fireEvent.click(flowersButton);
      expect(screen.getByText('2 700 ₽')).toBeInTheDocument(); // 2500 + 200
    });

    it('должен увеличивать цену при добавлении надписи', () => {
      render(<VisualConstructorV2Page />);
      const inscriptionInput = screen.getByLabelText(/надпись/i);
      fireEvent.change(inscriptionInput, { target: { value: 'Тест' } });
      expect(screen.getByText('2 650 ₽')).toBeInTheDocument(); // 2500 + 150
    });
  });

  describe('Undo/Redo', () => {
    it('должен отменять последнее изменение при Ctrl+Z', () => {
      render(<VisualConstructorV2Page />);
      
      // Изменяем параметр
      const addButton = screen.getByRole('button', { name: /увеличить количество слоёв/i });
      fireEvent.click(addButton);
      expect(screen.getByText('3')).toBeInTheDocument();
      
      // Отменяем
      fireEvent.keyDown(window, { key: 'z', ctrlKey: true });
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('должен повторять отменённое изменение при Ctrl+Y', () => {
      render(<VisualConstructorV2Page />);
      
      // Изменяем параметр
      const addButton = screen.getByRole('button', { name: /увеличить количество слоёв/i });
      fireEvent.click(addButton);
      expect(screen.getByText('3')).toBeInTheDocument();
      
      // Отменяем
      fireEvent.keyDown(window, { key: 'z', ctrlKey: true });
      expect(screen.getByText('2')).toBeInTheDocument();
      
      // Повторяем
      fireEvent.keyDown(window, { key: 'y', ctrlKey: true });
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('должен отключать кнопку undo при отсутствии истории', () => {
      render(<VisualConstructorV2Page />);
      const undoButton = screen.getByRole('button', { name: /отменить/i });
      expect(undoButton).toBeDisabled();
    });

    it('должен отключать кнопку redo при отсутствии будущей истории', () => {
      render(<VisualConstructorV2Page />);
      const redoButton = screen.getByRole('button', { name: /повторить/i });
      expect(redoButton).toBeDisabled();
    });
  });

  describe('Автосохранение', () => {
    it('должен сохранять конфигурацию в localStorage при изменении', () => {
      render(<VisualConstructorV2Page />);
      
      const addButton = screen.getByRole('button', { name: /увеличить количество слоёв/i });
      fireEvent.click(addButton);
      
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });

    it('должен загружать конфигурацию из localStorage при монтировании', () => {
      const savedConfig = {
        shape: 'square',
        layers: 3,
        layerColors: ['#FFF8DC', '#6B4423', '#FFB6C1'],
        frostingColor: '#FFD700',
        decorations: ['flowers', 'berries'],
        inscription: 'Тест',
        size: 'large',
      };
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(savedConfig));
      
      render(<VisualConstructorV2Page />);
      
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  describe('Экспорт/Импорт', () => {
    it('должен отображать кнопку экспорта', () => {
      render(<VisualConstructorV2Page />);
      expect(screen.getByRole('button', { name: /экспортировать/i })).toBeInTheDocument();
    });

    it('должен отображать кнопку импорта', () => {
      render(<VisualConstructorV2Page />);
      expect(screen.getByLabelText(/импортировать/i)).toBeInTheDocument();
    });
  });

  describe('Сброс', () => {
    it('должен отображать кнопку сброса', () => {
      render(<VisualConstructorV2Page />);
      expect(screen.getByRole('button', { name: /сбросить/i })).toBeInTheDocument();
    });

    it('должен запрашивать подтверждение при сбросе', () => {
      const confirmMock = vi.spyOn(window, 'confirm').mockReturnValue(false);
      
      render(<VisualConstructorV2Page />);
      const resetButton = screen.getByRole('button', { name: /сбросить/i });
      fireEvent.click(resetButton);
      
      expect(confirmMock).toHaveBeenCalledWith('Вы уверены, что хотите сбросить все настройки?');
      
      confirmMock.mockRestore();
    });
  });

  describe('Доступность', () => {
    it('должен иметь правильные ARIA labels для формы торта', () => {
      render(<VisualConstructorV2Page />);
      expect(screen.getByRole('radiogroup', { name: /выберите форму торта/i })).toBeInTheDocument();
    });

    it('должен иметь правильные ARIA labels для размера', () => {
      render(<VisualConstructorV2Page />);
      expect(screen.getByRole('radiogroup', { name: /выберите размер торта/i })).toBeInTheDocument();
    });

    it('должен иметь правильные ARIA labels для декора', () => {
      render(<VisualConstructorV2Page />);
      expect(screen.getByRole('group', { name: /выберите декор/i })).toBeInTheDocument();
    });

    it('должен иметь правильные ARIA labels для глазури', () => {
      render(<VisualConstructorV2Page />);
      expect(screen.getByRole('radiogroup', { name: /выберите цвет глазури/i })).toBeInTheDocument();
    });

    it('должен иметь live region для количества слоёв', () => {
      render(<VisualConstructorV2Page />);
      expect(screen.getByText('2')).toHaveAttribute('aria-live', 'polite');
    });

    it('должен иметь live region для итоговой цены', () => {
      render(<VisualConstructorV2Page />);
      expect(screen.getByText('2 500 ₽')).toHaveAttribute('aria-live', 'polite');
    });

    it('должен иметь live region для счётчика символов', () => {
      render(<VisualConstructorV2Page />);
      expect(screen.getByText('0/30 символов')).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Keyboard navigation', () => {
    it('должен поддерживать Ctrl+S для сохранения', () => {
      const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
      
      render(<VisualConstructorV2Page />);
      fireEvent.keyDown(window, { key: 's', ctrlKey: true });
      
      // Сохранение должно сработать (проверяем через localStorage)
      expect(localStorageMock.setItem).toHaveBeenCalled();
      
      alertMock.mockRestore();
    });
  });
});
