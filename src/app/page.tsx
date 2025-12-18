'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Hero } from '@/components/sections/Hero';

const SERVICES = [
  { title: 'Сертификат ТР ТС', desc: 'Обязательная сертификация продукции', price: 'от 12 000', slug: 'sertifikat-tr-ts', icon: 'certificate' },
  { title: 'Декларация ТР ТС', desc: 'Декларирование соответствия', price: 'от 8 000', slug: 'deklarirovanie', icon: 'declaration' },
  { title: 'Регистрация медизделий', desc: 'РУ Росздравнадзора', price: 'от 80 000', slug: 'registratsiya-medizdeliy', icon: 'medical' },
  { title: 'ХАССП', desc: 'Система пищевой безопасности', price: 'от 25 000', slug: 'hassp', icon: 'haccp' },
  { title: 'СГР', desc: 'Государственная регистрация', price: 'от 25 000', slug: 'sgr', icon: 'sgr' },
  { title: 'ГОСТ Р', desc: 'Добровольная сертификация', price: 'от 15 000', slug: 'gost-r', icon: 'gost' },
  { title: 'Эко-сертификат', desc: 'Экологическая сертификация', price: 'от 20 000', slug: 'eco', icon: 'eco' },
  { title: 'Отказное письмо', desc: 'Письмо об отсутствии необходимости', price: 'от 5 000', slug: 'otkaznoe-pismo', icon: 'letter' },
];

const CLIENTS = [
  { name: 'Газпром', logo: 'https://gsg-rt.ru/upload/iblock/88c/gazprom.png' },
  { name: 'Лукойл', logo: 'https://gsg-rt.ru/upload/iblock/8c1/lukoil.png' },
  { name: 'Татнефть', logo: 'https://gsg-rt.ru/upload/iblock/798/tatneft.png' },
  { name: 'Мечел', logo: 'https://gsg-rt.ru/upload/iblock/597/mechel.png' },
  { name: 'Eriell', logo: 'https://gsg-rt.ru/upload/iblock/005/eriell.png' },
];

const REVIEWS = [
  { company: 'Астекс', image: '/reviews/asteks-otzyv-scaled.jpg' },
  { company: 'Ивита', image: '/reviews/ivita-otzyv.jpeg' },
  { company: 'КинТекс', image: '/reviews/ooo-kinteks-otzyv.jpg' },
  { company: 'СИН', image: '/reviews/ooo-sin-otzyv.jpg' },
  { company: 'Ситимед', image: '/reviews/blagodarnost-za-ru1-1.jpg' },
  { company: 'Фарос Гигиена', image: '/reviews/otzyv-faros-gigiena-maska-odnorazovaya.jpg' },
  { company: 'Фарос Гигиена', image: '/reviews/otzyv-faros-gigena-respirator.jpg' },
  { company: 'Краснодарский МЗ', image: '/reviews/otzyv-krasnodarskii-masochnyi-zavod.jpg' },
  { company: 'Раунд Логистик', image: '/reviews/otzyv-raund-logistik.jpg' },
  { company: 'Чусовская ШФ', image: '/reviews/otzyv-chusovskaya-shvei-naya-fabrika.jpeg' },
  { company: 'Бегельманн', image: '/reviews/informatsionnoe-pismo-31_page-0001.jpg' },
  { company: 'У-У ППО', image: '/reviews/otzyv-ao-u-u-ppo.jpg' },
  { company: 'Медпромторг', image: '/reviews/otzyv-medpromtorg.jpg' },
  { company: 'ПКФ Астекс-Мед', image: '/reviews/otzy-gsg-1.jpg' },
  { company: 'СПИН', image: '/reviews/otzyv-1.jpg' },
  { company: 'Сфера', image: '/reviews/ooo-sfera-blagodarstvennoe-pismo_page-0001.jpg' },
  { company: 'Обнинская ТК', image: '/reviews/obninskaya-tekstilnaya-kompaniya-blagodarstvennoe-pismo_page-0001.jpg' },
  { company: 'Чусовская ШФ', image: '/reviews/ooo-chusovskaya-shvejnaya-fabrika.jpeg' },
  { company: 'КАРО', image: '/reviews/blagodarstvennoe-pismo_page-0001.jpg' },
];

