import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { courseApi, type Course, type CourseModule, type Lesson, type LessonType } from '../features/course/courseApi.ts'

const lessonTypeLabel: Record<LessonType, string> = {
  TEXT: 'Текст',
  VIDEO: 'Видео',
  QUIZ: 'Тест',
  ASSIGNMENT: 'Задание',
}

const lessonTypeColor: Record<LessonType, string> = {
  TEXT: 'bg-sky-100 text-sky-800',
  VIDEO: 'bg-purple-100 text-purple-800',
  QUIZ: 'bg-amber-100 text-amber-800',
  ASSIGNMENT: 'bg-rose-100 text-rose-800',
}

function LessonEditor({
  lesson,
  onUpdate,
  onDelete,
}: {
  lesson: Lesson
  onUpdate: (id: string, data: Partial<{ title: string; content: string }>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(lesson.title)
  const [content, setContent] = useState(lesson.content ?? '')
  const [saving, setSaving] = useState(false)

  const save = async () => {
    setSaving(true)
    await onUpdate(lesson.id, { title, content })
    setSaving(false)
    setEditing(false)
  }

  return (
    <div className="rounded-xl border border-[color:var(--line)] bg-gray-50 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${lessonTypeColor[lesson.type]}`}>
            {lessonTypeLabel[lesson.type]}
          </span>
          {editing ? (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-lg border border-[color:var(--line)] px-2 py-1 text-sm outline-none focus:border-[color:var(--brand)]"
            />
          ) : (
            <span className="text-sm font-semibold">{lesson.title}</span>
          )}
        </div>
        <div className="flex gap-1.5">
          {editing ? (
            <>
              <button
                onClick={() => { void save() }}
                disabled={saving}
                className="rounded-lg bg-[color:var(--brand)] px-3 py-1 text-xs font-semibold text-white disabled:opacity-50"
              >
                {saving ? '…' : 'Сохранить'}
              </button>
              <button onClick={() => setEditing(false)} className="rounded-lg border border-[color:var(--line)] px-3 py-1 text-xs">
                Отмена
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="rounded-lg border border-[color:var(--line)] px-3 py-1 text-xs hover:bg-gray-100"
              >
                ✏️ Редактировать
              </button>
              <button
                onClick={() => { void onDelete(lesson.id) }}
                className="rounded-lg border border-[color:var(--line)] px-3 py-1 text-xs text-red-600 hover:bg-red-50"
              >
                ✕
              </button>
            </>
          )}
        </div>
      </div>
      {editing && (lesson.type === 'TEXT' || lesson.type === 'ASSIGNMENT') && (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          placeholder="Содержание урока…"
          className="mt-3 w-full rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none focus:border-[color:var(--brand)]"
        />
      )}
      {editing && lesson.type === 'VIDEO' && (
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="URL видео"
          className="mt-3 w-full rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none focus:border-[color:var(--brand)]"
        />
      )}
    </div>
  )
}

function ModuleCard({
  mod,
  onAddLesson,
  onUpdateLesson,
  onDeleteLesson,
  onDeleteModule,
}: {
  mod: CourseModule
  onAddLesson: (moduleId: string, title: string, type: LessonType) => Promise<void>
  onUpdateLesson: (id: string, data: Partial<{ title: string; content: string }>) => Promise<void>
  onDeleteLesson: (id: string) => Promise<void>
  onDeleteModule: (id: string) => Promise<void>
}) {
  const [newTitle, setNewTitle] = useState('')
  const [newType, setNewType] = useState<LessonType>('TEXT')
  const [adding, setAdding] = useState(false)
  const [showAdd, setShowAdd] = useState(false)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    setAdding(true)
    await onAddLesson(mod.id, newTitle, newType)
    setNewTitle('')
    setShowAdd(false)
    setAdding(false)
  }

  return (
    <div className="reveal rounded-2xl border border-[color:var(--line)] bg-white/80 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h3 className="heading-font font-bold">{mod.title}</h3>
        <button
          onClick={() => { void onDeleteModule(mod.id) }}
          className="text-xs text-red-500 hover:underline"
        >
          Удалить модуль
        </button>
      </div>

      <div className="mt-3 space-y-2">
        {mod.lessons.map((lesson) => (
          <LessonEditor
            key={lesson.id}
            lesson={lesson}
            onUpdate={onUpdateLesson}
            onDelete={onDeleteLesson}
          />
        ))}
      </div>

      {showAdd ? (
        <form onSubmit={(e) => { void handleAdd(e) }} className="mt-3 flex flex-wrap gap-2">
          <input
            required
            placeholder="Название урока"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none focus:border-[color:var(--brand)]"
          />
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value as LessonType)}
            className="rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm outline-none"
          >
            {(Object.keys(lessonTypeLabel) as LessonType[]).map((t) => (
              <option key={t} value={t}>{lessonTypeLabel[t]}</option>
            ))}
          </select>
          <button
            type="submit"
            disabled={adding}
            className="rounded-xl bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {adding ? '…' : 'Добавить'}
          </button>
          <button type="button" onClick={() => setShowAdd(false)} className="rounded-xl border border-[color:var(--line)] px-3 py-2 text-sm">
            Отмена
          </button>
        </form>
      ) : (
        <button
          onClick={() => setShowAdd(true)}
          className="mt-3 w-full rounded-xl border border-dashed border-[color:var(--line)] py-2 text-sm text-[color:var(--ink-700)] transition hover:border-[color:var(--brand)] hover:text-[color:var(--brand)]"
        >
          + Добавить урок
        </button>
      )}
    </div>
  )
}

