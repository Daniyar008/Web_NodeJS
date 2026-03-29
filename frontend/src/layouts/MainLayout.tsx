import { Link, Outlet } from 'react-router-dom'

export function MainLayout() {
    return (
        <div className="min-h-screen">
            <header className="sticky top-0 z-20 border-b border-[color:var(--line)] bg-[#f6f7f3]/90 backdrop-blur">
                <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
                    <Link to="/" className="heading-font text-xl font-bold tracking-tight text-[color:var(--ink-900)]">
                        EduFuture
                    </Link>
                    <nav className="flex items-center gap-2 sm:gap-3">
                        <Link to="/" className="rounded-full px-4 py-2 text-sm font-semibold text-[color:var(--ink-700)] hover:bg-white">
                            Главная
                        </Link>
                        <Link
                            to="/login"
                            className="rounded-full bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--brand-deep)]"
                        >
                            Войти
                        </Link>
                    </nav>
                </div>
            </header>
            <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
                <Outlet />
            </main>
        </div>
    )
}
