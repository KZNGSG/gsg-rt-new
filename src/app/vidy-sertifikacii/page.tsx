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
    icon: 'declaration',
    price: 'от 8 000 ₽',
    color: 'from-blue-500 to-blue-600',
  },
  {
    slug: 'sertifikat-tr-ts',
    title: 'Сертификат ТР ТС',
    description: 'Сертификация по техническим регламентам Таможенного союза',
    icon: 'certificate',
    price: 'от 12 000 ₽',
    color: 'from-emerald-500 to-green-600',
  },
  {
    slug: 'gost-r',
    title: 'Сертификат ГОСТ Р',
    description: 'Добровольная и обязательная сертификация по ГОСТ Р',
    icon: 'check',
    price: 'от 15 000 ₽',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    slug: 'sgr',
    title: 'СГР (Свидетельство о госрегистрации)',
    description: 'Государственная регистрация продукции в Роспотребнадзоре',
    icon: 'sgr',
    price: 'от 25 000 ₽',
    color: 'from-purple-500 to-violet-600',
  },
  {
    slug: 'iso',
    title: 'Сертификация ISO',
    description: 'Международные стандарты качества ISO 9001, 14001, 22000',
    icon: 'globe',
    price: 'от 35 000 ₽',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    slug: 'pozharnyj-sertifikat',
    title: 'Пожарный сертификат',
    description: 'Сертификация пожарной безопасности продукции',
    icon: 'fire',
    price: 'от 18 000 ₽',
    color: 'from-orange-500 to-red-600',
  },
  {
    slug: 'registratsiya-mi',
    title: 'Регистрация медизделий',
    description: 'Регистрация медицинских изделий в Росздравнадзоре',
    icon: 'medical',
    price: 'от 50 000 ₽',
    color: 'from-rose-500 to-pink-600',
  },
  {
    slug: 'hassp',
    title: 'ХАССП (HACCP)',
    description: 'Разработка и внедрение системы пищевой безопасности',
    icon: 'shield',
    price: 'от 30 000 ₽',
    color: 'from-amber-500 to-orange-600',
  },
];

function ServiceIcon({ type, className }: { type: string; className?: string }) {
  const icons: Record<string, React.ReactElement> = {
    certificate: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>,
    declaration: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg>,
    check: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    sgr: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
    globe: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" /></svg>,
    fire: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" /></svg>,
    medical: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    shield: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
  };
  return icons[type] || icons.certificate;
}

export default function VidySertifikaciiPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero секция - ФИРМЕННЫЙ СИНИЙ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-blue"></div>
        <div className="absolute inset-0 bg-dots opacity-30"></div>
        <div className="relative py-16">
          <div className="container mx-auto px-4">
            <nav className="text-sm mb-6 text-blue-200">
              <Link href="/" className="hover:text-white transition-colors">Главная</Link>
              <span className="mx-2">/</span>
              <span className="text-white">Виды сертификации</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              Виды сертификации
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl">
              Полный спектр услуг по оформлению разрешительной документации.
              Работаем со всеми видами сертификатов и деклараций.
            </p>
          </div>
        </div>
        {/* Волна */}
        <svg viewBox="0 0 1440 60" fill="none" className="w-full">
          <path d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 32.5C840 35 960 40 1080 42.5C1200 45 1320 45 1380 45L1440 45V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0V60Z" fill="#f8fafc"/>
        </svg>
      </section>

      {/* Каталог услуг */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {CERTIFICATION_TYPES.map((type) => (
              <Link
                key={type.slug}
                href={`/vidy-sertifikacii/${type.slug}`}
                className="card-3d group bg-white rounded-2xl p-6 border border-slate-200"
              >
                <div className={`w-14 h-14 flex items-center justify-center bg-gradient-to-br ${type.color} rounded-xl mb-5 text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <ServiceIcon type={type.icon} className="w-7 h-7" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {type.title}
                </h2>
                <p className="text-slate-500 mb-4 text-sm line-clamp-2">
                  {type.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-lg font-bold text-gradient-orange">{type.price}</span>
                  <span className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">
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
          <button className="btn-premium bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-glow-orange hover:from-orange-600 hover:to-orange-700 transition-all">
            Получить консультацию
          </button>
        </div>
      </section>
    </div>
  );
}
