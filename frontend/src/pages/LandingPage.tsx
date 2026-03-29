import { Link } from 'react-router-dom'

const features = [
    {
        title: 'Роли и доступы',
        text: 'Учреждение, учитель, ученик и родитель получают свой сценарий работы.',
    },
    {
        title: 'Геймификация',
        text: 'XP, уровни, достижения и турниры для повышения мотивации.',
    },
    {
        title: 'Курсы и задания',
        text: 'Конструктор курса, прогресс обучения и kanban-планирование задач.',
    },
    {
        title: 'Аналитика',
        text: 'Прогресс по предметам, отчеты для родителей и учреждения.',
    },
]

export function LandingPage() {
    return (
        <section className="space-y-8 sm:space-y-10">
            <div className="reveal rounded-3xl border border-[color:var(--line)] bg-white/80 p-6 shadow-sm sm:p-10">
                <p className="mb-3 inline-flex rounded-full border border-[color:var(--line)] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--ink-700)]">
                    MVP старт
                </p>
                <h1 className="heading-font max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">
                    Образовательная платформа с геймификацией и понятным управлением для всех ролей
                </h1>
                <p className="mt-4 max-w-2xl text-sm text-[color:var(--ink-700)] sm:text-base">
                    Мы уже развернули основу проекта: монорепо, backend на Node.js + Express + Prisma и frontend на React + Vite. Следующий шаг -
                    полноценная авторизация и личные кабинеты по ролям.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                        to="/login"
                        className="rounded-full bg-[color:var(--brand)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[color:var(--brand-deep)]"
                    >
                        Перейти к входу
                    </Link>
                    <a
                        href="/1-technical-requirements.md"
                        className="rounded-full border border-[color:var(--line)] bg-white px-5 py-3 text-sm font-bold text-[color:var(--ink-900)] transition hover:bg-[#f3f5f0]"
                    >
                        Открыть ТЗ
                    </a>
                </div>
            </div>

            <div className="card-grid">
                {features.map((feature) => (
                    <article
                        key={feature.title}
                        className="reveal rounded-2xl border border-[color:var(--line)] bg-white/80 p-5 shadow-sm"
                    >
                        <h2 className="heading-font text-lg font-bold">{feature.title}</h2>
                        <p className="mt-2 text-sm text-[color:var(--ink-700)]">{feature.text}</p>
                    </article>
                ))}
            </div>
        </section>
    )
}
