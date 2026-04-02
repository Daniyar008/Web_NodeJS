import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { courseCatalogData } from '../data/courseCatalogData'
import { student, type EnrolledCourse, type CourseListItem } from '../lib/api'
import { CourseShellLayout } from './CourseShellLayout'
import { ParentShellLayout } from './ParentShellLayout'
import type { Language } from '../i18n/translations'
import { translations } from '../i18n/translations'

type CoursesPageProps = {
    language: Language
    onLanguageChange: (lang: Language) => void
    variant?: 'student' | 'parent'
}

interface DisplayCourse {
    id: string
    title: string
    coverUrl: string
    teacherName: string
    teacherAvatar: string
    lessons: number
    hours: string
    progress: number
}

function enrolledToDisplay(enrolled: EnrolledCourse[]): DisplayCourse[] {
    return enrolled.map((e) => {
        const totalLessons = e.course.modules?.reduce((s, m) => s + (m.lessons?.length ?? 0), 0) ?? 0
        const completedLessons = e.progress?.filter((p) => p.completed).length ?? 0
        const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
        return {
            id: e.course.id,
            title: e.course.title,
            coverUrl: e.course.coverUrl ?? '/placeholder-course.svg',
            teacherName: `${e.course.author?.firstName ?? ''} ${e.course.author?.lastName ?? ''}`.trim() || 'Instructor',
            teacherAvatar: '',
            lessons: totalLessons,
            hours: `${Math.ceil(totalLessons * 0.5)}`,
            progress: percent,
        }
    })
}

function availableToDisplay(available: CourseListItem[]): DisplayCourse[] {
    return available.map((c) => ({
        id: c.id,
        title: c.title,
        coverUrl: c.coverUrl ?? '/placeholder-course.svg',
        teacherName: `${c.author?.firstName ?? ''} ${c.author?.lastName ?? ''}`.trim() || 'Instructor',
        teacherAvatar: '',
        lessons: c._count?.modules ?? 0,
        hours: '—',
        progress: -1, // not enrolled
    }))
}

export function CoursesPage({ language, onLanguageChange, variant = 'student' }: CoursesPageProps) {
    const t = translations[language]
    const [displayCourses, setDisplayCourses] = useState<DisplayCourse[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let cancelled = false
        async function load() {
            try {
                const [enrolled, available] = await Promise.all([
                    student.coursesEnrolled(),
                    student.coursesAvailable(),
                ])
                if (cancelled) return
                const items = [
                    ...enrolledToDisplay(enrolled),
                    ...availableToDisplay(available),
                ]
                setDisplayCourses(items)
            } catch {
                // Fallback to mock data when API unreachable or user not authenticated
                if (!cancelled) {
                    setDisplayCourses(courseCatalogData.map((c) => ({
                        id: c.id,
                        title: c.title,
                        coverUrl: c.coverUrl,
                        teacherName: c.teacherName,
                        teacherAvatar: c.teacherAvatar,
                        lessons: c.lessons,
                        hours: String(c.hours),
                        progress: c.progress,
                    })))
                }
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        load()
        return () => { cancelled = true }
    }, [])

    const content = loading ? (
        <div className="courses-grid" style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: 'var(--text-secondary)' }}>Загрузка курсов…</p>
        </div>
    ) : (
        <div className="courses-grid">
            {displayCourses.map((course) => {
                const completed = course.progress >= 100
                const notEnrolled = course.progress < 0

                return (
                    <Link key={course.id} to={`/courses/${course.id}`} className="course-card-link">
                        <article className="course-card">
                            {course.coverUrl ? (
                                <img src={course.coverUrl} alt={course.title} className="course-cover" loading="lazy" />
                            ) : (
                                <div className="course-cover" style={{ background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'var(--accent)' }}>📚</div>
                            )}

                            <div className="course-body">
                                <h3>{course.title}</h3>

                                <div className="course-teacher">
                                    {course.teacherAvatar ? (
                                        <img src={course.teacherAvatar} alt={course.teacherName} className="teacher-avatar" />
                                    ) : (
                                        <span className="teacher-avatar" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontSize: 12, fontWeight: 600 }}>
                                            {course.teacherName.charAt(0)}
                                        </span>
                                    )}
                                    <p>{course.teacherName}</p>
                                </div>

                                <p className="course-meta">
                                    {course.lessons} {t.lessons} · {course.hours} {t.hours}
                                </p>

                                {notEnrolled ? (
                                    <p className="course-status" style={{ color: 'var(--accent)' }}>Записаться</p>
                                ) : completed ? (
                                    <p className="course-status done">{t.completed}</p>
                                ) : (
                                    <div className="course-progress">
                                        <progress className="bar" value={course.progress} max={100} aria-label={`${course.title} progress`} />
                                        <small>{course.progress}%</small>
                                    </div>
                                )}
                            </div>
                        </article>
                    </Link>
                )
            })}
        </div>
    )

    if (variant === 'parent') {
        return (
            <ParentShellLayout
                language={language}
                onLanguageChange={onLanguageChange}
                title="Курсы Анны"
                subtitle="Записанные курсы и прогресс"
                activePage="p-courses"
            >
                {content}
            </ParentShellLayout>
        )
    }

    return (
        <CourseShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title={t.myCourses}
            includeCategoryFilter
        >
            {content}
        </CourseShellLayout>
    )
}

