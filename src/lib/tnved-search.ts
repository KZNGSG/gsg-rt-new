// Поиск по полной базе ТН ВЭД (16 376 кодов)
import tnvedData from '@/data/tnved.json';

export interface TNVEDCode {
  code: string;
  code_formatted: string;
  name: string;
  marking_status: string;
  requires_marking: boolean;
  is_experimental: boolean;
}

const tnvedDatabase: TNVEDCode[] = tnvedData as TNVEDCode[];

// Быстрый поиск по базе
export function searchTNVEDFull(query: string, limit: number = 8): TNVEDCode[] {
  if (!query || query.trim().length < 2) return [];

  const normalizedQuery = query.toLowerCase().trim();
  const results: TNVEDCode[] = [];

  // Сначала ищем точное совпадение по коду
  for (const item of tnvedDatabase) {
    if (results.length >= limit) break;

    const codeMatch = item.code.toLowerCase().startsWith(normalizedQuery) ||
                      item.code_formatted.toLowerCase().replace(/\s/g, '').startsWith(normalizedQuery.replace(/\s/g, ''));

    if (codeMatch) {
      results.push(item);
    }
  }

  // Затем ищем по названию
  if (results.length < limit) {
    for (const item of tnvedDatabase) {
      if (results.length >= limit) break;

      // Пропускаем уже найденные
      if (results.some(r => r.code === item.code)) continue;

      if (item.name.toLowerCase().includes(normalizedQuery)) {
        results.push(item);
      }
    }
  }

  return results;
}

// Получить информацию по коду
export function getTNVEDByCode(code: string): TNVEDCode | undefined {
  const normalizedCode = code.replace(/\s/g, '');
  return tnvedDatabase.find(item =>
    item.code === normalizedCode ||
    item.code_formatted.replace(/\s/g, '') === normalizedCode
  );
}

// Получить общее количество кодов
export function getTNVEDCount(): number {
  return tnvedDatabase.length;
}
