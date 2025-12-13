// Константы проекта GSG-RT

export const SITE_CONFIG = {
  name: 'ГОСТСЕРТГРУПП',
  description: 'Центр сертификации продукции. Оформление сертификатов, деклараций, СГР, отказных писем. 60+ филиалов по России.',
  url: 'https://gsg-rt.ru',
  phone: '8 800 550-52-88',
  phoneClean: '88005505288',
  email: 'office@gsg-rt.ru',
  workingHours: 'Пн-Пт: 9:00 - 18:00',
  foundedYear: 2012,
  address: {
    city: 'Казань',
    street: 'ул. Амирхана, д. 10',
    office: 'офис 1002',
    zip: '420087',
    country: 'Россия',
  },
  social: {
    vk: 'https://vk.com/gostsertgroup',
    telegram: 'https://t.me/gostsertgroup',
    whatsapp: 'https://wa.me/78005505288',
    youtube: 'https://youtube.com/@gostsertgroup',
  },
} as const;

export const MAIN_NAV: { label: string; href: string; children?: { label: string; href: string }[] }[] = [
  {
    label: 'Сертификат на товар',
    href: '/sertifikat-na-tovar',
    children: [
      { label: 'Сертификат ТР ТС', href: '/sertifikat-tr-ts' },
      { label: 'Декларация ТР ТС', href: '/deklaratsiya-tr-ts' },
      { label: 'Сертификат ГОСТ Р', href: '/sertifikat-gost-r' },
      { label: 'Декларация ГОСТ Р', href: '/deklaratsiya-gost-r' },
      { label: 'СГР', href: '/sgr' },
      { label: 'Отказное письмо', href: '/otkaznoye-pismo' },
    ],
  },
  { label: 'Видеоблог', href: '/videoblog' },
  { label: 'О нас', href: '/o-nas' },
  { label: 'Цены', href: '/tseny' },
  { label: 'Контакты', href: '/kontakty' },
];

export const SERVICE_CATEGORIES = [
  { id: 'sertifikat-tr-ts', name: 'Сертификат ТР ТС', icon: '📜' },
  { id: 'deklaratsiya-tr-ts', name: 'Декларация ТР ТС', icon: '📋' },
  { id: 'sertifikat-gost-r', name: 'Сертификат ГОСТ Р', icon: '🏆' },
  { id: 'deklaratsiya-gost-r', name: 'Декларация ГОСТ Р', icon: '📄' },
  { id: 'sgr', name: 'СГР (Свидетельство о гос. регистрации)', icon: '🔬' },
  { id: 'sts', name: 'СТС (Свободная продажа)', icon: '🌍' },
  { id: 'protokol-ispytaniy', name: 'Протокол испытаний', icon: '🧪' },
  { id: 'otkaznoye-pismo', name: 'Отказное письмо', icon: '✉️' },
] as const;

// Цвета бренда
export const BRAND_COLORS = {
  primary: '#2563eb', // Синий
  primaryDark: '#1e40af',
  secondary: '#f97316', // Оранжевый (акцент)
  dark: '#1f2937',
  light: '#f8fafc',
  success: '#22c55e',
  warning: '#eab308',
  error: '#ef4444',
} as const;

// Преимущества компании
export const ADVANTAGES = [
  {
    title: '12+ лет опыта',
    description: 'Работаем с 2012 года, оформили более 50 000 документов',
    icon: 'experience',
  },
  {
    title: '60+ филиалов',
    description: 'Представительства по всей России и в странах СНГ',
    icon: 'offices',
  },
  {
    title: 'От 1 дня',
    description: 'Срочное оформление документов для вашего бизнеса',
    icon: 'speed',
  },
  {
    title: '100% гарантия',
    description: 'Все документы проходят проверку в реестрах',
    icon: 'guarantee',
  },
] as const;

// CRM интеграция
export const CRM_CONFIG = {
  webhookUrl: 'https://gsgcrm.ru/rest/18/5uruvevels5y78uv/',
  defaultCategoryId: 0,
  defaultStageId: 'NEW',
} as const;
