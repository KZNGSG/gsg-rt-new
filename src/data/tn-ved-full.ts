// Полная база ТН ВЭД - 16,376 кодов
// Импортируем JSON данные

import tnvedData from './tnved.json';
import tnvedMarkingData from './tnved_marking.json';

export interface TNVEDCode {
  code: string;
  code_formatted: string;
  name: string;
  marking_status: 'not_required' | 'required' | 'experimental';
  requires_marking: boolean;
  is_experimental: boolean;
}

export interface MarkingInfo {
  group: string;
  subcategory: string;
  product: string;
  original_code: string;
}

// Типизация данных
export const TNVED_DATABASE: TNVEDCode[] = tnvedData as TNVEDCode[];
export const TNVED_MARKING: Record<string, MarkingInfo[]> = tnvedMarkingData as Record<string, MarkingInfo[]>;

// Кэш для быстрого поиска по коду
const codeIndex = new Map<string, TNVEDCode>();
TNVED_DATABASE.forEach(item => {
  codeIndex.set(item.code, item);
  // Также добавим без пробелов
  const cleanCode = item.code.replace(/\s/g, '');
  if (cleanCode !== item.code) {
    codeIndex.set(cleanCode, item);
  }
});

// Функция поиска по коду (точное совпадение или начало)
export function searchByCode(query: string): TNVEDCode[] {
  const cleanQuery = query.replace(/\s/g, '').toLowerCase();

  // Точное совпадение
  const exact = codeIndex.get(cleanQuery);
  if (exact) {
    return [exact];
  }

  // Поиск по началу кода
  return TNVED_DATABASE.filter(item =>
    item.code.toLowerCase().startsWith(cleanQuery) ||
    item.code.replace(/\s/g, '').toLowerCase().startsWith(cleanQuery)
  ).slice(0, 50);
}

// Функция поиска по названию
export function searchByName(query: string): TNVEDCode[] {
  const normalizedQuery = query.toLowerCase().trim();
  const words = normalizedQuery.split(/\s+/).filter(w => w.length >= 2);

  if (words.length === 0) return [];

  // Сначала ищем точные совпадения
  const exactMatches = TNVED_DATABASE.filter(item =>
    item.name.toLowerCase().includes(normalizedQuery)
  );

  if (exactMatches.length > 0) {
    return exactMatches.slice(0, 50);
  }

  // Потом ищем по отдельным словам
  return TNVED_DATABASE.filter(item => {
    const nameLower = item.name.toLowerCase();
    return words.every(word => nameLower.includes(word));
  }).slice(0, 50);
}

// Универсальная функция поиска
export function searchTNVED(query: string): TNVEDCode[] {
  const trimmed = query.trim();

  if (!trimmed || trimmed.length < 2) return [];

  // Определяем тип запроса
  const isCodeQuery = /^\d/.test(trimmed);

  if (isCodeQuery) {
    return searchByCode(trimmed);
  }

  return searchByName(trimmed);
}

// Получить информацию о маркировке
export function getMarkingInfo(code: string): MarkingInfo[] | null {
  const cleanCode = code.replace(/\s/g, '');

  // Ищем точное совпадение
  if (TNVED_MARKING[cleanCode]) {
    return TNVED_MARKING[cleanCode];
  }

  // Ищем по сокращённому коду (без последних цифр)
  for (let i = cleanCode.length; i >= 4; i--) {
    const shortCode = cleanCode.substring(0, i);
    if (TNVED_MARKING[shortCode]) {
      return TNVED_MARKING[shortCode];
    }
  }

  return null;
}

// Получить код по точному значению
export function getByCode(code: string): TNVEDCode | null {
  return codeIndex.get(code.replace(/\s/g, '')) || null;
}

// Статистика базы
export function getStats() {
  const total = TNVED_DATABASE.length;
  const withMarking = TNVED_DATABASE.filter(i => i.requires_marking).length;
  const experimental = TNVED_DATABASE.filter(i => i.is_experimental).length;

  return {
    total,
    withMarking,
    experimental,
    withoutMarking: total - withMarking - experimental
  };
}

// Группировка по первым 2 цифрам (группы)
export function getGroups(): { code: string; name: string; count: number }[] {
  const groups = new Map<string, { name: string; count: number }>();

  TNVED_DATABASE.forEach(item => {
    const groupCode = item.code.substring(0, 2);
    if (!groups.has(groupCode)) {
      // Найдём название группы
      const groupItem = TNVED_DATABASE.find(i => i.code === groupCode);
      groups.set(groupCode, {
        name: groupItem?.name || `Группа ${groupCode}`,
        count: 0
      });
    }
    groups.get(groupCode)!.count++;
  });

  return Array.from(groups.entries())
    .map(([code, data]) => ({ code, ...data }))
    .sort((a, b) => a.code.localeCompare(b.code));
}
