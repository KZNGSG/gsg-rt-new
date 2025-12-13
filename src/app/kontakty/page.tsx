import Link from 'next/link';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Контакты',
  description: 'Контакты центра сертификации ГОСТСЕРТГРУПП. Офисы в 60+ городах России.',
};

const OFFICES = [
  {
    city: 'Москва',
    address: 'ул. Московская, д. 1, офис 100',
    phone: '+7 (495) 123-45-67',
    email: 'moscow@gsg-rt.ru',
    workHours: 'Пн-Пт: 9:00-18:00',
  },
  {
    city: 'Санкт-Петербург',
    address: 'Невский проспект, д. 50, офис 200',
    phone: '+7 (812) 123-45-67',
    email: 'spb@gsg-rt.ru',
    workHours: 'Пн-Пт: 9:00-18:00',
  },
  {
    city: 'Казань',
    address: 'ул. Баумана, д. 10, офис 50',
    phone: '+7 (843) 123-45-67',
    email: 'kazan@gsg-rt.ru',
    workHours: 'Пн-Пт: 9:00-18:00',
  },
  {
    city: 'Екатеринбург',
    address: 'ул. Ленина, д. 25, офис 75',
    phone: '+7 (343) 123-45-67',
    email: 'ekb@gsg-rt.ru',
    workHours: 'Пн-Пт: 9:00-18:00',
  },
];

export default function KontaktyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <nav className="text-sm mb-6 text-blue-200">
            <Link href="/" className="hover:text-white">Главная</Link>
            <span className="mx-2">/</span>
            <span>Контакты</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Контакты
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Свяжитесь с нами любым удобным способом. Работаем в 60+ городах России.
          </p>
        </div>
      </section>

      {/* Основные контакты */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Телефон</h3>
              <a href={`tel:${SITE_CONFIG.phoneClean}`} className="text-2xl font-bold text-blue-600 hover:text-blue-700">
                {SITE_CONFIG.phone}
              </a>
              <p className="text-slate-500 mt-2">Бесплатно по России</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Email</h3>
              <a href={`mailto:${SITE_CONFIG.email}`} className="text-2xl font-bold text-blue-600 hover:text-blue-700">
                {SITE_CONFIG.email}
              </a>
              <p className="text-slate-500 mt-2">Ответим в течение часа</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Время работы</h3>
              <p className="text-2xl font-bold text-slate-900">{SITE_CONFIG.workingHours}</p>
              <p className="text-slate-500 mt-2">По московскому времени</p>
            </div>
          </div>

          {/* Офисы */}
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Наши офисы
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {OFFICES.map((office) => (
              <div key={office.city} className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-4">{office.city}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-slate-600">{office.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${office.phone.replace(/[^+\d]/g, '')}`} className="text-blue-600 hover:text-blue-700">
                      {office.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-slate-600">{office.workHours}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Форма обратной связи */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 text-center">
              Напишите нам
            </h2>
            <p className="text-slate-600 text-center mb-8">
              Заполните форму и мы свяжемся с вами в ближайшее время
            </p>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Ваше имя"
                  className="w-full px-4 py-4 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
                <input
                  type="tel"
                  placeholder="Телефон"
                  className="w-full px-4 py-4 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                />
              </div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-4 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
              />
              <textarea
                placeholder="Ваше сообщение"
                rows={5}
                className="w-full px-4 py-4 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 resize-none"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-blue-700 transition-colors"
              >
                Отправить сообщение
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
