import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Check,
    Brain,
    Trophy,
    Video,
    Zap,
    Shield,
    Star,
    Quote,
} from 'lucide-react'

// ─── Team ──────────────────────────────────────────────────────────────────────

// TODO: замените путь ниже на путь к вашему фото
const MY_PHOTO = 'public/photo.jpg' // например: '/photo/daniyar.jpg'  или  'https://...'

const TECH_STACK = [
    {
        category: 'Языки и веб',
        color: '#6366f1',
        items: ['Python', 'C#', 'JavaScript (React / Node.js / Express)', 'HTML', 'CSS', 'REST API', 'HTTP / HTTPS / TLS'],
    },
    {
        category: 'Базы данных',
        color: '#43c38d',
        items: ['PostgreSQL', 'MySQL', 'NoSQL', 'Redis', 'Django ORM', 'ACID', 'Migrations'],
    },
    {
        category: 'Инфраструктура',
        color: '#f59e0b',
        items: ['Docker', 'Kubernetes (K8s)', 'Docker Compose', 'Nginx', 'CI/CD', 'AWS S3', 'Supabase'],
    },
    {
        category: 'Архитектура',
        color: '#ec4899',
        items: ['Monolith', 'Microservices', 'RabbitMQ', 'Kafka'],
    },
    {
        category: 'Инструменты',
        color: '#38bdf8',
        items: ['Git', 'GitHub (commits, merge, branches, repos)', 'Деплой / хостинг'],
    },
]

const TEAM = [
    {
        id: 0,
        name: 'Султангереев Данияр',
        role: 'Software Developer · Студент 2 курса',
        tag: 'РАЗРАБОТЧИК',
        bio: 'Студент Astana IT University College по направлению «Разработчик программного обеспечения».',
        details: [
            'Astana IT University College, 2 курс',
            'Full-Stack разработка (Python, JS, C#)',
            'DevOps: Docker, K8s, CI/CD, Nginx',
            'Базы данных: PostgreSQL, Redis, NoSQL',
            'Архитектура: Microservices, RabbitMQ, Kafka',
        ],
        avatar: 'СД',
        color: '#6366f1',
        gradFrom: '#0f1135',
        gradTo: '#07090f',
        photo: MY_PHOTO,
    },
]

// ─── Plans ─────────────────────────────────────────────────────────────────────

const PLANS = [
    {
        name: 'Базовый',
        subtitle: 'Standard Edition',
        price: 'Бесплатно',
        badge: null,
        features: [
            '5 избранных курсов',
            'AI-ассистент (базовый)',
            'Доступ к сообществу',
            'Цифровые сертификаты',
            'Мобильное приложение',
        ],
        gradFrom: '#101836',
        gradTo: '#080e20',
        accentColor: '#6366f1',
        cta: 'Начать бесплатно',
        path: '/register/student',
        highlight: false,
    },
    {
        name: 'Стандарт',
        subtitle: 'Deluxe Edition',
        price: '2 900 ₸/мес',
        badge: 'ПОПУЛЯРНЫЙ',
        features: [
            'Все курсы каталога',
            'AI-ассистент (полный)',
            'Live-сессии с менторами',
            'Приоритетная поддержка',
            'Скачивание материалов',
            'Турниры и рейтинги',
        ],
        gradFrom: '#1e0a36',
        gradTo: '#10061e',
        accentColor: '#a855f7',
        cta: 'Выбрать',
        path: '/register/student',
        highlight: true,
    },
    {
        name: 'Премиум',
        subtitle: 'Complete Edition',
        price: '5 900 ₸/мес',
        badge: null,
        features: [
            'Всё из Стандарта',
            'Персональный ментор',
            'Blockchain-сертификаты',
            'Аналитика успеваемости',
            'Офлайн-доступ',
            'Безлимитные турниры',
            'Карьерный центр',
        ],
        gradFrom: '#1e100a',
        gradTo: '#110806',
        accentColor: '#f59e0b',
        cta: 'Выбрать',
        path: '/register/student',
        highlight: false,
    },
]

// ─── Areas ─────────────────────────────────────────────────────────────────────