const ADVANTAGES = [
  { icon: 'M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z', title: 'Аккредитованные органы', desc: 'Работаем с официальными органами сертификации' },
  { icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z', title: 'Фиксированные цены', desc: 'Без скрытых платежей и доплат' },
  { icon: 'M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155', title: 'Поддержка 24/7', desc: 'Консультируем по всем вопросам' },
  { icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Срочное оформление', desc: 'Документы от 1 рабочего дня' },
];

function ServiceIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactElement> = {
    certificate: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>,
    declaration: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg>,
    medical: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    haccp: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
    sgr: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
    gost: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    eco: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" /></svg>,
    letter: <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z" /></svg>,
  };
  return icons[type] || icons.certificate;
}

function ReviewsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <div className="relative">
        {/* Gradient edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>
        
        {/* Scroll buttons */}
        <button
          onClick={() => scroll('left')}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white hover:bg-blue-50 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 border border-slate-200"
        >
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white hover:bg-blue-50 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 border border-slate-200"
        >
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Scrollable container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-4 py-4 scroll-smooth"
        >
          {REVIEWS.map((review, index) => (
            <div
              key={index}
              onClick={() => { setModalImage(review.image); setIsModalOpen(true); }}
              className="flex-shrink-0 w-36 h-48 bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 border border-slate-200 hover:border-blue-300 group"
            >
              <div className="relative w-full h-full">
                <img
                  src={review.image}
                  alt={`Отзыв ${review.company}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-2 left-2 right-2">
                    <span className="text-white text-xs font-medium">{review.company}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          <button
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            onClick={() => setIsModalOpen(false)}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={modalImage}
            alt="Отзыв"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

export default function Home() {
  return (
    <>
      <Hero />

      {/* Секция услуг */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Наши услуги</h2>
              <p className="text-slate-500 mt-2">Полный спектр сертификации для вашего бизнеса</p>
            </div>
            <Link 
              href="/vidy-sertifikacii" 
              className="hidden md:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors group"
            >
              Все услуги
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICES.map((service) => (
              <Link
                key={service.slug}
                href={`/vidy-sertifikacii/${service.slug}`}
                className="group bg-white rounded-xl p-5 border border-slate-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg hover-lift"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-blue-50 group-hover:bg-blue-100 rounded-xl mb-4 text-blue-600 transition-colors">
                  <ServiceIcon type={service.icon} />
                </div>
                <h3 className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{service.title}</h3>
                <p className="text-slate-500 text-sm mb-3 line-clamp-2">{service.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-blue-600 font-bold">{service.price} ₽</span>
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Преимущества + Клиенты */}
      <section className="py-16 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          {/* Преимущества */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {ADVANTAGES.map((item, i) => (
              <div 
                key={i} 
                className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-200 transition-all group"
              >
                <div className="w-12 h-12 mb-4 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Разделитель */}
          <div className="text-center mb-8">
            <p className="text-slate-600 font-medium">Нам доверяют крупнейшие компании России</p>
          </div>

          {/* Логотипы клиентов */}
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
            {CLIENTS.map((client) => (
              <img 
                key={client.name} 
                src={client.logo} 
                alt={client.name} 
                className="h-10 md:h-12 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity grayscale-[20%] hover:grayscale-0" 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Отзывы */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Отзывы клиентов</h2>
              <p className="text-slate-500 mt-2">Более {REVIEWS.length} благодарственных писем</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-slate-500">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              <span className="text-sm">Нажмите для просмотра</span>
            </div>
          </div>
          <ReviewsCarousel />
        </div>
      </section>

      {/* CTA - СИНИЙ фирменный */}
      <section className="py-12 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Нужна консультация?</h2>
              <p className="text-blue-100">Позвоните нам или оставьте заявку — перезвоним за 5 минут</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a href="tel:88005505288" className="text-2xl font-bold text-white hover:text-orange-300 transition-colors">
                8 800 550-52-88
              </a>
              <button className="btn-premium ring-pulse bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-orange">
                Заказать звонок
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
