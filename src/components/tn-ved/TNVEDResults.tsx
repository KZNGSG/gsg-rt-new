'use client';

import { useState } from 'react';
import { type TNVEDItem, TECHNICAL_REGULATIONS } from '@/data/tn-ved-database';

interface TNVEDResultsProps {
  item: TNVEDItem;
}

export function TNVEDResults({ item }: TNVEDResultsProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    comment: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const regulations = item.regulations
    .map((code) => TECHNICAL_REGULATIONS[code])
    .filter(Boolean);

  const totalMinPrice = item.documents.reduce((sum, doc) => {
    const price = parseInt(doc.price.replace(/\D/g, '')) || 0;
    return sum + price;
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Отправка в CRM (webhook)
    try {
      const payload = {
        ...formData,
        tnved_code: item.code,
        tnved_name: item.name,
        documents: item.documents.map(d => d.name).join(', '),
        regulations: regulations.map(r => r.code).join(', '),
        source: 'tn-ved-module',
      };

      // В продакшене здесь будет реальный вызов
      console.log('Submitting to CRM:', payload);

      // Имитация отправки
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Заявка отправлена!</h3>
        <p className="text-slate-600 mb-6">
          Наш эксперт свяжется с вами в течение 15 минут для уточнения деталей
        </p>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setShowForm(false);
            setFormData({ name: '', phone: '', email: '', company: '', comment: '' });
          }}
          className="text-blue-600 font-medium hover:text-blue-700"
        >
          Сделать новый поиск
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-3">
              ТН ВЭД {item.code}
            </span>
            <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
            <p className="text-blue-100">{item.description}</p>
          </div>
        </div>
      </div>

      {/* Применимые регламенты */}
      {regulations.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Применимые технические регламенты
          </h3>
          <div className="space-y-3">
            {regulations.map((reg) => (
              <div key={reg.code} className="p-4 bg-slate-50 rounded-xl">
                <div className="font-semibold text-blue-600 mb-1">{reg.code}</div>
                <div className="font-medium text-slate-900 mb-1">{reg.name}</div>
                <div className="text-sm text-slate-500">{reg.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Необходимые документы */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Необходимые документы
        </h3>
        <div className="space-y-3">
          {item.documents.map((doc, index) => (
            <div key={index} className="p-4 border border-slate-200 rounded-xl hover:border-blue-200 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-block w-2 h-2 rounded-full ${
                      doc.type === 'certificate' ? 'bg-green-500' :
                      doc.type === 'declaration' ? 'bg-blue-500' :
                      doc.type === 'registration' ? 'bg-purple-500' :
                      'bg-slate-400'
                    }`} />
                    <span className="font-medium text-slate-900">{doc.name}</span>
                  </div>
                  <p className="text-sm text-slate-500">{doc.description}</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-blue-600">{doc.price}</div>
                  <div className="text-sm text-slate-400">{doc.duration}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Примечания */}
        {item.notes && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm text-amber-800">{item.notes}</p>
            </div>
          </div>
        )}

        {/* Итого */}
        <div className="mt-6 p-4 bg-slate-900 rounded-xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-400 text-sm mb-1">Ориентировочная стоимость</div>
              <div className="text-2xl font-bold">от {totalMinPrice.toLocaleString('ru-RU')} ₽</div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold transition-colors"
            >
              Получить точный расчёт
            </button>
          </div>
        </div>
      </div>

      {/* Форма заявки */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Заявка на расчёт</h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Выбранный товар */}
            <div className="p-3 bg-blue-50 rounded-xl mb-6">
              <div className="text-sm text-blue-600 font-medium">ТН ВЭД {item.code}</div>
              <div className="font-medium text-slate-900">{item.name}</div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Ваше имя *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="Иван Иванов"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Телефон *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="+7 (___) ___-__-__"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="email@company.ru"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Название компании
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="ООО «Компания»"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Комментарий
                </label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                  placeholder="Дополнительная информация о продукции..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Отправка...
                  </>
                ) : (
                  'Отправить заявку'
                )}
              </button>

              <p className="text-xs text-slate-400 text-center">
                Нажимая кнопку, вы соглашаетесь с{' '}
                <a href="/privacy" className="text-blue-500 hover:underline">
                  политикой конфиденциальности
                </a>
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
