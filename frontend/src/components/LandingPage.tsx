import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    BookOpen,
    Bot,
    Brain,
    ChevronRight,
    Globe,
    Send,
    Shield,
    Star,
    Trophy,
    Users,
    Video,
    Zap,
} from 'lucide-react'

// ─── Data ─────────────────────────────────────────────────────────────────────

const PLATFORM_STATS = [
    { value: '1 200+', label: 'активных студентов' },
    { value: '50+', label: 'курсов на платформе' },
    { value: '4.9', label: 'средний рейтинг' },
    { value: '98%', label: 'довольны результатом' },
]

const BENEFITS = [
    {
        icon: <Brain size={24} />,
        title: 'AI-ассистент',
        desc: 'Персональный ИИ-помощник подбирает материалы, отвечает на вопросы и адаптирует программу под ваш темп',
    },
    {
        icon: <Trophy size={24} />,
        title: 'Геймификация',
        desc: 'Очки опыта, достижения, турниры и рейтинги делают обучение увлекательным и мотивируют двигаться вперёд',
    },
    {
        icon: <Shield size={24} />,
        title: 'Прозрачность',
        desc: 'Родители видят прогресс ребёнка в реальном времени. Учителя — полная аналитика по каждому ученику',
    },
]

const AUDIENCE = [
    {
        icon: <BookOpen size={22} />,
        role: 'Студентам',
        desc: 'Учись по персональному плану, участвуй в турнирах и получай международные сертификаты',
        color: '#6366f1',
        registerPath: '/register/student',
        loginPath: '/login/student',
    },
    {
        icon: <Video size={22} />,
        role: 'Учителям',
        desc: 'Создавай курсы, проводи live-сессии, отслеживай прогресс и монетизируй знания',
        color: '#43c38d',
        registerPath: '/register/teacher',
        loginPath: '/login/teacher',
    },
    {
        icon: <Users size={22} />,
        role: 'Родителям',
        desc: 'Контролируй успеваемость, получай уведомления и следи за достижениями ребёнка',
        color: '#f59e0b',
        registerPath: '/register/parent',
        loginPath: '/login/parent',
    },
    {
        icon: <Globe size={22} />,
        role: 'Учреждениям',
        desc: 'Автоматизируй документооборот, управляй расписанием и получай детальную аналитику',
        color: '#ef4444',
        registerPath: '/register/institution',
        loginPath: '/login/institution',
    },
]

const FEATURES = [
    {
        tag: 'AI-ОБУЧЕНИЕ',
        title: 'Умный помощник всегда рядом',
        desc: 'AI-ассистент анализирует прогресс каждого студента, предлагает индивидуальные задания и объясняет сложные темы в любое время суток.',
        bullets: ['Персональные рекомендации материалов', 'Мгновенные ответы на вопросы', 'Адаптация сложности под уровень', 'Анализ ошибок и пробелов в знаниях'],
        icon: <Bot size={40} />,
        color: '#6366f1',
    },
    {
        tag: 'ГЕЙМИФИКАЦИЯ',
        title: 'Учёба как игра',
        desc: 'Система очков, уровней и достижений превращает каждое занятие в увлекательный квест. Турниры между студентами добавляют соревновательный дух.',
        bullets: ['Очки опыта за каждое задание', 'Ежемесячные турниры и соревнования', 'Достижения и значки', 'Глобальный рейтинг студентов'],
        icon: <Trophy size={40} />,
        color: '#f59e0b',
    },
    {
        tag: 'LIVE-СЕССИИ',
        title: 'Живое обучение онлайн',
        desc: 'Встроенная видеоплатформа для вебинаров и индивидуальных сессий с менторами. Никаких сторонних сервисов.',
        bullets: ['Видеоконференции до 100 человек', 'Запись и сохранение сессий', 'Чат и опросы в реальном времени', 'Авто-напоминания участникам'],
        icon: <Video size={40} />,
        color: '#43c38d',
    },
    {
        tag: 'АНАЛИТИКА',
        title: 'Данные для принятия решений',
        desc: 'Полная картина успеваемости: прогресс по курсам, активность, результаты тестов и посещаемость в одном дэшборде.',
        bullets: ['Детальный прогресс по каждому уроку', 'Отчёты для родителей', 'Статистика для учителя', 'Экспорт в PDF и Excel'],
        icon: <Zap size={40} />,
        color: '#ef4444',
    },
]

