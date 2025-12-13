import Link from 'next/link';
import { Hero } from '@/components/sections/Hero';

const SERVICES = [
  { title: 'Сертификат ТР ТС', price: 'от 12 000 ₽', icon: '📜', slug: 'sertifikat-tr-ts' },
  { title: 'Декларация ТР ТС', price: 'от 8 000 ₽', icon: '📋', slug: 'deklarirovanie' },
  { title: 'Сертификат ГОСТ Р', price: 'от 15 000 ₽', icon: '🏆', slug: 'gost-r' },
  { title: 'СГР', price: 'от 25 000 ₽', icon: '🔬', slug: 'sgr' },
];

export default function Home() {
  return (
    <>
      <Hero />

      {/* Секция услуг */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Наши услуги
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Оформляем все виды разрешительной документации для вашего бизнеса
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service) => (
              <Link
                key={service.slug}
                href={`/vidy-sertifikacii/${service.slug}`}
                className="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-200 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-blue-600 font-semibold">{service.price}</p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/vidy-sertifikacii"
              className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              Смотреть все услуги
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Секция преимуществ */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Почему выбирают нас
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '12+', label: 'лет опыта', desc: 'Работаем с 2012 года' },
              { number: '60+', label: 'филиалов', desc: 'По всей России' },
              { number: '50 000+', label: 'документов', desc: 'Успешно оформлено' },
              { number: '100%', label: 'гарантия', desc: 'Проверка в реестрах' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-xl font-semibold text-slate-900 mb-1">{stat.label}</div>
                <div className="text-slate-600">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA секция */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Готовы начать сертификацию?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Получите бесплатную консультацию и расчёт стоимости за 15 минут
          </p>
          <button className="bg-white text-blue-600 font-bold text-lg px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
            Получить консультацию
          </button>
        </div>
      </section>
    </>
  );
}
