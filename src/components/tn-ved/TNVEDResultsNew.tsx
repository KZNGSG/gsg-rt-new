'use client';

import { useState } from 'react';
import { type TNVEDCode, getMarkingInfo } from '@/data/tn-ved-full';

interface TNVEDResultsNewProps {
  item: TNVEDCode;
}

// Определение регламентов по группе ТН ВЭД (первые 2 цифры)
function getRegulationsByCode(code: string): { code: string; name: string; type: 'certificate' | 'declaration' }[] {
  const group = code.substring(0, 2);

  const regulations: Record<string, { code: string; name: string; type: 'certificate' | 'declaration' }[]> = {
    // Пищевая продукция (01-24)
    '01': [{ code: 'ТР ТС 021/2011', name: 'О безопасности пищевой продукции', type: 'declaration' }],
    '02': [{ code: 'ТР ТС 021/2011', name: 'О безопасности пищевой продукции', type: 'declaration' }],
    '03': [{ code: 'ТР ТС 021/2011', name: 'О безопасности пищевой продукции', type: 'declaration' }],
    '04': [{ code: 'ТР ТС 021/2011', name: 'О безопасности пищевой продукции', type: 'declaration' }, { code: 'ТР ТС 033/2013', name: 'О безопасности молока и молочной продукции', type: 'declaration' }],
    '05': [{ code: 'ТР ТС 021/2011', name: 'О безопасности пищевой продукции', type: 'declaration' }],
    '06': [{ code: 'ТР ТС 021/2011', name: 'О безопасности пищевой продукции', type: 'declaration' }],
    '07': [{ code: 'ТР ТС 021/2011', name: 'О безопасности пищевой продукции', type: 'declaration' }],
    '08': [{ code: 'ТР ТС 021/2011', name: 'О безопасности пищевой продукции', type: 'declaration' }],
    '09': [{ code: 'ТР ТС 021/2011', name: 'О безопасности пищевой продукции', type: 'declaration' }],
    '10': [{ code: 'ТР ТС 021/2011', name: 'О безопасности пищевой продукции', type: 'declaration' }],
    '11': [{ code: 'ТР ТС 021/2011', name: 'О безопасности пищевой продукции', type: 'declaration' }],
    '12': [{ code: 'ТР ТС 021/2011', name: 'О безопасности пищевой продукции', type: 'declaration' }],
    '15': [{ code: 'ТР ТС 024/2011', name: 'Технический регламент на масложировую продукцию', type: 'declaration' }],
    '16': [{ code: 'ТР ТС 021/2011', name: 'О безопасности пищевой продукции', type: 'declaration' }, { code: 'ТР ТС 034/2013', name: 'О безопасности мяса и мясной продукции', type: 'declaration' }],
    '17': [{ code: 'ТР ТС 021/2011', name: 'О безопасности пищевой продукции', type: 'declaration' }],
    '18': [{ code: 'ТР ТС 021/2011', name: 'О безопасности пищевой продукции', type: 'declaration' }],
    '19': [{ code: 'ТР ТС 021/2011', name: 'О безопасности пищевой продукции', type: 'declaration' }],
    '20': [{ code: 'ТР ТС 021/2011', name: 'О безопасности пищевой продукции', type: 'declaration' }, { code: 'ТР ТС 023/2011', name: 'Технический регламент на соковую продукцию', type: 'declaration' }],
    '21': [{ code: 'ТР ТС 021/2011', name: 'О безопасности пищевой продукции', type: 'declaration' }],
    '22': [{ code: 'ТР ТС 021/2011', name: 'О безопасности пищевой продукции', type: 'declaration' }, { code: 'ТР ЕАЭС 047/2018', name: 'О безопасности алкогольной продукции', type: 'declaration' }],

    // Косметика (33)
    '33': [{ code: 'ТР ТС 009/2011', name: 'О безопасности парфюмерно-косметической продукции', type: 'declaration' }],

    // Упаковка (39)
    '39': [{ code: 'ТР ТС 005/2011', name: 'О безопасности упаковки', type: 'declaration' }],

    // Одежда, текстиль (61-63)
    '61': [{ code: 'ТР ТС 017/2011', name: 'О безопасности продукции лёгкой промышленности', type: 'declaration' }],
    '62': [{ code: 'ТР ТС 017/2011', name: 'О безопасности продукции лёгкой промышленности', type: 'declaration' }],
    '63': [{ code: 'ТР ТС 017/2011', name: 'О безопасности продукции лёгкой промышленности', type: 'declaration' }],

    // Обувь (64)
    '64': [{ code: 'ТР ТС 017/2011', name: 'О безопасности продукции лёгкой промышленности', type: 'declaration' }],

    // Машины и оборудование (84)
    '84': [
      { code: 'ТР ТС 010/2011', name: 'О безопасности машин и оборудования', type: 'certificate' },
      { code: 'ТР ТС 004/2011', name: 'О безопасности низковольтного оборудования', type: 'declaration' },
      { code: 'ТР ТС 020/2011', name: 'Электромагнитная совместимость', type: 'declaration' },
    ],

    // Электроника (85)
    '85': [
      { code: 'ТР ТС 004/2011', name: 'О безопасности низковольтного оборудования', type: 'declaration' },
      { code: 'ТР ТС 020/2011', name: 'Электромагнитная совместимость', type: 'declaration' },
      { code: 'ТР ЕАЭС 037/2016', name: 'Об ограничении применения опасных веществ', type: 'declaration' },
    ],

    // Медицинские изделия (90)
    '90': [{ code: 'РУ Росздравнадзор', name: 'Регистрационное удостоверение на медицинские изделия', type: 'certificate' }],

    // Мебель (94)
    '94': [{ code: 'ТР ТС 025/2012', name: 'О безопасности мебельной продукции', type: 'declaration' }],

    // Игрушки (95)
    '95': [{ code: 'ТР ТС 008/2011', name: 'О безопасности игрушек', type: 'certificate' }],
  };

  return regulations[group] || [];
}

