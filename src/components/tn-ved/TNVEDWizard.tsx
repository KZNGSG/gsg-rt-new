'use client';

import { useState, useMemo, useCallback } from 'react';
import { searchTNVED, getMarkingInfo, type TNVEDCode } from '@/data/tn-ved-full';
import { BackgroundPattern, FloatingElements } from '@/components/ui/BackgroundPattern';

type Step = 'search' | 'select' | 'questions' | 'result';

interface QualificationData {
  tnvedCode: TNVEDCode | null;
  purpose: 'home' | 'business' | 'kids' | 'medical' | null;
  isElectric: boolean | null;
  hasContact: boolean | null;
}

// SVG иконки в стиле топовых SaaS
const Icons = {
  trophy: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
    </svg>
  ),
  globe: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  ),
  document: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  home: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  ),
  building: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  ),
  child: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
    </svg>
  ),
  medical: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  box: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  ),
  warning: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  clipboard: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  ),
  questionMark: (
    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
  ),
};

const PURPOSE_OPTIONS = [
  { id: 'home', icon: 'home', label: 'Для дома', desc: 'Бытовое использование' },
  { id: 'business', icon: 'building', label: 'Для бизнеса', desc: 'Промышленное, коммерческое' },
  { id: 'kids', icon: 'child', label: 'Для детей', desc: 'Детские товары до 14 лет' },
  { id: 'medical', icon: 'medical', label: 'Медицинское', desc: 'Для лечения, диагностики' },
];

// Боковая панель с преимуществами
function SidebarLeft() {
  return (
    <div className="hidden xl:flex flex-col gap-6 w-64 pt-32">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-slate-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center text-blue-600">
            {Icons.trophy}
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">12+</div>
            <div className="text-sm text-slate-500">лет опыта</div>
          </div>
        </div>
        <p className="text-xs text-slate-400">Работаем с 2012 года</p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-slate-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center text-blue-600">
            {Icons.globe}
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">60+</div>
            <div className="text-sm text-slate-500">филиалов</div>
          </div>
        </div>
        <p className="text-xs text-slate-400">По всей России</p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-slate-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-blue-100 rounded-xl flex items-center justify-center text-blue-600">
            {Icons.document}
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">50K+</div>
            <div className="text-sm text-slate-500">документов</div>
          </div>
        </div>
        <p className="text-xs text-slate-400">Успешно оформлено</p>
      </div>
    </div>
  );
}

