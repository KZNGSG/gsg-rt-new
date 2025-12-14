// База данных ТН ВЭД кодов с привязкой к техническим регламентам
// Это демо-версия, в продакшене будет полная база

export interface TechnicalRegulation {
  code: string;
  name: string;
  shortName: string;
  description: string;
}

export interface RequiredDocument {
  type: 'certificate' | 'declaration' | 'registration' | 'rejection';
  name: string;
  price: string;
  duration: string;
  description: string;
}

export interface TNVEDItem {
  code: string;
  name: string;
  description: string;
  regulations: string[]; // коды регламентов
  documents: RequiredDocument[];
  notes?: string;
}

export interface TNVEDGroup {
  code: string;
  name: string;
  items: TNVEDItem[];
}

// Технические регламенты Таможенного союза
export const TECHNICAL_REGULATIONS: Record<string, TechnicalRegulation> = {
  'TR_TS_004': {
    code: 'ТР ТС 004/2011',
    name: 'О безопасности низковольтного оборудования',
    shortName: 'Низковольтное оборудование',
    description: 'Распространяется на электрическое оборудование с номинальным напряжением от 50 до 1000 В переменного тока и от 75 до 1500 В постоянного тока',
  },
  'TR_TS_005': {
    code: 'ТР ТС 005/2011',
    name: 'О безопасности упаковки',
    shortName: 'Упаковка',
    description: 'Устанавливает требования к упаковке и укупорочным средствам',
  },
  'TR_TS_007': {
    code: 'ТР ТС 007/2011',
    name: 'О безопасности продукции, предназначенной для детей и подростков',
    shortName: 'Детские товары',
    description: 'Распространяется на продукцию для детей и подростков',
  },
  'TR_TS_008': {
    code: 'ТР ТС 008/2011',
    name: 'О безопасности игрушек',
    shortName: 'Игрушки',
    description: 'Устанавливает требования к игрушкам',
  },
  'TR_TS_009': {
    code: 'ТР ТС 009/2011',
    name: 'О безопасности парфюмерно-косметической продукции',
    shortName: 'Косметика',
    description: 'Распространяется на парфюмерно-косметическую продукцию',
  },
  'TR_TS_010': {
    code: 'ТР ТС 010/2011',
    name: 'О безопасности машин и оборудования',
    shortName: 'Машины и оборудование',
    description: 'Устанавливает требования к машинам и оборудованию',
  },
  'TR_TS_017': {
    code: 'ТР ТС 017/2011',
    name: 'О безопасности продукции лёгкой промышленности',
    shortName: 'Лёгкая промышленность',
    description: 'Распространяется на одежду, обувь, текстиль',
  },
  'TR_TS_020': {
    code: 'ТР ТС 020/2011',
    name: 'Электромагнитная совместимость технических средств',
    shortName: 'ЭМС',
    description: 'Устанавливает требования к электромагнитной совместимости',
  },
  'TR_TS_021': {
    code: 'ТР ТС 021/2011',
    name: 'О безопасности пищевой продукции',
    shortName: 'Пищевая продукция',
    description: 'Основной регламент для пищевых продуктов',
  },
  'TR_TS_022': {
    code: 'ТР ТС 022/2011',
    name: 'Пищевая продукция в части её маркировки',
    shortName: 'Маркировка пищевой продукции',
    description: 'Требования к маркировке пищевых продуктов',
  },
  'TR_TS_024': {
    code: 'ТР ТС 024/2011',
    name: 'Технический регламент на масложировую продукцию',
    shortName: 'Масложировая продукция',
    description: 'Требования к маслам и жирам',
  },
  'TR_TS_025': {
    code: 'ТР ТС 025/2012',
    name: 'О безопасности мебельной продукции',
    shortName: 'Мебель',
    description: 'Устанавливает требования к мебели',
  },
  'TR_TS_029': {
    code: 'ТР ТС 029/2012',
    name: 'Требования безопасности пищевых добавок, ароматизаторов и технологических вспомогательных средств',
    shortName: 'Пищевые добавки',
    description: 'Регламент для пищевых добавок',
  },
  'TR_TS_030': {
    code: 'ТР ТС 030/2012',
    name: 'О требованиях к смазочным материалам, маслам и специальным жидкостям',
    shortName: 'Смазочные материалы',
    description: 'Требования к маслам и смазкам',
  },
  'TR_TS_032': {
    code: 'ТР ТС 032/2013',
    name: 'О безопасности оборудования, работающего под избыточным давлением',
    shortName: 'Оборудование под давлением',
    description: 'Требования к сосудам и аппаратам под давлением',
  },
  'TR_EAES_037': {
    code: 'ТР ЕАЭС 037/2016',
    name: 'Об ограничении применения опасных веществ в изделиях электротехники и радиоэлектроники',
    shortName: 'RoHS',
    description: 'Ограничение вредных веществ в электронике',
  },
  'TR_EAES_043': {
    code: 'ТР ЕАЭС 043/2017',
    name: 'О требованиях к средствам обеспечения пожарной безопасности и пожаротушения',
    shortName: 'Пожарная безопасность',
    description: 'Требования к средствам пожаротушения',
  },
  'TR_EAES_044': {
    code: 'ТР ЕАЭС 044/2017',
    name: 'О безопасности упакованной питьевой воды, включая природную минеральную воду',
    shortName: 'Питьевая вода',
    description: 'Требования к бутилированной воде',
  },
  'SGR': {
    code: 'СГР',
    name: 'Свидетельство о государственной регистрации',
    shortName: 'СГР',
    description: 'Требуется для продукции из Единого перечня (ЕЭК)',
  },
};

