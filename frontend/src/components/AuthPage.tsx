import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
    Building2,
    BookOpen,
    Check,
    Eye,
    EyeOff,
    GraduationCap,
    Loader2,
    Lock,
    Mail,
    School,
    User,
    Users,
} from 'lucide-react'

// ─── Steps config (register flow) ─────────────────────────────────────────────
const REGISTER_STEPS = [
    { n: 1, label: 'Создай аккаунт' },
    { n: 2, label: 'Настрой профиль' },
    { n: 3, label: 'Выбери курс' },
]

// ─── Google SVG icon ──────────────────────────────────────────────────────────
function GoogleIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        </svg>
    )
}

// ─── GitHub SVG icon ──────────────────────────────────────────────────────────
function GithubIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
    )
}

// ─── Auth Page ────────────────────────────────────────────────────────────────
interface AuthPageProps {
    mode?: 'login' | 'register'
    role?: 'student' | 'teacher' | 'parent' | 'institution'
}

const ROLE_META = {
    student: {
        label: 'Ученик',
        dashboard: '/dashboard',
        accent: '#6366f1',
        softAccent: 'rgba(99, 102, 241, .25)',
        Icon: GraduationCap,
        registerTitle: 'Начни учиться вместе с нами',
        registerSubtitle: 'Выполни три простых шага, чтобы зарегистрироваться и начать свой путь.',
        loginTitle: 'С возвращением!',
        loginSubtitle: 'Войди в аккаунт и продолжи обучение с того места, где остановился.',
        points: ['Персональная траектория', 'Турниры и достижения', 'Сертификаты по окончании'],
    },
    teacher: {
        label: 'Учитель',
        dashboard: '/teacher/dashboard',
        accent: '#43c38d',
        softAccent: 'rgba(67, 195, 141, .22)',
        Icon: School,
        registerTitle: 'Создай учительский кабинет',
        registerSubtitle: 'Запусти свои курсы, управляй учениками и отслеживай прогресс в одном месте.',
        loginTitle: 'Добро пожаловать, преподаватель',
        loginSubtitle: 'Войди в кабинет учителя и продолжай работу с курсами и классами.',
        points: ['Конструктор курсов', 'Аналитика классов', 'Live-сессии и чат'],
    },
    parent: {
        label: 'Родитель',
        dashboard: '/dashboard',
        accent: '#f59e0b',
        softAccent: 'rgba(245, 158, 11, .2)',
        Icon: Users,
        registerTitle: 'Контролируй прогресс ребёнка',
        registerSubtitle: 'Создай аккаунт родителя, чтобы следить за успеваемостью и получать уведомления.',
        loginTitle: 'С возвращением, родитель',
        loginSubtitle: 'Войди и получай актуальную информацию по обучению ребёнка.',
        points: ['Отчёты по успеваемости', 'Push-уведомления', 'Достижения ребёнка'],
    },
    institution: {
        label: 'Учреждение',
        dashboard: '/dashboard/institution_admin',
        accent: '#ef4444',
        softAccent: 'rgba(239, 68, 68, .2)',
        Icon: Building2,
        registerTitle: 'Подключите учреждение к EduFuture',
        registerSubtitle: 'Создайте аккаунт организации для управления учебным процессом и аналитикой.',
        loginTitle: 'Вход для учреждения',
        loginSubtitle: 'Авторизуйтесь, чтобы управлять пользователями, курсами и отчётами.',
        points: ['Управление филиалами', 'Ролевая модель', 'Экспорт отчётов'],
    },
} as const

const ROLE_ORDER: Array<keyof typeof ROLE_META> = ['student', 'teacher', 'parent', 'institution']

