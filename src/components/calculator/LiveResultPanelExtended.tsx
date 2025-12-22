'use client';

import React, { useState, useEffect } from 'react';
import { CertificationResult } from '@/lib/certification-rules';

interface LiveResultPanelProps {
  result: CertificationResult | null;
  productName: string;
  productCode?: string;
  isLoading?: boolean;
  inputQuery?: string;
  onClear?: () => void;
}

// Типы для опроса
interface SurveyAnswers {
  purpose: string;
  purposeOther: string;
  origin: string;
  originOther: string;
  companyType: string;
  companyTypeOther: string;
  existingDocs: string[];
  existingDocsOther: string;
}

interface CompanyData {
  name: string;
  inn: string;
  address: string;
  kpp?: string;
}

// DaData API
const DADATA_TOKEN = '29df0661dd768a364acd6c574fe87539eb658d4d';

async function searchCompanyByInn(query: string): Promise<CompanyData[]> {
  try {
    const response = await fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Token ${DADATA_TOKEN}`,
      },
      body: JSON.stringify({ query, count: 5 }),
    });
    const data = await response.json();
    return data.suggestions?.map((s: any) => ({
      name: s.value,
      inn: s.data.inn,
      kpp: s.data.kpp,
      address: s.data.address?.value || '',
    })) || [];
  } catch (error) {
    console.error('DaData error:', error);
    return [];
  }
}

export function LiveResultPanelExtended({ result, productName, productCode, isLoading, inputQuery = '', onClear }: LiveResultPanelProps) {
  // Этапы: 'initial' | 'survey' | 'contact'
  const [stage, setStage] = useState<'initial' | 'survey' | 'contact'>('initial');
  const [surveyStep, setSurveyStep] = useState(1);
  const [answers, setAnswers] = useState<SurveyAnswers>({
    purpose: '',
    purposeOther: '',
    origin: '',
    originOther: '',
    companyType: '',
    companyTypeOther: '',
    existingDocs: [],
    existingDocsOther: '',
  });

  // Контактные данные
  const [innQuery, setInnQuery] = useState('');
  const [companySuggestions, setCompanySuggestions] = useState<CompanyData[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Сброс при смене результата
  useEffect(() => {
    if (!result) {
      setStage('initial');
      setSurveyStep(1);
      setAnswers({
        purpose: '',
        purposeOther: '',
        origin: '',
        originOther: '',
        companyType: '',
        companyTypeOther: '',
        existingDocs: [],
        existingDocsOther: '',
      });
      setSelectedCompany(null);
      setPhone('');
      setEmail('');
      setIsSubmitted(false);
    }
  }, [result]);

  // Поиск компании по ИНН
  useEffect(() => {
    if (innQuery.length >= 3) {
      setIsSearching(true);
      const timeout = setTimeout(async () => {
        const results = await searchCompanyByInn(innQuery);
        setCompanySuggestions(results);
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      setCompanySuggestions([]);
    }
  }, [innQuery]);

  // Пустое состояние - Минималистичный дизайн
  if (!result && !isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 h-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Результат подбора</h3>
              <p className="text-slate-400 text-xs">Введите товар для анализа</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center justify-center min-h-[340px]">
          {/* Иллюстрация */}
          <div className="relative mb-6">
            {/* Круг с иконкой */}
            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            {/* Декоративные элементы */}
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center">
              <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="absolute -bottom-1 -left-1 w-5 h-5 rounded-md bg-amber-100 flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-amber-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
          </div>

          {/* Текст */}
          <div className="text-center">
            <h4 className="text-slate-800 font-semibold text-lg mb-2">Введите название товара</h4>
            <p className="text-slate-500 text-sm max-w-[260px]">
              Укажите название продукции или код ТН ВЭД, чтобы узнать какие документы требуются
            </p>
          </div>

          {/* Подсказки */}
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <span className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs rounded-full">косметика</span>
            <span className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs rounded-full">одежда</span>
            <span className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs rounded-full">БАДы</span>
            <span className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs rounded-full">игрушки</span>
          </div>

          {/* Стрелка */}
          <div className="mt-6 flex items-center gap-2 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
            </svg>
            <span className="text-sm">Поле ввода слева</span>
          </div>
        </div>
      </div>
    );
  }

  // Загрузка
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 h-full">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-white animate-spin" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Анализируем...</h3>
              <p className="text-slate-400 text-xs">Подбираем документы</p>
            </div>
          </div>
        </div>
        <div className="p-5">
          <div className="animate-pulse space-y-3">
            <div className="h-14 bg-slate-100 rounded-xl"></div>
            <div className="h-20 bg-slate-100 rounded-xl"></div>
            <div className="h-24 bg-slate-100 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  const doc = result?.documents[0];

  // Определяем тип документа
  const getDocTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      certificate: 'Сертификат соответствия',
      declaration: 'Декларация о соответствии',
      sgr: 'Свидетельство о гос. регистрации',
      registration: 'Регистрационное удостоверение',
      rejection: 'Отказное письмо',
    };
    return labels[type] || 'Документ';
  };

  // Отправка заявки
  const handleSubmit = async () => {
    if (!selectedCompany || !phone) return;

    setIsSubmitting(true);

    // Здесь будет отправка на сервер
    const requestData = {
      product: productName,
      productCode,
      documentType: doc?.type,
      regulation: doc?.regulation,
      answers,
      company: selectedCompany,
      phone,
      email,
      timestamp: new Date().toISOString(),
    };

    console.log('Заявка:', requestData);

    // Имитация отправки
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  // ЭТАП: Успешная отправка
  if (isSubmitted) {
    return (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 h-full">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Заявка отправлена</h3>
              <p className="text-emerald-200 text-xs">Скоро свяжемся с вами</p>
            </div>
          </div>
        </div>
        <div className="p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h4 className="text-xl font-semibold text-slate-800 mb-2">Спасибо за заявку!</h4>
          <p className="text-slate-500 mb-6">
            Менеджер свяжется с вами в течение 15 минут<br/>
            и отправит подробный расчёт
          </p>

          <div className="bg-slate-50 rounded-xl p-4 mb-4 text-left">
            <p className="text-sm text-slate-600 mb-2">Ваша заявка:</p>
            <p className="font-medium text-slate-800">{productName}</p>
            <p className="text-sm text-slate-500">{selectedCompany?.name}</p>
          </div>

          {onClear && (
            <button
              onClick={() => {
                setIsSubmitted(false);
                setStage('initial');
                onClear();
              }}
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              ← Новый подбор
            </button>
          )}
        </div>
      </div>
    );
  }

  // ЭТАП 1: Предварительный результат
  if (stage === 'initial') {
    return (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 h-full">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Предварительный результат</h3>
                <p className="text-slate-400 text-xs">Требуется уточнение</p>
              </div>
            </div>
            {onClear && (
              <button onClick={onClear} className="text-slate-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="p-5">
          {/* Найденный товар */}
          <div className="bg-slate-50 rounded-xl p-4 mb-4">
            <p className="text-xs text-slate-500 mb-1">Товар</p>
            <p className="font-semibold text-slate-800">{productName}</p>
            {productCode && <p className="text-sm text-slate-500">Код ТН ВЭД: {productCode}</p>}
          </div>

          {/* Предварительный документ */}
          <div className="border-2 border-dashed border-amber-200 bg-amber-50/50 rounded-xl p-4 mb-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-amber-700 font-medium mb-1">Подлежит декларированию</p>
                <p className="font-semibold text-slate-800">{getDocTypeLabel(doc?.type || 'declaration')}</p>
                {doc?.regulation && <p className="text-sm text-slate-600">{doc.regulation}</p>}
                <p className="text-sm text-slate-500 mt-1">+ Протокол испытаний</p>
              </div>
            </div>
          </div>

          {/* Призыв к уточнению */}
          <div className="text-center mb-4">
            <p className="text-slate-600 text-sm mb-1">
              Для точного расчёта ответьте на 4 вопроса
            </p>
            <p className="text-slate-400 text-xs">
              Это займёт 30 секунд
            </p>
          </div>

          <button
            onClick={() => setStage('survey')}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            Уточнить детали
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // ЭТАП 2: Опрос
  if (stage === 'survey') {
    return (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 h-full">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <span className="text-blue-400 font-semibold text-sm">{surveyStep}/4</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Уточняющие вопросы</h3>
                <p className="text-slate-400 text-xs">Шаг {surveyStep} из 4</p>
              </div>
            </div>
            <button
              onClick={() => { setStage('initial'); setSurveyStep(1); }}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Progress bar */}
          <div className="mt-3 h-1 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${(surveyStep / 4) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-5">
          {/* Вопрос 1: Для чего документ */}
          {surveyStep === 1 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">Для чего нужен документ?</h4>
                <p className="text-sm text-slate-500">
                  Это поможет подобрать оптимальный комплект документов и учесть требования вашего заказчика или площадки
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { value: 'marketplace', label: 'Выход на маркетплейс', desc: 'Wildberries, Ozon, Яндекс.Маркет' },
                  { value: 'tender', label: 'Тендер / Госзакупки', desc: '44-ФЗ, 223-ФЗ' },
                  { value: 'customs', label: 'Таможенное оформление', desc: 'Ввоз продукции в РФ' },
                  { value: 'contractor', label: 'Запрос от контрагента', desc: 'Торговые сети, дистрибьюторы' },
                  { value: 'internal', label: 'Для собственных нужд', desc: 'Легализация продукции' },
                ].map(opt => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      answers.purpose === opt.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="purpose"
                      value={opt.value}
                      checked={answers.purpose === opt.value}
                      onChange={(e) => setAnswers({ ...answers, purpose: e.target.value, purposeOther: '' })}
                      className="mt-1 w-4 h-4 text-blue-600"
                    />
                    <div>
                      <p className="font-medium text-slate-800">{opt.label}</p>
                      <p className="text-xs text-slate-500">{opt.desc}</p>
                    </div>
                  </label>
                ))}

                {/* Другое */}
                <label
                  className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    answers.purpose === 'other'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="purpose"
                    value="other"
                    checked={answers.purpose === 'other'}
                    onChange={(e) => setAnswers({ ...answers, purpose: e.target.value })}
                    className="mt-1 w-4 h-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">Другое</p>
                    {answers.purpose === 'other' && (
                      <input
                        type="text"
                        value={answers.purposeOther}
                        onChange={(e) => setAnswers({ ...answers, purposeOther: e.target.value })}
                        placeholder="Опишите вашу ситуацию..."
                        className="mt-2 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    )}
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Вопрос 2: Откуда продукция */}
          {surveyStep === 2 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">Откуда продукция?</h4>
                <p className="text-sm text-slate-500">
                  От этого зависит схема сертификации, перечень документов и сроки оформления
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { value: 'russia', label: 'Собственное производство в РФ', desc: 'Производим на территории России' },
                  { value: 'china', label: 'Импорт из Китая', desc: 'Закупаем у китайских поставщиков' },
                  { value: 'other_import', label: 'Импорт из другой страны', desc: 'Европа, Азия, США и др.' },
                  { value: 'eaeu', label: 'Страны ЕАЭС', desc: 'Казахстан, Беларусь, Киргизия, Армения' },
                ].map(opt => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      answers.origin === opt.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="origin"
                      value={opt.value}
                      checked={answers.origin === opt.value}
                      onChange={(e) => setAnswers({ ...answers, origin: e.target.value, originOther: '' })}
                      className="mt-1 w-4 h-4 text-blue-600"
                    />
                    <div>
                      <p className="font-medium text-slate-800">{opt.label}</p>
                      <p className="text-xs text-slate-500">{opt.desc}</p>
                    </div>
                  </label>
                ))}

                <label
                  className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    answers.origin === 'other'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="origin"
                    value="other"
                    checked={answers.origin === 'other'}
                    onChange={(e) => setAnswers({ ...answers, origin: e.target.value })}
                    className="mt-1 w-4 h-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">Другое</p>
                    {answers.origin === 'other' && (
                      <input
                        type="text"
                        value={answers.originOther}
                        onChange={(e) => setAnswers({ ...answers, originOther: e.target.value })}
                        placeholder="Укажите страну или ситуацию..."
                        className="mt-2 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    )}
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Вопрос 3: Кем является компания */}
          {surveyStep === 3 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">Кем является ваша компания?</h4>
                <p className="text-sm text-slate-500">
                  Влияет на схему сертификации и комплект необходимых документов
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { value: 'manufacturer', label: 'Производитель', desc: 'Изготавливаем продукцию самостоятельно' },
                  { value: 'importer', label: 'Импортёр / Поставщик', desc: 'Ввозим и реализуем продукцию' },
                  { value: 'seller', label: 'Продавец / Дистрибьютор', desc: 'Закупаем и перепродаём' },
                  { value: 'contract', label: 'Контрактное производство', desc: 'Производство под заказ' },
                ].map(opt => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      answers.companyType === opt.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="companyType"
                      value={opt.value}
                      checked={answers.companyType === opt.value}
                      onChange={(e) => setAnswers({ ...answers, companyType: e.target.value, companyTypeOther: '' })}
                      className="mt-1 w-4 h-4 text-blue-600"
                    />
                    <div>
                      <p className="font-medium text-slate-800">{opt.label}</p>
                      <p className="text-xs text-slate-500">{opt.desc}</p>
                    </div>
                  </label>
                ))}

                <label
                  className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    answers.companyType === 'other'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="companyType"
                    value="other"
                    checked={answers.companyType === 'other'}
                    onChange={(e) => setAnswers({ ...answers, companyType: e.target.value })}
                    className="mt-1 w-4 h-4 text-blue-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">Другое</p>
                    {answers.companyType === 'other' && (
                      <input
                        type="text"
                        value={answers.companyTypeOther}
                        onChange={(e) => setAnswers({ ...answers, companyTypeOther: e.target.value })}
                        placeholder="Опишите вашу роль..."
                        className="mt-2 w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                    )}
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Вопрос 4: Какие документы есть */}
          {surveyStep === 4 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">Какие документы уже есть?</h4>
                <p className="text-sm text-slate-500">
                  Если что-то есть — это может ускорить процесс и снизить стоимость
                </p>
              </div>

              <div className="space-y-2">
                {[
                  { value: 'protocols', label: 'Протоколы испытаний', desc: 'Результаты лабораторных тестов' },
                  { value: 'tech_docs', label: 'Техническая документация', desc: 'ТУ, ГОСТ, тех. описание' },
                  { value: 'manufacturer_docs', label: 'Документы от производителя', desc: 'Паспорт, сертификаты качества' },
                  { value: 'contract', label: 'Контракт / Инвойс', desc: 'Договор с поставщиком' },
                ].map(opt => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      answers.existingDocs.includes(opt.value)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={opt.value}
                      checked={answers.existingDocs.includes(opt.value)}
                      onChange={(e) => {
                        const newDocs = e.target.checked
                          ? [...answers.existingDocs.filter(d => d !== 'nothing'), opt.value]
                          : answers.existingDocs.filter(d => d !== opt.value);
                        setAnswers({ ...answers, existingDocs: newDocs });
                      }}
                      className="mt-1 w-4 h-4 text-blue-600 rounded"
                    />
                    <div>
                      <p className="font-medium text-slate-800">{opt.label}</p>
                      <p className="text-xs text-slate-500">{opt.desc}</p>
                    </div>
                  </label>
                ))}

                <label
                  className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    answers.existingDocs.includes('nothing')
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    value="nothing"
                    checked={answers.existingDocs.includes('nothing')}
                    onChange={(e) => {
                      setAnswers({
                        ...answers,
                        existingDocs: e.target.checked ? ['nothing'] : []
                      });
                    }}
                    className="mt-1 w-4 h-4 text-blue-600 rounded"
                  />
                  <div>
                    <p className="font-medium text-slate-800">Ничего нет</p>
                    <p className="text-xs text-slate-500">Начинаем с нуля</p>
                  </div>
                </label>
              </div>

              <div>
                <label className="text-sm text-slate-600 block mb-1">Другие документы (если есть)</label>
                <input
                  type="text"
                  value={answers.existingDocsOther}
                  onChange={(e) => setAnswers({ ...answers, existingDocsOther: e.target.value })}
                  placeholder="Перечислите, что ещё есть..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Навигация */}
          <div className="flex gap-3 mt-6">
            {surveyStep > 1 && (
              <button
                onClick={() => setSurveyStep(s => s - 1)}
                className="flex-1 py-3 border-2 border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Назад
              </button>
            )}
            <button
              onClick={() => {
                if (surveyStep < 4) {
                  setSurveyStep(s => s + 1);
                } else {
                  setStage('contact');
                }
              }}
              disabled={
                (surveyStep === 1 && !answers.purpose) ||
                (surveyStep === 2 && !answers.origin) ||
                (surveyStep === 3 && !answers.companyType) ||
                (surveyStep === 4 && answers.existingDocs.length === 0)
              }
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-300 disabled:to-slate-400 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {surveyStep < 4 ? 'Далее' : 'Продолжить'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ЭТАП 3: Контактные данные
  if (stage === 'contact') {
    return (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 h-full">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Почти готово</h3>
                <p className="text-slate-400 text-xs">Последний шаг</p>
              </div>
            </div>
            <button
              onClick={() => { setSurveyStep(4); setStage('survey'); }}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-5">
          {/* Предварительный результат */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-slate-800">{getDocTypeLabel(doc?.type || 'declaration')}</p>
                {doc?.regulation && <p className="text-sm text-slate-600">{doc.regulation}</p>}
                <p className="text-sm text-slate-500 mt-1">+ Протокол испытаний</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-5">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Полный расчёт и рекомендации</span> отправим в течение 15 минут после получения заявки
            </p>
          </div>

          {/* Форма контактов */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">
                ИНН или название компании
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={selectedCompany ? selectedCompany.name : innQuery}
                  onChange={(e) => {
                    setSelectedCompany(null);
                    setInnQuery(e.target.value);
                  }}
                  placeholder="Введите ИНН или название..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="w-5 h-5 text-slate-400 animate-spin" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Подсказки */}
              {companySuggestions.length > 0 && !selectedCompany && (
                <div className="mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                  {companySuggestions.map((company, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedCompany(company);
                        setInnQuery('');
                        setCompanySuggestions([]);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors"
                    >
                      <p className="font-medium text-slate-800 text-sm">{company.name}</p>
                      <p className="text-xs text-slate-500">ИНН {company.inn} • {company.address}</p>
                    </button>
                  ))}
                </div>
              )}

              {/* Выбранная компания */}
              {selectedCompany && (
                <div className="mt-2 bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800 text-sm">{selectedCompany.name}</p>
                    <p className="text-xs text-slate-500">ИНН {selectedCompany.inn}</p>
                  </div>
                  <button
                    onClick={() => setSelectedCompany(null)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">
                Телефон для связи <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (___) ___-__-__"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1.5">
                Email <span className="text-slate-400">(необязательно)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@company.ru"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!selectedCompany || !phone || isSubmitting}
            className="w-full mt-6 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-slate-300 disabled:to-slate-400 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Отправляем...
              </>
            ) : (
              <>
                Получить расчёт за 15 минут
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </>
            )}
          </button>

          <p className="text-center text-xs text-slate-400 mt-3">
            Менеджер свяжется для уточнения деталей и отправит КП на почту
          </p>
        </div>
      </div>
    );
  }

  return null;
}
