'use client';

import React, { useState } from 'react';
import { CertificationResult } from '@/lib/certification-rules';

interface LiveResultPanelProps {
  result: CertificationResult | null;
  productName: string;
  productCode?: string;
  isLoading?: boolean;
}

// Мок данных для схем (потом натянем реальные)
const MOCK_SCHEMES = {
  certificate: [
    { id: '1с', name: 'Серийное', validity: '5 лет', price: '~35 000 ₽', inspection: true },
    { id: '3с', name: 'Партия', validity: 'На партию', price: '~25 000 ₽', inspection: false },
  ],
  declaration: [
    { id: '1д', name: 'Серийное', validity: '3 года', price: '~15 000 ₽', inspection: false },
    { id: '2д', name: 'Партия', validity: 'На партию', price: '~12 000 ₽', inspection: false },
  ],
  sgr: [
    { id: 'СГР', name: 'Бессрочно', validity: 'Бессрочно', price: '~45 000 ₽', inspection: false },
  ],
  registration: [
    { id: 'РУ', name: 'Регистрация', validity: 'Бессрочно', price: '~150 000 ₽', inspection: true },
  ],
  rejection: [
    { id: 'ОП', name: 'Отказное', validity: '1 год', price: '~5 000 ₽', inspection: false },
  ],
};

// Мок связанных регламентов
const MOCK_RELATED = [
  { code: 'ТР ТС 017/2011', name: 'Безопасность продукции лёгкой промышленности' },
  { code: 'ТР ЕАЭС 037/2016', name: 'Ограничение опасных веществ в изделиях' },
];

// Мок требований
const MOCK_REQUIREMENTS = [
  'Наличие маркировки на русском языке',
  'Техническая документация от производителя',
  'Образцы продукции для испытаний',
  'Договор с аккредитованной лабораторией',
];

