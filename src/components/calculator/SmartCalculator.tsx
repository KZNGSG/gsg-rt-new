'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { determineCertification, CertificationResult } from '@/lib/certification-rules';

// Типы
interface SearchResult {
  id: string;
  name: string;
  category: string;
  keywords: string[];
  tnved?: string;
  regulation?: string;
}

interface CalculatorState {
  step: 'search' | 'questions' | 'result';
  query: string;
  selectedProduct: SearchResult | null;
  answers: {
    productionType: 'serial' | 'batch' | null;
    origin: 'russia' | 'import' | null;
    hasProtocols: boolean;
    urgent: boolean;
  };
  result: CertificationResult | null;
}

// Категории для визуального выбора
const CATEGORIES = [
  { id: 'food', name: 'Пищевая продукция', icon: 'food', keywords: ['продукт', 'еда', 'напиток', 'молоко', 'мясо'], color: 'from-amber-500 to-orange-500' },
  { id: 'equipment', name: 'Оборудование', icon: 'equipment', keywords: ['станок', 'оборудован', 'машин', 'агрегат'], color: 'from-slate-500 to-slate-700' },
  { id: 'children', name: 'Детские товары', icon: 'children', keywords: ['детск', 'игрушк', 'для детей'], color: 'from-pink-500 to-rose-500' },
  { id: 'cosmetics', name: 'Косметика', icon: 'cosmetics', keywords: ['косметик', 'крем', 'шампунь'], color: 'from-purple-500 to-violet-500' },
  { id: 'textile', name: 'Текстиль', icon: 'textile', keywords: ['одежд', 'текстил', 'ткан'], color: 'from-indigo-500 to-blue-500' },
  { id: 'electronics', name: 'Электроника', icon: 'electronics', keywords: ['электр', 'техник', 'прибор'], color: 'from-cyan-500 to-teal-500' },
  { id: 'furniture', name: 'Мебель', icon: 'furniture', keywords: ['мебел', 'стол', 'стул', 'шкаф'], color: 'from-yellow-600 to-amber-600' },
  { id: 'construction', name: 'Стройматериалы', icon: 'construction', keywords: ['строител', 'бетон', 'кирпич'], color: 'from-stone-500 to-stone-700' },
  { id: 'medical', name: 'Медизделия', icon: 'medical', keywords: ['медицинск', 'диагностик'], color: 'from-red-500 to-rose-600' },
];

// Примеры популярных продуктов для автокомплита
const POPULAR_PRODUCTS: SearchResult[] = [
  { id: '1', name: 'Детские качели для игровой площадки', category: 'Детские товары', keywords: ['качели', 'детские', 'площадка'], tnved: '9506', regulation: 'ТР ЕАЭС 042/2017' },
  { id: '2', name: 'Мягкие игрушки', category: 'Игрушки', keywords: ['игрушка', 'мягкая', 'плюшевая'], tnved: '9503', regulation: 'ТР ТС 008/2011' },
  { id: '3', name: 'Детская одежда', category: 'Детские товары', keywords: ['одежда', 'детская'], tnved: '6111', regulation: 'ТР ТС 007/2011' },
  { id: '4', name: 'Молочная продукция', category: 'Пищевая продукция', keywords: ['молоко', 'творог', 'сыр'], tnved: '0401', regulation: 'ТР ТС 021/2011' },
  { id: '5', name: 'Косметический крем', category: 'Косметика', keywords: ['крем', 'косметика'], tnved: '3304', regulation: 'ТР ТС 009/2011' },
  { id: '6', name: 'Электрический чайник', category: 'Электроника', keywords: ['чайник', 'электрический'], tnved: '8516', regulation: 'ТР ТС 004/2011' },
  { id: '7', name: 'Офисная мебель', category: 'Мебель', keywords: ['мебель', 'офисная', 'стол'], tnved: '9403', regulation: 'ТР ТС 025/2012' },
  { id: '8', name: 'Промышленный насос', category: 'Оборудование', keywords: ['насос', 'промышленный'], tnved: '8413', regulation: 'ТР ТС 010/2011' },
  { id: '9', name: 'Медицинские маски', category: 'Медизделия', keywords: ['маска', 'медицинская'], tnved: '6307', regulation: 'РУ Росздравнадзора' },
  { id: '10', name: 'Строительные смеси', category: 'Стройматериалы', keywords: ['смесь', 'строительная', 'цемент'], tnved: '2523', regulation: 'ГОСТ Р' },
];