export function TNVEDResultsNew({ item }: TNVEDResultsNewProps) {
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

  const markingInfo = getMarkingInfo(item.code);
  const regulations = getRegulationsByCode(item.code);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        tnved_code: item.code,
        tnved_name: item.name,
        requires_marking: item.requires_marking,
        source: 'tn-ved-module-full',
      };

      console.log('Submitting to CRM:', payload);
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
          Наш эксперт свяжется с вами в течение 15 минут
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-3">
              ТН ВЭД {item.code_formatted}
            </span>
            <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {item.requires_marking && (
              <span className="px-3 py-1 bg-amber-400 text-amber-900 rounded-full text-sm font-medium">
                Требуется маркировка
              </span>
            )}
            {item.is_experimental && (
              <span className="px-3 py-1 bg-purple-400 text-purple-900 rounded-full text-sm font-medium">
                Эксперимент по маркировке
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Информация о маркировке */}
      {(item.requires_marking || item.is_experimental) && markingInfo && markingInfo.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Требования к маркировке «Честный ЗНАК»
          </h3>
          <div className="space-y-3">
            {markingInfo.slice(0, 3).map((info, idx) => (
              <div key={idx} className="p-3 bg-white rounded-lg">
                <div className="text-sm text-amber-600 font-medium">{info.group}</div>
                <div className="text-amber-900">{info.subcategory}</div>
                {info.product && <div className="text-sm text-amber-700 mt-1">{info.product}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Применимые регламенты */}
      {regulations.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Возможные требования сертификации
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            На основе группы ТН ВЭД. Точные требования определяются индивидуально.
          </p>
          <div className="space-y-3">
            {regulations.map((reg, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl flex items-start gap-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  reg.type === 'certificate' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {reg.type === 'certificate' ? 'Сертификат' : 'Декларация'}
                </span>
                <div>
                  <div className="font-semibold text-blue-600">{reg.code}</div>
                  <div className="text-sm text-slate-600">{reg.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Предупреждение */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Важно</h4>
            <p className="text-sm text-blue-800">
              Требования к сертификации зависят от конкретного товара, его назначения и характеристик.
              Код ТН ВЭД — это только первый этап определения. Для точного расчёта необходима консультация эксперта.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold mb-1">Узнать точные требования</h3>
            <p className="text-slate-400">Бесплатная консультация эксперта за 15 минут</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold transition-colors whitespace-nowrap"
          >
            Получить консультацию
          </button>
        </div>
      </div>

      {/* Форма заявки */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Заявка на консультацию</h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-3 bg-blue-50 rounded-xl mb-6">
              <div className="text-sm text-blue-600 font-medium">ТН ВЭД {item.code_formatted}</div>
              <div className="font-medium text-slate-900 line-clamp-2">{item.name}</div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ваше имя *</label>
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Телефон *</label>
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
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                  placeholder="email@company.ru"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Комментарий</label>
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                  placeholder="Опишите ваш товар подробнее..."
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
                Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
