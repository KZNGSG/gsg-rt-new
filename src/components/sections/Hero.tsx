'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { searchTNVEDFull, TNVEDCode, getTNVEDCount } from '@/lib/tnved-search';
import { determineCertification, CertificationResult, DocumentType } from '@/lib/certification-rules';
import { LiveResultPanel } from '@/components/calculator/LiveResultPanel';

const POPULAR = ['косметика', 'БАДы', 'игрушки', 'одежда', 'маски', 'продукты'];

const QUICK_EXAMPLES = [
  { name: 'Детская игрушка', code: '9503', icon: 'toy' },
  { name: 'Косметика', code: '3304', icon: 'cosmetic' },
  { name: 'Одежда', code: '62', icon: 'clothing' },
  { name: 'Продукты', code: '21', icon: 'food' },
];

function CategoryIcon({ type, className }: { type: string; className?: string }) {
  const icons: Record<string, React.ReactElement> = {
    toy: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>,
    cosmetic: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>,
    clothing: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" /></svg>,
    food: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m18-4.5a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  };
  return icons[type] || icons.toy;
}

// Плавающие иконки документов
function FloatingDocs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Сертификат */}
      <div className="absolute top-[15%] left-[8%] animate-float opacity-20">
        <div className="w-20 h-28 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 p-2">
          <div className="w-full h-3 bg-white/30 rounded mb-2"></div>
          <div className="w-3/4 h-2 bg-white/20 rounded mb-1"></div>
          <div className="w-full h-2 bg-white/20 rounded mb-1"></div>
          <div className="w-2/3 h-2 bg-white/20 rounded"></div>
          <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-white/30"></div>
        </div>
      </div>
      
      {/* Декларация */}
      <div className="absolute top-[25%] right-[5%] animate-float-reverse opacity-15" style={{animationDelay: '-2s'}}>
        <div className="w-24 h-32 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20 p-2 rotate-6">
          <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-blue-400/30"></div>
          <div className="w-full h-2 bg-white/20 rounded mb-1"></div>
          <div className="w-3/4 h-2 bg-white/20 rounded mb-1"></div>
          <div className="w-full h-2 bg-white/20 rounded"></div>
        </div>
      </div>
      
      {/* ГОСТ */}
      <div className="absolute bottom-[20%] left-[3%] animate-float opacity-10" style={{animationDelay: '-4s'}}>
        <div className="w-16 h-20 bg-white/10 rounded backdrop-blur-sm border border-white/20 -rotate-12"></div>
      </div>
      
      {/* Маленький документ */}
      <div className="absolute bottom-[30%] right-[10%] animate-float-slow opacity-20" style={{animationDelay: '-1s'}}>
        <div className="w-14 h-18 bg-gradient-to-br from-orange-400/20 to-orange-600/20 rounded border border-orange-400/30 rotate-12"></div>
      </div>

      {/* Абстрактные формы */}
      <div className="absolute top-[60%] left-[15%] w-32 h-32 bg-blue-400/10 rounded-full blur-2xl animate-morph"></div>
      <div className="absolute top-[10%] right-[20%] w-40 h-40 bg-orange-400/10 rounded-full blur-3xl animate-morph" style={{animationDelay: '-4s'}}></div>
    </div>
  );
}

