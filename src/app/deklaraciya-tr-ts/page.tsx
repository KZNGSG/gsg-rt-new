import Link from 'next/link';
import { Metadata } from 'next';
import { getDeclarationRegulations, TRTSRegulation } from '@/data/tr-ts-database';

export const metadata: Metadata = {
  title: 'Декларация соответствия ТР ТС — оформление от 8 000 ₽ | ГОСТСЕРТГРУПП',
  description: 'Оформление деклараций соответствия ТР ТС ЕАЭС на одежду, электронику, косметику, пищевую продукцию. Срок 1-7 дней. Цена от 8 000 ₽. Аккредитованный орган.',
  keywords: ['декларация тр тс', 'декларация соответствия', 'декларирование еаэс', 'декларация на продукцию', 'тр тс декларация'],
  openGraph: {
    title: 'Декларация соответствия ТР ТС — оформление от 8 000 ₽',
    description: 'Оформление деклараций ТР ТС ЕАЭС. Одежда, электроника, косметика, пищевая продукция. Срок 1-7 дней.',
    type: 'website',
  },
};

function getCategoryColor(category: TRTSRegulation['category']): string {
  const colors: Record<string, string> = {
    children: 'from-pink-500 to-rose-500',
    machinery: 'from-blue-500 to-indigo-500',
    transport: 'from-amber-500 to-orange-500',
    electronics: 'from-purple-500 to-violet-500',
    food: 'from-green-500 to-emerald-500',
    clothing: 'from-cyan-500 to-teal-500',
    cosmetics: 'from-rose-400 to-pink-500',
    furniture: 'from-amber-400 to-yellow-500',
    other: 'from-slate-400 to-slate-500',
  };
  return colors[category] || colors.other;
}

function getCategoryLabel(category: TRTSRegulation['category']): string {
  const labels: Record<string, string> = {
    children: 'Детские товары',
    machinery: 'Оборудование',
    transport: 'Транспорт',
    electronics: 'Электроника',
    food: 'Пищевая продукция',
    clothing: 'Одежда и обувь',
    cosmetics: 'Косметика',
    furniture: 'Мебель',
    other: 'Другое',
  };
  return labels[category] || 'Другое';
}

