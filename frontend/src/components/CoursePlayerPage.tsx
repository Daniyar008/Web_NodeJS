import { useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
    CheckCircle2, ChevronDown, ChevronLeft, ChevronRight,
    ChevronUp, Circle, PlayCircle, FileText, HelpCircle,
    Zap, ArrowLeft,
} from 'lucide-react'
import { CourseShellLayout } from './CourseShellLayout'
import { useXP } from '../lib/xpStore'
import type { Language } from '../i18n/translations'

/* ── Types ───────────────────────────────────────────────────────── */
type LessonType = 'video' | 'text' | 'quiz'
interface QuizQuestion { q: string; options: string[]; correct: number }
interface Lesson {
    id: string
    title: string
    type: LessonType
    duration: string
    videoUrl?: string
    textContent?: string
    quiz?: QuizQuestion[]
}
interface Module {
    id: string
    title: string
    lessons: Lesson[]
}
interface CourseData {
    title: string
    teacher: string
    modules: Module[]
}

/* ── Course catalogue ─────────────────────────────────────────────── */
const COURSES: Record<string, CourseData> = {
    default: {
        title: 'Figma: Основы и продвинутый уровень',
        teacher: 'William Joe',
        modules: [
            {
                id: 'm1', title: 'Модуль 1 — Введение',
                lessons: [
                    {
                        id: 'l1', title: 'Добро пожаловать на курс', type: 'video', duration: '5 мин',
                        videoUrl: 'https://www.youtube.com/embed/FTFaQWZBqQ8',
                    },
                    {
                        id: 'l2', title: 'Что такое Figma?', type: 'text', duration: '8 мин',
                        textContent: `## Что такое Figma?

**Figma** — браузерный инструмент для совместного UI/UX-дизайна. В отличие от Sketch или Adobe XD, Figma работает полностью в облаке, что делает его идеальным для распределённых команд.

### Ключевые возможности
- Векторный редактор с Auto Layout
- Компоненты и переиспользуемые стили
- Совместная работа в реальном времени
- Прототипирование и анимации
- Dev Mode для разработчиков

### Почему Figma?
За последние 5 лет Figma стала **стандартом индустрии**. По данным State of Design 2023, более 80 % профессиональных дизайнеров используют Figma в своей ежедневной работе.`,
                    },
                    {
                        id: 'l3', title: 'Проверочный тест: введение', type: 'quiz', duration: '3 мин',
                        quiz: [
                            { q: 'В каком году была основана компания Figma?', options: ['2010', '2012', '2016', '2019'], correct: 1 },
                            { q: 'Figma работает на основе:', options: ['Локального ПО', 'Браузера/облака', 'Мобильного приложения', 'Плагина для Photoshop'], correct: 1 },
                            { q: 'Какая функция позволяет элементам автоматически адаптироваться к контенту?', options: ['Smart Animate', 'Auto Layout', 'Grids', 'Constraints'], correct: 1 },
                        ],
                    },
                ],
            },
            {
                id: 'm2', title: 'Модуль 2 — Базовые инструменты',
                lessons: [
                    {
                        id: 'l4', title: 'Фреймы и группы', type: 'video', duration: '12 мин',
                        videoUrl: 'https://www.youtube.com/embed/dXQ7IHkTiMM',
                    },
                    {
                        id: 'l5', title: 'Работа с типографикой', type: 'text', duration: '10 мин',
                        textContent: `## Типографика в Figma

Грамотная типографика — основа любого интерфейса. В Figma встроена поддержка **Google Fonts** и загрузки собственных шрифтов.

### Стили текста
Создавайте переиспользуемые стили: \`H1\`, \`H2\`, \`Body\`, \`Caption\`. Это гарантирует консистентность во всём проекте.

### Line height и Letter spacing
- **Line height**: 130–150 % для основного текста
- **Letter spacing**: -1–2 % для заголовков (tight), +5–10 % для uppercase

### Автоматические размеры
Режим **Hug Contents** позволяет тексту автоматически растягивать контейнер — удобно в компонентах кнопок.`,
                    },
                    {
                        id: 'l6', title: 'Тест: базовые инструменты', type: 'quiz', duration: '4 мин',
                        quiz: [
                            { q: 'Что такое Frame в Figma?', options: ['Изображение', 'Контейнер с ограниченной областью', 'Маска', 'Компонент'], correct: 1 },
                            { q: 'Сочетание клавиш для создания Frame?', options: ['V', 'R', 'F', 'T'], correct: 2 },
                            { q: 'Как называется функция автоматической компоновки элементов?', options: ['Smart Layout', 'Auto Layout', 'Flex Grid', 'Component Grid'], correct: 1 },
                            { q: 'Какое свойство отвечает за межбуквенный интервал?', options: ['Line Height', 'Paragraph Spacing', 'Letter Spacing', 'Font Weight'], correct: 2 },
                        ],
                    },
                ],
            },
            {
                id: 'm3', title: 'Модуль 3 — Компоненты',
                lessons: [
                    {
                        id: 'l7', title: 'Создание компонентов', type: 'video', duration: '15 мин',
                        videoUrl: 'https://www.youtube.com/embed/k74IrUNaJVk',
                    },
                    {
                        id: 'l8', title: 'Variants и Properties', type: 'text', duration: '12 мин',
                        textContent: `## Variants в Figma

**Variants** позволяют объединять несколько версий компонента в одну «семью». Например, кнопка может иметь варианты:

- \`Size\`: sm / md / lg
- \`State\`: default / hover / pressed / disabled
- \`Type\`: primary / secondary / ghost

### Как создать Variant
1. Выберите несколько компонентов
2. Нажмите «Combine as Variants» на панели справа
3. Назначьте свойства через Property Inspector

### Component Properties
С версии Figma 4.0 появились **Boolean**, **Text** и **Nested Instance** свойства — это позволяет управлять контентом компонента без создания лишних вариантов.`,
                    },
                ],
            },
        ],
    },
    '1': {
        title: 'Математика: Углублённый курс',
        teacher: 'Иванов А.И.',
        modules: [
            {
                id: 'm1', title: 'Алгебра',
                lessons: [
                    { id: 'l1', title: 'Полиномы', type: 'video', duration: '20 мин', videoUrl: 'https://www.youtube.com/embed/FTFaQWZBqQ8' },
                    { id: 'l2', title: 'Комплексные числа', type: 'text', duration: '15 мин', textContent: `## Комплексные числа\n\nКомплексное число имеет вид **a + bi**, где **i** = √-1.\n\n### Свойства\n- Сложение и вычитание\n- Конъюгация: **a - bi**\n- Модуль: √(a² + b²)` },
                    { id: 'l3', title: 'Тест по алгебре', type: 'quiz', duration: '5 мин', quiz: [{ q: 'Чему равно i²?', options: ['1', '-1', 'i', '0'], correct: 1 }, { q: 'Модуль числа 3+4i?', options: ['5', '7', '1', '3'], correct: 0 }] },
                ],
            },
        ],
    },
}