// Боковая панель с отзывом и экспертом
function SidebarRight() {
  return (
    <div className="hidden xl:flex flex-col gap-6 w-64 pt-32">
      {/* Эксперт онлайн */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-slate-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              АК
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <div className="font-semibold text-slate-900">Эксперт онлайн</div>
            <div className="text-xs text-green-600">Готов помочь</div>
          </div>
        </div>
        <p className="text-sm text-slate-600">Ответим на вопросы по сертификации за 15 минут</p>
      </div>

      {/* Отзыв */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 shadow-lg border border-blue-100">
        <div className="flex gap-1 mb-3">
          {[1,2,3,4,5].map(i => (
            <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <p className="text-sm text-slate-700 italic mb-3">
          «Очень удобный сервис! Сразу понял какие документы нужны. Эксперт перезвонил через 10 минут.»
        </p>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center text-xs font-medium text-slate-600">
            ИП
          </div>
          <div>
            <div className="text-xs font-medium text-slate-900">Игорь П.</div>
            <div className="text-xs text-slate-500">Москва</div>
          </div>
        </div>
      </div>

      {/* Гарантия */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <div>
            <div className="font-semibold text-slate-900">100% гарантия</div>
            <div className="text-xs text-slate-500">Проверка в реестрах</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TNVEDWizard() {
  const [step, setStep] = useState<Step>('search');
  const [query, setQuery] = useState('');
  const [data, setData] = useState<QualificationData>({
    tnvedCode: null,
    purpose: null,
    isElectric: null,
    hasContact: null,
  });
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', comment: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchResults = useMemo(() => {
    if (query.length >= 2) {
      return searchTNVED(query);
    }
    return [];
  }, [query]);

  const handleSelectCode = useCallback((code: TNVEDCode) => {
    setData(prev => ({ ...prev, tnvedCode: code }));
    setStep('questions');
  }, []);

  const handlePurposeSelect = useCallback((purpose: typeof data.purpose) => {
    setData(prev => ({ ...prev, purpose }));
    setStep('result');
  }, []);

  const handleBack = useCallback(() => {
    if (step === 'questions') {
      setStep('select');
      setData(prev => ({ ...prev, purpose: null, isElectric: null }));
    } else if (step === 'result') {
      setStep('questions');
      setData(prev => ({ ...prev, purpose: null }));
    } else if (step === 'select') {
      setStep('search');
      setData(prev => ({ ...prev, tnvedCode: null }));
    }
  }, [step]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleReset = useCallback(() => {
    setStep('search');
    setQuery('');
    setData({ tnvedCode: null, purpose: null, isElectric: null, hasContact: null });
    setShowForm(false);
    setIsSubmitted(false);
    setFormData({ name: '', phone: '', comment: '' });
  }, []);

  const progress = step === 'search' ? 25 : step === 'select' ? 50 : step === 'questions' ? 75 : 100;

  return (
    <div className="min-h-screen relative">
      {/* Фоновые элементы */}
      <BackgroundPattern />
      <FloatingElements />

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white relative overflow-hidden">
        {/* Декоративные круги в header */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-4 py-12 md:py-16 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Бесплатный онлайн-помощник
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Какие документы нужны<br />на ваш товар?
            </h1>

            <p className="text-lg text-blue-100 mb-8">
              Узнайте за 2 минуты — без регистрации и ожидания
            </p>

            {/* Progress bar */}
            <div className="max-w-md mx-auto">
              <div className="flex justify-between text-xs text-blue-200 mb-2">
                <span className={step === 'search' ? 'text-white font-medium' : ''}>Поиск</span>
                <span className={step === 'select' ? 'text-white font-medium' : ''}>Выбор</span>
                <span className={step === 'questions' ? 'text-white font-medium' : ''}>Уточнение</span>
                <span className={step === 'result' ? 'text-white font-medium' : ''}>Результат</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-white to-blue-200 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content with sidebars */}
      <div className="container mx-auto px-4 -mt-8 relative">
        <div className="flex justify-center gap-8">
          {/* Left sidebar */}
          <SidebarLeft />

          {/* Main card */}
          <div className="w-full max-w-2xl">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">

              {/* Step: Search */}
              {step === 'search' && (
                <div className="p-6 md:p-8">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Найдите ваш товар</h2>
                    <p className="text-slate-500">Введите код ТН ВЭД или название</p>
                  </div>

                  <div className="relative mb-4">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        if (e.target.value.length >= 2) setStep('select');
                      }}
                      placeholder="Например: 8418 или холодильник"
                      className="w-full px-5 py-4 text-lg border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm"
                      autoFocus
                    />
                  </div>

                  {/* Quick examples */}
                  <div className="flex flex-wrap gap-2 justify-center mb-8">
                    <span className="text-sm text-slate-400">Попробуйте:</span>
                    {['одежда', 'косметика', 'игрушки', 'техника', 'мебель'].map((ex) => (
                      <button
                        key={ex}
                        onClick={() => { setQuery(ex); setStep('select'); }}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-600 rounded-full text-sm transition-all hover:scale-105"
                      >
                        {ex}
                      </button>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl">
                    <div className="text-center">
                      <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">16 376</div>
                      <div className="text-xs text-slate-500">кодов ТН ВЭД</div>
                    </div>
                    <div className="text-center border-x border-slate-200">
                      <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">20+</div>
                      <div className="text-xs text-slate-500">регламентов</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">2 мин</div>
                      <div className="text-xs text-slate-500">на проверку</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step: Select from results */}
              {step === 'select' && (
                <div className="p-6 md:p-8">
                  <button
                    onClick={() => { setStep('search'); setQuery(''); }}
                    className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-4 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Назад
                  </button>

                  {/* Search input */}
                  <div className="relative mb-6">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Поиск..."
                      className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 outline-none transition-all"
                      autoFocus
                    />
                    {query && (
                      <button
                        onClick={() => setQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Results */}
                  {searchResults.length > 0 ? (
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                      <p className="text-sm text-slate-500 mb-3">
                        Выберите подходящий товар ({searchResults.length}{searchResults.length >= 50 ? '+' : ''})
                      </p>
                      {searchResults.map((item, idx) => (
                        <button
                          key={`${item.code}-${idx}`}
                          onClick={() => handleSelectCode(item)}
                          className="w-full text-left p-4 rounded-xl border-2 border-slate-100 hover:border-blue-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-slate-100 group-hover:bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors text-slate-400 group-hover:text-blue-600">
                              {Icons.box}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-blue-600 font-semibold text-sm">
                                  {item.code_formatted}
                                </span>
                                {item.requires_marking && (
                                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                                    Маркировка
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-700 text-sm line-clamp-2 mt-1">
                                {item.name}
                              </p>
                            </div>
                            <svg className="w-5 h-5 text-slate-300 group-hover:text-blue-500 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : query.length >= 2 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        {Icons.questionMark}
                      </div>
                      <p className="text-slate-500">Ничего не найдено</p>
                      <p className="text-sm text-slate-400 mt-1">Попробуйте другой запрос</p>
                    </div>
                  ) : null}
                </div>
              )}

              {/* Step: Questions */}
              {step === 'questions' && data.tnvedCode && (
                <div className="p-6 md:p-8">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-4 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Назад
                  </button>

                  {/* Selected product */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl mb-6 border border-blue-100">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-blue-600 font-semibold text-sm">
                        {data.tnvedCode.code_formatted}
                      </span>
                      {data.tnvedCode.requires_marking && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                          Маркировка
                        </span>
                      )}
                    </div>
                    <p className="text-slate-700 text-sm">{data.tnvedCode.name}</p>
                  </div>

                  {/* Question */}
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-2">
                      Для чего предназначен товар?
                    </h2>
                    <p className="text-slate-500 text-sm">
                      Это поможет точнее определить требования
                    </p>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-2 gap-3">
                    {PURPOSE_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handlePurposeSelect(option.id as typeof data.purpose)}
                        className="p-4 rounded-xl border-2 border-slate-100 hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all text-center group hover:scale-[1.02] hover:shadow-lg"
                      >
                        <div className="w-12 h-12 mx-auto mb-2 bg-slate-100 group-hover:bg-blue-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-all group-hover:scale-110">
                          {Icons[option.icon as keyof typeof Icons]}
                        </div>
                        <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {option.label}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">{option.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step: Result */}
              {step === 'result' && data.tnvedCode && (
                <div className="p-6 md:p-8">
                  {!isSubmitted ? (
                    <>
                      <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-4 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Назад
                      </button>

                      {/* Success animation */}
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">
                          Предварительный анализ готов!
                        </h2>
                      </div>

                      {/* Product info */}
                      <div className="p-4 bg-slate-50 rounded-xl mb-4">
                        <div className="text-sm text-slate-500 mb-1">Ваш товар</div>
                        <div className="font-mono text-blue-600 font-semibold">
                          {data.tnvedCode.code_formatted}
                        </div>
                        <div className="text-slate-900">{data.tnvedCode.name}</div>
                      </div>

                      {/* Marking status */}
                      {data.tnvedCode.requires_marking && (
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl mb-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                              {Icons.warning}
                            </div>
                            <div>
                              <div className="font-semibold text-blue-900">Требуется маркировка</div>
                              <div className="text-sm text-blue-700">
                                Товар подлежит обязательной маркировке в системе «Честный ЗНАК»
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Purpose-based hints */}
                      <div className="p-4 bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 rounded-xl mb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                            {data.purpose === 'medical' ? Icons.medical :
                             data.purpose === 'kids' ? Icons.child :
                             data.purpose === 'business' ? Icons.building : Icons.clipboard}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">
                              {data.purpose === 'medical' && 'Медицинское изделие'}
                              {data.purpose === 'kids' && 'Детские товары'}
                              {data.purpose === 'business' && 'Промышленное оборудование'}
                              {data.purpose === 'home' && 'Бытовой товар'}
                            </div>
                            <div className="text-sm text-slate-600">
                              {data.purpose === 'medical' && 'Требуется регистрационное удостоверение Росздравнадзора. Это сложная процедура — наши эксперты помогут пройти её правильно.'}
                              {data.purpose === 'kids' && 'Детские товары подлежат обязательной сертификации по ТР ТС 007/2011 или ТР ТС 008/2011 (игрушки).'}
                              {data.purpose === 'business' && 'Промышленное оборудование часто требует сертификации по ТР ТС 010/2011 и испытаний в аккредитованной лаборатории.'}
                              {data.purpose === 'home' && 'Для бытовых товаров обычно оформляется декларация соответствия ТР ТС.'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="p-5 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl text-white mb-4">
                        <div className="text-center mb-4">
                          <div className="font-semibold text-lg mb-1">
                            Получите точный расчёт
                          </div>
                          <div className="text-slate-400 text-sm">
                            Эксперт перезвонит за 15 минут и бесплатно проконсультирует
                          </div>
                        </div>

                        {!showForm ? (
                          <button
                            onClick={() => setShowForm(true)}
                            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl font-semibold transition-all hover:scale-[1.02] shadow-lg"
                          >
                            Узнать стоимость
                          </button>
                        ) : (
                          <form onSubmit={handleSubmit} className="space-y-3">
                            <input
                              type="text"
                              required
                              value={formData.name}
                              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                              placeholder="Ваше имя"
                              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 outline-none"
                            />
                            <input
                              type="tel"
                              required
                              value={formData.phone}
                              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                              placeholder="Телефон"
                              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 outline-none"
                            />
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-400 disabled:to-blue-500 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                            >
                              {isSubmitting ? (
                                <>
                                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                  </svg>
                                  Отправка...
                                </>
                              ) : (
                                'Отправить заявку'
                              )}
                            </button>
                          </form>
                        )}
                      </div>

                      {/* Trust elements */}
                      <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Бесплатно
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Без спама
                        </div>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          15 минут
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Success state */
                    <div className="text-center py-8">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        Заявка отправлена!
                      </h2>
                      <p className="text-slate-600 mb-6">
                        Эксперт свяжется с вами в течение 15 минут
                      </p>

                      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl mb-6 text-left">
                        <div className="text-sm text-blue-600 font-medium mb-2">Что будет дальше:</div>
                        <ul className="text-sm text-blue-800 space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-xs text-blue-600 flex-shrink-0">1</span>
                            Эксперт позвонит и уточнит детали о товаре
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-xs text-blue-600 flex-shrink-0">2</span>
                            Вы получите точный расчёт стоимости и сроков
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-xs text-blue-600 flex-shrink-0">3</span>
                            Решите, работать с нами или нет — без давления
                          </li>
                        </ul>
                      </div>

                      <button
                        onClick={handleReset}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Проверить другой товар
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom info */}
            <div className="mt-6 text-center text-sm text-slate-400 pb-12">
              <p>
                Данные носят информационный характер.<br />
                Точные требования определяет эксперт на основе характеристик товара.
              </p>
            </div>
          </div>

          {/* Right sidebar */}
          <SidebarRight />
        </div>
      </div>
    </div>
  );
}
