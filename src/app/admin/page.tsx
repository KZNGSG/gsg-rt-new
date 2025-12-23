'use client';

import { useState } from 'react';
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

type Tab = 'overview' | 'content' | 'prices' | 'help';

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

  const tabs = [
    { id: 'overview' as Tab, label: 'Обзор', icon: '📊' },
    { id: 'content' as Tab, label: 'Контент', icon: '📝' },
    { id: 'prices' as Tab, label: 'Цены', icon: '💰' },
    { id: 'help' as Tab, label: 'Как редактировать', icon: '❓' },
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
