import type { Language } from '../i18n/translations'
import { InstitutionShellLayout } from './InstitutionShellLayout'

type Props = {
  language: Language
  onLanguageChange: (lang: Language) => void
}

export function InstitutionSettingsPage({ language, onLanguageChange }: Props) {
  return (
    <InstitutionShellLayout
      language={language}
      onLanguageChange={onLanguageChange}
      title="Настройки учреждения"
      subtitle="Календарь, оценивание, права доступа и конфигурация"
      activePage="i-settings"
    >
      <section className="inst-grid-2">
        <article className="inst-card tall">
          <h3>Учебный календарь</h3>
          <ul className="inst-list">
            <li>4 четверти / 2 семестра (переключаемо)</li>
            <li>Каникулы, праздники, экзаменационные окна</li>
            <li>Авто-напоминания о начале периодов</li>
          </ul>
        </article>

        <article className="inst-card tall">
          <h3>Система оценивания</h3>
          <ul className="inst-list">
            <li>Шкалы: 5, 10, 100-балльная</li>
            <li>Формулы среднего балла по предметам</li>
            <li>Проходные баллы и критерии качества</li>
          </ul>
        </article>
      </section>

      <section className="inst-grid-1">
        <article className="inst-card">
          <h3>Права и безопасность</h3>
          <p className="inst-card-note">Гибкая RBAC-модель: настройка доступа для директора, завучей, методистов, руководителей МО, HR-администраторов и учителей. Доступ к финансовым блокам отделен от академического управления.</p>
        </article>
      </section>
    </InstitutionShellLayout>
  )
}
