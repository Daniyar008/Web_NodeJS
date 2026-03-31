import { Link } from 'react-router-dom'

const features = [
    {
        icon: '🎭',
        title: 'Роли и доступы',
        text: 'Учреждение, учитель, ученик и родитель получают свой персонализированный сценарий работы.',
        accent: 'var(--brand-light)',
        glow: 'rgba(99,102,241,0.2)',
    },
    {
        icon: '🏆',
        title: 'Геймификация',
        text: 'XP, уровни, достижения и турниры — превращаем обучение в увлекательное приключение.',
        accent: 'var(--accent)',
        glow: 'rgba(245,158,11,0.2)',
    },
    {
        icon: '📚',
        title: 'Курсы и задания',
        text: 'Конструктор курса, kanban-планировщик и отслеживание прогресса в реальном времени.',
        accent: 'var(--accent-teal)',
        glow: 'rgba(20,184,166,0.2)',
    },
    {
        icon: '📊',
        title: 'Аналитика',
        text: 'Детальный прогресс по предметам, умные отчёты для родителей и учреждений.',
        accent: '#a855f7',
        glow: 'rgba(168,85,247,0.2)',
    },
]

const stats = [
    { value: '4', label: 'Типа пользователей', color: 'var(--brand-light)' },
    { value: '11+', label: 'Спринтов завершено', color: 'var(--accent-teal)' },
    { value: '∞', label: 'Возможностей', color: 'var(--accent)' },
]

export function LandingPage() {
    return (
        <div className="space-y-20">
            {/* ── Hero ──────────────────────────────────────────────── */}
            <section className="relative overflow-hidden rounded-3xl py-20 px-8 sm:px-16 text-center">
                <div className="hero-bg-particles" />

                {/* Subtle grid overlay */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px',
                        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent)',
                    }}
                />

                <div className="relative z-10 max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="reveal flex justify-center mb-6">
                        <span
                            className="badge badge-brand inline-flex items-center gap-2"
                        >
                            <span className="glow-dot" />
                            MVP — Активная разработка
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="heading-font reveal reveal-delay-1 text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.05]">
                        Образование нового{' '}
                        <span className="gradient-text">поколения</span>
                    </h1>

                    <p
                        className="reveal reveal-delay-2 mt-6 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
                        style={{ color: 'var(--ink-300)' }}
                    >
                        Платформа с геймификацией, умным управлением и ролевыми кабинетами
                        для каждого участника образовательного процесса.
                    </p>

                    {/* CTA buttons */}
                    <div className="reveal reveal-delay-3 mt-10 flex flex-wrap items-center justify-center gap-4">
                        <Link to="/login" className="btn-primary text-base px-8 py-3.5">
                            Начать обучение →
                        </Link>
                        <a
                            href="/1-technical-requirements.md"
                            className="btn-ghost text-base px-8 py-3.5"
                        >
                            Открыть ТЗ
                        </a>
                    </div>

                    {/* Stats row */}
                    <div className="reveal reveal-delay-4 mt-16 flex flex-wrap justify-center gap-8 sm:gap-16">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <p
                                    className="heading-font text-3xl sm:text-4xl font-bold"
                                    style={{ color: stat.color }}
                                >
                                    {stat.value}
                                </p>
                                <p className="mt-1 text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--ink-500)' }}>
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Feature Cards ────────────────────────────────────── */}
            <section>
                <div className="mb-10 text-center">
                    <span className="badge badge-brand mb-4">Возможности</span>
                    <h2
                        className="heading-font text-3xl sm:text-4xl font-bold"
                        style={{ color: 'var(--ink-100)' }}
                    >
                        Всё необходимое в одном месте
                    </h2>
                    <p className="mt-3 text-base max-w-xl mx-auto" style={{ color: 'var(--ink-300)' }}>
                        Каждый участник процесса получает инструменты именно для своих задач
                    </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, i) => (
                        <article
                            key={feature.title}
                            className={`reveal reveal-delay-${i + 1} glass card-interactive rounded-2xl p-6`}
                        >
                            {/* Icon */}
                            <div
                                className="flex items-center justify-center w-12 h-12 rounded-xl text-2xl mb-4"
                                style={{
                                    background: feature.glow,
                                    border: `1px solid ${feature.glow.replace('0.2', '0.4')}`,
                                }}
                            >
                                {feature.icon}
                            </div>

                            {/* Title */}
                            <h3
                                className="heading-font text-lg font-bold mb-2"
                                style={{ color: feature.accent }}
                            >
                                {feature.title}
                            </h3>

                            {/* Text */}
                            <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-300)' }}>
                                {feature.text}
                            </p>
                        </article>
                    ))}
                </div>
            </section>

            {/* ── Tech Stack Banner ────────────────────────────────── */}
            <section
                className="glass rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                style={{ borderColor: 'var(--line-bright)' }}
            >
                <div className="flex-1">
                    <span className="badge badge-brand mb-3">Технологии</span>
                    <h2 className="heading-font text-2xl sm:text-3xl font-bold" style={{ color: 'var(--ink-100)' }}>
                        Современный стек разработки
                    </h2>
                    <p className="mt-2 text-sm" style={{ color: 'var(--ink-300)' }}>
                        Node.js · Express · Prisma · PostgreSQL · React · Vite · TypeScript · Socket.IO
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {['Node.js', 'React', 'Prisma', 'TypeScript', 'Socket.IO'].map((tech) => (
                        <span
                            key={tech}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                            style={{
                                background: 'rgba(255,255,255,0.06)',
                                border: '1px solid var(--line-bright)',
                                color: 'var(--ink-100)',
                            }}
                        >
                            {tech}
                        </span>
                    ))}
                </div>
            </section>

            {/* ── CTA bottom ───────────────────────────────────────── */}
            <section className="text-center pb-4">
                <h2 className="heading-font text-3xl sm:text-4xl font-bold mb-4">
                    Готов начать?{' '}
                    <span className="gradient-text-warm">Присоединяйся</span>
                </h2>
                <p className="mb-8 text-base" style={{ color: 'var(--ink-300)' }}>
                    Зарегистрируйся сейчас и получи доступ к платформе нового поколения
                </p>
                <Link to="/login" className="btn-primary text-base px-10 py-4">
                    Создать аккаунт →
                </Link>
            </section>
        </div>
    )
}
