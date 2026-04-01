import { useState, useRef } from 'react'
import {
    Bell,
    Check,
    ChevronRight,
    CreditCard,
    Globe,
    Mail,
    Monitor,
    Moon,
    Plus,
    Settings,
    ShieldCheck,
    Star,
    Sun,
    Trash2,
    Upload,
    User,
    Zap,
} from 'lucide-react'
import { CourseShellLayout } from './CourseShellLayout'
import { TeacherShellLayout } from './TeacherShellLayout'
import type { Language } from '../i18n/translations'
import type {
    NotificationToggle,
    PaymentMethod,
    ReminderDay,
    SettingsSection,
} from '../data/settingsData'
import {
    initialEmailToggles,
    initialPaymentMethods,
    initialPushToggles,
    initialReminderDays,
    initialTransactions,
} from '../data/settingsData'

// ─── Props ───────────────────────────────────────────────────────────────────

interface SettingsPageProps {
    language: Language
    onLanguageChange: (lang: Language) => void
    variant?: 'student' | 'teacher'
}

// ─── Toggle switch ────────────────────────────────────────────────────────────

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={value}
            onClick={() => onChange(!value)}
            className={`stg-toggle ${value ? 'on' : ''}`}
        >
            <span className="stg-toggle-knob" />
        </button>
    )
}

// ─── Section nav card ─────────────────────────────────────────────────────────

interface NavCardProps {
    icon: React.ReactNode
    label: string
    active: boolean
    color: string
    onClick: () => void
}

function NavCard({ icon, label, active, color, onClick }: NavCardProps) {
    return (
        <button
            type="button"
            className={`stg-nav-card ${active ? 'active' : ''}`}
            style={{ '--card-color': color } as React.CSSProperties}
            onClick={onClick}
        >
            <span className="stg-nav-icon">{icon}</span>
            <span className="stg-nav-label">{label}</span>
            {active && <ChevronRight size={14} className="stg-nav-arrow" />}
        </button>
    )
}

// ─── Section: General ────────────────────────────────────────────────────────

type Theme = 'light' | 'dark' | 'system'

function GeneralSection() {
    const [theme, setTheme] = useState<Theme>('light')
    const [fontSize, setFontSize] = useState(14)
    const [saved, setSaved] = useState(false)

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <div className="stg-section">
            <div className="stg-section-header">
                <h2 className="stg-section-title">Общие настройки</h2>
                <p className="stg-section-sub">Внешний вид, язык и региональные параметры</p>
            </div>

            <div className="stg-group">
                <h3 className="stg-group-title">Тема оформления</h3>
                <div className="stg-theme-cards">
                    {([
                        { id: 'light', icon: <Sun size={20} />, label: 'Светлая' },
                        { id: 'dark', icon: <Moon size={20} />, label: 'Тёмная' },
                        { id: 'system', icon: <Monitor size={20} />, label: 'Системная' },
                    ] as { id: Theme; icon: React.ReactNode; label: string }[]).map((t) => (
                        <button
                            key={t.id}
                            type="button"
                            className={`stg-theme-card ${theme === t.id ? 'active' : ''}`}
                            onClick={() => setTheme(t.id)}
                        >
                            <span className="stg-theme-icon">{t.icon}</span>
                            <span className="stg-theme-label">{t.label}</span>
                            {theme === t.id && <Check size={13} className="stg-theme-check" />}
                        </button>
                    ))}
                </div>
            </div>

            <div className="stg-group">
                <h3 className="stg-group-title">Регион и язык</h3>
                <div className="stg-form-grid">
                    <div className="stg-field">
                        <label className="stg-label">Язык интерфейса</label>
                        <select className="stg-select">
                            <option>Русский</option>
                            <option>English</option>
                            <option>Қазақша</option>
                        </select>
                    </div>
                    <div className="stg-field">
                        <label className="stg-label">Часовой пояс</label>
                        <select className="stg-select">
                            <option>UTC+5 — Астана</option>
                            <option>UTC+3 — Москва</option>
                            <option>UTC+6 — Алматы</option>
                        </select>
                    </div>
                    <div className="stg-field">
                        <label className="stg-label">Формат даты</label>
                        <select className="stg-select">
                            <option>ДД.ММ.ГГГГ</option>
                            <option>MM/DD/YYYY</option>
                            <option>YYYY-MM-DD</option>
                        </select>
                    </div>
                    <div className="stg-field">
                        <label className="stg-label">Валюта</label>
                        <select className="stg-select">
                            <option>₸ Тенге (KZT)</option>
                            <option>₽ Рубль (RUB)</option>
                            <option>$ Доллар (USD)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="stg-group">
                <h3 className="stg-group-title">Размер шрифта</h3>
                <div className="stg-font-row">
                    <span className="stg-font-small">A</span>
                    <input
                        type="range"
                        min={12}
                        max={20}
                        step={1}
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="stg-range"
                    />
                    <span className="stg-font-large">A</span>
                    <span className="stg-font-val">{fontSize}px</span>
                </div>
            </div>

            <div className="stg-save-row">
                <button type="button" className="stg-save-btn" onClick={handleSave}>
                    {saved ? <><Check size={14} /> Сохранено!</> : 'Сохранить изменения'}
                </button>
            </div>
        </div>
    )
}

