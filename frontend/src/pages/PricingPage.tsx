import { useEffect, useMemo, useState } from "react";

import { paymentApi, type Subscription, type SubscriptionPlan } from "../features/payment/paymentApi";

function formatMoney(cents: number, currency: string) {
    return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: currency.toUpperCase(),
        maximumFractionDigits: 2,
    }).format(cents / 100);
}

function intervalLabel(interval: SubscriptionPlan["interval"]) {
    if (interval === "MONTHLY") return "месяц";
    if (interval === "YEARLY") return "год";
    return "разово";
}

export function PricingPage() {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [busyPlanId, setBusyPlanId] = useState<string | null>(null);

    useEffect(() => {
        void Promise.all([paymentApi.plans(), paymentApi.mySubscription()])
            .then(([planItems, currentSubscription]) => {
                setPlans(planItems);
                setSubscription(currentSubscription);
            })
            .finally(() => setLoading(false));
    }, []);

    const activePlanId = useMemo(() => subscription?.plan.id ?? null, [subscription]);

    async function handleSelectPlan(planId: string) {
        setBusyPlanId(planId);
        try {
            const session = await paymentApi.subscriptionCheckout(planId);
            if (session.checkoutUrl) {
                window.location.href = session.checkoutUrl;
            }
        } finally {
            setBusyPlanId(null);
        }
    }

    async function handleCancelSubscription() {
        await paymentApi.cancelSubscription();
        const updated = await paymentApi.mySubscription();
        setSubscription(updated);
    }

    if (loading) {
        return <div className="py-20 text-center text-[color:var(--ink-700)]">Загрузка тарифов…</div>;
    }

    return (
        <section className="space-y-6">
            <div className="reveal rounded-3xl border border-[color:var(--line)] bg-white/85 p-6 shadow-sm sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--ink-700)]">Подписка</p>
                <h1 className="heading-font mt-1 text-3xl font-bold sm:text-4xl">Тарифы платформы</h1>
                <p className="mt-2 max-w-2xl text-sm text-[color:var(--ink-700)]">
                    Выберите тариф для расширенных возможностей: аналитика, приоритетная поддержка и дополнительные инструменты управления.
                </p>
            </div>

            {subscription && (
                <div className="reveal rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
                    <p className="text-sm text-emerald-700">
                        Активная подписка: <strong>{subscription.plan.name}</strong> ({subscription.status})
                    </p>
                    {subscription.currentPeriodEnd && (
                        <p className="mt-1 text-xs text-emerald-700">
                            Период действует до {new Date(subscription.currentPeriodEnd).toLocaleDateString("ru-RU")}
                        </p>
                    )}
                    {subscription.status !== "CANCELED" && (
                        <button
                            onClick={() => {
                                void handleCancelSubscription();
                            }}
                            className="mt-3 rounded-xl border border-emerald-500 px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                        >
                            Отменить подписку
                        </button>
                    )}
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-3">
                {plans.map((plan) => {
                    const isActive = activePlanId === plan.id && subscription?.status !== "CANCELED";
                    return (
                        <article key={plan.id} className={`reveal rounded-2xl border p-5 shadow-sm ${isActive ? "border-[color:var(--brand)] bg-[color:var(--paper)]" : "border-[color:var(--line)] bg-white/80"}`}>
                            <h2 className="heading-font text-xl font-bold">{plan.name}</h2>
                            {plan.description && <p className="mt-2 text-sm text-[color:var(--ink-700)]">{plan.description}</p>}
                            <p className="mt-4 text-3xl font-bold text-[color:var(--brand)]">{formatMoney(plan.priceCents, plan.currency)}</p>
                            <p className="text-sm text-[color:var(--ink-700)]">/ {intervalLabel(plan.interval)}</p>

                            <button
                                onClick={() => {
                                    void handleSelectPlan(plan.id);
                                }}
                                disabled={isActive || busyPlanId === plan.id}
                                className="mt-5 w-full rounded-xl bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isActive ? "Текущий тариф" : busyPlanId === plan.id ? "Переход..." : "Выбрать тариф"}
                            </button>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}
