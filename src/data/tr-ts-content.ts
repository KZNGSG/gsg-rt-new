/**
 * ПОЛНАЯ БАЗА ДАННЫХ ТР ТС
 *
 * ВСЁ редактируется здесь:
 * - Цены и сроки
 * - Товары и категории
 * - Требования
 * - Схемы сертификации
 * - FAQ
 * - Тексты для SEO
 *
 * Структура URL:
 * /sertifikat-tr-ts/008-igrushki/                 ← Главная ТР ТС
 * /sertifikat-tr-ts/008-igrushki/tovary/kukly/    ← Товар
 * /sertifikat-tr-ts/008-igrushki/trebovaniya/     ← Требования
 * /sertifikat-tr-ts/008-igrushki/shemy/1s/        ← Схема
 * /sertifikat-tr-ts/008-igrushki/import/kitay/    ← Импорт
 * /sertifikat-tr-ts/008-igrushki/prodazha/wb/     ← Продажа
 */

// =============================================================================
// ТИПЫ
// =============================================================================

/** Тип основного документа для товара */
export type ProductDocType =
  | 'certificate'    // Сертификат ТР ТС — обязательная сертификация органом
  | 'declaration'    // Декларация ТР ТС — заявление производителя
  | 'sgr'            // Свидетельство о гос. регистрации (для контакта с пищей/кожей)
  | 'refusal';       // Отказное письмо — товар не подлежит обязательной сертификации

/** Тип документа ТР ТС (для обратной совместимости) */
export type DocType = 'certificate' | 'declaration';

/** Дополнительные требования к товару */
export interface ProductExtras {
  /** Честный знак — обязательная маркировка для продажи в РФ */
  chestnyznak: boolean;
  /** Нужно ли дополнительно СГР (контакт с пищей/кожей детей) */
  sgrRequired: boolean;
  /** Доступен ли сертификат ИСО (для схемы на 5 лет) */
  isoAvailable: boolean;
  /** Другие связанные ТР ТС (номера) */
  relatedTRTS?: string[];
}

/** Категория товаров для фильтрации */
export type ProductCategory =
  | 'children' | 'toys' | 'food' | 'electronics'
  | 'clothing' | 'cosmetics' | 'furniture' | 'machinery';

/** Страна импорта */
export type ImportCountry = 'china' | 'turkey' | 'europe' | 'usa' | 'other';

/** Канал продаж */
export type SalesChannel = 'wildberries' | 'ozon' | 'retail' | 'wholesale' | 'export';

// =============================================================================
// РЕГИОНАЛЬНОСТЬ (для поддоменов: kazan.gsg-rt.ru, orenburg.gsg-rt.ru)
// =============================================================================

/** Федеральный округ */
export type FederalDistrict =
  | 'central'      // ЦФО
  | 'northwestern' // СЗФО
  | 'southern'     // ЮФО
  | 'northcaucasian' // СКФО
  | 'volga'        // ПФО
  | 'ural'         // УФО
  | 'siberian'     // СФО
  | 'fareastern';  // ДФО

/** Данные региона для SEO и контента */
export interface RegionData {
  /** Поддомен: kazan, orenburg, kirov */
  subdomain: string;

  /** Город: Казань, Оренбург, Киров */
  city: string;

  /** Город в предложном падеже: в Казани, в Оренбурге */
  cityPrepositional: string;

  /** Город в родительном падеже: Казани, Оренбурга */
  cityGenitive: string;

  /** Регион/область: Татарстан, Оренбургская область */
  region: string;

  /** Федеральный округ */
  federalDistrict: FederalDistrict;

  /** ID региона в Яндекс.Вебмастер (для привязки) */
  yandexRegionId: number;

  /** Местный телефон (если есть) */
  phone?: string;

  /** Адрес офиса/пункта выдачи */
  address?: string;

  /** Координаты для карты */
  coordinates?: { lat: number; lng: number };

  /** Население города (для приоритета) */
  population: number;

  /** Активен ли регион */
  isActive: boolean;

  /** Уникальный текст для региона (для SEO) */
  uniqueText?: string;
}

/** Региональные SEO данные (генерируются автоматически) */
export interface RegionalSEO {
  title: string;
  description: string;
  h1: string;
  /** Уникальный абзац для региона */
  introText: string;
}

// =============================================================================
// ГЛОБАЛЬНЫЕ НАСТРОЙКИ ЦЕН (редактируй здесь!)
// =============================================================================

export const GLOBAL_PRICING = {
  /** Последнее обновление цен */
  lastUpdated: '2025-12-22',

  /** Валюта */
  currency: '₽',

  /** Базовые цены по типам документов */
  base: {
    certificate: {
      serial: { min: 15000, max: 45000, days: '10-14', daysNum: 14 },
      batch: { min: 12000, max: 35000, days: '7-10', daysNum: 10 },
      urgent: { min: 22000, max: 55000, days: '3-5', daysNum: 5 },
    },
    declaration: {
      serial: { min: 8000, max: 25000, days: '5-7', daysNum: 7 },
      batch: { min: 6000, max: 18000, days: '3-5', daysNum: 5 },
      urgent: { min: 12000, max: 35000, days: '1-3', daysNum: 3 },
    },
  },

  /** Надбавки за импорт */
  importSurcharge: {
    china: 0,
    turkey: 2000,
    europe: 3000,
    usa: 5000,
    other: 3000,
  } as Record<ImportCountry, number>,

  /** Надбавки за маркетплейсы (нужна спешка обычно) */
  channelSurcharge: {
    wildberries: 0,
    ozon: 0,
    retail: 0,
    wholesale: -1000, // скидка за опт
    export: 5000,     // экспорт сложнее
  } as Record<SalesChannel, number>,

  /** Скидки за объём (кол-во SKU) */
  volumeDiscount: {
    '1-5': 0,
    '6-20': 0.05,     // 5% скидка
    '21-50': 0.10,    // 10% скидка
    '51-100': 0.15,   // 15% скидка
    '100+': 0.20,     // 20% скидка
  },
};

// =============================================================================
// ИНТЕРФЕЙСЫ
// =============================================================================

/** Товар внутри ТР ТС */
export interface TRTSProduct {
  slug: string;           // URL: kukly, konstruktory
  name: string;           // "Куклы и пупсы"
  namePlural: string;     // "кукол и пупсов" (для текстов)

  /** SEO */
  seo: {
    title: string;
    description: string;
    h1: string;
  };

  // ===========================================================================
  // НОВОЕ: Какой документ нужен для этого товара
  // ===========================================================================

  /** Основной тип документа для этого товара */
  documentType: ProductDocType;

  /** Почему именно этот документ (объяснение для клиента) */
  documentReason: string;

  /** Дополнительные требования */
  extras: ProductExtras;

  // ===========================================================================

  /** Множитель цены (1.0 = стандарт, 1.2 = +20%) */
  priceMultiplier: number;

  /** Особенности товара (для контента) */
  features?: string[];

  /** Какие испытания нужны */
  tests?: string[];

  /** Коды ТН ВЭД */
  tnved?: string[];

  /** Популярность (для сортировки) */
  popularity: number;
}