// Иконки категорий
function CategoryIcon({ type, className }: { type: string; className?: string }) {
  const icons: Record<string, React.ReactElement> = {
    food: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z" /></svg>,
    equipment: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" /></svg>,
    children: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" /></svg>,
    cosmetics: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>,
    textile: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>,
    electronics: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" /></svg>,
    furniture: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>,
    construction: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" /></svg>,
    medical: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  };
  return icons[type] || icons.equipment;
}

// Fuzzy search
function fuzzyMatch(str: string, pattern: string): boolean {
  const s = str.toLowerCase();
  const p = pattern.toLowerCase();
  
  if (s.includes(p)) return true;
  
  // Простой fuzzy: допускаем пропуск 1-2 символов
  let si = 0, pi = 0;
  let misses = 0;
  while (si < s.length && pi < p.length) {
    if (s[si] === p[pi]) {
      pi++;
    } else {
      misses++;
      if (misses > 2) return false;
    }
    si++;
  }
  return pi >= p.length - 1;
}

// Поиск продуктов
function searchProducts(query: string): SearchResult[] {
  if (query.length < 2) return [];
  
  const results: SearchResult[] = [];
  const seen = new Set<string>();
  
  for (const product of POPULAR_PRODUCTS) {
    if (seen.has(product.id)) continue;
    
    // Поиск по названию
    if (fuzzyMatch(product.name, query)) {
      results.push(product);
      seen.add(product.id);
      continue;
    }
    
    // Поиск по ключевым словам
    if (product.keywords.some(kw => fuzzyMatch(kw, query))) {
      results.push(product);
      seen.add(product.id);
      continue;
    }
    
    // Поиск по коду ТН ВЭД
    if (product.tnved && product.tnved.startsWith(query.replace(/\s/g, ''))) {
      results.push(product);
      seen.add(product.id);
    }
  }
  
  return results.slice(0, 6);
}

