import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import type { ReactElement } from 'react'
import {
    BookOpen,
    ChevronRight,
    ClipboardList,
    FileText,
    GripVertical,
    Layers,
    Pencil,
    Plus,
    Save,
    Send,
    Trash2,
    UploadCloud,
    Video,
} from 'lucide-react'
import { TeacherShellLayout } from './TeacherShellLayout'
import type { Language } from '../i18n/translations'

/* ── Types ───────────────────────────────────────────────────────────────── */
type LessonType = 'video' | 'text' | 'quiz' | 'file'

interface Option { id: string; text: string }
interface Question { id: string; text: string; options: Option[]; correctIdx: number }
interface Lesson {
    id: string
    title: string
    type: LessonType
    videoUrl: string
    textContent: string
    questions: Question[]
    duration: string
}
interface Module { id: string; title: string; lessons: Lesson[]; open: boolean }

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const genId = () => Math.random().toString(36).slice(2, 9)

const blankLesson = (type: LessonType = 'video'): Lesson => ({
    id: genId(), title: 'Новый урок', type,
    videoUrl: '', textContent: '',
    questions: [blankQuestion()], duration: '10',
})

function blankQuestion(): Question {
    return {
        id: genId(),
        text: '',
        options: [
            { id: genId(), text: '' },
            { id: genId(), text: '' },
            { id: genId(), text: '' },
            { id: genId(), text: '' },
        ],
        correctIdx: 0,
    }
}

const LESSON_TYPES: { id: LessonType; label: string; icon: ReactElement; color: string; bg: string }[] = [
    { id: 'video', label: 'Видео', icon: <Video size={13} />, color: '#2563eb', bg: '#dbeafe' },
    { id: 'text', label: 'Текст', icon: <FileText size={13} />, color: '#059669', bg: '#d1fae5' },
    { id: 'quiz', label: 'Тест', icon: <ClipboardList size={13} />, color: '#d97706', bg: '#fef3c7' },
    { id: 'file', label: 'Файл', icon: <UploadCloud size={13} />, color: '#7c3aed', bg: '#ede9fe' },
]

const INITIAL_MODULES: Module[] = [
    {
        id: genId(), title: 'Введение', open: true,
        lessons: [
            { id: genId(), title: 'Знакомство с курсом', type: 'video', videoUrl: '', textContent: '', questions: [blankQuestion()], duration: '5' },
            { id: genId(), title: 'Что вы узнаете', type: 'text', videoUrl: '', textContent: '', questions: [blankQuestion()], duration: '3' },
        ],
    },
    {
        id: genId(), title: 'Основная часть', open: false,
        lessons: [
            { id: genId(), title: 'Урок 1: Основы', type: 'video', videoUrl: '', textContent: '', questions: [blankQuestion()], duration: '15' },
            { id: genId(), title: 'Проверочный тест', type: 'quiz', videoUrl: '', textContent: '', questions: [blankQuestion()], duration: '10' },
        ],
    },
]

/* ── Component ───────────────────────────────────────────────────────────── */
type Props = { language: Language; onLanguageChange: (l: Language) => void }

