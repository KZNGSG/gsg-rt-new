import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getTRTSContent,
  calculateProductPrice,
  GLOBAL_PRICING,
  ALL_TRTS_CONTENT,
  type ImportCountry,
} from '@/data/tr-ts-content';
import { getRegulationBySlug } from '@/data/tr-ts-database';

interface PageProps {
  params: Promise<{ slug: string; country: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, country: countrySlug } = await params;

  const regulation = getRegulationBySlug(slug);
  if (!regulation) {
    return { title: 'Страница не найдена' };
  }

  // Ищем контент
  let trtsContent = getTRTSContent(slug);
  if (!trtsContent) {
    trtsContent = Object.values(ALL_TRTS_CONTENT).find(
      t => t.id === regulation.id || t.slug === slug
    );
  }

  const importData = trtsContent?.imports.find(i => i.slug === countrySlug);

  if (!importData) {
    return { title: 'Страница не найдена' };
  }

  return {
    title: importData.seo.title,
    description: importData.seo.description,
    openGraph: {
      title: importData.seo.title,
      description: importData.seo.description,
      type: 'website',
    },
  };
}

export async function generateStaticParams() {
  const params: Array<{ slug: string; country: string }> = [];

  for (const [trtsSlug, data] of Object.entries(ALL_TRTS_CONTENT)) {
    for (const imp of data.imports) {
      params.push({ slug: trtsSlug, country: imp.slug });
    }
  }

  return params;
}

// JSON-LD
function generateJsonLd(
  importData: NonNullable<ReturnType<typeof getTRTSContent>>['imports'][0],
  trtsNumber: string,
  price: { min: number; max: number },
  slug: string
) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: importData.seo.h1,
        description: importData.seo.description,
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
          },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Главная', item: 'https://gsg-rt-new.vercel.app' },
          { '@type': 'ListItem', position: 2, name: 'Сертификат ТР ТС', item: 'https://gsg-rt-new.vercel.app/sertifikat-tr-ts' },
          { '@type': 'ListItem', position: 3, name: trtsNumber, item: `https://gsg-rt-new.vercel.app/sertifikat-tr-ts/${slug}` },
          { '@type': 'ListItem', position: 4, name: `Импорт ${importData.nameFrom}`, item: `https://gsg-rt-new.vercel.app/sertifikat-tr-ts/${slug}/import/${importData.slug}` },
        ],
      },
    ],
  };
}

export default async function ImportPage({ params }: PageProps) {
  const { slug, country: countrySlug } = await params;

  const regulation = getRegulationBySlug(slug);
  if (!regulation || regulation.documentType !== 'certificate') {
    notFound();
  }

  let trtsContent = getTRTSContent(slug);
  if (!trtsContent) {
    trtsContent = Object.values(ALL_TRTS_CONTENT).find(
      t => t.id === regulation.id || t.slug === slug
    );
  }

  if (!trtsContent) {
    notFound();
  }

  const importData = trtsContent.imports.find(i => i.slug === countrySlug);
  if (!importData) {
    notFound();
  }

  // Расчёт цены с учётом надбавки за импорт
  const price = calculateProductPrice(trtsContent.slug, undefined, {
    type: 'batch',
    importCountry: importData.country as ImportCountry,
  });

  const jsonLd = generateJsonLd(importData, regulation.number, price, slug);

  // Популярные товары
  const topProducts = trtsContent.products
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
                <span className="text-white">Импорт {importData.nameFrom}</span>
              </nav>

              <div className="grid lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-block bg-white/10 backdrop-blur-sm text-blue-100 px-4 py-1.5 rounded-full text-sm font-medium">
                      {regulation.number}
                    </span>
                    <span className="inline-block bg-amber-500/20 backdrop-blur-sm text-amber-200 px-4 py-1.5 rounded-full text-sm font-medium">
                      Импорт {importData.nameFrom}
                    </span>
                  </div>

                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
                    {importData.seo.h1}
                  </h1>

                  <p className="text-lg text-blue-100 mb-8 max-w-2xl">
                    Оформляем сертификаты соответствия на продукцию {importData.nameFrom} по {regulation.number}.
                    Полное сопровождение: от контракта до выдачи сертификата.
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
                    {importData.surcharge > 0 && (
                      <div className="bg-amber-500/20 backdrop-blur-sm rounded-xl px-5 py-3">
                        <div className="text-amber-200 text-sm">Надбавка</div>
                        <div className="text-xl font-bold text-amber-100">
                          +{importData.surcharge.toLocaleString()} ₽
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Форма */}
                <div className="bg-white rounded-2xl p-6 shadow-2xl lg:sticky lg:top-24">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Сертификация импорта {importData.nameFrom}
                  </h3>
                  <p className="text-slate-500 text-sm mb-6">
                    Расчёт стоимости за 15 минут
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
                    <input
                      type="text"
                      placeholder="Что импортируете?"
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

        {/* Контент */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Особенности */}
              <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  Особенности сертификации товаров {importData.nameFrom}
                </h2>
                <ul className="space-y-3">
                  {importData.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Документы */}
              <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </span>
                  Документы для импорта {importData.nameFrom}
                </h2>
                <ul className="space-y-3">
                  {importData.additionalDocs.map((doc, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-700">{doc}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-blue-800 text-sm">
                    Не все документы есть? Мы поможем подготовить: составим контракт, оформим инвойс,
                    подготовим письмо на ввоз образцов.
                  </p>
                </div>
              </section>

              {/* Этапы */}
              <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  Как мы работаем с импортом {importData.nameFrom}
                </h2>
                <div className="space-y-4">
                  {[
                    'Консультация: определяем какой документ нужен',
                    'Проверяем документы от производителя',
                    'Помогаем организовать ввоз образцов',
                    'Проводим испытания в аккредитованной лаборатории',
                    'Регистрируем сертификат в реестре ФСА',
                    'Отправляем оригинал курьером',
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg shadow-blue-500/30">
                        {i + 1}
                      </div>
                      <div className="pt-2 text-slate-700">{step}</div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Сайдбар */}
            <div className="space-y-6">
              {/* Другие страны */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Импорт из других стран
                </h3>
                <ul className="space-y-2">
                  {trtsContent.imports
                    .filter(i => i.slug !== countrySlug)
                    .map(imp => (
                      <li key={imp.slug}>
                        <Link
                          href={`/sertifikat-tr-ts/${slug}/import/${imp.slug}`}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors group"
                        >
                          <span className="text-slate-700 group-hover:text-blue-600">{imp.name}</span>
                          {imp.surcharge > 0 && (
                            <span className="text-xs text-amber-600">+{imp.surcharge.toLocaleString()} ₽</span>
                          )}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Популярные товары */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Популярные товары {importData.nameFrom}
                </h3>
                <ul className="space-y-2">
                  {topProducts.map(p => (
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

              {/* Маркетплейсы */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Для маркетплейсов
                </h3>
                <p className="text-slate-600 text-sm mb-4">
                  Сертифицируем товары {importData.nameFrom} для продажи на WB и Ozon
                </p>
                <div className="flex gap-2">
                  {trtsContent.salesChannels.slice(0, 2).map(ch => (
                    <Link
                      key={ch.slug}
                      href={`/sertifikat-tr-ts/${slug}/prodazha/${ch.slug}`}
                      className="flex-1 text-center bg-white px-4 py-2 rounded-lg text-purple-700 font-medium hover:bg-purple-100 transition-colors"
                    >
                      {ch.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Импортируете товары {importData.nameFrom}?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Поможем оформить сертификат {regulation.number}. Цена от {price.min.toLocaleString()} ₽
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
