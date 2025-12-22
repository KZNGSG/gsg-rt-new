import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getRegulationBySlug,
  getAllCertificateSlugs,
  getCertificateRegulations,
  TRTSRegulation,
} from '@/data/tr-ts-database';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const regulation = getRegulationBySlug(slug);

  if (!regulation || regulation.documentType !== 'certificate') {
    return { title: 'Сертификат не найден' };
  }

  return {
    title: regulation.seo.title,
    description: regulation.seo.description,
    keywords: regulation.seo.keywords,
    openGraph: {
      title: regulation.seo.title,
      description: regulation.seo.description,
      type: 'website',
    },
  };
}

export async function generateStaticParams() {
  return getAllCertificateSlugs().map((slug) => ({ slug }));
}

// JSON-LD разметка для SEO
function generateJsonLd(regulation: TRTSRegulation) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      // Service schema
      {
        '@type': 'Service',
        name: `Сертификат ${regulation.number}`,
        description: regulation.seo.description,
        provider: {
          '@type': 'Organization',
          name: 'ГОСТСЕРТГРУПП',
          url: 'https://gsg-rt-new.vercel.app',
        },
        areaServed: {
          '@type': 'Country',
          name: 'Россия',
        },
        offers: {
          '@type': 'Offer',
          priceSpecification: {
            '@type': 'PriceSpecification',
            price: regulation.pricing.batch.price,
            priceCurrency: 'RUB',
            minPrice: regulation.pricing.batch.price,
          },
        },
      },
      // FAQ schema
      {
        '@type': 'FAQPage',
        mainEntity: regulation.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
      // Breadcrumb schema
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Главная',
            item: 'https://gsg-rt-new.vercel.app',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Сертификат ТР ТС',
            item: 'https://gsg-rt-new.vercel.app/sertifikat-tr-ts',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: regulation.shortName,
            item: `https://gsg-rt-new.vercel.app/sertifikat-tr-ts/${regulation.slug}`,
          },
        ],
      },
    ],
  };
}

