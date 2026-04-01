import type { Language } from '../i18n/translations'
import { InstitutionShellLayout } from './InstitutionShellLayout'

type Props = {
    language: Language
    onLanguageChange: (lang: Language) => void
}

export function InstitutionCommunicationsPage({ language, onLanguageChange }: Props) {
    return (
        <InstitutionShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Коммуникации"
            subtitle="Чаты, массовые уведомления и онлайн-собрания"
            activePage="i-communications"
        >
            <section className="inst-grid-2">
                <article className="inst-card tall">
                    <h3>Массовые уведомления</h3>
                    <ul className="inst-list">
                        <li>Рассылка по классам, параллелям и ролям</li>
                        <li>Срочные push/email/telegram уведомления</li>
                        <li>Авто-дайджесты по понедельникам в 08:00</li>
                        <li>История отправок и статус доставки</li>
                    </ul>
                </article>

                <article className="inst-card tall">
                    <h3>Правила коммуникаций</h3>
                    <ul className="inst-list">
                        <li>Чаты родители-учителя: 08:00-20:00</li>
                        <li>Групповые чаты по каждому классу</li>
                        <li>Модерация сообщений по жалобам</li>
                        <li>Экспорт переписок для служебных проверок</li>
                    </ul>
                </article>
            </section>
        </InstitutionShellLayout>
    )
}
