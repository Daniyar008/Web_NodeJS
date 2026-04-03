import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
    ArrowLeft,
    BookOpen,
    Check,
    Eye,
    EyeOff,
    KeyRound,
    Loader2,
    Lock,
    Mail,
    RefreshCw,
    ShieldCheck,
} from 'lucide-react'
import { auth, ApiClientError } from '../lib/api'

// ─── Floating particles ───────────────────────────────────────────────────────
function Particles() {
    return (
        <div className="fp-particles" aria-hidden="true">
            {Array.from({ length: 18 }).map((_, i) => (
                <span key={i} className="fp-particle" style={{
                    '--fp-delay': `${(i * 0.37) % 3.5}s`,
                    '--fp-dur': `${4 + (i * 0.41) % 4}s`,
                    '--fp-x': `${(i * 13 + 7) % 100}%`,
                    '--fp-size': `${4 + (i * 0.9) % 6}px`,
                } as React.CSSProperties} />
            ))}
        </div>
    )
}

// ─── Animated orbit rings ─────────────────────────────────────────────────────
function OrbitIcon() {
    return (
        <div className="fp-orbit-wrap" aria-hidden="true">
            <div className="fp-orbit fp-orbit--1" />
            <div className="fp-orbit fp-orbit--2" />
            <div className="fp-orbit fp-orbit--3" />
            <div className="fp-orbit-center">
                <KeyRound size={28} strokeWidth={1.5} />
            </div>
            <div className="fp-orbit-dot fp-orbit-dot--a" />
            <div className="fp-orbit-dot fp-orbit-dot--b" />
            <div className="fp-orbit-dot fp-orbit-dot--c" />
        </div>
    )
}

// ─── Success envelope ─────────────────────────────────────────────────────────
function SuccessIcon() {
    return (
        <div className="fp-success-icon" aria-hidden="true">
            <div className="fp-success-ring" />
            <div className="fp-success-ring fp-success-ring--2" />
            <Mail size={36} strokeWidth={1.5} className="fp-success-mail" />
            <div className="fp-success-check">
                <Check size={14} strokeWidth={3} />
            </div>
        </div>
    )
}

// ─── Password strength bar ────────────────────────────────────────────────────
function StrengthBar({ password }: { password: string }) {
    const strength = password.length === 0 ? 0
        : password.length < 6 ? 1
            : password.length < 10 ? 2
                : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 3 : 2

    const colors = ['', '#ef4444', '#f59e0b', '#22c55e']
    const labels = ['', 'Слабый', 'Средний', 'Надёжный']

    return (
        <div className="auth-strength">
            <div className="auth-strength-bars">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="auth-strength-bar"
                        style={{ background: i <= strength ? colors[strength] : 'rgba(255,255,255,0.1)' }}
                    />
                ))}
            </div>
            <span style={{ color: colors[strength] }}>{labels[strength]}</span>
        </div>
    )
}

// ─── Resend countdown ─────────────────────────────────────────────────────────
function ResendButton({ email }: { email: string }) {
    const [secs, setSecs] = useState(60)
    const [resending, setResending] = useState(false)

    useEffect(() => {
        if (secs <= 0) return
        const t = window.setTimeout(() => setSecs((s) => s - 1), 1000)
        return () => clearTimeout(t)
    }, [secs])

    async function handleResend() {
        setResending(true)
        try {
            await auth.forgotPassword(email)
            setSecs(60)
        } finally {
            setResending(false)
        }
    }

    if (secs > 0) {
        return (
            <p className="fp-resend-hint">
                Не получил письмо? Отправить повторно через{' '}
                <span className="fp-resend-countdown">{secs}с</span>
            </p>
        )
    }

    return (
        <button type="button" className="fp-resend-btn" onClick={handleResend} disabled={resending}>
            {resending
                ? <><Loader2 size={14} className="auth-spin" /> Отправляю...</>
                : <><RefreshCw size={14} /> Отправить повторно</>}
        </button>
    )
}

// ─── Main component ───────────────────────────────────────────────────────────
type Phase = 'email' | 'sent' | 'reset' | 'done'

