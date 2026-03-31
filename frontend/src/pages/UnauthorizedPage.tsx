import { Link } from 'react-router-dom'

export function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div
        className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mb-6"
        style={{
          background: 'rgba(244,63,94,0.10)',
          border: '1px solid rgba(244,63,94,0.25)',
          boxShadow: '0 0 40px rgba(244,63,94,0.15)',
        }}
      >
        🔒
      </div>
      <h1
        className="heading-font text-6xl font-bold mb-2"
        style={{
          background: 'linear-gradient(135deg, #fb7185 0%, #f43f5e 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        403
      </h1>
      <p className="text-xl font-semibold mb-2" style={{ color: 'var(--ink-100)' }}>
        Доступ запрещён
      </p>
      <p className="text-sm mb-8 max-w-sm" style={{ color: 'var(--ink-300)' }}>
        У вас нет прав для просмотра этой страницы. Попробуйте войти с другим аккаунтом.
      </p>
      <div className="flex gap-3">
        <Link to="/" className="btn-ghost px-6 py-2.5 text-sm">
          ← Главная
        </Link>
        <Link to="/login" className="btn-primary px-6 py-2.5 text-sm">
          Войти
        </Link>
      </div>
    </div>
  )
}
