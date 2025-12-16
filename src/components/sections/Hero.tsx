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

// Дополнительные услуги
const ADDITIONAL_SERVICES = [
  { id: 'protocol', name: 'Протокол испытаний', price: 8000, description: 'Лабораторные испытания продукции' },
  { id: 'urgent', name: 'Срочное оформление', multiplier: 1.5, description: 'Ускоренное оформление за 1-3 дня' },
  { id: 'marking', name: 'Помощь с маркировкой', price: 5000, description: 'Разработка этикетки по ТР ТС' },
  { id: 'consult', name: 'Консультация эксперта', price: 0, description: 'Бесплатно при оформлении' },
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
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
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

// Визуализация документа
function DocumentVisual({ type, name, regulation }: { type: DocumentType; name: string; regulation?: string }) {
  const colors: Record<DocumentType, { bg: string; border: string; accent: string }> = {
    certificate: { bg: 'from-green-50 to-emerald-50', border: 'border-green-400', accent: 'text-green-600' },
    declaration: { bg: 'from-blue-50 to-indigo-50', border: 'border-blue-400', accent: 'text-blue-600' },
    sgr: { bg: 'from-purple-50 to-violet-50', border: 'border-purple-400', accent: 'text-purple-600' },
    registration: { bg: 'from-orange-50 to-amber-50', border: 'border-orange-400', accent: 'text-orange-600' },
    rejection: { bg: 'from-slate-50 to-gray-50', border: 'border-slate-300', accent: 'text-slate-600' },
  };

  const color = colors[type];
  const docTitle = type === 'certificate' ? 'СЕРТИФИКАТ СООТВЕТСТВИЯ' :
                   type === 'declaration' ? 'ДЕКЛАРАЦИЯ О СООТВЕТСТВИИ' :
                   type === 'sgr' ? 'СВИДЕТЕЛЬСТВО' :
                   type === 'registration' ? 'РЕГИСТРАЦИОННОЕ УДОСТОВЕРЕНИЕ' :
                   'ОТКАЗНОЕ ПИСЬМО';

  return (
    <div className={`relative bg-gradient-to-br ${color.bg} rounded-xl border-2 ${color.border} p-4 shadow-lg overflow-hidden`}>
      {/* Фоновый паттерн */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
          </pattern>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      {/* Заголовок документа */}
      <div className="relative text-center mb-3">
        <div className="flex justify-center mb-2">
          <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center">
            <svg className={`w-5 h-5 ${color.accent}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>
        <div className={`text-[10px] font-bold tracking-wider ${color.accent}`}>
          {docTitle}
        </div>
        {regulation && (
          <div className="text-[9px] text-slate-500 mt-0.5">{regulation}</div>
        )}
      </div>

      {/* Линии документа (имитация текста) */}
      <div className="relative space-y-1.5 mb-3">
        <div className="h-1.5 bg-slate-200/60 rounded w-full"></div>
        <div className="h-1.5 bg-slate-200/60 rounded w-4/5"></div>
        <div className="h-1.5 bg-slate-200/60 rounded w-full"></div>
        <div className="h-1.5 bg-slate-200/60 rounded w-3/4"></div>
      </div>

      {/* Нижняя часть - печать и QR */}
      <div className="relative flex items-end justify-between">
        {/* Печать */}
        <div className="relative">
          <div className={`w-12 h-12 rounded-full border-2 ${color.border} flex items-center justify-center bg-white/50 rotate-[-8deg]`}>
            <div className="text-center">
              <div className={`text-[6px] font-bold ${color.accent}`}>ЕАЭС</div>
              <div className="text-[5px] text-slate-500">РФ</div>
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500 rounded-full opacity-80"></div>
        </div>

        {/* QR код */}
        <div className="bg-white p-1 rounded shadow-sm">
          <div className="w-10 h-10 grid grid-cols-5 gap-[1px]">
            {Array.from({ length: 25 }).map((_, i) => (
              <div
                key={i}
                className={`${Math.random() > 0.5 ? 'bg-slate-800' : 'bg-white'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Блик */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-white/30 rounded-bl-full"></div>
    </div>
  );
}

// Timeline этапов
function TimelineStages({ currentStage, duration }: { currentStage: number; duration: string }) {
  const stages = [
    { name: 'Заявка', day: '1 день' },
    { name: 'Документы', day: '2-3 дня' },
    { name: 'Испытания', day: duration.includes('60') || duration.includes('90') ? '30-60 дн.' : '3-5 дней' },
    { name: 'Выдача', day: 'финал' },
  ];

  return (
    <div className="relative">
      {/* Линия */}
      <div className="absolute top-3 left-3 right-3 h-0.5 bg-slate-200 rounded"></div>
      <div
        className="absolute top-3 left-3 h-0.5 bg-blue-500 rounded transition-all duration-500"
        style={{ width: `${(currentStage / (stages.length - 1)) * 100}%`, maxWidth: 'calc(100% - 24px)' }}
      ></div>

      {/* Точки */}
      <div className="relative flex justify-between">
        {stages.map((stage, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              i <= currentStage
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                : 'bg-slate-200 text-slate-400'
            }`}>
              {i < currentStage ? (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            <div className="mt-1.5 text-center">
              <div className={`text-[10px] font-medium ${i <= currentStage ? 'text-slate-700' : 'text-slate-400'}`}>
                {stage.name}
              </div>
              <div className="text-[9px] text-slate-400">{stage.day}</div>
            </div>
          </div>
        ))}
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

  // Состояние конструктора
  const [calcProduct, setCalcProduct] = useState('');
  const [calcResult, setCalcResult] = useState<CertificationResult | null>(null);
  const [isForChildren, setIsForChildren] = useState(false);
  const [calcSuggestions, setCalcSuggestions] = useState<TNVEDCode[]>([]);
  const [showCalcSuggestions, setShowCalcSuggestions] = useState(false);
  const [selectedCalcItem, setSelectedCalcItem] = useState<TNVEDCode | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>(['consult']);
  const calcRef = useRef<HTMLDivElement>(null);
  const totalCodes = getTNVEDCount();

  // Поиск при вводе по полной базе 16376 кодов
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

  // Закрытие при клике вне (оба поиска)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (calcRef.current && !calcRef.current.contains(event.target as Node)) {
        setShowCalcSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Поиск в калькуляторе
  useEffect(() => {
    if (calcProduct.trim().length >= 2) {
      const results = searchTNVEDFull(calcProduct, 5);
      setCalcSuggestions(results);
      setShowCalcSuggestions(results.length > 0);
    } else {
      setCalcSuggestions([]);
      setShowCalcSuggestions(false);
    }
  }, [calcProduct]);

  // Расчёт документов при выборе товара
  const handleCalculate = () => {
    if (selectedCalcItem || calcProduct.trim()) {
      const code = selectedCalcItem?.code || '';
      let productName = calcProduct;
      if (isForChildren && !productName.toLowerCase().includes('детск')) {
        productName = 'детский ' + productName;
      }
      const result = determineCertification(code, productName);
      setCalcResult(result);
    }
  };

  const handleSelectCalcItem = (item: TNVEDCode) => {
    setSelectedCalcItem(item);
    setCalcProduct(item.name);
    setShowCalcSuggestions(false);
    // Автоматически рассчитать
    const productName = isForChildren ? 'детский ' + item.name : item.name;
    const result = determineCertification(item.code, productName);
    setCalcResult(result);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tn-ved?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // При выборе из левого поиска - сразу перекидываем в конструктор справа
  const handleSelectSuggestion = (item: TNVEDCode) => {
    setSearchQuery('');
    setShowSuggestions(false);
    // Перекидываем в конструктор
    setSelectedCalcItem(item);
    setCalcProduct(item.name);
    const productName = isForChildren ? 'детский ' + item.name : item.name;
    const result = determineCertification(item.code, productName);
    setCalcResult(result);
  };

  const handleQuickSearch = (term: string) => {
    router.push(`/tn-ved?q=${encodeURIComponent(term)}`);
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Расчёт итоговой стоимости
  const calculateTotal = () => {
    if (!calcResult || calcResult.documents.length === 0) return { min: 0, max: 0 };

    // Базовая цена из первого документа
    const basePrice = calcResult.documents[0].price;
    const priceMatch = basePrice.match(/(\d[\d\s]*)/);
    let baseMin = priceMatch ? parseInt(priceMatch[1].replace(/\s/g, '')) : 0;
    let baseMax = baseMin;

    // Если несколько документов, суммируем
    calcResult.documents.forEach((doc, i) => {
      if (i > 0) {
        const match = doc.price.match(/(\d[\d\s]*)/);
        if (match) {
          baseMin += parseInt(match[1].replace(/\s/g, ''));
          baseMax += parseInt(match[1].replace(/\s/g, ''));
        }
      }
    });

    // Добавляем услуги
    let additional = 0;
    selectedServices.forEach(serviceId => {
      const service = ADDITIONAL_SERVICES.find(s => s.id === serviceId);
      if (service && service.price) {
        additional += service.price;
      }
    });

    let total = baseMin + additional;

    // Множитель за срочность
    if (selectedServices.includes('urgent')) {
      total = Math.round(total * 1.5);
    }

    return { min: total, max: Math.round(total * 1.2) };
  };

  const totalPrice = calculateTotal();

  return (
    <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Левая часть - поиск */}
          <div className="lg:col-span-3">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
              Какие документы нужны<br />
              <span className="text-orange-400">на ваш товар?</span>
            </h1>
            <p className="text-blue-100 text-lg mb-6">
              Узнайте требования к сертификации за 30 секунд
            </p>

            {/* Поисковая строка с автоподсказками */}
            <form onSubmit={handleSearch} className="mb-4">
              <div ref={searchRef} className="relative">
                <div className="flex bg-white rounded-xl overflow-hidden shadow-xl">
                  <div className="flex-1 flex items-center px-4">
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
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 transition-colors"
                  >
                    Найти
                  </button>
                </div>

                {/* Выпадающий список подсказок */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 max-h-96 overflow-y-auto">
                    <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
                      <span className="text-xs text-slate-500">Найдено в базе {totalCodes.toLocaleString()} кодов ТН ВЭД</span>
                    </div>
                    {suggestions.map((item, index) => (
                      <button
                        key={item.code + index}
                        type="button"
                        onClick={() => handleSelectSuggestion(item)}
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-slate-100 last:border-0 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-slate-900 truncate">{item.name}</div>
                            <div className="text-sm text-slate-500">{item.code_formatted}</div>
                          </div>
                          <div className="flex-shrink-0 flex flex-col items-end gap-1">
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                              {item.code}
                            </span>
                            {item.requires_marking && (
                              <span className="inline-block px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded">
                                Маркировка
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </form>

            {/* Популярные запросы */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
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
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => router.push(`/tn-ved?category=${cat.slug}`)}
                  className="flex flex-col items-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all group"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-white/20 group-hover:bg-white/30 rounded-lg text-white transition-colors">
                    <CategoryIcon type={cat.icon} />
                  </div>
                  <span className="text-xs text-white/90 text-center leading-tight">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Правая часть - WOW конструктор */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Заголовок */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4">
                <h3 className="text-lg font-bold text-white">Конструктор документов</h3>
                <p className="text-blue-100 text-sm">Узнайте стоимость за 10 секунд</p>
              </div>

              <div className="p-5">
                {/* Если нет результата - показываем форму ввода */}
                {!calcResult ? (
                  <div className="space-y-4">
                    {/* Поле ввода продукции */}
                    <div ref={calcRef} className="relative">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Ваша продукция</label>
                      <input
                        type="text"
                        value={calcProduct}
                        onChange={(e) => { setCalcProduct(e.target.value); setSelectedCalcItem(null); setCalcResult(null); }}
                        onFocus={() => calcSuggestions.length > 0 && setShowCalcSuggestions(true)}
                        placeholder="Введите название или код ТН ВЭД"
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-700 placeholder-slate-400"
                      />

                      {/* Подсказки */}
                      {showCalcSuggestions && calcSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-50 max-h-48 overflow-y-auto">
                          {calcSuggestions.map((item, index) => (
                            <button
                              key={item.code + index}
                              type="button"
                              onClick={() => handleSelectCalcItem(item)}
                              className="w-full px-3 py-2 text-left hover:bg-blue-50 border-b border-slate-100 last:border-0"
                            >
                              <div className="text-sm font-medium text-slate-900 truncate">{item.name}</div>
                              <div className="text-xs text-slate-500">{item.code_formatted}</div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Чекбокс "Для детей" */}
                    <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={isForChildren}
                        onChange={(e) => setIsForChildren(e.target.checked)}
                        className="w-5 h-5 text-blue-600 rounded"
                      />
                      <div>
                        <span className="text-sm font-medium text-slate-700">Продукция для детей</span>
                        <p className="text-xs text-slate-500">Детские товары требуют сертификации</p>
                      </div>
                    </label>

                    {/* Кнопка расчёта */}
                    <button
                      onClick={handleCalculate}
                      disabled={!calcProduct.trim()}
                      className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-orange-500/30"
                    >
                      Рассчитать стоимость
                    </button>

                    {/* Подсказка */}
                    <p className="text-center text-xs text-slate-400">
                      Или выберите товар из поиска слева
                    </p>
                  </div>
                ) : (
                  /* Результат - интерактивный конструктор */
                  <div className="space-y-4">
                    {/* Выбранный товар */}
                    <div className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-700 truncate">{calcProduct}</div>
                        {selectedCalcItem && (
                          <div className="text-xs text-slate-500">Код: {selectedCalcItem.code_formatted}</div>
                        )}
                      </div>
                      <button
                        onClick={() => { setCalcResult(null); setCalcProduct(''); setSelectedCalcItem(null); setSelectedServices(['consult']); }}
                        className="ml-2 text-slate-400 hover:text-slate-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Визуализация документа */}
                    {calcResult.documents.length > 0 && (
                      <DocumentVisual
                        type={calcResult.documents[0].type}
                        name={calcResult.documents[0].name}
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
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-800 text-sm">{calcResult.documents[0]?.name}</div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-orange-600 font-bold text-sm">{calcResult.documents[0]?.price}</span>
                            <span className="text-slate-500 text-xs">{calcResult.documents[0]?.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Дополнительные услуги */}
                    <div>
                      <div className="text-sm font-medium text-slate-700 mb-2">Дополнительные услуги</div>
                      <div className="space-y-2">
                        {ADDITIONAL_SERVICES.map(service => (
                          <label
                            key={service.id}
                            className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all ${
                              selectedServices.includes(service.id)
                                ? 'bg-blue-50 border border-blue-200'
                                : 'bg-slate-50 border border-transparent hover:bg-slate-100'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedServices.includes(service.id)}
                              onChange={() => toggleService(service.id)}
                              className="w-4 h-4 text-blue-600 rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-slate-700">{service.name}</div>
                              <div className="text-xs text-slate-500">{service.description}</div>
                            </div>
                            <div className="text-sm font-semibold text-slate-600">
                              {service.price ? `+${service.price.toLocaleString()} ₽` : service.multiplier ? '+50%' : 'Бесплатно'}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="bg-slate-50 rounded-lg p-3">
                      <div className="text-sm font-medium text-slate-700 mb-3">Этапы оформления</div>
                      <TimelineStages
                        currentStage={0}
                        duration={calcResult.documents[0]?.duration || '7-14 дней'}
                      />
                    </div>

                    {/* Итого */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-4 text-white">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-100">Итого:</span>
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            от {totalPrice.min.toLocaleString()} ₽
                          </div>
                          <div className="text-xs text-blue-200">
                            срок: {calcResult.documents[0]?.duration}
                          </div>
                        </div>
                      </div>

                      {/* Примечания */}
                      {calcResult.notes.length > 0 && (
                        <div className="text-xs text-blue-200 mb-3 bg-white/10 rounded p-2">
                          {calcResult.notes[0]}
                        </div>
                      )}

                      <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                        <span>Оформить заявку</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </button>
                    </div>

                    {/* Телефон */}
                    <div className="text-center">
                      <div className="text-xs text-slate-500 mb-1">Или позвоните нам</div>
                      <a href="tel:88005505288" className="text-lg font-bold text-blue-600 hover:text-blue-700">
                        8 800 550-52-88
                      </a>
                      <div className="text-xs text-slate-400">Бесплатно по России</div>
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
              <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-blue-200 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
