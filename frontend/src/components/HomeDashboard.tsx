import { useState, useRef, useEffect } from 'react'
import {
    ArrowRight,
    Bell,
    Bookmark,
    BookmarkCheck,
    ChevronLeft,
    ChevronRight,
    Flame,
    Play,
    Star,
    TrendingUp,
    UserPlus,
    UserCheck,
    Users,
    Zap,
} from 'lucide-react'
import { CourseShellLayout } from './CourseShellLayout'
import type { Language } from '../i18n/translations'
import type {
    ActivityPoint,
    ContinueCourse,
    CourseProgress,
    LessonRow,
    MentorItem,
} from '../data/homeDashboardData'
import {
    activityData,
    announcements,
    continueCourses,
    courseProgress,
    lessons,
    mentors,
} from '../data/homeDashboardData'

// ─── Props ────────────────────────────────────────────────────────────────────
interface HomeDashboardProps {
    language: Language
    onLanguageChange: (lang: Language) => void
}

// ─── Mini bar chart ───────────────────────────────────────────────────────────
function ActivityChart({ data }: { data: ActivityPoint[] }) {
    const max = Math.max(...data.map((d) => d.value))
    return (
        <div className="db-chart">
            <div className="db-chart-bars">
                {data.map((d) => (
                    <div key={d.label} className="db-chart-col">
                        <div
                            className="db-chart-bar"
                            style={{ height: `${(d.value / max) * 100}%` }}
                        />
                        <span className="db-chart-label">{d.label}</span>
                    </div>
                ))}
            </div>
            <div className="db-chart-yaxis">
                {[60, 40, 20].map((v) => (
                    <span key={v}>{v}</span>
                ))}
            </div>
        </div>
    )
}

// ─── Radial progress ring ─────────────────────────────────────────────────────
function RadialProgress({ percent, color }: { percent: number; color: string }) {
    const r = 36
    const circ = 2 * Math.PI * r
    const dash = (percent / 100) * circ
    return (
        <svg width="88" height="88" viewBox="0 0 88 88" className="db-radial">
            <circle cx="44" cy="44" r={r} fill="none" stroke="#e8edf5" strokeWidth="7" />
            <circle
                cx="44"
                cy="44"
                r={r}
                fill="none"
                stroke={color}
                strokeWidth="7"
                strokeDasharray={`${dash} ${circ - dash}`}
                strokeLinecap="round"
                transform="rotate(-90 44 44)"
            />
            <text x="44" y="48" textAnchor="middle" fill={color} fontSize="13" fontWeight="800">
                {percent}%
            </text>
        </svg>
    )
}

// ─── Course progress pill ─────────────────────────────────────────────────────
function ProgressPill({ course }: { course: CourseProgress }) {
    const pct = Math.round((course.watched / course.total) * 100)
    return (
        <div className="db-prog-pill">
            <div className="db-prog-icon" style={{ background: course.bgColor, color: course.categoryColor }}>
                <span>{course.icon}</span>
            </div>
            <div className="db-prog-info">
                <div className="db-prog-meta">
                    <span className="db-prog-watched">{course.watched}/{course.total} просмотрено</span>
                    <span className="db-prog-dots">⋯</span>
                </div>
                <p className="db-prog-title">{course.title}</p>
                <div className="db-prog-bar">
                    <div className="db-prog-fill" style={{ width: `${pct}%`, background: course.categoryColor }} />
                </div>
            </div>
        </div>
    )
}

