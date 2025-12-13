# Маршрутизация Next.js для gsg-rt.ru

## Структура папок /app

```
src/app/
├── page.tsx                              # Главная
├── layout.tsx                            # Основной layout
├── vidy-sertifikacii/
│   ├── page.tsx                          # Каталог видов сертификации
│   ├── [slug]/
│   │   └── page.tsx                      # Страница вида сертификации
│   ├── deklarirovanie/
│   │   ├── page.tsx                      # Каталог деклараций
│   │   └── [slug]/
│   │       └── page.tsx                  # Конкретная декларация
│   ├── bezopasnosti/
│   │   └── page.tsx
│   ├── gost-r/
│   │   └── page.tsx
│   ├── iso/
│   │   └── page.tsx
│   ├── sgr/
│   │   └── page.tsx
│   └── tr-ts/
│       ├── page.tsx
│       └── [slug]/
│           └── page.tsx
├── sertifikat-na-tovar/
│   ├── page.tsx                          # Каталог товаров
│   └── [category]/
│       ├── page.tsx                      # Категория товаров
│       └── [product]/
│           └── page.tsx                  # Конкретный товар
├── o-nas/
│   ├── page.tsx                          # О компании
│   ├── partnery/
│   │   └── page.tsx
│   ├── licenzii/
│   │   └── page.tsx
│   └── otzyvy/
│       └── page.tsx
├── kontakty/
│   └── page.tsx                          # Контакты
├── novosti/
│   ├── page.tsx                          # Список новостей
│   └── [slug]/
│       └── page.tsx                      # Новость
├── portfolio/
│   ├── page.tsx                          # Портфолио клиентов
│   └── [company]/
│       └── page.tsx                      # Страница клиента
└── [city]/                               # Городские страницы (опционально)
    └── page.tsx
```

## Middleware для городов

Вместо поддоменов можно использовать middleware для определения города:
- По IP геолокации
- По cookie
- По параметру URL

```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const CITIES = {
  'moscow': 'Москва',
  'spb': 'Санкт-Петербург',
  'ekaterinburg': 'Екатеринбург',
  // ...
}

export function middleware(request: NextRequest) {
  // Определение города из поддомена или cookie
  const host = request.headers.get('host') || ''
  const citySlug = host.split('.')[0]
  
  if (CITIES[citySlug]) {
    // Устанавливаем город в cookie
    const response = NextResponse.next()
    response.cookies.set('city', citySlug)
    return response
  }
  
  return NextResponse.next()
}
```

## 301 Редиректы

Файл next.config.js:

```javascript
module.exports = {
  async redirects() {
    return [
      // Редиректы с ID на ЧПУ
      {
        source: '/vidy-sertifikacii/:path*',
        has: [{ type: 'query', key: 'ID' }],
        destination: '/vidy-sertifikacii/:path*',
        permanent: true,
      },
      // Редиректы со старых URL
      {
        source: '/akkreditatsiya/',
        destination: '/vidy-sertifikacii/',
        permanent: true,
      },
    ]
  },
}
```

## Генерация статических путей

```typescript
// src/app/vidy-sertifikacii/[slug]/page.tsx
export async function generateStaticParams() {
  const services = await getServices()
  return services.map((service) => ({
    slug: service.slug,
  }))
}
```

## Хранение контента

Варианты:
1. **JSON файлы** - простой вариант для начала
2. **Headless CMS** - Strapi, Sanity, Contentful
3. **MDX файлы** - для статей

Рекомендация: начать с JSON, потом подключить CMS.

```
src/data/
├── services/
│   ├── deklarirovaniye.json
│   ├── sertifikat-tr-ts.json
│   └── ...
├── products/
│   ├── bytovaya-tekhnika.json
│   └── ...
├── cities/
│   ├── moscow.json
│   ├── spb.json
│   └── ...
└── articles/
    └── ...
```
