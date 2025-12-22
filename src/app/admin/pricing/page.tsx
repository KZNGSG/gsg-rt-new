'use client';

import { useState } from 'react';
import Link from 'next/link';
import { GLOBAL_PRICING, ALL_TRTS_CONTENT } from '@/data/tr-ts-content';

export default function AdminPricingPage() {
  const [activeTab, setActiveTab] = useState<'global' | 'trts' | 'preview'>('global');

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Управление ценами</h1>
              <p className="text-slate-500 text-sm">
                Последнее обновление: {GLOBAL_PRICING.lastUpdated}
              </p>
            </div>
            <Link href="/admin" className="text-blue-600 hover:text-blue-700">
              ← Назад в админку
            </Link>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            {[
              { id: 'global', label: 'Глобальные цены' },
              { id: 'trts', label: 'По ТР ТС' },
              { id: 'preview', label: 'Предпросмотр' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'global' && <GlobalPricingTab />}
        {activeTab === 'trts' && <TRTSPricingTab />}
        {activeTab === 'preview' && <PreviewTab />}
      </div>

      {/* Инструкция */}
      <div className="container mx-auto px-4 pb-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h3 className="font-bold text-amber-800 mb-2">Как редактировать цены:</h3>
          <ol className="text-amber-700 text-sm space-y-2 list-decimal list-inside">
            <li>
              Открой файл <code className="bg-amber-100 px-1 rounded">src/data/tr-ts-content.ts</code>
            </li>
            <li>
              Найди секцию <code className="bg-amber-100 px-1 rounded">GLOBAL_PRICING</code> для базовых цен
            </li>
            <li>
              Измени нужные значения (min, max, days)
            </li>
            <li>
              Для конкретного ТР ТС — измени <code className="bg-amber-100 px-1 rounded">priceMultiplier</code>
            </li>
            <li>
              Сделай коммит и пуш — цены обновятся на сайте
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Вкладка глобальных цен
// =============================================================================

function GlobalPricingTab() {
  return (
    <div className="space-y-8">
      {/* Базовые цены */}
      <section className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Базовые цены</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Сертификаты */}
          <div>
            <h3 className="font-bold text-emerald-600 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
              Сертификаты ТР ТС
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="pb-2">Тип</th>
                  <th className="pb-2">Мин.</th>
                  <th className="pb-2">Макс.</th>
                  <th className="pb-2">Срок</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="border-t border-slate-100">
                  <td className="py-2">Серийное</td>
                  <td className="py-2 font-medium">{GLOBAL_PRICING.base.certificate.serial.min.toLocaleString()} ₽</td>
                  <td className="py-2">{GLOBAL_PRICING.base.certificate.serial.max.toLocaleString()} ₽</td>
                  <td className="py-2">{GLOBAL_PRICING.base.certificate.serial.days} дн.</td>
                </tr>
                <tr className="border-t border-slate-100">
                  <td className="py-2">Партия</td>
                  <td className="py-2 font-medium">{GLOBAL_PRICING.base.certificate.batch.min.toLocaleString()} ₽</td>
                  <td className="py-2">{GLOBAL_PRICING.base.certificate.batch.max.toLocaleString()} ₽</td>
                  <td className="py-2">{GLOBAL_PRICING.base.certificate.batch.days} дн.</td>
                </tr>
                <tr className="border-t border-slate-100">
                  <td className="py-2">Срочное</td>
                  <td className="py-2 font-medium">{GLOBAL_PRICING.base.certificate.urgent.min.toLocaleString()} ₽</td>
                  <td className="py-2">{GLOBAL_PRICING.base.certificate.urgent.max.toLocaleString()} ₽</td>
                  <td className="py-2">{GLOBAL_PRICING.base.certificate.urgent.days} дн.</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Декларации */}
          <div>
            <h3 className="font-bold text-blue-600 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              Декларации ТР ТС
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="pb-2">Тип</th>
                  <th className="pb-2">Мин.</th>
                  <th className="pb-2">Макс.</th>
                  <th className="pb-2">Срок</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                <tr className="border-t border-slate-100">
                  <td className="py-2">Серийное</td>
                  <td className="py-2 font-medium">{GLOBAL_PRICING.base.declaration.serial.min.toLocaleString()} ₽</td>
                  <td className="py-2">{GLOBAL_PRICING.base.declaration.serial.max.toLocaleString()} ₽</td>
                  <td className="py-2">{GLOBAL_PRICING.base.declaration.serial.days} дн.</td>
                </tr>
                <tr className="border-t border-slate-100">
                  <td className="py-2">Партия</td>
                  <td className="py-2 font-medium">{GLOBAL_PRICING.base.declaration.batch.min.toLocaleString()} ₽</td>
                  <td className="py-2">{GLOBAL_PRICING.base.declaration.batch.max.toLocaleString()} ₽</td>
                  <td className="py-2">{GLOBAL_PRICING.base.declaration.batch.days} дн.</td>
                </tr>
                <tr className="border-t border-slate-100">
                  <td className="py-2">Срочное</td>
                  <td className="py-2 font-medium">{GLOBAL_PRICING.base.declaration.urgent.min.toLocaleString()} ₽</td>
                  <td className="py-2">{GLOBAL_PRICING.base.declaration.urgent.max.toLocaleString()} ₽</td>
                  <td className="py-2">{GLOBAL_PRICING.base.declaration.urgent.days} дн.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Надбавки */}
      <section className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Надбавки и скидки</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Импорт */}
          <div>
            <h3 className="font-medium text-slate-700 mb-3">По стране импорта</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Китай</span>
                <span className="font-medium text-green-600">+0 ₽</span>
              </li>
              <li className="flex justify-between">
                <span>Турция</span>
                <span className="font-medium text-amber-600">+{GLOBAL_PRICING.importSurcharge.turkey.toLocaleString()} ₽</span>
              </li>
              <li className="flex justify-between">
                <span>Европа</span>
                <span className="font-medium text-amber-600">+{GLOBAL_PRICING.importSurcharge.europe.toLocaleString()} ₽</span>
              </li>
              <li className="flex justify-between">
                <span>США</span>
                <span className="font-medium text-red-600">+{GLOBAL_PRICING.importSurcharge.usa.toLocaleString()} ₽</span>
              </li>
            </ul>
          </div>

          {/* Каналы */}
          <div>
            <h3 className="font-medium text-slate-700 mb-3">По каналу продаж</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Wildberries</span>
                <span className="font-medium text-green-600">+0 ₽</span>
              </li>
              <li className="flex justify-between">
                <span>Ozon</span>
                <span className="font-medium text-green-600">+0 ₽</span>
              </li>
              <li className="flex justify-between">
                <span>Опт</span>
                <span className="font-medium text-green-600">{GLOBAL_PRICING.channelSurcharge.wholesale.toLocaleString()} ₽</span>
              </li>
              <li className="flex justify-between">
                <span>Экспорт</span>
                <span className="font-medium text-red-600">+{GLOBAL_PRICING.channelSurcharge.export.toLocaleString()} ₽</span>
              </li>
            </ul>
          </div>

          {/* Скидки за объём */}
          <div>
            <h3 className="font-medium text-slate-700 mb-3">Скидки за объём (SKU)</h3>
            <ul className="space-y-2 text-sm">
              {Object.entries(GLOBAL_PRICING.volumeDiscount).map(([range, discount]) => (
                <li key={range} className="flex justify-between">
                  <span>{range}</span>
                  <span className={`font-medium ${discount > 0 ? 'text-green-600' : 'text-slate-500'}`}>
                    {discount > 0 ? `-${(discount * 100).toFixed(0)}%` : '0%'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

// =============================================================================
// Вкладка по ТР ТС
// =============================================================================

function TRTSPricingTab() {
  return (
    <div className="space-y-6">
      {Object.entries(ALL_TRTS_CONTENT).map(([slug, data]) => (
        <div key={slug} className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{data.number}</h3>
              <p className="text-slate-500">{data.name}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500">Множитель</div>
              <div className={`text-2xl font-bold ${
                data.priceMultiplier > 1 ? 'text-amber-600' :
                data.priceMultiplier < 1 ? 'text-green-600' : 'text-slate-700'
              }`}>
                ×{data.priceMultiplier}
              </div>
            </div>
          </div>

          {/* Товары */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-slate-500 mb-2">Товары ({data.products.length})</h4>
            <div className="flex flex-wrap gap-2">
              {data.products.map((product) => (
                <span
                  key={product.slug}
                  className={`px-3 py-1 rounded-full text-sm ${
                    product.priceMultiplier > 1
                      ? 'bg-amber-100 text-amber-700'
                      : product.priceMultiplier < 1
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {product.name}
                  {product.priceMultiplier !== 1 && (
                    <span className="ml-1 opacity-75">×{product.priceMultiplier}</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}

      {Object.keys(ALL_TRTS_CONTENT).length === 0 && (
        <div className="bg-slate-50 rounded-xl p-12 text-center">
          <p className="text-slate-500">Нет данных. Добавьте ТР ТС в tr-ts-content.ts</p>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Вкладка предпросмотра
// =============================================================================

function PreviewTab() {
  const [selectedTRTS, setSelectedTRTS] = useState(Object.keys(ALL_TRTS_CONTENT)[0] || '');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [priceType, setPriceType] = useState<'batch' | 'serial' | 'urgent'>('batch');
  const [importCountry, setImportCountry] = useState('');

  const trts = selectedTRTS ? ALL_TRTS_CONTENT[selectedTRTS] : null;
  const product = trts?.products.find(p => p.slug === selectedProduct);

  // Расчёт цены
  let price = { min: 0, max: 0, days: '' };
  if (trts) {
    const base = GLOBAL_PRICING.base[trts.docType][priceType];
    let min = base.min * trts.priceMultiplier;
    let max = base.max * trts.priceMultiplier;

    if (product) {
      min *= product.priceMultiplier;
      max *= product.priceMultiplier;
    }

    if (importCountry && GLOBAL_PRICING.importSurcharge[importCountry as keyof typeof GLOBAL_PRICING.importSurcharge]) {
      const surcharge = GLOBAL_PRICING.importSurcharge[importCountry as keyof typeof GLOBAL_PRICING.importSurcharge];
      min += surcharge;
      max += surcharge;
    }

    price = {
      min: Math.round(min / 1000) * 1000,
      max: Math.round(max / 1000) * 1000,
      days: base.days,
    };
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Калькулятор цен</h2>

        <div className="space-y-4">
          {/* ТР ТС */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">ТР ТС</label>
            <select
              value={selectedTRTS}
              onChange={(e) => {
                setSelectedTRTS(e.target.value);
                setSelectedProduct('');
              }}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Выберите...</option>
              {Object.entries(ALL_TRTS_CONTENT).map(([slug, data]) => (
                <option key={slug} value={slug}>{data.number} — {data.shortName}</option>
              ))}
            </select>
          </div>

          {/* Товар */}
          {trts && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Товар</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="">Любой товар</option>
                {trts.products.map((p) => (
                  <option key={p.slug} value={p.slug}>{p.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Тип */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Тип оформления</label>
            <div className="flex gap-2">
              {(['batch', 'serial', 'urgent'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setPriceType(type)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                    priceType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {type === 'batch' ? 'Партия' : type === 'serial' ? 'Серийное' : 'Срочное'}
                </button>
              ))}
            </div>
          </div>

          {/* Импорт */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Страна импорта</label>
            <select
              value={importCountry}
              onChange={(e) => setImportCountry(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Россия (своё производство)</option>
              <option value="china">Китай</option>
              <option value="turkey">Турция</option>
              <option value="europe">Европа</option>
              <option value="usa">США</option>
            </select>
          </div>
        </div>

        {/* Результат */}
        {trts && (
          <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
            <div className="text-center">
              <div className="text-slate-500 mb-2">Итоговая цена</div>
              <div className="text-4xl font-black text-slate-900">
                от {price.min.toLocaleString()} ₽
              </div>
              <div className="text-slate-500 mt-1">
                до {price.max.toLocaleString()} ₽
              </div>
              <div className="mt-4 text-blue-600 font-medium">
                Срок: {price.days} дней
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