function DocumentResult({ type, regulation }: { type: DocumentType; regulation?: string }) {
  const config: Record<DocumentType, { bg: string; border: string; accent: string; title: string }> = {
    certificate: { bg: 'from-emerald-500 to-green-600', border: 'border-emerald-400', accent: 'text-emerald-500', title: 'СЕРТИФИКАТ' },
    declaration: { bg: 'from-blue-500 to-indigo-600', border: 'border-blue-400', accent: 'text-blue-500', title: 'ДЕКЛАРАЦИЯ' },
    sgr: { bg: 'from-purple-500 to-violet-600', border: 'border-purple-400', accent: 'text-purple-500', title: 'СГР' },
    registration: { bg: 'from-orange-500 to-amber-600', border: 'border-orange-400', accent: 'text-orange-500', title: 'РУ' },
    rejection: { bg: 'from-slate-500 to-slate-600', border: 'border-slate-400', accent: 'text-slate-500', title: 'ОТКАЗНОЕ' },
  };

  const c = config[type];

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${c.bg} p-1 shadow-lg animate-scaleIn`}>
      <div className="absolute inset-0 bg-grid opacity-20"></div>
      <div className="relative bg-white rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.bg} flex items-center justify-center text-white shadow-lg`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
          </div>
          <div>
            <div className={`text-sm font-black ${c.accent} tracking-wide`}>{c.title}</div>
            {regulation && <div className="text-xs text-slate-500 font-medium">{regulation}</div>}
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
      const results = searchTNVEDFull(searchQuery, 6);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      
      // Автоматически показываем результат для первого найденного товара
      if (results.length > 0) {
        const firstResult = results[0];
        setSelectedCalcItem(firstResult);
        setCalcProduct(firstResult.name);
        const certResult = determineCertification(firstResult.code, firstResult.name);
        setCalcResult(certResult);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      // Сбрасываем результат если поиск очищен
      if (searchQuery.trim().length === 0) {
        setCalcResult(null);
        setCalcProduct('');
        setSelectedCalcItem(null);
      }
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

  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      {/* Премиум градиент — фирменный синий как у топовых студий */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 119, 204, 0.85) 0%, rgba(0, 90, 160, 0.9) 35%, rgba(0, 70, 130, 0.95) 65%, rgba(0, 50, 100, 1) 100%)'
        }}
      ></div>
      {/* Мягкое свечение для премиум эффекта */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full blur-[150px]"
          style={{ background: 'radial-gradient(circle, rgba(255, 127, 36, 0.12) 0%, transparent 70%)' }}
        ></div>
        <div 
          className="absolute bottom-[-30%] left-[-10%] w-[700px] h-[700px] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(0, 140, 220, 0.2) 0%, transparent 60%)' }}
        ></div>
      </div>
      <div className="absolute inset-0 bg-dots opacity-8"></div>
      
      {/* Плавающие документы */}
      <FloatingDocs />

      <div className="relative container mx-auto px-4 py-16 lg:py-20">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          {/* Левая часть */}
          <div className="lg:col-span-3 space-y-8">
            {/* Бейдж */}
            <div className="inline-flex items-center gap-3 animate-fadeInUp">
              <div className="flex items-center gap-2 px-4 py-2 glass rounded-full">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
                </span>
                <span className="text-sm font-semibold text-white">Работаем по всей России</span>
              </div>
              <div className="px-3 py-1.5 bg-orange-500 text-white text-sm font-bold rounded-full shadow-glow-orange animate-pulse-glow">
                60+ филиалов
              </div>
            </div>

            {/* Заголовок */}
            <div className="space-y-4 animate-fadeInUp" style={{animationDelay: '0.1s'}}>
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.05] tracking-tight">
                Какие документы
                <br />
                нужны на
                <br />
                <span className="text-gradient-shine inline-block">ваш товар?</span>
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100/90 max-w-xl font-medium">
                Узнайте за <span className="text-white font-bold">30 секунд</span> — без регистрации
              </p>
            </div>

            {/* Поиск */}
            <form onSubmit={handleSearch} className="relative animate-fadeInUp" style={{animationDelay: '0.2s'}}>
              <div ref={searchRef} className="relative">
                <div className="flex glass-white rounded-2xl overflow-hidden shadow-premium-lg hover:shadow-glow-blue transition-shadow duration-500">
                  <div className="flex-1 flex items-center px-6">
                    <svg className="w-6 h-6 text-blue-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <button type="submit" className="btn-premium bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg px-10 py-5 transition-all shadow-glow-orange">
                    <span className="hidden sm:inline mr-2">Найти</span>
                    <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>

                {/* Саджесты */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-3 glass-white rounded-2xl shadow-premium-lg overflow-hidden z-50 animate-scaleIn">
                    <div className="px-5 py-3 bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-100">
                      <span className="text-sm text-slate-600 font-semibold flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        Найдено в базе {totalCodes.toLocaleString()} кодов
                      </span>
                    </div>
                    {suggestions.map((item, index) => (
                      <button key={item.code + index} type="button" onClick={() => handleSelectSuggestion(item)} className="w-full px-5 py-4 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent border-b border-slate-100 last:border-0 transition-all group">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors truncate">{item.name}</div>
                            <div className="text-sm text-slate-500">{item.code_formatted}</div>
                          </div>
                          <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-sm font-bold rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">{item.code}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </form>

            {/* Популярное */}
            <div className="flex flex-wrap items-center gap-2 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
              <span className="text-blue-200 text-sm font-medium">Популярное:</span>
              {POPULAR.map((term) => (
                <button key={term} onClick={() => router.push(`/tn-ved?q=${encodeURIComponent(term)}`)} className="px-3 py-1.5 text-sm text-white/80 hover:text-white glass rounded-full hover:bg-white/20 transition-all">
                  {term}
                </button>
              ))}
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-4 gap-4 pt-4 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
              {[
                { value: '12+', label: 'лет опыта', icon: 'M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172' },
                { value: '60+', label: 'филиалов', icon: 'M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21' },
                { value: '50K+', label: 'документов', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
                { value: '1 день', label: 'срочно', icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' },
              ].map((stat) => (
                <div key={stat.label} className="text-center glass rounded-2xl p-4 hover:bg-white/10 transition-all hover-lift">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-white/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                    </svg>
                  </div>
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-xs text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Правая часть - Живой результат поиска */}
          <div className="lg:col-span-2 animate-slideInRight">
            <LiveResultPanel 
              result={calcResult}
              productName={calcProduct}
              productCode={selectedCalcItem?.code}
            />
          </div>
        </div>
      </div>

      {/* Волна снизу */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}