/** Требование ТР ТС */
export interface TRTSRequirement {
  slug: string;           // bezopasnost, toksichnost
  name: string;           // "Механическая безопасность"
  shortName: string;      // "Безопасность"

  /** Описание */
  description: string;

  /** Пункты требований */
  items: string[];

  /** Ссылка на пункт регламента */
  regulationRef?: string; // "п. 4.1, 4.2"
}

/** Схема сертификации */
export interface TRTSScheme {
  id: string;             // "1с", "2с", "3с"
  name: string;           // "Схема 1с"

  /** Для кого подходит */
  suitableFor: string;    // "Серийное производство"

  /** Описание */
  description: string;

  /** Этапы */
  steps: string[];

  /** Нужен ли анализ производства */
  requiresProductionAnalysis: boolean;

  /** Нужен ли инспекционный контроль */
  requiresInspection: boolean;

  /** Срок действия */
  validity: string;       // "до 5 лет"
}

/** Особенности импорта */
export interface TRTSImport {
  country: ImportCountry;
  slug: string;           // kitay, turtsiya
  name: string;           // "Китай"
  nameFrom: string;       // "из Китая"

  /** SEO */
  seo: {
    title: string;
    description: string;
    h1: string;
  };

  /** Особенности */
  features: string[];

  /** Дополнительные документы */
  additionalDocs: string[];

  /** Надбавка к цене */
  surcharge: number;
}

/** Канал продаж */
export interface TRTSSalesChannel {
  channel: SalesChannel;
  slug: string;           // wildberries, ozon
  name: string;           // "Wildberries"

  /** SEO */
  seo: {
    title: string;
    description: string;
    h1: string;
  };

  /** Требования площадки */
  requirements: string[];

  /** Советы */
  tips: string[];
}

/** Полные данные одного ТР ТС */
export interface TRTSFullData {
  /** Основная информация (из tr-ts-database.ts) */
  id: string;
  number: string;
  slug: string;
  name: string;
  shortName: string;
  docType: DocType;

  /** Множитель цены для этого ТР ТС */
  priceMultiplier: number;

  /** Товары */
  products: TRTSProduct[];

  /** Требования */
  requirements: TRTSRequirement[];

  /** Схемы */
  schemes: TRTSScheme[];

  /** Импорт */
  imports: TRTSImport[];

  /** Каналы продаж */
  salesChannels: TRTSSalesChannel[];

  /** Частые ошибки */
  commonMistakes: Array<{
    title: string;
    description: string;
    solution: string;
  }>;
}

// =============================================================================
// ДАННЫЕ: ТР ТС 008/2011 — ИГРУШКИ (ПРИМЕР ПОЛНОГО ЗАПОЛНЕНИЯ)
// =============================================================================

