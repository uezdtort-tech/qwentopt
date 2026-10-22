import React, { useState } from 'react';
import { recipes as initialRecipes } from '../data/mockData';
import { Plus, Edit3, Calculator, ChevronDown, ChevronUp } from 'lucide-react';

export function RecipesPage() {
  const [recipesList, setRecipesList] = useState(initialRecipes);
  const [expanded, setExpanded] = useState<string | null>('r1');
  const [showForm, setShowForm] = useState(false);

  const totalCost = (recipe: typeof initialRecipes[0]) => recipe.ingredients.reduce((s, i) => s + i.cost, 0);

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-graphite">Рецепты</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-berry text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-berry-dark transition-colors">
          <Plus className="w-4 h-4" /> Новый рецепт
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-cream-dark p-6 mb-6 animate-fade-in">
          <h3 className="font-semibold mb-4">Новый рецепт</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-graphite mb-1 block">Название</label>
              <input type="text" placeholder="Название рецепта" className="w-full px-3 py-2.5 rounded-lg border border-cream-dark text-sm focus:outline-none focus:ring-2 focus:ring-berry/30" />
            </div>
            <div>
              <label className="text-sm font-medium text-graphite mb-1 block">Выход</label>
              <input type="text" placeholder="1.2 кг (8 порций)" className="w-full px-3 py-2.5 rounded-lg border border-cream-dark text-sm focus:outline-none focus:ring-2 focus:ring-berry/30" />
            </div>
          </div>
          <div className="mb-4">
            <label className="text-sm font-medium text-graphite mb-2 block">Ингредиенты</label>
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="grid grid-cols-12 gap-2">
                  <input type="text" placeholder="Ингредиент" className="col-span-5 px-3 py-2 rounded-lg border border-cream-dark text-sm focus:outline-none focus:ring-2 focus:ring-berry/30" />
                  <input type="number" placeholder="Кол-во" className="col-span-2 px-3 py-2 rounded-lg border border-cream-dark text-sm focus:outline-none focus:ring-2 focus:ring-berry/30" />
                  <select className="col-span-2 px-2 py-2 rounded-lg border border-cream-dark text-sm focus:outline-none focus:ring-2 focus:ring-berry/30">
                    <option>г</option><option>кг</option><option>мл</option><option>л</option><option>шт</option>
                  </select>
                  <input type="number" placeholder="₽" className="col-span-2 px-3 py-2 rounded-lg border border-cream-dark text-sm focus:outline-none focus:ring-2 focus:ring-berry/30" />
                  <button className="col-span-1 text-graphite-light hover:text-berry">×</button>
                </div>
              ))}
            </div>
            <button className="text-xs text-berry mt-2 hover:underline">+ Добавить ингредиент</button>
          </div>
          <div className="mb-4">
            <label className="text-sm font-medium text-graphite mb-1 block">Технологические заметки</label>
            <textarea rows={2} placeholder="Температура, время, особенности..." className="w-full px-3 py-2.5 rounded-lg border border-cream-dark text-sm focus:outline-none focus:ring-2 focus:ring-berry/30 resize-none" />
          </div>
          <div className="flex gap-3">
            <button className="bg-berry text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-berry-dark">Сохранить рецепт</button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-lg text-sm font-medium border border-cream-dark hover:bg-cream">Отмена</button>
          </div>
        </div>
      )}

      {/* Recipes List */}
      <div className="space-y-4">
        {recipesList.map(recipe => (
          <div key={recipe.id} className="bg-white rounded-xl border border-cream-dark overflow-hidden">
            <button onClick={() => setExpanded(expanded === recipe.id ? null : recipe.id)} className="w-full flex items-center justify-between p-5 hover:bg-cream/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-lavender/10 rounded-lg flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-lavender" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-graphite">{recipe.name}</h3>
                  <p className="text-xs text-graphite-light">Выход: {recipe.yield} · Обновлено {recipe.lastModified}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-bold text-graphite">{totalCost(recipe).toLocaleString()} ₽</p>
                  <p className="text-xs text-graphite-light">себестоимость</p>
                </div>
                {expanded === recipe.id ? <ChevronUp className="w-5 h-5 text-graphite-light" /> : <ChevronDown className="w-5 h-5 text-graphite-light" />}
              </div>
            </button>
            {expanded === recipe.id && (
              <div className="border-t border-cream-dark p-5 animate-fade-in">
                <table className="w-full">
                  <thead>
                    <tr className="text-xs text-graphite-light uppercase">
                      <th className="text-left pb-2">Ингредиент</th>
                      <th className="text-right pb-2">Количество</th>
                      <th className="text-right pb-2">Стоимость</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipe.ingredients.map((ing, i) => (
                      <tr key={i} className="border-t border-cream-dark/50">
                        <td className="py-2.5 text-sm">{ing.name}</td>
                        <td className="py-2.5 text-sm text-right text-graphite-light">{ing.amount} {ing.unit}</td>
                        <td className="py-2.5 text-sm text-right font-medium">{ing.cost} ₽</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-cream-dark">
                      <td className="py-3 font-semibold">Итого</td>
                      <td></td>
                      <td className="py-3 text-right font-bold text-berry">{totalCost(recipe).toLocaleString()} ₽</td>
                    </tr>
                  </tfoot>
                </table>
                {recipe.notes && (
                  <div className="mt-4 bg-cream rounded-lg p-3">
                    <p className="text-xs text-graphite-light"><strong>Заметки:</strong> {recipe.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
