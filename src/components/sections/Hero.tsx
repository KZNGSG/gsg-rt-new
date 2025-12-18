'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { searchTNVEDFull, TNVEDCode, getTNVEDCount } from '@/lib/tnved-search';
import { determineCertification, CertificationResult, DocumentType } from '@/lib/certification-rules';

const POPULAR = ['косметика', 'БАДы', 'игрушки', 'одежда', 'маски', 'продукты'];

const QUICK_EXAMPLES = [
  { name: 'Детская игрушка', code: '9503' },
  { name: 'Косметика', code: '3304' },
  { name: 'Одежда', code: '62' },
  { name: 'Продукты', code: '21' },
];

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
  const config: Record<DocumentType, { bg: string; border: string; accent: string; title: string; icon: string }> = {
    certificate: { bg: 'from-emerald-500 to-green-600', border: 'border-emerald-400', accent: 'text-emerald-500', title: 'СЕРТИФИКАТ', icon: '✓' },
    declaration: { bg: 'from-blue-500 to-indigo-600', border: 'border-blue-400', accent: 'text-blue-500', title: 'ДЕКЛАРАЦИЯ', icon: '📋' },
    sgr: { bg: 'from-purple-500 to-violet-600', border: 'border-purple-400', accent: 'text-purple-500', title: 'СГР', icon: '🛡️' },
    registration: { bg: 'from-orange-500 to-amber-600', border: 'border-orange-400', accent: 'text-orange-500', title: 'РУ', icon: '⚕️' },
    rejection: { bg: 'from-slate-500 to-slate-600', border: 'border-slate-400', accent: 'text-slate-500', title: 'ОТКАЗНОЕ', icon: '📝' },
  };

  const c = config[type];

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${c.bg} p-1 shadow-lg animate-scaleIn`}>
      <div className="absolute inset-0 bg-grid opacity-20"></div>
      <div className="relative bg-white rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.bg} flex items-center justify-center text-white text-xl shadow-lg`}>
            {c.icon}
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

  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      {/* Премиум mesh градиент */}
      <div className="absolute inset-0 bg-mesh-blue"></div>
      <div className="absolute inset-0 bg-dots"></div>
      <div className="absolute inset-0 bg-diagonal"></div>
      
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
                Узнайте за <span className="text-white font-bold">30 секунд</span> — 
                без регистрации
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
                  <button
                    type="submit"
                    className="btn-premium bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg px-10 py-5 transition-all shadow-glow-orange"
                  >
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
                      <span className="text-sm text-slate-600 font-semibold">🔍 Найдено в базе {totalCodes.toLocaleString()} кодов</span>
                    </div>
                    {suggestions.map((item, index) => (
                      <button
                        key={item.code + index}
                        type="button"
                        onClick={() => handleSelectSuggestion(item)}
                        className="w-full px-5 py-4 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent border-b border-slate-100 last:border-0 transition-all group"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors truncate">{item.name}</div>
                            <div className="text-sm text-slate-500">{item.code_formatted}</div>
                          </div>
                          <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-sm font-bold rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
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
            <div className="flex flex-wrap items-center gap-2 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
              <span className="text-blue-200 text-sm font-medium">Популярное:</span>
              {POPULAR.map((term) => (
                <button
                  key={term}
                  onClick={() => router.push(`/tn-ved?q=${encodeURIComponent(term)}`)}
                  className="px-3 py-1.5 text-sm text-white/80 hover:text-white glass rounded-full hover:bg-white/20 transition-all"
                >
                  {term}
                </button>
              ))}
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-4 gap-4 pt-4 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
              {[
                { value: '12+', label: 'лет опыта', icon: '🏆' },
                { value: '60+', label: 'филиалов', icon: '🏢' },
                { value: '50K+', label: 'документов', icon: '📄' },
                { value: '1 день', label: 'срочно', icon: '⚡' },
              ].map((stat, i) => (
                <div key={stat.label} className="text-center glass rounded-2xl p-4 hover:bg-white/10 transition-all hover-lift">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-xs text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Правая часть - Калькулятор */}
          <div className="lg:col-span-2 animate-slideInRight">
            <div className="glass-white rounded-3xl shadow-premium-lg overflow-hidden border border-white/50">
              {/* Заголовок */}
              <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 px-6 py-5 overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-10"></div>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                <div className="relative">
                  <h3 className="text-xl font-black text-white flex items-center gap-3">
                    <span className="text-2xl">🧮</span>
                    Конструктор документов
                  </h3>
                  <p className="text-blue-200 text-sm mt-1">Узнайте стоимость мгновенно</p>
                </div>
              </div>

              <div className="p-6">
                {!calcResult ? (
                  <div className="space-y-5">
                    <div className="text-center">
                      <p className="text-slate-800 font-bold text-lg">Выберите категорию</p>
                      <p className="text-sm text-slate-500">или найдите товар в поиске слева</p>
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
                          className="card-3d group p-4 rounded-2xl bg-slate-50 border-2 border-transparent hover:border-blue-200 text-left"
                          style={{ animationDelay: `${idx * 100}ms` }}
                        >
                          <div className="text-2xl mb-2">
                            {idx === 0 ? '🧸' : idx === 1 ? '💄' : idx === 2 ? '👕' : '🍎'}
                          </div>
                          <span className="font-bold text-slate-700 group-hover:text-blue-600 transition-colors">{example.name}</span>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 py-3">
                      <div className="flex-1 h-px bg-slate-200"></div>
                      <span className="text-xs text-slate-400 font-medium">ИЛИ</span>
                      <div className="flex-1 h-px bg-slate-200"></div>
                    </div>

                    <p className="text-center text-sm text-slate-500">
                      👈 Введите название товара в поиске для точного расчёта
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 animate-fadeIn">
                    {/* Выбранный товар */}
                    <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-800 truncate">{calcProduct}</div>
                        {selectedCalcItem && (
                          <div className="text-sm text-slate-500">Код: {selectedCalcItem.code_formatted}</div>
                        )}
                      </div>
                      <button
                        onClick={() => { setCalcResult(null); setCalcProduct(''); setSelectedCalcItem(null); }}
                        className="ml-3 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Визуализация документа */}
                    {calcResult.documents.length > 0 && (
                      <DocumentResult
                        type={calcResult.documents[0].type}
                        regulation={calcResult.documents[0].regulation}
                      />
                    )}

                    {/* Цена и срок */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 rounded-xl p-4 text-center">
                        <div className="text-sm text-slate-500 mb-1">Стоимость</div>
                        <div className="text-2xl font-black text-gradient-orange">{calcResult.documents[0]?.price}</div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4 text-center">
                        <div className="text-sm text-slate-500 mb-1">Срок</div>
                        <div className="text-2xl font-black text-gradient-blue">{calcResult.documents[0]?.duration}</div>
                      </div>
                    </div>

                    {/* CTA */}
                    <button className="w-full btn-premium ring-pulse bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 rounded-xl transition-all shadow-glow-orange flex items-center justify-center gap-2 text-lg">
                      <span>Получить точный расчёт</span>
                      <span className="text-xl">→</span>
                    </button>

                    {/* Телефон */}
                    <div className="text-center">
                      <span className="text-slate-400 text-sm">Или позвоните: </span>
                      <a href="tel:88005505288" className="font-bold text-blue-600 hover:text-blue-700 text-lg">
                        8 800 550-52-88
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
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