function getCourse(courseId: string | undefined): CourseData {
    return COURSES[courseId ?? ''] ?? COURSES.default
}

function getAllLessons(course: CourseData): { moduleId: string; lesson: Lesson; moduleTitle: string }[] {
    return course.modules.flatMap(m => m.lessons.map(l => ({ moduleId: m.id, lesson: l, moduleTitle: m.title })))
}

/* ── Icon per type ─────────────────────────────────────────────── */
function LessonIcon({ type }: { type: LessonType }) {
    if (type === 'video') return <PlayCircle size={13} />
    if (type === 'text') return <FileText size={13} />
    return <HelpCircle size={13} />
}

/* ══════════════════════════════════════════════════════════════════ */
export function CoursePlayerPage({
    language,
    onLanguageChange,
}: {
    language: Language
    onLanguageChange: (l: Language) => void
}) {
    const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
    const navigate = useNavigate()
    const { addXP } = useXP()

    const course = useMemo(() => getCourse(courseId), [courseId])
    const allLessons = useMemo(() => getAllLessons(course), [course])

    // Active lesson
    const activeLessonIdx = allLessons.findIndex(l => l.lesson.id === lessonId) ?? 0
    const activeEntry = allLessons[activeLessonIdx < 0 ? 0 : activeLessonIdx]

    // Guard: no lessons at all
    if (allLessons.length === 0) {
        return (
            <CourseShellLayout language={language} onLanguageChange={onLanguageChange} title="Курс не найден" activePage="courses">
                <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                    <p style={{ fontSize: 18, marginBottom: 12 }}>Курс не найден или не содержит уроков.</p>
                    <button type="button" onClick={() => navigate('/courses')} style={{ padding: '8px 20px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>← Вернуться к курсам</button>
                </div>
            </CourseShellLayout>
        )
    }

    // Completed set
    const [completed, setCompleted] = useState<Set<string>>(new Set())
    // Expanded modules in sidebar
    const [expandedModules, setExpandedModules] = useState<Set<string>>(
        new Set(course.modules.map(m => m.id))
    )
    // Quiz state
    const [quizAnswers, setQuizAnswers] = useState<number[]>([])
    const [quizSubmitted, setQuizSubmitted] = useState(false)

    const completedCount = completed.size
    const totalCount = allLessons.length
    const progressPct = Math.round((completedCount / totalCount) * 100)

    function goLesson(idx: number) {
        const entry = allLessons[idx]
        if (!entry) return
        setQuizAnswers([])
        setQuizSubmitted(false)
        navigate(`/courses/${courseId}/lesson/${entry.lesson.id}`)
    }

    function markComplete() {
        if (!activeEntry) return
        const id = activeEntry.lesson.id
        if (completed.has(id)) return
        setCompleted(prev => new Set([...prev, id]))
        addXP(50)
        // Auto-advance
        if (activeLessonIdx < allLessons.length - 1) {
            setTimeout(() => goLesson(activeLessonIdx + 1), 400)
        }
    }

    function toggleModule(id: string) {
        setExpandedModules(prev => {
            const s = new Set(prev)
            if (s.has(id)) s.delete(id); else s.add(id)
            return s
        })
    }

    const isCompleted = (id: string) => completed.has(id)

    /* ── Quiz logic ─────────────────────────────────────────────── */
    const quiz = activeEntry?.lesson.quiz ?? []
    const quizScore = quizSubmitted
        ? quiz.filter((q, i) => quizAnswers[i] === q.correct).length
        : 0
    const quizPassed = quizSubmitted && quizScore >= Math.ceil(quiz.length * 0.6)

    function handleQuizSubmit() {
        if (quizAnswers.length < quiz.length) return
        setQuizSubmitted(true)
        if (quizScore >= Math.ceil(quiz.length * 0.6)) {
            if (!completed.has(activeEntry!.lesson.id)) {
                setCompleted(prev => new Set([...prev, activeEntry!.lesson.id]))
                addXP(75)
            }
        }
    }

    /* ── Render content ──────────────────────────────────────────── */
    function renderContent() {
        if (!activeEntry) return null
        const { lesson } = activeEntry

        if (lesson.type === 'video') {
            return (
                <div className="player-video-wrap">
                    <iframe
                        className="player-iframe"
                        src={lesson.videoUrl}
                        title={lesson.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            )
        }

        if (lesson.type === 'text') {
            const lines = lesson.textContent?.split('\n') ?? []
            return (
                <div className="player-text-content">
                    {lines.map((line, i) => {
                        if (line.startsWith('## ')) return <h2 key={i} className="player-text-h2">{line.slice(3)}</h2>
                        if (line.startsWith('### ')) return <h3 key={i} className="player-text-h3">{line.slice(4)}</h3>
                        if (line.startsWith('- ')) return <li key={i} className="player-text-li">{renderInline(line.slice(2))}</li>
                        if (line === '') return <div key={i} className="player-text-gap" />
                        return <p key={i} className="player-text-p">{renderInline(line)}</p>
                    })}
                </div>
            )
        }

        if (lesson.type === 'quiz') {
            return (
                <div className="player-quiz">
                    <div className="player-quiz-header">
                        <HelpCircle size={22} className="player-quiz-icon" />
                        <div>
                            <div className="player-quiz-title">Проверочный тест</div>
                            <div className="player-quiz-subtitle">{quiz.length} вопросов · минимальный порог 60 %</div>
                        </div>
                    </div>

                    {quiz.map((q, qi) => (
                        <div className="player-quiz-question" key={qi}>
                            <p className="player-qtext"><span className="player-qnum">{qi + 1}.</span> {q.q}</p>
                            <div className="player-options">
                                {q.options.map((opt, oi) => {
                                    const chosen = quizAnswers[qi] === oi
                                    const correct = quizSubmitted && oi === q.correct
                                    const wrong = quizSubmitted && chosen && oi !== q.correct
                                    return (
                                        <button
                                            key={oi}
                                            className={`player-option ${chosen ? 'chosen' : ''} ${correct ? 'correct' : ''} ${wrong ? 'wrong' : ''}`}
                                            disabled={quizSubmitted}
                                            onClick={() => {
                                                setQuizAnswers(prev => {
                                                    const a = [...prev]; a[qi] = oi; return a
                                                })
                                            }}
                                        >
                                            <span className="player-opt-letter">{String.fromCharCode(65 + oi)}</span>
                                            {opt}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    ))}

                    {!quizSubmitted ? (
                        <button
                            className="player-quiz-submit"
                            disabled={quizAnswers.length < quiz.length}
                            onClick={handleQuizSubmit}
                        >
                            Проверить ответы
                        </button>
                    ) : (
                        <div className={`player-quiz-result ${quizPassed ? 'passed' : 'failed'}`}>
                            {quizPassed
                                ? `✅ Отлично! ${quizScore} / ${quiz.length} — тест пройден! +75 XP`
                                : `❌ ${quizScore} / ${quiz.length} — попробуйте ещё раз`}
                            {!quizPassed && (
                                <button className="player-quiz-retry" onClick={() => { setQuizAnswers([]); setQuizSubmitted(false) }}>
                                    Попробовать снова
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )
        }
    }

    /* ── Inline markdown helper ──────────────────────────────────── */
    function renderInline(text: string): React.ReactNode {
        const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/)
        return parts.map((p, i) => {
            if (p.startsWith('**') && p.endsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>
            if (p.startsWith('`') && p.endsWith('`')) return <code key={i} className="player-inline-code">{p.slice(1, -1)}</code>
            return p
        })
    }

    return (
        <CourseShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title={course.title}
            activePage="courses"
        >
            <div className="player-layout">

                {/* ── Left sidebar ──────────────────────────────────── */}
                <aside className="player-sidebar">
                    <button className="player-back-btn" onClick={() => navigate(`/courses/${courseId}`)}>
                        <ArrowLeft size={14} /> К курсу
                    </button>
                    <div className="player-course-title">{course.title}</div>

                    {/* Progress bar */}
                    <div className="player-sidebar-progress">
                        <div className="player-sidebar-progress-bar">
                            <div className="player-sidebar-progress-fill" style={{ width: `${progressPct}%` }} />
                        </div>
                        <span className="player-sidebar-pct">{completedCount}/{totalCount} уроков</span>
                    </div>

                    {/* Module tree */}
                    <nav className="player-module-tree">
                        {course.modules.map(mod => (
                            <div className="player-module" key={mod.id}>
                                <button
                                    className="player-module-header"
                                    onClick={() => toggleModule(mod.id)}
                                >
                                    <span className="player-mod-title">{mod.title}</span>
                                    {expandedModules.has(mod.id) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </button>
                                {expandedModules.has(mod.id) && (
                                    <ul className="player-lesson-list">
                                        {mod.lessons.map((les, li) => {
                                            const flatIdx = allLessons.findIndex(e => e.lesson.id === les.id)
                                            const active = les.id === activeEntry?.lesson.id
                                            const done = isCompleted(les.id)
                                            return (
                                                <li key={les.id}>
                                                    <button
                                                        className={`player-lesson-item ${active ? 'active' : ''} ${done ? 'done' : ''}`}
                                                        onClick={() => goLesson(flatIdx)}
                                                    >
                                                        <span className="player-lesson-check">
                                                            {done ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                                                        </span>
                                                        <span className="player-lesson-num">{li + 1}</span>
                                                        <span className="player-lesson-title">{les.title}</span>
                                                        <span className="player-lesson-meta">
                                                            <LessonIcon type={les.type} />
                                                            {les.duration}
                                                        </span>
                                                    </button>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </nav>
                </aside>

                {/* ── Main content ──────────────────────────────────── */}
                <main className="player-main">
                    {/* Top progress strip */}
                    <div className="player-progress-strip">
                        <div className="player-progress-fill" style={{ width: `${progressPct}%` }} />
                    </div>

                    {/* Breadcrumb */}
                    <div className="player-breadcrumb">
                        <span className="player-bc-course" onClick={() => navigate(`/courses/${courseId}`)}>{course.title}</span>
                        <ChevronRight size={13} />
                        <span>{activeEntry?.moduleTitle}</span>
                        <ChevronRight size={13} />
                        <span className="player-bc-current">{activeEntry?.lesson.title}</span>
                    </div>

                    {/* Content */}
                    <div className="player-content-area">
                        <h1 className="player-lesson-heading">{activeEntry?.lesson.title}</h1>
                        <div className="player-lesson-meta-row">
                            {activeEntry && <LessonIcon type={activeEntry.lesson.type} />}
                            <span>{activeEntry?.lesson.type === 'video' ? 'Видео' : activeEntry?.lesson.type === 'text' ? 'Материал' : 'Тест'}</span>
                            <span>·</span>
                            <span>{activeEntry?.lesson.duration}</span>
                            {isCompleted(activeEntry?.lesson.id ?? '') && (
                                <span className="player-completed-badge"><CheckCircle2 size={13} /> Пройдено</span>
                            )}
                        </div>

                        {renderContent()}
                    </div>

                    {/* Bottom nav */}
                    <div className="player-bottom-nav">
                        <button
                            className="player-nav-prev"
                            disabled={activeLessonIdx <= 0}
                            onClick={() => goLesson(activeLessonIdx - 1)}
                        >
                            <ChevronLeft size={16} /> Предыдущий
                        </button>

                        {activeEntry?.lesson.type !== 'quiz' && !isCompleted(activeEntry?.lesson.id ?? '') && (
                            <button className="player-complete-btn" onClick={markComplete}>
                                <Zap size={15} /> Отметить пройденным · +50 XP
                            </button>
                        )}
                        {isCompleted(activeEntry?.lesson.id ?? '') && (
                            <span className="player-done-label"><CheckCircle2 size={15} /> Урок пройден</span>
                        )}

                        <button
                            className="player-nav-next"
                            disabled={activeLessonIdx >= allLessons.length - 1}
                            onClick={() => goLesson(activeLessonIdx + 1)}
                        >
                            Следующий <ChevronRight size={16} />
                        </button>
                    </div>
                </main>
            </div>
        </CourseShellLayout>
    )
}
