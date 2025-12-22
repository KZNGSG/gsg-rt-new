'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Hero } from '@/components/sections/Hero';

const SERVICES = [
  { title: 'Сертификат ТР ТС', desc: 'Обязательная сертификация продукции в рамках ЕАЭС', price: 'от 12 000', href: '/sertifikat-tr-ts', icon: 'certificate', color: 'from-emerald-500 to-green-600' },
  { title: 'Декларация ТР ТС', desc: 'Декларирование соответствия техрегламентам', price: 'от 8 000', href: '/deklaraciya-tr-ts', icon: 'declaration', color: 'from-blue-500 to-indigo-600' },
  { title: 'Регистрация МИ', desc: 'Регистрационное удостоверение Росздравнадзора', price: 'от 80 000', href: '/vidy-sertifikacii/registratsiya-mi', icon: 'medical', color: 'from-rose-500 to-pink-600' },
  { title: 'ХАССП', desc: 'Внедрение системы пищевой безопасности', price: 'от 25 000', href: '/vidy-sertifikacii/hassp', icon: 'shield', color: 'from-amber-500 to-orange-600' },
  { title: 'СГР', desc: 'Свидетельство о государственной регистрации', price: 'от 25 000', href: '/vidy-sertifikacii/sgr', icon: 'sgr', color: 'from-purple-500 to-violet-600' },
  { title: 'ГОСТ Р', desc: 'Добровольная сертификация качества', price: 'от 15 000', href: '/vidy-sertifikacii/gost-r', icon: 'check', color: 'from-cyan-500 to-blue-600' },
  { title: 'Эко-сертификат', desc: 'Экологическая сертификация продукции', price: 'от 20 000', href: '/vidy-sertifikacii/eco', icon: 'leaf', color: 'from-green-500 to-emerald-600' },
  { title: 'Отказное письмо', desc: 'Письмо об отсутствии необходимости сертификации', price: 'от 5 000', href: '/vidy-sertifikacii/otkaznoe-pismo', icon: 'envelope', color: 'from-slate-500 to-slate-600' },
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
  { company: 'Краснодарский МЗ', image: '/reviews/otzyv-krasnodarskii-masochnyi-zavod.jpg' },
  { company: 'Раунд Логистик', image: '/reviews/otzyv-raund-logistik.jpg' },
  { company: 'Бегельманн', image: '/reviews/informatsionnoe-pismo-31_page-0001.jpg' },
  { company: 'У-У ППО', image: '/reviews/otzyv-ao-u-u-ppo.jpg' },
  { company: 'Медпромторг', image: '/reviews/otzyv-medpromtorg.jpg' },
  { company: 'СПИН', image: '/reviews/otzyv-1.jpg' },
  { company: 'Сфера', image: '/reviews/ooo-sfera-blagodarstvennoe-pismo_page-0001.jpg' },
  { company: 'КАРО', image: '/reviews/blagodarstvennoe-pismo_page-0001.jpg' },
];

const ADVANTAGES = [
  { icon: 'certificate', title: 'Аккредитованные органы', desc: 'Работаем только с официальными аккредитованными органами сертификации' },
  { icon: 'money', title: 'Фиксированные цены', desc: 'Никаких скрытых платежей — цена фиксируется в договоре' },
  { icon: 'chat', title: 'Поддержка 24/7', desc: 'Личный менеджер на связи в любое время' },
  { icon: 'bolt', title: 'Срочное оформление', desc: 'Документы от 1 рабочего дня — ускоренное оформление' },
];

function ServiceIcon({ type, className }: { type: string; className?: string }) {
  const icons: Record<string, React.ReactElement> = {
    certificate: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>,
    declaration: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg>,
    medical: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    shield: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
    sgr: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
    check: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    leaf: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036" /></svg>,
    envelope: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z" /></svg>,
    money: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>,
    chat: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" /></svg>,
    bolt: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
    trophy: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m3.044 0a6.726 6.726 0 002.749-1.35m0 0a6.772 6.772 0 01-3.044-6.222M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728" /></svg>,
    building: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" /></svg>,
    document: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
    clock: <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  };
  return icons[type] || icons.certificate;
}

function ReviewsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -400 : 400,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>
        
        <button onClick={() => scroll('left')} className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white hover:bg-blue-50 rounded-xl shadow-premium flex items-center justify-center transition-all hover:scale-110 border border-slate-200 group">
          <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button onClick={() => scroll('right')} className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white hover:bg-blue-50 rounded-xl shadow-premium flex items-center justify-center transition-all hover:scale-110 border border-slate-200 group">
          <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>

        <div ref={scrollRef} className="flex gap-5 overflow-x-auto scrollbar-hide px-4 py-6 scroll-smooth">
          {REVIEWS.map((review, index) => (
            <div key={index} onClick={() => { setModalImage(review.image); setIsModalOpen(true); }} className="flex-shrink-0 w-40 h-52 bg-white rounded-2xl shadow-premium overflow-hidden cursor-pointer hover:shadow-premium-lg hover-lift border-2 border-slate-100 hover:border-blue-300 group">
              <div className="relative w-full h-full">
                <img src={review.image} alt={`Отзыв ${review.company}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-3 left-3 right-3"><span className="text-white text-sm font-bold">{review.company}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={() => setIsModalOpen(false)}>
          <button className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all text-white" onClick={() => setIsModalOpen(false)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <img src={modalImage} alt="Отзыв" className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl animate-scaleIn" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}

// Анимированный счётчик
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isVisible) setIsVisible(true);
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const duration = 2000;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isVisible, value]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Home() {
  return (
    <>
      <Hero />

      {/* Секция услуг */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-100/50 rounded-full blur-3xl"></div>
        
        <div className="relative container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between gap-4 mb-12">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-bold rounded-full mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                Наши услуги
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900">
                Полный спектр <span className="text-gradient-blue">сертификации</span>
              </h2>
            </div>
            <Link href="/vidy-sertifikacii" className="group flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-lg transition-colors">
              Все услуги
              <span className="w-8 h-8 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-all group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.map((service) => (
              <Link key={service.href} href={service.href} className="card-3d group bg-white rounded-2xl p-6 border border-slate-200">
                <div className={`w-14 h-14 flex items-center justify-center bg-gradient-to-br ${service.color} rounded-2xl mb-5 text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <ServiceIcon type={service.icon} className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{service.title}</h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">{service.desc}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-xl font-black text-gradient-orange">{service.price} ₽</span>
                  <span className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-50"></div>
        
        <div className="relative container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-700 text-sm font-bold rounded-full mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Почему мы
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">
              Работаем на <span className="text-gradient-blue">результат</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {ADVANTAGES.map((item, i) => (
              <div key={i} className="group bg-white rounded-2xl p-6 shadow-premium border border-slate-100 hover:shadow-premium-lg hover-lift transition-all">
                <div className="w-12 h-12 mb-4 rounded-xl bg-blue-100 group-hover:bg-blue-600 flex items-center justify-center text-blue-600 group-hover:text-white transition-all">
                  <ServiceIcon type={item.icon} className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Счётчики */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-mesh-blue rounded-3xl shadow-glow-blue">
            {[
              { value: 12, suffix: '+', label: 'лет опыта', icon: 'trophy' },
              { value: 60, suffix: '+', label: 'филиалов', icon: 'building' },
              { value: 50000, suffix: '+', label: 'документов', icon: 'document' },
              { value: 99, suffix: '%', label: 'довольных клиентов', icon: 'check' },
            ].map((stat) => (
              <div key={stat.label} className="text-center text-white">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-white/10 flex items-center justify-center">
                  <ServiceIcon type={stat.icon} className="w-6 h-6" />
                </div>
                <div className="text-4xl md:text-5xl font-black mb-1">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-blue-200 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Клиенты */}
          <div className="mt-16 text-center">
            <p className="text-slate-500 font-medium mb-8">Нам доверяют крупнейшие компании России</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
              {CLIENTS.map((client) => (
                <img key={client.name} src={client.logo} alt={client.name} className="h-10 md:h-14 w-auto object-contain opacity-70 hover:opacity-100 grayscale hover:grayscale-0 transition-all hover:scale-110" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Отзывы */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between gap-4 mb-10">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-100 text-purple-700 text-sm font-bold rounded-full mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                Отзывы клиентов
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900">
                Благодарственные <span className="text-gradient-blue">письма</span>
              </h2>
              <p className="text-slate-500 mt-2">Более {REVIEWS.length} отзывов от довольных клиентов</p>
            </div>
          </div>
          <ReviewsCarousel />
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-mesh-blue"></div>
        <div className="absolute inset-0 bg-dots opacity-30"></div>
        
        <div className="relative container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                Нужна консультация?
              </h2>
              <p className="text-xl text-blue-100">
                Позвоните или оставьте заявку — перезвоним за <span className="font-bold text-white">5 минут</span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <a href="tel:88005505288" className="group flex items-center gap-4">
                <div className="w-14 h-14 glass rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                </div>
                <div>
                  <div className="text-3xl font-black text-white group-hover:text-orange-300 transition-colors">8 800 550-52-88</div>
                  <div className="text-blue-200 text-sm">Бесплатно по России</div>
                </div>
              </a>
              <button className="btn-premium ring-pulse bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-10 py-5 rounded-2xl shadow-glow-orange text-lg">
                Заказать звонок →
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
