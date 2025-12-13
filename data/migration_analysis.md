# Анализ структуры сайта gsg-rt.ru для миграции

## Общая статистика
- **Всего URL в sitemap**: ~583,530 (с дубликатами от поддоменов)
- **Уникальных путей**: 19,300
- **Чистых URL (без ID)**: 475
- **Поддоменов (города)**: 32

## Важное открытие
Все 32 поддомена (moscow, spb, ekaterinburg и др.) используют **один и тот же контент** 
с главного домена gsg-rt.ru. В sitemap всех поддоменов URL ведут на gsg-rt.ru.

**Вывод**: Контент нужно мигрировать только один раз. Города - это просто локализация 
(разные телефоны, адреса), а не отдельный контент.

## Структура контента

### 1. Виды сертификации (vidy-sertifikacii/) - 177 страниц
Основной контент услуг:
- deklarirovanie/ - декларирование (~40 страниц)
- bezopasnosti/ - сертификаты безопасности
- gost-r/ - сертификаты ГОСТ Р
- iso/ - сертификаты ISO
- sgr/ - СГР (санитарная регистрация)
- tr-ts/ - технические регламенты ТС

### 2. Сертификаты на товары (sertifikat-na-tovar/) - 81 страница
Категории товаров:
- bytovaya-tekhnika/ - бытовая техника
- detskie-tovary/ - детские товары
- kosmetiki/ - косметика
- produkty-pitaniya/ - продукты питания
- stroymaterialy/ - стройматериалы
- odezhda/ - одежда
- oborudovanie/ - оборудование

### 3. О компании (o-nas/) - 12 страниц
- Страницы о компании
- Партнёры
- Лицензии
- Отзывы

### 4. Контакты (kontakty/) - 3 страницы

### 5. Портфолио клиентов (ooo-*, zao-*) - ~50 страниц
Страницы успешных кейсов с клиентами

### 6. Новости и статьи (news/, poleznaya-informaciya/)

## URL с ID-параметрами (~19,000)
Большинство URL содержат ID= параметры:
- `/vidy-sertifikacii/?ID=12345`

Это динамические страницы Bitrix, которые нужно будет заменить на ЧПУ.

## Рекомендации по миграции

### Приоритет 1: Основной контент (без ID)
1. Главная страница
2. Виды сертификации (177 стр)
3. Сертификаты на товары (81 стр)
4. О компании (12 стр)
5. Контакты

### Приоритет 2: Динамический контент
1. Страницы с ID - конвертировать в ЧПУ
2. Новости/статьи - мигрировать в CMS

### Приоритет 3: Поддомены
1. Настроить роутинг по городам
2. Локализация телефонов/адресов
3. 301 редиректы с поддоменов

## Список поддоменов
1. astrakhan.gsg-rt.ru
2. barnaul.gsg-rt.ru  
3. chelyabinsk.gsg-rt.ru
4. dubai.gsg-rt.ru
5. ekaterinburg.gsg-rt.ru
6. irkutsk.gsg-rt.ru
7. izhevsk.gsg-rt.ru
8. kemerovo.gsg-rt.ru
9. kirov.gsg-rt.ru
10. krasnodar.gsg-rt.ru
11. krasnoyarsk.gsg-rt.ru
12. kyrgyzstan.gsg-rt.ru
13. lipetsk.gsg-rt.ru
14. msk.gsg-rt.ru
15. nizhny-novgorod.gsg-rt.ru
16. novokuznetsk.gsg-rt.ru
17. novorossiysk.gsg-rt.ru
18. novosibirsk.gsg-rt.ru
19. orenburg.gsg-rt.ru
20. penza.gsg-rt.ru
21. perm.gsg-rt.ru
22. petropavlovsk.gsg-rt.ru
23. s-peterburg.gsg-rt.ru
24. samara.gsg-rt.ru
25. saratov.gsg-rt.ru
26. ufa.gsg-rt.ru
27. vladivostok.gsg-rt.ru
28. volgograd.gsg-rt.ru
29. vologda.gsg-rt.ru
30. voronezh.gsg-rt.ru
31. yaroslavl.gsg-rt.ru
32. gsg-rt.ru (основной)
