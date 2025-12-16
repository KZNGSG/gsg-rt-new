// Правила определения документов по коду ТН ВЭД
// На основе Решения КТС № 299 и технических регламентов

export type DocumentType = 'certificate' | 'declaration' | 'sgr' | 'rejection' | 'registration';

export interface RequiredDocument {
  type: DocumentType;
  name: string;
  regulation?: string;
  price: string;
  duration: string;
  description: string;
}

export interface CertificationResult {
  documents: RequiredDocument[];
  notes: string[];
  needsExpertReview: boolean;
  category: string;
}

// Категории товаров, требующих СГР (Раздел II Единого перечня, Решение КТС №299)
const SGR_CATEGORIES = [
  // Дезинфицирующие средства
  { codes: ['2828', '2829', '3808'], keywords: ['дезинфекц', 'дезинсек', 'дератиз', 'антисептик'], category: 'Дезинфицирующие средства' },
  // Бытовая химия
  { codes: ['3402', '3405'], keywords: ['моющ', 'чистящ', 'стиральн', 'порошок', 'гель для стирки'], category: 'Бытовая химия' },
  // Средства водоподготовки
  { codes: ['2505', '2508', '2512', '3802', '8413'], keywords: ['фильтр для воды', 'водоподготовк', 'очистка воды'], category: 'Средства водоподготовки' },
  // Личная гигиена (для взрослых)
  { codes: ['3306', '9603 21'], keywords: ['зубная паста', 'зубная щетка', 'ополаскиватель для рта', 'нить зубная'], category: 'Средства гигиены полости рта' },
  // Контакт с пищей (кроме посуды)
  { codes: ['3917', '3919', '3920', '3924', '3926', '4818', '6307'], keywords: ['пленка пищевая', 'контейнер для пищи', 'упаковка пищевая'], category: 'Изделия, контактирующие с пищей' },
  // Опасные химические вещества
  { codes: ['2915', '2916', '2917', '2918', '2919', '2920', '2921', '2922', '2923', '2924', '2925', '2926', '2930', '2931', '2932', '2933'], keywords: ['реактив', 'химическ', 'кислота', 'растворитель'], category: 'Химические вещества' },
];

// Категории товаров для детей (ТР ТС 007/2011 - СЕРТИФИКАТ)
const CHILDREN_PRODUCTS = {
  codes: ['9503', '6111', '6209', '6309', '6401', '6402', '6403', '6404', '9401', '9403', '4901', '4903'],
  keywords: ['детск', 'для детей', 'ребенок', 'младенец', 'игрушк', 'для новорожденных'],
  regulation: 'ТР ТС 007/2011',
  category: 'Товары для детей',
};

// Игрушки (ТР ТС 008/2011 - СЕРТИФИКАТ)
const TOYS = {
  codes: ['9503', '9504', '9505'],
  keywords: ['игрушк', 'кукл', 'конструктор', 'настольная игра'],
  regulation: 'ТР ТС 008/2011',
  category: 'Игрушки',
};

// Косметика (ТР ТС 009/2011 - ДЕКЛАРАЦИЯ, но детская требует СГР)
const COSMETICS = {
  codes: ['3303', '3304', '3305', '3307'],
  keywords: ['косметик', 'крем', 'шампун', 'духи', 'туалетная вода', 'помада', 'тушь', 'лак для ногтей'],
  regulation: 'ТР ТС 009/2011',
  category: 'Парфюмерно-косметическая продукция',
};

// Одежда и обувь (ТР ТС 017/2011 - ДЕКЛАРАЦИЯ)
const CLOTHING = {
  codes: ['61', '62', '63', '64', '65'],
  keywords: ['одежд', 'обувь', 'футболк', 'брюк', 'платье', 'куртк', 'пальто', 'ботинк', 'кроссовк', 'туфл'],
  regulation: 'ТР ТС 017/2011',
  category: 'Продукция легкой промышленности',
};

// Мебель (ТР ТС 025/2012 - ДЕКЛАРАЦИЯ)
const FURNITURE = {
  codes: ['9401', '9403', '9404'],
  keywords: ['мебел', 'стул', 'стол', 'кресл', 'шкаф', 'кроват', 'диван', 'матрас'],
  regulation: 'ТР ТС 025/2012',
  category: 'Мебельная продукция',
};

// Электроника (ТР ТС 004, 020, 037 - ДЕКЛАРАЦИЯ)
const ELECTRONICS = {
  codes: ['84', '85'],
  keywords: ['электр', 'телефон', 'компьютер', 'телевизор', 'холодильник', 'стиральн', 'микроволнов', 'чайник', 'утюг'],
  regulations: ['ТР ТС 004/2011', 'ТР ТС 020/2011', 'ТР ЕАЭС 037/2016'],
  category: 'Электротехническая продукция',
};

