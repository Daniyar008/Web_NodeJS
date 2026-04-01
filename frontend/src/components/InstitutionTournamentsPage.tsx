import type { Language } from '../i18n/translations'
import { InstitutionShellLayout } from './InstitutionShellLayout'

type Props = {
    language: Language
    onLanguageChange: (lang: Language) => void
}

export function InstitutionTournamentsPage({ language, onLanguageChange }: Props) {
    return (
        <InstitutionShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Турниры и соревнования"
            subtitle="Внутренние турниры учреждения и участие в глобальных соревнованиях"
            activePage="i-tournaments"
        >
            <section className="inst-grid-2">
                <article className="inst-card tall">
                    <h3>Активные турниры</h3>
                    <ul className="inst-list">
                        <li>Математическая битва 8-х классов (до 20.04)</li>
                        <li>Марафон посещаемости (до 30.04)</li>
                        <li>Олимпиадный отбор по физике (до 12.04)</li>
                    </ul>
                </article>

                <article className="inst-card tall">
                    <h3>Рейтинг учреждения</h3>
                    <div className="inst-table-like">
                        <div className="inst-row"><strong>Топ класс</strong><span>11А</span><span>2 420 XP</span></div>
                        <div className="inst-row"><strong>Топ учитель</strong><span>Алия Сейтказина</span><span>4.8 рейтинг</span></div>
                        <div className="inst-row"><strong>Топ ученик</strong><span>Дамир М.</span><span>630 XP</span></div>
                    </div>
                </article>
            </section>
        </InstitutionShellLayout>
    )
}
