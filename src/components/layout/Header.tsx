'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { SITE_CONFIG, MAIN_NAV } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Верхняя полоса */}
      <div className="bg-slate-900 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>г. {SITE_CONFIG.address.city}</span>
            </span>
            <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-blue-400 transition-colors">
              {SITE_CONFIG.email}
            </a>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span className="text-slate-400">{SITE_CONFIG.workingHours}</span>
          </div>
        </div>
      </div>

      {/* Основная навигация */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Логотип */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">ГС</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-xl text-slate-900">ГОСТСЕРТГРУПП</div>
              <div className="text-xs text-slate-500">Центр сертификации</div>
            </div>
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
                    'px-4 py-2 rounded-lg font-medium transition-colors',
                    'hover:bg-slate-100 text-slate-700 hover:text-blue-600'
                  )}
                >
                  {item.label}
                  {item.children && (
                    <svg className="inline-block w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>

                {/* Выпадающее меню */}
                {item.children && activeDropdown === item.href && (
                  <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-fadeIn">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2.5 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        {child.label}
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
              className="hidden md:block text-right"
            >
              <div className="font-bold text-xl text-slate-900">{SITE_CONFIG.phone}</div>
              <div className="text-xs text-slate-500">Бесплатно по России</div>
            </a>

            <Button variant="primary" size="md" className="hidden sm:flex">
              Заказать звонок
            </Button>

            {/* Мобильное меню кнопка */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
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
        <div className="lg:hidden border-t border-slate-100 bg-white">
          <nav className="container mx-auto px-4 py-4">
            {MAIN_NAV.map((item) => (
              <div key={item.href} className="border-b border-slate-100 last:border-0">
                <Link
                  href={item.href}
                  className="block py-3 font-medium text-slate-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="pl-4 pb-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block py-2 text-slate-500 hover:text-blue-600"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4">
              <a href={`tel:${SITE_CONFIG.phoneClean}`} className="block text-center">
                <div className="font-bold text-xl text-blue-600">{SITE_CONFIG.phone}</div>
              </a>
              <Button variant="primary" size="lg" className="w-full mt-4">
                Заказать звонок
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
