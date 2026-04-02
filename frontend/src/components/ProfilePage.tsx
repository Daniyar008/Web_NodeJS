import { useRef, useState } from 'react'
import {
    Building2, Camera, ChevronDown, ChevronRight, Eye, EyeOff,
    Flame, HelpCircle, Lock, Trash2, Upload, UserPlus, X,
} from 'lucide-react'
import type { Language } from '../i18n/translations'
import { COUNTRIES, INST_TYPES, mockProfile } from '../data/profileData'
import { RoleShellLayout } from './RoleShellLayout'
import { uploads } from '../lib/api'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function gradeToLetter(g: number): string {
    if (g >= 95) return 'A+'
    if (g >= 90) return 'A'
    if (g >= 85) return 'A-'
    if (g >= 80) return 'B+'
    if (g >= 75) return 'B'
    if (g >= 70) return 'B-'
    return 'C'
}

// ─── GPA Arc Gauge ────────────────────────────────────────────────────────────

function GpaGauge({ gpa, max }: { gpa: number; max: number }) {
    const r = 50
    const circ = 2 * Math.PI * r          // 314.16
    const arcLen = circ * 0.75            // 270° arc = 235.62
    const filled = arcLen * (gpa / max)
    return (
        <svg viewBox="0 0 120 120" width="130" height="130" aria-label={`GPA ${gpa} из ${max}`}>
            {/* Track */}
            <circle
                cx={60} cy={60} r={r} fill="none" stroke="#e8effa" strokeWidth="9"
                strokeDasharray={`${arcLen} ${circ - arcLen}`} strokeLinecap="round"
                transform="rotate(135 60 60)"
            />
            {/* Progress */}
            <circle
                cx={60} cy={60} r={r} fill="none" stroke="url(#gpaGrad)" strokeWidth="9"
                strokeDasharray={`${filled} ${circ - filled}`} strokeLinecap="round"
                transform="rotate(135 60 60)"
            />
            <defs>
                <linearGradient id="gpaGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#43c38d" />
                    <stop offset="100%" stopColor="#6c8cf8" />
                </linearGradient>
            </defs>
            <text x="60" y="52" textAnchor="middle" fontSize="22" fontWeight="800" fill="#202736">{gpa.toFixed(1)}</text>
            <text x="60" y="68" textAnchor="middle" fontSize="10" fontWeight="700" fill="#9099a8">GPA</text>
            <text x="60" y="82" textAnchor="middle" fontSize="9" fill="#b0bac8">из {max.toFixed(1)}</text>
        </svg>
    )
}

// ─── Toggle Row ───────────────────────────────────────────────────────────────

function ToggleRow({
    label, sublabel, value, onChange,
}: { label: string; sublabel?: string; value: boolean; onChange: () => void }) {
    return (
        <div className="profile-toggle-row">
            <div>
                <span className="profile-toggle-label">{label}</span>
                {sublabel && <span className="profile-toggle-sub">{sublabel}</span>}
            </div>
            <button
                type="button" role="switch" aria-checked={value} aria-label={label}
                className={value ? 'toggle-switch on' : 'toggle-switch'}
                onClick={onChange}
            >
                <span className="toggle-knob" />
            </button>
        </div>
    )
}

// ─── Main component ───────────────────────────────────────────────────────────

type ProfileSettingsTab = 'personal' | 'progress' | 'institution' | 'notifications' | 'privacy'

type Props = { language: Language; onLanguageChange: (l: Language) => void }

