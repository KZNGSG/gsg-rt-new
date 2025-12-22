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
    region: 'РТ',
    street: 'ул. Аметьевская магистраль',
    building: 'д. 10',
    office: 'оф. ГОСТСЕРТГРУПП',
    zip: '420087',
    country: 'Россия',
    full: 'РТ, г. Казань, ул. Аметьевская магистраль, д. 10, оф. ГОСТСЕРТГРУПП',
  },
  social: {
    vk: 'https://vk.com/gostsertgroup',
    telegram: 'https://t.me/gostsertgroup',
    whatsapp: 'https://wa.me/78005505288',
    youtube: 'https://youtube.com/@gostsertgroup',
  },
} as const;

export const MAIN_NAV: { label: string; href: string; highlight?: boolean; children?: { label: string; href: string }[] }[] = [
  {
    label: 'Виды сертификации',
    href: '/vidy-sertifikacii',
    children: [
      { label: 'Декларирование', href: '/vidy-sertifikacii/deklarirovanie' },
      { label: 'Сертификат ТР ТС', href: '/vidy-sertifikacii/sertifikat-tr-ts' },
      { label: 'Сертификат ГОСТ Р', href: '/vidy-sertifikacii/gost-r' },
      { label: 'СГР', href: '/vidy-sertifikacii/sgr' },
      { label: 'Сертификация ISO', href: '/vidy-sertifikacii/iso' },
      { label: 'ХАССП', href: '/vidy-sertifikacii/hassp' },
    ],
  },
  {
    label: 'Сертификат на товар',
    href: '/sertifikat-na-tovar',
    children: [
      { label: 'Бытовая техника', href: '/sertifikat-na-tovar/bytovaya-tekhnika' },
      { label: 'Детские товары', href: '/sertifikat-na-tovar/detskie-tovary' },
      { label: 'Косметика', href: '/sertifikat-na-tovar/kosmetika' },
      { label: 'Продукты питания', href: '/sertifikat-na-tovar/produkty-pitaniya' },
      { label: 'Одежда и обувь', href: '/sertifikat-na-tovar/odezhda' },
    ],
  },
  {
    label: 'Академия',
    href: '/akademiya',
  },
  { label: 'О нас', href: '/o-nas' },
  { label: 'Контакты', href: '/kontakty' },
];

export const SERVICE_CATEGORIES = [
  { id: 'sertifikat-tr-ts', name: 'Сертификат ТР ТС', icon: 'certificate' },
  { id: 'deklaratsiya-tr-ts', name: 'Декларация ТР ТС', icon: 'declaration' },
  { id: 'sertifikat-gost-r', name: 'Сертификат ГОСТ Р', icon: 'gost' },
  { id: 'deklaratsiya-gost-r', name: 'Декларация ГОСТ Р', icon: 'declaration' },
  { id: 'sgr', name: 'СГР (Свидетельство о гос. регистрации)', icon: 'sgr' },
  { id: 'sts', name: 'СТС (Свободная продажа)', icon: 'globe' },
  { id: 'protokol-ispytaniy', name: 'Протокол испытаний', icon: 'test' },
  { id: 'otkaznoye-pismo', name: 'Отказное письмо', icon: 'letter' },
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
