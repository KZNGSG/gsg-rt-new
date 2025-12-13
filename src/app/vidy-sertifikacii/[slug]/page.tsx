import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/Button';

// Заглушка данных - потом заменим на реальные из CMS/JSON
const SERVICES_DATA: Record<string, {
  title: string;
  description: string;
  fullDescription: string;
  price: string;
  terms: string;
  documents: string[];
  steps: string[];
}> = {
  'deklarirovanie': {
    title: 'Декларирование соответствия',
    description: 'Декларации ТР ТС, ГОСТ Р для товаров и продукции',
    fullDescription: `Декларация соответствия — это документ, в котором изготовитель, продавец или исполнитель заверяет, что его продукция соответствует требованиям технических регламентов.

    В отличие от сертификата, декларация оформляется на основании собственных доказательств заявителя, протоколов испытаний или документов, выданных аккредитованными органами.`,
    price: 'от 8 000 ₽',
    terms: '1-3 дня',
    documents: [
      'Заявка на декларирование',
      'Копии учредительных документов',
      'Технические документы на продукцию',
      'Протоколы испытаний (при наличии)',
    ],
    steps: [
      'Консультация и определение схемы декларирования',
      'Подготовка документации',
      'Проведение испытаний (при необходимости)',
      'Регистрация декларации в едином реестре',
      'Получение декларации',
    ],
  },
  'sertifikat-tr-ts': {
    title: 'Сертификат ТР ТС',
    description: 'Сертификация по техническим регламентам Таможенного союза',
    fullDescription: `Сертификат ТР ТС (ЕАЭС) — это документ, подтверждающий соответствие продукции требованиям технических регламентов Евразийского экономического союза.

    Сертификат обязателен для продукции, включённой в перечни технических регламентов ТС, и действует на территории всех стран ЕАЭС: России, Беларуси, Казахстана, Армении и Кыргызстана.`,
    price: 'от 12 000 ₽',
    terms: '3-7 дней',
    documents: [
      'Заявка на сертификацию',
      'Учредительные документы заявителя',
      'Техническая документация',
      'Образцы продукции',
      'Контракт на поставку (для импорта)',
    ],
    steps: [
      'Подача заявки на сертификацию',
      'Анализ документации',
      'Отбор образцов продукции',
      'Лабораторные испытания',
      'Оформление и выдача сертификата',
    ],
  },
  'gost-r': {
    title: 'Сертификат ГОСТ Р',
    description: 'Добровольная и обязательная сертификация по ГОСТ Р',
    fullDescription: `Сертификат ГОСТ Р подтверждает соответствие продукции национальным стандартам Российской Федерации. Может быть обязательным или добровольным в зависимости от вида продукции.

    Добровольный сертификат ГОСТ Р повышает конкурентоспособность продукции и доверие потребителей.`,
    price: 'от 15 000 ₽',
    terms: '5-10 дней',
    documents: [
      'Заявка на сертификацию',
      'Копии учредительных документов',
      'Техническая документация (ТУ, паспорт)',
      'Образцы продукции',
    ],
    steps: [
      'Подача заявки',
      'Экспертиза документов',
      'Испытания образцов',
      'Анализ производства (при необходимости)',
      'Выдача сертификата',
    ],
  },
  'sgr': {
    title: 'СГР (Свидетельство о госрегистрации)',
    description: 'Государственная регистрация продукции в Роспотребнадзоре',
    fullDescription: `Свидетельство о государственной регистрации (СГР) — документ, подтверждающий соответствие продукции единым санитарно-эпидемиологическим и гигиеническим требованиям ЕАЭС.

    СГР обязательно для товаров, потенциально опасных для здоровья человека: БАДы, детское питание, бытовая химия, косметика и др.`,
    price: 'от 25 000 ₽',
    terms: '10-30 дней',
    documents: [
      'Заявление на регистрацию',
      'Учредительные документы',
      'Нормативная документация на продукцию',
      'Акт отбора образцов',
      'Протоколы испытаний',
    ],
    steps: [
      'Консультация и подготовка документов',
      'Отбор образцов',
      'Лабораторные исследования',
      'Экспертиза документов в Роспотребнадзоре',
      'Выдача СГР',
    ],
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES_DATA[slug];

  if (!service) {
    return { title: 'Услуга не найдена' };
  }

  return {
    title: service.title,
    description: service.description,
  };
}

export async function generateStaticParams() {
  return Object.keys(SERVICES_DATA).map((slug) => ({ slug }));
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = SERVICES_DATA[slug];

  if (!service) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <nav className="text-sm mb-6 text-blue-200">
            <Link href="/" className="hover:text-white">Главная</Link>
            <span className="mx-2">/</span>
            <Link href="/vidy-sertifikacii" className="hover:text-white">Виды сертификации</Link>
            <span className="mx-2">/</span>
            <span>{service.title}</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {service.title}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            {service.description}
          </p>
          <div className="flex flex-wrap gap-6 mt-8">
            <div className="bg-white/10 rounded-xl px-6 py-4">
              <div className="text-blue-200 text-sm">Стоимость</div>
              <div className="text-2xl font-bold">{service.price}</div>
            </div>
            <div className="bg-white/10 rounded-xl px-6 py-4">
              <div className="text-blue-200 text-sm">Сроки</div>
              <div className="text-2xl font-bold">{service.terms}</div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Основной контент */}
          <div className="lg:col-span-2 space-y-8">
            {/* Описание */}
            <section className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Описание услуги</h2>
              <div className="text-slate-600 whitespace-pre-line">
                {service.fullDescription}
              </div>
            </section>

            {/* Этапы */}
            <section className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Этапы оформления</h2>
              <div className="space-y-4">
                {service.steps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="pt-2 text-slate-700">{step}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Документы */}
            <section className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Необходимые документы</h2>
              <ul className="space-y-3">
                {service.documents.map((doc, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-700">{doc}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Сайдбар */}
          <div className="space-y-6">
            {/* Форма заявки */}
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Заказать {service.title.toLowerCase()}
              </h3>
              <p className="text-slate-600 mb-6">
                Оставьте заявку и получите бесплатную консультацию
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
                <Button variant="primary" size="lg" className="w-full">
                  Получить консультацию
                </Button>
              </form>
              <p className="text-xs text-slate-500 mt-4 text-center">
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
              </p>
            </div>

            {/* Преимущества */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Почему мы?</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <span className="text-2xl">✓</span>
                  <span>12+ лет опыта</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-2xl">✓</span>
                  <span>50 000+ документов</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-2xl">✓</span>
                  <span>60 городов России</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-2xl">✓</span>
                  <span>100% гарантия</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