export const TRTS_008_IGRUSHKI: TRTSFullData = {
  id: '008-2011',
  number: 'ТР ТС 008/2011',
  slug: '008-igrushki',
  name: 'О безопасности игрушек',
  shortName: 'Игрушки',
  docType: 'certificate',
  priceMultiplier: 1.2,  // Игрушки чуть дороже стандарта

  // ---------------------------------------------------------------------------
  // ТОВАРЫ (с указанием типа документа и дополнительных требований)
  // ---------------------------------------------------------------------------
  products: [
    {
      slug: 'kukly',
      name: 'Куклы и пупсы',
      namePlural: 'кукол и пупсов',
      seo: {
        title: 'Сертификат на куклы и пупсы — оформление от 15 000 ₽',
        description: 'Сертификация кукол по ТР ТС 008/2011. Оформляем сертификаты на куклы, пупсы, барби, LOL. Срок 7-14 дней. Для Wildberries и Ozon.',
        h1: 'Сертификат на куклы и пупсы',
      },
      // ЧТО НУЖНО:
      documentType: 'certificate',
      documentReason: 'Куклы предназначены для детей до 14 лет — обязательная сертификация по ТР ТС 008',
      extras: {
        chestnyznak: false,   // Игрушки пока не маркируются
        sgrRequired: false,   // СГР не нужно
        isoAvailable: true,   // Можно ИСО для схемы на 5 лет
      },
      priceMultiplier: 1.0,
      features: [
        'Проверка на мелкие детали (глаза, пуговицы)',
        'Тест на прочность волос',
        'Проверка красителей на токсичность',
      ],
      tests: ['механические', 'токсикологические', 'воспламеняемость'],
      tnved: ['9503 00 210 0', '9503 00 290 0'],
      popularity: 95,
    },
    {
      slug: 'konstruktory',
      name: 'Конструкторы',
      namePlural: 'конструкторов',
      seo: {
        title: 'Сертификат на конструкторы — LEGO, аналоги | от 15 000 ₽',
        description: 'Сертификация конструкторов по ТР ТС 008/2011. LEGO, Mega Bloks, китайские аналоги. Срок 7-14 дней.',
        h1: 'Сертификат на конструкторы',
      },
      // ЧТО НУЖНО:
      documentType: 'certificate',
      documentReason: 'Конструкторы — игрушки для детей, требуют обязательный сертификат по ТР ТС 008',
      extras: {
        chestnyznak: false,
        sgrRequired: false,
        isoAvailable: true,
      },
      priceMultiplier: 1.0,
      features: [
        'Проверка мелких деталей (опасность проглатывания)',
        'Тест на прочность соединений',
        'Проверка острых краёв',
      ],
      tests: ['механические', 'токсикологические'],
      tnved: ['9503 00 300 0'],
      popularity: 90,
    },
    {
      slug: 'myagkie-igrushki',
      name: 'Мягкие игрушки',
      namePlural: 'мягких игрушек',
      seo: {
        title: 'Сертификат на мягкие игрушки — от 12 000 ₽',
        description: 'Сертификация мягких игрушек, плюшевых мишек, зайцев по ТР ТС 008/2011. Проверка наполнителя и ткани.',
        h1: 'Сертификат на мягкие игрушки',
      },
      // ЧТО НУЖНО:
      documentType: 'certificate',
      documentReason: 'Мягкие игрушки контактируют с кожей ребёнка — обязательный сертификат по ТР ТС 008',
      extras: {
        chestnyznak: false,
        sgrRequired: false,
        isoAvailable: true,
      },
      priceMultiplier: 0.9,
      features: [
        'Проверка наполнителя (синтепон, холлофайбер)',
        'Тест швов на прочность',
        'Проверка глаз и носов на отрыв',
      ],
      tests: ['механические', 'токсикологические', 'гигиенические'],
      tnved: ['9503 00 410 0', '9503 00 490 0'],
      popularity: 88,
    },
    {
      slug: 'elektronnye-igrushki',
      name: 'Электронные игрушки',
      namePlural: 'электронных игрушек',
      seo: {
        title: 'Сертификат на электронные игрушки — от 18 000 ₽',
        description: 'Сертификация электронных игрушек: роботы, интерактивные, на батарейках. ТР ТС 008 + ТР ТС 004 (электробезопасность).',
        h1: 'Сертификат на электронные игрушки',
      },
      // ЧТО НУЖНО:
      documentType: 'certificate',
      documentReason: 'Электронные игрушки требуют сертификат по ТР ТС 008 + декларацию по ТР ТС 004 (электробезопасность)',
      extras: {
        chestnyznak: false,
        sgrRequired: false,
        isoAvailable: true,
        relatedTRTS: ['ТР ТС 004/2011', 'ТР ТС 020/2011'],  // Дополнительные регламенты!
      },
      priceMultiplier: 1.3,
      features: [
        'Дополнительные испытания по электробезопасности',
        'Проверка батарейного отсека',
        'Тест на ЭМС (электромагнитная совместимость)',
      ],
      tests: ['механические', 'токсикологические', 'электробезопасность', 'ЭМС'],
      tnved: ['9503 00 700 0'],
      popularity: 85,
    },
    {
      slug: 'nastolnye-igry',
      name: 'Настольные игры',
      namePlural: 'настольных игр',
      seo: {
        title: 'Декларация на настольные игры — от 8 000 ₽',
        description: 'Декларирование настольных игр: монополия, карточные игры, пазлы для взрослых. ТР ТС 008/2011.',
        h1: 'Декларация на настольные игры',
      },
      // ЧТО НУЖНО (другой тип!):
      documentType: 'declaration',
      documentReason: 'Настольные игры для детей старше 14 лет или без возрастных ограничений — декларирование по ТР ТС 008',
      extras: {
        chestnyznak: false,
        sgrRequired: false,
        isoAvailable: false,  // Для деклараций ИСО не применяется
      },
      priceMultiplier: 0.7,  // Декларация дешевле
      features: [
        'Проверка картона и краски',
        'Тест мелких компонентов (фишки, кубики)',
        'Проверка упаковки',
      ],
      tests: ['механические', 'токсикологические'],
      tnved: ['9504 40 000 0', '9504 90'],
      popularity: 75,
    },
    {
      slug: 'igrushki-dlya-vody',
      name: 'Игрушки для воды',
      namePlural: 'игрушек для воды',
      seo: {
        title: 'Сертификат на игрушки для воды — от 15 000 ₽',
        description: 'Сертификация игрушек для воды и купания: круги, нарукавники, резиновые уточки. ТР ТС 008/2011.',
        h1: 'Сертификат на игрушки для воды',
      },
      // ЧТО НУЖНО:
      documentType: 'certificate',
      documentReason: 'Игрушки для воды для детей — обязательный сертификат по ТР ТС 008 (повышенные требования безопасности)',
      extras: {
        chestnyznak: false,
        sgrRequired: false,
        isoAvailable: true,
      },
      priceMultiplier: 1.1,
      features: [
        'Проверка водостойкости материалов',
        'Тест на плавучесть (для надувных)',
        'Проверка клапанов',
      ],
      tests: ['механические', 'токсикологические', 'водостойкость'],
      tnved: ['9503 00 950 0'],
      popularity: 70,
    },
    {
      slug: 'radioupravlyaemye',
      name: 'Радиоуправляемые игрушки',
      namePlural: 'радиоуправляемых игрушек',
      seo: {
        title: 'Сертификат на радиоуправляемые игрушки — от 20 000 ₽',
        description: 'Сертификация радиоуправляемых машинок, дронов, вертолётов. ТР ТС 008 + ТР ТС 020 (ЭМС).',
        h1: 'Сертификат на радиоуправляемые игрушки',
      },
      // ЧТО НУЖНО:
      documentType: 'certificate',
      documentReason: 'Радиоуправляемые игрушки требуют сертификат по ТР ТС 008 + декларацию по ТР ТС 020 (ЭМС)',
      extras: {
        chestnyznak: false,
        sgrRequired: false,
        isoAvailable: true,
        relatedTRTS: ['ТР ТС 020/2011'],
      },
      priceMultiplier: 1.4,
      features: [
        'Испытания на электромагнитную совместимость',
        'Проверка дальности управления',
        'Тест батарей и зарядки',
      ],
      tests: ['механические', 'электробезопасность', 'ЭМС', 'радиочастоты'],
      tnved: ['9503 00 700 0'],
      popularity: 80,
    },
    {
      slug: 'razvivayushchie',
      name: 'Развивающие игрушки',
      namePlural: 'развивающих игрушек',
      seo: {
        title: 'Сертификат на развивающие игрушки — от 12 000 ₽',
        description: 'Сертификация развивающих игрушек: сортеры, пирамидки, кубики. ТР ТС 008/2011.',
        h1: 'Сертификат на развивающие игрушки',
      },
      // ЧТО НУЖНО:
      documentType: 'certificate',
      documentReason: 'Развивающие игрушки для детей до 3 лет — обязательный сертификат с повышенными требованиями',
      extras: {
        chestnyznak: false,
        sgrRequired: false,
        isoAvailable: true,
      },
      priceMultiplier: 1.0,
      features: [
        'Особое внимание к возрастной маркировке',
        'Проверка мелких деталей',
        'Тест на прочность',
      ],
      tests: ['механические', 'токсикологические'],
      tnved: ['9503 00'],
      popularity: 82,
    },
    {
      slug: 'detskiy-transport',
      name: 'Детский транспорт',
      namePlural: 'детского транспорта',
      seo: {
        title: 'Сертификат на детский транспорт — от 18 000 ₽',
        description: 'Сертификация детских велосипедов, самокатов, беговелов (до 50 кг). ТР ТС 008/2011.',
        h1: 'Сертификат на детский транспорт',
      },
      // ЧТО НУЖНО:
      documentType: 'certificate',
      documentReason: 'Детский транспорт (велосипеды до 50 кг, самокаты) — обязательный сертификат по ТР ТС 008',
      extras: {
        chestnyznak: false,
        sgrRequired: false,
        isoAvailable: true,
      },
      priceMultiplier: 1.3,
      features: [
        'Проверка прочности рамы и колёс',
        'Тест тормозной системы',
        'Испытания на устойчивость',
      ],
      tests: ['механические', 'прочность', 'устойчивость'],
      tnved: ['9503 00 100 0'],
      popularity: 78,
    },
    // НОВЫЕ ТОВАРЫ с разными типами документов:
    {
      slug: 'karnavalnye-kostyumy',
      name: 'Карнавальные костюмы',
      namePlural: 'карнавальных костюмов',
      seo: {
        title: 'Декларация на карнавальные костюмы — от 6 000 ₽',
        description: 'Декларирование карнавальных костюмов для детей. ТР ТС 007/2011 (детские товары).',
        h1: 'Декларация на карнавальные костюмы',
      },
      // ЧТО НУЖНО (это не ТР ТС 008, а ТР ТС 007!):
      documentType: 'declaration',
      documentReason: 'Карнавальные костюмы — это одежда, а не игрушки. Декларирование по ТР ТС 007 (детские товары) или ТР ТС 017 (лёгкая промышленность)',
      extras: {
        chestnyznak: true,    // Одежда маркируется!
        sgrRequired: false,
        isoAvailable: false,
        relatedTRTS: ['ТР ТС 007/2011', 'ТР ТС 017/2011'],
      },
      priceMultiplier: 0.6,
      features: [
        'Проверка ткани на безопасность',
        'Тест красителей',
        'Маркировка Честный знак обязательна',
      ],
      tests: ['токсикологические', 'гигиенические'],
      tnved: ['9505 90'],
      popularity: 60,
    },
    {
      slug: 'елочные-украшения',
      name: 'Ёлочные украшения',
      namePlural: 'ёлочных украшений',
      seo: {
        title: 'Отказное письмо на ёлочные украшения — от 3 000 ₽',
        description: 'Ёлочные украшения не подлежат обязательной сертификации. Оформляем отказное письмо.',
        h1: 'Отказное письмо на ёлочные украшения',
      },
      // ЧТО НУЖНО (отказное!):
      documentType: 'refusal',
      documentReason: 'Ёлочные украшения не являются игрушками и не подлежат обязательной сертификации — оформляется отказное письмо',
      extras: {
        chestnyznak: false,
        sgrRequired: false,
        isoAvailable: false,
      },
      priceMultiplier: 0.3,  // Отказное дёшево
      features: [
        'Не требует испытаний',
        'Оформление за 1-2 дня',
        'Достаточно для маркетплейсов',
      ],
      tests: [],
      tnved: ['9505 10'],
      popularity: 50,
    },
    {
      slug: 'slime-lizuny',
      name: 'Слаймы и лизуны',
      namePlural: 'слаймов и лизунов',
      seo: {
        title: 'Сертификат на слаймы — от 15 000 ₽',
        description: 'Сертификация слаймов, лизунов, жвачки для рук. Повышенные требования к химическому составу.',
        h1: 'Сертификат на слаймы и лизуны',
      },
      // ЧТО НУЖНО:
      documentType: 'certificate',
      documentReason: 'Слаймы контактируют с кожей ребёнка и могут попасть в рот — обязательный сертификат с расширенными токсикологическими испытаниями',
      extras: {
        chestnyznak: false,
        sgrRequired: true,    // Нужно СГР! Контакт с кожей
        isoAvailable: false,
      },
      priceMultiplier: 1.5,  // Дороже из-за СГР
      features: [
        'Расширенные токсикологические испытания',
        'Проверка на содержание бора',
        'Дополнительно требуется СГР',
      ],
      tests: ['токсикологические', 'химические', 'микробиологические'],
      tnved: ['9503 00 990 0'],
      popularity: 85,
    },
  ],

  // ---------------------------------------------------------------------------
  // ТРЕБОВАНИЯ
  // ---------------------------------------------------------------------------
  requirements: [
    {
      slug: 'mehanicheskaya-bezopasnost',
      name: 'Механическая безопасность',
      shortName: 'Механика',
      description: 'Требования к прочности, отсутствию острых краёв и мелких деталей',
      items: [
        'Отсутствие острых кромок и углов',
        'Прочность крепления деталей',
        'Отсутствие опасных мелких деталей (для детей до 3 лет)',
        'Устойчивость к падению',
        'Безопасность механизмов',
      ],
      regulationRef: 'Статья 4, пп. 1-5',
    },
    {
      slug: 'toksikologicheskaya-bezopasnost',
      name: 'Токсикологическая безопасность',
      shortName: 'Токсичность',
      description: 'Требования к безопасности материалов и красителей',
      items: [
        'Миграция токсичных элементов в норме',
        'Безопасные красители',
        'Отсутствие фталатов выше нормы',
        'Безопасный наполнитель',
        'Гипоаллергенность материалов',
      ],
      regulationRef: 'Статья 4, п. 6; Приложение 3',
    },
    {
      slug: 'vosplamenyaemost',
      name: 'Воспламеняемость',
      shortName: 'Горючесть',
      description: 'Требования к пожарной безопасности игрушек',
      items: [
        'Скорость горения в норме',
        'Самозатухание материалов',
        'Отсутствие легковоспламеняющихся материалов',
      ],
      regulationRef: 'Статья 4, п. 7',
    },
    {
      slug: 'markirovka',
      name: 'Маркировка',
      shortName: 'Маркировка',
      description: 'Требования к маркировке игрушек',
      items: [
        'Наименование игрушки',
        'Возрастная маркировка',
        'Знак EAC',
        'Информация о производителе/импортёре',
        'Дата изготовления',
        'Правила эксплуатации',
        'Предупреждения об опасности',
      ],
      regulationRef: 'Статья 6',
    },
  ],

  // ---------------------------------------------------------------------------
  // СХЕМЫ СЕРТИФИКАЦИИ
  // ---------------------------------------------------------------------------
  schemes: [
    {
      id: '1с',
      name: 'Схема 1с',
      suitableFor: 'Серийное производство',
      description: 'Для постоянного выпуска игрушек. Включает анализ производства и ежегодный инспекционный контроль.',
      steps: [
        'Подача заявки на сертификацию',
        'Анализ документации',
        'Отбор образцов для испытаний',
        'Проведение испытаний в лаборатории',
        'Анализ состояния производства',
        'Выдача сертификата',
        'Инспекционный контроль (ежегодно)',
      ],
      requiresProductionAnalysis: true,
      requiresInspection: true,
      validity: 'до 5 лет',
    },
    {
      id: '2с',
      name: 'Схема 2с',
      suitableFor: 'Партия игрушек',
      description: 'Для разовой поставки или партии. Без анализа производства.',
      steps: [
        'Подача заявки на сертификацию',
        'Анализ документации',
        'Отбор образцов из партии',
        'Проведение испытаний',
        'Выдача сертификата на партию',
      ],
      requiresProductionAnalysis: false,
      requiresInspection: false,
      validity: 'на партию',
    },
  ],

  // ---------------------------------------------------------------------------
  // ИМПОРТ
  // ---------------------------------------------------------------------------
  imports: [
    {
      country: 'china',
      slug: 'kitay',
      name: 'Китай',
      nameFrom: 'из Китая',
      seo: {
        title: 'Сертификат на игрушки из Китая — от 15 000 ₽',
        description: 'Сертификация игрушек из Китая по ТР ТС 008/2011. Помогаем с контрактом, инвойсом, отбором образцов. Срок 7-14 дней.',
        h1: 'Сертификат на игрушки из Китая',
      },
      features: [
        'Большой опыт работы с китайскими производителями',
        'Помощь в оформлении контракта',
        'Консультация по выбору надёжного поставщика',
        'Проверка фабрики (опционально)',
      ],
      additionalDocs: [
        'Контракт с китайским производителем',
        'Инвойс (счёт-фактура)',
        'Спецификация товара',
        'Письмо на ввоз образцов',
      ],
      surcharge: 0,
    },
    {
      country: 'turkey',
      slug: 'turtsiya',
      name: 'Турция',
      nameFrom: 'из Турции',
      seo: {
        title: 'Сертификат на игрушки из Турции — от 17 000 ₽',
        description: 'Сертификация игрушек из Турции по ТР ТС 008/2011. Оформление документов для импорта.',
        h1: 'Сертификат на игрушки из Турции',
      },
      features: [
        'Работа с турецкими производителями',
        'Перевод документов с турецкого',
        'Помощь с логистикой',
      ],
      additionalDocs: [
        'Контракт',
        'Инвойс',
        'Турецкий сертификат качества (если есть)',
      ],
      surcharge: 2000,
    },
    {
      country: 'europe',
      slug: 'evropa',
      name: 'Европа',
      nameFrom: 'из Европы',
      seo: {
        title: 'Сертификат на игрушки из Европы — от 18 000 ₽',
        description: 'Сертификация европейских игрушек по ТР ТС 008/2011. CE-маркировка не заменяет сертификат!',
        h1: 'Сертификат на игрушки из Европы',
      },
      features: [
        'CE-маркировка НЕ освобождает от сертификации в ЕАЭС',
        'Европейские протоколы можно использовать',
        'Упрощённая процедура при наличии EN 71',
      ],
      additionalDocs: [
        'Контракт',
        'Инвойс',
        'Европейский сертификат CE (упростит процедуру)',
        'Протоколы испытаний EN 71',
      ],
      surcharge: 3000,
    },
  ],

  // ---------------------------------------------------------------------------
  // КАНАЛЫ ПРОДАЖ
  // ---------------------------------------------------------------------------
  salesChannels: [
    {
      channel: 'wildberries',
      slug: 'wildberries',
      name: 'Wildberries',
      seo: {
        title: 'Сертификат на игрушки для Wildberries — от 15 000 ₽',
        description: 'Сертификация игрушек для продажи на Wildberries. Все документы для карточки товара. Загружаем в личный кабинет.',
        h1: 'Сертификат на игрушки для Wildberries',
      },
      requirements: [
        'Сертификат соответствия ТР ТС 008/2011',
        'Документ на русском языке',
        'Скан в формате PDF',
        'Актуальный срок действия',
      ],
      tips: [
        'Сертификат нужен ДО создания карточки товара',
        'Один сертификат можно использовать для нескольких артикулов',
        'При отказе WB — поможем исправить',
        'Загрузим документ в ваш ЛК бесплатно',
      ],
    },
    {
      channel: 'ozon',
      slug: 'ozon',
      name: 'Ozon',
      seo: {
        title: 'Сертификат на игрушки для Ozon — от 15 000 ₽',
        description: 'Сертификация игрушек для продажи на Ozon. Оформляем документы под требования маркетплейса.',
        h1: 'Сертификат на игрушки для Ozon',
      },
      requirements: [
        'Сертификат соответствия ТР ТС 008/2011',
        'Реестровый номер сертификата',
        'Скан документа',
      ],
      tips: [
        'Ozon проверяет сертификат по реестру ФСА',
        'Нужен именно сертификат, не декларация',
        'Быстрая модерация при правильных документах',
      ],
    },
    {
      channel: 'retail',
      slug: 'roznitsa',
      name: 'Розничные магазины',
      seo: {
        title: 'Сертификат на игрушки для розницы — от 12 000 ₽',
        description: 'Сертификация игрушек для продажи в розничных магазинах. Детский мир, Кораблик, сетевые магазины.',
        h1: 'Сертификат на игрушки для розничной торговли',
      },
      requirements: [
        'Сертификат ТР ТС 008/2011',
        'Товарно-сопроводительные документы',
        'Маркировка на русском языке',
      ],
      tips: [
        'Сетевые магазины запрашивают копию при поставке',
        'Детский мир требует строгое соответствие возрастной маркировке',
        'Храните копии сертификатов в каждой точке',
      ],
    },
  ],

  // ---------------------------------------------------------------------------
  // ЧАСТЫЕ ОШИБКИ
  // ---------------------------------------------------------------------------
  commonMistakes: [
    {
      title: 'Неправильная возрастная маркировка',
      description: 'Указан возраст 0+ для игрушки с мелкими деталями',
      solution: 'Мы проверим игрушку и укажем правильный возраст в сертификате',
    },
    {
      title: 'Отсутствие контракта',
      description: 'Импортёр пытается сертифицировать товар без контракта с производителем',
      solution: 'Поможем составить контракт или оформим сертификат на уполномоченное лицо',
    },
    {
      title: 'Декларация вместо сертификата',
      description: 'Попытка оформить декларацию на игрушки (не подходит для ТР ТС 008)',
      solution: 'Для игрушек обязателен именно сертификат, не декларация',
    },
    {
      title: 'Просроченный сертификат',
      description: 'Продажа игрушек с просроченным сертификатом',
      solution: 'Оформим новый сертификат за 7-14 дней. Для срочных случаев — от 3 дней',
    },
  ],
};

