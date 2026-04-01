import type { Language } from '../i18n/translations'
import { InstitutionShellLayout } from './InstitutionShellLayout'

type Props = {
    language: Language
    onLanguageChange: (lang: Language) => void
}

export function InstitutionFinancePage({ language, onLanguageChange }: Props) {
    return (
        <InstitutionShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Финансы и подписка"
            subtitle="Тариф, лимиты, транзакции и закупка курсов"
            activePage="i-finance"
        >
            <section className="inst-grid-3">
                <article className="inst-card"><p className="inst-card-label">Текущий тариф</p><p className="inst-card-value">Профессиональный</p><p className="inst-card-note">9900₸ / мес</p></article>
                <article className="inst-card"><p className="inst-card-label">Лимит учеников</p><p className="inst-card-value">300</p><p className="inst-card-note">Использовано: 284</p></article>
                <article className="inst-card"><p className="inst-card-label">Следующее списание</p><p className="inst-card-value">14 апреля</p><p className="inst-card-note">Автопродление активно</p></article>
            </section>

            <section className="inst-grid-2">
                <article className="inst-card tall">
                    <h3>Платежная история</h3>
                    <div className="inst-table-like">
                        <div className="inst-row"><strong>14.03.2026</strong><span>Подписка Pro</span><span>- 9 900₸</span></div>
                        <div className="inst-row"><strong>02.03.2026</strong><span>Пакет курсов ЕНТ</span><span>- 45 000₸</span></div>
                        <div className="inst-row"><strong>14.02.2026</strong><span>Подписка Pro</span><span>- 9 900₸</span></div>
                    </div>
                </article>

                <article className="inst-card tall">
                    <h3>Контроль расходов</h3>
                    <ul className="inst-list">
                        <li>Бюджет закупок курсов: 500 000₸</li>
                        <li>Израсходовано: 312 000₸</li>
                        <li>Остаток: 188 000₸</li>
                        <li>8 закупок требуют согласования директора</li>
                    </ul>
                </article>
            </section>
        </InstitutionShellLayout>
    )
}
