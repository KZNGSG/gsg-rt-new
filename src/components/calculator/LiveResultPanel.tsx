'use client';

import React from 'react';
import { CertificationResult } from '@/lib/certification-rules';

interface LiveResultPanelProps {
  result: CertificationResult | null;
  productName: string;
  productCode?: string;
  isLoading?: boolean;
}

export function LiveResultPanel({ result, productName, productCode, isLoading }: LiveResultPanelProps) {
  // Состояние по умолчанию — приглашение к поиску
  if (!result && !isLoading) {
    return (
      <div className="glass-white rounded-3xl shadow-premium-lg overflow-hidden border border-white/50 h-full">
        {/* Заголовок */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 px-5 py-4 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-10"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Результат подбора</h3>
              <p className="text-blue-200 text-xs">Документы для вашего товара</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 flex flex-col items-center justify-center min-h-[320px] text-center">
          <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h4 className="text-lg font-bold text-slate-800 mb-2">Начните поиск</h4>
          <p className="text-slate-500 text-sm max-w-[240px]">
            Введите название товара или код ТН ВЭД слева, и мы покажем какие документы нужны
          </p>
          
          {/* Примеры */}
          <div className="mt-6 w-full">
            <p className="text-xs text-slate-400 mb-3">Например:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['игрушки', 'косметика', '9503', 'одежда'].map(term => (
                <span key={term} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs">
                  {term}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Загрузка
  if (isLoading) {
    return (
      <div className="glass-white rounded-3xl shadow-premium-lg overflow-hidden border border-white/50 h-full">
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 px-5 py-4">
          <div className="relative flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center animate-pulse">
              <svg className="w-5 h-5 text-white animate-spin" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Анализируем...</h3>
              <p className="text-blue-200 text-xs">Подбираем документы</p>
            </div>
          </div>
        </div>
        <div className="p-6 flex items-center justify-center min-h-[320px]">
          <div className="animate-pulse space-y-4 w-full">
            <div className="h-16 bg-slate-100 rounded-xl"></div>
            <div className="h-24 bg-slate-100 rounded-xl"></div>
            <div className="h-12 bg-slate-100 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Результат найден
  const doc = result?.documents[0];
  const docTypeConfig: Record<string, { color: string; bgColor: string; label: string }> = {
    certificate: { color: 'text-emerald-600', bgColor: 'from-emerald-500 to-green-600', label: 'Сертификат' },
    declaration: { color: 'text-blue-600', bgColor: 'from-blue-500 to-indigo-600', label: 'Декларация' },
    sgr: { color: 'text-purple-600', bgColor: 'from-purple-500 to-violet-600', label: 'СГР' },
    registration: { color: 'text-orange-600', bgColor: 'from-orange-500 to-amber-600', label: 'Регистрация' },
    rejection: { color: 'text-slate-600', bgColor: 'from-slate-500 to-slate-600', label: 'Отказное письмо' },
  };
  const config = docTypeConfig[doc?.type || 'certificate'];
  
  return (
    <div className="glass-white rounded-3xl shadow-premium-lg overflow-hidden border border-white/50">
      {/* Заголовок с результатом */}
      <div className={`relative bg-gradient-to-r ${config.bgColor} px-5 py-4 overflow-hidden`}>
        <div className="absolute inset-0 bg-grid opacity-10"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-white/90 text-sm font-medium">Найдено</span>
          </div>
          <h3 className="text-lg font-bold text-white truncate">{productName}</h3>
          {productCode && <p className="text-white/70 text-xs">Код ТН ВЭД: {productCode}</p>}
        </div>
      </div>
      
      <div className="p-5 space-y-4">
        {/* Требуемый документ */}
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Требуется оформить</div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="font-bold text-slate-900 text-sm">{doc?.name || config.label}</div>
              {doc?.regulation && <div className={`text-xs ${config.color}`}>{doc.regulation}</div>}
            </div>
          </div>
        </div>
        
        {/* Стоимость и сроки */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-50 rounded-xl text-center">
            <div className="text-xs text-slate-500 mb-0.5">Стоимость</div>
            <div className="text-base font-bold text-slate-900">{doc?.price || 'от 15 000 ₽'}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl text-center">
            <div className="text-xs text-slate-500 mb-0.5">Сроки</div>
            <div className="text-base font-bold text-slate-900">{doc?.duration || '7-14 дней'}</div>
          </div>
        </div>
        
        {/* Особенности */}
        {result?.notes && result.notes.length > 0 && (
          <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <div>
                <div className="text-xs font-semibold text-amber-800 mb-0.5">Особенности</div>
                <p className="text-xs text-amber-700">{result.notes[0]}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Действия */}
        <div className="space-y-2 pt-2">
          <a
            href={`/kontakty?product=${encodeURIComponent(productName)}`}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-lg shadow-orange-500/25"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6z" />
            </svg>
            Заказать расчёт
          </a>
          
          <div className="grid grid-cols-2 gap-2">
            <a
              href="tel:+78005505288"
              className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              Позвонить
            </a>
            <button
              className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
              Вопрос
            </button>
          </div>
        </div>
        
        {/* Подсказка */}
        <p className="text-center text-xs text-slate-400 pt-1">
          Точную стоимость рассчитаем после анализа документов
        </p>
      </div>
    </div>
  );
}
