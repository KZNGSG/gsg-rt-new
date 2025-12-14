import { Metadata } from 'next';
import { TNVEDSearch } from '@/components/tn-ved';

export const metadata: Metadata = {
  title: 'Определитель документов по ТН ВЭД | ГостСертГрупп',
  description: 'Узнайте, какие документы нужны для вашего товара. Введите код ТН ВЭД или название продукции и получите список необходимых сертификатов и деклараций.',
  keywords: 'ТН ВЭД, код товара, сертификация, декларация, технический регламент, ТР ТС, документы на товар',
};

export default function TNVEDPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero секция */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full text-blue-300 text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Бесплатный инструмент
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Определитель документов{' '}
              <span className="text-blue-400">по ТН ВЭД</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Введите код ТН ВЭД или название товара — узнайте, какие документы нужны
              для ввоза и продажи на территории ЕАЭС
            </p>

            {/* Статистика */}
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-white">20+</div>
                <div className="text-slate-400 text-sm">регламентов ТР ТС</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">1000+</div>
                <div className="text-slate-400 text-sm">кодов ТН ВЭД</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">15 мин</div>
                <div className="text-slate-400 text-sm">ответ эксперта</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Основная секция с поиском */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <TNVEDSearch />
        </div>
      </section>

      {/* FAQ секция */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-10">
              Часто задаваемые вопросы
            </h2>

            <div className="space-y-4">
              {[
                {
                  q: 'Что такое ТН ВЭД?',
                  a: 'ТН ВЭД (Товарная номенклатура внешнеэкономической деятельности) — это классификатор товаров, используемый для таможенного оформления. Каждому товару присваивается уникальный код из 10 цифр.',
                },
                {
                  q: 'Как узнать код ТН ВЭД моего товара?',
                  a: 'Код ТН ВЭД можно найти в товаросопроводительных документах, на сайте ФТС России, или обратиться к нашим экспертам — мы бесплатно поможем определить код.',
                },
                {
                  q: 'Обязательна ли сертификация?',
                  a: 'Для большинства товаров, ввозимых на территорию ЕАЭС, требуется обязательное подтверждение соответствия (сертификат или декларация ТР ТС). Без этих документов товар нельзя легально продавать.',
                },
                {
                  q: 'Сколько стоит сертификация?',
                  a: 'Стоимость зависит от типа продукции, схемы сертификации и количества документов. Введите код ТН ВЭД выше, чтобы получить ориентировочную стоимость, или оставьте заявку для точного расчёта.',
                },
                {
                  q: 'Какие документы нужны для сертификации?',
                  a: 'Базовый пакет: учредительные документы, описание продукции, контракт с производителем (для импорта), образцы для испытаний. Точный список зависит от типа продукции.',
                },
              ].map((item, i) => (
                <details
                  key={i}
                  className="group p-4 bg-slate-50 rounded-xl cursor-pointer"
                >
                  <summary className="flex items-center justify-between font-semibold text-slate-900 list-none">
                    {item.q}
                    <svg
                      className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <p className="mt-3 text-slate-600">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA секция */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Не нашли свой товар?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Наши эксперты бесплатно определят код ТН ВЭД и подберут необходимые документы для вашей продукции
          </p>
          <a
            href="/kontakty"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold text-lg px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
          >
            Получить консультацию
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>
    </main>
  );
}
