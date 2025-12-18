'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { determineCertification, CertificationResult } from '@/lib/certification-rules';

// Категории для быстрого выбора
const CATEGORIES = [
  { id: 'children', name: 'Детские товары', code: '9503', icon: 'children', color: 'from-pink-500 to-rose-500' },
  { id: 'cosmetics', name: 'Косметика', code: '3304', icon: 'cosmetics', color: 'from-purple-500 to-violet-500' },
  { id: 'food', name: 'Продукты питания', code: '21', icon: 'food', color: 'from-amber-500 to-orange-500' },
  { id: 'clothing', name: 'Одежда и обувь', code: '62', icon: 'clothing', color: 'from-indigo-500 to-blue-500' },
  { id: 'electronics', name: 'Электроника', code: '85', icon: 'electronics', color: 'from-cyan-500 to-teal-500' },
  { id: 'equipment', name: 'Оборудование', code: '84', icon: 'equipment', color: 'from-slate-500 to-slate-700' },
];

// Популярные продукты для поиска
const PRODUCTS = [
  { name: 'Детские игрушки', code: '9503', category: 'Игрушки' },
  { name: 'Детская одежда', code: '6111', category: 'Детские товары' },
  { name: 'Косметический крем', code: '3304', category: 'Косметика' },
  { name: 'Шампунь', code: '3305', category: 'Косметика' },
  { name: 'Молочная продукция', code: '0401', category: 'Продукты' },
  { name: 'Кондитерские изделия', code: '1704', category: 'Продукты' },
  { name: 'Футболки', code: '6109', category: 'Одежда' },
  { name: 'Обувь', code: '6403', category: 'Обувь' },
  { name: 'Электрочайник', code: '8516', category: 'Электроника' },
  { name: 'Медицинские маски', code: '6307', category: 'Медизделия' },
];

// Иконки
function CategoryIcon({ type, className }: { type: string; className?: string }) {
  const icons: Record<string, React.ReactElement> = {
    children: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" /></svg>,
    cosmetics: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>,
    food: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.126-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z" /></svg>,
    clothing: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>,
    electronics: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" /></svg>,
    equipment: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" /></svg>,
  };
  return icons[type] || icons.children;
}

type Step = 'input' | 'details' | 'result';
type InputMode = 'search' | 'category' | 'tnved';

interface SelectedProduct {
  name: string;
  code: string;
  category: string;
}