// =============================================================================
// ЭКСПОРТ ВСЕХ ДАННЫХ
// =============================================================================

export const ALL_TRTS_CONTENT: Record<string, TRTSFullData> = {
  '008-igrushki': TRTS_008_IGRUSHKI,
  // Добавляй новые ТР ТС сюда:
  // '007-detskie-tovary': TRTS_007_DETSKIE,
  // '017-legkaya-promyshlennost': TRTS_017_ODEZHDA,
};

// =============================================================================
// ХЕЛПЕРЫ
// =============================================================================

/** Получить полные данные ТР ТС по slug */
export function getTRTSContent(slug: string): TRTSFullData | undefined {
  return ALL_TRTS_CONTENT[slug];
}

/** Получить товар по slug внутри ТР ТС */
export function getProduct(trtsSlug: string, productSlug: string): TRTSProduct | undefined {
  const trts = ALL_TRTS_CONTENT[trtsSlug];
  return trts?.products.find(p => p.slug === productSlug);
}

/** Рассчитать цену для товара */
export function calculateProductPrice(
  trtsSlug: string,
  productSlug?: string,
  options?: {
    type: 'serial' | 'batch' | 'urgent';
    importCountry?: ImportCountry;
    salesChannel?: SalesChannel;
    skuCount?: number;
  }
): { min: number; max: number; days: string } {
  const trts = ALL_TRTS_CONTENT[trtsSlug];
  if (!trts) {
    return { min: 15000, max: 45000, days: '7-14 дней' };
  }

  const docType = trts.docType;
  const priceType = options?.type || 'batch';
  const base = GLOBAL_PRICING.base[docType][priceType];

  let min = base.min;
  let max = base.max;

  // Множитель ТР ТС
  min *= trts.priceMultiplier;
  max *= trts.priceMultiplier;

  // Множитель товара
  if (productSlug) {
    const product = trts.products.find(p => p.slug === productSlug);
    if (product) {
      min *= product.priceMultiplier;
      max *= product.priceMultiplier;
    }
  }

  // Надбавка за импорт
  if (options?.importCountry) {
    const surcharge = GLOBAL_PRICING.importSurcharge[options.importCountry];
    min += surcharge;
    max += surcharge;
  }

  // Надбавка/скидка за канал
  if (options?.salesChannel) {
    const surcharge = GLOBAL_PRICING.channelSurcharge[options.salesChannel];
    min += surcharge;
    max += surcharge;
  }

  // Округление
  min = Math.round(min / 1000) * 1000;
  max = Math.round(max / 1000) * 1000;

  return { min, max, days: base.days + ' дней' };
}

