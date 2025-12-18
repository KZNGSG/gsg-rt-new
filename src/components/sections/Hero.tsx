'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { searchTNVEDFull, TNVEDCode, getTNVEDCount } from '@/lib/tnved-search';
import { determineCertification, CertificationResult, DocumentType } from '@/lib/certification-rules';

const CATEGORIES = [
  { name: 'Пищевая продукция', slug: 'pishchevaya-produktsiya', icon: 'food' },
  { name: 'Медизделия', slug: 'meditsinskie-izdeliya', icon: 'medical' },
  { name: 'Детские товары', slug: 'detskie-tovary', icon: 'children' },
  { name: 'Косметика', slug: 'kosmetika', icon: 'cosmetics' },
  { name: 'Оборудование', slug: 'oborudovanie', icon: 'equipment' },
  { name: 'Одежда и обувь', slug: 'odezhda-i-obuv', icon: 'clothing' },
];

const POPULAR = ['косметика', 'БАДы', 'детские игрушки', 'одежда', 'медицинские маски', 'продукты питания'];

const QUICK_EXAMPLES = [
  { name: 'Детская игрушка', code: '9503', iconType: 'toy' },
  { name: 'Косметика', code: '3304', iconType: 'cosmetic' },
  { name: 'Одежда', code: '62', iconType: 'clothing' },
  { name: 'Бытовая химия', code: '3402', iconType: 'chemistry' },
  { name: 'Продукты питания', code: '21', iconType: 'food' },
  { name: 'Электроника', code: '85', iconType: 'electronics' },
];

function CategoryIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactElement> = {
    food: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m18-4.5a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    medical: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    children: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    cosmetics: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    equipment: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
    clothing: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
      </svg>
    ),
  };
  return icons[type] || icons.food;
}

function ExampleIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactElement> = {
    toy: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>,
    cosmetic: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>,
    clothing: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" /></svg>,
    chemistry: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>,
    food: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    electronics: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>,
  };
  return icons[type] || icons.toy;
}

