/**
 * КОНФИГУРАЦИЯ ЦЕН И СРОКОВ
 *
 * Этот файл — единственное место для управления ценами.
 * Все страницы берут данные отсюда.
 *
 * Последнее обновление: 2025-12-22
 */

// =============================================================================
// БАЗОВЫЕ ЦЕНЫ ПО ТИПАМ ДОКУМЕНТОВ
// =============================================================================

export const BASE_PRICING = {
  // Сертификаты ТР ТС
  certificate: {
    serial: { min: 15000, max: 45000, days: '10-14 дней' },
    batch: { min: 12000, max: 35000, days: '7-10 дней' },
    urgent: { min: 22000, max: 55000, days: '3-5 дней' },
  },

  // Декларации ТР ТС
  declaration: {
    serial: { min: 8000, max: 25000, days: '5-7 дней' },
    batch: { min: 6000, max: 18000, days: '3-5 дней' },
    urgent: { min: 12000, max: 35000, days: '1-3 дня' },
  },

  // СГР
  sgr: {
    serial: { min: 25000, max: 80000, days: '20-30 дней' },
    batch: { min: 25000, max: 80000, days: '20-30 дней' },
  },

  // Отказные письма
  rejection: {
    standard: { min: 3000, max: 8000, days: '1-3 дня' },
    urgent: { min: 5000, max: 12000, days: '1 день' },
  },
};

// =============================================================================
// МНОЖИТЕЛИ ДЛЯ КОНКРЕТНЫХ РЕГЛАМЕНТОВ
// Некоторые ТР ТС сложнее/дороже
// =============================================================================

export const REGULATION_MULTIPLIERS: Record<string, number> = {
  // Сертификаты
  '007-2011': 1.2,   // Детские товары - строгие требования
  '008-2011': 1.2,   // Игрушки - строгие требования
  '010-2011': 1.5,   // Оборудование - сложные испытания
  '011-2011': 2.5,   // Лифты - очень сложно
  '016-2011': 1.3,   // Газовое оборудование
  '018-2011': 3.0,   // Транспорт - ОТТС дорого
  '032-2013': 1.8,   // Оборудование под давлением

  // Декларации
  '004-2011': 1.0,   // Низковольтное - стандарт
  '009-2011': 1.0,   // Косметика - стандарт
  '017-2011': 0.9,   // Одежда - проще
  '020-2011': 1.0,   // ЭМС - стандарт
  '021-2011': 1.2,   // Пищевая - нужен ХАССП
  '025-2012': 1.0,   // Мебель - стандарт
  '037-2016': 1.1,   // RoHS - доп. испытания
};

// =============================================================================
// МНОЖИТЕЛИ ДЛЯ КАТЕГОРИЙ ТОВАРОВ
// Внутри одного ТР ТС разные товары имеют разную сложность
// =============================================================================

export const PRODUCT_MULTIPLIERS: Record<string, number> = {
  // Игрушки (008)
  'elektronye-igrushki': 1.3,      // Электронные - доп. испытания по ЭМС
  'igrushki-dlya-vody': 1.2,       // Для воды - доп. испытания
  'myagkie-igrushki': 1.0,         // Стандарт
  'konstruktory': 1.0,             // Стандарт
  'kukly': 1.0,                    // Стандарт

  // Детские товары (007)
  'detskaya-odezhda-0-3': 1.3,     // До 3 лет - строже
  'detskaya-odezhda-3-14': 1.0,    // Стандарт
  'detskaya-obuv': 1.1,            // Обувь чуть сложнее
  'kolyaski': 1.4,                 // Механические испытания
  'detskaya-posuda': 1.2,          // Контакт с пищей

  // Одежда (017)
  'futbolki': 0.8,                 // Простой состав
  'kurtki': 1.0,                   // Стандарт
  'obuv-vzroslaya': 1.1,           // Обувь сложнее
  'nizhnee-bele': 1.1,             // 1-й слой - строже

  // Электроника (004)
  'bytovaya-tehnika': 1.0,         // Стандарт
  'kompyutery': 1.1,               // + ЭМС обязательно
  'svetilniki': 0.9,               // Проще
  'zaryadki': 0.9,                 // Проще

  // Косметика (009)
  'dekorativnaya': 1.0,            // Стандарт
  'uhod-za-kozhey': 1.0,           // Стандарт
  'shampuni': 0.9,                 // Проще
  'detskaya-kosmetika': 1.8,       // + СГР обязательно!

  // Пищевая (021)
  'konditerskiye': 1.0,            // Стандарт
  'myaso': 1.3,                    // Ветеринарные требования
  'molochnaya': 1.3,               // Ветеринарные требования
  'napitki': 0.9,                  // Проще
};

