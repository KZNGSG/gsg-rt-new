'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Hero } from '@/components/sections/Hero';

const SERVICES = [
  { title: 'Сертификат ТР ТС', desc: 'Обязательная сертификация продукции в рамках ЕАЭС', price: 'от 12 000', slug: 'sertifikat-tr-ts', emoji: '✅', color: 'from-emerald-500 to-green-600' },
  { title: 'Декларация ТР ТС', desc: 'Декларирование соответствия техрегламентам', price: 'от 8 000', slug: 'deklarirovanie', emoji: '📋', color: 'from-blue-500 to-indigo-600' },
  { title: 'Регистрация МИ', desc: 'Регистрационное удостоверение Росздравнадзора', price: 'от 80 000', slug: 'registratsiya-medizdeliy', emoji: '⚕️', color: 'from-rose-500 to-pink-600' },
  { title: 'ХАССП', desc: 'Внедрение системы пищевой безопасности', price: 'от 25 000', slug: 'hassp', emoji: '🛡️', color: 'from-amber-500 to-orange-600' },
  { title: 'СГР', desc: 'Свидетельство о государственной регистрации', price: 'от 25 000', slug: 'sgr', emoji: '📜', color: 'from-purple-500 to-violet-600' },
  { title: 'ГОСТ Р', desc: 'Добровольная сертификация качества', price: 'от 15 000', slug: 'gost-r', emoji: '🎯', color: 'from-cyan-500 to-blue-600' },
  { title: 'Эко-сертификат', desc: 'Экологическая сертификация продукции', price: 'от 20 000', slug: 'eco', emoji: '🌿', color: 'from-green-500 to-emerald-600' },
  { title: 'Отказное письмо', desc: 'Письмо об отсутствии необходимости сертификации', price: 'от 5 000', slug: 'otkaznoe-pismo', emoji: '📝', color: 'from-slate-500 to-slate-600' },
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
  { emoji: '🏆', title: 'Аккредитованные органы', desc: 'Работаем только с официальными аккредитованными органами сертификации' },
  { emoji: '💰', title: 'Фиксированные цены', desc: 'Никаких скрытых платежей — цена фиксируется в договоре' },
  { emoji: '💬', title: 'Поддержка 24/7', desc: 'Личный менеджер на связи в любое время' },
  { emoji: '⚡', title: 'Срочное оформление', desc: 'Документы от 1 рабочего дня — ускоренное оформление' },
];

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
        
        <button
          onClick={() => scroll('left')}
          className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white hover:bg-blue-50 rounded-2xl shadow-premium flex items-center justify-center transition-all hover:scale-110 border border-slate-200 group"
        >
          <svg className="w-6 h-6 text-slate-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white hover:bg-blue-50 rounded-2xl shadow-premium flex items-center justify-center transition-all hover:scale-110 border border-slate-200 group"
        >
          <svg className="w-6 h-6 text-slate-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div ref={scrollRef} className="flex gap-5 overflow-x-auto scrollbar-hide px-4 py-6 scroll-smooth">
          {REVIEWS.map((review, index) => (
            <div
              key={index}
              onClick={() => { setModalImage(review.image); setIsModalOpen(true); }}
              className="flex-shrink-0 w-40 h-52 bg-white rounded-2xl shadow-premium overflow-hidden cursor-pointer hover:shadow-premium-lg hover-lift border-2 border-slate-100 hover:border-blue-300 group"
            >
              <div className="relative w-full h-full">
                <img src={review.image} alt={`Отзыв ${review.company}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="text-white text-sm font-bold">{review.company}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={() => setIsModalOpen(false)}>
          <button className="absolute top-6 right-6 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all text-white text-2xl" onClick={() => setIsModalOpen(false)}>
            ✕
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
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

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
      if (progress < 1) {
        requestAnimationFrame(step);
      }
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
        {/* Декоративный фон */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-100/50 rounded-full blur-3xl"></div>
        
        <div className="relative container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between gap-4 mb-12">
            <div>
              <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-bold rounded-full mb-4">
                💼 Наши услуги
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900">
                Полный спектр 
                <span className="text-gradient-blue"> сертификации</span>
              </h2>
            </div>
            <Link href="/vidy-sertifikacii" className="group flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold text-lg transition-colors">
              Все услуги
              <span className="w-8 h-8 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center transition-all group-hover:translate-x-1">→</span>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.map((service, idx) => (
              <Link
                key={service.slug}
                href={`/vidy-sertifikacii/${service.slug}`}
                className="card-3d group bg-white rounded-2xl p-6 border border-slate-200"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className={`w-14 h-14 flex items-center justify-center bg-gradient-to-br ${service.color} rounded-2xl mb-5 text-2xl shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  {service.emoji}
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{service.title}</h3>
                <p className="text-slate-500 text-sm mb-4 line-clamp-2">{service.desc}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-xl font-black text-gradient-orange">{service.price} ₽</span>
                  <span className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">
                    →
                  </span>
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
            <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 text-sm font-bold rounded-full mb-4">
              ✨ Почему мы
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900">
              Работаем на <span className="text-gradient-blue">результат</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {ADVANTAGES.map((item, i) => (
              <div key={i} className="group bg-white rounded-2xl p-6 shadow-premium border border-slate-100 hover:shadow-premium-lg hover-lift transition-all">
                <div className="text-4xl mb-4 group-hover:scale-125 transition-transform">{item.emoji}</div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Счётчики */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-3xl shadow-glow-blue">
            {[
              { value: 12, suffix: '+', label: 'лет опыта' },
              { value: 60, suffix: '+', label: 'филиалов' },
              { value: 50000, suffix: '+', label: 'документов' },
              { value: 99, suffix: '%', label: 'довольных клиентов' },
            ].map((stat) => (
              <div key={stat.label} className="text-center text-white">
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
              <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 text-sm font-bold rounded-full mb-4">
                💜 Отзывы клиентов
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900">
                Благодарственные <span className="text-gradient-blue">письма</span>
              </h2>
              <p className="text-slate-500 mt-2">Более {REVIEWS.length} отзывов от довольных клиентов</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-slate-500">
              <span className="animate-pulse">👆</span>
              <span className="text-sm font-medium">Нажмите для просмотра</span>
            </div>
          </div>
          <ReviewsCarousel />
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-mesh-blue"></div>
        <div className="absolute inset-0 bg-dots"></div>
        
        {/* Плавающие элементы */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-2xl animate-float rotate-12"></div>
        <div className="absolute bottom-10 right-20 w-16 h-16 bg-orange-500/20 rounded-full animate-float-reverse"></div>
        
        <div className="relative container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
                Нужна консультация? 📞
              </h2>
              <p className="text-xl text-blue-100">
                Позвоните или оставьте заявку — перезвоним за <span className="font-bold text-white">5 минут</span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <a href="tel:88005505288" className="group flex items-center gap-4">
                <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  📱
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