export default function DeklaraciyaTRTSPage() {
  const regulations = getDeclarationRegulations();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero секция */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700"></div>
        <div className="absolute inset-0 bg-dots opacity-30"></div>
        <div className="relative py-16">
          <div className="container mx-auto px-4">
            {/* Хлебные крошки */}
            <nav className="text-sm mb-6 text-indigo-200">
              <Link href="/" className="hover:text-white transition-colors">Главная</Link>
              <span className="mx-2">/</span>
              <span className="text-white">Декларация ТР ТС</span>
            </nav>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Декларация соответствия ТР ТС
            </h1>
            <p className="text-xl text-indigo-100 max-w-3xl mb-8">
              Декларирование соответствия продукции по техническим регламентам
              Таможенного союза. Быстро, официально, с гарантией.
            </p>

            {/* Ключевые преимущества */}
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 flex items-center gap-3">
                <span className="text-3xl">⚡</span>
                <div>
                  <div className="text-indigo-200 text-sm">Срок</div>
                  <div className="text-white font-bold">от 1 дня</div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 flex items-center gap-3">
                <span className="text-3xl">💰</span>
                <div>
                  <div className="text-indigo-200 text-sm">Цена</div>
                  <div className="text-white font-bold">от 8 000 ₽</div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 flex items-center gap-3">
                <span className="text-3xl">📋</span>
                <div>
                  <div className="text-indigo-200 text-sm">Реестр</div>
                  <div className="text-white font-bold">ФСА Росаккредитация</div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 flex items-center gap-3">
                <span className="text-3xl">🌍</span>
                <div>
                  <div className="text-indigo-200 text-sm">Действует</div>
                  <div className="text-white font-bold">ЕАЭС</div>
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

      {/* Информационный блок */}
      <section className="py-8 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">
                  Что такое декларация ТР ТС?
                </h2>
                <p className="text-slate-600">
                  <strong>Декларация соответствия ТР ТС</strong> — это документ, в котором заявитель
                  (производитель, импортёр или продавец) подтверждает соответствие своей продукции
                  требованиям технических регламентов. В отличие от сертификата, декларация принимается
                  на основании собственных доказательств или протоколов испытаний. Это более быстрый
                  и экономичный способ подтверждения соответствия для большинства товаров.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Каталог деклараций */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">
            Декларации по техническим регламентам
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regulations.map((reg) => (
              <Link
                key={reg.id}
                href={`/deklaraciya-tr-ts/${reg.slug}`}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-indigo-300 transition-all duration-300"
              >
                {/* Цветная полоска сверху */}
                <div className={`h-1.5 bg-gradient-to-r ${getCategoryColor(reg.category)}`}></div>

                <div className="p-6">
                  {/* Номер регламента */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                      {reg.number}
                    </span>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                      {getCategoryLabel(reg.category)}
                    </span>
                  </div>

                  {/* Название */}
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {reg.shortName}
                  </h3>

                  {/* Бейдж СГР если нужен */}
                  {reg.sgrRequired && (
                    <div className="mb-3">
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
                        + СГР для отдельных категорий
                      </span>
                    </div>
                  )}

                  {/* Описание */}
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">
                    {reg.content.intro.slice(0, 120)}...
                  </p>

                  {/* Цена и срок */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      <div className="text-xs text-slate-400">Цена</div>
                      <div className="text-lg font-bold text-gradient-orange">
                        от {reg.pricing.batch.price.toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Срок</div>
                      <div className="text-sm font-medium text-slate-700">
                        {reg.pricing.batch.days}
                      </div>
                    </div>
                  </div>

                  {/* Кнопка */}
                  <div className="mt-4">
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
                      Подробнее
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Преимущества декларации */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
            Преимущества декларирования
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Дешевле сертификата</h3>
              <p className="text-slate-600 text-sm">Экономия до 50% по сравнению с сертификацией</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Быстрее оформление</h3>
              <p className="text-slate-600 text-sm">От 1 дня при наличии протоколов испытаний</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Действует в ЕАЭС</h3>
              <p className="text-slate-600 text-sm">Россия, Беларусь, Казахстан, Армения, Кыргызстан</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Официальный реестр</h3>
              <p className="text-slate-600 text-sm">Регистрация в реестре ФСА Росаккредитация</p>
            </div>
          </div>
        </div>
      </section>

      {/* Отличие от сертификата */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
            Декларация или сертификат?
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Декларация */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-2xl p-6 relative">
              <div className="absolute -top-3 left-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                Вы здесь
              </div>
              <div className="flex items-center gap-3 mb-4 mt-2">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-indigo-800">Декларация ТР ТС</h3>
              </div>
              <ul className="space-y-3 text-sm text-indigo-700">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-0.5">✓</span>
                  <span>Принимает <strong>сам заявитель</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-0.5">✓</span>
                  <span>Цена <strong>от 8 000 ₽</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-0.5">✓</span>
                  <span>Срок <strong>от 1 дня</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 mt-0.5">✓</span>
                  <span>Одежда, электроника, косметика, продукты</span>
                </li>
              </ul>
            </div>

            {/* Сертификат */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-emerald-800">Сертификат ТР ТС</h3>
              </div>
              <ul className="space-y-3 text-sm text-emerald-700">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span>Выдаёт <strong>аккредитованный орган</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span>Цена <strong>от 15 000 ₽</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span>Срок <strong>от 7 дней</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span>Детские товары, игрушки, оборудование</span>
                </li>
              </ul>
              <Link
                href="/sertifikat-tr-ts"
                className="inline-flex items-center gap-2 mt-4 text-emerald-700 font-medium hover:text-emerald-800"
              >
                Смотреть сертификаты
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Преимущества компании */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
            Почему выбирают нас
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-50 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">🏆</div>
              <div className="text-3xl font-black text-slate-900 mb-2">12+</div>
              <div className="text-slate-600">лет на рынке</div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">📄</div>
              <div className="text-3xl font-black text-slate-900 mb-2">50 000+</div>
              <div className="text-slate-600">выданных документов</div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">🏢</div>
              <div className="text-3xl font-black text-slate-900 mb-2">60+</div>
              <div className="text-slate-600">филиалов по России</div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">⭐</div>
              <div className="text-3xl font-black text-slate-900 mb-2">100%</div>
              <div className="text-slate-600">гарантия качества</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Нужна помощь с декларированием?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Наши эксперты бесплатно проконсультируют и помогут определить,
            какая декларация требуется для вашей продукции
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="btn-premium bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-glow-orange hover:from-orange-600 hover:to-orange-700 transition-all"
            >
              Рассчитать стоимость
            </Link>
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
  );
}
