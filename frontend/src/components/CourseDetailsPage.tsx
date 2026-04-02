import { useEffect, useMemo, useState } from 'react'
import { CirclePlus, PlayCircle, Star } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { courseCatalogData } from '../data/courseCatalogData'
import {
    detailCourse,
    discussionItems,
    faqItems,
    moduleList,
    overviewData,
    reviewData,
    type DetailTab,
} from '../data/courseDetailsData'
import type { Language } from '../i18n/translations'
import { translations } from '../i18n/translations'
import { CourseShellLayout } from './CourseShellLayout'
import { courses as coursesApi, student as studentApi, type CourseDetail } from '../lib/api'

type CourseDetailsPageProps = {
    language: Language
    onLanguageChange: (lang: Language) => void
}

const tabs: DetailTab[] = ['overview', 'faq', 'discussion', 'reviews']

export function CourseDetailsPage({ language, onLanguageChange }: CourseDetailsPageProps) {
    const [activeTab, setActiveTab] = useState<DetailTab>('overview')
    const { courseId } = useParams()
    const navigate = useNavigate()
    const t = translations[language]
    const selectedCourse = courseCatalogData.find((course) => course.id === courseId) ?? courseCatalogData[0]
    const [apiCourse, setApiCourse] = useState<CourseDetail | null>(null)
    const [enrolling, setEnrolling] = useState(false)
    const [enrolled, setEnrolled] = useState(false)

    // Load real course from API
    useEffect(() => {
        if (!courseId) return
        let cancelled = false
            ; (async () => {
                try {
                    const data = await coursesApi.get(courseId)
                    if (!cancelled) setApiCourse(data)
                } catch { /* use mock data */ }
            })()
        return () => { cancelled = true }
    }, [courseId])

    async function handleEnroll() {
        if (!courseId || enrolling) return
        setEnrolling(true)
        try {
            await studentApi.enroll(courseId)
            setEnrolled(true)
        } catch { /* ignore — might already be enrolled */ }
        setEnrolling(false)
    }

    const courseTitle = apiCourse?.title ?? selectedCourse.title
    const courseTeacher = apiCourse?.author ? `${apiCourse.author.firstName} ${apiCourse.author.lastName}` : selectedCourse.teacherName
    const courseModules = apiCourse?.modules ?? []

    const tabLabel = useMemo(
        () => ({
            overview: t.overview,
            faq: t.faq,
            discussion: t.discussion,
            reviews: t.reviews,
        }),
        [t],
    )

    return (
        <CourseShellLayout language={language} onLanguageChange={onLanguageChange} title={t.myCourses} activePage="courses">
            <div className="details-layout">
                <section className="details-main">
                    <article className="video-hero">
                        <img src={selectedCourse.coverUrl} alt={selectedCourse.title} />

                        <div className="video-overlay">
                            <h3>{detailCourse.subtitle}</h3>
                            <p>By {selectedCourse.teacherName}</p>
                        </div>

                        <div className="video-controls">
                            <PlayCircle size={16} />
                            <span>{detailCourse.durationLabel}</span>
                        </div>
                    </article>

                    <article className="details-card">
                        <div className="details-title-row">
                            <div>
                                <h2>{courseTitle}</h2>
                                <p className="details-meta">{courseTeacher} | {detailCourse.category} | + Follow</p>
                            </div>
                            <div style={{ display: 'flex', gap: 10 }}>
                                <button
                                    type="button"
                                    className="mentor-btn"
                                    style={{ background: 'var(--accent)', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: 6 }}
                                    onClick={() => navigate(`/courses/${courseId}/lesson/l1`)}
                                >
                                    <PlayCircle size={15} /> Начать обучение
                                </button>
                                {!enrolled ? (
                                    <button type="button" className="mentor-btn" onClick={handleEnroll} disabled={enrolling}>
                                        {enrolling ? 'Записываемся...' : 'Записаться'}
                                    </button>
                                ) : (
                                    <button type="button" className="mentor-btn" disabled style={{ opacity: 0.6 }}>
                                        ✅ Записаны
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="tabs-row" aria-label="Course detail tabs">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    type="button"
                                    className={activeTab === tab ? 'tab-btn active' : 'tab-btn'}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tabLabel[tab]}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'overview' && (
                            <div className="tab-panel">
                                <h4>{t.courseDescription}</h4>
                                <p>{overviewData.description}</p>

                                <h4>{t.courseOutcomes}</h4>
                                <ul className="outcomes-grid">
                                    {overviewData.outcomes.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>

                                <h4>{t.audience}</h4>
                                <p>{overviewData.audience}</p>
                            </div>
                        )}

                        {activeTab === 'faq' && (
                            <div className="tab-panel faq-list">
                                {faqItems.map((item) => (
                                    <article key={item.title} className="faq-item">
                                        <div>
                                            <h5>{item.title}</h5>
                                            {item.expanded && <p>{item.answer}</p>}
                                        </div>
                                        <button type="button" aria-label="Toggle FAQ item">
                                            {item.expanded ? '?' : '+'}
                                        </button>
                                    </article>
                                ))}
                            </div>
                        )}

                        {activeTab === 'discussion' && (
                            <div className="tab-panel discussion-list">
                                {discussionItems.map((item) => (
                                    <article key={item.id} className="discussion-item">
                                        <img src={item.avatar} alt={item.author} />
                                        <div>
                                            <h5>{item.author}</h5>
                                            <p className="discussion-meta">{item.roleMeta}</p>
                                            <p>{item.body}</p>
                                        </div>
                                    </article>
                                ))}

                                <button type="button" className="floating-write" aria-label="Write discussion post">
                                    <CirclePlus size={18} />
                                </button>
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="tab-panel">
                                <div className="rating-grid">
                                    <article className="average-box">
                                        <p>{t.averageRating}</p>
                                        <strong>{reviewData.average}</strong>
                                        <div className="stars-row" aria-label="Average rating stars">
                                            {Array.from({ length: 5 }, (_, i) => (
                                                <Star key={i} size={12} fill="#f6b940" color="#f6b940" />
                                            ))}
                                        </div>
                                    </article>

                                    <article>
                                        <p>{t.detailedRating}</p>
                                        <div className="rating-lines">
                                            {reviewData.breakdown.map((line) => (
                                                <div key={line.stars} className="rating-line">
                                                    <span>{line.percent}%</span>
                                                    <span>{line.stars}?</span>
                                                    <progress value={line.percent} max={100} />
                                                </div>
                                            ))}
                                        </div>
                                    </article>
                                </div>

                                <article className="featured-review">
                                    <img src={reviewData.featured.avatar} alt={reviewData.featured.name} />
                                    <div>
                                        <h5>{reviewData.featured.name}</h5>
                                        <div className="stars-row" aria-label="Featured review stars">
                                            {Array.from({ length: reviewData.featured.rating }, (_, i) => (
                                                <Star key={i} size={12} fill="#f6b940" color="#f6b940" />
                                            ))}
                                        </div>
                                        <p>{reviewData.featured.text}</p>
                                    </div>
                                </article>

                                <form className="review-form" onSubmit={(e) => e.preventDefault()}>
                                    <textarea placeholder="Make feedback here..." aria-label="Review feedback" />
                                    <button type="submit">{t.submit}</button>
                                </form>
                            </div>
                        )}
                    </article>
                </section>

                <aside className="details-outline">
                    <h3>{t.courseContent}</h3>
                    <p className="outline-meta">
                        {courseModules.length > 0
                            ? `${courseModules.length} модулей · ${courseModules.reduce((s, m) => s + m.lessons.length, 0)} уроков`
                            : `${t.lecture} (15) ${t.total} (5.5 hrs)`}
                    </p>

                    <div className="module-list">
                        {courseModules.length > 0 ? (
                            courseModules.map((mod) => (
                                <article key={mod.id} className="module-item">
                                    <div className="module-head">
                                        <div>
                                            <h4>{mod.title}</h4>
                                        </div>
                                        <small>{mod.lessons.length} {t.lecture}</small>
                                    </div>
                                    <ul className="module-children">
                                        {mod.lessons.map((les) => (
                                            <li key={les.id}>
                                                <span>{les.title}</span>
                                                <small>{les.type}</small>
                                            </li>
                                        ))}
                                    </ul>
                                </article>
                            ))
                        ) : (
                            moduleList.map((module) => (
                                <article key={module.title} className={module.active ? 'module-item active' : 'module-item'}>
                                    <div className="module-head">
                                        <div>
                                            <h4>{module.title.replace('Module', t.module)}</h4>
                                            <p>{module.subtitle}</p>
                                        </div>
                                        <small>{module.lessons} {t.lecture} · {module.minutes} min</small>
                                    </div>

                                    {module.children && (
                                        <ul className="module-children">
                                            {module.children.map((child) => (
                                                <li key={child.title}>
                                                    <span>{child.title}</span>
                                                    <small>{child.meta}</small>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </article>
                            ))
                        )}
                    </div>
                </aside>
            </div>
        </CourseShellLayout>
    )
}

