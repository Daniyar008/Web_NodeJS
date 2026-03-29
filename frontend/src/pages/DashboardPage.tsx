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

const modules = [
    { name: "Курсы", status: "В разработке (Спринт 4)", color: "bg-emerald-100 text-emerald-800" },
    { name: "Планировщик задач", status: "В разработке (Спринт 6)", color: "bg-amber-100 text-amber-800" },
    { name: "Турниры", status: "В разработке (Спринт 7)", color: "bg-sky-100 text-sky-800" },
    { name: "Уведомления", status: "В разработке (Спринт 10)", color: "bg-rose-100 text-rose-800" },
];

export function DashboardPage() {
    const { role } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((s: RootState) => s.auth.user);
    const refreshToken = useSelector((s: RootState) => s.auth.refreshToken);

    const title = useMemo(() => roleTitles[role ?? ""] ?? "Личный кабинет", [role]);

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
                    Авторизация работает через PostgreSQL + JWT. Ниже — модули следующих спринтов.
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
                        <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${module.color}`}>
                            {module.status}
                        </span>
                    </article>
                ))}
            </div>
        </section>
    );
}
