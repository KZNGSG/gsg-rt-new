import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getTRTSContent,
  calculateProductPrice,
  GLOBAL_PRICING,
  ALL_TRTS_CONTENT,
  type SalesChannel,
} from '@/data/tr-ts-content';
import { getRegulationBySlug } from '@/data/tr-ts-database';

interface PageProps {
  params: Promise<{ slug: string; channel: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, channel: channelSlug } = await params;

  const regulation = getRegulationBySlug(slug);
  if (!regulation) {
    return { title: 'Страница не найдена' };
  }

  let trtsContent = getTRTSContent(slug);
  if (!trtsContent) {
    trtsContent = Object.values(ALL_TRTS_CONTENT).find(
      t => t.id === regulation.id || t.slug === slug
    );
  }

  const channel = trtsContent?.salesChannels.find(c => c.slug === channelSlug);

  if (!channel) {
    return { title: 'Страница не найдена' };
  }

  return {
    title: channel.seo.title,
    description: channel.seo.description,
    openGraph: {
      title: channel.seo.title,
      description: channel.seo.description,
      type: 'website',
    },
  };
}

export async function generateStaticParams() {
  const params: Array<{ slug: string; channel: string }> = [];

  for (const [trtsSlug, data] of Object.entries(ALL_TRTS_CONTENT)) {
    for (const ch of data.salesChannels) {
      params.push({ slug: trtsSlug, channel: ch.slug });
    }
  }

  return params;
}

// JSON-LD
function generateJsonLd(
  channel: NonNullable<ReturnType<typeof getTRTSContent>>['salesChannels'][0],
  trtsNumber: string,
  price: { min: number; max: number },
  slug: string
) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: channel.seo.h1,
        description: channel.seo.description,
        provider: {
          '@type': 'Organization',
          name: 'ГОСТСЕРТГРУПП',
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
          { '@type': 'ListItem', position: 4, name: channel.name, item: `https://gsg-rt-new.vercel.app/sertifikat-tr-ts/${slug}/prodazha/${channel.slug}` },
        ],
      },
    ],
  };
}

// Иконки маркетплейсов
function getChannelIcon(channelSlug: string) {
  switch (channelSlug) {
    case 'wildberries':
      return (
        <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
          WB
        </div>
      );
    case 'ozon':
      return (
        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
          O₃
        </div>
      );
    default:
      return (
        <div className="w-12 h-12 bg-slate-600 rounded-xl flex items-center justify-center text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      );
  }
}

export default async function SalesChannelPage({ params }: PageProps) {
  const { slug, channel: channelSlug } = await params;

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

  const channel = trtsContent.salesChannels.find(c => c.slug === channelSlug);
  if (!channel) {
    notFound();
  }

  // Расчёт цены
  const price = calculateProductPrice(trtsContent.slug, undefined, {
    type: 'batch',
    salesChannel: channel.channel as SalesChannel,
  });

  const jsonLd = generateJsonLd(channel, regulation.number, price, slug);

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
                <span className="text-white">{channel.name}</span>
              </nav>

              <div className="grid lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-4 mb-4">
                    {getChannelIcon(channelSlug)}
                    <div>
                      <span className="inline-block bg-white/10 backdrop-blur-sm text-blue-100 px-4 py-1.5 rounded-full text-sm font-medium">
                        {regulation.number}
                      </span>
                    </div>
                  </div>

                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4">
                    {channel.seo.h1}
                  </h1>

                  <p className="text-lg text-blue-100 mb-8 max-w-2xl">
                    Оформляем сертификаты соответствия для продажи на {channel.name}.
                    Документы принимаются площадкой с первого раза.
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
                    <div className="bg-green-500/20 backdrop-blur-sm rounded-xl px-5 py-3">
                      <div className="text-green-200 text-sm">Модерация</div>
                      <div className="text-xl font-bold text-green-100">
                        100%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Форма */}
                <div className="bg-white rounded-2xl p-6 shadow-2xl lg:sticky lg:top-24">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Сертификат для {channel.name}
                  </h3>
                  <p className="text-slate-500 text-sm mb-6">
                    Подготовим документы под требования площадки
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
                      placeholder="Что продаёте?"
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
              {/* Требования площадки */}
              <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  Требования {channel.name} к документам
                </h2>
                <ul className="space-y-3">
                  {channel.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-700">{req}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-green-800 text-sm">
                      Мы знаем все требования {channel.name} к документам.
                      Сертификат пройдёт модерацию с первого раза.
                    </p>
                  </div>
                </div>
              </section>

              {/* Советы */}
              <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </span>
                  Полезные советы для продавцов
                </h2>
                <ul className="space-y-4">
                  {channel.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl">
                      <span className="flex-shrink-0 w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {i + 1}
                      </span>
                      <span className="text-slate-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Как работаем */}
              <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </span>
                  Как мы работаем
                </h2>
                <div className="space-y-4">
                  {[
                    `Консультация: определяем что нужно для ${channel.name}`,
                    'Собираем документы (поможем с недостающими)',
                    'Проводим испытания в аккредитованной лаборатории',
                    'Регистрируем сертификат в реестре ФСА',
                    `Загружаем документы в ваш личный кабинет ${channel.name}`,
                    'Сопровождаем при прохождении модерации',
                  ].map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg shadow-purple-500/30">
                        {i + 1}
                      </div>
                      <div className="pt-2 text-slate-700">{step}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Гарантия */}
              <section className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 md:p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Гарантия прохождения модерации
                </h2>
                <p className="text-slate-700 mb-6">
                  Если {channel.name} отклонит документы — мы исправим бесплатно.
                  За 12+ лет работы процент отказов близок к нулю.
                </p>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-xl">
                    <div className="text-3xl font-black text-green-600 mb-1">99.8%</div>
                    <div className="text-slate-500 text-sm">Успешных модераций</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl">
                    <div className="text-3xl font-black text-green-600 mb-1">50 000+</div>
                    <div className="text-slate-500 text-sm">Документов выдано</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl">
                    <div className="text-3xl font-black text-green-600 mb-1">0 ₽</div>
                    <div className="text-slate-500 text-sm">За доработку при отказе</div>
                  </div>
                </div>
              </section>
            </div>

            {/* Сайдбар */}
            <div className="space-y-6">
              {/* Другие площадки */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Для других площадок
                </h3>
                <ul className="space-y-2">
                  {trtsContent.salesChannels
                    .filter(c => c.slug !== channelSlug)
                    .map(ch => (
                      <li key={ch.slug}>
                        <Link
                          href={`/sertifikat-tr-ts/${slug}/prodazha/${ch.slug}`}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors group"
                        >
                          <span className="text-slate-700 group-hover:text-blue-600">{ch.name}</span>
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Популярные товары для площадки */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  Популярные категории на {channel.name}
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

              {/* Импорт */}
              {trtsContent.imports.length > 0 && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    Импортируете для {channel.name}?
                  </h3>
                  <p className="text-slate-600 text-sm mb-4">
                    Поможем с сертификацией импортной продукции
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {trtsContent.imports.slice(0, 3).map(imp => (
                      <Link
                        key={imp.slug}
                        href={`/sertifikat-tr-ts/${slug}/import/${imp.slug}`}
                        className="bg-white px-3 py-1.5 rounded-lg text-amber-700 text-sm font-medium hover:bg-amber-100 transition-colors"
                      >
                        {imp.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA */}
        <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Готовы продавать на {channel.name}?
            </h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Оформим сертификат {regulation.number} под требования площадки. Гарантия модерации.
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
