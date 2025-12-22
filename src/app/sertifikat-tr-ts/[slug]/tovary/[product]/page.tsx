import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getTRTSContent,
  getProduct,
  calculateProductPrice,
  getAllProductSlugs,
  GLOBAL_PRICING,
  ALL_TRTS_CONTENT,
  type TRTSFullData,
} from '@/data/tr-ts-content';
import { getRegulationBySlug } from '@/data/tr-ts-database';

interface PageProps {
  params: Promise<{ slug: string; product: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, product: productSlug } = await params;

  // Найдём ТР ТС по slug из database (для совместимости)
  const regulation = getRegulationBySlug(slug);
  if (!regulation) {
    return { title: 'Товар не найден' };
  }

  // Найдём контент ТР ТС
  let trtsContent: TRTSFullData | undefined = getTRTSContent(slug);
  if (!trtsContent) {
    trtsContent = Object.values(ALL_TRTS_CONTENT).find(
      t => t.id === regulation.id
    );
  }

  if (!trtsContent) {
    return { title: 'Товар не найден' };
  }

  const product = trtsContent.products.find(
    p => p.slug === productSlug
  );

  if (!product) {
    return { title: 'Товар не найден' };
  }

  return {
    title: product.seo.title,
    description: product.seo.description,
    openGraph: {
      title: product.seo.title,
      description: product.seo.description,
      type: 'website',
    },
  };
}

export async function generateStaticParams() {
  const params: Array<{ slug: string; product: string }> = [];

  const allProducts = getAllProductSlugs();

  // Также нужно мапить из tr-ts-content slug в tr-ts-database slug
  for (const { trts, product } of allProducts) {
    // trts в формате "008-igrushki", нужно найти соответствующий slug
    params.push({ slug: trts, product });
  }

  return params;
}