export function SmartCalculator() {
  const [state, setState] = useState<CalculatorState>({
    step: 'search',
    query: '',
    selectedProduct: null,
    answers: {
      productionType: null,
      origin: null,
      hasProtocols: false,
      urgent: false,
    },
    result: null,
  });
  
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'category' | 'tnved'>('search');
  const [tnvedCode, setTnvedCode] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Поиск при вводе
  useEffect(() => {
    if (state.query.length >= 2) {
      const results = searchProducts(state.query);
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [state.query]);
  
  // Клик вне поиска
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Выбор продукта
  const selectProduct = useCallback((product: SearchResult) => {
    setState(prev => ({ ...prev, selectedProduct: product, step: 'questions' }));
    setShowResults(false);
  }, []);
  
  // Выбор категории
  const selectCategory = useCallback((category: typeof CATEGORIES[0]) => {
    const product: SearchResult = {
      id: category.id,
      name: category.name,
      category: category.name,
      keywords: category.keywords,
    };
    setState(prev => ({ ...prev, selectedProduct: product, step: 'questions' }));
  }, []);
  
  // Поиск по ТН ВЭД
  const searchByTnved = useCallback(() => {
    if (tnvedCode.length >= 4) {
      const result = determineCertification(tnvedCode, '');
      setState(prev => ({
        ...prev,
        selectedProduct: {
          id: 'tnved-' + tnvedCode,
          name: `Продукция по коду ${tnvedCode}`,
          category: result.category || 'Общая категория',
          keywords: [],
          tnved: tnvedCode,
        },
        step: 'questions',
      }));
    }
  }, [tnvedCode]);
  
  // Расчёт результата
  const calculateResult = useCallback(() => {
    if (!state.selectedProduct) return;
    
    const certResult = determineCertification(
      state.selectedProduct.tnved || '',
      state.selectedProduct.name
    );
    
    setState(prev => ({ ...prev, result: certResult, step: 'result' }));
  }, [state.selectedProduct]);
  
  // Сброс
  const reset = useCallback(() => {
    setState({
      step: 'search',
      query: '',
      selectedProduct: null,
      answers: {
        productionType: null,
        origin: null,
        hasProtocols: false,
        urgent: false,
      },
      result: null,
    });
    setTnvedCode('');
  }, []);
  
  // Шаг поиска
  if (state.step === 'search') {
    return (
      <div className="w-full max-w-4xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-sm mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            3 клика до результата
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Какой документ нужен для вашей продукции?
          </h2>
          <p className="text-white/70 text-sm md:text-base">
            Введите название товара, выберите категорию или укажите код ТН ВЭД
          </p>
        </div>
        
        {/* Табы выбора способа */}
        <div className="flex justify-center gap-2 mb-6">
          {[
            { id: 'search' as const, label: 'Умный поиск', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
            { id: 'category' as const, label: 'По категории', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z' },
            { id: 'tnved' as const, label: 'По коду ТН ВЭД', icon: 'M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-lg'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
              </svg>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
        
        {/* Контент табов */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
          {activeTab === 'search' && (
            <div ref={searchRef} className="relative">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={state.query}
                  onChange={e => setState(prev => ({ ...prev, query: e.target.value }))}
                  onFocus={() => state.query.length >= 2 && setShowResults(true)}
                  placeholder="Что вы хотите сертифицировать? Например: детские качели, игрушки..."
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all text-base"
                />
              </div>
              
              {/* Результаты поиска */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                  {searchResults.map(result => (
                    <button
                      key={result.id}
                      onClick={() => selectProduct(result)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50 transition-colors text-left border-b border-slate-100 last:border-0"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-900 truncate">{result.name}</div>
                        <div className="text-sm text-slate-500 flex items-center gap-2">
                          <span>{result.category}</span>
                          {result.regulation && (
                            <>
                              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                              <span className="text-blue-600">{result.regulation}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Подсказки */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-slate-500">Популярные:</span>
                {['Игрушки', 'Детская одежда', 'Косметика', 'Пищевые продукты'].map(term => (
                  <button
                    key={term}
                    onClick={() => setState(prev => ({ ...prev, query: term }))}
                    className="px-3 py-1 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 rounded-full text-sm transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'category' && (
            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {CATEGORIES.map(category => (
                <button
                  key={category.id}
                  onClick={() => selectCategory(category)}
                  className="group p-4 rounded-2xl bg-slate-50 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 border-2 border-slate-200 hover:border-blue-300 transition-all hover:shadow-lg"
                >
                  <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <CategoryIcon type={category.icon} className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-sm font-medium text-slate-700 group-hover:text-blue-700 text-center leading-tight">
                    {category.name}
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {activeTab === 'tnved' && (
            <div>
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5z" />
                </svg>
                <input
                  type="text"
                  value={tnvedCode}
                  onChange={e => setTnvedCode(e.target.value.replace(/[^\d\s]/g, ''))}
                  placeholder="Введите код ТН ВЭД (например: 9503 00)"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all text-base font-mono"
                />
              </div>
              <button
                onClick={searchByTnved}
                disabled={tnvedCode.length < 4}
                className="mt-4 w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-300 disabled:to-slate-400 text-white font-semibold rounded-xl transition-all disabled:cursor-not-allowed"
              >
                Найти документы
              </button>
              <p className="mt-3 text-sm text-slate-500 text-center">
                Не знаете код? <a href="/tn-ved" className="text-blue-600 hover:underline">Воспользуйтесь справочником ТН ВЭД</a>
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Шаг уточняющих вопросов
  if (state.step === 'questions') {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
          {/* Хлебные крошки */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
            <button onClick={reset} className="hover:text-blue-600 transition-colors">Поиск</button>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            <span className="text-slate-900 font-medium">Уточнение</span>
          </div>
          
          {/* Выбранный продукт */}
          <div className="p-4 bg-blue-50 rounded-2xl mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold text-slate-900">{state.selectedProduct?.name}</div>
                <div className="text-sm text-blue-600">{state.selectedProduct?.category}</div>
              </div>
            </div>
          </div>
          
          {/* Вопросы */}
          <div className="space-y-6">
            {/* Тип производства */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">
                Тип производства
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'serial' as const, label: 'Серийное', desc: 'Постоянное производство' },
                  { value: 'batch' as const, label: 'Партия', desc: 'Разовая поставка' },
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setState(prev => ({ ...prev, answers: { ...prev.answers, productionType: option.value } }))}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      state.answers.productionType === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-medium text-slate-900">{option.label}</div>
                    <div className="text-sm text-slate-500">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Происхождение */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3">
                Происхождение продукции
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'russia' as const, label: 'Россия/ЕАЭС', desc: 'Местное производство' },
                  { value: 'import' as const, label: 'Импорт', desc: 'Из-за рубежа' },
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setState(prev => ({ ...prev, answers: { ...prev.answers, origin: option.value } }))}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      state.answers.origin === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-medium text-slate-900">{option.label}</div>
                    <div className="text-sm text-slate-500">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Дополнительные опции */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-slate-200 hover:border-slate-300 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={state.answers.hasProtocols}
                  onChange={e => setState(prev => ({ ...prev, answers: { ...prev.answers, hasProtocols: e.target.checked } }))}
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-slate-900">Есть протоколы испытаний</div>
                  <div className="text-sm text-slate-500">Скидка ~20% от стоимости</div>
                </div>
              </label>
              
              <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-slate-200 hover:border-slate-300 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={state.answers.urgent}
                  onChange={e => setState(prev => ({ ...prev, answers: { ...prev.answers, urgent: e.target.checked } }))}
                  className="w-5 h-5 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                />
                <div>
                  <div className="font-medium text-slate-900">Срочное оформление</div>
                  <div className="text-sm text-slate-500">+50% к стоимости, быстрее в 2 раза</div>
                </div>
              </label>
            </div>
          </div>
          
          {/* Кнопки */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={reset}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
            >
              Назад
            </button>
            <button
              onClick={calculateResult}
              disabled={!state.answers.productionType || !state.answers.origin}
              className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-slate-300 disabled:to-slate-400 text-white font-semibold rounded-xl transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span>Рассчитать стоимость</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Шаг результата
  if (state.step === 'result' && state.result) {
    const doc = state.result.documents[0];
    const basePrice = parseInt(doc?.price?.replace(/\D/g, '') || '15000');
    let finalPrice = basePrice;
    let finalPriceMax = basePrice * 2;
    
    // Модификаторы цены
    if (state.answers.hasProtocols) {
      finalPrice = Math.round(finalPrice * 0.8);
      finalPriceMax = Math.round(finalPriceMax * 0.8);
    }
    if (state.answers.urgent) {
      finalPrice = Math.round(finalPrice * 1.5);
      finalPriceMax = Math.round(finalPriceMax * 1.5);
    }
    if (state.answers.origin === 'import') {
      finalPrice = Math.round(finalPrice * 1.15);
      finalPriceMax = Math.round(finalPriceMax * 1.15);
    }
    
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Заголовок результата */}
          <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">Результат расчёта</span>
            </div>
            <h3 className="text-xl font-bold">{state.selectedProduct?.name}</h3>
            <p className="text-white/80 text-sm mt-1">{state.result.category}</p>
          </div>
          
          {/* Контент */}
          <div className="p-6 md:p-8">
            {/* Требуемый документ */}
            <div className="mb-6">
              <div className="text-sm font-medium text-slate-500 mb-2">ТРЕБУЕТСЯ:</div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-xl text-slate-900">{doc?.name || 'Сертификат соответствия'}</div>
                  <div className="text-blue-600">{doc?.regulation}</div>
                </div>
              </div>
            </div>
            
            {/* Стоимость и сроки */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                  <span className="text-sm font-medium">Стоимость</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  от {finalPrice.toLocaleString()} ₽
                </div>
                <div className="text-sm text-slate-500">
                  до {finalPriceMax.toLocaleString()} ₽
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">Сроки</span>
                </div>
                <div className="text-2xl font-bold text-slate-900">
                  {state.answers.urgent ? 'от 3 дней' : 'от 7 дней'}
                </div>
                <div className="text-sm text-slate-500">
                  {state.answers.urgent ? 'до 7 дней' : 'до 14 дней'}
                </div>
              </div>
            </div>
            
            {/* Схемы сертификации */}
            <div className="mb-6">
              <div className="text-sm font-medium text-slate-500 mb-3">СХЕМЫ СЕРТИФИКАЦИИ:</div>
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-slate-600">Схема</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-600">Для кого</th>
                      <th className="px-4 py-3 text-left font-medium text-slate-600">Срок</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className={state.answers.productionType === 'serial' ? 'bg-blue-50' : ''}>
                      <td className="px-4 py-3 font-medium text-slate-900">1с / 2с</td>
                      <td className="px-4 py-3 text-slate-600">Серийное производство</td>
                      <td className="px-4 py-3 text-slate-600">до 5 лет</td>
                    </tr>
                    <tr className={state.answers.productionType === 'batch' ? 'bg-blue-50' : ''}>
                      <td className="px-4 py-3 font-medium text-slate-900">3с / 4с</td>
                      <td className="px-4 py-3 text-slate-600">Партия продукции</td>
                      <td className="px-4 py-3 text-slate-600">на партию</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Примечания */}
            {state.result.notes.length > 0 && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl mb-6">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  <div>
                    <div className="font-medium text-amber-800 mb-1">Важно</div>
                    <ul className="text-sm text-amber-700 space-y-1">
                      {state.result.notes.map((note, i) => (
                        <li key={i}>{note}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            {/* Кнопки действий */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="tel:+78005553535"
                className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                Получить консультацию
              </a>
              <button
                onClick={reset}
                className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
              >
                Новый расчёт
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
}
