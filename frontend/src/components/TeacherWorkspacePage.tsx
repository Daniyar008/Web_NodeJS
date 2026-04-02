import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import {
    BookOpen,
    CalendarCheck,
    CalendarDays,
    Clock,
    Eye,
    FileText,
    GripVertical,
    Image as ImageIcon,
    ListTodo,
    MessageCircleMore,
    NotebookTabs,
    BookPlus,
    Plus,
    Save,
    Send,
    Trash2,
    Users,
} from 'lucide-react'
import { useLocation } from 'react-router-dom'
import type { Language } from '../i18n/translations'
import { TeacherShellLayout } from './TeacherShellLayout'
import { courses as coursesApi, uploads } from '../lib/api'

const LESSON_TYPE_LABELS: Record<string, string> = {
    video: 'Видео',
    text: 'Текст',
    quiz: 'Тест',
    assignment: 'Задание',
}

type TeacherWorkspacePageProps = {
    language: Language
    onLanguageChange: (lang: Language) => void
}

type TeacherTab = 'constructor' | 'modules' | 'assignments' | 'schedule' | 'classes' | 'chat'

type ModuleItem = {
    id: string
    title: string
    lessons: { id: string; title: string; type: 'video' | 'text' | 'quiz' | 'assignment' }[]
}

type AssignmentItem = {
    id: string
    title: string
    dueDate: string
    course: string
    status: 'draft' | 'published'
}

type ScheduleItem = {
    id: string
    date: string
    time: string
    type: 'class' | 'individual'
    title: string
}

type ClassJournalItem = {
    id: string
    className: string
    institution: string
    averageScore: number
    attendance: number
}

type ChatThread = {
    id: string
    with: string
    role: 'parent' | 'student'
    lastMessage: string
}

const initialModules: ModuleItem[] = [
    {
        id: 'm1',
        title: 'Module 1: Introduction',
        lessons: [
            { id: 'l1', title: 'Welcome and course roadmap', type: 'video' },
            { id: 'l2', title: 'Basic workspace setup', type: 'text' },
        ],
    },
    {
        id: 'm2',
        title: 'Module 2: Practice',
        lessons: [
            { id: 'l3', title: 'Hands-on task', type: 'assignment' },
            { id: 'l4', title: 'Knowledge check', type: 'quiz' },
        ],
    },
]

const initialAssignments: AssignmentItem[] = [
    { id: 'a1', title: 'Landing redesign', dueDate: '2026-04-10', course: 'Graphic Design', status: 'published' },
    { id: 'a2', title: 'Figma components', dueDate: '2026-04-14', course: 'Figma Basic', status: 'draft' },
]

const initialSchedule: ScheduleItem[] = [
    { id: 's1', date: '2026-04-04', time: '10:00', type: 'class', title: 'Class 8A: UI Fundamentals' },
    { id: 's2', date: '2026-04-04', time: '15:30', type: 'individual', title: 'Individual: A. Nurmagambet' },
]

const initialClasses: ClassJournalItem[] = [
    { id: 'c1', className: '8A Design', institution: 'Amanzhol School', averageScore: 84, attendance: 92 },
    { id: 'c2', className: '9B Product', institution: 'Amanzhol School', averageScore: 78, attendance: 88 },
]

const initialThreads: ChatThread[] = [
    { id: 't1', with: 'Aigerim Tolegenova', role: 'parent', lastMessage: 'Could we review homework feedback?' },
    { id: 't2', with: 'Nursultan A.', role: 'student', lastMessage: 'I uploaded the assignment draft.' },
]

