import { useMemo, useState } from 'react'
import type { Language } from '../i18n/translations'
import { InstitutionShellLayout } from './InstitutionShellLayout'

type Props = {
  language: Language
  onLanguageChange: (lang: Language) => void
}

type CourseModerationItem = {
  id: string
  title: string
  author: string
  type: 'mandatory' | 'elective' | 'prep' | 'teacher-upskill'
  status: 'pending' | 'approved' | 'rejected'
}

const INITIAL_MODERATION: CourseModerationItem[] = [
  { id: 'c1', title: 'Алгебра: углубленный курс', author: 'А. Сейтказина', type: 'mandatory', status: 'pending' },
  { id: 'c2', title: 'Робототехника: старт', author: 'И. Тулегенов', type: 'elective', status: 'pending' },
  { id: 'c3', title: 'Подготовка к ЕНТ по физике', author: 'Р. Байтенов', type: 'prep', status: 'approved' },
]

const TYPE_LABEL = {
  mandatory: 'Обязательный',
  elective: 'Элективный',
  prep: 'Подготовительный',
  'teacher-upskill': 'Повышение квалификации',
} as const

export function InstitutionCoursesPage({ language, onLanguageChange }: Props) {
  const [moderation, setModeration] = useState<CourseModerationItem[]>(INITIAL_MODERATION)
  const [assignForm, setAssignForm] = useState({ className: '', course: '' })
  const [assignments, setAssignments] = useState<Array<{ id: string; className: string; course: string }>>([])

  const pendingCount = useMemo(() => moderation.filter((m) => m.status === 'pending').length, [moderation])

  function setStatus(id: string, status: CourseModerationItem['status']) {
    setModeration((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)))
  }

  function assignCourse() {
    if (!assignForm.className.trim() || !assignForm.course.trim()) return
    setAssignments((prev) => [
      { id: `a${Date.now()}`, className: assignForm.className.trim(), course: assignForm.course.trim() },
      ...prev,
    ])
    setAssignForm({ className: '', course: '' })
  }

  return (
    <InstitutionShellLayout
      language={language}
      onLanguageChange={onLanguageChange}
      title="Курсы и контент"
      subtitle="Институциональные курсы, модерация и массовое назначение классам"
      activePage="i-courses"
    >
      <section className="inst-grid-3">
        <article className="inst-card"><p className="inst-card-label">Всего курсов</p><p className="inst-card-value">126</p><p className="inst-card-note">Из них 38 обязательных</p></article>
        <article className="inst-card"><p className="inst-card-label">На модерации</p><p className="inst-card-value">{pendingCount}</p><p className="inst-card-note">Ожидают решения методиста</p></article>
        <article className="inst-card"><p className="inst-card-label">Назначений классам</p><p className="inst-card-value">312</p><p className="inst-card-note">За текущий семестр</p></article>
      </section>

      <section className="inst-grid-2">
        <article className="inst-card tall">
          <h3>Типы курсов</h3>
          <ul className="inst-list">
            <li>Обязательные (алгебра, физика, язык)</li>
            <li>Элективные (робототехника, программирование)</li>
            <li>Подготовительные (ЕНТ/ЕГЭ)</li>
            <li>Повышение квалификации для учителей</li>
          </ul>
        </article>

        <article className="inst-card tall">
          <h3>Поток модерации</h3>
          <div className="inst-table-like">
            {moderation.map((item) => (
              <div key={item.id} className="inst-row">
                <strong>{item.title}</strong>
                <span>Автор: {item.author}</span>
                <span>{TYPE_LABEL[item.type]}</span>
                <div className="inst-toolbar">
                  <span className={item.status === 'approved' ? 'inst-chip ok' : item.status === 'rejected' ? 'inst-chip danger' : 'inst-chip'}>
                    {item.status === 'pending' ? 'На проверке' : item.status === 'approved' ? 'Одобрен' : 'Отклонен'}
                  </span>
                  {item.status === 'pending' && (
                    <>
                      <button type="button" className="inst-btn ghost" onClick={() => setStatus(item.id, 'approved')}>Одобрить</button>
                      <button type="button" className="inst-btn ghost" onClick={() => setStatus(item.id, 'rejected')}>Отклонить</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="inst-grid-2">
        <article className="inst-card">
          <h3>Массовое назначение курса</h3>
          <div className="inst-form-grid">
            <input className="inst-input" placeholder="Класс / группа (напр. 8А)" value={assignForm.className} onChange={(e) => setAssignForm((p) => ({ ...p, className: e.target.value }))} />
            <input className="inst-input" placeholder="Название курса" value={assignForm.course} onChange={(e) => setAssignForm((p) => ({ ...p, course: e.target.value }))} />
          </div>
          <div className="inst-toolbar">
            <button type="button" className="inst-btn" onClick={assignCourse}>Назначить</button>
          </div>
        </article>

        <article className="inst-card">
          <h3>Последние назначения</h3>
          <div className="inst-table-like">
            {assignments.length === 0 && <p className="inst-card-note">Пока нет новых назначений</p>}
            {assignments.map((a) => (
              <div key={a.id} className="inst-row">
                <strong>{a.course}</strong>
                <span>Назначен: {a.className}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </InstitutionShellLayout>
  )
}