// =============================================================================
// НАДБАВКИ ЗА ОСОБЫЕ УСЛОВИЯ
// =============================================================================

export const SURCHARGES = {
  // Импорт
  import: {
    china: 0,        // Китай - стандарт (много опыта)
    europe: 1000,    // Европа - нужен перевод
    usa: 2000,       // США - сложнее документы
    other: 1500,     // Другие страны
  },

  // Количество наименований
  skuCount: {
    '1-5': 0,
    '6-20': 3000,
    '21-50': 8000,
    '51-100': 15000,
    '100+': 'индивидуально',
  },

  // Отсутствие документов
  missingDocs: {
    noTU: 5000,          // Нет ТУ - разработаем
    noProtocols: 0,      // Нет протоколов - включено в цену
    noContract: 0,       // Нет контракта - поможем составить
  },

  // Срочность
  urgency: {
    standard: 0,
    express: 0.3,        // +30% за экспресс
    superExpress: 0.5,   // +50% за супер-экспресс
  },
};

// =============================================================================
// ФУНКЦИИ РАСЧЁТА ЦЕН
// =============================================================================

export interface PriceCalculation {
  basePrice: number;
  finalPrice: { min: number; max: number };
  days: string;
  factors: string[];
}

/**
 * Рассчитать цену для конкретного регламента и товара
 */
export function calculatePrice(
  documentType: 'certificate' | 'declaration' | 'sgr',
  regulationId: string,
  productCategory?: string,
  options?: {
    isSerial?: boolean;
    isUrgent?: boolean;
    importCountry?: string;
    skuCount?: number;
  }
): PriceCalculation {
  const factors: string[] = [];

  // Базовая цена
  const baseConfig = BASE_PRICING[documentType];
  const priceType = options?.isUrgent ? 'urgent' : (options?.isSerial ? 'serial' : 'batch');
  const base = baseConfig[priceType as keyof typeof baseConfig] || baseConfig.batch;

  let minPrice = base.min;
  let maxPrice = base.max;
  let days = base.days;

  // Множитель регламента
  const regMultiplier = REGULATION_MULTIPLIERS[regulationId] || 1.0;
  if (regMultiplier !== 1.0) {
    minPrice *= regMultiplier;
    maxPrice *= regMultiplier;
    factors.push(`Регламент: ×${regMultiplier}`);
  }

  // Множитель категории товара
  if (productCategory && PRODUCT_MULTIPLIERS[productCategory]) {
    const prodMultiplier = PRODUCT_MULTIPLIERS[productCategory];
    minPrice *= prodMultiplier;
    maxPrice *= prodMultiplier;
    factors.push(`Категория: ×${prodMultiplier}`);
  }

  // Надбавка за импорт
  if (options?.importCountry && options.importCountry !== 'russia') {
    const importSurcharge = SURCHARGES.import[options.importCountry as keyof typeof SURCHARGES.import] || SURCHARGES.import.other;
    minPrice += importSurcharge;
    maxPrice += importSurcharge;
    if (importSurcharge > 0) factors.push(`Импорт: +${importSurcharge}₽`);
  }

  // Округление до тысяч
  minPrice = Math.round(minPrice / 1000) * 1000;
  maxPrice = Math.round(maxPrice / 1000) * 1000;

  return {
    basePrice: base.min,
    finalPrice: { min: minPrice, max: maxPrice },
    days,
    factors,
  };
}

/**
 * Форматирование цены для отображения
 */
export function formatPrice(price: number): string {
  return price.toLocaleString('ru-RU');
}

/**
 * Получить строку цены "от X ₽"
 */
export function getPriceString(min: number, max?: number): string {
  if (max && max !== min) {
    return `от ${formatPrice(min)} до ${formatPrice(max)} ₽`;
  }
  return `от ${formatPrice(min)} ₽`;
}
