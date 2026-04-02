import { useState } from 'react'
import { BookOpen, Edit2, Eye, Plus, Star, Trash2, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Language } from '../i18n/translations'
import { TeacherShellLayout } from './TeacherShellLayout'

type Props = { language: Language; onLanguageChange: (l: Language) => void }

type CourseStatus = 'published' | 'draft' | 'review'

type TeacherCourse = {
    id: string
    title: string
    category: string
    cover: string
    status: CourseStatus
    students: number
    lessons: number
    rating: number
    updatedAt: string
}

const INITIAL_COURSES: TeacherCourse[] = [
    {
        id: 'c1',
        title: 'Figma Basic to Advance',
        category: 'Design',
        cover: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=70',
        status: 'published',
        students: 98,
        lessons: 24,
        rating: 4.9,
        updatedAt: '28 марта 2026',
    },
    {
        id: 'c2',
        title: 'Graphic Design Pro',
        category: 'Design',
        cover: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=70',
        status: 'published',
        students: 74,
        lessons: 18,
        rating: 4.7,
        updatedAt: '20 марта 2026',
    },
    {
        id: 'c3',
        title: 'UI/UX Masterclass',
        category: 'UX',
        cover: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=600&q=70',
        status: 'review',
        students: 56,
        lessons: 30,
        rating: 4.8,
        updatedAt: '1 апреля 2026',
    },
    {
        id: 'c4',
        title: 'Illustration Camp',
        category: 'Illustration',
        cover: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=600&q=70',
        status: 'draft',
        students: 0,
        lessons: 12,
        rating: 0,
        updatedAt: '25 марта 2026',
    },
]

const STATUS_LABEL: Record<CourseStatus, string> = {
    published: 'Опубликован',
    draft: 'Черновик',
    review: 'На проверке',
}

const FILTER_OPTIONS = [
    { key: 'all', label: 'Все' },
    { key: 'published', label: 'Опубликованные' },
    { key: 'draft', label: 'Черновики' },
    { key: 'review', label: 'На проверке' },
]

export function TeacherCoursesPage({ language, onLanguageChange }: Props) {
    const navigate = useNavigate()
    const [courses, setCourses] = useState<TeacherCourse[]>(INITIAL_COURSES)
    const [filter, setFilter] = useState<'all' | CourseStatus>('all')

    const visible = filter === 'all' ? courses : courses.filter((c) => c.status === filter)

    function deleteCourse(id: string) {
        setCourses((prev) => prev.filter((c) => c.id !== id))
    }

    function togglePublish(id: string) {
        setCourses((prev) =>
            prev.map((c) => {
                if (c.id !== id) return c
                return { ...c, status: c.status === 'published' ? 'draft' : 'published' }
            }),
        )
    }

    return (
        <TeacherShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Мои курсы"
            activePage="t-courses"
        >
            <div className="tc-root">

                {/* ── Toolbar ───────────────────────────────────────────────────── */}
                <div className="tc-toolbar">
                    <div className="tc-filters">
                        {FILTER_OPTIONS.map((f) => (
                            <button
                                key={f.key}
                                type="button"
                                className={`tc-filter-btn ${filter === f.key ? 'active' : ''}`}
                                onClick={() => setFilter(f.key as typeof filter)}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                    <button
                        type="button"
                        className="tc-new-btn"
                        onClick={() => navigate('/teacher/courses/new')}
                    >
                        <Plus size={15} /> Новый курс
                    </button>
                </div>

                {/* ── Grid ──────────────────────────────────────────────────────── */}
                {visible.length === 0 ? (
                    <div className="tc-empty">
                        <BookOpen size={40} />
                        <p>Нет курсов в этой категории</p>
                        <button type="button" className="tc-new-btn" onClick={() => navigate('/teacher/courses/new')}>
                            <Plus size={15} /> Создать первый курс
                        </button>
                    </div>
                ) : (
                    <div className="tc-grid">
                        {visible.map((c) => (
                            <div key={c.id} className="tc-card">
                                <div className="tc-card-cover">
                                    <img src={c.cover} alt={c.title} />
                                    <span className={`tc-badge ${c.status}`}>{STATUS_LABEL[c.status]}</span>
                                </div>
                                <div className="tc-card-body">
                                    <span className="tc-card-category">{c.category}</span>
                                    <h3 className="tc-card-title">{c.title}</h3>
                                    <div className="tc-card-meta">
                                        <span><Users size={12} /> {c.students} студ.</span>
                                        <span><BookOpen size={12} /> {c.lessons} уроков</span>
                                        {c.rating > 0 && (
                                            <span><Star size={12} /> {c.rating}</span>
                                        )}
                                    </div>
                                    <span className="tc-card-updated">Обновлён: {c.updatedAt}</span>
                                    <div className="tc-card-actions">
                                        <button
                                            type="button"
                                            className="tc-action-btn preview"
                                            onClick={() => navigate(`/courses/${c.id}`)}
                                            title="Предпросмотр"
                                        >
                                            <Eye size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            className="tc-action-btn edit"
                                            onClick={() => navigate('/teacher/courses/new', { state: { editId: c.id, editTitle: c.title } })}
                                            title="Редактировать"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            className="tc-action-btn delete"
                                            onClick={() => deleteCourse(c.id)}
                                            title="Удалить"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                        <button
                                            type="button"
                                            className={`tc-publish-btn ${c.status === 'published' ? 'unpublish' : ''}`}
                                            onClick={() => togglePublish(c.id)}
                                        >
                                            {c.status === 'published' ? 'Снять с публикации' : 'Опубликовать'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </TeacherShellLayout>
    )
}