export function ForgotPasswordPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const resetToken = searchParams.get('token')

    const [phase, setPhase] = useState<Phase>(resetToken ? 'reset' : 'email')
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [loading, setLoading] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)

    // Reset phase state
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [passErrors, setPassErrors] = useState<Record<string, string>>({})

    const emailRef = useRef<HTMLInputElement>(null)
    useEffect(() => {
        if (phase === 'email') emailRef.current?.focus()
    }, [phase])

    // ── Step 1: Send reset email ────────────────────────────────────────────────
    async function handleEmailSubmit(e: React.FormEvent) {
        e.preventDefault()
        setEmailError('')
        setServerError(null)
        if (!email.trim()) { setEmailError('Введи email'); return }
        if (!/\S+@\S+\.\S+/.test(email)) { setEmailError('Некорректный email'); return }
        setLoading(true)
        try {
            await auth.forgotPassword(email.trim())
            setPhase('sent')
        } catch (err) {
            const msg = err instanceof ApiClientError ? err.message : 'Ошибка соединения с сервером'
            setServerError(msg)
        } finally {
            setLoading(false)
        }
    }

    // ── Step 2: Set new password ────────────────────────────────────────────────
    async function handleResetSubmit(e: React.FormEvent) {
        e.preventDefault()
        const errs: Record<string, string> = {}
        if (!newPassword) errs.pass = 'Введи новый пароль'
        else if (newPassword.length < 8) errs.pass = 'Минимум 8 символов'
        if (newPassword !== confirmPassword) errs.confirm = 'Пароли не совпадают'
        setPassErrors(errs)
        if (Object.keys(errs).length > 0) return
        setLoading(true)
        setServerError(null)
        try {
            await auth.resetPassword(resetToken!, newPassword)
            setPhase('done')
        } catch (err) {
            const msg = err instanceof ApiClientError ? err.message : 'Ссылка недействительна или истекла'
            setServerError(msg)
        } finally {
            setLoading(false)
        }
    }

    // ─── Left panel content by phase ─────────────────────────────────────────────
    const leftContent = {
        email: {
            title: 'Восстанови доступ к аккаунту',
            sub: 'Укажи свой email — мы отправим ссылку для создания нового пароля.',
            points: ['Быстро и безопасно', 'Ссылка действует 1 час', 'Без потери данных'],
        },
        sent: {
            title: 'Письмо уже в пути',
            sub: 'Проверь почту и перейди по ссылке из письма, чтобы создать новый пароль.',
            points: ['Не забудь проверить спам', 'Ссылка одноразовая', 'Действует 60 минут'],
        },
        reset: {
            title: 'Создай надёжный пароль',
            sub: 'Придумай новый пароль. Используй буквы, цифры и спецсимволы.',
            points: ['Минимум 8 символов', 'Заглавная буква + цифра', 'Не повторяй старый'],
        },
        done: {
            title: 'Пароль успешно изменён!',
            sub: 'Теперь войди в аккаунт с новым паролем и продолжи обучение.',
            points: ['Все сессии завершены', 'Аккаунт в безопасности', 'Можно войти прямо сейчас'],
        },
    }

    const lc = leftContent[phase]

    return (
        <div className="auth-root fp-root">
            {/* ── Left panel ──────────────────────────────────────────────────────── */}
            <div className="auth-left fp-left">
                <div className="auth-left-glow" />
                <div className="auth-left-glow2" />
                <Particles />

                <div className="auth-brand">
                    <BookOpen size={20} />
                    <span>ESTUDY</span>
                </div>

                <div className="fp-left-center">
                    <OrbitIcon />
                    <h2 className="auth-left-title fp-left-title">{lc.title}</h2>
                    <p className="auth-left-sub">{lc.sub}</p>
                    <div className="auth-login-perks fp-perks">
                        {lc.points.map((p) => (
                            <div key={p} className="auth-perk">
                                <span className="auth-perk-dot" />
                                <span>{p}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="fp-left-footer">
                    <ShieldCheck size={14} />
                    <span>Защита от несанкционированного доступа</span>
                </div>
            </div>

            {/* ── Right panel ─────────────────────────────────────────────────────── */}
            <div className="auth-right fp-right">
                <div className="auth-form-wrap fp-form-wrap">

                    {/* ── Back link ── */}
                    <Link to="/login" className="fp-back-link">
                        <ArrowLeft size={15} />
                        Назад ко входу
                    </Link>

                    {/* ══ Phase: email ══════════════════════════════════════════════════ */}
                    {phase === 'email' && (
                        <div className="fp-panel fp-panel--enter">
                            <div className="fp-phase-icon">
                                <Mail size={22} />
                            </div>
                            <h1 className="auth-title">Забыл пароль?</h1>
                            <p className="auth-subtitle">
                                Введи email — пришлём ссылку для сброса.
                            </p>

                            <form className="auth-form fp-form" onSubmit={handleEmailSubmit} noValidate>
                                {serverError && (
                                    <div className="auth-server-error">{serverError}</div>
                                )}
                                <div className="auth-field">
                                    <label className="auth-label" htmlFor="fp-email">Email</label>
                                    <div className={`auth-input-wrap ${emailError ? 'error' : ''}`}>
                                        <Mail size={14} className="auth-input-icon" />
                                        <input
                                            ref={emailRef}
                                            id="fp-email"
                                            className="auth-input"
                                            type="email"
                                            placeholder="напр. aliya@mail.com"
                                            value={email}
                                            onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
                                            autoComplete="email"
                                        />
                                    </div>
                                    {emailError && <p className="auth-error">{emailError}</p>}
                                </div>

                                <button type="submit" className="auth-submit fp-submit" disabled={loading}>
                                    {loading
                                        ? <><Loader2 size={16} className="auth-spin" /> Отправляю...</>
                                        : <><Mail size={16} /> Получить ссылку</>}
                                </button>
                            </form>

                            <p className="auth-switch">
                                Вспомнил пароль?{' '}
                                <Link to="/login" className="auth-link auth-link-bold">Войти</Link>
                            </p>
                        </div>
                    )}

                    {/* ══ Phase: sent ═══════════════════════════════════════════════════ */}
                    {phase === 'sent' && (
                        <div className="fp-panel fp-panel--enter">
                            <SuccessIcon />
                            <h1 className="auth-title fp-sent-title">Проверь почту</h1>
                            <p className="auth-subtitle">Мы отправили письмо на</p>
                            <div className="fp-email-chip">
                                <Mail size={13} />
                                <span>{email}</span>
                            </div>
                            <p className="fp-sent-hint">
                                Перейди по ссылке из письма. Ссылка действует <strong>1 час</strong>.
                            </p>
                            <ResendButton email={email} />
                            <div className="fp-sent-steps">
                                {['Открой почту', 'Найди письмо от EduFuture', 'Нажми «Сбросить пароль»'].map((s, i) => (
                                    <div key={s} className="fp-sent-step">
                                        <span className="fp-sent-step-num">{i + 1}</span>
                                        <span>{s}</span>
                                    </div>
                                ))}
                            </div>
                            <button type="button" className="fp-ghost-btn" onClick={() => setPhase('email')}>
                                Изменить email
                            </button>
                        </div>
                    )}

                    {/* ══ Phase: reset ══════════════════════════════════════════════════ */}
                    {phase === 'reset' && (
                        <div className="fp-panel fp-panel--enter">
                            <div className="fp-phase-icon fp-phase-icon--green">
                                <Lock size={22} />
                            </div>
                            <h1 className="auth-title">Новый пароль</h1>
                            <p className="auth-subtitle">Придумай надёжный пароль для аккаунта.</p>

                            <form className="auth-form fp-form" onSubmit={handleResetSubmit} noValidate>
                                {serverError && (
                                    <div className="auth-server-error">{serverError}</div>
                                )}

                                <div className="auth-field">
                                    <label className="auth-label" htmlFor="fp-newpass">Новый пароль</label>
                                    <div className={`auth-input-wrap ${passErrors.pass ? 'error' : ''}`}>
                                        <Lock size={14} className="auth-input-icon" />
                                        <input
                                            id="fp-newpass"
                                            className="auth-input"
                                            type={showPass ? 'text' : 'password'}
                                            placeholder="Минимум 8 символов"
                                            value={newPassword}
                                            onChange={(e) => { setNewPassword(e.target.value); setPassErrors((p) => ({ ...p, pass: '' })) }}
                                            autoComplete="new-password"
                                        />
                                        <button type="button" className="auth-eye" onClick={() => setShowPass((v) => !v)}
                                            aria-label={showPass ? 'Скрыть' : 'Показать'}>
                                            {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </button>
                                    </div>
                                    {newPassword.length > 0 && <StrengthBar password={newPassword} />}
                                    {passErrors.pass && <p className="auth-error">{passErrors.pass}</p>}
                                </div>

                                <div className="auth-field">
                                    <label className="auth-label" htmlFor="fp-confirm">Повтори пароль</label>
                                    <div className={`auth-input-wrap ${passErrors.confirm ? 'error' : ''}`}>
                                        <Lock size={14} className="auth-input-icon" />
                                        <input
                                            id="fp-confirm"
                                            className="auth-input"
                                            type={showConfirm ? 'text' : 'password'}
                                            placeholder="Повтори новый пароль"
                                            value={confirmPassword}
                                            onChange={(e) => { setConfirmPassword(e.target.value); setPassErrors((p) => ({ ...p, confirm: '' })) }}
                                            autoComplete="new-password"
                                        />
                                        <button type="button" className="auth-eye" onClick={() => setShowConfirm((v) => !v)}
                                            aria-label={showConfirm ? 'Скрыть' : 'Показать'}>
                                            {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </button>
                                    </div>
                                    {passErrors.confirm && <p className="auth-error">{passErrors.confirm}</p>}
                                </div>

                                <button type="submit" className="auth-submit fp-submit fp-submit--green" disabled={loading}>
                                    {loading
                                        ? <><Loader2 size={16} className="auth-spin" /> Сохраняю...</>
                                        : <><ShieldCheck size={16} /> Сохранить пароль</>}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* ══ Phase: done ═══════════════════════════════════════════════════ */}
                    {phase === 'done' && (
                        <div className="fp-panel fp-panel--enter fp-panel--done">
                            <div className="fp-done-icon">
                                <div className="fp-done-ring" />
                                <ShieldCheck size={36} strokeWidth={1.5} />
                            </div>
                            <h1 className="auth-title fp-done-title">Пароль изменён!</h1>
                            <p className="fp-done-sub">
                                Твой аккаунт защищён. Все предыдущие сессии завершены.
                            </p>
                            <button
                                type="button"
                                className="auth-submit fp-submit fp-submit--green"
                                onClick={() => navigate('/login')}
                            >
                                <KeyRound size={16} /> Войти с новым паролем
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}
