import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import { MessageCircleMore, CalendarCheck, NotebookTabs, BookPlus, ListTodo, Users } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import type { Language } from '../i18n/translations'
import { TeacherShellLayout } from './TeacherShellLayout'

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

    function handleMediaSelect(type: 'cover' | 'previewVideo' | 'presentation', event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]
        if (!file) return
        const localUrl = URL.createObjectURL(file)

        setMediaFiles((prev) => ({ ...prev, [type]: file.name }))

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
        <TeacherShellLayout language={language} onLanguageChange={onLanguageChange} title="Расписание и занятия" activePage="t-schedule">
            <section className="teacher-workspace">
                <div className="teacher-tabs" aria-label="Teacher workspace tabs">
                    {tabItems.map((tab) => {
                        const Icon = tab.icon
                        return (
                            <button
                                key={tab.key}
                                type="button"
                                className={activeTab === tab.key ? 'teacher-tab active' : 'teacher-tab'}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                <Icon size={15} />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>

                {activeTab === 'constructor' && (
                    <article className="teacher-panel">
                        <h3>Course Constructor</h3>
                        <p className="teacher-muted">Teacher can create/edit course, add media, choose paid/free access.</p>

                        <div className="teacher-grid">
                            <label>
                                Course title
                                <input
                                    value={courseForm.title}
                                    onChange={(e) => setCourseForm((prev) => ({ ...prev, title: e.target.value }))}
                                />
                            </label>

                            <label>
                                Access type
                                <select
                                    value={courseForm.accessType}
                                    onChange={(e) => setCourseForm((prev) => ({ ...prev, accessType: e.target.value as 'free' | 'paid' }))}
                                >
                                    <option value="free">Free</option>
                                    <option value="paid">Paid</option>
                                </select>
                            </label>

                            <label>
                                Price
                                <input
                                    type="number"
                                    min={0}
                                    value={courseForm.price}
                                    onChange={(e) => setCourseForm((prev) => ({ ...prev, price: e.target.value }))}
                                    disabled={courseForm.accessType === 'free'}
                                />
                            </label>

                            <label className="switch-row">
                                <input
                                    type="checkbox"
                                    checked={courseForm.openAfterPayment}
                                    onChange={(e) => setCourseForm((prev) => ({ ...prev, openAfterPayment: e.target.checked }))}
                                />
                                Open access only after payment
                            </label>

                            <label className="full">
                                Cover image URL
                                <input
                                    value={courseForm.coverUrl}
                                    onChange={(e) => setCourseForm((prev) => ({ ...prev, coverUrl: e.target.value }))}
                                />
                            </label>

                            <label className="full">
                                Upload cover
                                <input type="file" accept="image/*" onChange={(e) => handleMediaSelect('cover', e)} />
                                {mediaFiles.cover && <small className="teacher-file-note">Selected: {mediaFiles.cover}</small>}
                            </label>

                            <label className="full">
                                Preview video URL
                                <input
                                    value={courseForm.previewVideoUrl}
                                    onChange={(e) => setCourseForm((prev) => ({ ...prev, previewVideoUrl: e.target.value }))}
                                />
                            </label>

                            <label className="full">
                                Upload preview video
                                <input type="file" accept="video/*" onChange={(e) => handleMediaSelect('previewVideo', e)} />
                                {mediaFiles.previewVideo && <small className="teacher-file-note">Selected: {mediaFiles.previewVideo}</small>}
                            </label>

                            <label className="full">
                                Presentation URL
                                <input
                                    value={courseForm.presentationUrl}
                                    onChange={(e) => setCourseForm((prev) => ({ ...prev, presentationUrl: e.target.value }))}
                                />
                            </label>

                            <label className="full">
                                Upload presentation
                                <input type="file" accept=".ppt,.pptx,.pdf" onChange={(e) => handleMediaSelect('presentation', e)} />
                                {mediaFiles.presentation && <small className="teacher-file-note">Selected: {mediaFiles.presentation}</small>}
                            </label>

                            <label className="full">
                                Description
                                <textarea
                                    value={courseForm.description}
                                    onChange={(e) => setCourseForm((prev) => ({ ...prev, description: e.target.value }))}
                                />
                            </label>

                            <label className="full">
                                Descriptor / Notes
                                <textarea
                                    value={courseForm.descriptor}
                                    onChange={(e) => setCourseForm((prev) => ({ ...prev, descriptor: e.target.value }))}
                                />
                            </label>

                            <label className="full">
                                Teacher notes
                                <textarea
                                    value={courseForm.notes}
                                    onChange={(e) => setCourseForm((prev) => ({ ...prev, notes: e.target.value }))}
                                />
                            </label>
                        </div>

                        <div className="teacher-actions">
                            <button type="button" className="teacher-btn primary">Save Course</button>
                            <button type="button" className="teacher-btn">Save Draft</button>
                            <button type="button" className="teacher-btn">Preview</button>
                        </div>
                    </article>
                )}

                {activeTab === 'modules' && (
                    <article className="teacher-panel">
                        <h3>Modules & Lessons</h3>
                        <p className="teacher-muted">Manage lesson schedule, module structure, and lesson types.</p>

                        <div className="teacher-builder-row">
                            <input
                                placeholder="New module title"
                                value={newModuleTitle}
                                onChange={(e) => setNewModuleTitle(e.target.value)}
                            />
                            <button type="button" className="teacher-mini-btn" onClick={addModule}>+ Module</button>
                        </div>

                        <div className="teacher-builder-row">
                            <select
                                aria-label="Select module"
                                value={selectedModuleId}
                                onChange={(e) => setSelectedModuleId(e.target.value)}
                            >
                                {modules.map((module) => (
                                    <option key={module.id} value={module.id}>{module.title}</option>
                                ))}
                            </select>
                            <input
                                placeholder="New lesson title"
                                value={newLessonTitle}
                                onChange={(e) => setNewLessonTitle(e.target.value)}
                            />
                            <select
                                aria-label="Select lesson type"
                                value={newLessonType}
                                onChange={(e) => setNewLessonType(e.target.value as typeof newLessonType)}
                            >
                                <option value="video">video</option>
                                <option value="text">text</option>
                                <option value="quiz">quiz</option>
                                <option value="assignment">assignment</option>
                            </select>
                            <button type="button" className="teacher-mini-btn" onClick={addLessonToSelectedModule}>+ Lesson</button>
                        </div>

                        <div className="teacher-list">
                            {modules.map((module) => (
                                <section key={module.id} className="teacher-item">
                                    <header>
                                        <strong>{module.title}</strong>
                                        <button
                                            type="button"
                                            className="teacher-mini-btn"
                                            onClick={() => {
                                                const lessonNumber = module.lessons.length + 1
                                                setModules((prev) =>
                                                    prev.map((m) =>
                                                        m.id === module.id
                                                            ? {
                                                                ...m,
                                                                lessons: [
                                                                    ...m.lessons,
                                                                    {
                                                                        id: `${m.id}-l${lessonNumber}`,
                                                                        title: `New lesson ${lessonNumber}`,
                                                                        type: 'text',
                                                                    },
                                                                ],
                                                            }
                                                            : m,
                                                    ),
                                                )
                                            }}
                                        >
                                            + Lesson
                                        </button>
                                    </header>

                                    <ul>
                                        {module.lessons.map((lesson) => (
                                            <li key={lesson.id}>
                                                <span>{lesson.title}</span>
                                                <small>{lesson.type}</small>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            ))}
                        </div>
                    </article>
                )}

                {activeTab === 'assignments' && (
                    <article className="teacher-panel">
                        <h3>Assignments</h3>
                        <p className="teacher-muted">Create tasks, set deadlines, and publish drafts.</p>
                        <div className="teacher-table">
                            {assignments.map((assignment) => (
                                <div key={assignment.id} className="teacher-row">
                                    <span>{assignment.title}</span>
                                    <span>{assignment.course}</span>
                                    <span>{assignment.dueDate}</span>
                                    <span className={assignment.status === 'published' ? 'pill green' : 'pill'}>{assignment.status}</span>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            className="teacher-btn"
                            onClick={() => {
                                setAssignments((prev) => [
                                    ...prev,
                                    {
                                        id: `a${prev.length + 1}`,
                                        title: `New assignment ${prev.length + 1}`,
                                        dueDate: '2026-04-20',
                                        course: 'Figma Basic',
                                        status: 'draft',
                                    },
                                ])
                            }}
                        >
                            + New Assignment
                        </button>
                    </article>
                )}

                {activeTab === 'schedule' && (
                    <article className="teacher-panel">
                        <h3>Schedule</h3>
                        <p className="teacher-muted">Plan class and individual lessons.</p>
                        <div className="teacher-table">
                            {schedule.map((item) => (
                                <div key={item.id} className="teacher-row">
                                    <span>{item.date}</span>
                                    <span>{item.time}</span>
                                    <span>{item.title}</span>
                                    <span className={item.type === 'class' ? 'pill green' : 'pill'}>{item.type}</span>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            className="teacher-btn"
                            onClick={() => {
                                setSchedule((prev) => [
                                    ...prev,
                                    {
                                        id: `s${prev.length + 1}`,
                                        date: '2026-04-05',
                                        time: '12:00',
                                        title: `Class session ${prev.length + 1}`,
                                        type: 'class',
                                    },
                                ])
                            }}
                        >
                            + Add Schedule Item
                        </button>
                    </article>
                )}

                {activeTab === 'classes' && (
                    <article className="teacher-panel">
                        <h3>Classes & Journal</h3>
                        <p className="teacher-muted">Track class metrics, institution context, attendance and grades.</p>
                        <div className="teacher-table">
                            {classes.map((row, index) => (
                                <div key={row.id} className="teacher-row">
                                    <span>{row.className}</span>
                                    <span>{row.institution}</span>
                                    <label className="inline-edit">
                                        Score:
                                        <input
                                            type="number"
                                            min={0}
                                            max={100}
                                            value={row.averageScore}
                                            onChange={(e) => {
                                                const score = Number(e.target.value)
                                                setClasses((prev) => prev.map((c, i) => (i === index ? { ...c, averageScore: score } : c)))
                                            }}
                                        />
                                    </label>
                                    <label className="inline-edit">
                                        Attendance:
                                        <input
                                            type="number"
                                            min={0}
                                            max={100}
                                            value={row.attendance}
                                            onChange={(e) => {
                                                const attendance = Number(e.target.value)
                                                setClasses((prev) => prev.map((c, i) => (i === index ? { ...c, attendance } : c)))
                                            }}
                                        />
                                    </label>
                                </div>
                            ))}
                        </div>
                    </article>
                )}

                {activeTab === 'chat' && (
                    <article className="teacher-panel">
                        <h3>Chat with Parents and Students</h3>
                        <p className="teacher-muted">Keep communication in one place.</p>
                        <div className="teacher-list">
                            {threads.map((thread) => (
                                <section key={thread.id} className="teacher-item">
                                    <header>
                                        <strong>{thread.with}</strong>
                                        <span className={thread.role === 'parent' ? 'pill green' : 'pill'}>{thread.role}</span>
                                    </header>
                                    <p>{thread.lastMessage}</p>
                                    <button type="button" className="teacher-mini-btn">Open chat</button>
                                </section>
                            ))}
                        </div>
                        <form
                            className="teacher-chat-composer"
                            onSubmit={(e) => {
                                e.preventDefault()
                                if (!newChatMessage.trim()) return
                                setThreads((prev) => [
                                    {
                                        id: `t${prev.length + 1}`,
                                        with: 'New thread',
                                        role: 'student',
                                        lastMessage: newChatMessage.trim(),
                                    },
                                    ...prev,
                                ])
                                setNewChatMessage('')
                            }}
                        >
                            <input
                                placeholder="Quick message to student/parent"
                                value={newChatMessage}
                                onChange={(e) => setNewChatMessage(e.target.value)}
                            />
                            <button type="submit" className="teacher-btn primary">Send</button>
                        </form>
                    </article>
                )}
            </section>
        </TeacherShellLayout>
    )
}