const AREAS = [
    {
        title: 'Дизайн и UI/UX',
        sub: 'Направление обучения',
        courses: '12 курсов',
        grad: 'linear-gradient(160deg, #1a1040 0%, #0d0820 100%)',
        accent: '#818cf8',
        icon: <Star size={20} />,
    },
    {
        title: 'Frontend разработка',
        sub: 'Направление обучения',
        courses: '18 курсов',
        grad: 'linear-gradient(160deg, #0a1f1a 0%, #06110e 100%)',
        accent: '#34d399',
        icon: <Zap size={20} />,
    },
    {
        title: 'Backend & Cloud',
        sub: 'Направление обучения',
        courses: '15 курсов',
        grad: 'linear-gradient(160deg, #1a1000 0%, #100900 100%)',
        accent: '#fbbf24',
        icon: <Shield size={20} />,
    },
    {
        title: 'AI & Machine Learning',
        sub: 'Направление обучения',
        courses: '9 курсов',
        grad: 'linear-gradient(160deg, #1a0a1a 0%, #100810 100%)',
        accent: '#e879f9',
        icon: <Brain size={20} />,
    },
    {
        title: 'Бизнес и Маркетинг',
        sub: 'Направление обучения',
        courses: '14 курсов',
        grad: 'linear-gradient(160deg, #1a0a0a 0%, #100808 100%)',
        accent: '#f87171',
        icon: <Trophy size={20} />,
    },
    {
        title: 'Языки и коммуникация',
        sub: 'Направление обучения',
        courses: '10 курсов',
        grad: 'linear-gradient(160deg, #0a1020 0%, #060a14 100%)',
        accent: '#38bdf8',
        icon: <Video size={20} />,
    },
]

// ─── Stats ─────────────────────────────────────────────────────────────────────

const MILESTONES = [
    { year: '2020', event: 'Основание EduFuture', detail: 'Первые 5 курсов и команда из 3 человек' },
    { year: '2021', event: 'Запуск AI-ассистента', detail: 'Патентованный алгоритм адаптивного обучения' },
    { year: '2022', event: '10 000 студентов', detail: 'Партнёрство с 20+ университетами' },
    { year: '2023', event: 'Seed-раунд $2M', detail: 'Expansion в Россию, Узбекистан и Кыргызстан' },
    { year: '2024', event: 'Forbes EdTech Top-10', detail: '1 200+ активных студентов, 50+ курсов' },
]

const REVIEWS = [
    { name: 'Айбек М.', role: 'Frontend Dev', text: 'EduFuture изменил мою карьеру. Через 4 месяца я получил оффер в международную компанию.', rating: 5 },
    { name: 'Камила Е.', role: 'UX Designer', text: 'AI-ассистент отвечает на вопросы лучше, чем преподаватель на лекции. Просто магия.', rating: 5 },
    { name: 'Нурлан Д.', role: 'Data Analyst', text: 'Геймификация реально работает — я проходил уроки как в игре, не мог остановиться.', rating: 5 },
]

// ─── Main ──────────────────────────────────────────────────────────────────────