export function LiveResultPanelExtended({ result, productName, productCode, isLoading }: LiveResultPanelProps) {
  const [selectedScheme, setSelectedScheme] = useState(0);
  const [modifiers, setModifiers] = useState({
    urgent: false,
    hasProtocols: false,
    isImport: false,
  });

  // Состояние по умолчанию
  if (!result && !isLoading) {
    return (
      <div className="glass-white rounded-3xl shadow-premium-lg overflow-hidden border border-white/50 h-full">
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
        
        <div className="p-6 flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h4 className="text-lg font-bold text-slate-800 mb-2">Начните поиск</h4>
          <p className="text-slate-500 text-sm max-w-[240px] mb-6">
            Введите название товара или код ТН ВЭД слева, и мы покажем какие документы нужны
          </p>
          
          <div className="w-full space-y-3">
            <p className="text-xs text-slate-400">Например:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['детские игрушки', 'косметика', '9503', 'одежда'].map(term => (
                <span key={term} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs hover:bg-slate-200 cursor-pointer transition-colors">
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
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
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
        <div className="p-5">
          <div className="animate-pulse space-y-3">
            <div className="h-14 bg-slate-100 rounded-xl"></div>
            <div className="h-20 bg-slate-100 rounded-xl"></div>
            <div className="h-24 bg-slate-100 rounded-xl"></div>
            <div className="h-16 bg-slate-100 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  // Результат
  const doc = result?.documents[0];
  const docType = doc?.type || 'certificate';
  
  const docTypeConfig: Record<string, { color: string; bgColor: string; textColor: string; label: string; fullLabel: string }> = {
    certificate: { color: 'text-emerald-600', bgColor: 'from-emerald-500 to-green-600', textColor: 'text-emerald-700', label: 'Сертификат', fullLabel: 'СЕРТИФИКАТ СООТВЕТСТВИЯ' },
    declaration: { color: 'text-blue-600', bgColor: 'from-blue-500 to-indigo-600', textColor: 'text-blue-700', label: 'Декларация', fullLabel: 'ДЕКЛАРАЦИЯ О СООТВЕТСТВИИ' },
    sgr: { color: 'text-purple-600', bgColor: 'from-purple-500 to-violet-600', textColor: 'text-purple-700', label: 'СГР', fullLabel: 'СВИДЕТЕЛЬСТВО ГОС. РЕГИСТРАЦИИ' },
    registration: { color: 'text-orange-600', bgColor: 'from-orange-500 to-amber-600', textColor: 'text-orange-700', label: 'РУ', fullLabel: 'РЕГИСТРАЦИОННОЕ УДОСТОВЕРЕНИЕ' },
    rejection: { color: 'text-slate-600', bgColor: 'from-slate-500 to-slate-600', textColor: 'text-slate-700', label: 'Отказное', fullLabel: 'ОТКАЗНОЕ ПИСЬМО' },
  };
  
  const config = docTypeConfig[docType];
  const schemes = MOCK_SCHEMES[docType as keyof typeof MOCK_SCHEMES] || MOCK_SCHEMES.certificate;

  // Расчёт цены с модификаторами
  const basePrice = parseInt(doc?.price?.replace(/\D/g, '') || '20000');
  let finalPrice = basePrice;
  if (modifiers.urgent) finalPrice *= 1.5;
  if (modifiers.hasProtocols) finalPrice *= 0.8;
  if (modifiers.isImport) finalPrice *= 1.15;

  return (
    <div className="glass-white rounded-3xl shadow-premium-lg overflow-hidden border border-white/50">
      {/* Заголовок */}
      <div className={`relative bg-gradient-to-r ${config.bgColor} px-5 py-4 overflow-hidden`}>
        <div className="absolute inset-0 bg-grid opacity-10"></div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-white/90 text-xs font-medium uppercase tracking-wide">Найдено</span>
          </div>
          <h3 className="text-base font-bold text-white truncate">{productName}</h3>
          {productCode && <p className="text-white/70 text-xs">Код ТН ВЭД: {productCode}</p>}
        </div>
      </div>

      {/* Скроллируемый контент */}
      <div className="p-4 space-y-4 max-h-[520px] overflow-y-auto scrollbar-thin">
        
        {/* Тип документа */}
        <div className="p-3 bg-slate-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.bgColor} flex items-center justify-center flex-shrink-0`}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <div className={`font-bold text-sm ${config.textColor}`}>{config.fullLabel}</div>
              <div className="text-slate-600 text-xs">{doc?.regulation || 'ТР ТС'}</div>
            </div>
          </div>
          
          {/* Ссылка на Гарант */}
          <a 
            href={`https://base.garant.ru/search/?q=${encodeURIComponent(doc?.regulation || 'ТР ТС')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            Текст регламента на Гарант.ру →
          </a>
        </div>

        {/* Цена и сроки */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33" />
              </svg>
              <span className="text-xs font-medium">Стоимость</span>
            </div>
            <div className="text-lg font-bold text-slate-900">от {Math.round(finalPrice).toLocaleString()} ₽</div>
            <div className="text-xs text-slate-400">обычно ~{Math.round(finalPrice * 1.3).toLocaleString()} ₽</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-medium">Сроки</span>
            </div>
            <div className="text-lg font-bold text-slate-900">{modifiers.urgent ? 'от 3' : 'от 7'} дней</div>
            <div className="text-xs text-slate-400">обычно ~{modifiers.urgent ? '5' : '10'} дней</div>
          </div>
        </div>

        {/* Схемы оформления */}
        <div>
          <div className="flex items-center gap-1.5 text-slate-600 mb-2">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25z" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wide">Схемы оформления</span>
          </div>
          
          {/* Табы схем */}
          <div className="flex gap-1 mb-2">
            {schemes.map((scheme, idx) => (
              <button
                key={scheme.id}
                onClick={() => setSelectedScheme(idx)}
                className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedScheme === idx
                    ? `bg-gradient-to-r ${config.bgColor} text-white shadow-sm`
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {scheme.id}
              </button>
            ))}
          </div>
          
          {/* Детали схемы */}
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-xs text-slate-400 mb-0.5">Для кого</div>
                <div className="text-xs font-semibold text-slate-800">{schemes[selectedScheme].name}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-0.5">Срок действия</div>
                <div className="text-xs font-semibold text-slate-800">{schemes[selectedScheme].validity}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-0.5">Цена</div>
                <div className={`text-xs font-semibold ${config.textColor}`}>{schemes[selectedScheme].price}</div>
              </div>
            </div>
            {schemes[selectedScheme].inspection && (
              <div className="mt-2 pt-2 border-t border-slate-200 text-center">
                <span className="text-xs text-amber-600 font-medium">⚡ Требуется инспекционный контроль</span>
              </div>
            )}
          </div>
        </div>

        {/* Важно знать */}
        <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
          <div className="flex items-center gap-1.5 text-amber-700 mb-2">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wide">Важно знать</span>
          </div>
          <ul className="space-y-1">
            {(result?.notes?.length ? result.notes : MOCK_REQUIREMENTS).slice(0, 4).map((req, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-amber-800">
                <span className="text-amber-500 mt-0.5">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Связанные регламенты */}
        <div>
          <div className="flex items-center gap-1.5 text-slate-600 mb-2">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wide">Также может потребоваться</span>
          </div>
          <div className="space-y-1.5">
            {MOCK_RELATED.map((reg, i) => (
              <a
                key={i}
                href={`/vidy-sertifikacii?reg=${encodeURIComponent(reg.code)}`}
                className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg hover:bg-blue-50 transition-colors group"
              >
                <div className="w-6 h-6 rounded bg-slate-200 group-hover:bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-slate-500 group-hover:text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-slate-700 group-hover:text-blue-700">{reg.code}</div>
                  <div className="text-xs text-slate-500 truncate">{reg.name}</div>
                </div>
                <svg className="w-4 h-4 text-slate-300 group-hover:text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Уточнить расчёт */}
        <div className="p-3 bg-slate-50 rounded-xl">
          <div className="flex items-center gap-1.5 text-slate-600 mb-3">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            <span className="text-xs font-semibold uppercase tracking-wide">Уточнить расчёт</span>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={modifiers.urgent}
                onChange={e => setModifiers(m => ({ ...m, urgent: e.target.checked }))}
                className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-xs text-slate-700 group-hover:text-slate-900 flex-1">Срочное оформление</span>
              <span className="text-xs text-orange-500 font-medium">+50%</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={modifiers.hasProtocols}
                onChange={e => setModifiers(m => ({ ...m, hasProtocols: e.target.checked }))}
                className="w-4 h-4 rounded border-slate-300 text-green-500 focus:ring-green-500"
              />
              <span className="text-xs text-slate-700 group-hover:text-slate-900 flex-1">Есть протоколы испытаний</span>
              <span className="text-xs text-green-600 font-medium">−20%</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={modifiers.isImport}
                onChange={e => setModifiers(m => ({ ...m, isImport: e.target.checked }))}
                className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-700 group-hover:text-slate-900 flex-1">Импортная продукция</span>
              <span className="text-xs text-blue-500 font-medium">+15%</span>
            </label>
          </div>
        </div>

        {/* CTA кнопки */}
        <div className="space-y-2 pt-1">
          <a
            href={`/kontakty?product=${encodeURIComponent(productName)}&doc=${config.label}`}
            className={`w-full py-3 bg-gradient-to-r ${config.bgColor} hover:opacity-90 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-lg`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
            </svg>
            Оформить заявку
          </a>
          
          <div className="grid grid-cols-2 gap-2">
            <a
              href="tel:+78005505288"
              className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              Консультация
            </a>
            <button
              className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Скачать КП
            </button>
          </div>
        </div>

        {/* Подсказка */}
        <p className="text-center text-xs text-slate-400">
          Точную стоимость рассчитаем после анализа документов
        </p>
      </div>
    </div>
  );
}
