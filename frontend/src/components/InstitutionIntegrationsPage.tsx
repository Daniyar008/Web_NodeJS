import type { Language } from '../i18n/translations'
import { InstitutionShellLayout } from './InstitutionShellLayout'

type Props = {
    language: Language
    onLanguageChange: (lang: Language) => void
}

export function InstitutionIntegrationsPage({ language, onLanguageChange }: Props) {
    return (
        <InstitutionShellLayout
            language={language}
            onLanguageChange={onLanguageChange}
            title="Интеграции и экспорт"
            subtitle="Подключение внешних сервисов и формирование отчетов"
            activePage="i-integrations"
        >
            <section className="inst-grid-2">
                <article className="inst-card tall">
                    <h3>Подключенные сервисы</h3>
                    <div className="inst-table-like">
                        <div className="inst-row"><strong>Zoom</strong><span>Включено</span><span>Для родительских собраний</span></div>
                        <div className="inst-row"><strong>Google Drive</strong><span>Включено</span><span>Хранение материалов</span></div>
                        <div className="inst-row"><strong>Stripe</strong><span>Включено</span><span>Платежи и подписка</span></div>
                        <div className="inst-row"><strong>Госреестр</strong><span>В разработке</span><span>Синхронизация контингентов</span></div>
                    </div>
                </article>

                <article className="inst-card tall">
                    <h3>Экспорт отчетов</h3>
                    <ul className="inst-list">
                        <li>Успеваемость: XLSX, PDF, CSV</li>
                        <li>Посещаемость: XLSX, PDF</li>
                        <li>Нагрузка учителей: XLSX</li>
                        <li>Финансы: XLSX, CSV</li>
                        <li>API-выгрузка: JSON (корпоративный тариф)</li>
                    </ul>
                </article>
            </section>
        </InstitutionShellLayout>
    )
}
