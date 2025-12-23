'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  GLOBAL_PRICING,
  ALL_TRTS_CONTENT,
  calculateProductPrice,
} from '@/data/tr-ts-content';
import {
  getCertificateRegulations,
  getDeclarationRegulations,
} from '@/data/tr-ts-database';
import seoData from '@/data/seo-pages.json';

type Tab = 'overview' | 'content' | 'prices' | 'migration' | 'help';

// Типы для SEO миграции
interface OldPage {
  oldUrl: string;
  newUrl: string;
  category: string;
  title: string;
  description: string;
  h1: string;
  content?: string;
  status: 'pending' | 'in_progress' | 'done';
  priority: 'high' | 'medium' | 'low';
}

interface City {
  slug: string;
  name: string;
  prepositional: string;
  isMain?: boolean;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // Статистика
  const certRegs = getCertificateRegulations();
  const declRegs = getDeclarationRegulations();
  const trtsWithContent = Object.keys(ALL_TRTS_CONTENT);

  const totalProducts = Object.values(ALL_TRTS_CONTENT).reduce(
    (sum, trts) => sum + trts.products.length, 0
  );
  const totalImports = Object.values(ALL_TRTS_CONTENT).reduce(
    (sum, trts) => sum + trts.imports.length, 0
  );
  const totalChannels = Object.values(ALL_TRTS_CONTENT).reduce(
    (sum, trts) => sum + trts.salesChannels.length, 0
  );

  // Данные миграции
  const oldPages = seoData.pages as OldPage[];
  const cities = seoData.cities as City[];

  const tabs = [
    { id: 'overview' as Tab, label: 'Обзор', icon: '📊' },
    { id: 'content' as Tab, label: 'Контент', icon: '📝' },
    { id: 'prices' as Tab, label: 'Цены', icon: '💰' },
    { id: 'migration' as Tab, label: `Миграция (${oldPages.length})`, icon: '🔄' },
    { id: 'help' as Tab, label: 'Помощь', icon: '❓' },
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Админ-панель</h1>
              <p className="text-slate-500 text-sm">
                Управление контентом и ценами
              </p>
            </div>
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
              ← На сайт
            </Link>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-[73px] z-10">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <OverviewTab
            certCount={certRegs.length}
            declCount={declRegs.length}
            filledCount={trtsWithContent.length}
            totalProducts={totalProducts}
            totalImports={totalImports}
            totalChannels={totalChannels}
          />
        )}
        {activeTab === 'content' && (
          <ContentTab
            certRegs={certRegs}
            declRegs={declRegs}
          />
        )}
        {activeTab === 'prices' && <PricesTab />}
        {activeTab === 'migration' && <MigrationTab pages={oldPages} cities={cities} />}
        {activeTab === 'help' && <HelpTab />}
      </div>
    </div>
  );
}

// =============================================================================
// ВКЛАДКА: ОБЗОР
// =============================================================================

