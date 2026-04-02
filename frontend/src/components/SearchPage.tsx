
import { Search, Book, Users, Award } from 'lucide-react'
import type { Language } from '../i18n/translations'
import { RoleShellLayout } from './RoleShellLayout'
import { useSearchParams } from 'react-router-dom'

const SEARCH_DB = {
    courses: [
        { id: 'c1', title: 'Figma Basic to Advance', icon: '🎨', desc: 'Complete design course from basics to advanced projects' },
        { id: 'c2', title: 'UI/UX Masterclass', icon: '✨', desc: 'Learn professional UI/UX design patterns and practices' },
        { id: 'c3', title: 'Graphic Design Pro', icon: '🖼️', desc: 'Master graphics, typography, and visual hierarchy' },
    ],
    teachers: [
        { id: 't1', name: 'Айгерим Сдыкова', courses: 3, rating: 4.8, avatar: 'АС' },
        { id: 't2', name: 'Марат Жанглиев', courses: 5, rating: 4.9, avatar: 'МЖ' },
        { id: 't3', name: 'Зарина Рахимова', courses: 2, rating: 4.7, avatar: 'ЗР' },
    ],
    articles: [
        { id: 'a1', title: 'Основы цвета в дизайне', cat: 'Design Theory', time: '5 мин чтения' },
        { id: 'a2', title: 'Типография для начинающих', cat: 'Design Theory', time: '8 мин чтения' },
        { id: 'a3', title: 'User Research методы', cat: 'UX Research', time: '10 мин чтения' },
    ],
}

export function SearchPage({ language, onLanguageChange }: { language: Language; onLanguageChange: (l: Language) => void }) {
    const [searchParams] = useSearchParams()
    const q = searchParams.get('q')?.toLowerCase() || ''

    const filterResults = (items: any[], fields: string[]) =>
        !q ? items : items.filter(item => fields.some(f => item[f]?.toLowerCase().includes(q)))

    const coursesResult = filterResults(SEARCH_DB.courses, ['title', 'desc'])
    const teachersResult = filterResults(SEARCH_DB.teachers, ['name'])
    const articlesResult = filterResults(SEARCH_DB.articles, ['title', 'cat'])

    return (
        <RoleShellLayout language={language} onLanguageChange={onLanguageChange}>
            <div className="sp-root">
                <div className="sp-header">
                    <h1 className="sp-title">Результаты поиска</h1>
                    <p className="sp-sub">{q && `По запросу "${q}"`}</p>
                </div>

                {!q ? (
                    <div className="sp-empty">
                        <Search size={48} />
                        <p>Введите поисковый запрос</p>
                    </div>
                ) : (
                    <>
                        {coursesResult.length > 0 && (
                            <div className="sp-section">
                                <h2 className="sp-section-title"><Book size={18} /> Курсы ({coursesResult.length})</h2>
                                <div className="sp-grid">
                                    {coursesResult.map(c => (
                                        <div key={c.id} className="sp-item course">
                                            <span className="sp-icon">{c.icon}</span>
                                            <h3>{c.title}</h3>
                                            <p>{c.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {teachersResult.length > 0 && (
                            <div className="sp-section">
                                <h2 className="sp-section-title"><Users size={18} /> Учителя ({teachersResult.length})</h2>
                                <div className="sp-grid">
                                    {teachersResult.map(t => (
                                        <div key={t.id} className="sp-item teacher">
                                            <div className="sp-avatar">{t.avatar}</div>
                                            <h3>{t.name}</h3>
                                            <p className="sp-rating"><Award size={12} /> {t.rating} ⭐ ({t.courses} курсов)</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {articlesResult.length > 0 && (
                            <div className="sp-section">
                                <h2 className="sp-section-title">📖 Статьи ({articlesResult.length})</h2>
                                <div className="sp-list">
                                    {articlesResult.map(a => (
                                        <div key={a.id} className="sp-list-item">
                                            <h4>{a.title}</h4>
                                            <div className="sp-list-meta">
                                                <span>{a.cat}</span>
                                                <span>•</span>
                                                <span>{a.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {coursesResult.length === 0 && teachersResult.length === 0 && articlesResult.length === 0 && (
                            <div className="sp-empty">
                                <Search size={48} />
                                <p>Ничего не найдено</p>
                                <p style={{ fontSize: 13, color: '#64748b' }}>Попробуйте другой запрос</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </RoleShellLayout>
    )
}
