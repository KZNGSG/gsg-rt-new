import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'О компании',
  description: 'ГОСТСЕРТГРУПП - федеральный центр сертификации с 2012 года. 60+ филиалов по России, 50 000+ оформленных документов.',
};

const STATS = [
  { number: '12+', label: 'лет опыта', description: 'Работаем с 2012 года' },
  { number: '60+', label: 'филиалов', description: 'По всей России' },
  { number: '50 000+', label: 'документов', description: 'Успешно оформлено' },
  { number: '15 000+', label: 'клиентов', description: 'Довольных партнёров' },
];

const ADVANTAGES = [
  {
    title: 'Аккредитация',
    description: 'Работаем с аккредитованными органами по сертификации и лабораториями',
    icon: '🏛️',
  },
  {
    title: 'Скорость',
    description: 'Оформляем документы в кратчайшие сроки без потери качества',
    icon: '⚡',
  },
  {
    title: 'Гарантия',
    description: '100% гарантия подлинности документов с проверкой в реестрах',
    icon: '✅',
  },
  {
    title: 'Поддержка',
    description: 'Персональный менеджер на всех этапах оформления',
    icon: '🤝',
  },
  {
    title: 'Доступность',
    description: 'Офисы в 60+ городах России для вашего удобства',
    icon: '📍',
  },
  {
    title: 'Экспертиза',
    description: 'Команда сертифицированных экспертов в разных отраслях',
    icon: '🎓',
  },
];

export default function ONasPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <nav className="text-sm mb-6 text-blue-200">
            <Link href="/" className="hover:text-white">Главная</Link>
            <span className="mx-2">/</span>
            <span>О компании</span>
          </nav>
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              О компании {SITE_CONFIG.name}
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Федеральный центр сертификации продукции. Помогаем бизнесу получать
              разрешительную документацию быстро, надёжно и по доступным ценам.
            </p>
            <p className="text-lg text-blue-200">
              С 2012 года мы помогли более чем 15 000 предпринимателей и компаний
              легально выйти на рынок с сертифицированной продукцией.
            </p>
          </div>
        </div>
      </section>

      {/* Статистика */}
      <section className="py-16 bg-white -mt-8 relative z-10 mx-4 md:mx-auto max-w-5xl rounded-2xl shadow-xl">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-slate-900 mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-slate-500">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Миссия */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Наша миссия
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              Мы делаем процесс сертификации простым и понятным. Наша цель — помочь
              предпринимателям сосредоточиться на развитии бизнеса, взяв на себя все
              заботы по оформлению разрешительной документации.
            </p>
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">
            Почему выбирают нас
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ADVANTAGES.map((advantage, index) => (
              <div
                key={index}
                className="bg-slate-50 rounded-2xl p-8 hover:bg-blue-50 transition-colors"
              >
                <div className="text-4xl mb-4">{advantage.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {advantage.title}
                </h3>
                <p className="text-slate-600">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* История */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">
            Наша история
          </h2>
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-24 text-right">
                <span className="text-2xl font-bold text-blue-600">2012</span>
              </div>
              <div className="border-l-2 border-blue-200 pl-6 pb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Основание компании</h3>
                <p className="text-slate-600">
                  Открытие первого офиса в Казани. Начало работы с сертификатами ГОСТ Р.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-24 text-right">
                <span className="text-2xl font-bold text-blue-600">2015</span>
              </div>
              <div className="border-l-2 border-blue-200 pl-6 pb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Расширение услуг</h3>
                <p className="text-slate-600">
                  Добавление сертификации ТР ТС, СГР, ISO. Открытие 10 филиалов по России.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-24 text-right">
                <span className="text-2xl font-bold text-blue-600">2018</span>
              </div>
              <div className="border-l-2 border-blue-200 pl-6 pb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Федеральная сеть</h3>
                <p className="text-slate-600">
                  Достижение отметки в 30 филиалов. Запуск онлайн-сервисов для клиентов.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-24 text-right">
                <span className="text-2xl font-bold text-blue-600">2023</span>
              </div>
              <div className="border-l-2 border-blue-200 pl-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Лидерство на рынке</h3>
                <p className="text-slate-600">
                  60+ филиалов по России. Более 50 000 оформленных документов.
                  Признание как один из крупнейших центров сертификации в стране.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Готовы начать сотрудничество?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Свяжитесь с нами для бесплатной консультации
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/kontakty"
              className="bg-white text-blue-600 font-bold text-lg px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Связаться с нами
            </Link>
            <a
              href={`tel:${SITE_CONFIG.phoneClean}`}
              className="border-2 border-white text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-white/10 transition-colors"
            >
              {SITE_CONFIG.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
