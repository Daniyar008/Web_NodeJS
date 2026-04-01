import { useState } from 'react'
import {
    Book,
    BookMarked,
    CalendarDays,
    Clock,
    GraduationCap,
    Library,
    Search,
    Star,
    TrendingUp,
} from 'lucide-react'
import { CourseShellLayout } from './CourseShellLayout'
import type { Language } from '../i18n/translations'

/* ── Types ───────────────────────────────────────────────────────────────── */
type ResourceType = 'Видео' | 'Статья' | 'Тест' | 'Книга' | 'Задание'

interface Resource {
    id: string
    title: string
    subject: string
    emoji: string
    type: ResourceType
    level: string
    rating: number
    views: number
    bg: string
}

interface University {
    id: string
    name: string
    city: string
    logo: string
    logoBg: string
    match: number
    programs: string[]
    deadline: string
    scholarship: boolean
}

/* ── Static Data ─────────────────────────────────────────────────────────── */
const CATEGORIES = [
    { id: 'all',    label: 'Все',         icon: <Library size={13} /> },
    { id: 'math',   label: 'Математика',  icon: <span>∑</span> },
    { id: 'phys',   label: 'Физика',      icon: <span>⚡</span> },
    { id: 'chem',   label: 'Химия',       icon: <span>🧪</span> },
    { id: 'cs',     label: 'Информатика', icon: <span>💻</span> },
    { id: 'eng',    label: 'Английский',  icon: <span>🇬🇧</span> },
    { id: 'design', label: 'Дизайн',      icon: <span>🎨</span> },
]

const RESOURCES: Resource[] = [
    { id: '1', title: 'Производные и интегралы: полный курс', subject: 'Математика', emoji: '📐', type: 'Видео',   level: 'Продвинутый', rating: 4.9, views: 12400, bg: '#fef3c7' },
    { id: '2', title: 'Законы Ньютона на практике',           subject: 'Физика',     emoji: '⚡', type: 'Статья',  level: 'Средний',     rating: 4.7, views: 8900,  bg: '#dbeafe' },
    { id: '3', title: 'Органическая химия: функц. группы',    subject: 'Химия',      emoji: '🧪', type: 'Книга',   level: 'Продвинутый', rating: 4.8, views: 6700,  bg: '#d1fae5' },
    { id: '4', title: 'Алгоритмы и структуры данных',         subject: 'Информатика',emoji: '💻', type: 'Тест',    level: 'Средний',     rating: 4.9, views: 21000, bg: '#ede9fe' },
    { id: '5', title: 'IELTS Speaking: стратегии Part 2',     subject: 'Английский', emoji: '🎙️', type: 'Видео',   level: 'Базовый',     rating: 4.6, views: 15300, bg: '#fce7f3' },
    { id: '6', title: 'Figma для начинающих дизайнеров',      subject: 'Дизайн',     emoji: '🎨', type: 'Задание', level: 'Базовый',     rating: 4.8, views: 9800,  bg: '#fff7ed' },
    { id: '7', title: 'ЕНТ по математике: 300 задач',         subject: 'Математика', emoji: '📊', type: 'Тест',    level: 'Продвинутый', rating: 5.0, views: 34000, bg: '#fef9c3' },
    { id: '8', title: 'Python для школьников',                subject: 'Информатика',emoji: '🐍', type: 'Видео',   level: 'Базовый',     rating: 4.7, views: 18700, bg: '#dbeafe' },
]

const SUBJECT_TO_CAT: Record<string, string> = {
    'Математика': 'math',
    'Физика': 'phys',
    'Химия': 'chem',
    'Информатика': 'cs',
    'Английский': 'eng',
    'Дизайн': 'design',
}

const UNIVERSITIES: University[] = [
    {
        id: 'u1', name: 'Назарбаев Университет', city: 'Астана',
        logo: '🎓', logoBg: '#fef3c7', match: 94,
        programs: ['IT', 'Инженерия', 'Бизнес'],
        deadline: '15 фев 2026', scholarship: true,
    },
    {
        id: 'u2', name: 'КазНУ им. аль-Фараби', city: 'Алматы',
        logo: '🏛️', logoBg: '#dbeafe', match: 87,
        programs: ['Физика', 'Химия', 'Математика'],
        deadline: '1 мар 2026', scholarship: true,
    },
    {
        id: 'u3', name: 'КБТУ', city: 'Алматы',
        logo: '⚙️', logoBg: '#d1fae5', match: 82,
        programs: ['IT', 'Нефть и газ', 'Телеком'],
        deadline: '20 мар 2026', scholarship: false,
    },
    {
        id: 'u4', name: 'МУИТ', city: 'Астана',
        logo: '💡', logoBg: '#ede9fe', match: 79,
        programs: ['IT', 'Кибербезопасность', 'AI'],
        deadline: '10 апр 2026', scholarship: true,
    },
    {
        id: 'u5', name: 'Satbayev University', city: 'Алматы',
        logo: '🔬', logoBg: '#fce7f3', match: 76,
        programs: ['Горное дело', 'Металлургия', 'IT'],
        deadline: '5 апр 2026', scholarship: false,
    },
    {
        id: 'u6', name: 'SDU University', city: 'Алматы',
        logo: '🌐', logoBg: '#fff7ed', match: 72,
        programs: ['Бизнес', 'Право', 'IT'],
        deadline: '25 апр 2026', scholarship: true,
    },
]