// ─── Section: User Profile ───────────────────────────────────────────────────

function ProfileSection() {
    const [avatar, setAvatar] = useState<string | null>(null)
    const [name, setName] = useState('Martin Nel')
    const [username, setUsername] = useState('martin_nel')
    const [bio, setBio] = useState('Frontend разработчик, учусь UX/UI дизайну.')
    const [website, setWebsite] = useState('')
    const [linkedin, setLinkedin] = useState('')
    const [saved, setSaved] = useState(false)
    const fileRef = useRef<HTMLInputElement>(null)

    const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const url = URL.createObjectURL(file)
        setAvatar(url)
    }

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <div className="stg-section">
            <div className="stg-section-header">
                <h2 className="stg-section-title">Профиль пользователя</h2>
                <p className="stg-section-sub">Ваши личные данные и публичная информация</p>
            </div>

            <div className="stg-group">
                <h3 className="stg-group-title">Фото профиля</h3>
                <div className="stg-avatar-row">
                    <div className="stg-avatar">
                        {avatar ? (
                            <img src={avatar} alt="Avatar" className="stg-avatar-img" />
                        ) : (
                            <span className="stg-avatar-initials">MN</span>
                        )}
                    </div>
                    <div className="stg-avatar-btns">
                        <button type="button" className="stg-upload-btn" onClick={() => fileRef.current?.click()}>
                            <Upload size={14} /> Загрузить фото
                        </button>
                        {avatar && (
                            <button type="button" className="stg-remove-btn" onClick={() => setAvatar(null)}>
                                <Trash2 size={14} /> Удалить
                            </button>
                        )}
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleAvatar}
                        />
                    </div>
                    <p className="stg-avatar-hint">JPG, PNG или GIF, не более 5 МБ</p>
                </div>
            </div>

            <div className="stg-group">
                <h3 className="stg-group-title">Основная информация</h3>
                <div className="stg-form-grid">
                    <div className="stg-field">
                        <label className="stg-label">Отображаемое имя</label>
                        <input
                            className="stg-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ваше имя"
                        />
                    </div>
                    <div className="stg-field">
                        <label className="stg-label">Имя пользователя</label>
                        <div className="stg-input-prefix">
                            <span>@</span>
                            <input
                                className="stg-input"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="username"
                            />
                        </div>
                    </div>
                </div>
                <div className="stg-field stg-field-full">
                    <label className="stg-label">О себе</label>
                    <textarea
                        className="stg-textarea"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Расскажите немного о себе..."
                        rows={3}
                    />
                    <span className="stg-char-count">{bio.length}/160</span>
                </div>
            </div>

            <div className="stg-group">
                <h3 className="stg-group-title">Социальные сети</h3>
                <div className="stg-form-grid">
                    <div className="stg-field">
                        <label className="stg-label">Веб-сайт</label>
                        <input
                            className="stg-input"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            placeholder="https://yoursite.com"
                            type="url"
                        />
                    </div>
                    <div className="stg-field">
                        <label className="stg-label">LinkedIn</label>
                        <input
                            className="stg-input"
                            value={linkedin}
                            onChange={(e) => setLinkedin(e.target.value)}
                            placeholder="linkedin.com/in/username"
                        />
                    </div>
                </div>
            </div>

            <div className="stg-group">
                <h3 className="stg-group-title">Приватность профиля</h3>
                <div className="stg-privacy-cards">
                    {(['Публичный', 'Только для друзей', 'Приватный'] as const).map((opt) => (
                        <label key={opt} className="stg-privacy-card">
                            <input type="radio" name="privacy" defaultChecked={opt === 'Публичный'} />
                            <span>{opt}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div className="stg-save-row">
                <button type="button" className="stg-save-btn" onClick={handleSave}>
                    {saved ? <><Check size={14} /> Сохранено!</> : 'Сохранить изменения'}
                </button>
            </div>
        </div>
    )
}

// ─── Section: Email Notifications ────────────────────────────────────────────

function TogglesGroup({
    title,
    subtitle,
    toggles,
    onChange,
}: {
    title: string
    subtitle?: string
    toggles: NotificationToggle[]
    onChange: (id: string, val: boolean) => void
}) {
    return (
        <div className="stg-group">
            <h3 className="stg-group-title">{title}</h3>
            {subtitle && <p className="stg-group-sub">{subtitle}</p>}
            <div className="stg-toggle-list">
                {toggles.map((t) => (
                    <div key={t.id} className="stg-toggle-row">
                        <div className="stg-toggle-info">
                            <span className="stg-toggle-label">{t.label}</span>
                            {t.description && <span className="stg-toggle-desc">{t.description}</span>}
                        </div>
                        <Toggle value={t.value} onChange={(v) => onChange(t.id, v)} />
                    </div>
                ))}
            </div>
        </div>
    )
}

function EmailSection() {
    const [email, setEmail] = useState(initialEmailToggles)
    const [push, setPush] = useState(initialPushToggles)

    const updateEmail = (id: string, val: boolean) =>
        setEmail((prev) => prev.map((t) => (t.id === id ? { ...t, value: val } : t)))
    const updatePush = (id: string, val: boolean) =>
        setPush((prev) => prev.map((t) => (t.id === id ? { ...t, value: val } : t)))

    return (
        <div className="stg-section">
            <div className="stg-section-header">
                <h2 className="stg-section-title">Email-уведомления</h2>
                <p className="stg-section-sub">Управляйте тем, когда и как мы вам пишем</p>
            </div>
            <TogglesGroup
                title="Email-письма"
                subtitle="Когда присылать письма:"
                toggles={email}
                onChange={updateEmail}
            />
            <TogglesGroup
                title="Push-уведомления"
                subtitle="Уведомления в браузере и приложении:"
                toggles={push}
                onChange={updatePush}
            />
        </div>
    )
}

// ─── Section: Subscription ───────────────────────────────────────────────────

function SubscriptionSection() {
    const [plan] = useState<'free' | 'pro'>('free')

    const features = [
        { label: 'Доступ к базовым курсам', free: true, pro: true },
        { label: 'Безлимитные ресурсы', free: false, pro: true },
        { label: 'Сертификаты по курсам', free: false, pro: true },
        { label: 'Приоритетная поддержка', free: false, pro: true },
        { label: 'Офлайн просмотр', free: false, pro: true },
        { label: '5 ГБ облачного хранилища', free: false, pro: true },
        { label: 'ИИ-ассистент без ограничений', free: false, pro: true },
    ]

    return (
        <div className="stg-section">
            <div className="stg-section-header">
                <h2 className="stg-section-title">Подписка</h2>
                <p className="stg-section-sub">Управление вашим тарифным планом</p>
            </div>

            <div className="stg-plan-cards">
                <div className={`stg-plan-card ${plan === 'free' ? 'current' : ''}`}>
                    <div className="stg-plan-top">
                        <span className="stg-plan-icon free"><Globe size={20} /></span>
                        <div>
                            <div className="stg-plan-name">Бесплатный</div>
                            <div className="stg-plan-price">₸ 0 / мес</div>
                        </div>
                        {plan === 'free' && <span className="stg-plan-badge">Текущий</span>}
                    </div>
                </div>

                <div className={`stg-plan-card pro ${plan === 'pro' ? 'current' : ''}`}>
                    <div className="stg-plan-top">
                        <span className="stg-plan-icon pro"><Zap size={20} /></span>
                        <div>
                            <div className="stg-plan-name">Pro</div>
                            <div className="stg-plan-price">₸ 4 900 / мес</div>
                        </div>
                        {plan === 'pro' && <span className="stg-plan-badge">Текущий</span>}
                    </div>
                    <div className="stg-plan-yearly">или ₸ 49 000 / год — экономия 17%</div>
                </div>
            </div>

            <div className="stg-group">
                <h3 className="stg-group-title">Сравнение тарифов</h3>
                <div className="stg-features-table">
                    <div className="stg-features-head">
                        <span />
                        <span>Бесплатный</span>
                        <span>Pro</span>
                    </div>
                    {features.map((f) => (
                        <div key={f.label} className="stg-features-row">
                            <span>{f.label}</span>
                            <span>{f.free ? <Check size={14} className="stg-check-yes" /> : <span className="stg-check-no">—</span>}</span>
                            <span><Check size={14} className="stg-check-yes" /></span>
                        </div>
                    ))}
                </div>
            </div>

            {plan === 'free' && (
                <div className="stg-upgrade-banner">
                    <Star size={22} />
                    <div>
                        <p className="stg-upgrade-title">Получите Pro уже сегодня</p>
                        <p className="stg-upgrade-desc">Откройте все возможности платформы с подпиской Pro</p>
                    </div>
                    <button type="button" className="stg-upgrade-btn">Перейти на Pro</button>
                </div>
            )}
        </div>
    )
}

// ─── Section: Payment ────────────────────────────────────────────────────────

function cardLabel(pm: PaymentMethod): string {
    if (pm.type === 'paypal') return `PayPal · ${pm.email}`
    const brand = pm.type === 'visa' ? 'Visa' : 'Mastercard'
    return `${brand} **** ${pm.last4} · ${pm.expiry}`
}

function CardIcon({ type }: { type: PaymentMethod['type'] }) {
    const colors: Record<PaymentMethod['type'], string> = {
        visa: '#1a1f71',
        mastercard: '#eb001b',
        paypal: '#003087',
        apple: '#000',
    }
    const labels: Record<PaymentMethod['type'], string> = {
        visa: 'VISA',
        mastercard: 'MC',
        paypal: 'PP',
        apple: '',
    }
    return (
        <span
            className="stg-card-icon"
            style={{ background: colors[type], color: '#fff' }}
        >
            {labels[type]}
        </span>
    )
}

function PaymentSection() {
    const [methods, setMethods] = useState<PaymentMethod[]>(initialPaymentMethods)
    const transactions = initialTransactions

    const removeMethod = (id: string) => {
        setMethods((prev) => prev.filter((m) => m.id !== id))
    }
    const setDefault = (id: string) => {
        setMethods((prev) => prev.map((m) => ({ ...m, isDefault: m.id === id })))
    }

    return (
        <div className="stg-section">
            <div className="stg-section-header">
                <h2 className="stg-section-title">Оплата</h2>
                <p className="stg-section-sub">Способы оплаты и история транзакций</p>
            </div>

            <div className="stg-group">
                <div className="stg-group-head-row">
                    <h3 className="stg-group-title">Способы оплаты</h3>
                    <button type="button" className="stg-add-pm-btn"><Plus size={13} /> Добавить</button>
                </div>
                <div className="stg-pm-list">
                    {methods.map((pm) => (
                        <div key={pm.id} className={`stg-pm-row ${pm.isDefault ? 'default' : ''}`}>
                            <CardIcon type={pm.type} />
                            <span className="stg-pm-label">{cardLabel(pm)}</span>
                            {pm.isDefault && <span className="stg-pm-default-badge">По умолчанию</span>}
                            <div className="stg-pm-actions">
                                {!pm.isDefault && (
                                    <button type="button" className="stg-pm-btn" onClick={() => setDefault(pm.id)}>
                                        Сделать основным
                                    </button>
                                )}
                                <button type="button" className="stg-pm-del" onClick={() => removeMethod(pm.id)}>
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="stg-group">
                <h3 className="stg-group-title">История транзакций</h3>
                <div className="stg-tx-table">
                    <div className="stg-tx-head">
                        <span>Дата</span>
                        <span>Описание</span>
                        <span>Сумма</span>
                        <span>Статус</span>
                    </div>
                    {transactions.map((tx) => (
                        <div key={tx.id} className="stg-tx-row">
                            <span className="stg-tx-date">{tx.date}</span>
                            <span className="stg-tx-desc">{tx.description}</span>
                            <span className="stg-tx-amount">{tx.amount}</span>
                            <span className={`stg-tx-status ${tx.status}`}>
                                {tx.status === 'paid' ? 'Оплачено' : tx.status === 'pending' ? 'Ожидание' : 'Ошибка'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ─── Section: Learning Reminder ───────────────────────────────────────────────

function ReminderSection() {
    const [enabled, setEnabled] = useState(true)
    const [time, setTime] = useState('09:00')
    const [goalMinutes, setGoalMinutes] = useState(30)
    const [days, setDays] = useState<ReminderDay[]>(initialReminderDays)
    const [sound, setSound] = useState(true)
    const [saved, setSaved] = useState(false)

    const toggleDay = (id: string) => {
        setDays((prev) => prev.map((d) => (d.id === id ? { ...d, enabled: !d.enabled } : d)))
    }
    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <div className="stg-section">
            <div className="stg-section-header">
                <h2 className="stg-section-title">Напоминания об учёбе</h2>
                <p className="stg-section-sub">Настройте ежедневные напоминания для поддержания привычки</p>
            </div>

            <div className="stg-group">
                <div className="stg-toggle-row stg-main-toggle">
                    <div className="stg-toggle-info">
                        <span className="stg-toggle-label">Включить напоминания</span>
                        <span className="stg-toggle-desc">Получать уведомления о времени учёбы</span>
                    </div>
                    <Toggle value={enabled} onChange={setEnabled} />
                </div>
            </div>

            <div className={`stg-reminder-body ${enabled ? '' : 'disabled'}`}>
                <div className="stg-group">
                    <h3 className="stg-group-title">Время напоминания</h3>
                    <div className="stg-time-picker">
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="stg-time-input"
                            disabled={!enabled}
                        />
                        <span className="stg-time-hint">Ежедневно в выбранное время</span>
                    </div>
                </div>

                <div className="stg-group">
                    <h3 className="stg-group-title">Дни недели</h3>
                    <div className="stg-day-chips">
                        {days.map((d) => (
                            <button
                                key={d.id}
                                type="button"
                                disabled={!enabled}
                                className={`stg-day-chip ${d.enabled ? 'active' : ''}`}
                                onClick={() => toggleDay(d.id)}
                            >
                                {d.short}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="stg-group">
                    <h3 className="stg-group-title">Цель по времени</h3>
                    <div className="stg-goal-row">
                        <div className="stg-goal-values">
                            {[15, 30, 45, 60, 90].map((m) => (
                                <button
                                    key={m}
                                    type="button"
                                    disabled={!enabled}
                                    className={`stg-goal-chip ${goalMinutes === m ? 'active' : ''}`}
                                    onClick={() => setGoalMinutes(m)}
                                >
                                    {m} мин
                                </button>
                            ))}
                        </div>
                        <span className="stg-goal-label">в день</span>
                    </div>
                </div>

                <div className="stg-group">
                    <div className="stg-toggle-row">
                        <div className="stg-toggle-info">
                            <span className="stg-toggle-label">Звук уведомления</span>
                            <span className="stg-toggle-desc">Воспроизводить звук при напоминании</span>
                        </div>
                        <Toggle value={sound} onChange={setSound} />
                    </div>
                </div>
            </div>

            <div className="stg-save-row">
                <button type="button" className="stg-save-btn" onClick={handleSave} disabled={!enabled}>
                    {saved ? <><Check size={14} /> Сохранено!</> : 'Сохранить'}
                </button>
            </div>
        </div>
    )
}

// ─── Nav items config ─────────────────────────────────────────────────────────

const NAV_ITEMS: {
    id: SettingsSection
    label: string
    icon: React.ReactNode
    color: string
}[] = [
        { id: 'general', label: 'Общие', icon: <Settings size={18} />, color: '#ef9090' },
        { id: 'profile', label: 'Профиль', icon: <User size={18} />, color: '#f0b775' },
        { id: 'email', label: 'Email-уведомления', icon: <Mail size={18} />, color: '#43c38d' },
        { id: 'subscription', label: 'Подписка', icon: <ShieldCheck size={18} />, color: '#f6c94e' },
        { id: 'payment', label: 'Оплата', icon: <CreditCard size={18} />, color: '#5cc8d4' },
        { id: 'reminder', label: 'Напоминания', icon: <Bell size={18} />, color: '#c48ef0' },
    ]

// ─── Main component ───────────────────────────────────────────────────────────

export function SettingsPage({ language, onLanguageChange, variant = 'student' }: SettingsPageProps) {
    const [active, setActive] = useState<SettingsSection>('general')

    const renderSection = () => {
        switch (active) {
            case 'general': return <GeneralSection />
            case 'profile': return <ProfileSection />
            case 'email': return <EmailSection />
            case 'subscription': return <SubscriptionSection />
            case 'payment': return <PaymentSection />
            case 'reminder': return <ReminderSection />
        }
    }

    const content = (
        <div className="stg-page">
            {/* Left nav */}
            <nav className="stg-nav" aria-label="Settings navigation">
                {NAV_ITEMS.map((item) => (
                    <NavCard
                        key={item.id}
                        icon={item.icon}
                        label={item.label}
                        color={item.color}
                        active={active === item.id}
                        onClick={() => setActive(item.id)}
                    />
                ))}
            </nav>

            {/* Right content */}
            <div className="stg-content">
                {renderSection()}
            </div>
        </div>
    )

    if (variant === 'teacher') {
        return (
            <TeacherShellLayout
                language={language}
                onLanguageChange={onLanguageChange}
                title="Настройки"
                activePage="t-settings"
            >
                {content}
            </TeacherShellLayout>
        )
    }

    return (
        <CourseShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Настройки"
            activePage="settings"
        >
            {content}
        </CourseShellLayout>
    )
}