const REVIEWS = [
    { name: 'Алия К.', role: 'Студент, UI/UX Design', text: 'Лучший курс из всех! AI-ассистент объясняет сложные темы понятно, турниры мотивируют не останавливаться.', rating: 5 },
    { name: 'Максим Р.', role: 'Студент, Front End', text: 'За 2 месяца прошёл путь от нулевых знаний до первого job offer. Геймификация реально помогает не забросить учёбу!', rating: 5 },
    { name: 'Жансая Б.', role: 'Студент, Branding', text: 'Очень понравилось сообщество и живые разборы с ментором. Родители видят мой прогресс — это тоже мотивирует.', rating: 5 },
    { name: 'Дмитрий С.', role: 'Учитель', text: 'Создал курс за один день. Аналитика по студентам невероятно удобна — сразу вижу, кому нужна помощь.', rating: 5 },
]

const STEPS = [
    { num: '01', title: 'Зарегистрируйтесь', desc: 'Создайте аккаунт бесплатно за 30 секунд' },
    { num: '02', title: 'Выберите курс', desc: 'Из каталога с 50+ программами или создайте свой' },
    { num: '03', title: 'Учитесь и достигайте', desc: 'Получайте сертификаты, очки и реальные навыки' },
]

// ─── Sub-components ────────────────────────────────────────────────────────────

function StarRating({ count }: { count: number }) {
    return (
        <div className="lp-stars">
            {Array.from({ length: count }).map((_, i) => (
                <Star key={i} size={12} fill="#f6c94e" color="#f6c94e" />
            ))}
        </div>
    )
}

// ─── Main landing page ─────────────────────────────────────────────────────────