const BOOKMARKS = [
    { id: '1', emoji: '📐', title: 'Производные и интегралы', type: 'Видео' },
    { id: '2', emoji: '🐍', title: 'Python для школьников',   type: 'Видео' },
    { id: '3', emoji: '⚡', title: 'Законы Ньютона',          type: 'Статья' },
]

const PROGRESS = [
    { subject: 'Математика', pct: 72, color: '#f59e0b' },
    { subject: 'Информатика', pct: 88, color: '#7c3aed' },
    { subject: 'Физика', pct: 45, color: '#3b82f6' },
    { subject: 'Английский', pct: 61, color: '#10b981' },
]

const TYPE_COLORS: Record<ResourceType, string> = {
    Видео: '#2563eb',
    Статья: '#059669',
    Тест: '#d97706',
    Книга: '#7c3aed',
    Задание: '#db2777',
}

/* ── Component ───────────────────────────────────────────────────────────── */
type Props = { language: Language; onLanguageChange: (l: Language) => void }

export function ContentLibraryPage({ language, onLanguageChange }: Props) {
    const [search,  setSearch]  = useState('')
    const [actCat,  setActCat]  = useState('all')
    const [applied, setApplied] = useState<Set<string>>(new Set())

    const filteredResources = RESOURCES.filter(r => {
        const matchCat = actCat === 'all' || SUBJECT_TO_CAT[r.subject] === actCat
        const matchQ   = r.title.toLowerCase().includes(search.toLowerCase()) ||
                         r.subject.toLowerCase().includes(search.toLowerCase())
        return matchCat && matchQ
    })

    const handleApply = (id: string) => {
        setApplied(prev => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    return (
        <CourseShellLayout language={language} onLanguageChange={onLanguageChange} title="Библиотека знаний" activePage="library">
            <div className="lib-page">

                {/* ── Hero ── */}
                <div className="lib-hero">
                    <div className="lib-hero-text">
                        <h1>📚 Библиотека Знаний</h1>
                        <p>Учебные материалы, ресурсы ЕНТ и рекомендации университетов — всё в одном месте.</p>
                    </div>
                    <div className="lib-hero-stats">
                        <div className="lib-hero-stat"><strong>2 400+</strong><span>ресурсов</span></div>
                        <div className="lib-hero-stat"><strong>48</strong><span>вузов</span></div>
                        <div className="lib-hero-stat"><strong>12</strong><span>предметов</span></div>
                    </div>
                </div>

                {/* ── Search ── */}
                <div className="lib-search-bar">
                    <Search size={16} className="lib-search-icon" />
                    <input
                        placeholder="Поиск по названию или предмету..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {/* ── Category tabs ── */}
                <div className="lib-cats">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            type="button"
                            className={`lib-cat-btn${actCat === cat.id ? ' active' : ''}`}
                            onClick={() => setActCat(cat.id)}
                        >
                            {cat.icon} {cat.label}
                        </button>
                    ))}
                </div>

                {/* ── Body ── */}
                <div className="lib-body">
                    {/* Main content */}
                    <div>
                        {/* Resources */}
                        <h2 className="lib-section-title">
                            <Book size={18} color="#7c3aed" />
                            Учебные материалы
                        </h2>

                        {filteredResources.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af' }}>
                                <Library size={40} style={{ opacity: 0.3, marginBottom: 8 }} />
                                <p style={{ margin: 0, fontWeight: 600 }}>Ничего не найдено</p>
                                <p style={{ margin: '4px 0 0', fontSize: 13 }}>Попробуйте изменить фильтр или запрос</p>
                            </div>
                        ) : (
                            <div className="lib-resources-grid">
                                {filteredResources.map(res => (
                                    <div key={res.id} className="lib-resource-card">
                                        <div className="lib-resource-thumb" style={{ background: res.bg }}>
                                            <span>{res.emoji}</span>
                                            <span
                                                className="lib-resource-type-badge"
                                                style={{ background: TYPE_COLORS[res.type] }}
                                            >
                                                {res.type}
                                            </span>
                                        </div>
                                        <div className="lib-resource-body">
                                            <div className="lib-resource-subject">{res.subject}</div>
                                            <h4 className="lib-resource-title">{res.title}</h4>
                                            <div className="lib-resource-meta">
                                                <span className="lib-resource-rating">
                                                    <Star size={11} fill="#f59e0b" />
                                                    {res.rating}
                                                </span>
                                                <span>
                                                    <Clock size={11} />
                                                    {res.views.toLocaleString('ru')}
                                                </span>
                                                <span className="lib-resource-level">{res.level}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Universities */}
                        <h2 className="lib-section-title" style={{ marginTop: 12 }}>
                            <GraduationCap size={18} color="#7c3aed" />
                            Рекомендации вузов
                        </h2>
                        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16, marginTop: -10 }}>
                            Подобрано на основе ваших оценок и интересов
                        </p>

                        <div className="lib-uni-grid">
                            {UNIVERSITIES.map(uni => (
                                <div key={uni.id} className="lib-uni-card">
                                    <div className="lib-uni-header">
                                        <div className="lib-uni-logo" style={{ background: uni.logoBg }}>
                                            {uni.logo}
                                        </div>
                                        <div className="lib-uni-info">
                                            <h4>{uni.name}</h4>
                                            <span>{uni.city} {uni.scholarship && '· 🎓 Грант'}</span>
                                        </div>
                                    </div>

                                    <div className="lib-uni-match-bar">
                                        <div className="lib-uni-match-label">
                                            <span>Совпадение профиля</span>
                                            <span>{uni.match}%</span>
                                        </div>
                                        <div className="lib-uni-bar-track">
                                            <div className="lib-uni-bar-fill" style={{ width: `${uni.match}%` }} />
                                        </div>
                                    </div>

                                    <div className="lib-uni-tags">
                                        {uni.programs.map(p => (
                                            <span key={p} className="lib-uni-tag">{p}</span>
                                        ))}
                                    </div>

                                    <div className="lib-uni-footer">
                                        <span className="lib-uni-deadline">
                                            <CalendarDays size={12} />
                                            До {uni.deadline}
                                        </span>
                                        <button
                                            type="button"
                                            className="lib-uni-appl-btn"
                                            style={applied.has(uni.id) ? { background: '#22c55e', boxShadow: 'none' } : {}}
                                            onClick={() => handleApply(uni.id)}
                                        >
                                            {applied.has(uni.id) ? '✓ Отложено' : 'Подробнее'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lib-sidebar">
                        {/* Bookmarks */}
                        <div className="lib-sidebar-card">
                            <h4><BookMarked size={15} color="#7c3aed" /> Закладки</h4>
                            <div className="lib-bookmarks">
                                {BOOKMARKS.map(bm => (
                                    <div key={bm.id} className="lib-bookmark-row">
                                        <div className="lib-bookmark-icon" style={{ background: '#ede9fe' }}>
                                            {bm.emoji}
                                        </div>
                                        <span>{bm.title}</span>
                                        <span className="lib-bookmark-type">{bm.type}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Progress by subject */}
                        <div className="lib-sidebar-card">
                            <h4><TrendingUp size={15} color="#7c3aed" /> Прогресс по предметам</h4>
                            {PROGRESS.map(p => (
                                <div key={p.subject} className="lib-progress-item">
                                    <div className="lib-progress-label">
                                        <span>{p.subject}</span>
                                        <span className="lib-progress-pct">{p.pct}%</span>
                                    </div>
                                    <div className="lib-progress-bar">
                                        <div className="lib-progress-fill" style={{ width: `${p.pct}%`, background: p.color }} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ENT hint card */}
                        <div className="lib-sidebar-card" style={{ background: 'linear-gradient(135deg, #312e81, #4c1d95)', border: 'none' }}>
                            <h4 style={{ color: '#fff' }}>
                                <Star size={15} color="#fbbf24" fill="#fbbf24" />
                                <span style={{ marginLeft: 6 }}>Подготовка к ЕНТ</span>
                            </h4>
                            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, margin: '0 0 12px', lineHeight: 1.5 }}>
                                До ЕНТ 2025 осталось <strong style={{ color: '#fbbf24' }}>142 дня</strong>.
                                Проработайте слабые места по тестам прошлых лет.
                            </p>
                            <button
                                type="button"
                                style={{ width: '100%', padding: '9px', borderRadius: 10, border: 'none', background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                            >
                                Начать подготовку →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </CourseShellLayout>
    )
}