/** Получить все товары для generateStaticParams */
export function getAllProductSlugs(): Array<{ trts: string; product: string }> {
  const result: Array<{ trts: string; product: string }> = [];

  for (const [trtsSlug, data] of Object.entries(ALL_TRTS_CONTENT)) {
    for (const product of data.products) {
      result.push({ trts: trtsSlug, product: product.slug });
    }
  }

  return result;
}

// =============================================================================
// БАЗА РЕГИОНОВ
// =============================================================================

/**
 * БАЗА РЕГИОНОВ ДЛЯ ПОДДОМЕНОВ
 *
 * Основной домен: gsg-rt.ru = Казань (центральный офис)
 * Поддомены: msk.gsg-rt.ru, spb.gsg-rt.ru и т.д.
 *
 * Список городов синхронизирован с gsg-rt.ru (30 городов + 3 страны)
 */
export const ALL_REGIONS: Record<string, RegionData> = {
  // ---------------------------------------------------------------------------
  // РОССИЯ: МИЛЛИОННИКИ
  // ---------------------------------------------------------------------------
  'msk': {
    subdomain: 'msk',
    city: 'Москва',
    cityPrepositional: 'в Москве',
    cityGenitive: 'Москвы',
    region: 'Московская область',
    federalDistrict: 'central',
    yandexRegionId: 213,
    population: 12600000,
    isActive: true,
    uniqueText: 'Офис ГОСТСЕРТГРУПП в Москве. Сертификация для столичного бизнеса.',
  },
  'spb': {
    subdomain: 'spb',
    city: 'Санкт-Петербург',
    cityPrepositional: 'в Санкт-Петербурге',
    cityGenitive: 'Санкт-Петербурга',
    region: 'Ленинградская область',
    federalDistrict: 'northwestern',
    yandexRegionId: 2,
    population: 5400000,
    isActive: true,
    uniqueText: 'Офис в Санкт-Петербурге. Быстрая сертификация для бизнеса Северо-Запада.',
  },
  'novosibirsk': {
    subdomain: 'novosibirsk',
    city: 'Новосибирск',
    cityPrepositional: 'в Новосибирске',
    cityGenitive: 'Новосибирска',
    region: 'Новосибирская область',
    federalDistrict: 'siberian',
    yandexRegionId: 65,
    population: 1630000,
    isActive: true,
    uniqueText: 'Крупнейший центр сертификации в Сибири. Работаем по всему СФО.',
  },
  'ekaterinburg': {
    subdomain: 'ekaterinburg',
    city: 'Екатеринбург',
    cityPrepositional: 'в Екатеринбурге',
    cityGenitive: 'Екатеринбурга',
    region: 'Свердловская область',
    federalDistrict: 'ural',
    yandexRegionId: 54,
    population: 1540000,
    isActive: true,
    uniqueText: 'Сертификация на Урале. Работаем по всему УФО.',
  },
  'nizhny-novgorod': {
    subdomain: 'nizhny-novgorod',
    city: 'Нижний Новгород',
    cityPrepositional: 'в Нижнем Новгороде',
    cityGenitive: 'Нижнего Новгорода',
    region: 'Нижегородская область',
    federalDistrict: 'volga',
    yandexRegionId: 47,
    population: 1250000,
    isActive: true,
  },
  'chelyabinsk': {
    subdomain: 'chelyabinsk',
    city: 'Челябинск',
    cityPrepositional: 'в Челябинске',
    cityGenitive: 'Челябинска',
    region: 'Челябинская область',
    federalDistrict: 'ural',
    yandexRegionId: 56,
    population: 1190000,
    isActive: true,
  },
  'samara': {
    subdomain: 'samara',
    city: 'Самара',
    cityPrepositional: 'в Самаре',
    cityGenitive: 'Самары',
    region: 'Самарская область',
    federalDistrict: 'volga',
    yandexRegionId: 51,
    population: 1160000,
    isActive: true,
  },
  'rostov': {
    subdomain: 'rostov',
    city: 'Ростов-на-Дону',
    cityPrepositional: 'в Ростове-на-Дону',
    cityGenitive: 'Ростова-на-Дону',
    region: 'Ростовская область',
    federalDistrict: 'southern',
    yandexRegionId: 39,
    population: 1140000,
    isActive: true,
    uniqueText: 'Сертификация на Юге России. Работаем с Ростовом, Краснодаром, Волгоградом.',
  },
  'ufa': {
    subdomain: 'ufa',
    city: 'Уфа',
    cityPrepositional: 'в Уфе',
    cityGenitive: 'Уфы',
    region: 'Республика Башкортостан',
    federalDistrict: 'volga',
    yandexRegionId: 172,
    population: 1130000,
    isActive: true,
  },
  'krasnoyarsk': {
    subdomain: 'krasnoyarsk',
    city: 'Красноярск',
    cityPrepositional: 'в Красноярске',
    cityGenitive: 'Красноярска',
    region: 'Красноярский край',
    federalDistrict: 'siberian',
    yandexRegionId: 62,
    population: 1090000,
    isActive: true,
  },
  'voronezh': {
    subdomain: 'voronezh',
    city: 'Воронеж',
    cityPrepositional: 'в Воронеже',
    cityGenitive: 'Воронежа',
    region: 'Воронежская область',
    federalDistrict: 'central',
    yandexRegionId: 193,
    population: 1050000,
    isActive: true,
  },
  'perm': {
    subdomain: 'perm',
    city: 'Пермь',
    cityPrepositional: 'в Перми',
    cityGenitive: 'Перми',
    region: 'Пермский край',
    federalDistrict: 'volga',
    yandexRegionId: 50,
    population: 1050000,
    isActive: true,
  },
  'volgograd': {
    subdomain: 'volgograd',
    city: 'Волгоград',
    cityPrepositional: 'в Волгограде',
    cityGenitive: 'Волгограда',
    region: 'Волгоградская область',
    federalDistrict: 'southern',
    yandexRegionId: 38,
    population: 1010000,
    isActive: true,
  },
  'krasnodar': {
    subdomain: 'krasnodar',
    city: 'Краснодар',
    cityPrepositional: 'в Краснодаре',
    cityGenitive: 'Краснодара',
    region: 'Краснодарский край',
    federalDistrict: 'southern',
    yandexRegionId: 35,
    population: 1000000,
    isActive: true,
    uniqueText: 'Сертификация в Краснодаре и крае. Работаем с сельхозпроизводителями.',
  },

  // ---------------------------------------------------------------------------
  // РОССИЯ: КРУПНЫЕ ГОРОДА (активные на gsg-rt.ru)
  // ---------------------------------------------------------------------------
  'saratov': {
    subdomain: 'saratov',
    city: 'Саратов',
    cityPrepositional: 'в Саратове',
    cityGenitive: 'Саратова',
    region: 'Саратовская область',
    federalDistrict: 'volga',
    yandexRegionId: 194,
    population: 840000,
    isActive: true,
  },
  'izhevsk': {
    subdomain: 'izhevsk',
    city: 'Ижевск',
    cityPrepositional: 'в Ижевске',
    cityGenitive: 'Ижевска',
    region: 'Удмуртская Республика',
    federalDistrict: 'volga',
    yandexRegionId: 44,
    population: 650000,
    isActive: true,
  },
  'barnaul': {
    subdomain: 'barnaul',
    city: 'Барнаул',
    cityPrepositional: 'в Барнауле',
    cityGenitive: 'Барнаула',
    region: 'Алтайский край',
    federalDistrict: 'siberian',
    yandexRegionId: 197,
    population: 630000,
    isActive: true,
  },
  'vladivostok': {
    subdomain: 'vladivostok',
    city: 'Владивосток',
    cityPrepositional: 'во Владивостоке',
    cityGenitive: 'Владивостока',
    region: 'Приморский край',
    federalDistrict: 'fareastern',
    yandexRegionId: 75,
    population: 600000,
    isActive: true,
    uniqueText: 'Сертификация на Дальнем Востоке. Работаем с импортом из Китая, Японии, Кореи.',
  },
  'irkutsk': {
    subdomain: 'irkutsk',
    city: 'Иркутск',
    cityPrepositional: 'в Иркутске',
    cityGenitive: 'Иркутска',
    region: 'Иркутская область',
    federalDistrict: 'siberian',
    yandexRegionId: 63,
    population: 620000,
    isActive: true,
  },
  'yaroslavl': {
    subdomain: 'yaroslavl',
    city: 'Ярославль',
    cityPrepositional: 'в Ярославле',
    cityGenitive: 'Ярославля',
    region: 'Ярославская область',
    federalDistrict: 'central',
    yandexRegionId: 16,
    population: 600000,
    isActive: true,
  },
  'orenburg': {
    subdomain: 'orenburg',
    city: 'Оренбург',
    cityPrepositional: 'в Оренбурге',
    cityGenitive: 'Оренбурга',
    region: 'Оренбургская область',
    federalDistrict: 'volga',
    yandexRegionId: 48,
    population: 570000,
    isActive: true,
  },
  'kemerovo': {
    subdomain: 'kemerovo',
    city: 'Кемерово',
    cityPrepositional: 'в Кемерове',
    cityGenitive: 'Кемерова',
    region: 'Кемеровская область',
    federalDistrict: 'siberian',
    yandexRegionId: 64,
    population: 550000,
    isActive: true,
  },
  'novokuznetsk': {
    subdomain: 'novokuznetsk',
    city: 'Новокузнецк',
    cityPrepositional: 'в Новокузнецке',
    cityGenitive: 'Новокузнецка',
    region: 'Кемеровская область',
    federalDistrict: 'siberian',
    yandexRegionId: 64,
    population: 540000,
    isActive: true,
  },
  'astrakhan': {
    subdomain: 'astrakhan',
    city: 'Астрахань',
    cityPrepositional: 'в Астрахани',
    cityGenitive: 'Астрахани',
    region: 'Астраханская область',
    federalDistrict: 'southern',
    yandexRegionId: 37,
    population: 530000,
    isActive: true,
  },
  'penza': {
    subdomain: 'penza',
    city: 'Пенза',
    cityPrepositional: 'в Пензе',
    cityGenitive: 'Пензы',
    region: 'Пензенская область',
    federalDistrict: 'volga',
    yandexRegionId: 49,
    population: 520000,
    isActive: true,
  },
  'lipetsk': {
    subdomain: 'lipetsk',
    city: 'Липецк',
    cityPrepositional: 'в Липецке',
    cityGenitive: 'Липецка',
    region: 'Липецкая область',
    federalDistrict: 'central',
    yandexRegionId: 9,
    population: 510000,
    isActive: true,
  },
  'kirov': {
    subdomain: 'kirov',
    city: 'Киров',
    cityPrepositional: 'в Кирове',
    cityGenitive: 'Кирова',
    region: 'Кировская область',
    federalDistrict: 'volga',
    yandexRegionId: 46,
    population: 500000,
    isActive: true,
  },

  // ---------------------------------------------------------------------------
  // РОССИЯ: ДОПОЛНИТЕЛЬНЫЕ ГОРОДА (с сайта gsg-rt.ru)
  // ---------------------------------------------------------------------------
  'vologda': {
    subdomain: 'vologda',
    city: 'Вологда',
    cityPrepositional: 'в Вологде',
    cityGenitive: 'Вологды',
    region: 'Вологодская область',
    federalDistrict: 'northwestern',
    yandexRegionId: 21,
    population: 310000,
    isActive: true,
  },
  'novorossiysk': {
    subdomain: 'novorossiysk',
    city: 'Новороссийск',
    cityPrepositional: 'в Новороссийске',
    cityGenitive: 'Новороссийска',
    region: 'Краснодарский край',
    federalDistrict: 'southern',
    yandexRegionId: 970,
    population: 280000,
    isActive: true,
    uniqueText: 'Сертификация в Новороссийске. Работаем с морским портом и импортёрами.',
  },

  // ---------------------------------------------------------------------------
  // СТРАНЫ СНГ
  // ---------------------------------------------------------------------------
  'kazakhstan': {
    subdomain: 'kazakhstan',
    city: 'Казахстан',
    cityPrepositional: 'в Казахстане',
    cityGenitive: 'Казахстана',
    region: 'Республика Казахстан',
    federalDistrict: 'volga', // условно, для совместимости
    yandexRegionId: 159,
    population: 19000000,
    isActive: true,
    uniqueText: 'Сертификация для Казахстана. Оформляем документы для ЕАЭС.',
  },
  'kyrgyzstan': {
    subdomain: 'kyrgyzstan',
    city: 'Киргизия',
    cityPrepositional: 'в Киргизии',
    cityGenitive: 'Киргизии',
    region: 'Кыргызская Республика',
    federalDistrict: 'volga', // условно
    yandexRegionId: 207,
    population: 6700000,
    isActive: true,
    uniqueText: 'Сертификация для Киргизии. Документы ЕАЭС для бизнеса в КР.',
  },
  'dubai': {
    subdomain: 'dubai',
    city: 'ОАЭ',
    cityPrepositional: 'в ОАЭ',
    cityGenitive: 'ОАЭ',
    region: 'Объединённые Арабские Эмираты',
    federalDistrict: 'southern', // условно
    yandexRegionId: 0,
    population: 10000000,
    isActive: true,
    uniqueText: 'Сертификация для ОАЭ. Помогаем с экспортом в Эмираты.',
  },
};

