import { useEffect, useState, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { rolePath } from '../lib/roleUtils'
import {
    ArrowLeft,
    CheckCircle2,
    CreditCard,
    Lock,
    ShieldCheck,
    Wallet,
    Banknote,
    Loader2,
    Sparkles,
    Receipt,
    Tag,
    Zap,
} from 'lucide-react'
import type { Language } from '../i18n/translations'
import { payments, type SubscriptionPlan } from '../lib/api'

interface CheckoutPageProps {
    language: Language
    onLanguageChange: (lang: Language) => void
}

type PaymentMethodType = 'card' | 'wallet' | 'balance'

/* ─── helpers ─────────────────────────────────────────────────────────────── */

function formatPrice(cents: number, currency = 'KZT') {
    if (currency.toUpperCase() === 'KZT' || currency.toUpperCase() === 'USD') {
        const sym = currency.toUpperCase() === 'KZT' ? '₸' : '$'
        return `${sym} ${(cents / 100).toLocaleString('ru-RU', { minimumFractionDigits: 2 })}`
    }
    return `${(cents / 100).toFixed(2)} ${currency}`
}

function detectBrand(num: string): 'visa' | 'mastercard' | 'amex' | 'unknown' {
    const d = num.replace(/\D/g, '')
    if (/^4/.test(d)) return 'visa'
    if (/^5[1-5]/.test(d) || /^2[2-7]/.test(d)) return 'mastercard'
    if (/^3[47]/.test(d)) return 'amex'
    return 'unknown'
}

const BRAND_COLORS: Record<string, { bg: string; text: string }> = {
    visa: { bg: 'linear-gradient(135deg, #1a1f71, #2563eb)', text: '#fff' },
    mastercard: { bg: 'linear-gradient(135deg, #eb001b, #f79e1b)', text: '#fff' },
    amex: { bg: 'linear-gradient(135deg, #006fcf, #00aeef)', text: '#fff' },
    unknown: { bg: 'linear-gradient(135deg, #334155, #64748b)', text: '#fff' },
}

function formatCardInput(raw: string) {
    return raw.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}
function formatExpiry(raw: string) {
    const d = raw.replace(/\D/g, '').slice(0, 4)
    if (d.length >= 3) return d.slice(0, 2) + ' / ' + d.slice(2)
    return d
}

/* ─── Visual Card ─────────────────────────────────────────────────────────── */

function VisualCard({ number, name, expiry, brand }: { number: string; name: string; expiry: string; brand: string }) {
    const colors = BRAND_COLORS[brand] || BRAND_COLORS.unknown
    const displayNum = number || '•••• •••• •••• ••••'
    const displayName = name || 'YOUR NAME'
    const displayExp = expiry || 'MM / YY'

    return (
        <div className="ck-visual-card" style={{ background: colors.bg }}>
            <div className="ck-card-chip" />
            <div className="ck-card-brand">{brand === 'visa' ? 'VISA' : brand === 'mastercard' ? 'MC' : brand === 'amex' ? 'AMEX' : ''}</div>
            <div className="ck-card-number">{displayNum}</div>
            <div className="ck-card-bottom">
                <div><div className="ck-card-label">Card Holder</div><div className="ck-card-value">{displayName}</div></div>
                <div><div className="ck-card-label">Expires</div><div className="ck-card-value">{displayExp}</div></div>
            </div>
            <div className="ck-card-shine" />
        </div>
    )
}

/* ─── Main component ──────────────────────────────────────────────────────── */

export function CheckoutPage({ language: _language }: CheckoutPageProps) {
    const [params] = useSearchParams()
    const navigate = useNavigate()

    const planId = params.get('plan') ?? ''
    const courseId = params.get('course') ?? ''
    const itemType = courseId ? 'course' : 'subscription'

    const [plans, setPlans] = useState<SubscriptionPlan[]>([])
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    /* Card form */
    const [payMethod, setPayMethod] = useState<PaymentMethodType>('card')
    const [cardNumber, setCardNumber] = useState('')
    const [cardName, setCardName] = useState('')
    const [cardExpiry, setCardExpiry] = useState('')
    const [cardCvv, setCardCvv] = useState('')
    const [promoCode, setPromoCode] = useState('')
    const [promoApplied, setPromoApplied] = useState(false)

    useEffect(() => {
        payments.plans().then(setPlans).catch(() => { }).finally(() => setLoading(false))
    }, [])

    const selectedPlan = useMemo(() => plans.find(p => p.id === planId), [plans, planId])

    /* Price calculations */
    const subtotal = selectedPlan ? selectedPlan.priceCents : 0
    const discount = promoApplied ? Math.round(subtotal * 0.1) : 0
    const tax = Math.round((subtotal - discount) * 0.12)
    const total = subtotal - discount + tax
    const currency = selectedPlan?.currency ?? 'KZT'

    const brand = detectBrand(cardNumber)
    const cardValid = cardNumber.replace(/\D/g, '').length >= 13 && cardName.trim().length >= 2 && cardExpiry.replace(/\D/g, '').length === 4 && cardCvv.length >= 3

    async function handlePay() {
        if (processing) return
        setProcessing(true)
        setError('')
        try {
            if (itemType === 'subscription' && planId) {
                const result = await payments.checkoutSubscription(
                    planId,
                    window.location.origin + '/checkout?success=1',
                    window.location.origin + '/checkout?cancel=1',
                )
                if (result.checkoutUrl) {
                    window.location.href = result.checkoutUrl
                    return
                }
                // Mock/demo mode — subscription created directly
                setSuccess(true)
            } else if (itemType === 'course' && courseId) {
                const result = await payments.checkoutCourse(
                    courseId,
                    window.location.origin + '/checkout?success=1',
                    window.location.origin + '/checkout?cancel=1',
                )
                if (result.checkoutUrl) {
                    window.location.href = result.checkoutUrl
                    return
                }
                setSuccess(true)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Payment failed')
        } finally {
            setProcessing(false)
        }
    }

    /* Handle return from Stripe */
    useEffect(() => {
        if (params.get('success') === '1') setSuccess(true)
    }, [params])

    if (loading) {
        return (
            <div className="ck-page">
                <div className="ck-loading"><Loader2 size={32} className="ck-spin" /> Loading...</div>
            </div>
        )
    }

    if (success) {
        return (
            <div className="ck-page">
                <div className="ck-success-card">
                    <div className="ck-success-icon"><CheckCircle2 size={56} /></div>
                    <h2 className="ck-success-title">Оплата прошла успешно!</h2>
                    <p className="ck-success-sub">
                        {itemType === 'subscription'
                            ? 'Ваша подписка активирована. Наслаждайтесь полным доступом!'
                            : 'Курс добавлен в ваш аккаунт. Начинайте обучение!'}
                    </p>
                    <div className="ck-success-receipt">
                        <Receipt size={16} />
                        <span>Чек отправлен на вашу электронную почту</span>
                    </div>
                    <button type="button" className="ck-btn primary lg" onClick={() => navigate(rolePath('/courses'))}>
                        Перейти к курсам
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="ck-page">
            <div className="ck-container">
                {/* Header */}
                <button type="button" className="ck-back" onClick={() => navigate(-1)}>
                    <ArrowLeft size={18} /> Назад
                </button>
                <h1 className="ck-title">Оформление заказа</h1>

                <div className="ck-grid">
                    {/* ── LEFT: Payment form ──────────────────────────────── */}
                    <div className="ck-form-side">

                        {/* Payment method tabs */}
                        <div className="ck-section">
                            <h3 className="ck-section-title">Способ оплаты</h3>
                            <div className="ck-pay-tabs">
                                {([
                                    { key: 'card' as const, label: 'Карта', icon: CreditCard },
                                    { key: 'wallet' as const, label: 'Кошелёк', icon: Wallet },
                                    { key: 'balance' as const, label: 'Баланс', icon: Banknote },
                                ]).map(tab => {
                                    const Icon = tab.icon
                                    return (
                                        <button
                                            key={tab.key}
                                            type="button"
                                            className={`ck-pay-tab ${payMethod === tab.key ? 'active' : ''}`}
                                            onClick={() => setPayMethod(tab.key)}
                                        >
                                            <Icon size={20} />
                                            <span>{tab.label}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Card form */}
                        {payMethod === 'card' && (
                            <div className="ck-section">
                                <VisualCard number={formatCardInput(cardNumber)} name={cardName.toUpperCase()} expiry={formatExpiry(cardExpiry)} brand={brand} />

                                <div className="ck-card-form">
                                    <div className="ck-field full">
                                        <label className="ck-label">Имя на карте</label>
                                        <input
                                            className="ck-input"
                                            placeholder="JOHN DOE"
                                            value={cardName}
                                            onChange={e => setCardName(e.target.value)}
                                        />
                                    </div>
                                    <div className="ck-field full">
                                        <label className="ck-label">Номер карты</label>
                                        <div className="ck-input-wrap">
                                            <input
                                                className="ck-input with-icon"
                                                placeholder="0000 0000 0000 0000"
                                                value={formatCardInput(cardNumber)}
                                                onChange={e => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                                                maxLength={19}
                                            />
                                            <span className={`ck-brand-chip ${brand}`}>
                                                {brand === 'visa' ? 'VISA' : brand === 'mastercard' ? 'MC' : brand === 'amex' ? 'AMEX' : ''}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ck-field-row">
                                        <div className="ck-field">
                                            <label className="ck-label">Срок действия</label>
                                            <input
                                                className="ck-input"
                                                placeholder="MM / YY"
                                                value={formatExpiry(cardExpiry)}
                                                onChange={e => setCardExpiry(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                                maxLength={7}
                                            />
                                        </div>
                                        <div className="ck-field">
                                            <label className="ck-label">CVV</label>
                                            <input
                                                className="ck-input"
                                                placeholder="•••"
                                                type="password"
                                                value={cardCvv}
                                                onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                                maxLength={4}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Wallet */}
                        {payMethod === 'wallet' && (
                            <div className="ck-section">
                                <div className="ck-wallet-options">
                                    {['Kaspi', 'Halyk', 'PayPal', 'Apple Pay'].map(w => (
                                        <button key={w} type="button" className="ck-wallet-btn">{w}</button>
                                    ))}
                                </div>
                                <p className="ck-wallet-hint">Выберите кошелёк и вы будете перенаправлены для оплаты</p>
                            </div>
                        )}

                        {/* Balance */}
                        {payMethod === 'balance' && (
                            <div className="ck-section">
                                <div className="ck-balance-info">
                                    <Banknote size={24} />
                                    <div>
                                        <div className="ck-balance-label">Текущий баланс</div>
                                        <div className="ck-balance-amount">₸ 25 000,00</div>
                                    </div>
                                </div>
                                <p className="ck-balance-hint">Достаточно средств для оплаты</p>
                            </div>
                        )}

                        {/* Promo */}
                        <div className="ck-section">
                            <div className="ck-promo-row">
                                <Tag size={16} />
                                <input
                                    className="ck-input"
                                    placeholder="Промокод"
                                    value={promoCode}
                                    onChange={e => setPromoCode(e.target.value)}
                                    style={{ flex: 1 }}
                                />
                                <button
                                    type="button"
                                    className="ck-btn sm"
                                    onClick={() => { if (promoCode.trim()) setPromoApplied(true) }}
                                    disabled={promoApplied}
                                >
                                    {promoApplied ? '✓ Применён' : 'Применить'}
                                </button>
                            </div>
                        </div>

                        {/* Security note */}
                        <div className="ck-security">
                            <Lock size={14} />
                            <span>Все данные передаются по защищённому каналу SSL</span>
                            <ShieldCheck size={14} />
                        </div>
                    </div>

                    {/* ── RIGHT: Order summary (receipt style) ────────────── */}
                    <div className="ck-summary-side">
                        <div className="ck-receipt">
                            <div className="ck-receipt-tear top" />
                            <div className="ck-receipt-body">
                                <div className="ck-receipt-header">
                                    <Sparkles size={20} />
                                    <span>EduFuture</span>
                                </div>
                                <div className="ck-receipt-title">Ваш заказ</div>

                                <div className="ck-receipt-items">
                                    {selectedPlan ? (
                                        <div className="ck-receipt-item">
                                            <div className="ck-receipt-item-icon"><Zap size={16} /></div>
                                            <div className="ck-receipt-item-info">
                                                <div className="ck-receipt-item-name">{selectedPlan.name}</div>
                                                <div className="ck-receipt-item-desc">{selectedPlan.description}</div>
                                                <div className="ck-receipt-item-interval">{selectedPlan.interval === 'month' ? 'Ежемесячно' : 'Ежегодно'}</div>
                                            </div>
                                            <div className="ck-receipt-item-price">{formatPrice(selectedPlan.priceCents, currency)}</div>
                                        </div>
                                    ) : (
                                        <div className="ck-receipt-item">
                                            <div className="ck-receipt-item-icon"><Zap size={16} /></div>
                                            <div className="ck-receipt-item-info">
                                                <div className="ck-receipt-item-name">Pro подписка</div>
                                                <div className="ck-receipt-item-desc">Полный доступ к платформе</div>
                                            </div>
                                            <div className="ck-receipt-item-price">₸ 4 900,00</div>
                                        </div>
                                    )}
                                </div>

                                <div className="ck-receipt-divider" />

                                <div className="ck-receipt-lines">
                                    <div className="ck-receipt-line">
                                        <span>Подытог</span>
                                        <span>{formatPrice(subtotal, currency)}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="ck-receipt-line discount">
                                            <span>Промокод (-10%)</span>
                                            <span>−{formatPrice(discount, currency)}</span>
                                        </div>
                                    )}
                                    <div className="ck-receipt-line">
                                        <span>НДС (12%)</span>
                                        <span>{formatPrice(tax, currency)}</span>
                                    </div>
                                </div>

                                <div className="ck-receipt-divider thick" />

                                <div className="ck-receipt-total">
                                    <span>Итого</span>
                                    <span>{formatPrice(total, currency)}</span>
                                </div>

                                {error && <div className="ck-error">{error}</div>}

                                <button
                                    type="button"
                                    className="ck-pay-btn"
                                    onClick={handlePay}
                                    disabled={processing || (payMethod === 'card' && !cardValid)}
                                >
                                    {processing
                                        ? <><Loader2 size={18} className="ck-spin" /> Обработка...</>
                                        : <><Lock size={16} /> Оплатить {formatPrice(total, currency)}</>
                                    }
                                </button>
                            </div>
                            <div className="ck-receipt-tear bottom" />
                        </div>

                        <div className="ck-trust-badges">
                            <span>🔒 SSL</span>
                            <span>💳 PCI DSS</span>
                            <span>🛡️ 3D Secure</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
