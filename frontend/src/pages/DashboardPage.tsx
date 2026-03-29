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

type ModuleCard = {
    name: string;
    status: string;
    color: string;
    path?: string;
    action?: string;
};

function getModulesByRole(role?: string): ModuleCard[] {
    const common: ModuleCard[] = [
        {
            name: "AI-ассистент",
            status: "Готово (Спринт 9)",
            color: "bg-indigo-100 text-indigo-800",
            path: "/assistant",
            action: "Открыть",
        },
        {
            name: "Чаты",
            status: "Готово (Спринт 10)",
            color: "bg-cyan-100 text-cyan-800",
            path: "/messages",
            action: "Перейти",
        },
        {
            name: "Уведомления",
            status: "Готово (Спринт 10)",
            color: "bg-rose-100 text-rose-800",
            path: "/notifications",
            action: "Открыть",
        },
        {
            name: "Платежи и подписки",
            status: "Готово (Спринт 11)",
            color: "bg-fuchsia-100 text-fuchsia-800",
            path: "/billing",
            action: "Открыть",
        },
    ];

    if (role === "teacher") {
        return [
            {
                name: "Курсы",
                status: "Готово (Спринт 4)",
                color: "bg-emerald-100 text-emerald-800",
                path: "/dashboard/teacher",
                action: "Мой кабинет",
            },
            {
                name: "Планировщик задач",
                status: "Готово (Спринт 6)",
                color: "bg-amber-100 text-amber-800",
                path: "/planner",
                action: "Открыть",
            },
            {
                name: "Турниры",
                status: "Готово (Спринт 7)",
                color: "bg-sky-100 text-sky-800",
                path: "/tournaments",
                action: "Открыть",
            },
            ...common,
        ];
    }

    if (role === "student") {
        return [
            {
                name: "Обучение",
                status: "Готово (Спринт 5)",
                color: "bg-emerald-100 text-emerald-800",
                path: "/dashboard/student",
                action: "Мой кабинет",
            },
            {
                name: "Планировщик задач",
                status: "Готово (Спринт 6)",
                color: "bg-amber-100 text-amber-800",
                path: "/planner",
                action: "Открыть",
            },
            {
                name: "Турниры",
                status: "Готово (Спринт 7)",
                color: "bg-sky-100 text-sky-800",
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
                status: "Готово (Спринт 8)",
                color: "bg-emerald-100 text-emerald-800",
                path: "/dashboard/parent",
                action: "Мой кабинет",
            },
            {
                name: "Планировщик задач",
                status: "Готово (Спринт 6)",
                color: "bg-amber-100 text-amber-800",
                path: "/planner",
                action: "Открыть",
            },
            ...common,
        ];
    }

    return [
        {
            name: "Учреждение",
            status: "Готово (Спринт 3)",
            color: "bg-emerald-100 text-emerald-800",
            path: "/dashboard/institution_admin",
            action: "Открыть",
        },
        {
            name: "Планировщик задач",
            status: "Готово (Спринт 6)",
            color: "bg-amber-100 text-amber-800",
            path: "/planner",
            action: "Открыть",
        },
        {
            name: "Турниры",
            status: "Готово (Спринт 7)",
            color: "bg-sky-100 text-sky-800",
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
    const modules = useMemo(() => getModulesByRole(role), [role]);

    const handleLogout = async () => {
        if (refreshToken) await authApi.logout(refreshToken).catch(() => null);
        dispatch(signOut());
        navigate("/");
    };

    return (
        <section className="space-y-6">
            <div className="reveal rounded-3xl border border-[color:var(--line)] bg-white/85 p-6 shadow-sm sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-700)]">
                            {title}
                        </p>
                        <h1 className="heading-font mt-1 text-3xl font-bold sm:text-4xl">
                            {user ? `Привет, ${user.email.split("@")[0]}!` : "Добро пожаловать!"}
                        </h1>
                        {user && (
                            <p className="mt-1 text-sm text-[color:var(--ink-700)]">
                                {user.email} &middot; {user.role}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="rounded-xl border border-[color:var(--line)] bg-white px-4 py-2 text-sm font-semibold text-[color:var(--ink-900)] transition hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                    >
                        Выйти
                    </button>
                </div>
                <p className="mt-4 max-w-2xl text-sm text-[color:var(--ink-700)]">
                    Авторизация работает через PostgreSQL + JWT. Ниже — быстрый доступ к готовым модулям платформы.
                </p>
            </div>

            <div className="card-grid">
                {modules.map((module) => (
                    <article
                        key={module.name}
                        className="reveal rounded-2xl border border-[color:var(--line)] bg-white/80 p-5 shadow-sm"
                    >
                        <h2 className="heading-font text-lg font-bold">{module.name}</h2>
                        <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${module.color}`}>
                            {module.status}
                        </span>
                        {module.path && (
                            <button
                                onClick={() => navigate(module.path!)}
                                className="mt-4 rounded-xl border border-[color:var(--line)] bg-white px-3 py-1.5 text-xs font-semibold text-[color:var(--ink-900)] transition hover:border-[color:var(--brand)] hover:text-[color:var(--brand)]"
                            >
                                {module.action ?? "Открыть"}
                            </button>
                        )}
                    </article>
                ))}
            </div>
        </section>
    );
}
