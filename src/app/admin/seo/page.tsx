'use client';

import { useState, useEffect, useMemo } from 'react';
import seoData from '@/data/seo-pages.json';

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

type TabType = 'pages' | 'redirects' | 'cities' | 'analytics';

// Иконки SVG
const Icons = {
  lock: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  logout: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  search: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  edit: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  check: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  x: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  download: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  copy: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  pages: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  redirect: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  ),
  city: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  chart: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  expand: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  ),
};

// Категории без эмодзи
const categoryNames: Record<string, string> = {
  main: 'Главная',
  services: 'Виды сертификации',
  products: 'Сертификат на товар',
  regulations: 'ТР ТС',
  about: 'О компании',
  contacts: 'Контакты',
  clients: 'Клиенты',
  news: 'Новости',
  other: 'Прочее',
};

// Форма входа
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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3 text-white">
            {Icons.lock}
          </div>
          <h1 className="text-xl font-semibold text-slate-900">SEO Panel</h1>
          <p className="text-slate-500 text-sm mt-1">ГОСТСЕРТГРУПП</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-3"
            placeholder="Пароль"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Войти
          </button>
        </form>
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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<{ url: string; field: string } | null>(null);

  // Stats
  const stats = useMemo(() => {
    const total = pages.length;
    const done = pages.filter(p => p.status === 'done').length;
    const inProgress = pages.filter(p => p.status === 'in_progress').length;
    const pending = pages.filter(p => p.status === 'pending').length;
    const highPriority = pages.filter(p => p.priority === 'high' && p.status !== 'done').length;
    const noDesc = pages.filter(p => !p.description).length;
    return { total, done, inProgress, pending, highPriority, noDesc, progress: Math.round((done / total) * 100) };
  }, [pages]);

  // Filtered pages
  const filteredPages = useMemo(() => {
    return pages.filter(page => {
      const matchesSearch = page.oldUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           page.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || page.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [pages, searchQuery, statusFilter, categoryFilter]);

  // Check auth
  useEffect(() => {
    const auth = localStorage.getItem('seo_auth');
    setIsAuthenticated(auth === 'true');
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('seo_auth');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={() => setIsAuthenticated(true)} />;
  }

  // Replace city placeholders
  const replaceCity = (text: string, city?: City) => {
    const c = city || cities.find(c => c.isMain) || cities[0];
    return text.replace(/{city}/g, c.name).replace(/{prepositional}/g, c.prepositional);
  };

  // Update page
  const updatePage = (oldUrl: string, updates: Partial<Page>) => {
    setPages(pages.map(p => p.oldUrl === oldUrl ? { ...p, ...updates } : p));
  };

  // Export CSV
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

  // Generate redirects config
  const generateNextConfig = () => {
    const redirectsConfig = pages
      .filter(p => p.oldUrl !== p.newUrl)
      .map(p => ({ source: p.oldUrl.replace(/\/$/, '') || '/', destination: p.newUrl || '/', permanent: true }));
    const config = `async redirects() {\n  return ${JSON.stringify(redirectsConfig, null, 2)};\n}`;
    navigator.clipboard.writeText(config);
    alert('Скопировано в буфер обмена');
  };

  const city = cities.find(c => c.slug === selectedCity) || cities.find(c => c.isMain);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header - Full Width */}
      <header className="bg-slate-900 text-white sticky top-0 z-50">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-lg font-semibold">SEO Panel</h1>
            <span className="text-slate-400 text-sm">gsg-rt.ru</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-400">Прогресс:</span>
              <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 transition-all" style={{ width: `${stats.progress}%` }} />
              </div>
              <span className="text-green-400 font-medium">{stats.progress}%</span>
            </div>
            <button onClick={handleLogout} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
              {Icons.logout}
            </button>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-white border-b px-6 py-3">
        <div className="flex items-center gap-8 text-sm">
          <div>
            <span className="text-slate-500">Всего:</span>
            <span className="ml-2 font-semibold text-slate-900">{stats.total}</span>
          </div>
          <div>
            <span className="text-slate-500">Готово:</span>
            <span className="ml-2 font-semibold text-green-600">{stats.done}</span>
          </div>
          <div>
            <span className="text-slate-500">В работе:</span>
            <span className="ml-2 font-semibold text-blue-600">{stats.inProgress}</span>
          </div>
          <div>
            <span className="text-slate-500">Ожидает:</span>
            <span className="ml-2 font-semibold text-amber-600">{stats.pending}</span>
          </div>
          <div>
            <span className="text-slate-500">Без description:</span>
            <span className="ml-2 font-semibold text-red-600">{stats.noDesc}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={exportCSV} className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded flex items-center gap-2 transition-colors">
              {Icons.download}
              <span>CSV</span>
            </button>
            <button onClick={generateNextConfig} className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded flex items-center gap-2 transition-colors">
              {Icons.copy}
              <span>Redirects</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b px-6">
        <div className="flex gap-1">
          {[
            { id: 'pages', label: 'Страницы', icon: Icons.pages, count: stats.total },
            { id: 'redirects', label: 'Редиректы', icon: Icons.redirect, count: pages.filter(p => p.oldUrl !== p.newUrl).length },
            { id: 'cities', label: 'Города', icon: Icons.city, count: cities.length },
            { id: 'analytics', label: 'Аналитика', icon: Icons.chart },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-4 py-3 flex items-center gap-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-blue-600'
                  : 'text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.5 text-xs rounded ${activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'pages' && (
          <div className="bg-white rounded-lg shadow-sm border">
            {/* Filters */}
            <div className="p-4 border-b flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[250px]">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{Icons.search}</span>
                <input
                  type="text"
                  placeholder="Поиск по URL или title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Все статусы</option>
                <option value="pending">Ожидает</option>
                <option value="in_progress">В работе</option>
                <option value="done">Готово</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Все категории</option>
                {Object.entries(categoryNames).map(([id, name]) => (
                  <option key={id} value={id}>{name}</option>
                ))}
              </select>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Город: Казань</option>
                {cities.filter(c => !c.isMain).map(c => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium text-slate-600 w-8"></th>
                    <th className="px-4 py-3 font-medium text-slate-600">URL</th>
                    <th className="px-4 py-3 font-medium text-slate-600">Title / Description</th>
                    <th className="px-4 py-3 font-medium text-slate-600 w-28">Категория</th>
                    <th className="px-4 py-3 font-medium text-slate-600 w-28">Статус</th>
                    <th className="px-4 py-3 font-medium text-slate-600 w-24">Приоритет</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPages.map((page) => {
                    const isExpanded = expandedRow === page.oldUrl;
                    return (
                      <>
                        <tr
                          key={page.oldUrl}
                          className={`border-t border-slate-100 hover:bg-slate-50 cursor-pointer ${isExpanded ? 'bg-blue-50' : ''}`}
                          onClick={() => setExpandedRow(isExpanded ? null : page.oldUrl)}
                        >
                          <td className="px-4 py-3">
                            <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''} inline-block`}>
                              {Icons.expand}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="font-mono text-xs text-slate-600">{page.oldUrl}</div>
                            {page.oldUrl !== page.newUrl && (
                              <div className="font-mono text-xs text-blue-600 mt-0.5">→ {page.newUrl}</div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-slate-900 truncate max-w-md" title={replaceCity(page.title, city)}>
                              {replaceCity(page.title, city) || <span className="text-slate-400 italic">Нет title</span>}
                            </div>
                            <div className="text-slate-500 text-xs truncate max-w-md mt-0.5" title={replaceCity(page.description, city)}>
                              {replaceCity(page.description, city) || <span className="text-red-400 italic">Нет description</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs text-slate-600">{categoryNames[page.category] || page.category}</span>
                          </td>
                          <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={page.status}
                              onChange={(e) => updatePage(page.oldUrl, { status: e.target.value as Page['status'] })}
                              className={`text-xs px-2 py-1 rounded border-0 cursor-pointer ${
                                page.status === 'done' ? 'bg-green-100 text-green-700' :
                                page.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                'bg-amber-100 text-amber-700'
                              }`}
                            >
                              <option value="pending">Ожидает</option>
                              <option value="in_progress">В работе</option>
                              <option value="done">Готово</option>
                            </select>
                          </td>
                          <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={page.priority}
                              onChange={(e) => updatePage(page.oldUrl, { priority: e.target.value as Page['priority'] })}
                              className={`text-xs px-2 py-1 rounded border-0 cursor-pointer ${
                                page.priority === 'high' ? 'bg-red-100 text-red-700' :
                                page.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                                'bg-slate-100 text-slate-600'
                              }`}
                            >
                              <option value="high">Высокий</option>
                              <option value="medium">Средний</option>
                              <option value="low">Низкий</option>
                            </select>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr key={`${page.oldUrl}-edit`} className="bg-slate-50">
                            <td colSpan={6} className="px-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-medium text-slate-500 mb-1">
                                    Title <span className="text-slate-400">({page.title.length}/60)</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={page.title}
                                    onChange={(e) => updatePage(page.oldUrl, { title: e.target.value })}
                                    className={`w-full px-3 py-2 border rounded text-sm ${page.title.length > 60 ? 'border-orange-300 bg-orange-50' : 'border-slate-200'}`}
                                    placeholder="Title страницы"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-slate-500 mb-1">H1</label>
                                  <input
                                    type="text"
                                    value={page.h1}
                                    onChange={(e) => updatePage(page.oldUrl, { h1: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded text-sm"
                                    placeholder="H1 заголовок"
                                  />
                                </div>
                                <div className="col-span-2">
                                  <label className="block text-xs font-medium text-slate-500 mb-1">
                                    Description <span className="text-slate-400">({page.description.length}/160)</span>
                                  </label>
                                  <textarea
                                    value={page.description}
                                    onChange={(e) => updatePage(page.oldUrl, { description: e.target.value })}
                                    rows={2}
                                    className={`w-full px-3 py-2 border rounded text-sm resize-none ${page.description.length > 160 ? 'border-orange-300 bg-orange-50' : 'border-slate-200'}`}
                                    placeholder="Meta description"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-slate-500 mb-1">Новый URL</label>
                                  <input
                                    type="text"
                                    value={page.newUrl}
                                    onChange={(e) => updatePage(page.oldUrl, { newUrl: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded text-sm font-mono"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-slate-500 mb-1">Категория</label>
                                  <select
                                    value={page.category}
                                    onChange={(e) => updatePage(page.oldUrl, { category: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded text-sm"
                                  >
                                    {Object.entries(categoryNames).map(([id, name]) => (
                                      <option key={id} value={id}>{name}</option>
                                    ))}
                                  </select>
                                </div>
                                {/* Google Preview */}
                                <div className="col-span-2 mt-2 p-4 bg-white rounded border">
                                  <div className="text-xs text-slate-500 mb-2">Превью в Google:</div>
                                  <div className="text-blue-700 text-lg hover:underline cursor-pointer">
                                    {replaceCity(page.title, city) || 'Title не задан'}
                                  </div>
                                  <div className="text-green-700 text-sm">gsg-rt.ru{page.newUrl}</div>
                                  <div className="text-slate-600 text-sm mt-1 line-clamp-2">
                                    {replaceCity(page.description, city) || 'Description не задан'}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t text-sm text-slate-500">
              Показано {filteredPages.length} из {pages.length}
            </div>
          </div>
        )}

        {activeTab === 'redirects' && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-4 border-b">
              <p className="text-sm text-slate-600">
                Всего редиректов: <span className="font-semibold">{pages.filter(p => p.oldUrl !== p.newUrl).length}</span>
                <span className="text-slate-400 ml-4">Нажмите "Redirects" в шапке для копирования конфига Next.js</span>
              </p>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-600">Source (старый URL)</th>
                  <th className="px-4 py-3 font-medium text-slate-600">Destination (новый URL)</th>
                  <th className="px-4 py-3 font-medium text-slate-600 w-24">Тип</th>
                </tr>
              </thead>
              <tbody>
                {pages.filter(p => p.oldUrl !== p.newUrl).map(page => (
                  <tr key={page.oldUrl} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-mono text-xs text-red-600">{page.oldUrl}</td>
                    <td className="px-4 py-3 font-mono text-xs text-green-600">{page.newUrl}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">301</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'cities' && (
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <p className="text-sm text-slate-600 mb-4">
              Переменные <code className="bg-slate-100 px-1 rounded">{'{city}'}</code> и <code className="bg-slate-100 px-1 rounded">{'{prepositional}'}</code> заменяются в title и description
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {cities.map(c => (
                <div key={c.slug} className={`p-3 rounded border text-sm ${c.isMain ? 'border-blue-300 bg-blue-50' : 'border-slate-200'}`}>
                  <div className="font-medium text-slate-900">{c.name}</div>
                  <div className="text-slate-500 text-xs">{c.prepositional}</div>
                  {c.isMain && <div className="text-blue-600 text-xs mt-1">Основной</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-medium text-slate-900 mb-3">По категориям</h3>
              <div className="space-y-2">
                {Object.entries(categoryNames).map(([id, name]) => {
                  const count = pages.filter(p => p.category === id).length;
                  const done = pages.filter(p => p.category === id && p.status === 'done').length;
                  if (count === 0) return null;
                  return (
                    <div key={id} className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">{name}</span>
                      <span className="font-medium">
                        <span className="text-green-600">{done}</span>
                        <span className="text-slate-400">/{count}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-medium text-slate-900 mb-3">По статусу</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-green-600">Готово</span>
                  <span className="font-medium">{stats.done}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-blue-600">В работе</span>
                  <span className="font-medium">{stats.inProgress}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-amber-600">Ожидает</span>
                  <span className="font-medium">{stats.pending}</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-medium text-slate-900 mb-3">Требуют внимания</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-red-600">Без description</span>
                  <span className="font-medium">{stats.noDesc}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-amber-600">Высокий приоритет</span>
                  <span className="font-medium">{stats.highPriority}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-orange-600">Длинный title (&gt;60)</span>
                  <span className="font-medium">{pages.filter(p => p.title.length > 60).length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