export function TeacherWorkspacePage({ language, onLanguageChange }: TeacherWorkspacePageProps) {
    const location = useLocation()
    const storageKey = 'teacher-workspace-draft-v1'
    const [activeTab, setActiveTab] = useState<TeacherTab>('constructor')

    const [courseForm, setCourseForm] = useState({
        title: 'Figma Basic to Advance',
        description: 'Practical design course with projects.',
        descriptor: 'From basics to real product layouts and teamwork.',
        notes: 'Bring own laptop and Figma account.',
        coverUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80',
        previewVideoUrl: 'https://example.com/preview-video',
        presentationUrl: 'https://example.com/slides',
        accessType: 'free' as 'free' | 'paid',
        price: '0',
        openAfterPayment: false,
    })

    const [modules, setModules] = useState<ModuleItem[]>(initialModules)
    const [assignments, setAssignments] = useState<AssignmentItem[]>(initialAssignments)
    const [schedule, setSchedule] = useState<ScheduleItem[]>(initialSchedule)
    const [classes, setClasses] = useState<ClassJournalItem[]>(initialClasses)
    const [threads, setThreads] = useState<ChatThread[]>(initialThreads)
    const [selectedModuleId, setSelectedModuleId] = useState(initialModules[0]?.id ?? '')
    const [newModuleTitle, setNewModuleTitle] = useState('')
    const [newLessonTitle, setNewLessonTitle] = useState('')
    const [newLessonType, setNewLessonType] = useState<'video' | 'text' | 'quiz' | 'assignment'>('video')
    const [newChatMessage, setNewChatMessage] = useState('')
    const [mediaFiles, setMediaFiles] = useState({
        cover: '',
        previewVideo: '',
        presentation: '',
    })

    useEffect(() => {
        try {
            const raw = localStorage.getItem(storageKey)
            if (!raw) return
            const saved = JSON.parse(raw) as {
                courseForm?: typeof courseForm
                modules?: ModuleItem[]
                assignments?: AssignmentItem[]
                schedule?: ScheduleItem[]
            }

            if (saved.courseForm) setCourseForm(saved.courseForm)
            if (saved.modules && saved.modules.length > 0) {
                setModules(saved.modules)
                setSelectedModuleId(saved.modules[0].id)
            }
            if (saved.assignments) setAssignments(saved.assignments)
            if (saved.schedule) setSchedule(saved.schedule)
        } catch {
            // ignore invalid local draft
        }
    }, [])

    useEffect(() => {
        localStorage.setItem(
            storageKey,
            JSON.stringify({
                courseForm,
                modules,
                assignments,
                schedule,
            }),
        )
    }, [courseForm, modules, assignments, schedule])

    useEffect(() => {
        if (location.pathname.includes('/teacher/schedule') || location.pathname === '/teacher') {
            setActiveTab('schedule')
            return
        }
        if (location.pathname.includes('/teacher/courses/new')) {
            setActiveTab('constructor')
            return
        }
    }, [location.pathname])

    // Track actual File objects for upload
    const [mediaFileObjects, setMediaFileObjects] = useState<Record<string, File>>({})
    const [saving, setSaving] = useState(false)
    const [saveMsg, setSaveMsg] = useState('')

    function handleMediaSelect(type: 'cover' | 'previewVideo' | 'presentation', event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]
        if (!file) return
        const localUrl = URL.createObjectURL(file)

        setMediaFiles((prev) => ({ ...prev, [type]: file.name }))
        setMediaFileObjects((prev) => ({ ...prev, [type]: file }))

        if (type === 'cover') {
            setCourseForm((prev) => ({ ...prev, coverUrl: localUrl }))
        }
        if (type === 'previewVideo') {
            setCourseForm((prev) => ({ ...prev, previewVideoUrl: localUrl }))
        }
        if (type === 'presentation') {
            setCourseForm((prev) => ({ ...prev, presentationUrl: localUrl }))
        }
    }

    async function handleSaveCourse() {
        if (saving) return
        setSaving(true)
        setSaveMsg('')
        try {
            // Create or update course
            const created = await coursesApi.create({
                title: courseForm.title,
                description: courseForm.description,
            })
            // Upload cover if selected
            if (mediaFileObjects['cover']) {
                const { url } = await uploads.cover(created.id, mediaFileObjects['cover'])
                setCourseForm((prev) => ({ ...prev, coverUrl: url }))
            }
            // Upload media files (video, presentation)
            for (const key of ['previewVideo', 'presentation'] as const) {
                if (mediaFileObjects[key]) {
                    await uploads.media(mediaFileObjects[key])
                }
            }
            setSaveMsg('✅ Курс сохранён!')
            setTimeout(() => setSaveMsg(''), 3000)
        } catch (err) {
            setSaveMsg(`❌ Ошибка: ${err instanceof Error ? err.message : 'unknown'}`)
        } finally {
            setSaving(false)
        }
    }

    function addModule() {
        if (!newModuleTitle.trim()) return
        const nextId = `m${modules.length + 1}`
        const created: ModuleItem = { id: nextId, title: newModuleTitle.trim(), lessons: [] }
        setModules((prev) => [...prev, created])
        setSelectedModuleId(nextId)
        setNewModuleTitle('')
    }

    function addLessonToSelectedModule() {
        if (!selectedModuleId || !newLessonTitle.trim()) return
        setModules((prev) =>
            prev.map((module) => {
                if (module.id !== selectedModuleId) return module
                const lessonNumber = module.lessons.length + 1
                return {
                    ...module,
                    lessons: [
                        ...module.lessons,
                        {
                            id: `${module.id}-l${lessonNumber}`,
                            title: newLessonTitle.trim(),
                            type: newLessonType,
                        },
                    ],
                }
            }),
        )
        setNewLessonTitle('')
    }

    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(initialThreads[0]?.id ?? null)
    const [assignFilter, setAssignFilter] = useState<'all' | 'draft' | 'published'>('all')

    const tabItems = useMemo(
        () => [
            { key: 'constructor' as const, label: 'Course Constructor', icon: BookPlus },
            { key: 'modules' as const, label: 'Modules & Lessons', icon: NotebookTabs },
            { key: 'assignments' as const, label: 'Assignments', icon: ListTodo },
            { key: 'schedule' as const, label: 'Schedule', icon: CalendarCheck },
            { key: 'classes' as const, label: 'Classes & Journal', icon: Users },
            { key: 'chat' as const, label: 'Parent/Student Chat', icon: MessageCircleMore },
        ],
        [],
    )

    return (
        <TeacherShellLayout language={language} onLanguageChange={onLanguageChange} title="Рабочий стол" activePage="t-workspace">
            <div className="tw-root">

                {/* ── Tab strip ──────────────────────────────────────────────── */}
                <div className="tw-tabs">
                    {tabItems.map((t) => {
                        const Icon = t.icon
                        return (
                            <button
                                key={t.key}
                                type="button"
                                className={activeTab === t.key ? 'tw-tab active' : 'tw-tab'}
                                onClick={() => setActiveTab(t.key)}
                            >
                                <Icon size={15} />
                                {t.label}
                            </button>
                        )
                    })}
                </div>

                {/* ══ CONSTRUCTOR ══════════════════════════════════════════════ */}
                {activeTab === 'constructor' && (
                    <div className="tw-panel">
                        <div className="tw-panel-head">
                            <h2 className="tw-panel-title">Конструктор курса</h2>
                            <p className="tw-panel-sub">Заполните данные, загрузите медиа и выберите тип доступа</p>
                        </div>
                        <div className="tw-constructor-layout">
                            {/* Form */}
                            <div>
                                <div className="tw-form-grid">
                                    <div className="tw-field">
                                        <span className="tw-label">Название курса</span>
                                        <input className="tw-input" value={courseForm.title} onChange={(e) => setCourseForm(p => ({ ...p, title: e.target.value }))} />
                                    </div>
                                    <div className="tw-field">
                                        <span className="tw-label">Тип доступа</span>
                                        <select className="tw-select" value={courseForm.accessType} onChange={(e) => setCourseForm(p => ({ ...p, accessType: e.target.value as 'free' | 'paid' }))}>
                                            <option value="free">🆓 Бесплатный</option>
                                            <option value="paid">💰 Платный</option>
                                        </select>
                                    </div>
                                    {courseForm.accessType === 'paid' && (
                                        <div className="tw-field">
                                            <span className="tw-label">Цена (₸)</span>
                                            <input className="tw-input" type="number" min={0} value={courseForm.price} onChange={(e) => setCourseForm(p => ({ ...p, price: e.target.value }))} />
                                        </div>
                                    )}
                                    <div className="tw-toggle-row">
                                        <input type="checkbox" id="oap" checked={courseForm.openAfterPayment} onChange={(e) => setCourseForm(p => ({ ...p, openAfterPayment: e.target.checked }))} />
                                        <label htmlFor="oap" style={{ fontSize: 13, color: '#94a3b8', cursor: 'pointer' }}>Открыть только после оплаты</label>
                                    </div>
                                    <div className="tw-field full">
                                        <span className="tw-label">Описание</span>
                                        <textarea className="tw-textarea" value={courseForm.description} onChange={(e) => setCourseForm(p => ({ ...p, description: e.target.value }))} />
                                    </div>
                                    <div className="tw-field full">
                                        <span className="tw-label">Дескриптор — что узнает студент</span>
                                        <textarea className="tw-textarea" value={courseForm.descriptor} onChange={(e) => setCourseForm(p => ({ ...p, descriptor: e.target.value }))} />
                                    </div>
                                    <div className="tw-field full">
                                        <span className="tw-label">Заметки учителя</span>
                                        <textarea className="tw-textarea" value={courseForm.notes} onChange={(e) => setCourseForm(p => ({ ...p, notes: e.target.value }))} />
                                    </div>
                                    <div className="tw-field full">
                                        <span className="tw-label">URL обложки</span>
                                        <input className="tw-input" value={courseForm.coverUrl} onChange={(e) => setCourseForm(p => ({ ...p, coverUrl: e.target.value }))} placeholder="https://..." />
                                    </div>
                                    <div className="tw-field full">
                                        <span className="tw-label">Загрузить обложку</span>
                                        <input className="tw-input" type="file" accept="image/*" onChange={(e) => handleMediaSelect('cover', e)} />
                                        {mediaFiles.cover && <small className="tw-file-note">✔ {mediaFiles.cover}</small>}
                                    </div>
                                    <div className="tw-field full">
                                        <span className="tw-label">URL превью-видео</span>
                                        <input className="tw-input" value={courseForm.previewVideoUrl} onChange={(e) => setCourseForm(p => ({ ...p, previewVideoUrl: e.target.value }))} placeholder="https://..." />
                                    </div>
                                    <div className="tw-field full">
                                        <span className="tw-label">Загрузить превью-видео</span>
                                        <input className="tw-input" type="file" accept="video/*" onChange={(e) => handleMediaSelect('previewVideo', e)} />
                                        {mediaFiles.previewVideo && <small className="tw-file-note">✔ {mediaFiles.previewVideo}</small>}
                                    </div>
                                    <div className="tw-field full">
                                        <span className="tw-label">URL презентации</span>
                                        <input className="tw-input" value={courseForm.presentationUrl} onChange={(e) => setCourseForm(p => ({ ...p, presentationUrl: e.target.value }))} placeholder="https://..." />
                                    </div>
                                    <div className="tw-field full">
                                        <span className="tw-label">Загрузить презентацию (.ppt, .pdf)</span>
                                        <input className="tw-input" type="file" accept=".ppt,.pptx,.pdf" onChange={(e) => handleMediaSelect('presentation', e)} />
                                        {mediaFiles.presentation && <small className="tw-file-note">✔ {mediaFiles.presentation}</small>}
                                    </div>
                                </div>
                                <div className="tw-form-actions">
                                    <button type="button" className="tw-btn primary" onClick={handleSaveCourse} disabled={saving}>
                                        <Save size={14} /> {saving ? 'Сохраняем...' : 'Сохранить курс'}
                                    </button>
                                    <button type="button" className="tw-btn"><FileText size={14} /> Черновик</button>
                                    <button type="button" className="tw-btn"><Eye size={14} /> Предпросмотр</button>
                                    {saveMsg && <span style={{ marginLeft: 12, fontSize: 13 }}>{saveMsg}</span>}
                                </div>
                            </div>
                            {/* Preview card */}
                            <div className="tw-preview-card">
                                {courseForm.coverUrl
                                    ? <img src={courseForm.coverUrl} alt="Обложка" className="tw-preview-cover" />
                                    : <div className="tw-preview-cover-placeholder"><ImageIcon size={32} /></div>
                                }
                                <div className="tw-preview-body">
                                    <p className="tw-preview-badge-label">Предпросмотр карточки</p>
                                    <h3 className="tw-preview-title">{courseForm.title || 'Название курса'}</h3>
                                    <p className="tw-preview-desc">{courseForm.description || 'Описание появится здесь'}</p>
                                    <span className={`tw-preview-badge ${courseForm.accessType}`}>
                                        {courseForm.accessType === 'paid' ? `💰 ${courseForm.price} ₸` : '🆓 Бесплатно'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ══ MODULES ══════════════════════════════════════════════════ */}
                {activeTab === 'modules' && (
                    <div className="tw-panel">
                        <div className="tw-panel-head">
                            <h2 className="tw-panel-title">Модули и уроки</h2>
                            <p className="tw-panel-sub">Структурируйте программу курса по модулям и типам занятий</p>
                        </div>
                        <div className="tw-modules-layout">
                            {/* Sidebar */}
                            <div className="tw-module-sidebar">
                                <div className="tw-module-sidebar-head">
                                    <span className="tw-module-sidebar-title">Модули ({modules.length})</span>
                                </div>
                                {modules.map((mod) => (
                                    <div
                                        key={mod.id}
                                        className={selectedModuleId === mod.id ? 'tw-module-item active' : 'tw-module-item'}
                                        onClick={() => setSelectedModuleId(mod.id)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => e.key === 'Enter' && setSelectedModuleId(mod.id)}
                                    >
                                        <span className="tw-module-item-name">{mod.title}</span>
                                        <span className="tw-module-item-count">{mod.lessons.length}</span>
                                    </div>
                                ))}
                                <div className="tw-add-input-row">
                                    <input className="tw-input" style={{ fontSize: 13 }} placeholder="Новый модуль..." value={newModuleTitle} onChange={(e) => setNewModuleTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addModule()} />
                                    <button type="button" className="tw-btn sm primary" onClick={addModule}><Plus size={13} /></button>
                                </div>
                            </div>
                            {/* Lesson area */}
                            {(() => {
                                const mod = modules.find(m => m.id === selectedModuleId)
                                if (!mod) return <div className="tw-empty-hint">Выберите модуль</div>
                                return (
                                    <div className="tw-lesson-area">
                                        <div className="tw-lesson-area-head">
                                            <h3 className="tw-lesson-area-title">{mod.title}</h3>
                                            <span className="tw-lesson-area-count">{mod.lessons.length} уроков</span>
                                        </div>
                                        {mod.lessons.length === 0 && (
                                            <div className="tw-empty-hint">Нет уроков — добавьте первый снизу</div>
                                        )}
                                        {mod.lessons.map((lesson) => (
                                            <div key={lesson.id} className="tw-lesson-card">
                                                <GripVertical size={14} color="#475569" style={{ flexShrink: 0 }} />
                                                <span className={`tw-lesson-type-badge ${lesson.type}`}>{LESSON_TYPE_LABELS[lesson.type] ?? lesson.type}</span>
                                                <span className="tw-lesson-title">{lesson.title}</span>
                                                <button type="button" className="tw-btn sm danger" onClick={() => setModules(prev => prev.map(m => m.id === mod.id ? { ...m, lessons: m.lessons.filter(l => l.id !== lesson.id) } : m))}><Trash2 size={12} /></button>
                                            </div>
                                        ))}
                                        <div className="tw-add-lesson-row">
                                            <input className="tw-input" style={{ flex: 1, fontSize: 13 }} placeholder="Название урока..." value={newLessonTitle} onChange={(e) => setNewLessonTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addLessonToSelectedModule()} />
                                            <select className="tw-select" style={{ width: 130, fontSize: 13 }} value={newLessonType} onChange={(e) => setNewLessonType(e.target.value as typeof newLessonType)}>
                                                <option value="video">Видео</option>
                                                <option value="text">Текст</option>
                                                <option value="quiz">Тест</option>
                                                <option value="assignment">Задание</option>
                                            </select>
                                            <button type="button" className="tw-btn sm primary" onClick={addLessonToSelectedModule}><Plus size={13} /> Урок</button>
                                        </div>
                                    </div>
                                )
                            })()}
                        </div>
                    </div>
                )}

                {/* ══ ASSIGNMENTS ══════════════════════════════════════════════ */}
                {activeTab === 'assignments' && (
                    <div className="tw-panel">
                        <div className="tw-panel-head" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <div>
                                <h2 className="tw-panel-title">Задания</h2>
                                <p className="tw-panel-sub">Создавайте задания, устанавливайте дедлайны и публикуйте</p>
                            </div>
                            <button type="button" className="tw-btn primary" onClick={() => setAssignments(prev => [...prev, { id: `a${prev.length + 1}`, title: `Новое задание ${prev.length + 1}`, dueDate: '2026-04-20', course: 'Figma Basic', status: 'draft' }])}>
                                <Plus size={14} /> Новое задание
                            </button>
                        </div>
                        <div className="tw-filter-row">
                            {(['all', 'draft', 'published'] as const).map(f => (
                                <button key={f} type="button" className={assignFilter === f ? 'tw-filter-btn active' : 'tw-filter-btn'} onClick={() => setAssignFilter(f)}>
                                    {f === 'all' ? 'Все' : f === 'draft' ? 'Черновики' : 'Опубликованные'}
                                </button>
                            ))}
                        </div>
                        <div className="tw-assign-grid">
                            {assignments.filter(a => assignFilter === 'all' || a.status === assignFilter).map((a) => (
                                <div key={a.id} className="tw-assign-card">
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                        <h4 className="tw-assign-title">{a.title}</h4>
                                        <span className={`tw-assign-status ${a.status}`}>{a.status === 'published' ? 'Опубл.' : 'Черновик'}</span>
                                    </div>
                                    <div className="tw-assign-meta">
                                        <span className="tw-assign-course"><BookOpen size={10} /> {a.course}</span>
                                        <span className="tw-assign-due"><CalendarDays size={10} /> {a.dueDate}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                                        <button type="button" className="tw-btn sm" onClick={() => setAssignments(prev => prev.map(x => x.id === a.id ? { ...x, status: x.status === 'published' ? 'draft' : 'published' } : x))}>
                                            {a.status === 'published' ? 'Снять' : 'Опубликовать'}
                                        </button>
                                        <button type="button" className="tw-btn sm danger" onClick={() => setAssignments(prev => prev.filter(x => x.id !== a.id))}><Trash2 size={12} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ══ SCHEDULE ═════════════════════════════════════════════════ */}
                {activeTab === 'schedule' && (
                    <div className="tw-panel">
                        <div className="tw-panel-head" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <div>
                                <h2 className="tw-panel-title">Расписание</h2>
                                <p className="tw-panel-sub">Планируйте уроки и индивидуальные занятия</p>
                            </div>
                            <div className="tw-schedule-today-badge">
                                <CalendarDays size={14} />
                                <span>Предстоящие события</span>
                            </div>
                        </div>
                        <div className="tw-timeline">
                            {schedule.map((item) => (
                                <div key={item.id} className="tw-schedule-item">
                                    <div className="tw-sch-time">
                                        <Clock size={12} style={{ marginRight: 3, verticalAlign: 'middle' }} />
                                        {item.time}
                                    </div>
                                    <div className={`tw-sch-dot ${item.type}`} />
                                    <div className={`tw-sch-card ${item.type}`}>
                                        <div className="tw-sch-card-top">
                                            <span className="tw-sch-card-title">{item.title}</span>
                                            <button type="button" className="tw-btn sm danger" style={{ marginLeft: 'auto' }} onClick={() => setSchedule(prev => prev.filter(s => s.id !== item.id))}><Trash2 size={11} /></button>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                                            <span className={`tw-sch-card-badge ${item.type}`}>{item.type === 'class' ? 'Класс' : 'Индивидуально'}</span>
                                            <span className="tw-sch-date">{item.date}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="tw-add-sch-form">
                            <div className="tw-field" style={{ flex: '1 1 200px' }}>
                                <span className="tw-label">Тема занятия</span>
                                <input className="tw-input" id="new-sch-title" placeholder="Название..." style={{ fontSize: 13 }} />
                            </div>
                            <div className="tw-field">
                                <span className="tw-label">Дата</span>
                                <input className="tw-input" id="new-sch-date" type="date" defaultValue="2026-04-05" style={{ fontSize: 13 }} />
                            </div>
                            <div className="tw-field">
                                <span className="tw-label">Время</span>
                                <input className="tw-input" id="new-sch-time" type="time" defaultValue="10:00" style={{ fontSize: 13 }} />
                            </div>
                            <div className="tw-field">
                                <span className="tw-label">Тип</span>
                                <select className="tw-select" id="new-sch-type" style={{ fontSize: 13 }}>
                                    <option value="class">Класс</option>
                                    <option value="individual">Индивидуально</option>
                                </select>
                            </div>
                            <button
                                type="button"
                                className="tw-btn primary"
                                style={{ alignSelf: 'flex-end' }}
                                onClick={() => {
                                    const titleEl = document.getElementById('new-sch-title') as HTMLInputElement
                                    const dateEl = document.getElementById('new-sch-date') as HTMLInputElement
                                    const timeEl = document.getElementById('new-sch-time') as HTMLInputElement
                                    const typeEl = document.getElementById('new-sch-type') as HTMLSelectElement
                                    if (!titleEl.value.trim()) return
                                    setSchedule(prev => [...prev, { id: `s${prev.length + 1}`, title: titleEl.value.trim(), date: dateEl.value, time: timeEl.value, type: typeEl.value as 'class' | 'individual' }])
                                    titleEl.value = ''
                                }}
                            >
                                <Plus size={14} /> Добавить
                            </button>
                        </div>
                    </div>
                )}

                {/* ══ CLASSES & JOURNAL ════════════════════════════════════════ */}
                {activeTab === 'classes' && (
                    <div className="tw-panel">
                        <div className="tw-panel-head">
                            <h2 className="tw-panel-title">Классы и журнал</h2>
                            <p className="tw-panel-sub">Оценки, посещаемость и сводные показатели по классам</p>
                        </div>
                        <div className="tw-classes-grid">
                            {classes.map((cls, idx) => (
                                <div key={cls.id} className="tw-class-card">
                                    <div className="tw-class-header">
                                        <div>
                                            <div className="tw-class-name">{cls.className}</div>
                                            <div className="tw-class-inst">{cls.institution}</div>
                                        </div>
                                        <Users size={20} color="#475569" />
                                    </div>
                                    <div className="tw-class-stats">
                                        <div className="tw-stat-row">
                                            <div className="tw-stat-label-row">
                                                <span>Средний балл</span>
                                                <span className="tw-stat-val">{cls.averageScore}%</span>
                                            </div>
                                            <div className="tw-progress-bar">
                                                <div className="tw-progress-fill score" style={{ width: `${cls.averageScore}%` }} />
                                            </div>
                                        </div>
                                        <div className="tw-stat-row">
                                            <div className="tw-stat-label-row">
                                                <span>Посещаемость</span>
                                                <span className="tw-stat-val">{cls.attendance}%</span>
                                            </div>
                                            <div className="tw-progress-bar">
                                                <div className="tw-progress-fill att" style={{ width: `${cls.attendance}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <div className="tw-field" style={{ flex: 1 }}>
                                            <span className="tw-label">Балл</span>
                                            <input className="tw-input" type="number" min={0} max={100} value={cls.averageScore} style={{ fontSize: 13 }} onChange={(e) => setClasses(prev => prev.map((c, i) => i === idx ? { ...c, averageScore: Number(e.target.value) } : c))} />
                                        </div>
                                        <div className="tw-field" style={{ flex: 1 }}>
                                            <span className="tw-label">Посещ.</span>
                                            <input className="tw-input" type="number" min={0} max={100} value={cls.attendance} style={{ fontSize: 13 }} onChange={(e) => setClasses(prev => prev.map((c, i) => i === idx ? { ...c, attendance: Number(e.target.value) } : c))} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ══ CHAT ═════════════════════════════════════════════════════ */}
                {activeTab === 'chat' && (
                    <div className="tw-panel">
                        <div className="tw-panel-head">
                            <h2 className="tw-panel-title">Чат с родителями и учениками</h2>
                            <p className="tw-panel-sub">Вся коммуникация в одном месте</p>
                        </div>
                        <div className="tw-chat-layout">
                            {/* Thread list */}
                            <div className="tw-thread-list">
                                {threads.map((t) => {
                                    const initials = t.with.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
                                    return (
                                        <div
                                            key={t.id}
                                            className={`tw-thread-item${selectedThreadId === t.id ? ' active' : ''}`}
                                            onClick={() => setSelectedThreadId(t.id)}
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => e.key === 'Enter' && setSelectedThreadId(t.id)}
                                        >
                                            <div className={`tw-thread-avatar ${t.role}`}>{initials}</div>
                                            <div className="tw-thread-info">
                                                <div className="tw-thread-name">{t.with}</div>
                                                <span className={`tw-thread-role ${t.role}`}>{t.role === 'parent' ? 'Родитель' : 'Ученик'}</span>
                                                <div className="tw-thread-last">{t.lastMessage}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            {/* Chat area */}
                            <div className="tw-chat-area">
                                {(() => {
                                    const t = threads.find(x => x.id === selectedThreadId)
                                    if (!t) return <div className="tw-chat-empty">Выберите диалог</div>
                                    return (
                                        <>
                                            <div className="tw-chat-head">
                                                <div className={`tw-thread-avatar ${t.role}`} style={{ width: 34, height: 34, fontSize: 12 }}>
                                                    {t.with.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="tw-thread-name">{t.with}</div>
                                                    <span className={`tw-thread-role ${t.role}`}>{t.role === 'parent' ? 'Родитель' : 'Ученик'}</span>
                                                </div>
                                            </div>
                                            <div className="tw-chat-messages">
                                                <div className="tw-chat-bubble received">{t.lastMessage}</div>
                                            </div>
                                            <form
                                                className="tw-chat-composer"
                                                onSubmit={(e) => {
                                                    e.preventDefault()
                                                    if (!newChatMessage.trim()) return
                                                    setThreads(prev => prev.map(x => x.id === t.id ? { ...x, lastMessage: newChatMessage.trim() } : x))
                                                    setNewChatMessage('')
                                                }}
                                            >
                                                <input className="tw-input" style={{ flex: 1, fontSize: 13 }} placeholder="Написать сообщение..." value={newChatMessage} onChange={(e) => setNewChatMessage(e.target.value)} />
                                                <button type="submit" className="tw-btn primary"><Send size={14} /></button>
                                            </form>
                                        </>
                                    )
                                })()}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </TeacherShellLayout>
    )
}
