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

const planGradients = [
    {
        card: 'rgba(99,102,241,0.08)',
        border: 'rgba(99,102,241,0.25)',
        accent: 'var(--brand-light)',
        glow: 'rgba(99,102,241,0.20)',
        icon: '⭐',
    },
    {
        card: 'rgba(20,184,166,0.08)',
        border: 'rgba(20,184,166,0.25)',
        accent: 'var(--accent-teal)',
        glow: 'rgba(20,184,166,0.20)',
        icon: '🚀',
    },
    {
        card: 'rgba(168,85,247,0.08)',
        border: 'rgba(168,85,247,0.25)',
        accent: '#c084fc',
        glow: 'rgba(168,85,247,0.20)',
        icon: '💎',
    },
]

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
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
                <div
                    className="h-12 w-12 rounded-full border-4 animate-spin"
                    style={{ borderColor: 'var(--brand)', borderTopColor: 'transparent' }}
                />
                <p style={{ color: 'var(--ink-300)' }}>Загрузка тарифов…</p>
            </div>
        );
    }

    return (
        <section className="space-y-8">
            {/* ── Header ────────────────────────────────────────────── */}
            <div className="reveal text-center max-w-2xl mx-auto pt-4">
                <span
                    className="badge mb-4 mx-auto"
                    style={{
                        background: 'rgba(245,158,11,0.12)',
                        color: 'var(--accent)',
                        border: '1px solid rgba(245,158,11,0.3)',
                    }}
                >
                    💳 Тарифы и подписки
                </span>
                <h1 className="heading-font text-4xl sm:text-5xl font-bold mb-3" style={{ color: 'var(--ink-100)' }}>
                    Выбери свой{' '}
                    <span className="gradient-text">план</span>
                </h1>
                <p className="text-base" style={{ color: 'var(--ink-300)' }}>
                    Расширенная аналитика, приоритетная поддержка и дополнительные инструменты управления
                </p>
            </div>

            {/* ── Active Subscription Banner ─────────────────────────── */}
            {subscription && (
                <div
                    className="reveal rounded-2xl px-6 py-4 flex flex-wrap items-center justify-between gap-4"
                    style={{
                        background: 'rgba(20,184,166,0.08)',
                        border: '1px solid rgba(20,184,166,0.3)',
                        boxShadow: '0 0 30px rgba(20,184,166,0.10)',
                    }}
                >
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">✅</span>
                        <div>
                            <p className="font-semibold text-sm" style={{ color: 'var(--accent-teal)' }}>
                                Активная подписка: <strong>{subscription.plan.name}</strong>
                            </p>
                            {subscription.currentPeriodEnd && (
                                <p className="text-xs mt-0.5" style={{ color: 'var(--ink-300)' }}>
                                    Действует до {new Date(subscription.currentPeriodEnd).toLocaleDateString("ru-RU")}
                                    {' '}· Статус: {subscription.status}
                                </p>
                            )}
                        </div>
                    </div>
                    {subscription.status !== "CANCELED" && (
                        <button
                            onClick={() => { void handleCancelSubscription(); }}
                            className="text-sm font-semibold px-4 py-2 rounded-xl transition-all"
                            style={{
                                background: 'rgba(244,63,94,0.08)',
                                border: '1px solid rgba(244,63,94,0.2)',
                                color: '#fb7185',
                            }}
                            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(244,63,94,0.18)'}
                            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = 'rgba(244,63,94,0.08)'}
                        >
                            Отменить подписку
                        </button>
                    )}
                </div>
            )}

            {/* ── Plan Cards ────────────────────────────────────────── */}
            <div className="grid gap-5 md:grid-cols-3">
                {plans.map((plan, idx) => {
                    const isActive = activePlanId === plan.id && subscription?.status !== "CANCELED";
                    const style = planGradients[idx % planGradients.length]

                    return (
                        <article
                            key={plan.id}
                            className="reveal glass card-interactive rounded-3xl p-6 flex flex-col relative overflow-hidden"
                            style={{
                                background: style.card,
                                borderColor: isActive ? style.accent : style.border,
                                boxShadow: isActive ? `0 0 40px ${style.glow}` : 'none',
                            }}
                        >
                            {/* Active badge */}
                            {isActive && (
                                <div
                                    className="absolute top-4 right-4 text-xs font-bold px-2 py-1 rounded-full"
                                    style={{
                                        background: style.glow,
                                        color: style.accent,
                                        border: `1px solid ${style.border}`,
                                    }}
                                >
                                    Текущий
                                </div>
                            )}

                            {/* Icon */}
                            <div
                                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-5"
                                style={{ background: style.glow }}
                            >
                                {style.icon}
                            </div>

                            {/* Plan info */}
                            <h2 className="heading-font text-2xl font-bold mb-2" style={{ color: 'var(--ink-100)' }}>
                                {plan.name}
                            </h2>
                            {plan.description && (
                                <p className="text-sm mb-5 flex-1" style={{ color: 'var(--ink-300)' }}>
                                    {plan.description}
                                </p>
                            )}

                            {/* Price */}
                            <div className="mb-6">
                                <p
                                    className="heading-font text-4xl font-bold"
                                    style={{ color: style.accent }}
                                >
                                    {formatMoney(plan.priceCents, plan.currency)}
                                </p>
                                <p className="text-sm mt-0.5" style={{ color: 'var(--ink-500)' }}>
                                    / {intervalLabel(plan.interval)}
                                </p>
                            </div>

                            {/* CTA */}
                            <button
                                onClick={() => { void handleSelectPlan(plan.id); }}
                                disabled={isActive || busyPlanId === plan.id}
                                className="w-full py-3 rounded-xl font-bold text-sm transition-all"
                                style={{
                                    background: isActive
                                        ? 'rgba(255,255,255,0.05)'
                                        : `linear-gradient(135deg, ${style.accent === 'var(--brand-light)' ? '#6366f1, #4f46e5' : style.accent === 'var(--accent-teal)' ? '#14b8a6, #0f766e' : '#a855f7, #7c3aed'})`,
                                    color: '#fff',
                                    opacity: busyPlanId === plan.id ? 0.7 : 1,
                                    cursor: isActive ? 'default' : 'pointer',
                                    boxShadow: isActive ? 'none' : `0 0 20px ${style.glow}`,
                                }}
                            >
                                {isActive ? '✓ Текущий тариф' : busyPlanId === plan.id ? 'Переход...' : 'Выбрать тариф →'}
                            </button>
                        </article>
                    );
                })}
            </div>

            {/* No plans fallback */}
            {plans.length === 0 && (
                <div className="glass rounded-3xl p-12 text-center">
                    <p className="text-5xl mb-4">📋</p>
                    <p className="font-semibold" style={{ color: 'var(--ink-100)' }}>
                        Тарифы ещё не настроены
                    </p>
                    <p className="text-sm mt-1" style={{ color: 'var(--ink-500)' }}>
                        Свяжитесь с администратором платформы
                    </p>
                </div>
            )}
        </section>
    );
}