export function AuthPage({ mode = 'register', role = 'student' }: AuthPageProps) {
    const navigate = useNavigate()
    const isLogin = mode === 'login'
    const roleMeta = ROLE_META[role]
    const RoleIcon = roleMeta.Icon

    // form state
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [oauthLoading, setOauthLoading] = useState<'google' | 'github' | null>(null)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [step] = useState(1)

    // ── Validation ──────────────────────────────────────────────────────────────
    const validate = () => {
        const e: Record<string, string> = {}
        if (!isLogin && !firstName.trim()) e.firstName = 'Введи имя'
        if (!isLogin && !lastName.trim()) e.lastName = 'Введи фамилию'
        if (!email.trim()) e.email = 'Введи email'
        else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Некорректный email'
        if (!password) e.password = 'Введи пароль'
        else if (password.length < 8) e.password = 'Минимум 8 символов'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    // ── Submit ──────────────────────────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return
        setLoading(true)
        await new Promise((r) => setTimeout(r, 1400))
        setLoading(false)
        localStorage.setItem('estudy-role', role)
        navigate(roleMeta.dashboard)
    }

    // ── OAuth mock ──────────────────────────────────────────────────────────────
    const handleOAuth = async (provider: 'google' | 'github') => {
        setOauthLoading(provider)
        await new Promise((r) => setTimeout(r, 1200))
        setOauthLoading(null)
        localStorage.setItem('estudy-role', role)
        navigate(roleMeta.dashboard)
    }

    const strength = password.length === 0 ? 0
        : password.length < 6 ? 1
            : password.length < 10 ? 2
                : 3

    const strengthLabel = ['', 'Слабый', 'Средний', 'Надёжный'][strength]
    const strengthColor = ['', '#ef4444', '#f59e0b', '#22c55e'][strength]

    return (
        <div
            className="auth-root"
            style={{
                '--auth-accent': roleMeta.accent,
                '--auth-accent-soft': roleMeta.softAccent,
            } as React.CSSProperties}
        >

            {/* ── Left panel ───────────────────────────────────────────────────── */}
            <div className="auth-left">
                <div className="auth-left-glow" />
                <div className="auth-left-glow2" />

                <div className="auth-brand">
                    <BookOpen size={20} />
                    <span>ESTUDY</span>
                </div>

                <div className="auth-role-badge-inline">
                    <RoleIcon size={14} />
                    <span>{roleMeta.label}</span>
                </div>

                <div className="auth-left-body">
                    <h2 className="auth-left-title">
                        {isLogin
                            ? roleMeta.loginTitle
                            : roleMeta.registerTitle}
                    </h2>
                    <p className="auth-left-sub">
                        {isLogin
                            ? roleMeta.loginSubtitle
                            : roleMeta.registerSubtitle}
                    </p>

                    {!isLogin && (
                        <div className="auth-steps">
                            {REGISTER_STEPS.map((s) => (
                                <div
                                    key={s.n}
                                    className={`auth-step ${s.n === step ? 'active' : ''} ${s.n < step ? 'done' : ''}`}
                                >
                                    <span className="auth-step-num">
                                        {s.n < step ? <Check size={12} /> : s.n}
                                    </span>
                                    <span className="auth-step-label">{s.label}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {isLogin && (
                        <div className="auth-login-perks">
                            {roleMeta.points.map((p) => (
                                <div key={p} className="auth-perk">
                                    <span className="auth-perk-dot" />
                                    <span>{p}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {!isLogin && (
                    <div className="auth-role-points">
                        {roleMeta.points.map((point) => (
                            <span key={point} className="auth-role-point">{point}</span>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Right panel ──────────────────────────────────────────────────── */}
            <div className="auth-right">
                <div className="auth-form-wrap">
                    <div className="auth-role-tabs" role="tablist" aria-label="Выбор роли">
                        {ROLE_ORDER.map((r) => (
                            <Link
                                key={r}
                                role="tab"
                                aria-selected={r === role}
                                className={r === role ? 'auth-role-tab active' : 'auth-role-tab'}
                                to={`/${isLogin ? 'login' : 'register'}/${r}`}
                            >
                                {ROLE_META[r].label}
                            </Link>
                        ))}
                    </div>

                    <h1 className="auth-title">
                        {isLogin ? `Вход: ${roleMeta.label}` : `Регистрация: ${roleMeta.label}`}
                    </h1>
                    <p className="auth-subtitle">
                        {isLogin
                            ? 'Введи свои данные для входа.'
                            : 'Введи личные данные для создания аккаунта.'}
                    </p>

                    {/* OAuth buttons */}
                    <div className="auth-oauth">
                        <button
                            type="button"
                            className="auth-oauth-btn"
                            onClick={() => handleOAuth('google')}
                            disabled={!!oauthLoading}
                        >
                            {oauthLoading === 'google'
                                ? <Loader2 size={16} className="auth-spin" />
                                : <GoogleIcon />}
                            Google
                        </button>
                        <button
                            type="button"
                            className="auth-oauth-btn"
                            onClick={() => handleOAuth('github')}
                            disabled={!!oauthLoading}
                        >
                            {oauthLoading === 'github'
                                ? <Loader2 size={16} className="auth-spin" />
                                : <GithubIcon />}
                            GitHub
                        </button>
                    </div>

                    <div className="auth-or">
                        <span className="auth-or-line" />
                        <span className="auth-or-text">или</span>
                        <span className="auth-or-line" />
                    </div>

                    {/* Form */}
                    <form className="auth-form" onSubmit={handleSubmit} noValidate>

                        {/* Name row (register only) */}
                        {!isLogin && (
                            <div className="auth-row2">
                                <div className="auth-field">
                                    <label className="auth-label">Имя</label>
                                    <div className={`auth-input-wrap ${errors.firstName ? 'error' : ''}`}>
                                        <User size={14} className="auth-input-icon" />
                                        <input
                                            className="auth-input"
                                            placeholder="напр. Алия"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            autoComplete="given-name"
                                        />
                                    </div>
                                    {errors.firstName && <p className="auth-error">{errors.firstName}</p>}
                                </div>
                                <div className="auth-field">
                                    <label className="auth-label">Фамилия</label>
                                    <div className={`auth-input-wrap ${errors.lastName ? 'error' : ''}`}>
                                        <User size={14} className="auth-input-icon" />
                                        <input
                                            className="auth-input"
                                            placeholder="напр. Карибаева"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            autoComplete="family-name"
                                        />
                                    </div>
                                    {errors.lastName && <p className="auth-error">{errors.lastName}</p>}
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div className="auth-field">
                            <label className="auth-label">Email</label>
                            <div className={`auth-input-wrap ${errors.email ? 'error' : ''}`}>
                                <Mail size={14} className="auth-input-icon" />
                                <input
                                    className="auth-input"
                                    type="email"
                                    placeholder="напр. aliya@mail.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                />
                            </div>
                            {errors.email && <p className="auth-error">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div className="auth-field">
                            <label className="auth-label">Пароль</label>
                            <div className={`auth-input-wrap ${errors.password ? 'error' : ''}`}>
                                <Lock size={14} className="auth-input-icon" />
                                <input
                                    className="auth-input"
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="Минимум 8 символов"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                                />
                                <button
                                    type="button"
                                    className="auth-eye"
                                    onClick={() => setShowPass((p) => !p)}
                                    aria-label={showPass ? 'Скрыть пароль' : 'Показать пароль'}
                                >
                                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                                </button>
                            </div>
                            {/* Strength meter */}
                            {!isLogin && password.length > 0 && (
                                <div className="auth-strength">
                                    <div className="auth-strength-bars">
                                        {[1, 2, 3].map((i) => (
                                            <div
                                                key={i}
                                                className="auth-strength-bar"
                                                style={{ background: i <= strength ? strengthColor : 'rgba(255,255,255,0.1)' }}
                                            />
                                        ))}
                                    </div>
                                    <span style={{ color: strengthColor }}>{strengthLabel}</span>
                                </div>
                            )}
                            {errors.password && <p className="auth-error">{errors.password}</p>}
                            {!errors.password && isLogin && (
                                <p className="auth-hint">
                                    <Link to="/forgot" className="auth-link">Забыл пароль?</Link>
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={loading}
                        >
                            {loading
                                ? <><Loader2 size={16} className="auth-spin" /> {isLogin ? 'Вхожу...' : 'Создаю аккаунт...'}</>
                                : isLogin ? 'Войти' : 'Зарегистрироваться'}
                        </button>

                    </form>

                    {/* Switch mode */}
                    <p className="auth-switch">
                        {isLogin
                            ? <>Нет аккаунта?{' '}<Link to={`/register/${role}`} className="auth-link auth-link-bold">Зарегистрируйся</Link></>
                            : <>Уже есть аккаунт?{' '}<Link to={`/login/${role}`} className="auth-link auth-link-bold">Войти</Link></>}
                    </p>

                </div>
            </div>
        </div>
    )
}