export function TeacherCourseBuilderPage({ language, onLanguageChange }: Props) {
    const location = useLocation()
    const editState = location.state as { editId?: string; editTitle?: string } | null
    const isEditMode = !!editState?.editId

    const [modules, setModules] = useState<Module[]>(INITIAL_MODULES)
    const [activeLesson, setActiveLesson] = useState<{ moduleId: string; lessonId: string } | null>({
        moduleId: INITIAL_MODULES[0].id,
        lessonId: INITIAL_MODULES[0].lessons[0].id,
    })
    const [courseTitle, setCourseTitle] = useState(editState?.editTitle ?? 'Название курса')
    const [courseDesc, setCourseDesc] = useState('')
    const [courseCategory, setCourseCategory] = useState('Design')
    const [courseLang, setCourseLang] = useState('ru')
    const [saved, setSaved] = useState(false)

    /* ── Finders ── */
    const findLesson = (mId: string, lId: string) =>
        modules.find(m => m.id === mId)?.lessons.find(l => l.id === lId) ?? null

    const currentLesson = activeLesson
        ? findLesson(activeLesson.moduleId, activeLesson.lessonId)
        : null

    /* ── Module ops ── */
    const addModule = () => {
        const m: Module = { id: genId(), title: 'Новый модуль', open: true, lessons: [] }
        setModules(prev => [...prev, m])
    }

    const removeModule = (id: string) => setModules(prev => prev.filter(m => m.id !== id))

    const toggleModule = (id: string) =>
        setModules(prev => prev.map(m => m.id === id ? { ...m, open: !m.open } : m))

    const updateModuleTitle = (id: string, title: string) =>
        setModules(prev => prev.map(m => m.id === id ? { ...m, title } : m))

    /* ── Lesson ops ── */
    const addLesson = (moduleId: string, type: LessonType = 'video') => {
        const l = blankLesson(type)
        setModules(prev => prev.map(m => m.id === moduleId ? { ...m, lessons: [...m.lessons, l] } : m))
        setActiveLesson({ moduleId, lessonId: l.id })
    }

    const removeLesson = (moduleId: string, lessonId: string) => {
        setModules(prev => prev.map(m => m.id === moduleId
            ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) }
            : m
        ))
        if (activeLesson?.lessonId === lessonId) setActiveLesson(null)
    }

    const updateLesson = <K extends keyof Lesson>(moduleId: string, lessonId: string, key: K, val: Lesson[K]) => {
        setModules(prev => prev.map(m => m.id === moduleId
            ? { ...m, lessons: m.lessons.map(l => l.id === lessonId ? { ...l, [key]: val } : l) }
            : m
        ))
    }

    /* ── Quiz ops ── */
    const addQuestion = (moduleId: string, lessonId: string) => {
        const lesson = findLesson(moduleId, lessonId)
        if (!lesson) return
        updateLesson(moduleId, lessonId, 'questions', [...lesson.questions, blankQuestion()])
    }

    const updateQuestion = (mId: string, lId: string, qId: string, text: string) => {
        const lesson = findLesson(mId, lId)
        if (!lesson) return
        updateLesson(mId, lId, 'questions', lesson.questions.map(q => q.id === qId ? { ...q, text } : q))
    }

    const updateOption = (mId: string, lId: string, qId: string, oIdx: number, text: string) => {
        const lesson = findLesson(mId, lId)
        if (!lesson) return
        updateLesson(mId, lId, 'questions', lesson.questions.map(q =>
            q.id === qId ? { ...q, options: q.options.map((o, i) => i === oIdx ? { ...o, text } : o) } : q
        ))
    }

    const setCorrect = (mId: string, lId: string, qId: string, idx: number) => {
        const lesson = findLesson(mId, lId)
        if (!lesson) return
        updateLesson(mId, lId, 'questions', lesson.questions.map(q => q.id === qId ? { ...q, correctIdx: idx } : q))
    }

    const removeQuestion = (mId: string, lId: string, qId: string) => {
        const lesson = findLesson(mId, lId)
        if (!lesson) return
        updateLesson(mId, lId, 'questions', lesson.questions.filter(q => q.id !== qId))
    }

    /* ── Save ── */
    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0)

    return (
        <TeacherShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title={isEditMode ? `Редактирование: ${editState?.editTitle}` : 'Конструктор курса'}
            activePage="t-courses"
        >
            <div className="cb-page">

                {/* ══ LEFT: structure tree ════════════════════════════════════ */}
                <div className="cb-structure">
                    <div className="cb-structure-head">
                        <h3 className="cb-structure-title">
                            <Layers size={15} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                            Структура
                        </h3>
                        <button type="button" className="cb-add-module-btn" onClick={addModule}>
                            <Plus size={12} /> Модуль
                        </button>
                    </div>

                    {/* Course info mini */}
                    <div style={{ fontSize: 12, color: '#6b7280', background: '#f8fafc', borderRadius: 10, padding: '8px 10px' }}>
                        <strong style={{ color: '#1f2937' }}>{courseTitle || 'Без названия'}</strong>
                        <div style={{ marginTop: 3 }}>{modules.length} модулей · {totalLessons} уроков</div>
                    </div>

                    {/* Module list */}
                    <div className="cb-module-list">
                        {modules.map((mod, mIdx) => (
                            <div key={mod.id} className={`cb-module-item${activeLesson?.moduleId === mod.id ? ' active' : ''}`}>
                                <div className="cb-module-head" onClick={() => toggleModule(mod.id)}>
                                    <span className="cb-module-drag"><GripVertical size={13} /></span>
                                    <span className="cb-module-name">{mIdx + 1}. {mod.title}</span>
                                    <div className="cb-module-actions" onClick={e => e.stopPropagation()}>
                                        <button type="button" className="cb-icon-btn" onClick={() => {
                                            const t = prompt('Название модуля', mod.title)
                                            if (t) updateModuleTitle(mod.id, t)
                                        }}>
                                            <Pencil size={11} />
                                        </button>
                                        <button type="button" className="cb-icon-btn danger" onClick={() => removeModule(mod.id)}>
                                            <Trash2 size={11} />
                                        </button>
                                    </div>
                                    <ChevronRight size={13} className={`cb-module-chevron${mod.open ? ' open' : ''}`} />
                                </div>

                                {mod.open && (
                                    <div className="cb-lesson-list">
                                        {mod.lessons.map(les => {
                                            const lType = LESSON_TYPES.find(t => t.id === les.type)!
                                            return (
                                                <div
                                                    key={les.id}
                                                    className={`cb-lesson-item${activeLesson?.lessonId === les.id ? ' active' : ''}`}
                                                    onClick={() => setActiveLesson({ moduleId: mod.id, lessonId: les.id })}
                                                >
                                                    <span className="cb-lesson-type-dot" style={{ background: lType.color }} />
                                                    <span className="cb-lesson-name">{les.title}</span>
                                                    <span className="cb-lesson-type-tag" style={{ background: lType.bg, color: lType.color }}>
                                                        {lType.label}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        className="cb-icon-btn danger"
                                                        onClick={e => { e.stopPropagation(); removeLesson(mod.id, les.id) }}
                                                    >
                                                        <Trash2 size={10} />
                                                    </button>
                                                </div>
                                            )
                                        })}

                                        {/* Add lesson buttons */}
                                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 4, paddingLeft: 2 }}>
                                            {LESSON_TYPES.map(lt => (
                                                <button
                                                    key={lt.id}
                                                    type="button"
                                                    className="cb-add-lesson-btn"
                                                    style={{ borderColor: lt.color + '55', color: lt.color }}
                                                    onClick={() => addLesson(mod.id, lt.id)}
                                                >
                                                    <Plus size={10} /> {lt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ══ RIGHT: editor ═══════════════════════════════════════════ */}
                <div className="cb-editor">

                    {/* Course meta card */}
                    <div className="cb-editor-card">
                        <h3><BookOpen size={15} /> Информация о курсе</h3>
                        <div className="cb-field">
                            <label className="cb-label">Название курса *</label>
                            <input className="cb-input" value={courseTitle} onChange={e => setCourseTitle(e.target.value)} placeholder="Введите название..." />
                        </div>
                        <div className="cb-field">
                            <label className="cb-label">Описание</label>
                            <textarea className="cb-input cb-textarea" value={courseDesc} onChange={e => setCourseDesc(e.target.value)} placeholder="Кратко опишите курс..." />
                        </div>
                        <div className="cb-grid-2">
                            <div className="cb-field">
                                <label className="cb-label">Категория</label>
                                <select className="cb-select" value={courseCategory} onChange={e => setCourseCategory(e.target.value)}>
                                    <option>Design</option>
                                    <option>UX/UI</option>
                                    <option>Illustration</option>
                                    <option>Математика</option>
                                    <option>Физика</option>
                                    <option>Химия</option>
                                    <option>Информатика</option>
                                    <option>Другое</option>
                                </select>
                            </div>
                            <div className="cb-field">
                                <label className="cb-label">Язык</label>
                                <select className="cb-select" value={courseLang} onChange={e => setCourseLang(e.target.value)}>
                                    <option value="ru">Русский</option>
                                    <option value="kk">Казахский</option>
                                    <option value="en">English</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Lesson editor */}
                    {currentLesson && activeLesson ? (
                        <div className="cb-editor-card">
                            <h3>
                                {LESSON_TYPES.find(t => t.id === currentLesson.type)?.icon}
                                <span style={{ marginLeft: 6 }}>Редактор урока</span>
                            </h3>

                            {/* Lesson title + duration */}
                            <div className="cb-grid-2">
                                <div className="cb-field">
                                    <label className="cb-label">Название урока</label>
                                    <input
                                        className="cb-input"
                                        value={currentLesson.title}
                                        onChange={e => updateLesson(activeLesson.moduleId, activeLesson.lessonId, 'title', e.target.value)}
                                        placeholder="Введите название..."
                                    />
                                </div>
                                <div className="cb-field">
                                    <label className="cb-label">Длительность (мин)</label>
                                    <input
                                        className="cb-input"
                                        type="number"
                                        min="1"
                                        value={currentLesson.duration}
                                        onChange={e => updateLesson(activeLesson.moduleId, activeLesson.lessonId, 'duration', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Lesson type selector */}
                            <div className="cb-field">
                                <label className="cb-label">Тип контента</label>
                                <div className="cb-type-tabs">
                                    {LESSON_TYPES.map(lt => (
                                        <button
                                            key={lt.id}
                                            type="button"
                                            className={`cb-type-tab${currentLesson.type === lt.id ? ' active' : ''}`}
                                            onClick={() => updateLesson(activeLesson.moduleId, activeLesson.lessonId, 'type', lt.id)}
                                        >
                                            {lt.icon} {lt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Video */}
                            {currentLesson.type === 'video' && (
                                <div className="cb-field">
                                    <label className="cb-label">Ссылка на видео (YouTube / Vimeo)</label>
                                    <input
                                        className="cb-input"
                                        placeholder="https://youtube.com/watch?v=..."
                                        value={currentLesson.videoUrl}
                                        onChange={e => updateLesson(activeLesson.moduleId, activeLesson.lessonId, 'videoUrl', e.target.value)}
                                    />
                                    {currentLesson.videoUrl && (
                                        <div className="cb-video-preview">
                                            <Video size={18} color="#2563eb" />
                                            <span style={{ wordBreak: 'break-all', fontSize: 12 }}>{currentLesson.videoUrl}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Text */}
                            {currentLesson.type === 'text' && (
                                <div className="cb-field">
                                    <label className="cb-label">Текст урока</label>
                                    <textarea
                                        className="cb-input cb-textarea"
                                        style={{ minHeight: 160 }}
                                        placeholder="Введите текст урока, поддерживается маркдаун..."
                                        value={currentLesson.textContent}
                                        onChange={e => updateLesson(activeLesson.moduleId, activeLesson.lessonId, 'textContent', e.target.value)}
                                    />
                                </div>
                            )}

                            {/* File */}
                            {currentLesson.type === 'file' && (
                                <div className="cb-field">
                                    <label className="cb-label">Загрузить файл</label>
                                    <div className="cb-upload-zone">
                                        <UploadCloud size={28} className="cb-upload-icon" />
                                        <span className="cb-upload-label">Перетащите файл или нажмите для выбора</span>
                                        <span className="cb-upload-hint">PDF, DOCX, PPTX, ZIP — до 50 МБ</span>
                                    </div>
                                </div>
                            )}

                            {/* Quiz */}
                            {currentLesson.type === 'quiz' && (
                                <div className="cb-field">
                                    <label className="cb-label">Вопросы теста</label>
                                    <div className="cb-quiz-list">
                                        {currentLesson.questions.map((q, qIdx) => (
                                            <div key={q.id} className="cb-question-card">
                                                <div className="cb-question-head">
                                                    <span className="cb-question-num">№{qIdx + 1}</span>
                                                    <input
                                                        className="cb-q-input"
                                                        placeholder="Текст вопроса..."
                                                        value={q.text}
                                                        onChange={e => updateQuestion(activeLesson.moduleId, activeLesson.lessonId, q.id, e.target.value)}
                                                    />
                                                    {currentLesson.questions.length > 1 && (
                                                        <button type="button" className="cb-icon-btn danger" onClick={() => removeQuestion(activeLesson.moduleId, activeLesson.lessonId, q.id)}>
                                                            <Trash2 size={11} />
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="cb-options-list">
                                                    {q.options.map((opt, oIdx) => (
                                                        <div key={opt.id} className="cb-option-row">
                                                            <input
                                                                type="radio"
                                                                name={`correct-${q.id}`}
                                                                className="cb-option-radio"
                                                                checked={q.correctIdx === oIdx}
                                                                onChange={() => setCorrect(activeLesson.moduleId, activeLesson.lessonId, q.id, oIdx)}
                                                                title="Правильный ответ"
                                                            />
                                                            <input
                                                                className="cb-opt-input"
                                                                placeholder={`Вариант ${oIdx + 1}...`}
                                                                value={opt.text}
                                                                onChange={e => updateOption(activeLesson.moduleId, activeLesson.lessonId, q.id, oIdx, e.target.value)}
                                                            />
                                                        </div>
                                                    ))}
                                                    <button type="button" className="cb-add-opt-btn" onClick={() => {
                                                        const lesson = findLesson(activeLesson.moduleId, activeLesson.lessonId)
                                                        if (!lesson) return
                                                        updateLesson(activeLesson.moduleId, activeLesson.lessonId, 'questions', lesson.questions.map(iq =>
                                                            iq.id === q.id ? { ...iq, options: [...iq.options, { id: genId(), text: '' }] } : iq
                                                        ))
                                                    }}>
                                                        + Добавить вариант
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button type="button" className="cb-add-q-btn" onClick={() => addQuestion(activeLesson.moduleId, activeLesson.lessonId)}>
                                        <Plus size={13} /> Добавить вопрос
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="cb-editor-card" style={{ display: 'grid', placeItems: 'center', minHeight: 220, color: '#9ca3af' }}>
                            <div style={{ textAlign: 'center' }}>
                                <Layers size={36} style={{ marginBottom: 10, opacity: 0.4 }} />
                                <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>Выберите урок для редактирования</p>
                                <p style={{ margin: '6px 0 0', fontSize: 12 }}>или добавьте новый через кнопку в модуле</p>
                            </div>
                        </div>
                    )}

                    {/* Preview hint */}
                    <div className="cb-preview-bar">
                        <span><strong>Предпросмотр курса</strong> доступен после сохранения черновика</span>
                        <button type="button" className="cb-btn secondary" style={{ fontSize: 12, padding: '6px 14px' }}>
                            Открыть предпросмотр
                        </button>
                    </div>

                    {/* Action bar */}
                    <div className="cb-action-bar">
                        <div className="cb-action-left">
                            <span className="cb-status-dot" style={{ background: saved ? '#22c55e' : '#f59e0b' }} />
                            <span className="cb-status-text">{saved ? 'Сохранено ✓' : 'Несохранённые изменения'}</span>
                        </div>
                        <div className="cb-action-right">
                            <button type="button" className="cb-btn secondary" onClick={handleSave}>
                                <Save size={14} style={{ verticalAlign: 'middle', marginRight: 5 }} />
                                Сохранить черновик
                            </button>
                            <button type="button" className="cb-btn primary" onClick={handleSave}>
                                <Send size={14} style={{ verticalAlign: 'middle', marginRight: 5 }} />
                                Отправить на проверку
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </TeacherShellLayout>
    )
}
