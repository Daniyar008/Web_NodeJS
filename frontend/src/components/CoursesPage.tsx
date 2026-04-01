import { Link } from 'react-router-dom'
import { courseCatalogData } from '../data/courseCatalogData'
import { CourseShellLayout } from './CourseShellLayout'
import type { Language } from '../i18n/translations'
import { translations } from '../i18n/translations'

type CoursesPageProps = {
    language: Language
    onLanguageChange: (lang: Language) => void
}

export function CoursesPage({ language, onLanguageChange }: CoursesPageProps) {
    const t = translations[language]

    return (
        <CourseShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title={t.myCourses}
            includeCategoryFilter
        >
            <div className="courses-grid">
                {courseCatalogData.map((course) => {
                    const completed = course.progress >= 100

                    return (
                        <Link key={course.id} to={`/courses/${course.id}`} className="course-card-link">
                            <article className="course-card">
                                <img src={course.coverUrl} alt={course.title} className="course-cover" loading="lazy" />

                                <div className="course-body">
                                    <h3>{course.title}</h3>

                                    <div className="course-teacher">
                                        <img src={course.teacherAvatar} alt={course.teacherName} className="teacher-avatar" />
                                        <p>{course.teacherName}</p>
                                    </div>

                                    <p className="course-meta">
                                        {course.lessons} {t.lessons} · {course.hours} {t.hours}
                                    </p>

                                    {completed ? (
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
        </CourseShellLayout>
    )
}

