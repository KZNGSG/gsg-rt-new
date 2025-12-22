'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SITE_CONFIG, MAIN_NAV } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Градиентная линия сверху - премиум акцент */}
      <div className="h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 fixed top-0 left-0 right-0 z-[60]" />

      <header className={cn(
        'sticky top-1 z-50 transition-all duration-500',
        isScrolled
          ? 'bg-white/80 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border-b border-slate-200/50'
          : 'bg-white'
      )}>
        {/* Верхняя полоса - компактная при скролле */}
        <div className={cn(
          'bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/60 transition-all duration-500 overflow-hidden',
          isScrolled ? 'max-h-0 py-0 opacity-0' : 'max-h-20 py-2.5 opacity-100'
        )}>
          <div className="container mx-auto px-4 flex justify-between items-center text-sm">
            {/* Адрес слева */}
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm shadow-blue-500/30">
                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </span>
              <span className="font-medium text-slate-700">{SITE_CONFIG.address.full}</span>
            </div>

            {/* Время работы и почта справа */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2.5 text-slate-500">
                <span className="w-6 h-6 rounded-full bg-slate-200/80 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <span className="text-slate-600">{SITE_CONFIG.workingHours}</span>
              </div>
              <a href={`mailto:${SITE_CONFIG.email}`} className="flex items-center gap-2.5 text-slate-600 hover:text-blue-600 transition-colors group">
                <span className="w-6 h-6 rounded-full bg-slate-200/80 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                  <svg className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </span>
                {SITE_CONFIG.email}
              </a>
            </div>
          </div>
        </div>

        {/* Основная навигация */}
        <div className="container mx-auto px-4">
          <div className={cn(
            'flex justify-between items-center transition-all duration-500',
            isScrolled ? 'h-16' : 'h-20'
          )}>
            {/* Логотип */}
            <Link href="/" className="flex items-center group relative">
              <div className="absolute -inset-3 bg-blue-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Image
                src="/logo.svg"
                alt="ГОСТСЕРТГРУПП"
                width={200}
                height={50}
                className={cn(
                  'w-auto transition-all duration-300 relative',
                  isScrolled ? 'h-9' : 'h-11'
                )}
                priority
              />
            </Link>

            {/* Десктопное меню */}
            <nav className="hidden lg:flex items-center gap-1">
              {MAIN_NAV.map((item) => (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => item.children && setActiveDropdown(item.href)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'px-4 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 relative group',
                      item.highlight
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02]'
                        : 'text-slate-600 hover:text-slate-900'
                    )}
                  >
                    {/* Hover background для обычных пунктов */}
                    {!item.highlight && (
                      <span className="absolute inset-0 bg-slate-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}

                    {item.highlight && (
                      <svg className="w-4 h-4 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    )}
                    <span className="relative">{item.label}</span>
                    {item.children && (
                      <svg className={cn(
                        "w-4 h-4 transition-transform duration-300 relative",
                        activeDropdown === item.href && "rotate-180"
                      )} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>

                  {/* Выпадающее меню - улучшенное */}
                  {item.children && activeDropdown === item.href && (
                    <div className="absolute top-full left-0 mt-3 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-200/60 py-3 animate-fadeIn overflow-hidden">
                      {/* Градиентная линия сверху */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

                      {item.children.map((child, idx) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="group flex items-center gap-4 px-5 py-3.5 text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                          style={{ animationDelay: `${idx * 50}ms` }}
                        >
                          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 group-hover:from-blue-100 group-hover:to-indigo-100 flex items-center justify-center transition-all duration-300 shadow-sm group-hover:shadow-md group-hover:scale-105">
                            <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </span>
                          <div>
                            <span className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">{child.label}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Телефон и кнопка */}
            <div className="flex items-center gap-5">
              {/* Телефон - крупнее и заметнее */}
              <a
                href={`tel:${SITE_CONFIG.phoneClean}`}
                className="hidden md:flex flex-col items-end group"
              >
                <div className="font-bold text-xl text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">
                  {SITE_CONFIG.phone}
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Бесплатно по России
                </div>
              </a>

              {/* CTA кнопка - с градиентом и glow */}
              <button className="hidden sm:flex items-center gap-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 hover:scale-[1.03] relative overflow-hidden group">
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <svg className="w-5 h-5 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="relative">Заказать звонок</span>
              </button>

              {/* Мобильное меню кнопка */}
              <button
                className="lg:hidden p-2.5 rounded-xl hover:bg-slate-100 transition-all duration-300 relative group"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <div className="absolute inset-0 bg-blue-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <svg className="w-6 h-6 text-slate-700 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Мобильное меню - улучшенное */}
        <div className={cn(
          'lg:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl overflow-hidden transition-all duration-500',
          isMobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        )}>
          <nav className="container mx-auto px-4 py-6">
            {MAIN_NAV.map((item, idx) => (
              <div
                key={item.href}
                className="border-b border-slate-100 last:border-0"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'block py-4 font-medium transition-all duration-300',
                    item.highlight
                      ? 'text-blue-600 flex items-center gap-2'
                      : 'text-slate-700 hover:text-blue-600 hover:pl-2'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.highlight && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                  {item.label}
                </Link>
              </div>
            ))}
            <div className="pt-6 space-y-4">
              <a href={`tel:${SITE_CONFIG.phoneClean}`} className="block text-center">
                <div className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {SITE_CONFIG.phone}
                </div>
                <div className="text-sm text-slate-500 flex items-center justify-center gap-2 mt-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Бесплатно по России
                </div>
              </a>
              <button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/30 transition-all duration-300 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Заказать звонок
              </button>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
