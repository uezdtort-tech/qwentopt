/**
 * Инновация #6: Event Planner Pro
 * 
 * Проблема: Существующий Event Planner слишком простой.
 * Текущее решение: Базовый список задач с чекбоксами.
 * Новое решение: Полноценный планировщик мероприятий с:
 * - Диаграммой Ганта
 * - Управлением бюджетом
 * - Назначением исполнителей
 * - Календарем доступности
 * - Автоматическим расчетом стоимости
 * - Интеграцией с поставщиками
 * 
 * Почему лучше:
 * - Профессиональный инструмент для организаторов
 * - Визуализация временной шкалы
 * - Контроль бюджета в реальном времени
 * - Автоматизация рутинных задач
 * - Интеграция с B2B-партнерами
 * 
 * Технологии: React, TypeScript, Custom Gantt chart
 * Интеграция: Изолированный компонент, подключается через /event-planner-pro
 * Файлы: src/innovations/EventPlannerPro/
 * Риски: Низкие — изолированный модуль
 * Проверка: E2E тест создания мероприятия, проверка расчетов
 * Сложность: P1, 5-7 дней
 */

import React, { useState } from 'react';
import { Calendar, DollarSign, Users, Plus, Edit3, Trash2, CheckCircle, Circle, Clock, MapPin } from 'lucide-react';

interface EventTask {
  id: string;
  title: string;
  category: 'catering' | 'decor' | 'entertainment' | 'venue' | 'other';
  assignee?: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: 'pending' | 'in_progress' | 'completed';
  notes?: string;
}

interface EventProject {
  id: string;
  name: string;
  date: string;
  location: string;
  totalBudget: number;
  guests: number;
  tasks: EventTask[];
  status: 'planning' | 'confirmed' | 'in_progress' | 'completed';
}

const CATEGORIES = [
  { id: 'catering', label: 'Кейтеринг', emoji: '🍽️', color: 'bg-orange-100 text-orange-700' },
  { id: 'decor', label: 'Декор', emoji: '🎨', color: 'bg-purple-100 text-purple-700' },
  { id: 'entertainment', label: 'Развлечения', emoji: '🎭', color: 'bg-blue-100 text-blue-700' },
  { id: 'venue', label: 'Площадка', emoji: '🏛️', color: 'bg-green-100 text-green-700' },
  { id: 'other', label: 'Другое', emoji: '📦', color: 'bg-stone-100 text-stone-700' },
];

