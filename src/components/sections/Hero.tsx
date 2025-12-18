'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { searchTNVEDFull, TNVEDCode, getTNVEDCount } from '@/lib/tnved-search';
import { determineCertification, CertificationResult, DocumentType } from '@/lib/certification-rules';

const CATEGORIES = [
  { name: 'Пищевая продукция', slug: 'pishchevaya-produktsiya', icon: 'food', color: 'from-amber-400 to-orange-500' },
  { name: 'Медизделия', slug: 'meditsinskie-izdeliya', icon: 'medical', color: 'from-rose-400 to-red-500' },
  { name: 'Детские товары', slug: 'detskie-tovary', icon: 'children', color: 'from-pink-400 to-rose-500' },
  { name: 'Косметика', slug: 'kosmetika', icon: 'cosmetics', color: 'from-purple-400 to-indigo-500' },
  { name: 'Оборудование', slug: 'oborudovanie', icon: 'equipment', color: 'from-slate-400 to-slate-600' },
  { name: 'Одежда и обувь', slug: 'odezhda-i-obuv', icon: 'clothing', color: 'from-cyan-400 to-blue-500' },
];

const POPULAR = ['косметика', 'БАДы', 'детские игрушки', 'одежда', 'медицинские маски', 'продукты питания'];

const QUICK_EXAMPLES = [
  { name: 'Детская игрушка', code: '9503', iconType: 'toy', gradient: 'from-pink-500 to-rose-500' },
  { name: 'Косметика', code: '3304', iconType: 'cosmetic', gradient: 'from-purple-500 to-indigo-500' },
  { name: 'Одежда', code: '62', iconType: 'clothing', gradient: 'from-cyan-500 to-blue-500' },
  { name: 'Бытовая химия', code: '3402', iconType: 'chemistry', gradient: 'from-emerald-500 to-teal-500' },
  { name: 'Продукты питания', code: '21', iconType: 'food', gradient: 'from-amber-500 to-orange-500' },
  { name: 'Электроника', code: '85', iconType: 'electronics', gradient: 'from-slate-500 to-slate-700' },
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
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    ),
    equipment: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
    clothing: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  };
  return icons[type] || icons.food;
}

function ExampleIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactElement> = {
    toy: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    cosmetic: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    clothing: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" />
      </svg>
    ),
    chemistry: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
    food: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m18-4.5a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    electronics: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
  };
  return icons[type] || icons.toy;
}

