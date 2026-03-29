import { Link } from 'react-router-dom'

export function UnauthorizedPage() {
  return (
    <section className="mx-auto max-w-xl reveal rounded-3xl border border-[color:var(--line)] bg-white/80 p-8 text-center shadow-sm">
      <h1 className="heading-font text-3xl font-bold">Доступ запрещён</h1>
      <p className="mt-3 text-sm text-[color:var(--ink-700)]">У вас нет прав для просмотра этой страницы.</p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-xl bg-[color:var(--brand)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[color:var(--brand-deep)]"
      >
        На главную
      </Link>
    </section>
  )
}
