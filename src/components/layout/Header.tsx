'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { SITE_CONFIG, MAIN_NAV } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Верхняя полоса — лёгкая и элегантная */}
      <div className="bg-slate-50 border-b border-slate-100 py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-600">
              <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span>г. {SITE_CONFIG.address.city}</span>
            </span>
            <a href={`mailto:${SITE_CONFIG.email}`} className="text-slate-600 hover:text-blue-600 transition-colors">
              {SITE_CONFIG.email}
            </a>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span className="text-slate-500">{SITE_CONFIG.workingHours}</span>
          </div>
        </div>
      </div>

      {/* Основная навигация */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Логотип */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="ГОСТСЕРТГРУПП - Центр сертификации"
              width={200}
              height={50}
              className="h-12 w-auto"
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
                    'px-4 py-2 rounded-lg font-medium transition-colors',
                    item.highlight
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'hover:bg-slate-100 text-slate-700 hover:text-blue-600'
                  )}
                >
                  {item.highlight && (
                    <svg className="inline-block w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
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
                  className={cn(
                    'block py-3 font-medium',
                    item.highlight
                      ? 'text-blue-600 flex items-center gap-2'
                      : 'text-slate-700'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.highlight && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
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