function DocumentVisualCompact({ type, regulation }: { type: DocumentType; regulation?: string }) {
  const config: Record<DocumentType, { gradient: string; border: string; accent: string; title: string; icon: string }> = {
    certificate: { gradient: 'from-emerald-50 via-green-50 to-teal-50', border: 'border-emerald-300', accent: 'text-emerald-600', title: 'СЕРТИФИКАТ', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    declaration: { gradient: 'from-blue-50 via-indigo-50 to-violet-50', border: 'border-blue-300', accent: 'text-blue-600', title: 'ДЕКЛАРАЦИЯ', icon: 'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z' },
    sgr: { gradient: 'from-purple-50 via-violet-50 to-fuchsia-50', border: 'border-purple-300', accent: 'text-purple-600', title: 'СГР', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
    registration: { gradient: 'from-amber-50 via-orange-50 to-yellow-50', border: 'border-amber-300', accent: 'text-amber-600', title: 'РУ', icon: 'M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z' },
    rejection: { gradient: 'from-slate-50 via-gray-50 to-zinc-50', border: 'border-slate-300', accent: 'text-slate-600', title: 'ОТКАЗНОЕ', icon: 'M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z' },
  };

  const c = config[type];

  return (
    <div className={`relative bg-gradient-to-br ${c.gradient} rounded-2xl border-2 ${c.border} p-4 shadow-lg overflow-hidden`}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/30 rounded-full translate-y-1/2 -translate-x-1/2"></div>
      
      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center flex-shrink-0`}>
            <svg className={`w-6 h-6 ${c.accent}`} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={c.icon} />
            </svg>
          </div>
          <div>
            <div className={`text-sm font-bold ${c.accent} tracking-wide`}>{c.title}</div>
            {regulation && <div className="text-xs text-slate-500 font-medium">{regulation}</div>}
          </div>
        </div>

        {/* QR & Stamp */}
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full border-2 ${c.border} flex items-center justify-center bg-white/70 rotate-[-8deg] shadow-sm`}>
            <span className="text-[6px] font-black text-slate-600">ЕАЭС</span>
          </div>
          <div className="w-7 h-7 bg-white rounded-lg shadow-sm p-1">
            <div className="w-full h-full grid grid-cols-3 gap-[1px]">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className={`rounded-[1px] ${[0,2,4,6,8].includes(i) ? 'bg-slate-800' : 'bg-slate-200'}`} />
              ))}
            </div>
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
      {/* Premium Background */}
      <div className="absolute inset-0 bg-mesh"></div>
      <div className="absolute inset-0 bg-grid opacity-50"></div>
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-1.5s' }}></div>

      <div className="relative container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          {/* Left - Search */}
          <div className="lg:col-span-3 space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/50 animate-fadeIn">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-slate-700">Работаем по всей России</span>
              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">60+ филиалов</span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
                Какие документы нужны
                <br />
                <span className="text-gradient-orange">на ваш товар?</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-xl">
                Узнайте требования к сертификации за <span className="font-bold text-indigo-600">30 секунд</span>. 
                База из {totalCodes.toLocaleString()} кодов ТН ВЭД
              </p>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="relative">
              <div ref={searchRef} className="relative">
                <div className="flex bg-white rounded-2xl overflow-hidden shadow-premium-lg border border-slate-200/50 hover:border-indigo-300 transition-all duration-300 hover:shadow-glow">
                  <div className="flex-1 flex items-center px-6">
                    <svg className="w-6 h-6 text-indigo-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                      placeholder="Название товара или код ТН ВЭД..."
                      className="w-full py-5 text-lg text-slate-700 placeholder-slate-400 focus:outline-none bg-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-premium bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-10 py-5 transition-all flex items-center gap-2"
                  >
                    <span className="hidden sm:inline">Найти</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>

                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 max-h-96 overflow-y-auto animate-scaleIn">
                    <div className="px-5 py-3 bg-gradient-to-r from-slate-50 to-indigo-50/50 border-b border-slate-100">
                      <span className="text-sm text-slate-600 font-medium">Найдено в базе {totalCodes.toLocaleString()} кодов</span>
                    </div>
                    {suggestions.map((item, index) => (
                      <button
                        key={item.code + index}
                        type="button"
                        onClick={() => handleSelectSuggestion(item)}
                        className="w-full px-5 py-4 text-left hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 border-b border-slate-100 last:border-0 transition-all group"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors truncate">{item.name}</div>
                            <div className="text-sm text-slate-500">{item.code_formatted}</div>
                          </div>
                          <span className="px-3 py-1.5 bg-indigo-100 text-indigo-700 text-sm font-bold rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            {item.code}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </form>

            {/* Popular */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-slate-500 font-medium">Популярное:</span>
              {POPULAR.map((term) => (
                <button
                  key={term}
                  onClick={() => handleQuickSearch(term)}
                  className="px-4 py-2 bg-white/80 hover:bg-white rounded-full text-sm font-medium text-slate-600 hover:text-indigo-600 border border-slate-200 hover:border-indigo-300 transition-all hover:shadow-md"
                >
                  {term}
                </button>
              ))}
            </div>

            {/* Categories */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {CATEGORIES.map((cat, idx) => (
                <button
                  key={cat.slug}
                  onClick={() => router.push(`/tn-ved?category=${cat.slug}`)}
                  className="group flex flex-col items-center gap-2 p-4 bg-white/80 hover:bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-200 transition-all hover:shadow-lg hover-lift"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className={`w-12 h-12 flex items-center justify-center bg-gradient-to-br ${cat.color} rounded-xl text-white shadow-lg group-hover:scale-110 transition-transform`}>
                    <CategoryIcon type={cat.icon} />
                  </div>
                  <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900 text-center leading-tight">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right - Calculator */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-premium-lg border border-slate-200/50 overflow-hidden hover:shadow-2xl transition-shadow duration-500">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient px-6 py-5">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-10"></div>
                <div className="relative">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Конструктор документов
                  </h3>
                  <p className="text-indigo-200 text-sm mt-1">Узнайте стоимость за 10 секунд</p>
                </div>
              </div>

              <div className="p-6">
                {!calcResult ? (
                  <div className="space-y-5">
                    <div className="text-center">
                      <p className="text-slate-700 font-semibold">Попробуйте на примере:</p>
                      <p className="text-sm text-slate-500 mt-1">Выберите категорию товара</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {QUICK_EXAMPLES.map((example, idx) => (
                        <button
                          key={example.code}
                          onClick={() => {
                            setCalcProduct(example.name);
                            setSelectedCalcItem(null);
                            const result = determineCertification(example.code, example.name);
                            setCalcResult(result);
                          }}
                          className="group flex items-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-white border-2 border-transparent hover:border-indigo-200 transition-all hover:shadow-lg hover-lift"
                          style={{ animationDelay: `${idx * 50}ms` }}
                        >
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${example.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                            <ExampleIcon type={example.iconType} />
                          </div>
                          <span className="text-sm font-semibold text-slate-700 group-hover:text-indigo-700 text-left transition-colors">{example.name}</span>
                        </button>
                      ))}
                    </div>

                    <div className="relative py-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="px-4 bg-white text-sm text-slate-500">или найдите в поиске</span>
                      </div>
                    </div>

                    <p className="text-center text-sm text-slate-500">
                      Введите название товара слева для точного расчёта
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 animate-fadeIn">
                    {/* Product */}
                    <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-800 truncate">{calcProduct}</div>
                        {selectedCalcItem && (
                          <div className="text-sm text-slate-500">{selectedCalcItem.code_formatted}</div>
                        )}
                      </div>
                      <button
                        onClick={() => { setCalcResult(null); setCalcProduct(''); setSelectedCalcItem(null); }}
                        className="ml-3 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Document Visual */}
                    {calcResult.documents.length > 0 && (
                      <DocumentVisualCompact
                        type={calcResult.documents[0].type}
                        regulation={calcResult.documents[0].regulation}
                      />
                    )}

                    {/* Main Document */}
                    <div className={`p-4 rounded-xl border-l-4 ${
                      calcResult.documents[0]?.type === 'certificate' ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-500' :
                      calcResult.documents[0]?.type === 'declaration' ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-500' :
                      calcResult.documents[0]?.type === 'sgr' ? 'bg-gradient-to-r from-purple-50 to-violet-50 border-purple-500' :
                      calcResult.documents[0]?.type === 'registration' ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-500' :
                      'bg-gradient-to-r from-slate-50 to-gray-50 border-slate-400'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-slate-800">{calcResult.documents[0]?.name}</div>
                        <span className="text-lg font-black text-gradient-orange">{calcResult.documents[0]?.price}</span>
                      </div>
                      <div className="text-sm text-slate-600 mt-1 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {calcResult.documents[0]?.duration}
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl p-5 text-white shadow-xl">
                      <div className="text-center mb-4">
                        <div className="text-indigo-200 text-sm font-medium">Ориентировочная стоимость</div>
                        <div className="text-3xl font-black mt-1">{calcResult.documents[0]?.price}</div>
                        <div className="text-indigo-200 text-sm">срок: {calcResult.documents[0]?.duration}</div>
                      </div>

                      <div className="bg-white/10 rounded-xl p-3 mb-4 text-sm text-indigo-100">
                        Точную стоимость рассчитает эксперт после получения данных о продукции
                      </div>

                      <button className="w-full btn-premium ring-pulse bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/30">
                        <span>Получить точный расчёт</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </button>
                    </div>

                    {/* Phone */}
                    <div className="text-center pt-2">
                      <span className="text-slate-500 text-sm">Или позвоните: </span>
                      <a href="tel:88005505288" className="font-bold text-gradient hover:underline">
                        8 800 550-52-88
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {[
            { value: '12+', label: 'лет опыта', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
            { value: '60+', label: 'филиалов', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
            { value: '50 000+', label: 'документов', icon: 'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z' },
            { value: 'от 1 дня', label: 'оформление', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
          ].map((stat, idx) => (
            <div 
              key={stat.label} 
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/80 hover:border-indigo-200 transition-all hover:shadow-lg hover-lift text-center"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                  </svg>
                </div>
                <div className="text-3xl font-black text-gradient">{stat.value}</div>
                <div className="text-slate-600 font-medium mt-1">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
