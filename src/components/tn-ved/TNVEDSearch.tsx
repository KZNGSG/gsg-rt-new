'use client';

import { useState, useMemo, useCallback } from 'react';
import { searchTNVED, getGroups, getMarkingInfo, type TNVEDCode } from '@/data/tn-ved-full';
import { TECHNICAL_REGULATIONS } from '@/data/tn-ved-database';
import { TNVEDResultsNew } from './TNVEDResultsNew';

export function TNVEDSearch() {
  const [query, setQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<TNVEDCode | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced поиск
  const searchResults = useMemo(() => {
    if (query.length >= 2) {
      return searchTNVED(query);
    }
    return [];
  }, [query]);

  const groups = useMemo(() => getGroups().slice(0, 20), []); // Топ-20 групп

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedItem(null);
  }, []);

  const handleItemSelect = useCallback((item: TNVEDCode) => {
    setSelectedItem(item);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedItem(null);
  }, []);

  const handleExampleClick = useCallback((example: string) => {
    setQuery(example);
    setSelectedItem(null);
  }, []);

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
      {!query && !selectedItem && (
        <div className="mb-8">
          <p className="text-sm text-slate-500 mb-3">Примеры поиска:</p>
          <div className="flex flex-wrap gap-2">
            {['8418', '6109', 'телевизор', 'одежда', 'косметика', 'молоко', 'мебель', 'обувь'].map((example) => (
              <button
                key={example}
                onClick={() => handleExampleClick(example)}
                className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-sm hover:bg-blue-100 hover:text-blue-600 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Кнопка назад */}
      {selectedItem && (
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-blue-600 font-medium mb-6 hover:text-blue-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Назад к поиску
        </button>
      )}

      {/* Результаты поиска или выбранный товар */}
      {selectedItem ? (
        <TNVEDResultsNew item={selectedItem} />
      ) : searchResults.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-slate-500 mb-4">
            Найдено результатов: {searchResults.length}{searchResults.length >= 50 ? '+' : ''}
          </p>
          {searchResults.map((item, index) => (
            <button
              key={`${item.code}-${index}`}
              onClick={() => handleItemSelect(item)}
              className="w-full text-left p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <span className="font-mono text-blue-600 font-semibold whitespace-nowrap">
                      {item.code_formatted}
                    </span>
                    {item.requires_marking && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                        Маркировка
                      </span>
                    )}
                    {item.is_experimental && (
                      <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                        Эксперимент
                      </span>
                    )}
                  </div>
                  <p className="text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {item.name}
                  </p>
                </div>
                <div className="flex items-center text-slate-400 group-hover:text-blue-500 transition-colors flex-shrink-0">
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
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Ничего не найдено</h3>
          <p className="text-slate-500 mb-6">
            Попробуйте изменить запрос или введите код ТН ВЭД
          </p>
        </div>
      ) : null}

      {/* Популярные группы */}
      {!query && !selectedItem && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Популярные группы ТН ВЭД</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {groups.map((group) => (
              <button
                key={group.code}
                onClick={() => handleExampleClick(group.code)}
                className="p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <span className="font-mono text-blue-600 font-semibold">{group.code}</span>
                    <p className="text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {group.name}
                    </p>
                  </div>
                  <div className="text-sm text-slate-400 flex-shrink-0 ml-2">
                    {group.count} поз.
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Статистика базы */}
      {!query && !selectedItem && (
        <div className="mt-8 p-4 bg-slate-100 rounded-xl text-center">
          <p className="text-slate-600">
            В базе <span className="font-bold text-blue-600">16 376</span> кодов ТН ВЭД
          </p>
        </div>
      )}

      {/* Информационный блок */}
      {!selectedItem && (
        <div className="mt-8 p-6 bg-blue-50 rounded-2xl">
          <h3 className="font-semibold text-slate-900 mb-2">Как работает определитель?</h3>
          <ul className="text-sm text-slate-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">1.</span>
              Введите код ТН ВЭД (например, 8418) или название товара
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">2.</span>
              Выберите нужную позицию из результатов поиска
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">3.</span>
              Узнайте требования по сертификации и маркировке
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">4.</span>
              Оставьте заявку для точного расчёта стоимости
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