// =============================================================================
// ФУНКЦИИ ДЛЯ РАБОТЫ С РЕГИОНАМИ
// =============================================================================

/** Получить регион по поддомену */
export function getRegion(subdomain: string): RegionData | undefined {
  return ALL_REGIONS[subdomain];
}

/** Получить все активные регионы */
export function getActiveRegions(): RegionData[] {
  return Object.values(ALL_REGIONS)
    .filter(r => r.isActive)
    .sort((a, b) => b.population - a.population);
}

/** Получить регионы по федеральному округу */
export function getRegionsByDistrict(district: FederalDistrict): RegionData[] {
  return Object.values(ALL_REGIONS)
    .filter(r => r.federalDistrict === district && r.isActive)
    .sort((a, b) => b.population - a.population);
}

/**
 * Генерация регионального SEO для любой страницы
 *
 * Использование:
 * const seo = generateRegionalSEO(region, {
 *   baseTitle: 'Сертификат на игрушки',
 *   baseDescription: 'Оформление сертификата на игрушки',
 *   baseH1: 'Сертификат на игрушки',
 *   serviceName: 'сертификацию игрушек',
 * });
 */
export function generateRegionalSEO(
  region: RegionData,
  options: {
    baseTitle: string;
    baseDescription: string;
    baseH1: string;
    serviceName: string; // "сертификацию игрушек", "оформление декларации"
  }
): RegionalSEO {
  const { baseTitle, baseDescription, baseH1, serviceName } = options;

  return {
    // Title: "Сертификат на игрушки в Казани — от 15 000 ₽ | ГОСТСЕРТГРУПП"
    title: `${baseTitle} ${region.cityPrepositional} — ${baseTitle.includes('₽') ? '' : 'от 15 000 ₽ | '}ГОСТСЕРТГРУПП`,

    // Description: уникальный для региона
    description: `${baseDescription} ${region.cityPrepositional}. Работаем по всей ${region.region}. Срок 7-14 дней. Звоните: ${region.phone || '8 800 550-52-88'}`,

    // H1: "Сертификат на игрушки в Казани"
    h1: `${baseH1} ${region.cityPrepositional}`,

    // Уникальный вводный текст для региона
    introText: generateRegionalIntro(region, serviceName),
  };
}