// Демо-база ТН ВЭД кодов (популярные категории)
export const TN_VED_DATABASE: TNVEDGroup[] = [
  {
    code: '84',
    name: 'Реакторы ядерные, котлы, оборудование и механические устройства',
    items: [
      {
        code: '8414 80',
        name: 'Компрессоры воздушные',
        description: 'Компрессоры воздушные или вакуумные насосы прочие',
        regulations: ['TR_TS_010', 'TR_TS_004', 'TR_TS_020'],
        documents: [
          {
            type: 'certificate',
            name: 'Сертификат ТР ТС 010/2011',
            price: 'от 25 000 ₽',
            duration: '5-7 дней',
            description: 'Обязательный сертификат на машины и оборудование',
          },
          {
            type: 'declaration',
            name: 'Декларация ТР ТС 004/2011',
            price: 'от 12 000 ₽',
            duration: '3-5 дней',
            description: 'На низковольтное оборудование (если применимо)',
          },
          {
            type: 'declaration',
            name: 'Декларация ТР ТС 020/2011',
            price: 'от 12 000 ₽',
            duration: '3-5 дней',
            description: 'На электромагнитную совместимость',
          },
        ],
        notes: 'Для промышленных компрессоров требуется полный комплект документов',
      },
      {
        code: '8418 10',
        name: 'Холодильники-морозильники комбинированные',
        description: 'Холодильники-морозильники бытовые',
        regulations: ['TR_TS_004', 'TR_TS_020', 'TR_EAES_037'],
        documents: [
          {
            type: 'declaration',
            name: 'Декларация ТР ТС 004/2011',
            price: 'от 15 000 ₽',
            duration: '5-7 дней',
            description: 'Обязательная декларация на низковольтное оборудование',
          },
          {
            type: 'declaration',
            name: 'Декларация ТР ТС 020/2011',
            price: 'от 12 000 ₽',
            duration: '3-5 дней',
            description: 'На электромагнитную совместимость',
          },
          {
            type: 'declaration',
            name: 'Декларация ТР ЕАЭС 037/2016',
            price: 'от 10 000 ₽',
            duration: '3-5 дней',
            description: 'RoHS — ограничение вредных веществ',
          },
        ],
      },
      {
        code: '8422 40',
        name: 'Машины для упаковывания',
        description: 'Машины для упаковывания или обёртывания товаров',
        regulations: ['TR_TS_010', 'TR_TS_004', 'TR_TS_020'],
        documents: [
          {
            type: 'certificate',
            name: 'Сертификат ТР ТС 010/2011',
            price: 'от 28 000 ₽',
            duration: '7-10 дней',
            description: 'Обязательный сертификат на машины и оборудование',
          },
          {
            type: 'declaration',
            name: 'Декларация ТР ТС 004/2011',
            price: 'от 12 000 ₽',
            duration: '3-5 дней',
            description: 'На электрическую часть',
          },
        ],
      },
    ],
  },
  {
    code: '85',
    name: 'Электрические машины и оборудование',
    items: [
      {
        code: '8516 50',
        name: 'Микроволновые печи',
        description: 'Печи микроволновые бытовые',
        regulations: ['TR_TS_004', 'TR_TS_020', 'TR_EAES_037'],
        documents: [
          {
            type: 'declaration',
            name: 'Декларация ТР ТС 004/2011',
            price: 'от 15 000 ₽',
            duration: '5-7 дней',
            description: 'На низковольтное оборудование',
          },
          {
            type: 'declaration',
            name: 'Декларация ТР ТС 020/2011',
            price: 'от 12 000 ₽',
            duration: '3-5 дней',
            description: 'ЭМС',
          },
          {
            type: 'declaration',
            name: 'Декларация ТР ЕАЭС 037/2016',
            price: 'от 10 000 ₽',
            duration: '3-5 дней',
            description: 'RoHS',
          },
        ],
      },
      {
        code: '8517 12',
        name: 'Телефоны мобильные',
        description: 'Телефоны для сотовых сетей связи или для прочих беспроводных сетей',
        regulations: ['TR_TS_004', 'TR_TS_020', 'TR_EAES_037'],
        documents: [
          {
            type: 'declaration',
            name: 'Декларация ТР ТС 004/2011',
            price: 'от 18 000 ₽',
            duration: '7-10 дней',
            description: 'На низковольтное оборудование',
          },
          {
            type: 'declaration',
            name: 'Декларация ТР ТС 020/2011',
            price: 'от 15 000 ₽',
            duration: '5-7 дней',
            description: 'ЭМС — обязательно для радиоэлектроники',
          },
          {
            type: 'declaration',
            name: 'Декларация ТР ЕАЭС 037/2016',
            price: 'от 10 000 ₽',
            duration: '3-5 дней',
            description: 'RoHS',
          },
        ],
        notes: 'Дополнительно может потребоваться нотификация ФСБ',
      },
      {
        code: '8528 72',
        name: 'Телевизоры',
        description: 'Аппаратура приёмная для телевизионной связи цветного изображения',
        regulations: ['TR_TS_004', 'TR_TS_020', 'TR_EAES_037'],
        documents: [
          {
            type: 'declaration',
            name: 'Декларация ТР ТС 004/2011',
            price: 'от 15 000 ₽',
            duration: '5-7 дней',
            description: 'На низковольтное оборудование',
          },
          {
            type: 'declaration',
            name: 'Декларация ТР ТС 020/2011',
            price: 'от 12 000 ₽',
            duration: '5-7 дней',
            description: 'ЭМС',
          },
          {
            type: 'declaration',
            name: 'Декларация ТР ЕАЭС 037/2016',
            price: 'от 10 000 ₽',
            duration: '3-5 дней',
            description: 'RoHS',
          },
        ],
      },
    ],
  },
  {
    code: '61-62',
    name: 'Одежда и принадлежности к одежде',
    items: [
      {
        code: '6109',
        name: 'Футболки, майки трикотажные',
        description: 'Футболки, майки и прочие нательные фуфайки трикотажные машинного или ручного вязания',
        regulations: ['TR_TS_017'],
        documents: [
          {
            type: 'declaration',
            name: 'Декларация ТР ТС 017/2011',
            price: 'от 8 000 ₽',
            duration: '3-5 дней',
            description: 'Декларация на продукцию лёгкой промышленности',
          },
        ],
        notes: 'Для детской одежды требуется сертификат по ТР ТС 007/2011',
      },
      {
        code: '6110',
        name: 'Свитеры, пуловеры, кардиганы',
        description: 'Джемперы, пуловеры, кардиганы, жилеты и аналогичные изделия',
        regulations: ['TR_TS_017'],
        documents: [
          {
            type: 'declaration',
            name: 'Декларация ТР ТС 017/2011',
            price: 'от 8 000 ₽',
            duration: '3-5 дней',
            description: 'Декларация на продукцию лёгкой промышленности',
          },
        ],
      },
      {
        code: '6203',
        name: 'Костюмы, брюки мужские',
        description: 'Костюмы, комплекты, пиджаки, блейзеры, брюки мужские или для мальчиков',
        regulations: ['TR_TS_017'],
        documents: [
          {
            type: 'declaration',
            name: 'Декларация ТР ТС 017/2011',
            price: 'от 8 000 ₽',
            duration: '3-5 дней',
            description: 'Декларация на продукцию лёгкой промышленности',
          },
        ],
      },
    ],
  },
  {
    code: '64',
    name: 'Обувь',
    items: [
      {
        code: '6403',
        name: 'Обувь с верхом из натуральной кожи',
        description: 'Обувь с подошвой из резины, пластмассы, натуральной или композиционной кожи и с верхом из натуральной кожи',
        regulations: ['TR_TS_017'],
        documents: [
          {
            type: 'declaration',
            name: 'Декларация ТР ТС 017/2011',
            price: 'от 10 000 ₽',
            duration: '3-5 дней',
            description: 'Декларация на обувь',
          },
        ],
        notes: 'Детская обувь — сертификат по ТР ТС 007/2011',
      },
      {
        code: '6404',
        name: 'Обувь с верхом из текстиля',
        description: 'Обувь с подошвой из резины, пластмассы, натуральной или композиционной кожи и с верхом из текстильных материалов',
        regulations: ['TR_TS_017'],
        documents: [
          {
            type: 'declaration',
            name: 'Декларация ТР ТС 017/2011',
            price: 'от 8 000 ₽',
            duration: '3-5 дней',
            description: 'Декларация на обувь',
          },
        ],
      },
    ],
  },
  {
    code: '94',
    name: 'Мебель',
    items: [
      {
        code: '9401',
        name: 'Стулья и кресла',
        description: 'Мебель для сидения (кроме указанной в товарной позиции 9402)',
        regulations: ['TR_TS_025'],
        documents: [
          {
            type: 'declaration',
            name: 'Декларация ТР ТС 025/2012',
            price: 'от 12 000 ₽',
            duration: '5-7 дней',
            description: 'Декларация на мебельную продукцию',
          },
        ],
        notes: 'Детская мебель — сертификат по ТР ТС 007/2011',
      },
      {
        code: '9403',
        name: 'Мебель прочая',
        description: 'Мебель прочая и её части (шкафы, столы, кровати и т.д.)',
        regulations: ['TR_TS_025'],
        documents: [
          {
            type: 'declaration',
            name: 'Декларация ТР ТС 025/2012',
            price: 'от 12 000 ₽',
            duration: '5-7 дней',
            description: 'Декларация на мебельную продукцию',
          },
        ],
      },
    ],
  },
  {
    code: '95',
    name: 'Игрушки, игры, спортивный инвентарь',
    items: [
      {
        code: '9503 00',
        name: 'Игрушки детские',
        description: 'Трёхколёсные велосипеды, самокаты, педальные автомобили и аналогичные игрушки на колёсах; куклы; прочие игрушки',
        regulations: ['TR_TS_008'],
        documents: [
          {
            type: 'certificate',
            name: 'Сертификат ТР ТС 008/2011',
            price: 'от 18 000 ₽',
            duration: '7-10 дней',
            description: 'Обязательный сертификат на игрушки',
          },
        ],
        notes: 'Все детские игрушки подлежат обязательной сертификации',
      },
    ],
  },
  {
    code: '33',
    name: 'Эфирные масла и косметика',
    items: [
      {
        code: '3304',
        name: 'Косметика для лица и губ',
        description: 'Средства для макияжа или ухода за кожей (кроме лекарственных)',
        regulations: ['TR_TS_009'],
        documents: [
          {
            type: 'declaration',
            name: 'Декларация ТР ТС 009/2011',
            price: 'от 12 000 ₽',
            duration: '5-7 дней',
            description: 'Декларация на парфюмерно-косметическую продукцию',
          },
        ],
        notes: 'Для детской косметики и некоторых категорий требуется СГР',
      },
      {
        code: '3305',
        name: 'Средства для волос',
        description: 'Средства для волос (шампуни, лаки, краски и т.д.)',
        regulations: ['TR_TS_009'],
        documents: [
          {
            type: 'declaration',
            name: 'Декларация ТР ТС 009/2011',
            price: 'от 12 000 ₽',
            duration: '5-7 дней',
            description: 'Декларация на парфюмерно-косметическую продукцию',
          },
        ],
      },
      {
        code: '3303',
        name: 'Духи и туалетная вода',
        description: 'Духи и туалетная вода',
        regulations: ['TR_TS_009'],
        documents: [
          {
            type: 'declaration',
            name: 'Декларация ТР ТС 009/2011',
            price: 'от 10 000 ₽',
            duration: '5-7 дней',
            description: 'Декларация на парфюмерно-косметическую продукцию',
          },
        ],
      },
    ],
  },
  {
    code: '16-22',
    name: 'Пищевая продукция',
    items: [
      {
        code: '1905',
        name: 'Хлебобулочные и кондитерские изделия',
        description: 'Хлеб, мучные кондитерские изделия, пироги, печенье, вафли',
        regulations: ['TR_TS_021', 'TR_TS_022'],
        documents: [
          {
            type: 'declaration',
            name: 'Декларация ТР ТС 021/2011',
            price: 'от 15 000 ₽',
            duration: '5-7 дней',
            description: 'Декларация на пищевую продукцию',
          },
        ],
        notes: 'Требуется внедрение ХАССП на производстве',
      },
      {
        code: '2106',
        name: 'Пищевые продукты прочие',
        description: 'Пищевые продукты, в другом месте не поименованные',
        regulations: ['TR_TS_021', 'TR_TS_022', 'TR_TS_029'],
        documents: [
          {
            type: 'declaration',
            name: 'Декларация ТР ТС 021/2011',
            price: 'от 15 000 ₽',
            duration: '5-7 дней',
            description: 'Декларация на пищевую продукцию',
          },
          {
            type: 'registration',
            name: 'СГР (при необходимости)',
            price: 'от 35 000 ₽',
            duration: '30-60 дней',
            description: 'Для БАД, спецпитания, новых продуктов',
          },
        ],
        notes: 'БАДы и спецпитание требуют СГР',
      },
      {
        code: '2202',
        name: 'Воды и безалкогольные напитки',
        description: 'Воды, включая минеральные и газированные, с добавлением сахара или других подслащивающих или вкусо-ароматических веществ',
        regulations: ['TR_TS_021', 'TR_TS_022', 'TR_EAES_044'],
        documents: [
          {
            type: 'declaration',
            name: 'Декларация ТР ТС 021/2011',
            price: 'от 12 000 ₽',
            duration: '5-7 дней',
            description: 'На пищевую продукцию',
          },
          {
            type: 'declaration',
            name: 'Декларация ТР ЕАЭС 044/2017',
            price: 'от 15 000 ₽',
            duration: '5-7 дней',
            description: 'Для упакованной питьевой воды',
          },
        ],
      },
    ],
  },
  {
    code: '90',
    name: 'Медицинские изделия и оптика',
    items: [
      {
        code: '9018',
        name: 'Медицинские приборы и инструменты',
        description: 'Приборы и устройства, применяемые в медицине, хирургии, стоматологии или ветеринарии',
        regulations: [],
        documents: [
          {
            type: 'registration',
            name: 'Регистрационное удостоверение Росздравнадзора',
            price: 'от 150 000 ₽',
            duration: '3-12 месяцев',
            description: 'Обязательная регистрация медицинских изделий',
          },
        ],
        notes: 'Медицинские изделия регулируются ПП РФ 1416. Класс риска определяет сроки и стоимость.',
      },
      {
        code: '9019',
        name: 'Оборудование для механотерапии',
        description: 'Устройства для механотерапии; аппараты массажные; аппараты для психологических тестов',
        regulations: [],
        documents: [
          {
            type: 'registration',
            name: 'Регистрационное удостоверение Росздравнадзора',
            price: 'от 150 000 ₽',
            duration: '3-12 месяцев',
            description: 'Обязательная регистрация медицинских изделий',
          },
          {
            type: 'rejection',
            name: 'Отказное письмо',
            price: 'от 5 000 ₽',
            duration: '1-3 дня',
            description: 'Если изделие не является медицинским (бытовые массажёры)',
          },
        ],
        notes: 'Бытовые массажёры могут не являться МИ — требуется экспертиза',
      },
    ],
  },
];

