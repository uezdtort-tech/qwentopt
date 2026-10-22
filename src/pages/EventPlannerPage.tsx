import React, { useState } from 'react';
import { events as initialEvents } from '../data/mockData';
import { Calendar, MapPin, DollarSign, CheckCircle, Circle, Plus, Clock } from 'lucide-react';

export function EventPlannerPage() {
  const [eventsList, setEventsList] = useState(initialEvents);
  const [showForm, setShowForm] = useState(false);

  const toggleTask = (eventId: string, taskId: string) => {
    setEventsList(prev => prev.map(e => e.id === eventId ? { ...e, tasks: e.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t) } : e));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-graphite">Планировщик мероприятий</h1>
          <p className="text-graphite-light mt-2">Организуйте торжества, управляйте задачами и подрядчиками</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-berry text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-berry-dark transition-colors">
          <Plus className="w-4 h-4" /> Новое мероприятие
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-cream-dark p-6 mb-6 animate-fade-in">
          <h3 className="font-semibold mb-4">Новое мероприятие</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-graphite mb-1 block">Название</label>
              <input type="text" placeholder="Например: Свадьба" className="w-full px-3 py-2.5 rounded-lg border border-cream-dark text-sm focus:outline-none focus:ring-2 focus:ring-berry/30" />
            </div>
            <div>
              <label className="text-sm font-medium text-graphite mb-1 block">Дата</label>
              <input type="date" className="w-full px-3 py-2.5 rounded-lg border border-cream-dark text-sm focus:outline-none focus:ring-2 focus:ring-berry/30" />
            </div>
            <div>
              <label className="text-sm font-medium text-graphite mb-1 block">Место</label>
              <input type="text" placeholder="Адрес или название площадки" className="w-full px-3 py-2.5 rounded-lg border border-cream-dark text-sm focus:outline-none focus:ring-2 focus:ring-berry/30" />
            </div>
            <div>
              <label className="text-sm font-medium text-graphite mb-1 block">Бюджет (₽)</label>
              <input type="number" placeholder="100000" className="w-full px-3 py-2.5 rounded-lg border border-cream-dark text-sm focus:outline-none focus:ring-2 focus:ring-berry/30" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="bg-berry text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-berry-dark">Создать</button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-lg text-sm font-medium border border-cream-dark hover:bg-cream">Отмена</button>
          </div>
        </div>
      )}

      {/* Events */}
      <div className="space-y-6">
        {eventsList.map(event => {
          const doneTasks = event.tasks.filter(t => t.done).length;
          const progress = event.tasks.length > 0 ? Math.round((doneTasks / event.tasks.length) * 100) : 0;
          
          return (
            <div key={event.id} className="bg-white rounded-xl border border-cream-dark overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="font-display text-xl font-bold">{event.name}</h2>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        event.status === 'confirmed' ? 'bg-sage/10 text-sage' :
                        event.status === 'planning' ? 'bg-gold/10 text-gold' :
                        event.status === 'in_progress' ? 'bg-lavender/10 text-lavender' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {event.status === 'confirmed' ? 'Подтверждено' : event.status === 'planning' ? 'Планирование' : event.status === 'in_progress' ? 'В процессе' : 'Завершено'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-graphite-light">
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {event.date}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {event.location}</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {event.budget.toLocaleString()} ₽</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{progress}%</p>
                    <p className="text-xs text-graphite-light">{doneTasks} из {event.tasks.length} задач</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-cream-dark rounded-full h-2 mb-4">
                  <div className="bg-berry h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>

                {/* Tasks */}
                <div className="space-y-2">
                  {event.tasks.map(task => (
                    <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-cream/50 transition-colors">
                      <button onClick={() => toggleTask(event.id, task.id)} className="shrink-0">
                        {task.done ? <CheckCircle className="w-5 h-5 text-sage" /> : <Circle className="w-5 h-5 text-graphite-light" />}
                      </button>
                      <span className={`text-sm flex-1 ${task.done ? 'line-through text-graphite-light' : ''}`}>{task.title}</span>
                      {task.assignee && <span className="text-xs bg-cream-dark px-2 py-0.5 rounded-full text-graphite-light">{task.assignee}</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {eventsList.length === 0 && (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">📅</div>
          <h3 className="text-lg font-semibold mb-2">Нет мероприятий</h3>
          <p className="text-sm text-graphite-light">Создайте первое мероприятие, чтобы начать планирование</p>
        </div>
      )}
    </div>
  );
}
