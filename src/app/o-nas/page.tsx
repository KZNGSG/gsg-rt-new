import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'О компании',
  description: 'ГОСТСЕРТГРУПП - федеральный центр сертификации с 2012 года. 70+ филиалов по России и Казахстану, 40 испытательных лабораторий.',
};

const STATS = [
  { number: '12+', label: 'лет опыта', description: 'Работаем с 2012 года' },
  { number: '70+', label: 'филиалов', description: 'По России и Казахстану' },
  { number: '40', label: 'лабораторий', description: 'Испытательных центров' },
  { number: '50 000+', label: 'документов', description: 'Успешно оформлено' },
];

const ADVANTAGES = [
  {
    title: 'Аккредитация',
    description: 'Работаем с аккредитованными органами по сертификации и 40 испытательными лабораториями напрямую',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Скорость',
    description: 'Оформляем документы в кратчайшие сроки без потери качества',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: 'Гарантия',
    description: '100% гарантия подлинности документов с проверкой в реестрах',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Поддержка',
    description: 'Персональный менеджер на всех этапах оформления',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: 'География',
    description: 'Офисы в 70+ городах России и Казахстана для вашего удобства',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Международный опыт',
    description: 'Собственное представительство в Китае — Mambo Testing Group',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

// Крупные проекты компании
const MAJOR_PROJECTS = [
  'Тенинская ТЭЦ',
  'Объездная дорога вокруг Костромы',
  'Мост через Волгу',
  'Автозавод «Мерседес-Бенц РУС» в Москве',
  'Газохимические комплексы в РФ и СНГ',
  'Нефтеперерабатывающие комплексы в Казахстане',
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
              Одна из крупнейших организаций по оформлению сертификатов и деклараций
              соответствия по России и Казахстану. Тесное сотрудничество с госучреждениями
              и аккредитованными лабораториями делает нас ведущим центром сертификации.
            </p>
            <p className="text-lg text-blue-200">
              С 2012 года работаем быстро и по приемлемой стоимости — помогли более чем
              15 000 предпринимателей и компаний легально выйти на рынок.
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
            <p className="text-xl text-slate-600 leading-relaxed mb-6">
              Компания заботится в первую очередь о людях — своих клиентах и сотрудниках.
              Для клиентов мы стараемся сделать максимально удобный и комфортный сервис,
              оперативно консультировать и проводить сертификацию.
            </p>
            <p className="text-lg text-slate-500">
              Готовы взяться за выполнение задач любой сложности, будь то сертификация товаров,
              строительной продукции или газового оборудования.
            </p>
          </div>
        </div>
      </section>

      {/* Работа в Китае */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                  Сертификация товаров в Китае
                </h2>
                <p className="text-slate-600 mb-4">
                  Мы самый продвинутый центр сертификации услуг и товаров — работаем даже
                  с товарами в Китае через наше представительство <strong>Mambo Testing
                  and Certification Group Co., Ltd.</strong>
                </p>
                <p className="text-slate-600 mb-6">
                  Филиал «ГОСТСЕРТГРУПП» в Китае был основан в 2012 году. Ведущее направление —
                  EPC-проекты (инжиниринг, поставка, строительство).
                </p>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Реализованные проекты:
                </h3>
                <ul className="space-y-2">
                  {MAJOR_PROJECTS.map((project, index) => (
                    <li key={index} className="flex items-center gap-2 text-slate-600">
                      <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {project}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-slate-100 rounded-2xl p-8 text-center">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Mambo Testing Group
                </h3>
                <p className="text-slate-600">
                  Представительство в Китае с 2012 года
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">
            Почему выбирают нас
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ADVANTAGES.map((advantage, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow border border-slate-100"
              >
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                  {advantage.icon}
                </div>
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