// ─── Continue course card ─────────────────────────────────────────────────────
function CourseCard({ course }: { course: ContinueCourse }) {
    const [bookmarked, setBookmarked] = useState(false)
    return (
        <div className="db-course-card">
            <div className="db-course-thumb">
                <img src={course.thumbnail} alt={course.title} loading="lazy" />
                <button
                    type="button"
                    className={`db-bookmark ${bookmarked ? 'active' : ''}`}
                    onClick={() => setBookmarked((p) => !p)}
                    aria-label="Bookmark"
                >
                    {bookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                </button>
                <button type="button" className="db-play-btn" aria-label="Play">
                    <Play size={14} fill="currentColor" />
                </button>
            </div>
            <div className="db-course-body">
                <span
                    className="db-course-cat"
                    style={{ background: course.categoryBg, color: course.categoryColor }}
                >
                    ☰ {course.category}
                </span>
                <p className="db-course-title">{course.title}</p>
                <div className="db-course-footer">
                    <div className="db-course-mentor">
                        <span className="db-avatar-xs" style={{ background: course.categoryColor }}>
                            {course.mentorAvatar}
                        </span>
                        <span className="db-mentor-name">{course.mentor}</span>
                        <span className="db-mentor-role">Ментор</span>
                    </div>
                    <span className="db-course-dur">⏱ {course.duration}</span>
                </div>
                <div className="db-course-prog-bar">
                    <div className="db-course-prog-fill" style={{ width: `${course.progress}%` }} />
                </div>
                <span className="db-course-pct">{course.progress}% завершено</span>
            </div>
        </div>
    )
}

// ─── Lesson row ───────────────────────────────────────────────────────────────
function LessonItem({ row }: { row: LessonRow }) {
    return (
        <div className="db-lesson-row">
            <div className="db-lesson-mentor">
                <span className="db-avatar-sm" style={{ background: row.typeColor }}>
                    {row.mentorAvatar}
                </span>
                <div>
                    <p className="db-lesson-name">{row.mentor}</p>
                    <p className="db-lesson-role">{row.date}</p>
                </div>
            </div>
            <span className="db-lesson-tag" style={{ background: row.typeBg, color: row.typeColor }}>
                ☰ {row.type}
            </span>
            <p className="db-lesson-desc">{row.description}</p>
            <button type="button" className="db-lesson-btn" aria-label="Go to lesson">
                <ArrowRight size={14} />
            </button>
        </div>
    )
}

// ─── Mentor card ──────────────────────────────────────────────────────────────
function MentorCard({ mentor, onToggle }: { mentor: MentorItem; onToggle: (id: string) => void }) {
    const colors = ['#7c6cf8', '#43c38d', '#f48f5e', '#5cc8d4']
    const color = colors[mentor.id.charCodeAt(1) % colors.length]
    return (
        <div className="db-mentor-card">
            <span className="db-avatar-md" style={{ background: color }}>{mentor.avatar}</span>
            <div className="db-mentor-info">
                <p className="db-mentor-nm">{mentor.name}</p>
                <p className="db-mentor-sp">{mentor.specialty}</p>
                <p className="db-mentor-st"><Users size={10} /> {mentor.students.toLocaleString()} студентов</p>
            </div>
            <button
                type="button"
                className={`db-follow-btn ${mentor.following ? 'following' : ''}`}
                onClick={() => onToggle(mentor.id)}
            >
                {mentor.following ? <><UserCheck size={12} /> Подписан</> : <><UserPlus size={12} /> Подписаться</>}
            </button>
        </div>
    )
}

// ─── Main component ───────────────────────────────────────────────────────────
export function HomeDashboard({ language, onLanguageChange }: HomeDashboardProps) {
    const [mentorList, setMentorList] = useState<MentorItem[]>(mentors)
    const [, setSlideIndex] = useState(0)
    const [streak] = useState(14)
    const [totalXP] = useState(3240)
    const scrollRef = useRef<HTMLDivElement>(null)

    // greeting
    const hour = new Date().getHours()
    const greeting =
        hour < 12 ? 'Доброе утро' : hour < 18 ? 'Добрый день' : 'Добрый вечер'

    const toggleFollow = (id: string) => {
        setMentorList((prev) =>
            prev.map((m) => (m.id === id ? { ...m, following: !m.following } : m))
        )
    }

    const scroll = (dir: 1 | -1) => {
        const el = scrollRef.current
        if (!el) return
        el.scrollBy({ left: dir * 280, behavior: 'smooth' })
        setSlideIndex((p) => Math.max(0, Math.min(continueCourses.length - 1, p + dir)))
    }

    // Animate bars on mount
    const [barsMounted, setBarsMounted] = useState(false)
    useEffect(() => {
        const t = setTimeout(() => setBarsMounted(true), 200)
        return () => clearTimeout(t)
    }, [])

    const overallProgress = Math.round(
        courseProgress.reduce((acc, c) => acc + c.watched / c.total, 0) / courseProgress.length * 100
    )

    return (
        <CourseShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Дашборд"
            activePage="dashboard"
        >
            <div className="db-page">

                {/* ── Left column ─────────────────────────────────────────────── */}
                <div className="db-main">

                    {/* Hero banner */}
                    <div className="db-hero">
                        <div className="db-hero-text">
                            <span className="db-hero-eyebrow">ОНЛАЙН КУРСЫ</span>
                            <h2 className="db-hero-title">Развивай навыки с профессиональными онлайн-курсами</h2>
                            <button type="button" className="db-hero-btn">
                                Начать сейчас <ArrowRight size={14} />
                            </button>
                        </div>
                        <div className="db-hero-deco" aria-hidden="true">
                            <span className="db-hero-star s1">✦</span>
                            <span className="db-hero-star s2">✦</span>
                            <span className="db-hero-star s3">✦</span>
                        </div>
                    </div>

                    {/* Course progress pills */}
                    <div className="db-progress-row">
                        {courseProgress.map((cp) => (
                            <ProgressPill key={cp.id} course={cp} />
                        ))}
                    </div>

                    {/* Continue watching */}
                    <div className="db-section-head">
                        <h3 className="db-section-title">Продолжить просмотр</h3>
                        <div className="db-scroll-btns">
                            <button type="button" className="db-scroll-btn" onClick={() => scroll(-1)} aria-label="Previous">
                                <ChevronLeft size={15} />
                            </button>
                            <button type="button" className="db-scroll-btn" onClick={() => scroll(1)} aria-label="Next">
                                <ChevronRight size={15} />
                            </button>
                        </div>
                    </div>
                    <div className="db-courses-scroll" ref={scrollRef}>
                        {continueCourses.map((c) => (
                            <CourseCard key={c.id} course={c} />
                        ))}
                    </div>

                    {/* Your lessons */}
                    <div className="db-section-head">
                        <h3 className="db-section-title">Ваши уроки</h3>
                        <button type="button" className="db-see-all">Все уроки</button>
                    </div>
                    <div className="db-lessons-panel">
                        <div className="db-lessons-head">
                            <span>Ментор</span>
                            <span>Тип</span>
                            <span>Описание</span>
                            <span />
                        </div>
                        {lessons.map((l) => (
                            <LessonItem key={l.id} row={l} />
                        ))}
                    </div>
                </div>

                {/* ── Right sidebar ────────────────────────────────────────────── */}
                <aside className="db-sidebar">

                    {/* Greeting + stat ring */}
                    <div className="db-stat-card">
                        <div className="db-stat-top">
                            <div className="db-stat-avatar">MN</div>
                            <div>
                                <p className="db-stat-greeting">{greeting}, Martin 🔥</p>
                                <p className="db-stat-sub">Продолжай учиться — ты на пути к цели!</p>
                            </div>
                        </div>
                        <div className="db-stat-metrics">
                            <div className="db-stat-ring">
                                <RadialProgress percent={overallProgress} color="#7c6cf8" />
                                <span className="db-stat-ring-label">Прогресс</span>
                            </div>
                            <div className="db-stat-nums">
                                <div className="db-stat-num">
                                    <Flame size={14} className="db-stat-icon flame" />
                                    <span className="db-stat-val">{streak}</span>
                                    <span className="db-stat-key">дней подряд</span>
                                </div>
                                <div className="db-stat-num">
                                    <Zap size={14} className="db-stat-icon zap" />
                                    <span className="db-stat-val">{totalXP.toLocaleString()}</span>
                                    <span className="db-stat-key">XP очков</span>
                                </div>
                                <div className="db-stat-num">
                                    <Star size={14} className="db-stat-icon star" />
                                    <span className="db-stat-val">4.8</span>
                                    <span className="db-stat-key">средний балл</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Activity chart */}
                    <div className="db-widget">
                        <div className="db-widget-head">
                            <span className="db-widget-title">Активность</span>
                            <TrendingUp size={14} className="db-widget-icon" />
                        </div>
                        <div className={`db-chart-wrap ${barsMounted ? 'mounted' : ''}`}>
                            <ActivityChart data={activityData} />
                        </div>
                    </div>

                    {/* Announcements */}
                    <div className="db-widget">
                        <div className="db-widget-head">
                            <span className="db-widget-title">Уведомления</span>
                            <Bell size={14} className="db-widget-icon" />
                        </div>
                        <div className="db-announce-list">
                            {announcements.map((a) => (
                                <div key={a.id} className="db-announce" style={{ background: a.color }}>
                                    <span className="db-announce-icon">{a.icon}</span>
                                    <div>
                                        <p className="db-announce-title">{a.title}</p>
                                        <p className="db-announce-body">{a.body}</p>
                                        <p className="db-announce-time">{a.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mentors */}
                    <div className="db-widget">
                        <div className="db-widget-head">
                            <span className="db-widget-title">Ваши менторы</span>
                            <button type="button" className="db-widget-btn">+ Найти</button>
                        </div>
                        <div className="db-mentor-list">
                            {mentorList.map((m) => (
                                <MentorCard key={m.id} mentor={m} onToggle={toggleFollow} />
                            ))}
                        </div>
                        <button type="button" className="db-see-all-btn">Все менторы</button>
                    </div>

                </aside>
            </div>
        </CourseShellLayout>
    )
}
