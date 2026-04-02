import { Star, Users, BookOpen, MessageCircle } from 'lucide-react'
import type { Language } from '../i18n/translations'
import { RoleShellLayout } from './RoleShellLayout'
import { rolePath } from '../lib/roleUtils'
import { useParams, useNavigate } from 'react-router-dom'

export function TeacherProfilePage({ language, onLanguageChange }: { language: Language; onLanguageChange: (l: Language) => void }) {
    useParams<{ id: string }>()
    const navigate = useNavigate()

    // Mock data - in production, fetch from API
    const teacher = {
        name: 'Айгерим Сдыкова',
        bio: 'Senior UX/UI Designer с 8+ лет опыта. Обучала более 500 студентов. Специалист в Figma и дизайн-системах.',
        rating: 4.8,
        reviews: 127,
        students: 423,
        courses: 3,
        avatar: 'А С',
        courses_list: [
            { title: 'Figma Basic to Advance', students: 98, rating: 4.9 },
            { title: 'UI/UX Masterclass', students: 156, rating: 4.8 },
            { title: 'Graphic Design Pro', students: 74, rating: 4.7 },
        ],
    }

    return (
        <RoleShellLayout language={language} onLanguageChange={onLanguageChange}>
            <div className="tp-root">
                <div className="tp-card">
                    <div className="tp-header">
                        <div className="tp-avatar-large">{teacher.avatar}</div>
                        <div className="tp-info">
                            <h1 className="tp-name">{teacher.name}</h1>
                            <p className="tp-bio">{teacher.bio}</p>
                            <div className="tp-stats">
                                <div className="tp-stat">
                                    <Star size={14} />
                                    <span>{teacher.rating} ({teacher.reviews} отзывов)</span>
                                </div>
                                <div className="tp-stat">
                                    <Users size={14} />
                                    <span>{teacher.students} студентов</span>
                                </div>
                                <div className="tp-stat">
                                    <BookOpen size={14} />
                                    <span>{teacher.courses} курсов</span>
                                </div>
                            </div>
                        </div>
                        <button type="button" className="tp-btn primary" onClick={() => navigate(rolePath('/chat'))}>
                            <MessageCircle size={16} /> Написать
                        </button>
                    </div>
                </div>

                <div className="tp-section">
                    <h2 className="tp-section-title">Курсы</h2>
                    <div className="tp-courses-grid">
                        {teacher.courses_list.map((c, i) => (
                            <div key={i} className="tp-course-card">
                                <h3>{c.title}</h3>
                                <div className="tp-course-meta">
                                    <span><Users size={12} /> {c.students}</span>
                                    <span><Star size={12} /> {c.rating}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </RoleShellLayout>
    )
}
