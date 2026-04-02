import { X, CheckCircle } from 'lucide-react'

type OnboardingStep = {
    icon: string
    title: string
    desc: string
}

const ONBOARDING_STEPS: Record<string, OnboardingStep[]> = {
    student: [
        { icon: '📚', title: 'Выбирайте курсы', desc: 'Найдите курсы, которые вам интересны, и начните обучение' },
        { icon: '📊', title: 'Отслеживайте прогресс', desc: 'Смотрите ваш прогресс, уровень и достижения' },
        { icon: '🏆', title: 'Получайте награды', desc: 'Завершайте курсы и получайте сертификаты' },
        { icon: '💬', title: 'Общайтесь', desc: 'Задавайте вопросы учителям в чате' },
    ],
    teacher: [
        { icon: '📖', title: 'Создавайте курсы', desc: 'Используйте конструктор для создания структурированных курсов' },
        { icon: '👥', title: 'Управляйте студентами', desc: 'Смотрите индивидуальный прогресс каждого студента' },
        { icon: '📊', title: 'Анализируйте результаты', desc: 'Используйте отчёты и аналитику для рефлексии' },
        { icon: '💰', title: 'Зарабатывайте', desc: 'Получайте доход от платных курсов' },
    ],
    parent: [
        { icon: '📱', title: 'Отслеживайте прогресс', desc: 'Смотрите успехи вашего ребёнка в реальном времени' },
        { icon: '📞', title: 'Общайтесь с учителями', desc: 'Получайте обновления и обсуждайте прогресс напрямую' },
        { icon: '🎓', title: 'Поддерживайте обучение', desc: 'Получайте рекомендации по поддержке обучения' },
    ],
    institution: [
        { icon: '🏫', title: 'Управляйте учреждением', desc: 'Администрируйте учителей, студентов и курсы' },
        { icon: '📈', title: 'Командный аналитический дашборд', desc: 'Смотрите статистику по всему учреждению' },
        { icon: '⚙️', title: 'Настройки и интеграции', desc: 'Обновляйте информацию и подключайте инструменты' },
    ],
}

export function OnboardingWelcomeModal({ role, onClose }: { role: 'student' | 'teacher' | 'parent' | 'institution'; onClose: () => void }) {
    const steps = ONBOARDING_STEPS[role] || []

    return (
        <div className="obm-overlay" onClick={onClose}>
            <div className="obm-modal" onClick={(e) => e.stopPropagation()}>
                <button type="button" className="obm-close" onClick={onClose}>
                    <X size={20} />
                </button>

                <div className="obm-header">
                    <h1 className="obm-title">Добро пожаловать в EduFuture! 👋</h1>
                    <p className="obm-sub">Вот что вы можете сделать с нашей платформой</p>
                </div>

                <div className="obm-steps">
                    {steps.map((step, i) => (
                        <div key={i} className="obm-step">
                            <div className="obm-step-icon">{step.icon}</div>
                            <div className="obm-step-content">
                                <h3 className="obm-step-title">{step.title}</h3>
                                <p className="obm-step-desc">{step.desc}</p>
                            </div>
                            <CheckCircle size={16} color="#10b981" />
                        </div>
                    ))}
                </div>

                <button type="button" className="obm-btn primary" onClick={onClose}>
                    Начнём! →
                </button>
            </div>
        </div>
    )
}
