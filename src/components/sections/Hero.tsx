'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { SITE_CONFIG, ADVANTAGES } from '@/lib/constants';

export function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Фоновый паттерн */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Градиентные шары */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full filter blur-[120px] opacity-20" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500 rounded-full filter blur-[150px] opacity-15" />

      <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Левая часть - текст */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-blue-200 text-sm font-medium">
                Работаем с {SITE_CONFIG.foundedYear} года
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Сертификация
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                товаров и услуг
              </span>
            </h1>

            <p className="text-xl text-slate-300 mb-8 max-w-xl mx-auto lg:mx-0">
              Оформим сертификаты, декларации, СГР и другую разрешительную документацию.
              <strong className="text-white"> От 1 дня. </strong>
              Гарантия 100%.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button
                variant="secondary"
                size="xl"
                onClick={() => setIsModalOpen(true)}
                rightIcon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                }
              >
                Бесплатная консультация
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="border-white/30 text-white hover:bg-white hover:text-slate-900"
              >
                Рассчитать стоимость
              </Button>
            </div>

            {/* Преимущества */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {ADVANTAGES.map((item, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-white">{item.title.split(' ')[0]}</div>
                  <div className="text-sm text-slate-400">{item.title.split(' ').slice(1).join(' ')}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Правая часть - форма */}
          <div className="lg:pl-12">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Получите расчёт стоимости
                </h2>
                <p className="text-slate-600">
                  Ответим в течение 15 минут
                </p>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Ваше имя
                  </label>
                  <input
                    type="text"
                    placeholder="Как к вам обращаться?"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Телефон *
                  </label>
                  <input
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Что нужно сертифицировать?
                  </label>
                  <textarea
                    placeholder="Опишите вашу продукцию..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors resize-none"
                  />
                </div>

                <Button variant="primary" size="lg" className="w-full">
                  Получить расчёт бесплатно
                </Button>

                <p className="text-xs text-slate-500 text-center">
                  Нажимая кнопку, вы соглашаетесь с{' '}
                  <a href="/politika-konfidencialnosti" className="text-blue-600 hover:underline">
                    политикой конфиденциальности
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Волна внизу */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