export function QuickCalculator() {
  const [step, setStep] = useState<Step>('input');
  const [inputMode, setInputMode] = useState<InputMode>('category');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof PRODUCTS>([]);
  const [showResults, setShowResults] = useState(false);
  const [tnvedCode, setTnvedCode] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<SelectedProduct | null>(null);
  const [productionType, setProductionType] = useState<'serial' | 'batch' | null>(null);
  const [origin, setOrigin] = useState<'russia' | 'import' | null>(null);
  const [urgent, setUrgent] = useState(false);
  const [result, setResult] = useState<CertificationResult | null>(null);
  
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Поиск
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const q = searchQuery.toLowerCase();
      const results = PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q)
      );
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery]);
  
  // Клик вне
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Выбор категории
  const selectCategory = useCallback((cat: typeof CATEGORIES[0]) => {
    setSelectedProduct({ name: cat.name, code: cat.code, category: cat.name });
    setStep('details');
  }, []);
  
  // Выбор из поиска
  const selectFromSearch = useCallback((product: typeof PRODUCTS[0]) => {
    setSelectedProduct({ name: product.name, code: product.code, category: product.category });
    setShowResults(false);
    setStep('details');
  }, []);
  
  // Поиск по ТН ВЭД
  const searchByTnved = useCallback(() => {
    if (tnvedCode.length >= 2) {
      setSelectedProduct({ name: `Код ${tnvedCode}`, code: tnvedCode, category: 'По коду ТН ВЭД' });
      setStep('details');
    }
  }, [tnvedCode]);
  
  // Расчёт
  const calculate = useCallback(() => {
    if (!selectedProduct) return;
    const res = determineCertification(selectedProduct.code, selectedProduct.name);
    setResult(res);
    setStep('result');
  }, [selectedProduct]);
  
  // Сброс
  const reset = useCallback(() => {
    setStep('input');
    setSelectedProduct(null);
    setProductionType(null);
    setOrigin(null);
    setUrgent(false);
    setResult(null);
    setSearchQuery('');
    setTnvedCode('');
  }, []);
  
  // Расчёт цены
  const getPrice = () => {
    if (!result?.documents[0]) return { min: 15000, max: 35000 };
    const base = parseInt(result.documents[0].price?.replace(/\D/g, '') || '15000');
    let min = base, max = base * 2;
    if (origin === 'import') { min *= 1.15; max *= 1.15; }
    if (urgent) { min *= 1.5; max *= 1.5; }
    return { min: Math.round(min), max: Math.round(max) };
  };

  return (
    <div className="glass-white rounded-3xl shadow-premium-lg overflow-hidden border border-white/50">
      {/* Заголовок */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 px-5 py-4 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Узнать стоимость</h3>
              <p className="text-blue-200 text-xs">за 30 секунд</p>
            </div>
          </div>
          {step !== 'input' && (
            <button onClick={reset} className="text-white/70 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      <div className="p-5">
        {/* ШАГ 1: Выбор продукта */}
        {step === 'input' && (
          <div className="space-y-4">
            {/* Табы способа ввода */}
            <div className="flex bg-slate-100 rounded-xl p-1">
              {[
                { id: 'category' as const, label: 'Категория', icon: 'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z' },
                { id: 'search' as const, label: 'Поиск', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
                { id: 'tnved' as const, label: 'ТН ВЭД', icon: 'M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5z' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setInputMode(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-xs font-medium transition-all ${
                    inputMode === tab.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
                  </svg>
                  {tab.label}
                </button>
              ))}
            </div>
            
            {/* Контент табов */}
            {inputMode === 'category' && (
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => selectCategory(cat)}
                    className="group p-3 rounded-xl bg-slate-50 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 border border-slate-200 hover:border-blue-300 transition-all text-left"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                      <CategoryIcon type={cat.icon} className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-xs font-medium text-slate-700 group-hover:text-blue-700 leading-tight">
                      {cat.name}
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {inputMode === 'search' && (
              <div ref={searchRef} className="relative">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onFocus={() => searchResults.length > 0 && setShowResults(true)}
                    placeholder="Введите название товара..."
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                  />
                </div>
                
                {showResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden z-50 max-h-48 overflow-y-auto">
                    {searchResults.map((product, i) => (
                      <button
                        key={i}
                        onClick={() => selectFromSearch(product)}
                        className="w-full px-3 py-2 text-left hover:bg-blue-50 transition-colors border-b border-slate-100 last:border-0"
                      >
                        <div className="text-sm font-medium text-slate-800">{product.name}</div>
                        <div className="text-xs text-slate-500">{product.category}</div>
                      </button>
                    ))}
                  </div>
                )}
                
                {searchQuery.length < 2 && (
                  <p className="mt-2 text-xs text-slate-400 text-center">
                    Начните вводить название товара
                  </p>
                )}
              </div>
            )}
            
            {inputMode === 'tnved' && (
              <div className="space-y-3">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5" />
                  </svg>
                  <input
                    type="text"
                    value={tnvedCode}
                    onChange={e => setTnvedCode(e.target.value.replace(/[^\d\s]/g, ''))}
                    placeholder="Например: 9503"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all font-mono"
                  />
                </div>
                <button
                  onClick={searchByTnved}
                  disabled={tnvedCode.length < 2}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-sm font-medium rounded-xl transition-all disabled:cursor-not-allowed"
                >
                  Найти документы
                </button>
              </div>
            )}
          </div>
        )}
        
        {/* ШАГ 2: Уточнение */}
        {step === 'details' && selectedProduct && (
          <div className="space-y-4">
            {/* Выбранный продукт */}
            <div className="flex items-center gap-2 p-2.5 bg-blue-50 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-800 truncate">{selectedProduct.name}</div>
                <div className="text-xs text-blue-600">{selectedProduct.category}</div>
              </div>
            </div>
            
            {/* Тип производства */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-2 block">Тип производства</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'serial' as const, label: 'Серийное', desc: 'Постоянно' },
                  { value: 'batch' as const, label: 'Партия', desc: 'Разово' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setProductionType(opt.value)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      productionType === opt.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-sm font-medium text-slate-800">{opt.label}</div>
                    <div className="text-xs text-slate-500">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Происхождение */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-2 block">Происхождение</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'russia' as const, label: 'Россия', desc: 'ЕАЭС' },
                  { value: 'import' as const, label: 'Импорт', desc: 'Из-за рубежа' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setOrigin(opt.value)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      origin === opt.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-sm font-medium text-slate-800">{opt.label}</div>
                    <div className="text-xs text-slate-500">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Срочность */}
            <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:border-orange-300 cursor-pointer transition-all">
              <input
                type="checkbox"
                checked={urgent}
                onChange={e => setUrgent(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
              />
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-800">Срочно</div>
                <div className="text-xs text-slate-500">Ускоренное оформление</div>
              </div>
              <span className="text-xs font-medium text-orange-500">+50%</span>
            </label>
            
            {/* Кнопка расчёта */}
            <button
              onClick={calculate}
              disabled={!productionType || !origin}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-slate-300 disabled:to-slate-400 text-white font-semibold rounded-xl transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span>Рассчитать</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        )}
        
        {/* ШАГ 3: Результат */}
        {step === 'result' && result && (
          <div className="space-y-4">
            {/* Документ */}
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl text-white">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-bold">ТРЕБУЕТСЯ</span>
              </div>
              <div className="font-bold">{result.documents[0]?.name || 'Сертификат соответствия'}</div>
              {result.documents[0]?.regulation && (
                <div className="text-emerald-100 text-sm">{result.documents[0].regulation}</div>
              )}
            </div>
            
            {/* Цена и сроки */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-xs text-slate-500 mb-0.5">Стоимость</div>
                <div className="text-lg font-bold text-slate-900">от {getPrice().min.toLocaleString()} ₽</div>
                <div className="text-xs text-slate-400">до {getPrice().max.toLocaleString()} ₽</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-xs text-slate-500 mb-0.5">Сроки</div>
                <div className="text-lg font-bold text-slate-900">{urgent ? 'от 3' : 'от 7'} дней</div>
                <div className="text-xs text-slate-400">{urgent ? 'до 7' : 'до 14'} дней</div>
              </div>
            </div>
            
            {/* Важно */}
            {result.notes.length > 0 && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  <p className="text-xs text-amber-800">{result.notes[0]}</p>
                </div>
              </div>
            )}
            
            {/* Кнопки */}
            <div className="space-y-2">
              <a
                href="tel:+78005553535"
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                Получить консультацию
              </a>
              <button
                onClick={reset}
                className="w-full py-2.5 text-slate-600 hover:text-slate-800 text-sm font-medium transition-colors"
              >
                ← Новый расчёт
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
