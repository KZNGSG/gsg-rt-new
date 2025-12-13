// Типы для всего проекта GSG-RT

// Услуга сертификации
export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: string;
  priceFrom?: number;
  duration: string;
  icon?: string;
  image?: string;
  documents?: string[];
  tnvedCodes?: string[];
  category: ServiceCategory;
  popular?: boolean;
}

// Категории услуг
export type ServiceCategory =
  | 'sertifikat-tr-ts'
  | 'deklaratsiya-tr-ts'
  | 'sertifikat-gost-r'
  | 'deklaratsiya-gost-r'
  | 'sgr'
  | 'sts'
  | 'protokol-ispytaniy'
  | 'otkaznoye-pismo'
  | 'other';

// Город/Филиал
export interface City {
  id: string;
  slug: string;
  name: string;
  region?: string;
  address: string;
  phone: string;
  email: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  workingHours: string;
  isMain?: boolean;
}

// Заявка с формы
export interface LeadForm {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  service?: string;
  city?: string;
  source: string;
  utm?: UTMParams;
}

// UTM метки
export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

// ТН ВЭД код
export interface TNVEDCode {
  code: string;
  name: string;
  description?: string;
  requiredDocuments: string[];
  technicalRegulations?: string[];
}

// Отзыв клиента
export interface Review {
  id: string;
  author: string;
  company?: string;
  text: string;
  rating: number;
  date: string;
  service?: string;
}

// Благодарственное письмо
export interface ThankYouLetter {
  id: string;
  company: string;
  image: string;
  date: string;
}

// Статья блога / База знаний
export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  author?: string;
  publishedAt: string;
  updatedAt?: string;
  category: string;
  tags: string[];
  readingTime?: number;
}

// SEO мета данные
export interface SEOMeta {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

// Навигация
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
  icon?: string;
}