export function ProfilePage({ language, onLanguageChange }: Props) {
    const profile = mockProfile

    // Personal
    const [displayName, setDisplayName] = useState(profile.displayName)
    const [country, setCountry] = useState(profile.country)
    const [avatar, setAvatar] = useState(profile.avatar)
    const [saved, setSaved] = useState(false)
    const [showPwForm, setShowPwForm] = useState(false)
    const [currentPw, setCurrentPw] = useState('')
    const [newPw, setNewPw] = useState('')
    const [confirmPw, setConfirmPw] = useState('')
    const [showPw, setShowPw] = useState(false)

    // Progress
    const [expandedCourse, setExpandedCourse] = useState<string | null>(null)
    const [tab, setTab] = useState<ProfileSettingsTab>('personal')

    // Institution
    const [showInstModal, setShowInstModal] = useState(false)
    const [changeReqSent, setChangeReqSent] = useState(profile.institution.pending)
    const [newInstName, setNewInstName] = useState('')
    const [newInstCity, setNewInstCity] = useState('')
    const [instDocName, setInstDocName] = useState<string | null>(null)
    const [instMessage, setInstMessage] = useState('')

    // Notifications
    const [notifChat, setNotifChat] = useState(true)
    const [notifGrades, setNotifGrades] = useState(true)
    const [notifAnnounce, setNotifAnnounce] = useState(false)
    const [notifReminders, setNotifReminders] = useState(true)
    const [notifEmail, setNotifEmail] = useState(false)

    // Privacy
    const [privStudents, setPrivStudents] = useState(true)
    const [privColleagues, setPrivColleagues] = useState(true)
    const [privGroups, setPrivGroups] = useState(true)

    const avatarInputRef = useRef<HTMLInputElement>(null)
    const instDocRef = useRef<HTMLInputElement>(null)

    function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0]
        if (!f) return
        // Show preview immediately
        setAvatar(URL.createObjectURL(f))
        // Upload to server
        uploads.avatar(f).then(({ url }) => setAvatar(url)).catch(() => { /* keep local preview */ })
    }

    function handleSave() {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
    }

    function handleInstSubmit() {
        if (!newInstName.trim()) return
        setChangeReqSent(true)
        setShowInstModal(false)
        setNewInstName(''); setNewInstCity(''); setInstDocName(null); setInstMessage('')
    }

    const weekDots = profile.streakHistory.slice(-7)

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <RoleShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
        >
            <div className="profile-page">

                {/* ══ LEFT CARD ════════════════════════════════════════════════════ */}
                <aside className="profile-left-card">

                    {/* Avatar + name */}
                    <div className="profile-avatar-section">
                        <div className="profile-avatar-wrap">
                            <img src={avatar} alt={displayName} className="profile-avatar-img" />
                            <button
                                type="button" className="profile-avatar-cam"
                                onClick={() => avatarInputRef.current?.click()} aria-label="Сменить фото"
                            >
                                <Camera size={13} />
                            </button>
                            <input
                                ref={avatarInputRef} type="file" accept="image/*"
                                style={{ display: 'none' }} onChange={handleAvatarChange} aria-label="Загрузить фото"
                            />
                        </div>
                        <h3 className="profile-left-name">{displayName}</h3>
                        {profile.isVip && <span className="profile-vip-badge">VIP</span>}
                    </div>

                    {/* Stats */}
                    <div className="profile-stats-row">
                        <div className="profile-stat-box">
                            <span className="profile-stat-num violet">{String(profile.coursesInProgress).padStart(2, '0')}</span>
                            <span className="profile-stat-label">Курсов в работе</span>
                        </div>
                        <div className="profile-stat-sep" />
                        <div className="profile-stat-box">
                            <span className="profile-stat-num green">{String(profile.coursesCompleted).padStart(2, '0')}</span>
                            <span className="profile-stat-label">Завершено</span>
                        </div>
                    </div>

                    {/* Streak mini */}
                    <div className="profile-streak-mini">
                        <div className="profile-streak-mini-header">
                            <Flame size={16} className="profile-streak-flame" />
                            <span><strong>{profile.streak}</strong> дней подряд</span>
                        </div>
                        <div className="profile-streak-mini-dots">
                            {weekDots.map((active, i) => (
                                <div key={i} className={active ? 'profile-streak-dot active' : 'profile-streak-dot'} />
                            ))}
                        </div>
                    </div>

                    {/* Achievements */}
                    <div className="profile-card-section">
                        <p className="profile-card-section-title">Достижения</p>
                        <div className="profile-achievements-row">
                            {profile.achievements.map((a) => (
                                <div key={a.id} className="profile-ach-badge" style={{ background: a.bg }} title={a.title}>
                                    <span role="img" aria-label={a.title}>{a.emoji}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Support */}
                    <div className="profile-card-section">
                        <p className="profile-card-section-title">Поддержка</p>
                        <div className="profile-support-list">
                            <button type="button" className="profile-support-btn">
                                <UserPlus size={14} /> Стать ментором
                            </button>
                            <button type="button" className="profile-support-btn">
                                <HelpCircle size={14} /> Служба поддержки
                            </button>
                            <button type="button" className="profile-support-btn">
                                <UserPlus size={14} /> Пригласить друга
                            </button>
                            <button type="button" className="profile-support-btn danger">
                                <Trash2 size={14} /> Удалить аккаунт
                            </button>
                        </div>
                    </div>
                </aside>

                {/* ══ RIGHT PANEL ══════════════════════════════════════════════════ */}
                <div className="profile-right-panel">
                    <h2 className="profile-settings-title">Настройки профиля</h2>

                    {/* Tabs */}
                    <div className="profile-settings-tabs">
                        {(
                            [
                                ['personal', 'Личные данные'],
                                ['progress', 'Прогресс'],
                                ['institution', 'Учреждение'],
                                ['notifications', 'Уведомления'],
                                ['privacy', 'Приватность'],
                            ] as const
                        ).map(([key, label]) => (
                            <button
                                key={key} type="button"
                                className={tab === key ? 'profile-settings-tab active' : 'profile-settings-tab'}
                                onClick={() => setTab(key)}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* ── Personal Details ───────────────────────────────────────────── */}
                    {tab === 'personal' && (
                        <div className="profile-tab-content">

                            {/* Large avatar */}
                            <div className="profile-personal-avatar-wrap">
                                <div className="profile-personal-avatar">
                                    <img src={avatar} alt={displayName} />
                                    <button
                                        type="button" className="profile-personal-cam"
                                        onClick={() => avatarInputRef.current?.click()} aria-label="Сменить фото"
                                    >
                                        <Camera size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="profile-form-grid">
                                {/* Display name */}
                                <div className="profile-field">
                                    <label className="profile-field-label">Отображаемое имя</label>
                                    <input
                                        className="profile-field-input"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        aria-label="Отображаемое имя"
                                    />
                                </div>

                                {/* Real name (locked) */}
                                <div className="profile-field">
                                    <label className="profile-field-label">
                                        Настоящее имя <Lock size={10} className="profile-lock-icon" />
                                    </label>
                                    <div className="profile-field-locked">
                                        <span>{profile.realName}</span>
                                        <span className="profile-locked-hint">Задаётся при регистрации</span>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="profile-field">
                                    <label className="profile-field-label">Email-адрес</label>
                                    <div className="profile-field-locked">
                                        <span>{profile.email}</span>
                                    </div>
                                </div>

                                {/* Country */}
                                <div className="profile-field">
                                    <label className="profile-field-label">Страна</label>
                                    <select
                                        className="profile-field-select"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        aria-label="Страна"
                                    >
                                        {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Password change */}
                            <button
                                type="button" className="profile-pw-toggle"
                                onClick={() => setShowPwForm((v) => !v)}
                            >
                                <Lock size={14} />
                                Сменить пароль
                                <ChevronDown size={14} className={showPwForm ? 'profile-chevron rotated' : 'profile-chevron'} />
                            </button>

                            {showPwForm && (
                                <div className="profile-pw-form">
                                    <div className="profile-form-grid">
                                        <div className="profile-field">
                                            <label className="profile-field-label">Текущий пароль</label>
                                            <div className="profile-pw-wrap">
                                                <input
                                                    type={showPw ? 'text' : 'password'}
                                                    className="profile-field-input"
                                                    value={currentPw}
                                                    onChange={(e) => setCurrentPw(e.target.value)}
                                                    aria-label="Текущий пароль"
                                                />
                                                <button type="button" className="profile-pw-eye" onClick={() => setShowPw((v) => !v)} aria-label="Показать/скрыть пароль">
                                                    {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="profile-field">
                                            <label className="profile-field-label">Новый пароль</label>
                                            <div className="profile-pw-wrap">
                                                <input
                                                    type={showPw ? 'text' : 'password'}
                                                    className="profile-field-input"
                                                    value={newPw}
                                                    onChange={(e) => setNewPw(e.target.value)}
                                                    aria-label="Новый пароль"
                                                />
                                            </div>
                                        </div>
                                        <div className="profile-field">
                                            <label className="profile-field-label">Подтвердите пароль</label>
                                            <div className="profile-pw-wrap">
                                                <input
                                                    type={showPw ? 'text' : 'password'}
                                                    className="profile-field-input"
                                                    value={confirmPw}
                                                    onChange={(e) => setConfirmPw(e.target.value)}
                                                    aria-label="Подтвердите пароль"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="profile-form-actions">
                                <button type="button" className={saved ? 'profile-save-btn saved' : 'profile-save-btn'} onClick={handleSave}>
                                    {saved ? '✓ Сохранено' : 'Сохранить'}
                                </button>
                                <button
                                    type="button" className="profile-cancel-btn"
                                    onClick={() => { setDisplayName(profile.displayName); setCountry(profile.country) }}
                                >
                                    Отмена
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── Progress ───────────────────────────────────────────────────── */}
                    {tab === 'progress' && (
                        <div className="profile-tab-content">

                            {/* Top row: streak card + GPA card */}
                            <div className="progress-top-row">

                                {/* Streak */}
                                <div className="progress-streak-card">
                                    <div className="progress-streak-hero">
                                        <Flame size={36} className="streak-hero-flame" />
                                        <div>
                                            <p className="streak-hero-num">{profile.streak}</p>
                                            <p className="streak-hero-label">дней подряд</p>
                                        </div>
                                    </div>
                                    <p className="streak-record">Рекорд: <strong>{profile.maxStreak}</strong> дней</p>

                                    {/* 28-day calendar grid (4 weeks × 7 days) */}
                                    <div className="streak-calendar">
                                        {profile.streakHistory.map((active, i) => (
                                            <div
                                                key={i}
                                                className={active ? 'streak-cal-cell active' : 'streak-cal-cell'}
                                                title={active ? 'Активный день 🔥' : 'Пропущен'}
                                            >
                                                {active && <span>🔥</span>}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="streak-cal-legend">
                                        <span>4 нед. назад</span>
                                        <span>сегодня</span>
                                    </div>
                                </div>

                                {/* GPA */}
                                <div className="progress-gpa-card">
                                    <p className="progress-gpa-title">Средний балл (GPA)</p>
                                    <GpaGauge gpa={profile.gpa} max={profile.maxGpa} />
                                    <p className="progress-gpa-rating">
                                        {profile.gpa >= 4.5 ? '🏆 Отличник' : profile.gpa >= 4.0 ? '⭐ Хорошист' : '📚 Успевающий'}
                                    </p>
                                    <div className="progress-gpa-subjects">
                                        {profile.subjectGrades.slice(0, 3).map((s) => (
                                            <div key={s.subject} className="progress-gpa-mini-bar">
                                                <span className="progress-gpa-mini-label">{s.subject}</span>
                                                <div className="progress-gpa-mini-track">
                                                    <div className="progress-gpa-mini-fill" style={{ width: `${s.grade}%`, background: s.color }} />
                                                </div>
                                                <span className="progress-gpa-mini-val" style={{ color: s.color }}>{s.letter}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Course progress list */}
                            <div className="progress-courses-section">
                                <h3 className="progress-section-title">Курсы</h3>
                                <div className="progress-courses-list">
                                    {profile.courseProgress.map((course) => (
                                        <div key={course.id} className="progress-course-card">
                                            <div
                                                className="progress-course-header"
                                                role="button"
                                                tabIndex={0}
                                                onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
                                                onKeyDown={(e) => { if (e.key === 'Enter') setExpandedCourse(expandedCourse === course.id ? null : course.id) }}
                                                aria-expanded={expandedCourse === course.id}
                                            >
                                                <div className="progress-course-left">
                                                    <span className="progress-course-name">{course.name}</span>
                                                    <span className="progress-course-cat">{course.category}</span>
                                                </div>
                                                <div className="progress-course-right">
                                                    {course.grade !== undefined && (
                                                        <span
                                                            className="progress-grade-chip"
                                                            style={{ background: `${course.color}20`, color: course.color }}
                                                        >
                                                            {course.grade}%
                                                        </span>
                                                    )}
                                                    <span className={course.status === 'completed' ? 'progress-status done' : 'progress-status'}>
                                                        {course.status === 'completed' ? '✓ Завершён' : `${course.progress}%`}
                                                    </span>
                                                    <ChevronRight size={14} className={expandedCourse === course.id ? 'progress-chevron rotated' : 'progress-chevron'} />
                                                </div>
                                            </div>

                                            <div className="progress-bar-track">
                                                <div
                                                    className="progress-bar-fill"
                                                    style={{ width: `${course.progress}%`, background: course.color }}
                                                />
                                            </div>

                                            {expandedCourse === course.id && (
                                                <div className="progress-course-detail">
                                                    <div className="progress-detail-row"><span>Прогресс</span><strong>{course.progress}%</strong></div>
                                                    {course.grade !== undefined && (
                                                        <div className="progress-detail-row">
                                                            <span>Оценка</span>
                                                            <strong style={{ color: course.color }}>{course.grade}% — {gradeToLetter(course.grade)}</strong>
                                                        </div>
                                                    )}
                                                    <div className="progress-detail-row"><span>Статус</span><strong>{course.status === 'completed' ? 'Завершён' : 'В процессе'}</strong></div>
                                                    <div className="progress-detail-row"><span>Категория</span><strong>{course.category}</strong></div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Subject grades grid */}
                            <div className="progress-subjects-section">
                                <h3 className="progress-section-title">Оценки по предметам</h3>
                                <div className="progress-subjects-grid">
                                    {profile.subjectGrades.map((s) => (
                                        <div key={s.subject} className="progress-subject-card">
                                            <div
                                                className="subject-letter-badge"
                                                style={{ color: s.color, borderColor: `${s.color}40`, background: `${s.color}12` }}
                                            >
                                                {s.letter}
                                            </div>
                                            <div className="subject-card-info">
                                                <p className="subject-card-name">{s.subject}</p>
                                                <p className="subject-card-grade">{s.grade}% · GPA {s.gpa.toFixed(1)}</p>
                                            </div>
                                            <div className="subject-bar-track">
                                                <div className="subject-bar-fill" style={{ width: `${s.grade}%`, background: s.color }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Institution ────────────────────────────────────────────────── */}
                    {tab === 'institution' && (
                        <div className="profile-tab-content">
                            <p className="profile-inst-intro">
                                Место работы или учёбы можно сменить только через запрос администратору.
                                После проверки документа изменения вступят в силу автоматически.
                            </p>

                            {/* Current institution */}
                            <div className="profile-inst-card">
                                <div className="profile-inst-icon">
                                    <Building2 size={22} />
                                </div>
                                <div className="profile-inst-info">
                                    <p className="profile-inst-name">{profile.institution.name}</p>
                                    <p className="profile-inst-meta">{profile.institution.city} · с {profile.institution.since} года</p>
                                    <span className="profile-inst-type">{INST_TYPES[profile.institution.type]}</span>
                                </div>
                            </div>

                            {changeReqSent ? (
                                <div className="profile-inst-pending">
                                    <span className="profile-inst-pending-icon">⏳</span>
                                    <div>
                                        <p className="profile-inst-pending-title">Запрос на рассмотрении</p>
                                        <p className="profile-inst-pending-sub">
                                            Администратор проверит документы и подтвердит смену учреждения в течение 1–3 рабочих дней.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <button type="button" className="profile-inst-change-btn" onClick={() => setShowInstModal(true)}>
                                    Запросить изменение
                                </button>
                            )}

                            <div className="profile-inst-rules">
                                <h4>Как это работает</h4>
                                <ol>
                                    <li>Нажмите «Запросить изменение» и укажите новое учреждение.</li>
                                    <li>Прикрепите подтверждающий документ (справка, приказ, удостоверение).</li>
                                    <li>Администратор рассмотрит запрос в течение 1–3 рабочих дней.</li>
                                    <li>После подтверждения ваш профиль будет обновлён автоматически.</li>
                                </ol>
                            </div>
                        </div>
                    )}

                    {/* ── Notifications ──────────────────────────────────────────────── */}
                    {tab === 'notifications' && (
                        <div className="profile-tab-content">
                            <p className="profile-tab-intro">Выберите, о чём вы хотите получать уведомления.</p>
                            <div className="profile-toggles-list">
                                <ToggleRow label="Новые сообщения в чате" value={notifChat} onChange={() => setNotifChat((v) => !v)} />
                                <ToggleRow label="Оценки и прогресс" value={notifGrades} onChange={() => setNotifGrades((v) => !v)} />
                                <ToggleRow label="Объявления учреждения" value={notifAnnounce} onChange={() => setNotifAnnounce((v) => !v)} />
                                <ToggleRow label="Напоминания о дедлайнах" value={notifReminders} onChange={() => setNotifReminders((v) => !v)} />
                                <ToggleRow
                                    label="Email-уведомления"
                                    sublabel="Важные уведомления будут дублироваться на почту"
                                    value={notifEmail}
                                    onChange={() => setNotifEmail((v) => !v)}
                                />
                            </div>
                        </div>
                    )}

                    {/* ── Privacy ────────────────────────────────────────────────────── */}
                    {tab === 'privacy' && (
                        <div className="profile-tab-content">
                            <p className="profile-tab-intro">Управляйте видимостью вашего профиля и данных.</p>
                            <div className="profile-toggles-list">
                                <ToggleRow
                                    label="Показывать профиль студентам"
                                    sublabel="Студенты увидят ваше имя и аватар"
                                    value={privStudents}
                                    onChange={() => setPrivStudents((v) => !v)}
                                />
                                <ToggleRow
                                    label="Показывать прогресс коллегам"
                                    sublabel="Учителя из вашего учреждения видят ваши курсы"
                                    value={privColleagues}
                                    onChange={() => setPrivColleagues((v) => !v)}
                                />
                                <ToggleRow
                                    label="Разрешить приглашения в группы"
                                    sublabel="Другие пользователи могут добавлять вас в групповые чаты"
                                    value={privGroups}
                                    onChange={() => setPrivGroups((v) => !v)}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ══ Institution change modal ════════════════════════════════════════ */}
            {showInstModal && (
                <div className="chat-modal-overlay" onClick={() => setShowInstModal(false)}>
                    <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="chat-modal-header">
                            <h3>Запрос на смену учреждения</h3>
                            <button type="button" onClick={() => setShowInstModal(false)} aria-label="Закрыть">
                                <X size={18} />
                            </button>
                        </div>

                        <label className="chat-modal-label">
                            Новое учреждение
                            <input
                                className="chat-modal-input"
                                value={newInstName}
                                onChange={(e) => setNewInstName(e.target.value)}
                                placeholder="Школа / колледж / университет"
                                aria-label="Новое учреждение"
                            />
                        </label>

                        <label className="chat-modal-label">
                            Город
                            <input
                                className="chat-modal-input"
                                value={newInstCity}
                                onChange={(e) => setNewInstCity(e.target.value)}
                                placeholder="Алматы, Астана, …"
                                aria-label="Город"
                            />
                        </label>

                        <div className="chat-modal-label">
                            Подтверждающий документ
                            <button type="button" className="inst-upload-btn" onClick={() => instDocRef.current?.click()}>
                                <Upload size={14} />
                                {instDocName ?? 'Прикрепить файл (PDF, JPG, PNG)'}
                            </button>
                            <input
                                ref={instDocRef} type="file" accept=".pdf,.jpg,.jpeg,.png"
                                style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) setInstDocName(f.name) }}
                                aria-label="Прикрепить документ"
                            />
                        </div>

                        <label className="chat-modal-label">
                            Комментарий (необязательно)
                            <textarea
                                className="chat-modal-input inst-modal-textarea"
                                value={instMessage}
                                onChange={(e) => setInstMessage(e.target.value)}
                                placeholder="Дополнительная информация…"
                                rows={3}
                                aria-label="Комментарий"
                            />
                        </label>

                        <div className="chat-modal-footer">
                            <button type="button" className="chat-modal-cancel" onClick={() => setShowInstModal(false)}>Отмена</button>
                            <button type="button" className="chat-modal-create" onClick={handleInstSubmit} disabled={!newInstName.trim()}>
                                Отправить запрос
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </RoleShellLayout>
    )
}
