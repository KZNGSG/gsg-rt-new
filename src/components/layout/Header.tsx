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
    <header className={cn(
      'sticky top-0 z-50 transition-all duration-300',
      isScrolled 
        ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-slate-900/5' 
        : 'bg-white'
    )}>
      {/* Верхняя полоса */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="container mx-auto px-4 py-2 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-slate-600">
              <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </span>
              <span className="font-medium">г. {SITE_CONFIG.address.city}</span>
            </span>
            <a href={`mailto:${SITE_CONFIG.email}`} className="hidden sm:flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              {SITE_CONFIG.email}
            </a>
          </div>
          <div className="hidden md:flex items-center gap-3 text-slate-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {SITE_CONFIG.workingHours}
          </div>
        </div>
      </div>

      {/* Основная навигация */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Логотип */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/logo.svg"
              alt="ГОСТСЕРТГРУПП"
              width={200}
              height={50}
              className="h-12 w-auto transition-transform group-hover:scale-105"
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
                    'px-4 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-1.5',
                    item.highlight
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-600/30'
                      : 'hover:bg-slate-100 text-slate-700 hover:text-blue-600'
                  )}
                >
                  {item.highlight && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                  {item.label}
                  {item.children && (
                    <svg className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      activeDropdown === item.href && "rotate-180"
                    )} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>

                {/* Выпадающее меню */}
                {item.children && activeDropdown === item.href && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl shadow-slate-900/10 border border-slate-100 py-2 animate-fadeIn overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600"></div>
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="group flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
                      >
                        <span className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                          <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </span>
                        <span className="font-medium">{child.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Телефон и кнопка */}
          <div className="flex items-center gap-4">
            <a
              href={`tel:${SITE_CONFIG.phoneClean}`}
              className="hidden md:flex flex-col items-end group"
            >
              <div className="font-bold text-xl text-slate-900 group-hover:text-blue-600 transition-colors">
                {SITE_CONFIG.phone}
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-soft"></span>
                Бесплатно по России
              </div>
            </a>

            <button className="hidden sm:flex btn-premium items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-lg shadow-orange transition-all hover:scale-105">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Заказать звонок
            </button>

            {/* Мобильное меню кнопка */}
            <button
              className="lg:hidden p-2.5 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Мобильное меню */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white animate-fadeIn">
          <nav className="container mx-auto px-4 py-6">
            {MAIN_NAV.map((item) => (
              <div key={item.href} className="border-b border-slate-100 last:border-0">
                <Link
                  href={item.href}
                  className={cn(
                    'block py-4 font-medium transition-colors',
                    item.highlight
                      ? 'text-blue-600 flex items-center gap-2'
                      : 'text-slate-700'
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
                <div className="font-bold text-2xl text-blue-600">{SITE_CONFIG.phone}</div>
                <div className="text-sm text-slate-500">Бесплатно по России</div>
              </a>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-lg shadow-orange transition-all">
                Заказать звонок
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
