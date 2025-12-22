import Link from 'next/link';
import { Metadata } from 'next';
import { getCertificateRegulations, TRTSRegulation } from '@/data/tr-ts-database';

export const metadata: Metadata = {
  title: 'Сертификат соответствия ТР ТС — оформление от 15 000 ₽ | ГОСТСЕРТГРУПП',
  description: 'Оформление сертификатов соответствия ТР ТС ЕАЭС на детские товары, игрушки, оборудование, транспорт. Аккредитованный орган. 60+ филиалов. Срок 3-14 дней.',
  keywords: ['сертификат тр тс', 'сертификат соответствия', 'сертификация еаэс', 'обязательная сертификация', 'сертификат на продукцию'],
  openGraph: {
    title: 'Сертификат соответствия ТР ТС — оформление от 15 000 ₽',
    description: 'Оформление сертификатов ТР ТС ЕАЭС. Детские товары, игрушки, оборудование, транспорт. 60+ филиалов по России.',
    type: 'website',
  },
};

// Категории для фильтрации
const CATEGORIES = [
  { id: 'all', label: 'Все', color: 'bg-slate-100 text-slate-700' },
  { id: 'children', label: 'Детские товары', color: 'bg-pink-100 text-pink-700' },
  { id: 'machinery', label: 'Оборудование', color: 'bg-blue-100 text-blue-700' },
  { id: 'transport', label: 'Транспорт', color: 'bg-amber-100 text-amber-700' },
  { id: 'electronics', label: 'Электроника', color: 'bg-purple-100 text-purple-700' },
] as const;

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

export default function SertifikatTRTSPage() {
  const regulations = getCertificateRegulations();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero секция */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-blue"></div>
        <div className="absolute inset-0 bg-dots opacity-30"></div>
        <div className="relative py-16">
          <div className="container mx-auto px-4">
            {/* Хлебные крошки */}
            <nav className="text-sm mb-6 text-blue-200">
              <Link href="/" className="hover:text-white transition-colors">Главная</Link>
              <span className="mx-2">/</span>
              <span className="text-white">Сертификат ТР ТС</span>
            </nav>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Сертификат соответствия ТР ТС
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mb-8">
              Обязательная сертификация продукции по техническим регламентам
              Таможенного союза. Действует на территории всех стран ЕАЭС.
            </p>

            {/* Ключевые преимущества */}
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 flex items-center gap-3">
                <span className="text-3xl">⏱️</span>
                <div>
                  <div className="text-blue-200 text-sm">Срок</div>
                  <div className="text-white font-bold">от 3 дней</div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 flex items-center gap-3">
                <span className="text-3xl">💰</span>
                <div>
                  <div className="text-blue-200 text-sm">Цена</div>
                  <div className="text-white font-bold">от 15 000 ₽</div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 flex items-center gap-3">
                <span className="text-3xl">📍</span>
                <div>
                  <div className="text-blue-200 text-sm">Филиалы</div>
                  <div className="text-white font-bold">60+ городов</div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3 flex items-center gap-3">
                <span className="text-3xl">✅</span>
                <div>
                  <div className="text-blue-200 text-sm">Гарантия</div>
                  <div className="text-white font-bold">100%</div>
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
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-2">
                  Что такое сертификат ТР ТС?
                </h2>
                <p className="text-slate-600">
                  <strong>Сертификат соответствия ТР ТС</strong> — это документ, выданный аккредитованным органом
                  по сертификации, подтверждающий соответствие продукции требованиям технических регламентов
                  Таможенного союза. В отличие от декларации, сертификат выдаётся третьей стороной после
                  проведения испытаний и анализа производства. Обязателен для продукции повышенной опасности:
                  детских товаров, игрушек, лифтов, газового оборудования и др.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Каталог сертификатов */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8">
            Сертификаты по техническим регламентам
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regulations.map((reg) => (
              <Link
                key={reg.id}
                href={`/sertifikat-tr-ts/${reg.slug}`}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300"
              >
                {/* Цветная полоска сверху */}
                <div className={`h-1.5 bg-gradient-to-r ${getCategoryColor(reg.category)}`}></div>

                <div className="p-6">
                  {/* Номер регламента */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {reg.number}
                    </span>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                      {getCategoryLabel(reg.category)}
                    </span>
                  </div>

                  {/* Название */}
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {reg.shortName}
                  </h3>

                  {/* Описание (первые 100 символов) */}
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
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 group-hover:text-blue-700">
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

      {/* Отличие от декларации */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
            Сертификат или декларация — в чём разница?
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
                  <span>Выдаётся <strong>аккредитованным органом</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span>Для продукции <strong>повышенной опасности</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span>Обязателен <strong>анализ производства</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  <span>Более высокий <strong>уровень доверия</strong></span>
                </li>
              </ul>
            </div>

            {/* Декларация */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-blue-800">Декларация ТР ТС</h3>
              </div>
              <ul className="space-y-3 text-sm text-blue-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">✓</span>
                  <span>Принимает <strong>сам заявитель</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">✓</span>
                  <span>Для <strong>большинства товаров</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">✓</span>
                  <span>На основании <strong>собственных доказательств</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">✓</span>
                  <span>Быстрее и <strong>дешевле</strong> сертификата</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/deklaraciya-tr-ts"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Смотреть все декларации ТР ТС
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
            Почему выбирают нас
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">🏆</div>
              <div className="text-3xl font-black text-slate-900 mb-2">12+</div>
              <div className="text-slate-600">лет на рынке</div>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">📄</div>
              <div className="text-3xl font-black text-slate-900 mb-2">50 000+</div>
              <div className="text-slate-600">выданных документов</div>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">🏢</div>
              <div className="text-3xl font-black text-slate-900 mb-2">60+</div>
              <div className="text-slate-600">филиалов по России</div>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">⭐</div>
              <div className="text-3xl font-black text-slate-900 mb-2">100%</div>
              <div className="text-slate-600">гарантия качества</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Нужна помощь с сертификацией?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Наши эксперты бесплатно проконсультируют и помогут определить,
            какой сертификат требуется для вашей продукции
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
