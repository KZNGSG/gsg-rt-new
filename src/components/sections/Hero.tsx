'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const POPULAR_SEARCHES = [
  'косметика',
  'БАДы',
  'детские игрушки',
  'одежда',
  'медицинские маски',
  'продукты питания',
];

const CATEGORIES = [
  {
    id: 'food',
    name: 'Пищевая продукция',
    icon: 'food',
    href: '/vidy-sertifikacii/pishevaya-produktsiya'
  },
  {
    id: 'medical',
    name: 'Медицинские изделия',
    icon: 'medical',
    href: '/vidy-sertifikacii/meditsinskie-izdeliya'
  },
  {
    id: 'children',
    name: 'Детские товары',
    icon: 'children',
    href: '/vidy-sertifikacii/detskie-tovary'
  },
  {
    id: 'cosmetics',
    name: 'Косметика',
    icon: 'cosmetics',
    href: '/vidy-sertifikacii/kosmetika'
  },
  {
    id: 'equipment',
    name: 'Оборудование',
    icon: 'equipment',
    href: '/vidy-sertifikacii/oborudovanie'
  },
  {
    id: 'clothing',
    name: 'Одежда и обувь',
    icon: 'clothing',
    href: '/vidy-sertifikacii/odezhda'
  },
  {
    id: 'chemistry',
    name: 'Бытовая химия',
    icon: 'chemistry',
    href: '/vidy-sertifikacii/bytovaya-khimiya'
  },
  {
    id: 'other',
    name: 'Другое',
    icon: 'other',
    href: '/vidy-sertifikacii'
  },
];

function CategoryIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactElement> = {
    food: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    medical: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    children: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
      </svg>
    ),
    cosmetics: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
    equipment: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" />
      </svg>
    ),
    clothing: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    chemistry: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5" />
      </svg>
    ),
    other: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
      </svg>
    ),
  };
  return icons[type] || icons.other;
}

export function Hero() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push('/tn-ved?q=' + encodeURIComponent(searchQuery.trim()));
    }
  };

  const handlePopularClick = (term: string) => {
    router.push('/tn-ved?q=' + encodeURIComponent(term));
  };

  return (
    <section className="relative bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-16 lg:py-24">

        {/* Главный блок с поиском */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Какие документы нужны
            <span className="block text-blue-600">на ваш товар?</span>
          </h1>

          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Узнайте требования к сертификации за 30 секунд.
            Введите название товара или код ТН ВЭД.
          </p>

          {/* Поисковая строка */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Например: детские игрушки, крем для лица, 8471..."
                className="w-full pl-12 pr-32 py-4 text-lg border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
              >
                Узнать
              </button>
            </div>
          </form>

          {/* Популярные запросы */}
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-sm text-slate-500">Популярное:</span>
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                onClick={() => handlePopularClick(term)}
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Разделитель */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-sm text-slate-400 font-medium">или выберите категорию</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>
        </div>

        {/* Категории */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((category) => (
              <a
                key={category.id}
                href={category.href}
                className="group flex flex-col items-center p-6 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-slate-100 group-hover:bg-blue-50 rounded-xl mb-3 transition-colors text-slate-600 group-hover:text-blue-600">
                  <CategoryIcon type={category.icon} />
                </div>
                <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 text-center transition-colors">
                  {category.name}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Статистика */}
        <div className="max-w-3xl mx-auto mt-16">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-slate-900">12+</div>
              <div className="text-sm text-slate-500">лет опыта</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-slate-900">60+</div>
              <div className="text-sm text-slate-500">филиалов</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-slate-900">50 000+</div>
              <div className="text-sm text-slate-500">документов</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-slate-900">от 1 дня</div>
              <div className="text-sm text-slate-500">оформление</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