export default async function CertificatePage({ params }: PageProps) {
  const { slug } = await params;
  const regulation = getRegulationBySlug(slug);

  // Проверяем что регламент существует и это сертификат
  if (!regulation || regulation.documentType !== 'certificate') {
    notFound();
  }

  // Получаем связанные регламенты
  const relatedRegulations = getCertificateRegulations()
    .filter((r) => r.id !== regulation.id)
    .slice(0, 3);

  const jsonLd = generateJsonLd(regulation);

  return (
    <>
      {/* JSON-LD разметка */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-slate-50">
        {/* Hero секция */}
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
                <span className="text-white">{regulation.shortName}</span>
              </nav>

              <div className="grid lg:grid-cols-3 gap-8 items-start">
                {/* Основная информация */}
                <div className="lg:col-span-2">
                  <div className="inline-block bg-white/10 backdrop-blur-sm text-blue-100 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                    {regulation.number}
                  </div>

                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
                    {regulation.seo.h1}
                  </h1>

                  <p className="text-lg text-blue-100 mb-8 max-w-2xl">
                    {regulation.content.intro}
                  </p>

                  {/* Ключевые показатели */}
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3">
                      <div className="text-blue-200 text-sm">Цена от</div>
                      <div className="text-xl font-bold text-white">
                        {regulation.pricing.batch.price.toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3">
                      <div className="text-blue-200 text-sm">Срок</div>
                      <div className="text-xl font-bold text-white">
                        {regulation.pricing.batch.days}
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3">
                      <div className="text-blue-200 text-sm">Действие</div>
                      <div className="text-xl font-bold text-white">
                        {regulation.validity.serial}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Форма заявки (sticky на десктопе) */}
                <div className="bg-white rounded-2xl p-6 shadow-2xl lg:sticky lg:top-24">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Получить расчёт бесплатно
                  </h3>
                  <p className="text-slate-500 text-sm mb-6">
                    Ответим за 15 минут в рабочее время
                  </p>

                  <form className="space-y-4">
                    <input
                      type="text"
                      placeholder="Ваше имя"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                    <input
                      type="tel"
                      placeholder="Телефон"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                    <input
                      type="text"
                      placeholder="Какую продукцию сертифицируете?"
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30"
                    >
                      Получить расчёт
                    </button>
                  </form>

                  <div className="mt-4 flex items-center justify-center gap-2 text-slate-500 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Данные защищены</span>
                  </div>

                  {/* Телефон */}
                  <div className="mt-6 pt-6 border-t border-slate-100 text-center">
                    <div className="text-slate-500 text-sm mb-1">Или позвоните</div>
                    <a href="tel:88005505288" className="text-xl font-bold text-blue-600 hover:text-blue-700">
                      8 800 550-52-88
                    </a>
                    <div className="text-slate-400 text-xs mt-1">Бесплатно по России</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Волна */}
          <svg viewBox="0 0 1440 60" fill="none" className="w-full">
            <path d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 32.5C840 35 960 40 1080 42.5C1200 45 1320 45 1380 45L1440 45V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0V60Z" fill="#f8fafc"/>
          </svg>
        </section>

        {/* Основной контент */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Левая колонка - контент */}
            <div className="lg:col-span-2 space-y-8">
              {/* Какие товары подлежат */}
              <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </span>
                  Какая продукция подлежит сертификации
                </h2>
                <ul className="grid md:grid-cols-2 gap-3">
                  {regulation.content.products.map((product, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-700">{product}</span>
                    </li>
                  ))}
                </ul>

                {/* Исключения */}
                {regulation.content.excluded && regulation.content.excluded.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      Не подлежит сертификации по данному ТР ТС:
                    </h3>
                    <ul className="space-y-2">
                      {regulation.content.excluded.map((item, index) => (
                        <li key={index} className="flex items-start gap-3 text-slate-600">
                          <span className="text-slate-400">—</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>

              {/* Стоимость */}
              <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  Стоимость сертификации
                </h2>

                <div className="grid md:grid-cols-3 gap-4">
                  {/* Серийное */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
                    <div className="text-blue-600 font-medium mb-2">Серийное производство</div>
                    <div className="text-3xl font-black text-slate-900 mb-1">
                      от {regulation.pricing.serial.price.toLocaleString('ru-RU')} ₽
                    </div>
                    <div className="text-slate-500 text-sm mb-3">
                      до {regulation.pricing.serial.priceMax.toLocaleString('ru-RU')} ₽
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {regulation.pricing.serial.days}
                    </div>
                    <div className="mt-3 text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded inline-block">
                      Действует {regulation.validity.serial}
                    </div>
                  </div>

                  {/* Партия */}
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-xl p-5 relative">
                    <div className="absolute -top-3 left-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Популярный
                    </div>
                    <div className="text-emerald-600 font-medium mb-2">На партию</div>
                    <div className="text-3xl font-black text-slate-900 mb-1">
                      от {regulation.pricing.batch.price.toLocaleString('ru-RU')} ₽
                    </div>
                    <div className="text-slate-500 text-sm mb-3">
                      до {regulation.pricing.batch.priceMax.toLocaleString('ru-RU')} ₽
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {regulation.pricing.batch.days}
                    </div>
                    <div className="mt-3 text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded inline-block">
                      Действует {regulation.validity.batch}
                    </div>
                  </div>

                  {/* Срочное */}
                  {regulation.pricing.urgent && (
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-5">
                      <div className="text-orange-600 font-medium mb-2">Срочное</div>
                      <div className="text-3xl font-black text-slate-900 mb-1">
                        от {regulation.pricing.urgent.price.toLocaleString('ru-RU')} ₽
                      </div>
                      <div className="text-slate-500 text-sm mb-3">
                        до {regulation.pricing.urgent.priceMax.toLocaleString('ru-RU')} ₽
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {regulation.pricing.urgent.days}
                      </div>
                    </div>
                  )}
                </div>

                <p className="mt-6 text-slate-500 text-sm">
                  * Точная стоимость зависит от количества наименований, наличия протоколов испытаний
                  и выбранной схемы сертификации. Получите точный расчёт за 15 минут.
                </p>
              </section>

              {/* Этапы оформления */}
              <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  Этапы оформления сертификата
                </h2>

                <div className="space-y-4">
                  {regulation.content.process.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg shadow-blue-500/30">
                        {index + 1}
                      </div>
                      <div className="pt-2 text-slate-700">{step}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Необходимые документы */}
              <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </span>
                  Необходимые документы
                </h2>

                <ul className="space-y-3">
                  {regulation.content.documents.map((doc, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-700">{doc}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-blue-800 text-sm">
                      Не все документы есть под рукой? Не проблема — мы поможем подготовить
                      недостающую документацию. Оставьте заявку для бесплатной консультации.
                    </p>
                  </div>
                </div>
              </section>

              {/* Схемы сертификации */}
              <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center text-cyan-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  </span>
                  Схемы сертификации
                </h2>

                <div className="flex flex-wrap gap-3">
                  {regulation.schemes.map((scheme, index) => (
                    <div
                      key={index}
                      className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium"
                    >
                      Схема {scheme}
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-slate-600 text-sm">
                  Подходящую схему подберёт наш эксперт на основании типа производства
                  (серийное/партия), наличия системы менеджмента качества и других факторов.
                </p>
              </section>

              {/* FAQ */}
              {regulation.faq.length > 0 && (
                <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <span className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    Часто задаваемые вопросы
                  </h2>

                  <div className="space-y-4">
                    {regulation.faq.map((item, index) => (
                      <details key={index} className="group bg-slate-50 rounded-xl">
                        <summary className="flex items-center justify-between cursor-pointer p-4 font-medium text-slate-900 hover:text-blue-600">
                          <span>{item.question}</span>
                          <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>
                        <div className="px-4 pb-4 text-slate-600">
                          {item.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Правая колонка - сайдбар */}
            <div className="space-y-6">
              {/* Преимущества */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Почему мы?</h3>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">✓</span>
                    <span>12+ лет опыта</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">✓</span>
                    <span>50 000+ документов</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">✓</span>
                    <span>60 городов России</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">✓</span>
                    <span>100% гарантия</span>
                  </li>
                </ul>
              </div>

              {/* Связанные регламенты */}
              {relatedRegulations.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 mb-4">
                    Другие сертификаты ТР ТС
                  </h3>
                  <ul className="space-y-3">
                    {relatedRegulations.map((rel) => (
                      <li key={rel.id}>
                        <Link
                          href={`/sertifikat-tr-ts/${rel.slug}`}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors group"
                        >
                          <div>
                            <div className="font-medium text-slate-900 group-hover:text-blue-600">
                              {rel.shortName}
                            </div>
                            <div className="text-sm text-slate-500">{rel.number}</div>
                          </div>
                          <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Нужна декларация? */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Нужна декларация?
                </h3>
                <p className="text-slate-600 text-sm mb-4">
                  Для некоторых товаров вместо сертификата достаточно оформить декларацию соответствия
                </p>
                <Link
                  href="/deklaraciya-tr-ts"
                  className="inline-flex items-center gap-2 text-amber-700 font-medium hover:text-amber-800"
                >
                  Смотреть декларации
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* CTA секция */}
        <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Готовы оформить сертификат {regulation.number}?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Получите бесплатную консультацию и точный расчёт стоимости за 15 минут
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-premium bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-glow-orange hover:from-orange-600 hover:to-orange-700 transition-all">
                Получить расчёт
              </button>
              <a
                href="tel:88005505288"
                className="btn-premium bg-white/10 backdrop-blur-sm text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-white/20 transition-all"
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
