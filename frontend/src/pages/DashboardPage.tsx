import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import type { RootState } from "../app/store";
import { authApi } from "../features/auth/authApi";
import { signOut } from "../features/auth/authSlice";

const roleTitles: Record<string, string> = {
    institution_admin: "Кабинет учреждения",
    teacher: "Кабинет учителя",
    student: "Кабинет ученика",
    parent: "Кабинет родителя",
};

const roleEmojis: Record<string, string> = {
    institution_admin: "🏫",
    teacher: "📖",
    student: "🎓",
    parent: "👨‍👩‍👧",
};

type ModuleCard = {
    name: string;
    status: string;
    icon: string;
    cardStyle: string;
    iconColor: string;
    path?: string;
    action?: string;
};

function getModulesByRole(role?: string): ModuleCard[] {
    const common: ModuleCard[] = [
        {
            name: "AI-ассистент",
            status: "Готово — Спринт 9",
            icon: "🤖",
            cardStyle: "stat-card-indigo",
            iconColor: "rgba(99,102,241,0.2)",
            path: "/assistant",
            action: "Открыть",
        },
        {
            name: "Чаты",
            status: "Готово — Спринт 10",
            icon: "💬",
            cardStyle: "stat-card-teal",
            iconColor: "rgba(20,184,166,0.2)",
            path: "/messages",
            action: "Перейти",
        },
        {
            name: "Уведомления",
            status: "Готово — Спринт 10",
            icon: "🔔",
            cardStyle: "stat-card-rose",
            iconColor: "rgba(244,63,94,0.2)",
            path: "/notifications",
            action: "Открыть",
        },
        {
            name: "Платежи и подписки",
            status: "Готово — Спринт 11",
            icon: "💳",
            cardStyle: "stat-card-purple",
            iconColor: "rgba(168,85,247,0.2)",
            path: "/billing",
            action: "Открыть",
        },
    ];

    if (role === "teacher") {
        return [
            {
                name: "Мои курсы",
                status: "Готово — Спринт 4",
                icon: "📚",
                cardStyle: "stat-card-teal",
                iconColor: "rgba(20,184,166,0.2)",
                path: "/dashboard/teacher",
                action: "Мой кабинет",
            },
            {
                name: "Планировщик",
                status: "Готово — Спринт 6",
                icon: "📋",
                cardStyle: "stat-card-amber",
                iconColor: "rgba(245,158,11,0.2)",
                path: "/planner",
                action: "Открыть",
            },
            {
                name: "Турниры",
                status: "Готово — Спринт 7",
                icon: "⚔️",
                cardStyle: "stat-card-indigo",
                iconColor: "rgba(99,102,241,0.2)",
                path: "/tournaments",
                action: "Открыть",
            },
            ...common,
        ];
    }

    if (role === "student") {
        return [
            {
                name: "Моё обучение",
                status: "Готово — Спринт 5",
                icon: "📖",
                cardStyle: "stat-card-teal",
                iconColor: "rgba(20,184,166,0.2)",
                path: "/dashboard/student",
                action: "Мой кабинет",
            },
            {
                name: "Планировщик",
                status: "Готово — Спринт 6",
                icon: "📋",
                cardStyle: "stat-card-amber",
                iconColor: "rgba(245,158,11,0.2)",
                path: "/planner",
                action: "Открыть",
            },
            {
                name: "Турниры",
                status: "Готово — Спринт 7",
                icon: "⚔️",
                cardStyle: "stat-card-indigo",
                iconColor: "rgba(99,102,241,0.2)",
                path: "/tournaments",
                action: "Открыть",
            },
            ...common,
        ];
    }

    if (role === "parent") {
        return [
            {
                name: "Дашборд родителя",
                status: "Готово — Спринт 8",
                icon: "👁️",
                cardStyle: "stat-card-teal",
                iconColor: "rgba(20,184,166,0.2)",
                path: "/dashboard/parent",
                action: "Мой кабинет",
            },
            {
                name: "Планировщик",
                status: "Готово — Спринт 6",
                icon: "📋",
                cardStyle: "stat-card-amber",
                iconColor: "rgba(245,158,11,0.2)",
                path: "/planner",
                action: "Открыть",
            },
            ...common,
        ];
    }

    return [
        {
            name: "Учреждение",
            status: "Готово — Спринт 3",
            icon: "🏫",
            cardStyle: "stat-card-teal",
            iconColor: "rgba(20,184,166,0.2)",
            path: "/dashboard/institution_admin",
            action: "Открыть",
        },
        {
            name: "Планировщик",
            status: "Готово — Спринт 6",
            icon: "📋",
            cardStyle: "stat-card-amber",
            iconColor: "rgba(245,158,11,0.2)",
            path: "/planner",
            action: "Открыть",
        },
        {
            name: "Турниры",
            status: "Готово — Спринт 7",
            icon: "⚔️",
            cardStyle: "stat-card-indigo",
            iconColor: "rgba(99,102,241,0.2)",
            path: "/tournaments",
            action: "Открыть",
        },
        ...common,
    ];
}

