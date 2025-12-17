'use client';

import { useState, useEffect, useMemo } from 'react';
import seoData from '@/data/seo-pages.json';

// Простой пароль для SEO специалиста (в продакшене используйте env переменные)
const SEO_PASSWORD = 'gsg2025seo';

interface Page {
  oldUrl: string;
  newUrl: string;
  category: string;
  title: string;
  description: string;
  h1: string;
  status: 'pending' | 'in_progress' | 'done';
  priority: 'high' | 'medium' | 'low';
}

interface City {
  slug: string;
  name: string;
  prepositional: string;
  isMain?: boolean;
}

interface Redirect {
  from: string;
  to: string;
  type: number;
}

type TabType = 'pages' | 'redirects' | 'cities' | 'import' | 'analytics';

// Компонент авторизации
function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SEO_PASSWORD) {
      localStorage.setItem('seo_auth', 'true');
      onLogin();
    } else {
      setError('Неверный пароль');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">SEO Панель</h1>
          <p className="text-slate-500 mt-2">ГОСТСЕРТГРУПП</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Пароль доступа
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Введите пароль"
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Войти
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Для получения доступа обратитесь к администратору
        </p>
      </div>
    </div>
  );
}

export default function SEOAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('pages');
  const [pages, setPages] = useState<Page[]>(seoData.pages as Page[]);
  const [cities] = useState<City[]>(seoData.cities as City[]);
  const [redirects, setRedirects] = useState<Redirect[]>(seoData.redirects as Redirect[]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Import state
  const [importText, setImportText] = useState('');
  const [importedUrls, setImportedUrls] = useState<string[]>([]);

  // Stats - MUST be before any conditional returns (React hooks rules)
  const stats = useMemo(() => {
    const total = pages.length;
    const done = pages.filter(p => p.status === 'done').length;
    const inProgress = pages.filter(p => p.status === 'in_progress').length;
    const pending = pages.filter(p => p.status === 'pending').length;
    const highPriority = pages.filter(p => p.priority === 'high' && p.status !== 'done').length;
    return { total, done, inProgress, pending, highPriority, progress: Math.round((done / total) * 100) };
  }, [pages]);

  // Filtered pages - MUST be before any conditional returns
  const filteredPages = useMemo(() => {
    return pages.filter(page => {
      const matchesSearch = page.oldUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           page.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || page.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [pages, searchQuery, statusFilter, categoryFilter]);

  // Check auth on mount
  useEffect(() => {
    const auth = localStorage.getItem('seo_auth');
    setIsAuthenticated(auth === 'true');
    setIsLoading(false);
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('seo_auth');
    setIsAuthenticated(false);
  };

  // Show login if not authenticated
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={() => setIsAuthenticated(true)} />;
  }

  // Replace city placeholders
  const replaceCity = (text: string, city?: City) => {
    const c = city || cities.find(c => c.isMain) || cities[0];
    return text
      .replace(/{city}/g, c.name)
      .replace(/{prepositional}/g, c.prepositional);
  };

  // Handle page update
  const updatePage = (index: number, updates: Partial<Page>) => {
    const newPages = [...pages];
    newPages[index] = { ...newPages[index], ...updates };
    setPages(newPages);
  };

  // Handle import
  const handleImport = () => {
    const urls = importText.split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0)
      .map(url => {
        try {
          const parsed = new URL(url);
          return parsed.pathname;
        } catch {
          return url.startsWith('/') ? url : `/${url}`;
        }
      });

    const newPages: Page[] = urls.map(url => ({
      oldUrl: url,
      newUrl: url.replace(/\/$/, '').replace(/-$/, ''),
      category: detectCategory(url),
      title: generateTitle(url),
      description: '',
      h1: generateH1(url),
      status: 'pending' as const,
      priority: detectPriority(url)
    }));

    setPages([...pages, ...newPages.filter(np => !pages.some(p => p.oldUrl === np.oldUrl))]);
    setImportedUrls(urls);
    setImportText('');
  };

  // Auto-detect category from URL
  const detectCategory = (url: string): string => {
    if (url.includes('vidy-sertifikacii')) return 'services';
    if (url.includes('sertifikat-na-tovar')) return 'products';
    if (url.includes('tr-ts')) return 'regulations';
    if (url.includes('o-nas')) return 'about';
    if (url.includes('kontakty')) return 'contacts';
    if (url.includes('ooo-') || url.includes('ip-') || url.includes('zao-')) return 'clients';
    if (url.includes('news') || url.includes('sobytiya')) return 'news';
    return 'services';
  };

  // Auto-detect priority
  const detectPriority = (url: string): 'high' | 'medium' | 'low' => {
    const depth = url.split('/').filter(Boolean).length;
    if (depth <= 1) return 'high';
    if (depth === 2) return 'medium';
    return 'low';
  };

  // Generate title from URL
  const generateTitle = (url: string): string => {
    const parts = url.split('/').filter(Boolean);
    const lastPart = parts[parts.length - 1] || 'Главная';
    return lastPart
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      + ' | ГОСТСЕРТГРУПП';
  };

  // Generate H1 from URL
  const generateH1 = (url: string): string => {
    const parts = url.split('/').filter(Boolean);
    const lastPart = parts[parts.length - 1] || 'Главная';
    return lastPart.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Export to CSV
  const exportCSV = () => {
    const headers = ['Old URL', 'New URL', 'Category', 'Title', 'Description', 'H1', 'Status', 'Priority'];
    const rows = pages.map(p => [p.oldUrl, p.newUrl, p.category, p.title, p.description, p.h1, p.status, p.priority]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seo-pages.csv';
    a.click();
  };

  // Generate Next.js redirects config
  const generateNextConfig = () => {
    const redirectsConfig = pages
      .filter(p => p.oldUrl !== p.newUrl)
      .map(p => ({
        source: p.oldUrl.replace(/\/$/, ''),
        destination: p.newUrl,
        permanent: true
      }));

    const config = `// next.config.js redirects
async redirects() {
  return ${JSON.stringify(redirectsConfig, null, 2)};
}`;

    navigator.clipboard.writeText(config);
    alert('Конфигурация скопирована в буфер обмена!');
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    done: 'bg-green-100 text-green-800'
  };

  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-orange-100 text-orange-800',
    low: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">SEO Панель управления</h1>
              <p className="text-slate-500 text-sm">Управление SEO при переносе сайта gsg-rt.ru</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={exportCSV}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Экспорт CSV
              </button>
              <button
                onClick={generateNextConfig}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Генерировать redirects
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Выйти
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="text-3xl font-bold text-slate-900">{stats.total}</div>
            <div className="text-sm text-slate-500">Всего страниц</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="text-3xl font-bold text-green-600">{stats.done}</div>
            <div className="text-sm text-slate-500">Готово</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="text-3xl font-bold text-blue-600">{stats.inProgress}</div>
            <div className="text-sm text-slate-500">В работе</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-slate-500">Ожидает</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="text-3xl font-bold text-red-600">{stats.highPriority}</div>
            <div className="text-sm text-slate-500">Высокий приоритет</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="text-3xl font-bold text-blue-600">{stats.progress}%</div>
            <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${stats.progress}%` }}></div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-slate-200 mb-6">
          <div className="flex border-b border-slate-200">
            {[
              { id: 'pages', label: 'Страницы', icon: '📄' },
              { id: 'redirects', label: 'Редиректы', icon: '↪️' },
              { id: 'cities', label: 'Города', icon: '🏙️' },
              { id: 'import', label: 'Импорт', icon: '📥' },
              { id: 'analytics', label: 'Аналитика', icon: '📊' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Pages Tab */}
            {activeTab === 'pages' && (
              <div>
                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <input
                    type="text"
                    placeholder="Поиск по URL или title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 min-w-[200px] px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Все статусы</option>
                    <option value="pending">Ожидает</option>
                    <option value="in_progress">В работе</option>
                    <option value="done">Готово</option>
                  </select>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Все категории</option>
                    {seoData.categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                    ))}
                  </select>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Превью: Казань (основной)</option>
                    {cities.filter(c => !c.isMain).map(city => (
                      <option key={city.slug} value={city.slug}>{city.name}</option>
                    ))}
                  </select>
                </div>

                {/* Pages Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Старый URL</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Новый URL</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Title</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Статус</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Приоритет</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Действия</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPages.map((page, index) => {
                        const city = cities.find(c => c.slug === selectedCity) || cities.find(c => c.isMain);
                        return (
                          <tr key={page.oldUrl} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="py-3 px-4">
                              <code className="text-xs bg-slate-100 px-2 py-1 rounded">{page.oldUrl}</code>
                            </td>
                            <td className="py-3 px-4">
                              <code className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{page.newUrl}</code>
                            </td>
                            <td className="py-3 px-4 max-w-xs">
                              <div className="text-sm text-slate-900 truncate" title={replaceCity(page.title, city)}>
                                {replaceCity(page.title, city)}
                              </div>
                              <div className="text-xs text-slate-500 truncate" title={replaceCity(page.description, city)}>
                                {replaceCity(page.description, city)}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <select
                                value={page.status}
                                onChange={(e) => updatePage(index, { status: e.target.value as Page['status'] })}
                                className={`text-xs px-2 py-1 rounded-full ${statusColors[page.status]}`}
                              >
                                <option value="pending">Ожидает</option>
                                <option value="in_progress">В работе</option>
                                <option value="done">Готово</option>
                              </select>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[page.priority]}`}>
                                {page.priority === 'high' ? 'Высокий' : page.priority === 'medium' ? 'Средний' : 'Низкий'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => setEditingPage(page)}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                Редактировать
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-sm text-slate-500">
                  Показано {filteredPages.length} из {pages.length} страниц
                </div>
              </div>
            )}

            {/* Redirects Tab */}
            {activeTab === 'redirects' && (
              <div>
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Редиректы автоматически генерируются из различий между старыми и новыми URL.
                    Нажмите "Генерировать redirects" чтобы получить конфиг для next.config.js
                  </p>
                </div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Откуда (source)</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Куда (destination)</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Тип</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pages.filter(p => p.oldUrl !== p.newUrl).map(page => (
                      <tr key={page.oldUrl} className="border-b border-slate-100">
                        <td className="py-3 px-4">
                          <code className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">{page.oldUrl}</code>
                        </td>
                        <td className="py-3 px-4">
                          <code className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{page.newUrl}</code>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs bg-slate-100 px-2 py-1 rounded">301 Permanent</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Cities Tab */}
            {activeTab === 'cities' && (
              <div>
                <div className="mb-4 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    {cities.length} городов настроено. Переменные {'{city}'} и {'{prepositional}'} автоматически заменяются в title и description.
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {cities.map(city => (
                    <div key={city.slug} className={`p-4 rounded-lg border ${city.isMain ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'}`}>
                      <div className="font-medium text-slate-900">{city.name}</div>
                      <div className="text-sm text-slate-500">{city.prepositional}</div>
                      {city.slug && <code className="text-xs bg-slate-100 px-2 py-1 rounded mt-2 inline-block">{city.slug}.gsg-rt.ru</code>}
                      {city.isMain && <span className="text-xs text-blue-600 ml-2">Основной</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Import Tab */}
            {activeTab === 'import' && (
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Вставьте список URL (по одному на строку)
                  </label>
                  <textarea
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    rows={10}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder="http://gsg-rt.ru/vidy-sertifikacii/&#10;http://gsg-rt.ru/sertifikat-na-tovar/&#10;..."
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleImport}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Импортировать URL
                  </button>
                  <button
                    onClick={() => setImportText('')}
                    className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    Очистить
                  </button>
                </div>
                {importedUrls.length > 0 && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      Импортировано {importedUrls.length} URL. Перейдите во вкладку "Страницы" для редактирования.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="bg-slate-50 rounded-lg p-6">
                    <h3 className="font-medium text-slate-900 mb-4">По категориям</h3>
                    {seoData.categories.map(cat => {
                      const count = pages.filter(p => p.category === cat.id).length;
                      const done = pages.filter(p => p.category === cat.id && p.status === 'done').length;
                      return (
                        <div key={cat.id} className="flex justify-between items-center py-2 border-b border-slate-200">
                          <span className="text-sm">{cat.icon} {cat.name}</span>
                          <span className="text-sm font-medium">{done}/{count}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="bg-slate-50 rounded-lg p-6">
                    <h3 className="font-medium text-slate-900 mb-4">По приоритету</h3>
                    {['high', 'medium', 'low'].map(priority => {
                      const count = pages.filter(p => p.priority === priority).length;
                      const done = pages.filter(p => p.priority === priority && p.status === 'done').length;
                      return (
                        <div key={priority} className="flex justify-between items-center py-2 border-b border-slate-200">
                          <span className={`text-sm px-2 py-1 rounded ${priorityColors[priority as keyof typeof priorityColors]}`}>
                            {priority === 'high' ? 'Высокий' : priority === 'medium' ? 'Средний' : 'Низкий'}
                          </span>
                          <span className="text-sm font-medium">{done}/{count}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="bg-slate-50 rounded-lg p-6">
                    <h3 className="font-medium text-slate-900 mb-4">Требуют внимания</h3>
                    <ul className="text-sm space-y-2">
                      {pages.filter(p => !p.description).length > 0 && (
                        <li className="text-orange-600">
                          {pages.filter(p => !p.description).length} страниц без description
                        </li>
                      )}
                      {pages.filter(p => p.priority === 'high' && p.status === 'pending').length > 0 && (
                        <li className="text-red-600">
                          {pages.filter(p => p.priority === 'high' && p.status === 'pending').length} высокоприоритетных не начаты
                        </li>
                      )}
                      {pages.filter(p => p.title.length > 60).length > 0 && (
                        <li className="text-yellow-600">
                          {pages.filter(p => p.title.length > 60).length} страниц с длинным title
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingPage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">Редактирование SEO</h2>
              <p className="text-sm text-slate-500">{editingPage.oldUrl}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Новый URL</label>
                <input
                  type="text"
                  value={editingPage.newUrl}
                  onChange={(e) => setEditingPage({ ...editingPage, newUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Title <span className="text-slate-400">({editingPage.title.length}/60)</span>
                </label>
                <input
                  type="text"
                  value={editingPage.title}
                  onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    editingPage.title.length > 60 ? 'border-orange-500' : 'border-slate-300'
                  }`}
                />
                <p className="text-xs text-slate-500 mt-1">Используйте {'{city}'} и {'{prepositional}'} для динамической подстановки города</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description <span className="text-slate-400">({editingPage.description.length}/160)</span>
                </label>
                <textarea
                  value={editingPage.description}
                  onChange={(e) => setEditingPage({ ...editingPage, description: e.target.value })}
                  rows={3}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    editingPage.description.length > 160 ? 'border-orange-500' : 'border-slate-300'
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">H1</label>
                <input
                  type="text"
                  value={editingPage.h1}
                  onChange={(e) => setEditingPage({ ...editingPage, h1: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Категория</label>
                  <select
                    value={editingPage.category}
                    onChange={(e) => setEditingPage({ ...editingPage, category: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {seoData.categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Приоритет</label>
                  <select
                    value={editingPage.priority}
                    onChange={(e) => setEditingPage({ ...editingPage, priority: e.target.value as Page['priority'] })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="high">Высокий</option>
                    <option value="medium">Средний</option>
                    <option value="low">Низкий</option>
                  </select>
                </div>
              </div>

              {/* Preview */}
              <div className="mt-6 p-4 bg-slate-50 rounded-lg">
                <h4 className="text-sm font-medium text-slate-700 mb-3">Превью в Google</h4>
                <div className="bg-white p-4 rounded border border-slate-200">
                  <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                    {replaceCity(editingPage.title, cities.find(c => c.slug === selectedCity))}
                  </div>
                  <div className="text-green-700 text-sm">
                    https://gsg-rt.ru{editingPage.newUrl}
                  </div>
                  <div className="text-slate-600 text-sm mt-1">
                    {replaceCity(editingPage.description, cities.find(c => c.slug === selectedCity)) || 'Добавьте description...'}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 flex justify-end gap-4">
              <button
                onClick={() => setEditingPage(null)}
                className="px-6 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={() => {
                  const index = pages.findIndex(p => p.oldUrl === editingPage.oldUrl);
                  if (index !== -1) {
                    updatePage(index, editingPage);
                  }
                  setEditingPage(null);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
