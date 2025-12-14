'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { searchTNVED, getMarkingInfo, type TNVEDCode } from '@/data/tn-ved-full';

type Step = 'search' | 'select' | 'questions' | 'result';

interface QualificationData {
  tnvedCode: TNVEDCode | null;
  purpose: 'home' | 'business' | 'kids' | 'medical' | null;
  isElectric: boolean | null;
  hasContact: boolean | null; // контактирует с пищей/кожей
}

const PURPOSE_OPTIONS = [
  { id: 'home', icon: '🏠', label: 'Для дома', desc: 'Бытовое использование' },
  { id: 'business', icon: '🏭', label: 'Для бизнеса', desc: 'Промышленное, коммерческое' },
  { id: 'kids', icon: '👶', label: 'Для детей', desc: 'Детские товары до 14 лет' },
  { id: 'medical', icon: '🏥', label: 'Медицинское', desc: 'Для лечения, диагностики' },
];

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

  // Поиск с debounce эффектом
  const searchResults = useMemo(() => {
    if (query.length >= 2) {
      return searchTNVED(query);
    }
    return [];
  }, [query]);

  const markingInfo = useMemo(() => {
    if (data.tnvedCode) {
      return getMarkingInfo(data.tnvedCode.code);
    }
    return null;
  }, [data.tnvedCode]);

  const handleSelectCode = useCallback((code: TNVEDCode) => {
    setData(prev => ({ ...prev, tnvedCode: code }));
    setStep('questions');
  }, []);

  const handlePurposeSelect = useCallback((purpose: typeof data.purpose) => {
    setData(prev => ({ ...prev, purpose }));

    // Если медицинское — сразу к результату
    if (purpose === 'medical') {
      setStep('result');
      return;
    }

    // Для детских — тоже к результату (точно сертификат)
    if (purpose === 'kids') {
      setStep('result');
      return;
    }

    // Иначе спрашиваем про электричество
    setStep('result'); // Пока упрощаем — сразу к результату
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

    // Имитация отправки
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Submitting:', {
      ...formData,
      tnved: data.tnvedCode?.code,
      tnvedName: data.tnvedCode?.name,
      purpose: data.purpose,
      requiresMarking: data.tnvedCode?.requires_marking,
    });

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

  // Progress indicator
  const progress = step === 'search' ? 25 : step === 'select' ? 50 : step === 'questions' ? 75 : 100;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="container mx-auto px-4 py-12 md:py-16">
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
                <span>Поиск</span>
                <span>Выбор</span>
                <span>Уточнение</span>
                <span>Результат</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">

            {/* Step: Search */}
            {step === 'search' && (
              <div className="p-6 md:p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
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
                    className="w-full px-5 py-4 text-lg border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                    autoFocus
                  />
                </div>

                {/* Quick examples */}
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="text-sm text-slate-400">Попробуйте:</span>
                  {['одежда', 'косметика', 'игрушки', 'техника'].map((ex) => (
                    <button
                      key={ex}
                      onClick={() => { setQuery(ex); setStep('select'); }}
                      className="px-3 py-1 bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-600 rounded-full text-sm transition-colors"
                    >
                      {ex}
                    </button>
                  ))}
                </div>

                {/* Stats */}
                <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">16 376</div>
                    <div className="text-xs text-slate-500">кодов ТН ВЭД</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">20+</div>
                    <div className="text-xs text-slate-500">регламентов</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">2 мин</div>
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
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    <p className="text-sm text-slate-500 mb-3">
                      Выберите подходящий товар ({searchResults.length}{searchResults.length >= 50 ? '+' : ''})
                    </p>
                    {searchResults.map((item, idx) => (
                      <button
                        key={`${item.code}-${idx}`}
                        onClick={() => handleSelectCode(item)}
                        className="w-full text-left p-4 rounded-xl border-2 border-slate-100 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-slate-100 group-hover:bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                            <span className="text-lg">📦</span>
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
                    <div className="text-4xl mb-3">🤔</div>
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
                <div className="p-4 bg-blue-50 rounded-xl mb-6">
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
                      className="p-4 rounded-xl border-2 border-slate-100 hover:border-blue-300 hover:bg-blue-50 transition-all text-center group"
                    >
                      <div className="text-3xl mb-2">{option.icon}</div>
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
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-4">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">⚠️</span>
                          <div>
                            <div className="font-semibold text-amber-900">Требуется маркировка</div>
                            <div className="text-sm text-amber-700">
                              Товар подлежит обязательной маркировке в системе «Честный ЗНАК»
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Purpose-based hints */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl mb-4">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">
                          {data.purpose === 'medical' ? '🏥' :
                           data.purpose === 'kids' ? '👶' :
                           data.purpose === 'business' ? '🏭' : '📋'}
                        </span>
                        <div>
                          <div className="font-semibold text-blue-900">
                            {data.purpose === 'medical' && 'Медицинское изделие'}
                            {data.purpose === 'kids' && 'Детские товары'}
                            {data.purpose === 'business' && 'Промышленное оборудование'}
                            {data.purpose === 'home' && 'Бытовой товар'}
                          </div>
                          <div className="text-sm text-blue-700">
                            {data.purpose === 'medical' && 'Требуется регистрационное удостоверение Росздравнадзора. Это сложная процедура — наши эксперты помогут пройти её правильно.'}
                            {data.purpose === 'kids' && 'Детские товары подлежат обязательной сертификации по ТР ТС 007/2011 или ТР ТС 008/2011 (игрушки).'}
                            {data.purpose === 'business' && 'Промышленное оборудование часто требует сертификации по ТР ТС 010/2011 и испытаний в аккредитованной лаборатории.'}
                            {data.purpose === 'home' && 'Для бытовых товаров обычно оформляется декларация соответствия ТР ТС.'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="p-4 bg-slate-900 rounded-xl text-white mb-4">
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
                          className="w-full py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold transition-colors"
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
                          <textarea
                            value={formData.comment}
                            onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                            placeholder="Комментарий (необязательно)"
                            rows={2}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 outline-none resize-none"
                          />
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
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
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                      <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                      Заявка отправлена!
                    </h2>
                    <p className="text-slate-600 mb-6">
                      Наш эксперт {formData.name ? `свяжется с вами, ${formData.name.split(' ')[0]},` : 'свяжется с вами'} в течение 15 минут
                    </p>

                    <div className="p-4 bg-blue-50 rounded-xl mb-6 text-left">
                      <div className="text-sm text-blue-600 font-medium mb-2">Что будет дальше:</div>
                      <ul className="text-sm text-blue-800 space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500">1.</span>
                          Эксперт позвонит и уточнит детали о товаре
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500">2.</span>
                          Вы получите точный расчёт стоимости и сроков
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500">3.</span>
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
          <div className="mt-8 text-center text-sm text-slate-500 pb-12">
            <p>
              Данные носят информационный характер.<br />
              Точные требования определяет эксперт на основе характеристик товара.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