export function AboutPage() {
    const navigate = useNavigate()
    const [activePlan] = useState(1)
    const [areaIndex, setAreaIndex] = useState(0)
    const [heroVisible, setHeroVisible] = useState(false)
    const [activeMilestone, setActiveMilestone] = useState(4)
    const areasRef = useRef<HTMLDivElement>(null)
    const VISIBLE_AREAS = 3

    const member = TEAM[0]

    useEffect(() => {
        const t = setTimeout(() => setHeroVisible(true), 80)
        return () => clearTimeout(t)
    }, [])

    const prevArea = () => setAreaIndex((i) => Math.max(0, i - 1))
    const nextArea = () => setAreaIndex((i) => Math.min(AREAS.length - VISIBLE_AREAS, i + 1))

    return (
        <div className="ab-root">

            {/* ══════════════════════════════════════════ HERO ═════════════════ */}
            <section className="ab-hero">
                <div className="ab-hero-bg" />
                <div className="ab-hero-particles">
                    {Array.from({ length: 60 }).map((_, i) => (
                        <span key={i} className="ab-particle" style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${1 + Math.random() * 2}px`,
                            height: `${1 + Math.random() * 2}px`,
                            animationDelay: `${Math.random() * 6}s`,
                            animationDuration: `${3 + Math.random() * 5}s`,
                        }} />
                    ))}
                </div>
                <div className="ab-hero-glow-left" />
                <div className="ab-hero-glow-right" />

                {/* Nav */}
                <nav className="ab-nav">
                    <button className="ab-nav-brand" onClick={() => navigate('/')}>
                        <BookOpen size={20} /> EDUFUTURE
                    </button>
                    <div className="ab-nav-links">
                        <button onClick={() => navigate('/')}>Главная</button>
                        <button className="ab-nav-active">О нас</button>
                        <button onClick={() => navigate('/register/student')}>Курсы</button>
                        <button onClick={() => navigate('/login/student')}>Войти</button>
                    </div>
                    <button className="ab-nav-cta" onClick={() => navigate('/register/student')}>
                        Начать бесплатно
                    </button>
                </nav>

                {/* Title */}
                <div className={`ab-hero-content ${heroVisible ? 'visible' : ''}`}>
                    <p className="ab-hero-eyebrow">ОБРАЗОВАТЕЛЬНАЯ ПЛАТФОРМА НОВОГО ПОКОЛЕНИЯ</p>
                    <h1 className="ab-hero-title">О НАС</h1>
                    <p className="ab-hero-sub">ЗАПУЩЕНА В 2020 · КАЗАХСТАН</p>
                    <p className="ab-hero-desc">
                        EduFuture — платформа, где AI, геймификация и живые менторы<br />
                        объединяются, чтобы сделать образование по-настоящему эффективным.
                    </p>
                    <div className="ab-hero-ctas">
                        <button className="ab-hero-btn-primary" onClick={() => navigate('/register/student')}>
                            НАЧАТЬ ОБУЧЕНИЕ
                        </button>
                        <button className="ab-hero-btn-secondary" onClick={() => {
                            document.getElementById('ab-team')?.scrollIntoView({ behavior: 'smooth' })
                        }}>
                            НАША КОМАНДА <ChevronRight size={16} />
                        </button>
                    </div>
                </div>

                {/* Platform stats */}
                <div className="ab-hero-stats">
                    <div className="ab-hero-stat"><strong>1 200+</strong><span>студентов</span></div>
                    <div className="ab-hero-stat-divider" />
                    <div className="ab-hero-stat"><strong>50+</strong><span>курсов</span></div>
                    <div className="ab-hero-stat-divider" />
                    <div className="ab-hero-stat"><strong>4.9</strong><span>рейтинг</span></div>
                    <div className="ab-hero-stat-divider" />
                    <div className="ab-hero-stat"><strong>80+</strong><span>партнёров</span></div>
                </div>

                <div className="ab-hero-scroll-hint">
                    <span className="ab-scroll-dot" />
                    <span>прокрутите вниз</span>
                </div>
            </section>

            {/* ══════════════════════════════════════ DEVELOPER CARD ═══════════ */}
            <section className="ab-team" id="ab-team">
                <div className="ab-section-label">РАЗРАБОТЧИК</div>
                <div className="ab-dev-card"
                    style={{ background: `linear-gradient(135deg, ${member.gradFrom} 0%, ${member.gradTo} 100%)` }}>

                    {/* Photo column */}
                    <div className="ab-dev-photo-col">
                        <div className="ab-dev-photo-wrap" style={{ borderColor: `${member.color}40` }}>
                            <div className="ab-dev-photo-ring" style={{ borderColor: `${member.color}25` }} />
                            <div className="ab-dev-photo-ring ab-dev-ring2" style={{ borderColor: `${member.color}15` }} />
                            <div className="ab-dev-photo-glow" style={{ background: `radial-gradient(circle, ${member.color}28 0%, transparent 70%)` }} />
                            {member.photo ? (
                                <img
                                    src={member.photo}
                                    alt={member.name}
                                    className="ab-dev-photo-img"
                                    style={{ borderColor: `${member.color}50` }}
                                />
                            ) : (
                                <div className="ab-dev-photo-placeholder" style={{ borderColor: `${member.color}50`, background: `linear-gradient(135deg, ${member.color}18, ${member.color}08)` }}>
                                    <span className="ab-dev-placeholder-initials" style={{ color: member.color }}>{member.avatar}</span>
                                    <span className="ab-dev-placeholder-hint">Добавьте фото</span>
                                    <span className="ab-dev-placeholder-hint2">MY_PHOTO = '/your/photo.jpg'</span>
                                </div>
                            )}
                        </div>
                        <div className="ab-dev-photo-name-row">
                            <span className="ab-dev-photo-name">{member.name}</span>
                            <span className="ab-dev-photo-uni">Astana IT University College</span>
                        </div>
                    </div>

                    {/* Info column */}
                    <div className="ab-dev-info">
                        <div className="ab-dev-header">
                            <span className="ab-team-tag" style={{ color: member.color, borderColor: `${member.color}44`, background: `${member.color}14` }}>
                                {member.tag}
                            </span>
                            <h2 className="ab-team-name">{member.name}</h2>
                            <p className="ab-team-role">{member.role}</p>
                            <p className="ab-team-bio">{member.bio}</p>
                        </div>

                        {/* Tech stack grid */}
                        <div className="ab-dev-stack">
                            {TECH_STACK.map((cat) => (
                                <div key={cat.category} className="ab-dev-stack-cat">
                                    <span className="ab-dev-cat-label" style={{ color: cat.color }}>{cat.category}</span>
                                    <div className="ab-dev-tags">
                                        {cat.items.map((item) => (
                                            <span key={item} className="ab-dev-tag" style={{ borderColor: `${cat.color}40`, color: cat.color, background: `${cat.color}0e` }}>
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════ PLANS ════════════════════ */}
            <section className="ab-plans">
                <div className="ab-plans-bg" />
                <div className="ab-section-label">ТАРИФЫ</div>
                <div className="ab-plans-title-row">
                    <span className="ab-plans-divider" />
                    <h2 className="ab-plans-heading">ВЫБЕРИТЕ ПЛАН</h2>
                    <span className="ab-plans-divider" />
                </div>
                <p className="ab-plans-sub">Начните бесплатно, обновите когда будете готовы</p>

                <div className="ab-plans-grid">
                    {PLANS.map((p, i) => (
                        <div key={p.name}
                            className={`ab-plan-card ${i === activePlan ? 'featured' : ''}`}
                            style={{ '--ab-accent': p.accentColor } as React.CSSProperties}>
                            {p.badge && <span className="ab-plan-badge">{p.badge}</span>}

                            {/* Card art header */}
                            <div className="ab-plan-art" style={{ background: `linear-gradient(160deg, ${p.gradFrom}, ${p.gradTo})` }}>
                                <div className="ab-plan-art-logo">
                                    <BookOpen size={28} color={p.accentColor} />
                                    <span style={{ color: p.accentColor }}>EDUFUTURE</span>
                                </div>
                                <span className="ab-plan-art-name" style={{ color: p.accentColor }}>{p.name.toUpperCase()}</span>
                                <span className="ab-plan-art-sub" style={{ color: `${p.accentColor}99` }}>{p.subtitle}</span>
                            </div>

                            {/* Features */}
                            <div className="ab-plan-body">
                                <ul className="ab-plan-features">
                                    {p.features.map((f) => (
                                        <li key={f}>
                                            <Check size={13} color={p.accentColor} />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <div className="ab-plan-footer">
                                    <span className="ab-plan-price">{p.price}</span>
                                    <button className="ab-plan-btn"
                                        style={{ background: i === activePlan ? p.accentColor : 'transparent', borderColor: p.accentColor, color: i === activePlan ? '#fff' : p.accentColor }}
                                        onClick={() => navigate(p.path)}>
                                        {p.cta}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ══════════════════════════════════════ AREAS ════════════════════ */}
            <section className="ab-areas">
                <div className="ab-areas-left">
                    <span className="ab-section-label inline">НАПРАВЛЕНИЯ</span>
                    <h2 className="ab-areas-heading">Ключевые<br />направления</h2>
                    <p className="ab-areas-desc">
                        Каждое направление — это глубоко проработанная программа от практикующих
                        профессионалов. Курируется командой экспертов и обновляется каждый квартал.
                    </p>
                    <div className="ab-areas-arrows">
                        <button className="ab-area-arrow" onClick={prevArea} disabled={areaIndex === 0}>
                            <ChevronLeft size={22} />
                        </button>
                        <span className="ab-area-counter">
                            {String(areaIndex + 1).padStart(2, '0')} — {String(Math.min(areaIndex + VISIBLE_AREAS, AREAS.length)).padStart(2, '0')} / {String(AREAS.length).padStart(2, '0')}
                        </span>
                        <button className="ab-area-arrow" onClick={nextArea} disabled={areaIndex >= AREAS.length - VISIBLE_AREAS}>
                            <ChevronRight size={22} />
                        </button>
                    </div>
                    <button className="ab-areas-view-all" onClick={() => navigate('/register/student')}>
                        Все направления <ChevronRight size={14} />
                    </button>
                </div>

                <div className="ab-areas-cards" ref={areasRef}>
                    {AREAS.slice(areaIndex, areaIndex + VISIBLE_AREAS).map((a) => (
                        <div key={a.title} className="ab-area-card" style={{ background: a.grad }}>
                            <div className="ab-area-card-top">
                                <span className="ab-area-icon" style={{ color: a.accent, background: `${a.accent}18` }}>
                                    {a.icon}
                                </span>
                            </div>
                            <div className="ab-area-card-bottom">
                                <p className="ab-area-sub">{a.sub}</p>
                                <h3 className="ab-area-title">{a.title}</h3>
                                <span className="ab-area-courses" style={{ color: a.accent }}>{a.courses}</span>
                            </div>
                            <div className="ab-area-hover-overlay" style={{ background: `${a.accent}0d` }} />
                        </div>
                    ))}
                </div>
            </section>

            {/* ══════════════════════════════════════ TIMELINE ═════════════════ */}
            <section className="ab-timeline">
                <div className="ab-section-label">ИСТОРИЯ</div>
                <div className="ab-tl-title-row">
                    <span className="ab-plans-divider" />
                    <h2 className="ab-plans-heading">ВЕХИ КОМПАНИИ</h2>
                    <span className="ab-plans-divider" />
                </div>
                <div className="ab-tl-track">
                    {MILESTONES.map((m, i) => (
                        <button key={m.year}
                            className={`ab-tl-node ${activeMilestone === i ? 'active' : ''}`}
                            onClick={() => setActiveMilestone(i)}>
                            <span className="ab-tl-year">{m.year}</span>
                            <span className="ab-tl-dot" />
                        </button>
                    ))}
                    <div className="ab-tl-line" />
                </div>
                <div className="ab-tl-detail">
                    <h3 className="ab-tl-event">{MILESTONES[activeMilestone].event}</h3>
                    <p className="ab-tl-desc">{MILESTONES[activeMilestone].detail}</p>
                </div>
            </section>

            {/* ══════════════════════════════════════ REVIEWS ══════════════════ */}
            <section className="ab-reviews">
                <div className="ab-section-label">ОТЗЫВЫ</div>
                <div className="ab-reviews-grid">
                    {REVIEWS.map((r) => (
                        <div key={r.name} className="ab-review-card">
                            <Quote size={28} className="ab-review-quote" />
                            <p className="ab-review-text">{r.text}</p>
                            <div className="ab-review-stars">
                                {Array.from({ length: r.rating }).map((_, i) => (
                                    <Star key={i} size={12} fill="#f6c94e" color="#f6c94e" />
                                ))}
                            </div>
                            <div className="ab-review-author">
                                <span className="ab-review-avatar">{r.name[0]}</span>
                                <div>
                                    <p className="ab-review-name">{r.name}</p>
                                    <p className="ab-review-role">{r.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ══════════════════════════════════════ CTA BANNER ═══════════════ */}
            <section className="ab-cta-banner">
                <div className="ab-cta-bg" />
                <div className="ab-cta-content">
                    <h2 className="ab-cta-title">Готов начать своё<br />путешествие?</h2>
                    <p className="ab-cta-sub">Присоединяйся к 1 200+ студентам, которые уже меняют свою карьеру с EduFuture</p>
                    <div className="ab-cta-btns">
                        <button className="ab-hero-btn-primary" onClick={() => navigate('/register/student')}>
                            НАЧАТЬ БЕСПЛАТНО
                        </button>
                        <button className="ab-hero-btn-secondary" onClick={() => navigate('/')}>
                            НА ГЛАВНУЮ <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════ FOOTER ═══════════════════ */}
            <footer className="ab-footer">
                <div className="ab-footer-brand">
                    <BookOpen size={18} /> EDUFUTURE
                </div>
                <div className="ab-footer-links">
                    <button onClick={() => navigate('/')}>Главная</button>
                    <button onClick={() => navigate('/register/student')}>Курсы</button>
                    <button onClick={() => navigate('/login/student')}>Войти</button>
                </div>
                <p className="ab-footer-copy">© 2024 EduFuture. Все права защищены.</p>
            </footer>

        </div>
    )
}