export function LandingPage() {
    const navigate = useNavigate()
    const featuresRef = useRef<HTMLElement>(null)
    const audienceRef = useRef<HTMLElement>(null)
    const contactRef = useRef<HTMLElement>(null)

    const [form, setForm] = useState({ name: '', email: '', comment: '' })
    const [sent, setSent] = useState(false)
    const [heroVisible, setHeroVisible] = useState(false)
    const [audienceVisible, setAudienceVisible] = useState(false)
    const [activeFeature, setActiveFeature] = useState(0)

    useEffect(() => {
        const t = setTimeout(() => setHeroVisible(true), 100)
        return () => clearTimeout(t)
    }, [])

    useEffect(() => {
        if (!audienceRef.current) return
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setAudienceVisible(true)
                    }
                })
            },
            { threshold: 0.18 },
        )
        observer.observe(audienceRef.current)
        return () => observer.disconnect()
    }, [])

    const scrollTo = (ref: React.RefObject<HTMLElement | null>) => {
        ref.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault()
        setSent(true)
        setForm({ name: '', email: '', comment: '' })
        setTimeout(() => setSent(false), 4000)
    }

    return (
        <div className="lp-root">

            {/* ════════════════════════════════════════════ HERO ══════════════════ */}
            <section className="lp-hero">
                <img
                    src="https://images.unsplash.com/photo-1513258496099-48168024aec0?w=1600&q=80"
                    alt=""
                    className="lp-hero-bg"
                    aria-hidden="true"
                />
                <div className="lp-hero-overlay" />

                {/* Nav */}
                <nav className="lp-nav">
                    <div className="lp-nav-brand">
                        <BookOpen size={20} /> EDUFUTURE
                    </div>
                    <div className="lp-nav-links">
                        <button type="button" onClick={() => scrollTo(featuresRef)}>Возможности</button>
                        <button type="button" onClick={() => scrollTo(audienceRef)}>Для кого</button>
                        <button type="button" onClick={() => navigate('/about')}>О нас</button>
                        <button type="button" onClick={() => navigate('/help')}>Поддержка</button>
                        <button type="button" onClick={() => scrollTo(contactRef)}>Контакты</button>
                    </div>
                    <button type="button" className="lp-nav-cta" onClick={() => navigate('/login/student')}>
                        Войти
                    </button>
                </nav>

                {/* Big title */}
                <div className={`lp-hero-title-wrap ${heroVisible ? 'visible' : ''}`}>
                    <p className="lp-hero-eyebrow">Образовательная платформа нового поколения</p>
                    <h1 className="lp-hero-title">EDUFUTURE</h1>
                    <p className="lp-hero-sub">AI · Геймификация · Живые сессии · Аналитика</p>
                    <div className="lp-hero-ctas">
                        <button type="button" className="lp-hero-btn-primary" onClick={() => navigate('/register/student')}>
                            Попробовать бесплатно
                        </button>
                        <button type="button" className="lp-hero-btn-secondary" onClick={() => scrollTo(featuresRef)}>
                            Узнать больше <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Stats bar */}
                <div className="lp-stats-bar">
                    {PLATFORM_STATS.map((s) => (
                        <div key={s.label} className="lp-stats-item">
                            <strong>{s.value}</strong>
                            <span>{s.label}</span>
                        </div>
                    ))}
                    <button type="button" className="lp-strip-cta" onClick={() => navigate('/register/student')}>
                        Начать
                    </button>
                </div>
            </section>

            {/* ══════════════════════════════════════ BENEFITS ═════════════════════ */}
            <section className="lp-benefits">
                <div className="lp-section-title-row">
                    <span className="lp-divider" />
                    <h2 className="lp-section-title">ПОЧЕМУ EDUFUTURE</h2>
                    <span className="lp-divider" />
                </div>
                <div className="lp-benefits-grid">
                    {BENEFITS.map((b) => (
                        <div key={b.title} className="lp-inc-card">
                            <span className="lp-inc-icon">{b.icon}</span>
                            <h3 className="lp-inc-title">{b.title}</h3>
                            <p className="lp-inc-desc">{b.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ══════════════════════════════════════ FOR WHOM ══════════════════════ */}
            <section className="lp-audience" ref={audienceRef}>
                <div className="lp-section-title-row">
                    <h2 className="lp-section-title left">ДЛЯ КОГО</h2>
                    <span className="lp-divider" />
                </div>
                <div className="lp-audience-grid">
                    {AUDIENCE.map((a, i) => (
                        <div
                            key={a.role}
                            className={`lp-audience-card ${audienceVisible ? 'is-visible' : ''}`}
                            style={{ '--aud-color': a.color, '--delay': `${i * 90}ms` } as React.CSSProperties}
                        >
                            <div className="lp-audience-pattern" aria-hidden="true">
                                <span className="lp-aud-dot" />
                                <span className="lp-aud-line" />
                                <span className="lp-aud-ring" />
                            </div>
                            <span className="lp-audience-icon" style={{ background: `${a.color}18`, color: a.color }}>{a.icon}</span>
                            <h3 className="lp-audience-role">{a.role}</h3>
                            <p className="lp-audience-desc">{a.desc}</p>
                            <div className="lp-audience-actions">
                                <button type="button" className="lp-audience-link" style={{ color: a.color }} onClick={() => navigate(a.registerPath)}>
                                    Регистрация <ChevronRight size={14} />
                                </button>
                                <button type="button" className="lp-audience-login" style={{ borderColor: `${a.color}44`, color: a.color }} onClick={() => navigate(a.loginPath)}>
                                    Вход
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ════════════════════════════════════════ FEATURES ════════════════════ */}
            <section className="lp-features" ref={featuresRef}>
                <div className="lp-section-title-row">
                    <span className="lp-divider" />
                    <h2 className="lp-section-title">ВОЗМОЖНОСТИ</h2>
                    <span className="lp-divider" />
                </div>
                <div className="lp-feat-tabs">
                    {FEATURES.map((f, i) => (
                        <button
                            key={f.tag}
                            type="button"
                            className={`lp-feat-tab ${activeFeature === i ? 'active' : ''}`}
                            style={activeFeature === i ? { borderColor: f.color, color: f.color } : undefined}
                            onClick={() => setActiveFeature(i)}
                        >
                            {f.tag}
                        </button>
                    ))}
                </div>
                {FEATURES.map((f, i) => (
                    <div key={f.tag} className={`lp-feat-panel ${activeFeature === i ? 'active' : ''}`}>
                        <div className="lp-feat-icon" style={{ color: f.color, background: `${f.color}18` }}>
                            {f.icon}
                        </div>
                        <div className="lp-feat-content">
                            <h3 className="lp-feat-title">{f.title}</h3>
                            <p className="lp-feat-desc">{f.desc}</p>
                            <ul className="lp-feat-list">
                                {f.bullets.map((item) => (
                                    <li key={item}><ChevronRight size={14} color={f.color} />{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </section>

            {/* ══════════════════════════════════════ REVIEWS ══════════════════════ */}
            <section className="lp-reviews">
                <div className="lp-section-title-row">
                    <span className="lp-divider" />
                    <h2 className="lp-section-title">ОТЗЫВЫ</h2>
                    <span className="lp-divider" />
                </div>
                <div className="lp-reviews-grid">
                    {REVIEWS.map((r) => (
                        <div key={r.name} className="lp-review-card">
                            <StarRating count={r.rating} />
                            <p className="lp-review-text">«{r.text}»</p>
                            <div className="lp-review-author">
                                <span className="lp-review-avatar">{r.name[0]}</span>
                                <div>
                                    <p className="lp-review-name">{r.name}</p>
                                    <p className="lp-review-role">{r.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ══════════════════════════════════════ STEPS ════════════════════════ */}
            <section className="lp-steps">
                <div className="lp-section-title-row">
                    <h2 className="lp-section-title left">НАЧАТЬ ЛЕГКО</h2>
                    <span className="lp-divider" />
                </div>
                <div className="lp-steps-grid">
                    {STEPS.map((s, i) => (
                        <div key={s.num} className="lp-step-card">
                            <span className="lp-step-num">{s.num}</span>
                            <h3 className="lp-step-title">{s.title}</h3>
                            <p className="lp-step-desc">{s.desc}</p>
                            {i < STEPS.length - 1 && <span className="lp-step-arrow"><ChevronRight size={22} /></span>}
                        </div>
                    ))}
                </div>
                <div className="lp-steps-cta">
                    <button type="button" className="lp-hero-btn-primary" onClick={() => navigate('/register/student')}>
                        Зарегистрироваться бесплатно
                    </button>
                </div>
            </section>

            {/* ══════════════════════════════════════ CONTACT ══════════════════════ */}
            <section className="lp-contact" ref={contactRef}>
                <img
                    src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1400&q=80"
                    alt=""
                    className="lp-contact-bg"
                    aria-hidden="true"
                />
                <div className="lp-contact-overlay" />

                <div className="lp-contact-card">
                    <h2 className="lp-contact-title">
                        Хочешь начать учиться,<br />
                        но ещё есть вопросы?
                    </h2>
                    <p className="lp-contact-label">Оставь заявку — мы ответим в течение часа</p>

                    {sent ? (
                        <div className="lp-contact-thanks">
                            ✅ Спасибо! Мы свяжемся с тобой в ближайшее время.
                        </div>
                    ) : (
                        <form className="lp-contact-form" onSubmit={handleSend}>
                            <input
                                className="lp-contact-input"
                                placeholder="Твоё имя"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                            <input
                                className="lp-contact-input"
                                placeholder="Email или телефон"
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                            />
                            <input
                                className="lp-contact-input"
                                placeholder="Комментарий (необязательно)"
                                value={form.comment}
                                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                            />
                            <button type="submit" className="lp-contact-submit">
                                <Send size={14} /> Отправить
                            </button>
                        </form>
                    )}
                </div>

            </section>

            {/* ══════════════════════════════════════ FOOTER ═══════════════════════ */}
            <footer className="lp-footer">
                <div className="lp-footer-brand">
                    <BookOpen size={18} /> EDUFUTURE
                </div>
                <div className="lp-footer-links">
                    <button type="button" onClick={() => scrollTo(featuresRef)}>Возможности</button>
                    <button type="button" onClick={() => scrollTo(audienceRef)}>Для кого</button>
                    <button type="button" onClick={() => navigate('/about')}>О нас</button>
                    <button type="button" onClick={() => scrollTo(contactRef)}>Контакты</button>
                </div>
                <button type="button" className="lp-nav-cta" onClick={() => navigate('/login/student')}>
                    Войти
                </button>
            </footer>

        </div>
    )
}
