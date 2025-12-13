import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Виды сертификации',
  description: 'Все виды сертификации продукции: декларации ТР ТС, сертификаты ГОСТ Р, СГР, ISO и другие разрешительные документы',
};

const CERTIFICATION_TYPES = [
  {
    slug: 'deklarirovanie',
    title: 'Декларирование соответствия',
    description: 'Декларации ТР ТС, ГОСТ Р для товаров и продукции',
    icon: '📋',
    price: 'от 8 000 ₽',
  },
  {
    slug: 'sertifikat-tr-ts',
    title: 'Сертификат ТР ТС',
    description: 'Сертификация по техническим регламентам Таможенного союза',
    icon: '📜',
    price: 'от 12 000 ₽',
  },
  {
    slug: 'gost-r',
    title: 'Сертификат ГОСТ Р',
    description: 'Добровольная и обязательная сертификация по ГОСТ Р',
    icon: '🏆',
    price: 'от 15 000 ₽',
  },
  {
    slug: 'sgr',
    title: 'СГР (Свидетельство о госрегистрации)',
    description: 'Государственная регистрация продукции в Роспотребнадзоре',
    icon: '🔬',
    price: 'от 25 000 ₽',
  },
  {
    slug: 'iso',
    title: 'Сертификация ISO',
    description: 'Международные стандарты качества ISO 9001, 14001, 22000',
    icon: '🌍',
    price: 'от 35 000 ₽',
  },
  {
    slug: 'pozharnyj-sertifikat',
    title: 'Пожарный сертификат',
    description: 'Сертификация пожарной безопасности продукции',
    icon: '🔥',
    price: 'от 18 000 ₽',
  },
  {
    slug: 'registratsiya-mi',
    title: 'Регистрация медизделий',
    description: 'Регистрация медицинских изделий в Росздравнадзоре',
    icon: '⚕️',
    price: 'от 50 000 ₽',
  },
  {
    slug: 'hassp',
    title: 'ХАССП (HACCP)',
    description: 'Разработка и внедрение системы пищевой безопасности',
    icon: '🍽️',
    price: 'от 30 000 ₽',
  },
];

export default function VidySertifikaciiPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero секция */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <nav className="text-sm mb-6 text-blue-200">
            <Link href="/" className="hover:text-white">Главная</Link>
            <span className="mx-2">/</span>
            <span>Виды сертификации</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Виды сертификации
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Полный спектр услуг по оформлению разрешительной документации.
            Работаем со всеми видами сертификатов и деклараций.
          </p>
        </div>
      </section>

      {/* Каталог услуг */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {CERTIFICATION_TYPES.map((type) => (
              <Link
                key={type.slug}
                href={`/vidy-sertifikacii/${type.slug}`}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-blue-200"
              >
                <div className="text-4xl mb-4">{type.icon}</div>
                <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {type.title}
                </h2>
                <p className="text-slate-600 mb-4 text-sm">
                  {type.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-blue-600 font-semibold">{type.price}</span>
                  <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Не знаете какой документ нужен?
          </h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Наши эксперты бесплатно определят, какой вид сертификации требуется для вашей продукции
          </p>
          <button className="bg-blue-600 text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors">
            Получить консультацию
          </button>
        </div>
      </section>
    </div>
  );
}