// Машины и оборудование (ТР ТС 010/2011 - СЕРТИФИКАТ или ДЕКЛАРАЦИЯ)
const MACHINERY = {
  codes: ['84'],
  keywords: ['станок', 'компрессор', 'насос', 'оборудован', 'машин', 'агрегат'],
  regulation: 'ТР ТС 010/2011',
  category: 'Машины и оборудование',
};

// Пищевая продукция (ТР ТС 021, 022 - ДЕКЛАРАЦИЯ, но БАДы требуют СГР)
const FOOD = {
  codes: ['02', '03', '04', '07', '08', '09', '10', '11', '12', '15', '16', '17', '18', '19', '20', '21', '22'],
  keywords: ['пищев', 'продукт', 'еда', 'напиток', 'молок', 'мясо', 'рыба', 'овощ', 'фрукт', 'хлеб', 'кондитер'],
  regulation: 'ТР ТС 021/2011',
  category: 'Пищевая продукция',
};

// БАДы (требуют СГР)
const SUPPLEMENTS = {
  codes: ['2106'],
  keywords: ['бад', 'биологически активн', 'витамин', 'добавка', 'суперфуд'],
  category: 'БАД (биологически активные добавки)',
};

// Медицинские изделия (РУ Росздравнадзора)
const MEDICAL = {
  codes: ['9018', '9019', '9020', '9021', '9022'],
  keywords: ['медицинск', 'хирургическ', 'диагностическ', 'терапевтическ', 'стетоскоп', 'тонометр', 'шприц'],
  category: 'Медицинские изделия',
};

