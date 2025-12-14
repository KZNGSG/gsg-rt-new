'use client';

import { useState, useMemo } from 'react';
import { searchTNVED, getAllGroups, getItemsByGroup, TECHNICAL_REGULATIONS, type TNVEDItem } from '@/data/tn-ved-database';
import { TNVEDResults } from './TNVEDResults';

export function TNVEDSearch() {
  const [query, setQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<TNVEDItem | null>(null);

  const groups = useMemo(() => getAllGroups(), []);

  const searchResults = useMemo(() => {
    if (query.length >= 2) {
      return searchTNVED(query);
    }
    if (selectedGroup) {
      return getItemsByGroup(selectedGroup);
    }
    return [];
  }, [query, selectedGroup]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedGroup(null);
    setSelectedItem(null);
  };

  const handleGroupSelect = (groupCode: string) => {
    setSelectedGroup(groupCode);
    setQuery('');
    setSelectedItem(null);
  };

  const handleItemSelect = (item: TNVEDItem) => {
    setSelectedItem(item);
  };

  const handleBack = () => {
    if (selectedItem) {
      setSelectedItem(null);
    } else if (selectedGroup) {
      setSelectedGroup(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Поисковая строка */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Введите код ТН ВЭД или название товара..."
          className="w-full pl-12 pr-4 py-4 text-lg border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Примеры поиска */}
      {!query && !selectedGroup && !selectedItem && (
        <div className="mb-8">
          <p className="text-sm text-slate-500 mb-3">Примеры поиска:</p>
          <div className="flex flex-wrap gap-2">
            {['8418', 'телевизор', 'одежда', 'косметика', 'игрушки', 'мебель'].map((example) => (
              <button
                key={example}
                onClick={() => setQuery(example)}
                className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm hover:bg-blue-100 hover:text-blue-600 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Кнопка назад */}
      {(selectedGroup || selectedItem) && (
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-blue-600 font-medium mb-6 hover:text-blue-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Назад
        </button>
      )}

      {/* Результаты поиска или выбранный товар */}
      {selectedItem ? (
        <TNVEDResults item={selectedItem} />
      ) : searchResults.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-slate-500 mb-4">
            {query ? `Найдено результатов: ${searchResults.length}` : `Товары в категории: ${searchResults.length}`}
          </p>
          {searchResults.map((item) => (
            <button
              key={item.code}
              onClick={() => handleItemSelect(item)}
              className="w-full text-left p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-blue-600 font-semibold">{item.code}</span>
                    <span className="text-slate-300">|</span>
                    <span className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-1">{item.description}</p>
                </div>
                <div className="flex items-center gap-2 text-slate-400 group-hover:text-blue-500 transition-colors">
                  <span className="text-sm">{item.documents.length} док.</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : query.length >= 2 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Ничего не найдено</h3>
          <p className="text-slate-500 mb-6">
            Попробуйте изменить запрос или выберите категорию ниже
          </p>
        </div>
      ) : null}

      {/* Категории товаров */}
      {!query && !selectedGroup && !selectedItem && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Популярные категории</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {groups.map((group) => (
              <button
                key={group.code}
                onClick={() => handleGroupSelect(group.code)}
                className="p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-blue-600 font-semibold">{group.code}</span>
                    <h4 className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                      {group.name}
                    </h4>
                  </div>
                  <div className="text-sm text-slate-400">
                    {group.itemCount} поз.
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Информационный блок */}
      {!selectedItem && (
        <div className="mt-12 p-6 bg-blue-50 rounded-2xl">
          <h3 className="font-semibold text-slate-900 mb-2">Как работает определитель?</h3>
          <ul className="text-sm text-slate-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">1.</span>
              Введите код ТН ВЭД или название товара
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">2.</span>
              Система покажет применимые технические регламенты
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">3.</span>
              Узнайте, какие документы нужны и их примерную стоимость
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">4.</span>
              Оставьте заявку для точного расчёта
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
