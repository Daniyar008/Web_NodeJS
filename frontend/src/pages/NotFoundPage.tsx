import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div
        className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mb-6"
        style={{
          background: 'rgba(99,102,241,0.10)',
          border: '1px solid rgba(99,102,241,0.25)',
          boxShadow: '0 0 40px rgba(99,102,241,0.15)',
        }}
      >
        🌌
      </div>
      <h1
        className="heading-font text-8xl font-bold mb-2"
        style={{
          background: 'linear-gradient(135deg, var(--brand-light) 0%, var(--accent-teal) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        404
      </h1>
      <p className="text-xl font-semibold mb-2" style={{ color: 'var(--ink-100)' }}>
        Страница не найдена
      </p>
      <p className="text-sm mb-8 max-w-sm" style={{ color: 'var(--ink-300)' }}>
        Кажется, вы потерялись в космосе. Эта страница не существует или была перемещена.
      </p>
      <Link to="/" className="btn-primary px-8 py-3">
        ← На главную
      </Link>
    </div>
  )
}
