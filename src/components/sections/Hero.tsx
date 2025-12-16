'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES = [
  { name: 'Пищевая продукция', slug: 'pishchevaya-produktsiya', icon: 'food' },
  { name: 'Медизделия', slug: 'meditsinskie-izdeliya', icon: 'medical' },
  { name: 'Детские товары', slug: 'detskie-tovary', icon: 'children' },
  { name: 'Косметика', slug: 'kosmetika', icon: 'cosmetics' },
  { name: 'Оборудование', slug: 'oborudovanie', icon: 'equipment' },
  { name: 'Одежда и обувь', slug: 'odezhda-i-obuv', icon: 'clothing' },
];

const POPULAR = ['косметика', 'БАДы', 'детские игрушки', 'одежда', 'медицинские маски', 'продукты питания'];

const CERT_TYPES = [
  'Сертификат ТР ТС',
  'Декларация ТР ТС',
  'Сертификат ГОСТ Р',
  'СГР',
  'Регистрация медизделий',
  'ХАССП',
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

export function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [certType, setCertType] = useState(CERT_TYPES[0]);
  const [product, setProduct] = useState('');
  const [urgency, setUrgency] = useState<'normal' | 'urgent'>('normal');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tn-ved?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleQuickSearch = (term: string) => {
    router.push(`/tn-ved?q=${encodeURIComponent(term)}`);
  };

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

            {/* Поисковая строка */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="flex bg-white rounded-xl overflow-hidden shadow-xl">
                <div className="flex-1 flex items-center px-4">
                  <svg className="w-5 h-5 text-slate-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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

          {/* Правая часть - форма расчёта */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-slate-800 mb-1">Экспресс-расчёт</h3>
              <p className="text-sm text-slate-500 mb-4">стоимости сертификата</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Вид документа</label>
                  <select
                    value={certType}
                    onChange={(e) => setCertType(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-700"
                  >
                    {CERT_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ваша продукция</label>
                  <input
                    type="text"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    placeholder="Например: крем для лица"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-700 placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Срочность</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="urgency"
                        checked={urgency === 'normal'}
                        onChange={() => setUrgency('normal')}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-slate-600">Обычная (от 3 дней)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="urgency"
                        checked={urgency === 'urgent'}
                        onChange={() => setUrgency('urgent')}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-sm text-slate-600">Срочная (от 1 дня)</span>
                    </label>
                  </div>
                </div>

                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-orange-500/30">
                  Рассчитать стоимость
                </button>
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
