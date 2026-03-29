import { useEffect, useMemo, useState } from "react";

import { courseApi, type Course } from "../features/course/courseApi";
import {
    paymentApi,
    type CommissionTransaction,
    type CoursePurchase,
    type MarketplaceCourse,
} from "../features/payment/paymentApi";

function readRole(): string {
    try {
        const token = localStorage.getItem("accessToken") ?? "";
        const payload = JSON.parse(atob(token.split(".")[1] ?? "")) as { role?: string };
        return payload.role ?? "";
    } catch {
        return "";
    }
}

function formatMoney(cents: number, currency: string) {
    return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: currency.toUpperCase(),
        maximumFractionDigits: 2,
    }).format(cents / 100);
}

export function BillingPage() {
    const role = useMemo(() => readRole(), []);
    const isTeacher = role === "TEACHER" || role === "INSTITUTION_ADMIN";

    const [marketplace, setMarketplace] = useState<MarketplaceCourse[]>([]);
    const [purchases, setPurchases] = useState<CoursePurchase[]>([]);
    const [commissions, setCommissions] = useState<CommissionTransaction[]>([]);
    const [myCourses, setMyCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [busyCourseId, setBusyCourseId] = useState<string | null>(null);

    useEffect(() => {
        const calls: Promise<unknown>[] = [
            paymentApi.marketplace().then(setMarketplace),
            paymentApi.purchases().then(setPurchases),
        ];

        if (isTeacher) {
            calls.push(paymentApi.commissions().then(setCommissions));
            calls.push(courseApi.list(true).then(setMyCourses));
        }

        void Promise.all(calls).finally(() => setLoading(false));
    }, [isTeacher]);

    async function handleBuyCourse(courseId: string) {
        setBusyCourseId(courseId);
        try {
            const session = await paymentApi.courseCheckout(courseId);
            if (session.checkoutUrl) {
                window.location.href = session.checkoutUrl;
            }
        } finally {
            setBusyCourseId(null);
        }
    }

    async function handleTogglePaid(course: Course) {
        const nextPaid = !course.isPaid;
        const entered = nextPaid ? window.prompt("Цена в центах (например, 1990):", String(course.priceCents || 1990)) : "0";
        if (entered === null) return;
        const priceCents = Number(entered);
        if (!Number.isFinite(priceCents) || priceCents < 0) return;

        await paymentApi.updateCoursePricing(course.id, {
            isPaid: nextPaid,
            priceCents,
            currency: course.currency ?? "USD",
        });

        const refreshed = await courseApi.list(true);
        setMyCourses(refreshed);
    }

    const totalRevenue = commissions.reduce((sum, item) => sum + item.teacherAmountCents, 0);
    const platformFees = commissions.reduce((sum, item) => sum + item.platformFeeCents, 0);

    if (loading) {
        return <div className="py-20 text-center text-[color:var(--ink-700)]">Загрузка платежей…</div>;
    }

    return (
        <section className="space-y-6">
            <div className="reveal rounded-3xl border border-[color:var(--line)] bg-white/85 p-6 shadow-sm sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-700)]">Платежи</p>
                <h1 className="heading-font mt-1 text-3xl font-bold sm:text-4xl">Оплата курсов и история транзакций</h1>
            </div>

            {isTeacher && (
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-[color:var(--line)] bg-white/80 p-5 shadow-sm">
                        <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--ink-700)]">Мой доход</p>
                        <p className="mt-2 text-2xl font-bold text-[color:var(--brand)]">{formatMoney(totalRevenue, "USD")}</p>
                    </div>
                    <div className="rounded-2xl border border-[color:var(--line)] bg-white/80 p-5 shadow-sm">
                        <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--ink-700)]">Комиссия платформы</p>
                        <p className="mt-2 text-2xl font-bold text-[color:var(--ink-900)]">{formatMoney(platformFees, "USD")}</p>
                    </div>
                    <div className="rounded-2xl border border-[color:var(--line)] bg-white/80 p-5 shadow-sm">
                        <p className="text-xs uppercase tracking-[0.14em] text-[color:var(--ink-700)]">Продаж</p>
                        <p className="mt-2 text-2xl font-bold text-[color:var(--ink-900)]">{commissions.length}</p>
                    </div>
                </div>
            )}

            {isTeacher && (
                <div className="reveal rounded-2xl border border-[color:var(--line)] bg-white/80 p-5 shadow-sm">
                    <h2 className="heading-font text-xl font-bold">Монетизация моих курсов</h2>
                    <div className="mt-4 space-y-3">
                        {myCourses.length === 0 && <p className="text-sm text-[color:var(--ink-700)]">Курсов пока нет.</p>}
                        {myCourses.map((course) => (
                            <article key={course.id} className="rounded-2xl border border-[color:var(--line)] p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <h3 className="font-semibold">{course.title}</h3>
                                        <p className="text-sm text-[color:var(--ink-700)]">
                                            {course.isPaid ? `Платный курс: ${formatMoney(course.priceCents, course.currency ?? "USD")}` : "Бесплатный курс"}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            void handleTogglePaid(course);
                                        }}
                                        className={`rounded-xl px-3 py-2 text-sm font-semibold ${course.isPaid ? "border border-red-300 text-red-700 hover:bg-red-50" : "bg-[color:var(--brand)] text-white hover:opacity-90"}`}
                                    >
                                        {course.isPaid ? "Сделать бесплатным" : "Сделать платным"}
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="reveal rounded-2xl border border-[color:var(--line)] bg-white/80 p-5 shadow-sm">
                    <h2 className="heading-font text-xl font-bold">Маркетплейс курсов</h2>
                    <div className="mt-4 space-y-3">
                        {marketplace.length === 0 && <p className="text-sm text-[color:var(--ink-700)]">Платные курсы пока недоступны.</p>}
                        {marketplace.map((course) => (
                            <article key={course.id} className="rounded-2xl border border-[color:var(--line)] p-4">
                                <h3 className="font-semibold">{course.title}</h3>
                                {course.description && <p className="mt-1 text-sm text-[color:var(--ink-700)]">{course.description}</p>}
                                <p className="mt-1 text-xs text-[color:var(--ink-700)]">
                                    {course.author.firstName} {course.author.lastName} · {course._count.modules} модулей
                                </p>
                                <div className="mt-3 flex items-center justify-between">
                                    <strong className="text-[color:var(--brand)]">{formatMoney(course.priceCents, course.currency)}</strong>
                                    <button
                                        onClick={() => {
                                            void handleBuyCourse(course.id);
                                        }}
                                        disabled={busyCourseId === course.id}
                                        className="rounded-xl bg-[color:var(--brand)] px-3 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                                    >
                                        {busyCourseId === course.id ? "Оформление..." : "Купить"}
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>

                <div className="reveal rounded-2xl border border-[color:var(--line)] bg-white/80 p-5 shadow-sm">
                    <h2 className="heading-font text-xl font-bold">История покупок</h2>
                    <div className="mt-4 space-y-3">
                        {purchases.length === 0 && <p className="text-sm text-[color:var(--ink-700)]">Покупок пока нет.</p>}
                        {purchases.map((purchase) => (
                            <article key={purchase.id} className="rounded-2xl border border-[color:var(--line)] p-4">
                                <h3 className="font-semibold">{purchase.course.title}</h3>
                                <p className="text-sm text-[color:var(--ink-700)]">
                                    Преподаватель: {purchase.course.author.firstName} {purchase.course.author.lastName}
                                </p>
                                <div className="mt-2 flex items-center justify-between text-sm">
                                    <span>{new Date(purchase.createdAt).toLocaleString("ru-RU")}</span>
                                    <span className={`font-semibold ${purchase.status === "SUCCEEDED" ? "text-emerald-600" : purchase.status === "PENDING" ? "text-amber-600" : "text-red-600"}`}>
                                        {purchase.status}
                                    </span>
                                </div>
                                <p className="mt-2 font-semibold text-[color:var(--brand)]">{formatMoney(purchase.amountCents, purchase.currency)}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </div>

            {isTeacher && commissions.length > 0 && (
                <div className="reveal rounded-2xl border border-[color:var(--line)] bg-white/80 p-5 shadow-sm">
                    <h2 className="heading-font text-xl font-bold">История комиссий</h2>
                    <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="border-b border-[color:var(--line)] text-left text-[color:var(--ink-700)]">
                                    <th className="px-2 py-2">Дата</th>
                                    <th className="px-2 py-2">Курс</th>
                                    <th className="px-2 py-2">Покупатель</th>
                                    <th className="px-2 py-2">Сумма</th>
                                    <th className="px-2 py-2">Комиссия</th>
                                    <th className="px-2 py-2">Выплата</th>
                                    <th className="px-2 py-2">Статус</th>
                                </tr>
                            </thead>
                            <tbody>
                                {commissions.map((item) => (
                                    <tr key={item.id} className="border-b border-[color:var(--line)]">
                                        <td className="px-2 py-2">{new Date(item.createdAt).toLocaleDateString("ru-RU")}</td>
                                        <td className="px-2 py-2">{item.course.title}</td>
                                        <td className="px-2 py-2">{item.purchase.user.firstName} {item.purchase.user.lastName}</td>
                                        <td className="px-2 py-2">{formatMoney(item.grossAmountCents, "USD")}</td>
                                        <td className="px-2 py-2">{formatMoney(item.platformFeeCents, "USD")}</td>
                                        <td className="px-2 py-2">{formatMoney(item.teacherAmountCents, "USD")}</td>
                                        <td className="px-2 py-2">{item.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </section>
    );
}
