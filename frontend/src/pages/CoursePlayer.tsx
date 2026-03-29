import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { studentApi, type CourseProgress } from '../features/student/studentApi.ts'

export function CoursePlayer() {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()
  const [data, setData] = useState<CourseProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!courseId) return
    try {
      setLoading(true)
      const progress = await studentApi.progress(courseId)
      setData(progress)
    } catch {
      setError('Не удалось загрузить курс')
    } finally {
      setLoading(false)
    }
  }, [courseId])

  useEffect(() => { void load() }, [load])

  const completeLesson = async (lessonId: string) => {
    if (!courseId) return
    await studentApi.completeLesson(courseId, lessonId)
    await load()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[color:var(--brand)] border-t-transparent" />
      </div>
    )
  }

  if (error || !data) {
    return <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error ?? 'Ошибка'}</div>
  }

  const completedSet = new Set(data.progress.filter((p) => p.completed).map((p) => p.lessonId))

  return (
    <section className="space-y-6">
      <div className="reveal rounded-3xl border border-[color:var(--line)] bg-white/85 p-6 shadow-sm sm:p-8">
        <button onClick={() => navigate('/dashboard/student')} className="text-xs text-[color:var(--brand)] hover:underline">
          ← К дашборду
        </button>
        <h1 className="heading-font mt-2 text-3xl font-bold">{data.course.title}</h1>
        <p className="mt-2 text-sm text-[color:var(--ink-700)]">
          Прогресс: {data.completedLessons}/{data.totalLessons} ({data.percent}%)
        </p>
        <div className="mt-2 h-2 rounded-full bg-gray-100">
          <div className="h-2 rounded-full bg-[color:var(--brand)]" style={{ width: `${data.percent}%` }} />
        </div>
      </div>

      {data.course.modules.map((module) => (
        <div key={module.id} className="reveal rounded-2xl border border-[color:var(--line)] bg-white/80 p-5 shadow-sm">
          <h2 className="heading-font text-lg font-bold">{module.title}</h2>
          <ul className="mt-3 space-y-2">
            {module.lessons.map((lesson) => {
              const done = completedSet.has(lesson.id)
              return (
                <li key={lesson.id} className="flex items-center justify-between gap-3 rounded-xl border border-[color:var(--line)] p-3">
                  <div>
                    <p className="text-sm font-semibold">{lesson.title}</p>
                    <p className="text-xs text-[color:var(--ink-700)]">{lesson.type}</p>
                  </div>
                  <button
                    disabled={done}
                    onClick={() => { void completeLesson(lesson.id) }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      done
                        ? 'bg-emerald-100 text-emerald-800 cursor-default'
                        : 'bg-[color:var(--brand)] text-white hover:opacity-90'
                    }`}
                  >
                    {done ? 'Выполнено' : 'Отметить выполненным'}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </section>
  )
}