// JSON-LD разметка
function generateJsonLd(
  product: NonNullable<ReturnType<typeof getProduct>>,
  trtsNumber: string,
  price: { min: number; max: number; days: string },
  slug: string
) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: `Сертификат на ${product.namePlural}`,
        description: product.seo.description,
        provider: {
          '@type': 'Organization',
          name: 'ГОСТСЕРТГРУПП',
          url: 'https://gsg-rt-new.vercel.app',
        },
        offers: {
          '@type': 'Offer',
          priceSpecification: {
            '@type': 'PriceSpecification',
            price: price.min,
            priceCurrency: 'RUB',
            minPrice: price.min,
            maxPrice: price.max,
          },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://gsg-rt-new.vercel.app' },
          { '@type': 'ListItem', position: 2, name: 'Сертификат ТР ТС', item: 'https://gsg-rt-new.vercel.app/sertifikat-tr-ts' },
          { '@type': 'ListItem', position: 3, name: trtsNumber, item: `https://gsg-rt-new.vercel.app/sertifikat-tr-ts/${slug}` },
          { '@type': 'ListItem', position: 4, name: product.name, item: `https://gsg-rt-new.vercel.app/sertifikat-tr-ts/${slug}/tovary/${product.slug}` },
        ],
      },
    ],
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug, product: productSlug } = await params;

  // Найдём ТР ТС
  const regulation = getRegulationBySlug(slug);
  if (!regulation || regulation.documentType !== 'certificate') {
    notFound();
  }

  // Пробуем разные варианты поиска контента
  let trtsContent: TRTSFullData | undefined = getTRTSContent(slug);
  if (!trtsContent) {
    // Попробуем найти по ID
    trtsContent = Object.values(ALL_TRTS_CONTENT).find(
      t => t.id === regulation.id || t.slug === slug
    );
  }

  // Если контента нет - 404
  if (!trtsContent) {
    notFound();
  }

  const product = trtsContent.products.find(p => p.slug === productSlug);

  if (!product) {
    notFound();
  }

  // Расчёт цены
  const price = calculateProductPrice(trtsContent.slug, productSlug, { type: 'batch' });
  const priceSerial = calculateProductPrice(trtsContent.slug, productSlug, { type: 'serial' });
  const priceUrgent = calculateProductPrice(trtsContent.slug, productSlug, { type: 'urgent' });

  const jsonLd = generateJsonLd(product, regulation.number, price, slug);

  // Другие товары этого ТР ТС
  const otherProducts = trtsContent.products
    .filter(p => p.slug !== productSlug)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 6);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-slate-50">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-mesh-blue"></div>
          <div className="absolute inset-0 bg-dots opacity-30"></div>
          <div className="relative py-12 md:py-16">
            <div className="container mx-auto px-4">
              {/* Хлебные крошки */}
              <nav className="text-sm mb-6 text-blue-200">
                <Link href="/" className="hover:text-white transition-colors">Главная</Link>
                <span className="mx-2">/</span>
                <Link href="/sertifikat-tr-ts" className="hover:text-white transition-colors">Сертификат ТР ТС</Link>
                <span className="mx-2">/</span>
                <Link href={`/sertifikat-tr-ts/${slug}`} className="hover:text-white transition-colors">
                  {regulation.shortName}
                </Link>
                <span className="mx-2">/</span>
                <span className="text-white">{product.name}</span>
              </nav>

              <div className="grid lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                  <div className="inline-block bg-white/10 backdrop-blur-sm text-blue-100 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                    {regulation.number}
                  </div>

                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
                    {product.seo.h1}
                  </h1>

                  <p className="text-lg text-blue-100 mb-8 max-w-2xl">
                    Оформляем сертификаты соответствия на {product.namePlural} по {regulation.number}.
                    Для продажи на Wildberries, Ozon, в розничных магазинах.
                  </p>

                  {/* Ключевые показатели */}
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3">
                      <div className="text-blue-200 text-sm">Цена от</div>
                      <div className="text-xl font-bold text-white">
                        {price.min.toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3">
                      <div className="text-blue-200 text-sm">Срок</div>
                      <div className="text-xl font-bold text-white">
                        {price.days}
                      </div>
                    </div>
                    {product.tnved && product.tnved.length > 0 && (
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3">
                        <div className="text-blue-200 text-sm">ТН ВЭД</div>
                        <div className="text-xl font-bold text-white">
                          {product.tnved[0]}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Форма */}
                <div className="bg-white rounded-2xl p-6 shadow-2xl lg:sticky lg:top-24">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Расчёт за 15 минут
                  </h3>
                  <p className="text-slate-500 text-sm mb-6">
                    Получите точную стоимость сертификата на {product.namePlural}
                  </p>

                  <form className="space-y-4">
                    <input
                      type="text"
                      placeholder="Ваше имя"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="tel"
                      placeholder="Телефон"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30"
                    >
                      Получить расчёт
                    </button>
                  </form>

                  <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                    <div className="text-slate-500 text-sm mb-1">Или позвоните</div>
                    <a href="tel:88005505288" className="text-xl font-bold text-blue-600 hover:text-blue-700">
                      8 800 550-52-88
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <svg viewBox="0 0 1440 60" fill="none" className="w-full">
            <path d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 32.5C840 35 960 40 1080 42.5C1200 45 1320 45 1380 45L1440 45V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0V60Z" fill="#f8fafc"/>
          </svg>
        </section>

        {/* Основной контент */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Особенности товара */}
              {product.features && product.features.length > 0 && (
                <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    Особенности сертификации {product.namePlural}
                  </h2>
                  <ul className="space-y-3">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Испытания */}
              {product.tests && product.tests.length > 0 && (
                <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </span>
                    Какие испытания проводятся
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {product.tests.map((test, i) => (
                      <span
                        key={i}
                        className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-medium"
                      >
                        {test}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-slate-600 text-sm">
                    Испытания проводятся в аккредитованных лабораториях. Протоколы испытаний включены в стоимость.
                  </p>
                </section>
              )}

              {/* Стоимость */}
              <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  Стоимость сертификата на {product.namePlural}
                </h2>

                <div className="grid md:grid-cols-3 gap-4">
                  {/* Партия */}
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-xl p-5 relative">
                    <div className="absolute -top-3 left-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Популярный
                    </div>
                    <div className="text-emerald-600 font-medium mb-2">На партию</div>
                    <div className="text-3xl font-black text-slate-900 mb-1">
                      от {price.min.toLocaleString('ru-RU')} ₽
                    </div>
                    <div className="text-slate-500 text-sm mb-3">
                      до {price.max.toLocaleString('ru-RU')} ₽
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {price.days}
                    </div>
                  </div>

                  {/* Серийное */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
                    <div className="text-blue-600 font-medium mb-2">Серийное</div>
                    <div className="text-3xl font-black text-slate-900 mb-1">
                      от {priceSerial.min.toLocaleString('ru-RU')} ₽
                    </div>
                    <div className="text-slate-500 text-sm mb-3">
                      до {priceSerial.max.toLocaleString('ru-RU')} ₽
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {priceSerial.days}
                    </div>
                  </div>

                  {/* Срочное */}
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-5">
                    <div className="text-orange-600 font-medium mb-2">Срочное</div>
                    <div className="text-3xl font-black text-slate-900 mb-1">
                      от {priceUrgent.min.toLocaleString('ru-RU')} ₽
                    </div>
                    <div className="text-slate-500 text-sm mb-3">
                      до {priceUrgent.max.toLocaleString('ru-RU')} ₽
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {priceUrgent.days}
                    </div>
                  </div>
                </div>

                <p className="mt-6 text-slate-500 text-sm">
                  Цены актуальны на {GLOBAL_PRICING.lastUpdated}. Точная стоимость зависит от количества
                  наименований и страны производства.
                </p>
              </section>

              {/* Коды ТН ВЭД */}
              {product.tnved && product.tnved.length > 0 && (
                <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </span>
                    Коды ТН ВЭД для {product.namePlural}
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {product.tnved.map((code, i) => (
                      <span
                        key={i}
                        className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-mono"
                      >
                        {code}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-slate-600 text-sm">
                    Коды ТН ВЭД используются для классификации товаров при импорте.
                    Уточните код у нашего специалиста для точного определения.
                  </p>
                </section>
              )}
            </div>

            {/* Сайдбар */}
            <div className="space-y-6">
              {/* Импорт */}
              {trtsContent.imports.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">
                    Сертификация импорта
                  </h3>
                  <ul className="space-y-2">
                    {trtsContent.imports.map(imp => (
                      <li key={imp.slug}>
                        <Link
                          href={`/sertifikat-tr-ts/${slug}/import/${imp.slug}`}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors group"
                        >
                          <span className="text-slate-700 group-hover:text-blue-600">
                            {product.name} {imp.nameFrom}
                          </span>
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Маркетплейсы */}
              {trtsContent.salesChannels.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">
                    Для маркетплейсов
                  </h3>
                  <ul className="space-y-2">
                    {trtsContent.salesChannels.slice(0, 3).map(ch => (
                      <li key={ch.slug}>
                        <Link
                          href={`/sertifikat-tr-ts/${slug}/prodazha/${ch.slug}`}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors group"
                        >
                          <span className="text-slate-700 group-hover:text-blue-600">
                            {product.name} для {ch.name}
                          </span>
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Другие товары */}
              {otherProducts.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">
                    Другие товары {regulation.number}
                  </h3>
                  <ul className="space-y-2">
                    {otherProducts.map(p => (
                      <li key={p.slug}>
                        <Link
                          href={`/sertifikat-tr-ts/${slug}/tovary/${p.slug}`}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors group"
                        >
                          <span className="text-slate-700 group-hover:text-blue-600">{p.name}</span>
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Нужен сертификат на {product.namePlural}?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Оформим за {price.days}. Цена от {price.min.toLocaleString('ru-RU')} ₽
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:from-orange-600 hover:to-orange-700 transition-all">
                Оставить заявку
              </button>
              <a
                href="tel:88005505288"
                className="bg-white/10 text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-white/20 transition-all"
              >
                8 800 550-52-88
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
