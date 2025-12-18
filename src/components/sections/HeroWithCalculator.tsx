'use client';

import React from 'react';
import { SmartCalculator } from '@/components/calculator';

// Плавающие элементы для фона
function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Большие размытые круги */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-orange-500/10 to-transparent blur-[100px] animate-float" style={{animationDelay: '0s'}}></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-400/15 to-transparent blur-[80px] animate-float" style={{animationDelay: '2s'}}></div>
      
      {/* Плавающие иконки документов */}
      <div className="absolute top-[15%] left-[8%] w-16 h-20 glass rounded-xl opacity-30 animate-float-slow" style={{animationDelay: '0s'}}>
        <div className="w-full h-full flex items-center justify-center">
          <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
          </svg>
        </div>
      </div>
      
      <div className="absolute top-[25%] right-[12%] w-14 h-18 glass rounded-lg opacity-20 animate-float-slow" style={{animationDelay: '1s'}}>
        <div className="w-full h-full flex items-center justify-center">
          <svg className="w-7 h-7 text-white/60" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
      </div>
      
      <div className="absolute bottom-[20%] left-[15%] w-12 h-16 glass rounded-lg opacity-25 animate-float-slow" style={{animationDelay: '3s'}}>
        <div className="w-full h-full flex items-center justify-center">
          <svg className="w-6 h-6 text-white/60" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
          </svg>
        </div>
      </div>
      
      <div className="absolute bottom-[30%] right-[8%] w-14 h-18 glass rounded-lg opacity-20 animate-float-slow" style={{animationDelay: '2.5s'}}>
        <div className="w-full h-full flex items-center justify-center">
          <svg className="w-7 h-7 text-white/60" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export function HeroWithCalculator() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Премиум фон — фирменный синий */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(0, 119, 204, 0.9) 0%, rgba(0, 90, 160, 0.92) 35%, rgba(0, 70, 130, 0.95) 65%, rgba(0, 50, 100, 1) 100%)'
        }}
      ></div>
      
      {/* Мягкие световые эффекты */}
      <FloatingElements />
      
      {/* Сетка точек */}
      <div className="absolute inset-0 bg-dots opacity-10"></div>
      
      {/* Контент */}
      <div className="relative container mx-auto px-4 py-12 md:py-16 lg:py-20">
        {/* Верхняя полоса с преимуществами */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-10 md:mb-14 animate-fadeInUp">
          {[
            { icon: 'M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172', value: '12+ лет', label: 'опыта' },
            { icon: 'M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21', value: '60+', label: 'филиалов' },
            { icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z', value: '50 000+', label: 'документов' },
            { icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z', value: 'от 1 дня', label: 'срочно' },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                </svg>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-bold text-white">{stat.value}</span>
                <span className="text-sm text-white/70">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Калькулятор — центральный элемент */}
        <div className="animate-fadeInUp" style={{animationDelay: '0.1s'}}>
          <SmartCalculator />
        </div>
        
        {/* Нижняя полоса с доверием */}
        <div className="mt-12 md:mt-16 text-center animate-fadeInUp" style={{animationDelay: '0.3s'}}>
          <p className="text-white/60 text-sm mb-4">Нам доверяют крупнейшие компании России</p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 opacity-60">
            {['Газпром', 'Лукойл', 'Татнефть', 'Мечел', 'Eriell'].map((name, i) => (
              <div key={i} className="text-white/80 font-semibold text-sm md:text-base">
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