export function DashboardPage() {
    const { role } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((s: RootState) => s.auth.user);
    const refreshToken = useSelector((s: RootState) => s.auth.refreshToken);

    const title = useMemo(() => roleTitles[role ?? ""] ?? "Личный кабинет", [role]);
    const emoji = useMemo(() => roleEmojis[role ?? ""] ?? "👤", [role]);
    const modules = useMemo(() => getModulesByRole(role), [role]);

    const handleLogout = async () => {
        if (refreshToken) await authApi.logout(refreshToken).catch(() => null);
        dispatch(signOut());
        navigate("/");
    };

    return (
        <section className="space-y-8">
            {/* ── Welcome Header ─────────────────────────────────── */}
            <div
                className="reveal glass-bright rounded-3xl p-6 sm:p-8 relative overflow-hidden"
                style={{ boxShadow: '0 0 60px rgba(99,102,241,0.10)' }}
            >
                {/* Background accent */}
                <div
                    className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
                        transform: 'translate(30%, -30%)',
                    }}
                />

                <div className="relative flex flex-wrap items-start justify-between gap-5">
                    {/* Left */}
                    <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div
                            className="flex items-center justify-center w-14 h-14 rounded-2xl text-2xl flex-shrink-0"
                            style={{
                                background: 'linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(20,184,166,0.15) 100%)',
                                border: '1px solid rgba(99,102,241,0.3)',
                            }}
                        >
                            {emoji}
                        </div>

                        <div>
                            <p
                                className="text-xs font-bold uppercase tracking-widest mb-0.5"
                                style={{ color: 'var(--brand-light)' }}
                            >
                                {title}
                            </p>
                            <h1 className="heading-font text-3xl sm:text-4xl font-bold" style={{ color: 'var(--ink-100)' }}>
                                {user
                                    ? <>Привет, <span className="gradient-text">{user.email.split("@")[0]}</span>!</>
                                    : "Добро пожаловать!"
                                }
                            </h1>
                            {user && (
                                <p className="mt-1 text-sm flex items-center gap-2" style={{ color: 'var(--ink-300)' }}>
                                    <span>{user.email}</span>
                                    <span style={{ color: 'var(--line-bright)' }}>·</span>
                                    <span
                                        className="badge badge-brand"
                                        style={{ fontSize: '0.65rem' }}
                                    >
                                        {user.role}
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                        style={{
                            background: 'rgba(244,63,94,0.08)',
                            border: '1px solid rgba(244,63,94,0.2)',
                            color: '#fb7185',
                        }}
                        onMouseEnter={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(244,63,94,0.18)'
                            ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(244,63,94,0.4)'
                        }}
                        onMouseLeave={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(244,63,94,0.08)'
                            ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(244,63,94,0.2)'
                        }}
                    >
                        <span>🚪</span>
                        Выйти
                    </button>
                </div>

                <p className="relative mt-5 text-sm max-w-2xl" style={{ color: 'var(--ink-300)' }}>
                    Авторизация работает через PostgreSQL + JWT. Ниже — быстрый доступ ко всем готовым модулям платформы.
                </p>
            </div>

            {/* ── Module Grid ────────────────────────────────────── */}
            <div>
                <p
                    className="text-xs font-bold uppercase tracking-widest mb-4"
                    style={{ color: 'var(--ink-500)' }}
                >
                    Доступные модули
                </p>
                <div className="card-grid">
                    {modules.map((module, i) => (
                        <article
                            key={module.name}
                            className={`reveal reveal-delay-${Math.min(i + 1, 4)} glass card-interactive rounded-2xl p-5 ${module.cardStyle}`}
                        >
                            {/* Icon */}
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3"
                                style={{ background: module.iconColor }}
                            >
                                {module.icon}
                            </div>

                            {/* Name */}
                            <h2
                                className="heading-font text-base font-bold mb-1"
                                style={{ color: 'var(--ink-100)' }}
                            >
                                {module.name}
                            </h2>

                            {/* Status badge */}
                            <span
                                className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full mb-3"
                                style={{
                                    background: 'rgba(20,184,166,0.1)',
                                    color: 'var(--accent-teal)',
                                    border: '1px solid rgba(20,184,166,0.25)',
                                }}
                            >
                                ✓ {module.status}
                            </span>

                            {/* Action button */}
                            {module.path && (
                                <div>
                                    <button
                                        onClick={() => navigate(module.path!)}
                                        className="w-full text-xs font-semibold py-2 px-3 rounded-lg transition-all"
                                        style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid var(--line-bright)',
                                            color: 'var(--ink-100)',
                                        }}
                                        onMouseEnter={e => {
                                            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.15)'
                                            ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(99,102,241,0.4)'
                                            ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--brand-light)'
                                        }}
                                        onMouseLeave={e => {
                                            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)'
                                            ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--line-bright)'
                                            ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--ink-100)'
                                        }}
                                    >
                                        {module.action ?? "Открыть"} →
                                    </button>
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