function DocumentVisualCompact({ type, regulation }: { type: DocumentType; regulation?: string }) {
  const config: Record<DocumentType, { bg: string; border: string; accent: string; title: string }> = {
    certificate: { bg: 'bg-green-50', border: 'border-green-400', accent: 'text-green-600', title: 'СЕРТИФИКАТ' },
    declaration: { bg: 'bg-blue-50', border: 'border-blue-400', accent: 'text-blue-600', title: 'ДЕКЛАРАЦИЯ' },
    sgr: { bg: 'bg-purple-50', border: 'border-purple-400', accent: 'text-purple-600', title: 'СГР' },
    registration: { bg: 'bg-orange-50', border: 'border-orange-400', accent: 'text-orange-600', title: 'РУ' },
    rejection: { bg: 'bg-slate-50', border: 'border-slate-300', accent: 'text-slate-600', title: 'ОТКАЗНОЕ' },
  };

  const c = config[type];

  return (
    <div className={`relative ${c.bg} rounded-xl border-2 ${c.border} p-4 shadow-md`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white shadow flex items-center justify-center">
            <svg className={`w-5 h-5 ${c.accent}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <div className={`text-sm font-bold ${c.accent}`}>{c.title}</div>
            {regulation && <div className="text-xs text-slate-500">{regulation}</div>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full border-2 ${c.border} flex items-center justify-center bg-white rotate-[-8deg]`}>
            <span className="text-[5px] font-bold text-slate-600">ЕАЭС</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<TNVEDCode[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const [calcProduct, setCalcProduct] = useState('');
  const [calcResult, setCalcResult] = useState<CertificationResult | null>(null);
  const [selectedCalcItem, setSelectedCalcItem] = useState<TNVEDCode | null>(null);
  const totalCodes = getTNVEDCount();

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const results = searchTNVEDFull(searchQuery, 8);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tn-ved?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSelectSuggestion = (item: TNVEDCode) => {
    setSearchQuery('');
    setShowSuggestions(false);
    setSelectedCalcItem(item);
    setCalcProduct(item.name);
    const result = determineCertification(item.code, item.name);
    setCalcResult(result);
  };

  const handleQuickSearch = (term: string) => {
    router.push(`/tn-ved?q=${encodeURIComponent(term)}`);
  };

  return (
    <section className="relative overflow-hidden">
      {/* СИНИЙ ФИРМЕННЫЙ ФОН */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600"></div>
      <div className="absolute inset-0 bg-dots-light opacity-30"></div>
      
      {/* Декоративные элементы */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>

      <div className="relative container mx-auto px-4 py-12 lg:py-20">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          {/* Левая часть - поиск */}
          <div className="lg:col-span-3 space-y-6">
            {/* Бейдж */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 animate-fadeIn">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
              </span>
              <span className="text-sm font-medium text-white">Работаем по всей России</span>
              <span className="px-2 py-0.5 bg-white/20 text-white text-xs font-bold rounded-full">60+ филиалов</span>
            </div>

            {/* Заголовок */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.1]">
                Какие документы нужны
                <br />
                <span className="text-orange-400">на ваш товар?</span>
              </h1>
              <p className="text-xl text-blue-100 max-w-xl">
                Узнайте требования к сертификации за <span className="font-bold text-white">30 секунд</span>
              </p>
            </div>

            {/* Поиск */}
            <form onSubmit={handleSearch} className="relative">
              <div ref={searchRef} className="relative">
                <div className="flex bg-white rounded-xl overflow-hidden shadow-2xl">
                  <div className="flex-1 flex items-center px-5">
                    <svg className="w-5 h-5 text-slate-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                      placeholder="Название товара или код ТН ВЭД..."
                      className="w-full py-4 text-slate-700 placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 transition-colors flex items-center gap-2"
                  >
                    Найти
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>

                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 max-h-80 overflow-y-auto animate-scaleIn">
                    <div className="px-4 py-2 bg-slate-50 border-b border-slate-100">
                      <span className="text-sm text-slate-500">Найдено в базе {totalCodes.toLocaleString()} кодов</span>
                    </div>
                    {suggestions.map((item, index) => (
                      <button
                        key={item.code + index}
                        type="button"
                        onClick={() => handleSelectSuggestion(item)}
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-slate-100 last:border-0 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-slate-800 truncate">{item.name}</div>
                            <div className="text-sm text-slate-500">{item.code_formatted}</div>
                          </div>
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm font-bold rounded">
                            {item.code}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </form>

            {/* Популярное */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-blue-200 text-sm">Популярное:</span>
              {POPULAR.map((term) => (
                <button
                  key={term}
                  onClick={() => handleQuickSearch(term)}
                  className="text-sm text-white/80 hover:text-white hover:underline transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>

            {/* Категории */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => router.push(`/tn-ved?category=${cat.slug}`)}
                  className="group flex flex-col items-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 hover:border-white/30 transition-all"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-white/20 group-hover:bg-white/30 rounded-lg text-white transition-colors">
                    <CategoryIcon type={cat.icon} />
                  </div>
                  <span className="text-[11px] text-white/90 text-center leading-tight font-medium">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Правая часть - калькулятор */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Заголовок - СИНИЙ */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Конструктор документов
                </h3>
                <p className="text-blue-100 text-sm">Узнайте стоимость за 10 секунд</p>
              </div>

              <div className="p-5">
                {!calcResult ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-slate-700 font-semibold">Попробуйте на примере:</p>
                      <p className="text-sm text-slate-500">Выберите категорию товара</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {QUICK_EXAMPLES.map((example) => (
                        <button
                          key={example.code}
                          onClick={() => {
                            setCalcProduct(example.name);
                            setSelectedCalcItem(null);
                            const result = determineCertification(example.code, example.name);
                            setCalcResult(result);
                          }}
                          className="group flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-all"
                        >
                          <div className="w-9 h-9 rounded-lg bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center text-blue-600 transition-colors">
                            <ExampleIcon type={example.iconType} />
                          </div>
                          <span className="text-sm font-medium text-slate-700 group-hover:text-blue-700 text-left">{example.name}</span>
                        </button>
                      ))}
                    </div>

                    <div className="relative py-3">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="px-3 bg-white text-sm text-slate-400">или найдите в поиске</span>
                      </div>
                    </div>

                    <p className="text-center text-sm text-slate-500">
                      Введите название товара слева для точного расчёта
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 animate-fadeIn">
                    {/* Товар */}
                    <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-700 truncate">{calcProduct}</div>
                        {selectedCalcItem && (
                          <div className="text-sm text-slate-500">{selectedCalcItem.code_formatted}</div>
                        )}
                      </div>
                      <button
                        onClick={() => { setCalcResult(null); setCalcProduct(''); setSelectedCalcItem(null); }}
                        className="ml-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Документ */}
                    {calcResult.documents.length > 0 && (
                      <DocumentVisualCompact
                        type={calcResult.documents[0].type}
                        regulation={calcResult.documents[0].regulation}
                      />
                    )}

                    {/* Основной документ */}
                    <div className={`p-3 rounded-lg border-l-4 ${
                      calcResult.documents[0]?.type === 'certificate' ? 'bg-green-50 border-green-500' :
                      calcResult.documents[0]?.type === 'declaration' ? 'bg-blue-50 border-blue-500' :
                      calcResult.documents[0]?.type === 'sgr' ? 'bg-purple-50 border-purple-500' :
                      calcResult.documents[0]?.type === 'registration' ? 'bg-orange-50 border-orange-500' :
                      'bg-slate-50 border-slate-400'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-slate-800">{calcResult.documents[0]?.name}</div>
                        <span className="text-orange-600 font-bold">{calcResult.documents[0]?.price}</span>
                      </div>
                      <div className="text-sm text-slate-500 mt-1">{calcResult.documents[0]?.duration}</div>
                    </div>

                    {/* CTA - СИНИЙ ФОН */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 text-white">
                      <div className="text-center mb-3">
                        <div className="text-blue-200 text-sm">Ориентировочная стоимость</div>
                        <div className="text-2xl font-bold">{calcResult.documents[0]?.price}</div>
                        <div className="text-blue-200 text-sm">срок: {calcResult.documents[0]?.duration}</div>
                      </div>

                      <div className="bg-white/10 rounded-lg p-2 mb-3 text-sm text-blue-100">
                        Точную стоимость рассчитает эксперт после получения данных
                      </div>

                      <button className="w-full btn-premium bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-orange">
                        <span>Получить точный расчёт</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </button>
                    </div>

                    {/* Телефон */}
                    <div className="text-center text-sm">
                      <span className="text-slate-400">Или позвоните: </span>
                      <a href="tel:88005505288" className="font-bold text-blue-600 hover:text-blue-700">
                        8 800 550-52-88
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/20">
          {[
            { value: '12+', label: 'лет опыта' },
            { value: '60+', label: 'филиалов' },
            { value: '50 000+', label: 'документов' },
            { value: 'от 1 дня', label: 'оформление' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-black text-white">{stat.value}</div>
              <div className="text-blue-200">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
