import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

const roleTitles: Record<string, string> = {
    student: 'Кабинет ученика',
    teacher: 'Кабинет учителя',
    parent: 'Кабинет родителя',
    institution: 'Кабинет учреждения',
}

const modules = [
    { name: 'Курсы', status: 'Готово для следующего этапа', color: 'bg-emerald-100 text-emerald-800' },
    { name: 'Планировщик задач', status: 'Будет после auth-модуля', color: 'bg-amber-100 text-amber-800' },
    { name: 'Турниры', status: 'Запланировано в следующих спринтах', color: 'bg-sky-100 text-sky-800' },
    { name: 'Уведомления', status: 'Запланировано', color: 'bg-rose-100 text-rose-800' },
]

export function DashboardPage() {
    const { role } = useParams()

    const title = useMemo(() => roleTitles[role ?? ''] ?? 'Личный кабинет', [role])

    return (
        <section className="space-y-6">
            <div className="reveal rounded-3xl border border-[color:var(--line)] bg-white/85 p-6 shadow-sm sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-700)]">MVP Dashboard</p>
                <h1 className="heading-font mt-2 text-3xl font-bold sm:text-4xl">{title}</h1>
                <p className="mt-3 max-w-2xl text-sm text-[color:var(--ink-700)]">
                    Здесь уже готов каркас под role-based маршруты и интерфейсы. Далее подключим реальные API-данные из PostgreSQL через backend.
                </p>
            </div>

            <div className="card-grid">
                {modules.map((module, idx) => (
                    <article
                        key={module.name}
                        className="reveal rounded-2xl border border-[color:var(--line)] bg-white/80 p-5 shadow-sm"
                        style={{ animationDelay: `${idx * 100}ms` }}
                    >
                        <h2 className="heading-font text-lg font-bold">{module.name}</h2>
                        <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${module.color}`}>{module.status}</span>
                    </article>
                ))}
            </div>
        </section>
    )
}