export function CourseEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newModuleTitle, setNewModuleTitle] = useState('')
  const [addingModule, setAddingModule] = useState(false)

  const load = useCallback(async () => {
    if (!id) return
    try {
      const data = await courseApi.get(id)
      setCourse(data)
    } catch {
      setError('Курс не найден')
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { void load() }, [load])

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id || !newModuleTitle.trim()) return
    setAddingModule(true)
    const mod = await courseApi.createModule(id, newModuleTitle)
    setCourse((prev) => prev ? { ...prev, modules: [...prev.modules, { ...mod, lessons: [] }] } : prev)
    setNewModuleTitle('')
    setAddingModule(false)
  }

  const handleAddLesson = async (moduleId: string, title: string, type: LessonType) => {
    const lesson = await courseApi.createLesson(moduleId, { title, type })
    setCourse((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        modules: prev.modules.map((m) =>
          m.id === moduleId ? { ...m, lessons: [...m.lessons, lesson] } : m
        ),
      }
    })
  }

  const handleUpdateLesson = async (lessonId: string, data: Partial<{ title: string; content: string }>) => {
    const updated = await courseApi.updateLesson(lessonId, data)
    setCourse((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        modules: prev.modules.map((m) => ({
          ...m,
          lessons: m.lessons.map((l) => l.id === lessonId ? { ...l, ...updated } : l),
        })),
      }
    })
  }

  const handleDeleteLesson = async (lessonId: string) => {
    await courseApi.deleteLesson(lessonId)
    setCourse((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        modules: prev.modules.map((m) => ({
          ...m,
          lessons: m.lessons.filter((l) => l.id !== lessonId),
        })),
      }
    })
  }

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Удалить модуль и все его уроки?')) return
    await courseApi.deleteModule(moduleId)
    setCourse((prev) => prev ? { ...prev, modules: prev.modules.filter((m) => m.id !== moduleId) } : prev)
  }

  const handlePublish = async () => {
    if (!id) return
    const updated = await courseApi.update(id, { status: 'PUBLISHED' })
    setCourse((prev) => prev ? { ...prev, status: updated.status } : prev)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[color:var(--brand)] border-t-transparent" />
      </div>
    )
  }

  if (error || !course) {
    return <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error ?? 'Ошибка'}</div>
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="reveal rounded-3xl border border-[color:var(--line)] bg-white/85 p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <button onClick={() => navigate('/dashboard/teacher')} className="mb-2 text-xs text-[color:var(--brand)] hover:underline">
              ← К дашборду
            </button>
            <h1 className="heading-font text-2xl font-bold sm:text-3xl">{course.title}</h1>
            {course.description && (
              <p className="mt-1 text-sm text-[color:var(--ink-700)]">{course.description}</p>
            )}
          </div>
          {course.status !== 'PUBLISHED' && (
            <button
              onClick={() => { void handlePublish() }}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              Опубликовать
            </button>
          )}
        </div>
      </div>

      {/* Modules */}
      <div className="space-y-4">
        {course.modules.map((mod) => (
          <ModuleCard
            key={mod.id}
            mod={mod}
            onAddLesson={handleAddLesson}
            onUpdateLesson={handleUpdateLesson}
            onDeleteLesson={handleDeleteLesson}
            onDeleteModule={handleDeleteModule}
          />
        ))}

        {/* Add module form */}
        <form onSubmit={(e) => { void handleAddModule(e) }} className="reveal flex gap-2">
          <input
            required
            placeholder="Название нового модуля"
            value={newModuleTitle}
            onChange={(e) => setNewModuleTitle(e.target.value)}
            className="flex-1 rounded-xl border border-[color:var(--line)] px-4 py-2.5 text-sm outline-none focus:border-[color:var(--brand)]"
          />
          <button
            type="submit"
            disabled={addingModule}
            className="rounded-xl bg-[color:var(--brand)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
          >
            {addingModule ? '…' : '+ Модуль'}
          </button>
        </form>
      </div>
    </section>
  )
}
