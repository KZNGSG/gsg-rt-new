'use client';

// Геометрический паттерн "Техническая элегантность"
export function BackgroundPattern() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Геометрическая сетка */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.03]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="grid-pattern"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            {/* Основная сетка */}
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="#2563eb"
              strokeWidth="1"
            />
            {/* Диагональные линии */}
            <path
              d="M 0 0 L 60 60 M 60 0 L 0 60"
              fill="none"
              stroke="#2563eb"
              strokeWidth="0.5"
              opacity="0.5"
            />
            {/* Точки на пересечениях */}
            <circle cx="0" cy="0" r="1.5" fill="#2563eb" />
            <circle cx="60" cy="0" r="1.5" fill="#2563eb" />
            <circle cx="0" cy="60" r="1.5" fill="#2563eb" />
            <circle cx="60" cy="60" r="1.5" fill="#2563eb" />
            <circle cx="30" cy="30" r="1" fill="#2563eb" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>

      {/* Градиентный блоб слева сверху */}
      <div
        className="absolute -left-32 -top-32 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #3b82f6 0%, #1d4ed8 50%, transparent 70%)',
        }}
      />

      {/* Градиентный блоб справа снизу */}
      <div
        className="absolute -right-32 top-1/3 w-80 h-80 rounded-full opacity-15 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #60a5fa 0%, #2563eb 50%, transparent 70%)',
        }}
      />

      {/* Маленький акцент слева */}
      <div
        className="absolute left-10 top-1/2 w-40 h-40 rounded-full opacity-10 blur-2xl"
        style={{
          background: 'radial-gradient(circle, #93c5fd 0%, transparent 70%)',
        }}
      />

      {/* Градиент снизу */}
      <div
        className="absolute -bottom-20 left-1/4 w-[600px] h-[400px] rounded-full opacity-10 blur-3xl"
        style={{
          background: 'radial-gradient(ellipse, #3b82f6 0%, transparent 60%)',
        }}
      />
    </div>
  );
}

// Декоративные плавающие элементы
export function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-5">
      {/* Документ иконка слева */}
      <div className="absolute left-[5%] top-[20%] opacity-5 transform -rotate-12">
        <svg width="120" height="150" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="0.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      </div>

      {/* Сертификат справа */}
      <div className="absolute right-[8%] top-[40%] opacity-5 transform rotate-6">
        <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="0.5">
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      </div>

      {/* Галочка внизу слева */}
      <div className="absolute left-[10%] bottom-[20%] opacity-5 transform -rotate-6">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="0.5">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>

      {/* Щит справа снизу */}
      <div className="absolute right-[5%] bottom-[30%] opacity-5 transform rotate-12">
        <svg width="90" height="110" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="0.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      </div>
    </div>
  );
}