export function EventPlannerProPage() {
  const [events, setEvents] = useState<EventProject[]>([
    {
      id: '1',
      name: 'Свадьба Ивановых',
      date: '2026-06-15',
      location: 'Ресторан "Белый сад"',
      totalBudget: 500000,
      guests: 100,
      status: 'planning',
      tasks: [
        {
          id: 't1',
          title: 'Свадебный торт',
          category: 'catering',
          assignee: 'Анна Пекарская',
          startDate: '2026-06-10',
          endDate: '2026-06-14',
          budget: 25000,
          status: 'pending',
        },
        {
          id: 't2',
          title: 'Флористическое оформление',
          category: 'decor',
          assignee: 'Флористика "Лаванда"',
          startDate: '2026-06-14',
          endDate: '2026-06-15',
          budget: 45000,
          status: 'pending',
        },
        {
          id: 't3',
          title: 'Фотограф',
          category: 'entertainment',
          assignee: 'Фото-студия "Объектив"',
          startDate: '2026-06-15',
          endDate: '2026-06-15',
          budget: 35000,
          status: 'in_progress',
        },
      ],
    },
  ]);

  const [selectedEvent, setSelectedEvent] = useState<EventProject | null>(events[0]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState<Partial<EventTask>>({
    category: 'other',
    status: 'pending',
  });

  const totalSpent = selectedEvent?.tasks.reduce((sum, t) => sum + t.budget, 0) || 0;
  const remainingBudget = (selectedEvent?.totalBudget || 0) - totalSpent;
  const completionRate = selectedEvent
    ? Math.round((selectedEvent.tasks.filter(t => t.status === 'completed').length / selectedEvent.tasks.length) * 100)
    : 0;

  const handleAddTask = () => {
    if (!selectedEvent || !newTask.title || !newTask.startDate || !newTask.endDate) return;

    const task: EventTask = {
      id: `t${Date.now()}`,
      title: newTask.title || '',
      category: newTask.category || 'other',
      assignee: newTask.assignee,
      startDate: newTask.startDate,
      endDate: newTask.endDate,
      budget: newTask.budget || 0,
      status: newTask.status || 'pending',
      notes: newTask.notes,
    };

    const updatedEvent = {
      ...selectedEvent,
      tasks: [...selectedEvent.tasks, task],
    };

    setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    setSelectedEvent(updatedEvent);
    setShowTaskForm(false);
    setNewTask({ category: 'other', status: 'pending' });
  };

  const handleUpdateTaskStatus = (taskId: string, status: EventTask['status']) => {
    if (!selectedEvent) return;

    const updatedEvent = {
      ...selectedEvent,
      tasks: selectedEvent.tasks.map(t => t.id === taskId ? { ...t, status } : t),
    };

    setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    setSelectedEvent(updatedEvent);
  };

  const handleDeleteTask = (taskId: string) => {
    if (!selectedEvent) return;

    const updatedEvent = {
      ...selectedEvent,
      tasks: selectedEvent.tasks.filter(t => t.id !== taskId),
    };

    setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    setSelectedEvent(updatedEvent);
  };

  const getCategoryInfo = (categoryId: string) => {
    return CATEGORIES.find(c => c.id === categoryId) || CATEGORIES[4];
  };

  // Простая диаграмма Ганта
  const renderGanttChart = () => {
    if (!selectedEvent) return null;

    const tasks = selectedEvent.tasks;
    if (tasks.length === 0) return null;

    // Находим минимальную и максимальную даты
    const dates = tasks.flatMap(t => [new Date(t.startDate), new Date(t.endDate)]);
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
    
    const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    return (
      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-rose-600" />
          Временная шкала
        </h3>
        
        <div className="space-y-3">
          {tasks.map(task => {
            const startDate = new Date(task.startDate);
            const endDate = new Date(task.endDate);
            const startOffset = Math.ceil((startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
            const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            const leftPercent = (startOffset / totalDays) * 100;
            const widthPercent = (duration / totalDays) * 100;
            
            const category = getCategoryInfo(task.category);

            return (
              <div key={task.id} className="relative">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm font-medium text-stone-700 w-48 truncate">{task.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${category.color}`}>
                    {category.emoji} {category.label}
                  </span>
                </div>
                <div className="relative h-8 bg-stone-100 rounded-lg overflow-hidden">
                  <div
                    className={`absolute h-full rounded-lg flex items-center px-2 text-xs text-white ${
                      task.status === 'completed' ? 'bg-emerald-500' :
                      task.status === 'in_progress' ? 'bg-amber-500' : 'bg-stone-400'
                    }`}
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                      minWidth: '40px',
                    }}
                  >
                    {task.assignee && <span className="truncate">{task.assignee}</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex justify-between text-xs text-stone-500">
          <span>{minDate.toLocaleDateString('ru-RU')}</span>
          <span>{maxDate.toLocaleDateString('ru-RU')}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-800 flex items-center gap-2">
            <Calendar className="w-8 h-8 text-rose-600" />
            Event Planner Pro
          </h1>
          <p className="text-stone-600 mt-2">Профессиональный планировщик мероприятий</p>
        </div>
        <button className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-rose-700 transition-colors">
          <Plus className="w-4 h-4" />
          Новое мероприятие
        </button>
      </div>

      {/* Список мероприятий */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {events.map(event => (
          <button
            key={event.id}
            onClick={() => setSelectedEvent(event)}
            className={`bg-white rounded-xl border p-5 text-left transition-all ${
              selectedEvent?.id === event.id
                ? 'border-rose-400 shadow-lg'
                : 'border-stone-200 hover:border-rose-300'
            }`}
          >
            <h3 className="font-semibold text-lg mb-2">{event.name}</h3>
            <div className="space-y-2 text-sm text-stone-600">
              <p className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(event.date).toLocaleDateString('ru-RU')}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {event.location}
              </p>
              <p className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {event.guests} гостей
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-stone-200">
              <div className="flex justify-between text-sm">
                <span className="text-stone-500">Прогресс</span>
                <span className="font-medium">
                  {Math.round((event.tasks.filter(t => t.status === 'completed').length / event.tasks.length) * 100)}%
                </span>
              </div>
              <div className="mt-2 h-2 bg-stone-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-600 rounded-full transition-all"
                  style={{
                    width: `${(event.tasks.filter(t => t.status === 'completed').length / event.tasks.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedEvent && (
        <>
          {/* KPI карточки */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <span className="text-xs text-emerald-600 font-medium">Бюджет</span>
              </div>
              <p className="text-2xl font-bold">{selectedEvent.totalBudget.toLocaleString()} ₽</p>
              <p className="text-xs text-stone-500 mt-1">Общий бюджет</p>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-5 h-5 text-amber-600" />
                <span className="text-xs text-amber-600 font-medium">Потрачено</span>
              </div>
              <p className="text-2xl font-bold">{totalSpent.toLocaleString()} ₽</p>
              <p className="text-xs text-stone-500 mt-1">Из бюджета</p>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <span className="text-xs text-blue-600 font-medium">Остаток</span>
              </div>
              <p className="text-2xl font-bold">{remainingBudget.toLocaleString()} ₽</p>
              <p className="text-xs text-stone-500 mt-1">Свободно</p>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-5 h-5 text-purple-600" />
                <span className="text-xs text-purple-600 font-medium">Прогресс</span>
              </div>
              <p className="text-2xl font-bold">{completionRate}%</p>
              <p className="text-xs text-stone-500 mt-1">Задач выполнено</p>
            </div>
          </div>

          {/* Диаграмма Ганта */}
          {renderGanttChart()}

          {/* Задачи */}
          <div className="bg-white rounded-xl border border-stone-200 p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Задачи</h3>
              <button
                onClick={() => setShowTaskForm(!showTaskForm)}
                className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Добавить задачу
              </button>
            </div>

            {showTaskForm && (
              <div className="bg-stone-50 rounded-xl p-4 mb-4">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium text-stone-700 mb-1 block">Название задачи</label>
                    <input
                      type="text"
                      value={newTask.title || ''}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm"
                      placeholder="Например: Свадебный торт"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-stone-700 mb-1 block">Категория</label>
                    <select
                      value={newTask.category}
                      onChange={(e) => setNewTask({ ...newTask, category: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.emoji} {cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-stone-700 mb-1 block">Исполнитель</label>
                    <input
                      type="text"
                      value={newTask.assignee || ''}
                      onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm"
                      placeholder="Например: Анна Пекарская"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-stone-700 mb-1 block">Бюджет (₽)</label>
                    <input
                      type="number"
                      value={newTask.budget || ''}
                      onChange={(e) => setNewTask({ ...newTask, budget: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm"
                      placeholder="25000"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-stone-700 mb-1 block">Начало</label>
                    <input
                      type="date"
                      value={newTask.startDate || ''}
                      onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-stone-700 mb-1 block">Окончание</label>
                    <input
                      type="date"
                      value={newTask.endDate || ''}
                      onChange={(e) => setNewTask({ ...newTask, endDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddTask}
                    className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                  >
                    Добавить
                  </button>
                  <button
                    onClick={() => setShowTaskForm(false)}
                    className="px-4 py-2 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300 transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {selectedEvent.tasks.map(task => {
                const category = getCategoryInfo(task.category);
                
                return (
                  <div key={task.id} className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl">
                    <button
                      onClick={() => handleUpdateTaskStatus(
                        task.id,
                        task.status === 'completed' ? 'pending' : 'completed'
                      )}
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle className="w-6 h-6 text-emerald-600" />
                      ) : task.status === 'in_progress' ? (
                        <Clock className="w-6 h-6 text-amber-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-stone-400" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-medium ${task.status === 'completed' ? 'line-through text-stone-400' : 'text-stone-800'}`}>
                          {task.title}
                        </h4>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${category.color}`}>
                          {category.emoji} {category.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-stone-500">
                        {task.assignee && (
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {task.assignee}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(task.startDate).toLocaleDateString('ru-RU')} - {new Date(task.endDate).toLocaleDateString('ru-RU')}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {task.budget.toLocaleString()} ₽
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <select
                        value={task.status}
                        onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value as any)}
                        className="px-3 py-1 rounded-lg border border-stone-200 text-sm"
                      >
                        <option value="pending">Ожидает</option>
                        <option value="in_progress">В работе</option>
                        <option value="completed">Завершено</option>
                      </select>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 text-stone-400 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