function OverviewTab({
  certCount,
  declCount,
  filledCount,
  totalProducts,
  totalImports,
  totalChannels,
}: {
  certCount: number;
  declCount: number;
  filledCount: number;
  totalProducts: number;
  totalImports: number;
  totalChannels: number;
}) {
  const totalTRTS = certCount + declCount;
  const totalPages = totalTRTS + totalProducts + totalImports + totalChannels;

  return (
    <div className="space-y-8">
      {/* Главные метрики */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="text-4xl font-black text-blue-600">{totalPages}</div>
          <div className="text-slate-600 mt-1">Всего SEO-страниц</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="text-4xl font-black text-emerald-600">{totalTRTS}</div>
          <div className="text-slate-600 mt-1">ТР ТС ({certCount} серт. + {declCount} декл.)</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="text-4xl font-black text-purple-600">{totalProducts}</div>
          <div className="text-slate-600 mt-1">Страниц товаров</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="text-4xl font-black text-amber-600">{totalImports + totalChannels}</div>
          <div className="text-slate-600 mt-1">Импорт + маркетплейсы</div>
        </div>
      </div>

      {/* Прогресс заполнения */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Прогресс заполнения</h2>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-600">ТР ТС с товарами: {filledCount} из {totalTRTS}</span>
            <span className="font-bold text-blue-600">{Math.round(filledCount / totalTRTS * 100)}%</span>
          </div>
          <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
              style={{ width: `${(filledCount / totalTRTS) * 100}%` }}
            />
          </div>
        </div>
        <p className="text-slate-500 text-sm">
          Заполни данные для остальных {totalTRTS - filledCount} ТР ТС чтобы получить ~{(totalTRTS - filledCount) * 15} дополнительных SEO-страниц
        </p>
      </div>

      {/* Структура страниц */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Структура сайта</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <span className="text-2xl">📄</span>
            <div className="flex-1">
              <div className="font-medium">/sertifikat-tr-ts/[название]</div>
              <div className="text-slate-500 text-sm">Основные страницы сертификатов</div>
            </div>
            <span className="font-bold text-slate-700">{certCount}</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <span className="text-2xl">📄</span>
            <div className="flex-1">
              <div className="font-medium">/deklaraciya-tr-ts/[название]</div>
              <div className="text-slate-500 text-sm">Основные страницы деклараций</div>
            </div>
            <span className="font-bold text-slate-700">{declCount}</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl">
            <span className="text-2xl">🛍️</span>
            <div className="flex-1">
              <div className="font-medium">/sertifikat-tr-ts/[тртс]/tovary/[товар]</div>
              <div className="text-slate-500 text-sm">Страницы товаров (куклы, конструкторы...)</div>
            </div>
            <span className="font-bold text-indigo-600">{totalProducts}</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
            <span className="text-2xl">🌍</span>
            <div className="flex-1">
              <div className="font-medium">/sertifikat-tr-ts/[тртс]/import/[страна]</div>
              <div className="text-slate-500 text-sm">Страницы импорта (Китай, Турция...)</div>
            </div>
            <span className="font-bold text-amber-600">{totalImports}</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
            <span className="text-2xl">🛒</span>
            <div className="flex-1">
              <div className="font-medium">/sertifikat-tr-ts/[тртс]/prodazha/[канал]</div>
              <div className="text-slate-500 text-sm">Страницы маркетплейсов (WB, Ozon...)</div>
            </div>
            <span className="font-bold text-purple-600">{totalChannels}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// ВКЛАДКА: КОНТЕНТ
// =============================================================================

function ContentTab({
  certRegs,
  declRegs,
}: {
  certRegs: ReturnType<typeof getCertificateRegulations>;
  declRegs: ReturnType<typeof getDeclarationRegulations>;
}) {
  const [filter, setFilter] = useState<'all' | 'cert' | 'decl' | 'filled' | 'empty'>('all');

  const allRegs = [
    ...certRegs.map(r => ({ ...r, type: 'cert' as const })),
    ...declRegs.map(r => ({ ...r, type: 'decl' as const })),
  ];

  const filtered = allRegs.filter(r => {
    const hasFilled = ALL_TRTS_CONTENT[r.slug] !== undefined;
    if (filter === 'cert') return r.type === 'cert';
    if (filter === 'decl') return r.type === 'decl';
    if (filter === 'filled') return hasFilled;
    if (filter === 'empty') return !hasFilled;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Фильтры */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'all', label: 'Все' },
          { id: 'cert', label: 'Сертификаты' },
          { id: 'decl', label: 'Декларации' },
          { id: 'filled', label: 'Заполненные', color: 'bg-green-100 text-green-700' },
          { id: 'empty', label: 'Не заполненные', color: 'bg-red-100 text-red-700' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as typeof filter)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filter === f.id
                ? 'bg-blue-600 text-white'
                : f.color || 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Таблица */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-slate-700">ТР ТС</th>
                <th className="text-left px-6 py-4 font-semibold text-slate-700">Тип</th>
                <th className="text-center px-6 py-4 font-semibold text-slate-700">Товары</th>
                <th className="text-center px-6 py-4 font-semibold text-slate-700">Импорт</th>
                <th className="text-center px-6 py-4 font-semibold text-slate-700">Продажи</th>
                <th className="text-center px-6 py-4 font-semibold text-slate-700">Статус</th>
                <th className="text-right px-6 py-4 font-semibold text-slate-700">Ссылка</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((reg) => {
                const content = ALL_TRTS_CONTENT[reg.slug];
                const isFilled = !!content;

                return (
                  <tr key={reg.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{reg.shortName}</div>
                      <div className="text-slate-500 text-sm">{reg.number}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        reg.type === 'cert'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {reg.type === 'cert' ? 'Сертификат' : 'Декларация'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isFilled ? (
                        <span className="font-bold text-indigo-600">{content.products.length}</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isFilled ? (
                        <span className="font-bold text-amber-600">{content.imports.length}</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isFilled ? (
                        <span className="font-bold text-purple-600">{content.salesChannels.length}</span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {isFilled ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Заполнен
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-500 rounded text-xs font-medium">
                          Пусто
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/${reg.type === 'cert' ? 'sertifikat-tr-ts' : 'deklaraciya-tr-ts'}/${reg.slug}`}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        Открыть →
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// ВКЛАДКА: ЦЕНЫ
// =============================================================================

function PricesTab() {
  const [selectedTRTS, setSelectedTRTS] = useState(Object.keys(ALL_TRTS_CONTENT)[0] || '');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [priceType, setPriceType] = useState<'batch' | 'serial' | 'urgent'>('batch');

  const trts = selectedTRTS ? ALL_TRTS_CONTENT[selectedTRTS] : null;

  // Расчёт цены
  let price = { min: 0, max: 0, days: '' };
  if (trts) {
    price = calculateProductPrice(trts.slug, selectedProduct || undefined, { type: priceType });
  }

  return (
    <div className="space-y-8">
      {/* Базовые цены */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Базовые цены</h2>
        <p className="text-slate-500 text-sm mb-6">
          Последнее обновление: {GLOBAL_PRICING.lastUpdated}
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Сертификаты */}
          <div>
            <h3 className="font-bold text-emerald-600 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
              Сертификаты ТР ТС
            </h3>
            <div className="space-y-3">
              {Object.entries(GLOBAL_PRICING.base.certificate).map(([type, data]) => (
                <div key={type} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <div className="font-medium capitalize">
                      {type === 'serial' ? 'Серийное' : type === 'batch' ? 'Партия' : 'Срочное'}
                    </div>
                    <div className="text-slate-500 text-sm">{data.days} дней</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{data.min.toLocaleString()} — {data.max.toLocaleString()} ₽</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Декларации */}
          <div>
            <h3 className="font-bold text-blue-600 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              Декларации ТР ТС
            </h3>
            <div className="space-y-3">
              {Object.entries(GLOBAL_PRICING.base.declaration).map(([type, data]) => (
                <div key={type} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <div className="font-medium capitalize">
                      {type === 'serial' ? 'Серийное' : type === 'batch' ? 'Партия' : 'Срочное'}
                    </div>
                    <div className="text-slate-500 text-sm">{data.days} дней</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{data.min.toLocaleString()} — {data.max.toLocaleString()} ₽</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Надбавки */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Надбавки за импорт</h3>
          <div className="space-y-2">
            {Object.entries(GLOBAL_PRICING.importSurcharge).map(([country, amount]) => (
              <div key={country} className="flex justify-between p-2">
                <span className="capitalize">{country === 'china' ? 'Китай' : country === 'turkey' ? 'Турция' : country === 'europe' ? 'Европа' : country === 'usa' ? 'США' : 'Другие'}</span>
                <span className={`font-medium ${amount > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                  {amount > 0 ? `+${amount.toLocaleString()} ₽` : 'Бесплатно'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Скидки за объём</h3>
          <div className="space-y-2">
            {Object.entries(GLOBAL_PRICING.volumeDiscount).map(([range, discount]) => (
              <div key={range} className="flex justify-between p-2">
                <span>{range} SKU</span>
                <span className={`font-medium ${discount > 0 ? 'text-green-600' : 'text-slate-500'}`}>
                  {discount > 0 ? `-${(discount * 100).toFixed(0)}%` : '0%'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Калькулятор */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Калькулятор цен</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ТР ТС</label>
              <select
                value={selectedTRTS}
                onChange={(e) => {
                  setSelectedTRTS(e.target.value);
                  setSelectedProduct('');
                }}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white"
              >
                <option value="">Выберите...</option>
                {Object.entries(ALL_TRTS_CONTENT).map(([slug, data]) => (
                  <option key={slug} value={slug}>{data.number} — {data.shortName}</option>
                ))}
              </select>
            </div>

            {trts && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Товар</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="">Любой</option>
                  {trts.products.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name} {p.priceMultiplier !== 1 ? `(×${p.priceMultiplier})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Тип</label>
              <div className="flex gap-2">
                {(['batch', 'serial', 'urgent'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setPriceType(type)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                      priceType === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {type === 'batch' ? 'Партия' : type === 'serial' ? 'Серийное' : 'Срочное'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Результат */}
          <div className="flex items-center justify-center">
            {trts ? (
              <div className="text-center p-6 bg-white rounded-2xl shadow-sm w-full">
                <div className="text-slate-500 mb-2">Итоговая цена</div>
                <div className="text-4xl font-black text-slate-900">
                  от {price.min.toLocaleString()} ₽
                </div>
                <div className="text-slate-500 mt-1">
                  до {price.max.toLocaleString()} ₽
                </div>
                <div className="mt-4 text-blue-600 font-medium">
                  Срок: {price.days}
                </div>
              </div>
            ) : (
              <div className="text-slate-400 text-center">
                Выберите ТР ТС для расчёта
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// ВКЛАДКА: КАК РЕДАКТИРОВАТЬ
// =============================================================================

function HelpTab() {
  return (
    <div className="max-w-3xl space-y-8">
      {/* Где редактировать */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Где редактировать данные?</h2>
        <p className="text-slate-600 mb-4">
          Все данные хранятся в двух файлах. Редактируй их через GitHub или VS Code:
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="font-bold text-blue-800 mb-1">src/data/tr-ts-content.ts</div>
            <div className="text-blue-700 text-sm">
              Товары, импорт, маркетплейсы, цены. Основной файл для SEO-страниц.
            </div>
          </div>

          <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
            <div className="font-bold text-purple-800 mb-1">src/data/tr-ts-database.ts</div>
            <div className="text-purple-700 text-sm">
              Базовая информация о ТР ТС: номера, названия, основной контент страниц.
            </div>
          </div>
        </div>
      </div>

      {/* Как добавить новый ТР ТС */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Как добавить товары для ТР ТС?</h2>
        <ol className="space-y-4 text-slate-700">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
            <div>
              <div className="font-medium">Открой файл tr-ts-content.ts</div>
              <div className="text-slate-500 text-sm">Через GitHub: github.com/KZNGSG/gsg-rt-new → src/data/tr-ts-content.ts → Edit</div>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
            <div>
              <div className="font-medium">Скопируй пример TRTS_008_IGRUSHKI</div>
              <div className="text-slate-500 text-sm">Это полный пример с товарами, импортом и маркетплейсами</div>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
            <div>
              <div className="font-medium">Измени данные под нужный ТР ТС</div>
              <div className="text-slate-500 text-sm">Поменяй id, slug, name, products и т.д.</div>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
            <div>
              <div className="font-medium">Добавь в ALL_TRTS_CONTENT</div>
              <div className="text-slate-500 text-sm">В конце файла добавь: &apos;007-detskie-tovary&apos;: TRTS_007_DETSKIE,</div>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">5</span>
            <div>
              <div className="font-medium">Сохрани и закоммить</div>
              <div className="text-slate-500 text-sm">Через 1-2 минуты Vercel автоматически обновит сайт</div>
            </div>
          </li>
        </ol>
      </div>

      {/* Как изменить цены */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Как изменить цены?</h2>
        <div className="space-y-3 text-slate-700">
          <p>Все цены в одном месте — секция <code className="bg-slate-100 px-2 py-0.5 rounded">GLOBAL_PRICING</code> в tr-ts-content.ts:</p>
          <pre className="bg-slate-900 text-green-400 p-4 rounded-xl overflow-x-auto text-sm">
{`GLOBAL_PRICING = {
  base: {
    certificate: {
      serial: { min: 15000, max: 45000, days: '10-14' },
      batch:  { min: 12000, max: 35000, days: '7-10' },
      urgent: { min: 22000, max: 55000, days: '3-5' },
    },
    ...
  },
  importSurcharge: {
    china: 0,      // Без надбавки
    turkey: 2000,  // +2000 ₽
    ...
  }
}`}
          </pre>
          <p className="text-slate-500 text-sm">
            После изменения цен — закоммить. Все страницы автоматически покажут новые цены.
          </p>
        </div>
      </div>

      {/* Ссылка на GitHub */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
        <h2 className="text-xl font-bold mb-2">Быстрый доступ</h2>
        <p className="text-slate-300 mb-4">Редактируй файлы прямо в браузере:</p>
        <a
          href="https://github.com/KZNGSG/gsg-rt-new/blob/main/src/data/tr-ts-content.ts"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-slate-900 font-bold px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors"
        >
          Открыть GitHub →
        </a>
      </div>
    </div>
  );
}

// =============================================================================
// ВКЛАДКА: МИГРАЦИЯ (старые страницы) - ПОЛНАЯ ВЕРСИЯ
// =============================================================================

const categoryNames: Record<string, string> = {
  main: 'Главная',
  services: 'Виды сертификации',
  products: 'Сертификат на товар',
  regulations: 'ТР ТС',
  about: 'О компании',
  contacts: 'Контакты',
  clients: 'Клиенты',
  news: 'Новости',
  other: 'Прочее',
};

type MigrationSubTab = 'pages' | 'redirects' | 'cities' | 'analytics';

function MigrationTab({ pages: initialPages, cities }: { pages: OldPage[]; cities: City[] }) {
  const [pages, setPages] = useState<OldPage[]>(initialPages);
  const [subTab, setSubTab] = useState<MigrationSubTab>('pages');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Замена переменных города
  const replaceCity = (text: string) => {
    const city = cities.find(c => c.slug === selectedCity) || cities.find(c => c.isMain) || cities[0];
    if (!city) return text;
    return text.replace(/{city}/g, city.name).replace(/{prepositional}/g, city.prepositional);
  };

  // Обновление страницы
  const updatePage = (oldUrl: string, updates: Partial<OldPage>) => {
    setPages(pages.map(p => p.oldUrl === oldUrl ? { ...p, ...updates } : p));
  };

  // Статистика
  const stats = useMemo(() => {
    const total = pages.length;
    const done = pages.filter(p => p.status === 'done').length;
    const inProgress = pages.filter(p => p.status === 'in_progress').length;
    const pending = pages.filter(p => p.status === 'pending').length;
    const highPriority = pages.filter(p => p.priority === 'high' && p.status !== 'done').length;
    const noDesc = pages.filter(p => !p.description).length;
    const withContent = pages.filter(p => p.content).length;
    const longTitle = pages.filter(p => p.title.length > 60).length;
    return { total, done, inProgress, pending, highPriority, noDesc, withContent, longTitle, progress: Math.round((done / total) * 100) };
  }, [pages]);

  // Фильтрация
  const filteredPages = useMemo(() => {
    return pages.filter(page => {
      const matchesSearch = page.oldUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           page.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || page.category === categoryFilter;
      const matchesPriority = priorityFilter === 'all' || page.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
    });
  }, [pages, searchQuery, statusFilter, categoryFilter, priorityFilter]);

  // Редиректы
  const redirects = useMemo(() => {
    return pages.filter(p => p.oldUrl !== p.newUrl);
  }, [pages]);

  // Уникальные категории
  const categories = useMemo(() => {
    return [...new Set(pages.map(p => p.category))];
  }, [pages]);

  // Экспорт CSV
  const exportCSV = () => {
    const headers = ['Old URL', 'New URL', 'Category', 'Title', 'Description', 'H1', 'Status', 'Priority'];
    const rows = pages.map(p => [p.oldUrl, p.newUrl, p.category, p.title, p.description, p.h1, p.status, p.priority]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seo-pages.csv';
    a.click();
  };

  // Генерация Next.js redirects
  const generateNextConfig = () => {
    const redirectsConfig = pages
      .filter(p => p.oldUrl !== p.newUrl)
      .map(p => ({ source: p.oldUrl.replace(/\/$/, '') || '/', destination: p.newUrl || '/', permanent: true }));
    const config = `async redirects() {\n  return ${JSON.stringify(redirectsConfig, null, 2)};\n}`;
    navigator.clipboard.writeText(config);
    alert('Скопировано в буфер обмена!');
  };

  return (
    <div className="space-y-6">
      {/* Статистика */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="text-3xl font-black text-slate-900">{stats.total}</div>
          <div className="text-slate-500 text-sm">Всего страниц</div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-green-500">
          <div className="text-3xl font-black text-green-600">{stats.done}</div>
          <div className="text-slate-500 text-sm">Готово</div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-blue-500">
          <div className="text-3xl font-black text-blue-600">{stats.inProgress}</div>
          <div className="text-slate-500 text-sm">В работе</div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-slate-300">
          <div className="text-3xl font-black text-slate-600">{stats.pending}</div>
          <div className="text-slate-500 text-sm">Ожидает</div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-red-500">
          <div className="text-3xl font-black text-red-600">{stats.highPriority}</div>
          <div className="text-slate-500 text-sm">Высокий приоритет</div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-purple-500">
          <div className="text-3xl font-black text-purple-600">{stats.withContent}</div>
          <div className="text-slate-500 text-sm">С контентом</div>
        </div>
      </div>

      {/* Прогресс + кнопки экспорта */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
          <div className="flex-1 min-w-[200px]">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-slate-700">Прогресс миграции</span>
              <span className="font-bold text-blue-600">{stats.progress}%</span>
            </div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all"
                style={{ width: `${stats.progress}%` }}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportCSV}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              CSV
            </button>
            <button
              onClick={generateNextConfig}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Скопировать Redirects
            </button>
          </div>
        </div>
      </div>

      {/* Под-вкладки */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200">
          {[
            { id: 'pages' as MigrationSubTab, label: 'Страницы', count: stats.total },
            { id: 'redirects' as MigrationSubTab, label: 'Редиректы', count: redirects.length },
            { id: 'cities' as MigrationSubTab, label: 'Города', count: cities.length },
            { id: 'analytics' as MigrationSubTab, label: 'Аналитика' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              className={`px-6 py-4 font-medium text-sm transition-colors ${
                subTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={`ml-2 px-2 py-0.5 rounded text-xs ${
                  subTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* СТРАНИЦЫ */}
        {subTab === 'pages' && (
          <div>
            {/* Фильтры */}
            <div className="p-4 border-b border-slate-200">
              <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-3">
                <div className="lg:col-span-2">
                  <input
                    type="text"
                    placeholder="Поиск по URL или title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm"
                >
                  <option value="all">Все статусы</option>
                  <option value="pending">Ожидает</option>
                  <option value="in_progress">В работе</option>
                  <option value="done">Готово</option>
                </select>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm"
                >
                  <option value="all">Все категории</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{categoryNames[cat] || cat}</option>
                  ))}
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm"
                >
                  <option value="all">Все приоритеты</option>
                  <option value="high">Высокий</option>
                  <option value="medium">Средний</option>
                  <option value="low">Низкий</option>
                </select>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-sm"
                >
                  <option value="">Город: {cities.find(c => c.isMain)?.name || 'Казань'}</option>
                  {cities.filter(c => !c.isMain).map(c => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Таблица */}
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 sticky top-0">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700 w-8"></th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">URL</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Title / Description</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700 w-28">Категория</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700 w-28">Статус</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700 w-24">Приоритет</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPages.slice(0, 100).map((page) => {
                    const isExpanded = expandedRow === page.oldUrl;
                    return (
                      <React.Fragment key={page.oldUrl}>
                        <tr
                          className={`border-b border-slate-100 hover:bg-slate-50 cursor-pointer ${isExpanded ? 'bg-blue-50' : ''}`}
                          onClick={() => setExpandedRow(isExpanded ? null : page.oldUrl)}
                        >
                          <td className="px-4 py-3">
                            <span className={`transform transition-transform inline-block ${isExpanded ? 'rotate-180' : ''}`}>
                              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-mono text-xs text-slate-600">{page.oldUrl}</div>
                            {page.oldUrl !== page.newUrl && (
                              <div className="font-mono text-xs text-blue-600 mt-0.5">→ {page.newUrl}</div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-slate-900 truncate max-w-md" title={replaceCity(page.title)}>
                              {replaceCity(page.title) || <span className="text-slate-400 italic">Нет title</span>}
                            </div>
                            <div className="text-slate-500 text-xs truncate max-w-md mt-0.5" title={replaceCity(page.description)}>
                              {replaceCity(page.description) || <span className="text-red-400 italic">Нет description</span>}
                            </div>
                            {page.content && (
                              <div className="text-green-600 text-xs mt-0.5">
                                Контент: {page.content.length} симв.
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-600">
                            {categoryNames[page.category] || page.category}
                          </td>
                          <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={page.status}
                              onChange={(e) => updatePage(page.oldUrl, { status: e.target.value as OldPage['status'] })}
                              className={`text-xs px-2 py-1 rounded border-0 cursor-pointer ${
                                page.status === 'done' ? 'bg-green-100 text-green-700' :
                                page.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                'bg-amber-100 text-amber-700'
                              }`}
                            >
                              <option value="pending">Ожидает</option>
                              <option value="in_progress">В работе</option>
                              <option value="done">Готово</option>
                            </select>
                          </td>
                          <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={page.priority}
                              onChange={(e) => updatePage(page.oldUrl, { priority: e.target.value as OldPage['priority'] })}
                              className={`text-xs px-2 py-1 rounded border-0 cursor-pointer ${
                                page.priority === 'high' ? 'bg-red-100 text-red-700' :
                                page.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                                'bg-slate-100 text-slate-600'
                              }`}
                            >
                              <option value="high">Высокий</option>
                              <option value="medium">Средний</option>
                              <option value="low">Низкий</option>
                            </select>
                          </td>
                        </tr>
                        {/* Раскрытая строка для редактирования */}
                        {isExpanded && (
                          <tr className="bg-slate-50">
                            <td colSpan={6} className="px-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-medium text-slate-500 mb-1">
                                    Title <span className="text-slate-400">({page.title.length}/60)</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={page.title}
                                    onChange={(e) => updatePage(page.oldUrl, { title: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded text-sm ${page.title.length > 60 ? 'border-orange-300 bg-orange-50' : 'border-slate-200'}`}
                                    placeholder="Title страницы"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-slate-500 mb-1">H1</label>
                                  <input
                                    type="text"
                                    value={page.h1}
                                    onChange={(e) => updatePage(page.oldUrl, { h1: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded text-sm"
                                    placeholder="H1 заголовок"
                                  />
                                </div>
                                <div className="col-span-2">
                                  <label className="block text-xs font-medium text-slate-500 mb-1">
                                    Description <span className="text-slate-400">({page.description.length}/160)</span>
                                  </label>
                                  <textarea
                                    value={page.description}
                                    onChange={(e) => updatePage(page.oldUrl, { description: e.target.value })}
                                    rows={2}
                                    className={`w-full px-3 py-2 border rounded text-sm resize-none ${page.description.length > 160 ? 'border-orange-300 bg-orange-50' : 'border-slate-200'}`}
                                    placeholder="Meta description"
                                  />
                                </div>
                                {page.content && (
                                  <div className="col-span-2">
                                    <label className="block text-xs font-medium text-slate-500 mb-1">
                                      Контент страницы <span className="text-slate-400">({page.content.length} символов)</span>
                                    </label>
                                    <div
                                      className="w-full px-3 py-2 border border-slate-200 rounded text-sm bg-white max-h-64 overflow-y-auto prose prose-sm prose-slate"
                                      dangerouslySetInnerHTML={{ __html: page.content }}
                                    />
                                  </div>
                                )}
                                <div>
                                  <label className="block text-xs font-medium text-slate-500 mb-1">Новый URL</label>
                                  <input
                                    type="text"
                                    value={page.newUrl}
                                    onChange={(e) => updatePage(page.oldUrl, { newUrl: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded text-sm font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-slate-500 mb-1">Категория</label>
                                  <select
                                    value={page.category}
                                    onChange={(e) => updatePage(page.oldUrl, { category: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded text-sm"
                                  >
                                    {Object.entries(categoryNames).map(([id, name]) => (
                                      <option key={id} value={id}>{name}</option>
                                    ))}
                                  </select>
                                </div>
                                {/* Google Preview */}
                                <div className="col-span-2 mt-2 p-4 bg-white rounded border">
                                  <div className="text-xs text-slate-500 mb-2">Превью в Google:</div>
                                  <div className="text-blue-700 text-lg hover:underline cursor-pointer">
                                    {replaceCity(page.title) || 'Title не задан'}
                                  </div>
                                  <div className="text-green-700 text-sm">gsg-rt.ru{page.newUrl}</div>
                                  <div className="text-slate-600 text-sm mt-1 line-clamp-2">
                                    {replaceCity(page.description) || 'Description не задан'}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredPages.length > 100 && (
              <div className="p-4 border-t border-slate-200 text-center text-slate-500 text-sm">
                Показаны первые 100 из {filteredPages.length}. Используй фильтры для поиска.
              </div>
            )}
          </div>
        )}

        {/* РЕДИРЕКТЫ */}
        {subTab === 'redirects' && (
          <div>
            <div className="p-4 border-b border-slate-200">
              <p className="text-sm text-slate-600">
                Всего редиректов: <span className="font-semibold">{redirects.length}</span>
                <span className="text-slate-400 ml-4">Нажми &quot;Скопировать Redirects&quot; для Next.js конфига</span>
              </p>
            </div>
            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 sticky top-0">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Source (старый URL)</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Destination (новый URL)</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700 w-24">Тип</th>
                  </tr>
                </thead>
                <tbody>
                  {redirects.map((page, idx) => (
                    <tr key={idx} className="border-b border-slate-100">
                      <td className="px-4 py-3 font-mono text-xs text-red-600">{page.oldUrl}</td>
                      <td className="px-4 py-3 font-mono text-xs text-green-600">{page.newUrl}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">301</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ГОРОДА */}
        {subTab === 'cities' && (
          <div className="p-6">
            <p className="text-sm text-slate-600 mb-4">
              Переменные <code className="bg-slate-100 px-1 rounded">{'{city}'}</code> и <code className="bg-slate-100 px-1 rounded">{'{prepositional}'}</code> заменяются в title и description
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {cities.map((c, idx) => (
                <div key={idx} className={`p-3 rounded-lg border text-sm ${c.isMain ? 'border-blue-300 bg-blue-50' : 'border-slate-200'}`}>
                  <div className="font-medium text-slate-900">{c.name}</div>
                  <div className="text-slate-500 text-xs">{c.prepositional}</div>
                  {c.isMain && <div className="text-blue-600 text-xs mt-1">Основной</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* АНАЛИТИКА */}
        {subTab === 'analytics' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* По категориям */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="font-bold text-slate-900 mb-3">По категориям</h3>
                <div className="space-y-2">
                  {Object.entries(categoryNames).map(([id, name]) => {
                    const count = pages.filter(p => p.category === id).length;
                    const done = pages.filter(p => p.category === id && p.status === 'done').length;
                    if (count === 0) return null;
                    return (
                      <div key={id} className="flex justify-between items-center text-sm">
                        <span className="text-slate-600">{name}</span>
                        <span className="font-medium">
                          <span className="text-green-600">{done}</span>
                          <span className="text-slate-400">/{count}</span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* По статусу */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="font-bold text-slate-900 mb-3">По статусу</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-green-600">Готово</span>
                    <span className="font-medium">{stats.done}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-blue-600">В работе</span>
                    <span className="font-medium">{stats.inProgress}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-amber-600">Ожидает</span>
                    <span className="font-medium">{stats.pending}</span>
                  </div>
                </div>
              </div>

              {/* Требуют внимания */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="font-bold text-slate-900 mb-3">Требуют внимания</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-red-600">Без description</span>
                    <span className="font-medium">{stats.noDesc}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-600">Высокий приоритет</span>
                    <span className="font-medium">{stats.highPriority}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-orange-600">Длинный title (&gt;60)</span>
                    <span className="font-medium">{stats.longTitle}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Инструкция */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <h3 className="font-bold text-amber-800 mb-2">Как работать с миграцией:</h3>
        <ol className="text-amber-700 text-sm space-y-2 list-decimal list-inside">
          <li>Данные хранятся в <code className="bg-amber-100 px-1 rounded">src/data/seo-pages.json</code></li>
          <li>Кликни на строку чтобы редактировать title, description, h1</li>
          <li>Меняй статус/приоритет прямо в таблице</li>
          <li>Используй &quot;Скопировать Redirects&quot; для настройки 301 редиректов в Next.js</li>
          <li>Экспортируй CSV для работы в Google Sheets</li>
        </ol>
      </div>
    </div>
  );
}