// Функция определения документов
export function determineCertification(code: string, productName: string): CertificationResult {
  const normalizedCode = code.replace(/\s/g, '');
  const normalizedName = productName.toLowerCase();

  const result: CertificationResult = {
    documents: [],
    notes: [],
    needsExpertReview: false,
    category: '',
  };

  // Проверка на детские товары (приоритет)
  if (CHILDREN_PRODUCTS.keywords.some(kw => normalizedName.includes(kw)) ||
      CHILDREN_PRODUCTS.codes.some(c => normalizedCode.startsWith(c))) {
    result.category = CHILDREN_PRODUCTS.category;
    result.documents.push({
      type: 'certificate',
      name: 'Сертификат ТР ТС 007/2011',
      regulation: 'ТР ТС 007/2011',
      price: 'от 18 000 ₽',
      duration: '7-14 дней',
      description: 'Обязательный сертификат на продукцию для детей и подростков',
    });
    result.notes.push('Детские товары подлежат обязательной сертификации');
    return result;
  }

  // Проверка на игрушки
  if (TOYS.keywords.some(kw => normalizedName.includes(kw)) ||
      TOYS.codes.some(c => normalizedCode.startsWith(c))) {
    result.category = TOYS.category;
    result.documents.push({
      type: 'certificate',
      name: 'Сертификат ТР ТС 008/2011',
      regulation: 'ТР ТС 008/2011',
      price: 'от 18 000 ₽',
      duration: '7-14 дней',
      description: 'Обязательный сертификат на игрушки',
    });
    result.notes.push('Все игрушки подлежат обязательной сертификации');
    return result;
  }

  // Проверка на СГР (дезинфекция, бытовая химия и т.д.)
  for (const sgrCat of SGR_CATEGORIES) {
    if (sgrCat.codes.some(c => normalizedCode.startsWith(c)) ||
        sgrCat.keywords.some(kw => normalizedName.includes(kw))) {
      result.category = sgrCat.category;
      result.documents.push({
        type: 'sgr',
        name: 'СГР (Свидетельство о государственной регистрации)',
        price: 'от 35 000 ₽',
        duration: '30-60 дней',
        description: 'Свидетельство о государственной регистрации продукции',
      });
      result.notes.push('Продукция входит в Единый перечень товаров, подлежащих государственной регистрации');
      return result;
    }
  }

  // Проверка на БАДы
  if (SUPPLEMENTS.keywords.some(kw => normalizedName.includes(kw)) ||
      SUPPLEMENTS.codes.some(c => normalizedCode.startsWith(c))) {
    result.category = SUPPLEMENTS.category;
    result.documents.push({
      type: 'sgr',
      name: 'СГР (Свидетельство о государственной регистрации)',
      price: 'от 45 000 ₽',
      duration: '60-90 дней',
      description: 'Обязательная государственная регистрация для БАД',
    });
    result.notes.push('БАДы подлежат обязательной государственной регистрации');
    return result;
  }

  // Проверка на медицинские изделия
  if (MEDICAL.keywords.some(kw => normalizedName.includes(kw)) ||
      MEDICAL.codes.some(c => normalizedCode.startsWith(c))) {
    result.category = MEDICAL.category;
    result.documents.push({
      type: 'registration',
      name: 'РУ Росздравнадзора',
      price: 'от 150 000 ₽',
      duration: '3-12 месяцев',
      description: 'Регистрационное удостоверение медицинского изделия',
    });
    result.notes.push('Медицинские изделия регистрируются в Росздравнадзоре');
    result.needsExpertReview = true;
    return result;
  }

  // Проверка на косметику
  if (COSMETICS.keywords.some(kw => normalizedName.includes(kw)) ||
      COSMETICS.codes.some(c => normalizedCode.startsWith(c))) {
    result.category = COSMETICS.category;
    result.documents.push({
      type: 'declaration',
      name: 'Декларация ТР ТС 009/2011',
      regulation: 'ТР ТС 009/2011',
      price: 'от 12 000 ₽',
      duration: '5-7 дней',
      description: 'Декларация на парфюмерно-косметическую продукцию',
    });
    if (normalizedName.includes('детск') || normalizedName.includes('для детей')) {
      result.documents = [{
        type: 'sgr',
        name: 'СГР + Декларация ТР ТС 009/2011',
        price: 'от 40 000 ₽',
        duration: '30-60 дней',
        description: 'Детская косметика требует государственной регистрации',
      }];
      result.notes.push('Детская косметика требует СГР');
    }
    return result;
  }

  // Проверка на одежду и обувь
  if (CLOTHING.keywords.some(kw => normalizedName.includes(kw)) ||
      CLOTHING.codes.some(c => normalizedCode.startsWith(c))) {
    result.category = CLOTHING.category;
    result.documents.push({
      type: 'declaration',
      name: 'Декларация ТР ТС 017/2011',
      regulation: 'ТР ТС 017/2011',
      price: 'от 8 000 ₽',
      duration: '3-5 дней',
      description: 'Декларация на продукцию легкой промышленности',
    });
    return result;
  }

  // Проверка на мебель
  if (FURNITURE.keywords.some(kw => normalizedName.includes(kw)) ||
      FURNITURE.codes.some(c => normalizedCode.startsWith(c))) {
    result.category = FURNITURE.category;
    result.documents.push({
      type: 'declaration',
      name: 'Декларация ТР ТС 025/2012',
      regulation: 'ТР ТС 025/2012',
      price: 'от 12 000 ₽',
      duration: '5-7 дней',
      description: 'Декларация на мебельную продукцию',
    });
    return result;
  }

  // Проверка на электронику
  if (ELECTRONICS.keywords.some(kw => normalizedName.includes(kw)) ||
      ELECTRONICS.codes.some(c => normalizedCode.startsWith(c))) {
    result.category = ELECTRONICS.category;
    result.documents.push({
      type: 'declaration',
      name: 'Декларация ТР ТС 004/2011',
      regulation: 'ТР ТС 004/2011',
      price: 'от 15 000 ₽',
      duration: '5-7 дней',
      description: 'Декларация на низковольтное оборудование',
    });
    result.documents.push({
      type: 'declaration',
      name: 'Декларация ТР ТС 020/2011',
      regulation: 'ТР ТС 020/2011',
      price: 'от 12 000 ₽',
      duration: '3-5 дней',
      description: 'Декларация на электромагнитную совместимость',
    });
    return result;
  }

  // Проверка на пищевую продукцию
  if (FOOD.keywords.some(kw => normalizedName.includes(kw)) ||
      FOOD.codes.some(c => normalizedCode.startsWith(c))) {
    result.category = FOOD.category;
    result.documents.push({
      type: 'declaration',
      name: 'Декларация ТР ТС 021/2011',
      regulation: 'ТР ТС 021/2011',
      price: 'от 15 000 ₽',
      duration: '5-7 дней',
      description: 'Декларация на пищевую продукцию',
    });
    result.notes.push('Требуется внедрение принципов ХАССП на производстве');
    return result;
  }

  // Если не нашли категорию - возможно отказное письмо
  result.category = 'Требуется уточнение';
  result.needsExpertReview = true;
  result.documents.push({
    type: 'rejection',
    name: 'Возможно: Отказное письмо',
    price: 'от 5 000 ₽',
    duration: '1-3 дня',
    description: 'Письмо об отсутствии необходимости сертификации',
  });
  result.notes.push('Для точного определения требований необходима консультация эксперта');

  return result;
}

// Получить тип документа на русском
export function getDocumentTypeName(type: DocumentType): string {
  const names: Record<DocumentType, string> = {
    certificate: 'Сертификат',
    declaration: 'Декларация',
    sgr: 'СГР',
    rejection: 'Отказное письмо',
    registration: 'Регистрация',
  };
  return names[type];
}

// Цвета для типов документов
export function getDocumentTypeColor(type: DocumentType): string {
  const colors: Record<DocumentType, string> = {
    certificate: 'green',
    declaration: 'blue',
    sgr: 'purple',
    rejection: 'gray',
    registration: 'orange',
  };
  return colors[type];
}