/**
 * Генерация уникального вводного текста для региона
 * Это ключевой элемент для SEO — каждый регион получает уникальный контент
 */
function generateRegionalIntro(region: RegionData, serviceName: string): string {
  // Если есть уникальный текст — используем его
  if (region.uniqueText) {
    return region.uniqueText;
  }

  // Генерируем по шаблонам в зависимости от федерального округа
  const templates: Record<FederalDistrict, string[]> = {
    central: [
      `Оформляем ${serviceName} для компаний ${region.cityGenitive} и ${region.region}. Центральный регион — быстрая доставка документов.`,
      `${serviceName.charAt(0).toUpperCase() + serviceName.slice(1)} ${region.cityPrepositional}. Работаем с предприятиями ЦФО более 12 лет.`,
    ],
    northwestern: [
      `${serviceName.charAt(0).toUpperCase() + serviceName.slice(1)} ${region.cityPrepositional} и Северо-Западе. Опыт работы с морскими перевозками и импортом.`,
      `Оформляем ${serviceName} для бизнеса ${region.cityGenitive}. Знаем специфику СЗФО.`,
    ],
    southern: [
      `${serviceName.charAt(0).toUpperCase() + serviceName.slice(1)} ${region.cityPrepositional}. Работаем с сельхозпроизводителями и курортным бизнесом ЮФО.`,
      `Оформляем ${serviceName} для компаний Юга России. ${region.city} и весь ${region.region}.`,
    ],
    northcaucasian: [
      `${serviceName.charAt(0).toUpperCase() + serviceName.slice(1)} ${region.cityPrepositional} и СКФО. Работаем со всеми республиками Северного Кавказа.`,
      `Оформляем ${serviceName} для предприятий ${region.cityGenitive}. Опыт работы в регионе более 10 лет.`,
    ],
    volga: [
      `${serviceName.charAt(0).toUpperCase() + serviceName.slice(1)} ${region.cityPrepositional}. Крупнейший центр сертификации в Поволжье.`,
      `Оформляем ${serviceName} для производителей ${region.cityGenitive} и ${region.region}. Работаем по всему ПФО.`,
    ],
    ural: [
      `${serviceName.charAt(0).toUpperCase() + serviceName.slice(1)} ${region.cityPrepositional}. Работаем с промышленными предприятиями Урала.`,
      `Оформляем ${serviceName} для бизнеса ${region.cityGenitive}. Опыт работы с металлургией и машиностроением.`,
    ],
    siberian: [
      `${serviceName.charAt(0).toUpperCase() + serviceName.slice(1)} ${region.cityPrepositional}. Крупнейший центр сертификации в Сибири.`,
      `Оформляем ${serviceName} для компаний ${region.cityGenitive} и СФО. Быстрая доставка по всей Сибири.`,
    ],
    fareastern: [
      `${serviceName.charAt(0).toUpperCase() + serviceName.slice(1)} ${region.cityPrepositional}. Специализируемся на импорте из Азии.`,
      `Оформляем ${serviceName} для бизнеса Дальнего Востока. Опыт работы с Китаем, Японией, Кореей.`,
    ],
  };

  const districtTemplates = templates[region.federalDistrict];
  // Выбираем шаблон на основе хеша города (для стабильности)
  const hash = region.city.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  return districtTemplates[hash % districtTemplates.length];
}