// Функция поиска по базе
export function searchTNVED(query: string): TNVEDItem[] {
  const normalizedQuery = query.toLowerCase().trim();
  const results: TNVEDItem[] = [];

  for (const group of TN_VED_DATABASE) {
    for (const item of group.items) {
      // Поиск по коду
      if (item.code.toLowerCase().includes(normalizedQuery)) {
        results.push(item);
        continue;
      }
      // Поиск по названию
      if (item.name.toLowerCase().includes(normalizedQuery)) {
        results.push(item);
        continue;
      }
      // Поиск по описанию
      if (item.description.toLowerCase().includes(normalizedQuery)) {
        results.push(item);
      }
    }
  }

  return results;
}

// Получить все группы для отображения
export function getAllGroups(): { code: string; name: string; itemCount: number }[] {
  return TN_VED_DATABASE.map((group) => ({
    code: group.code,
    name: group.name,
    itemCount: group.items.length,
  }));
}

// Получить товары по группе
export function getItemsByGroup(groupCode: string): TNVEDItem[] {
  const group = TN_VED_DATABASE.find((g) => g.code === groupCode);
  return group ? group.items : [];
}

// Получить информацию о регламенте
export function getRegulationInfo(code: string): TechnicalRegulation | undefined {
  return TECHNICAL_REGULATIONS[code];
}