/**
 * Генерация региональных данных для страницы канала продаж
 *
 * Пример: kazan.gsg-rt.ru/sertifikat-tr-ts/008-igrushki/prodazha/wildberries/
 */
export function generateRegionalChannelSEO(
  region: RegionData,
  channel: TRTSSalesChannel,
  trtsNumber: string
): RegionalSEO {
  return generateRegionalSEO(region, {
    baseTitle: `${channel.seo.title.split('—')[0].trim()}`,
    baseDescription: channel.seo.description,
    baseH1: channel.seo.h1,
    serviceName: `сертификаты ${trtsNumber} для ${channel.name}`,
  });
}

/**
 * Генерация региональных данных для страницы импорта
 */
export function generateRegionalImportSEO(
  region: RegionData,
  importData: TRTSImport,
  trtsNumber: string
): RegionalSEO {
  return generateRegionalSEO(region, {
    baseTitle: importData.seo.title.split('—')[0].trim(),
    baseDescription: importData.seo.description,
    baseH1: importData.seo.h1,
    serviceName: `сертификацию товаров ${importData.nameFrom}`,
  });
}

/**
 * Получить соседние регионы (для перелинковки)
 */
export function getNearbyRegions(subdomain: string, limit: number = 5): RegionData[] {
  const current = ALL_REGIONS[subdomain];
  if (!current) return [];

  return Object.values(ALL_REGIONS)
    .filter(r => r.subdomain !== subdomain && r.isActive && r.federalDistrict === current.federalDistrict)
    .sort((a, b) => b.population - a.population)
    .slice(0, limit);
}

/**
 * Получить все поддомены для generateStaticParams
 */
export function getAllRegionSubdomains(): string[] {
  return Object.values(ALL_REGIONS)
    .filter(r => r.isActive)
    .map(r => r.subdomain);
}

/**
 * Проверить, является ли домен региональным поддоменом
 */
export function isRegionalSubdomain(hostname: string): RegionData | null {
  // hostname: "kazan.gsg-rt.ru" или "gsg-rt.ru"
  const parts = hostname.split('.');
  if (parts.length < 3) return null; // нет поддомена

  const subdomain = parts[0];
  const region = ALL_REGIONS[subdomain];

  return region?.isActive ? region : null;
}
